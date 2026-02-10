import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const GEMINI_KEY = process.env.GEMINI_API_KEY!;

const SYSTEM_PROMPT = `You are an expert VC analyst who has reviewed 10,000+ pitch decks. Score this pitch deck on a 0-100 scale with category breakdowns. Be brutally honest. Founders need truth, not encouragement.

Score categories (each 0-10):
- problem
- solution  
- market_size
- traction
- team
- financials
- design_clarity
- investability
- narrative
- ask

Return ONLY valid JSON with this exact structure:
{
  "overall_score": <number 0-100>,
  "category_scores": {
    "problem": <0-10>,
    "solution": <0-10>,
    "market_size": <0-10>,
    "traction": <0-10>,
    "team": <0-10>,
    "financials": <0-10>,
    "design_clarity": <0-10>,
    "investability": <0-10>,
    "narrative": <0-10>,
    "ask": <0-10>
  },
  "strengths": ["3-5 bullet strings"],
  "weaknesses": ["3-5 bullet strings"],
  "vc_feedback": "What a partner at a16z would say in 2 sentences",
  "one_line_verdict": "One line summary"
}`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT + "\n\nAnalyze this pitch deck:" },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
    ]);

    const text = result.response.text();
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const scoreData = JSON.parse(jsonMatch[0]);

    // Save submission
    try {
      const dataDir = join(process.cwd(), "data", "submissions");
      await mkdir(dataDir, { recursive: true });
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      await writeFile(
        join(dataDir, `${id}.json`),
        JSON.stringify({ id, timestamp: new Date().toISOString(), filename: file.name, ...scoreData }, null, 2)
      );

      // Save ADIN candidates
      if (scoreData.overall_score >= 70) {
        const adinDir = join(process.cwd(), "data", "adin-candidates");
        await mkdir(adinDir, { recursive: true });
        await writeFile(
          join(adinDir, `${id}.json`),
          JSON.stringify({ id, timestamp: new Date().toISOString(), filename: file.name, ...scoreData }, null, 2)
        );
      }
    } catch {
      // Don't fail the request if saving fails (e.g. on Vercel read-only fs)
    }

    return NextResponse.json(scoreData);
  } catch (err: unknown) {
    console.error("Score API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
