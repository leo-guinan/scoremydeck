import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  SCORING_PROMPT,
  scoresToPortfolio,
  formatPortfolioChart,
  type DeckAnalysis,
} from "@/lib/archetypes";

const GEMINI_KEY = process.env.GEMINI_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const textInput = formData.get("text") as string | null;
    const buyerNote = formData.get("note") as string | null;
    const targetWallet = formData.get("target") as string | null;

    if (!file && !textInput) {
      return NextResponse.json(
        { error: "No file or text provided" },
        { status: 400 }
      );
    }

    let deckContent: string = "";
    let base64Data: string | null = null;
    let mimeType: string = "text/plain";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      mimeType = file.type || "application/pdf";

      if (mimeType === "application/pdf") {
        base64Data = buffer.toString("base64");
      } else {
        deckContent = buffer.toString("utf-8");
      }
    } else if (textInput) {
      deckContent = textInput;
    }

    // Call Gemini with archetype scoring prompt
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [
      { text: SCORING_PROMPT + "\n\nAnalyze this pitch deck:" },
    ];

    if (base64Data) {
      parts.push({
        inlineData: { mimeType: "application/pdf", data: base64Data },
      });
    } else {
      parts.push({ text: deckContent.slice(0, 50000) }); // cap at 50k chars
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: responseText },
        { status: 500 }
      );
    }

    const rawScores = JSON.parse(jsonMatch[0]);

    // Convert to portfolio distribution
    const archetypeScores = scoresToPortfolio(rawScores.archetypes);

    // Build portfolio weights as percentages
    const portfolio: Record<string, number> = {};
    for (const a of archetypeScores) {
      portfolio[a.token] = Math.round(a.weight * 100);
    }

    // Generate analysis ID
    const id =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    const analysis: DeckAnalysis = {
      id,
      timestamp: new Date().toISOString(),
      source: file?.name || "text-input",
      overallScore: rawScores.overall_score,
      verdict: rawScores.verdict,
      archetypes: archetypeScores,
      portfolio,
      investorMatches: rawScores.investor_matches || [],
      strengths: rawScores.strengths || [],
      weaknesses: rawScores.weaknesses || [],
    };

    // Save submission
    try {
      const dataDir = join(process.cwd(), "data", "archetype-scores");
      await mkdir(dataDir, { recursive: true });
      await writeFile(
        join(dataDir, `${id}.json`),
        JSON.stringify(
          {
            ...analysis,
            buyerNote,
            targetWallet,
            portfolioChart: formatPortfolioChart(archetypeScores),
          },
          null,
          2
        )
      );
    } catch {
      // Don't fail on read-only fs (Vercel)
    }

    return NextResponse.json({
      ...analysis,
      portfolioChart: formatPortfolioChart(archetypeScores),
      deliveryReady: !!targetWallet,
      buyerNote: buyerNote || null,
      targetWallet: targetWallet || null,
    });
  } catch (err: unknown) {
    console.error("Archetype score error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
