import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const { email, score } = await request.json();
    if (!email || !score) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    try {
      const dir = join(process.cwd(), "data", "adin-candidates");
      await mkdir(dir, { recursive: true });
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      await writeFile(
        join(dir, `${id}-email.json`),
        JSON.stringify({ id, email, timestamp: new Date().toISOString(), ...score }, null, 2)
      );
    } catch {
      // Vercel read-only fs fallback
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
