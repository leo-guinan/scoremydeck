"use client";

import { useState, useCallback } from "react";

interface CategoryScores {
  problem: number;
  solution: number;
  market_size: number;
  traction: number;
  team: number;
  financials: number;
  design_clarity: number;
  investability: number;
  narrative: number;
  ask: number;
}

interface ScoreResult {
  overall_score: number;
  category_scores: CategoryScores;
  strengths: string[];
  weaknesses: string[];
  vc_feedback: string;
  one_line_verdict: string;
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#2ecc71" : score >= 40 ? "#f39c12" : "#e74c3c";
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-56 h-56 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#222" strokeWidth="12" />
        <circle
          cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold" style={{ color }}>{score}</span>
        <span className="text-gray-500 text-sm">out of 100</span>
      </div>
    </div>
  );
}

function CategoryBar({ name, score }: { name: string; score: number }) {
  const color = score >= 7 ? "#2ecc71" : score >= 4 ? "#f39c12" : "#e74c3c";
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm text-gray-400 w-32 text-right">{name}</span>
      <div className="flex-1 bg-[#222] rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-mono w-8" style={{ color }}>{score}</span>
    </div>
  );
}

export default function ScorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState("");
  const [adinEmail, setAdinEmail] = useState("");
  const [adinSubmitted, setAdinSubmitted] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
    else setError("Please upload a PDF file.");
  }, []);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/score", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAdin = async () => {
    if (!adinEmail || !result) return;
    try {
      await fetch("/api/adin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adinEmail, score: result }),
      });
      setAdinSubmitted(true);
    } catch {
      setError("Failed to submit to ADIN");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (result) {
    const categories: [string, keyof CategoryScores][] = [
      ["Problem", "problem"], ["Solution", "solution"], ["Market Size", "market_size"],
      ["Traction", "traction"], ["Team", "team"], ["Financials", "financials"],
      ["Design & Clarity", "design_clarity"], ["Investability", "investability"],
      ["Narrative", "narrative"], ["Ask", "ask"],
    ];

    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-center mb-2">Your Deck Score</h1>
        <p className="text-center text-gray-500 mb-10">{result.one_line_verdict}</p>

        <ScoreGauge score={result.overall_score} />

        <div className="mt-12 bg-[#141414] border border-[#222] rounded-xl p-6">
          <h2 className="font-bold mb-4">Category Breakdown</h2>
          {categories.map(([name, key]) => (
            <CategoryBar key={key} name={name} score={result.category_scores[key]} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
            <h2 className="font-bold mb-3 text-[#2ecc71]">✅ Strengths</h2>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-300">• {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
            <h2 className="font-bold mb-3 text-[#e74c3c]">❌ Weaknesses</h2>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-gray-300">• {w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-[#141414] border border-[#222] rounded-xl p-6">
          <h2 className="font-bold mb-3">💬 What a VC Would Say</h2>
          <p className="text-gray-300 italic">&ldquo;{result.vc_feedback}&rdquo;</p>
        </div>

        {result.overall_score >= 70 && !adinSubmitted && (
          <div className="mt-6 bg-[#0a1f0a] border border-[#2ecc71]/30 rounded-xl p-6 text-center">
            <p className="text-lg font-bold mb-2">🏆 This deck qualifies for ADIN submission</p>
            <p className="text-sm text-gray-400 mb-4">Our AI investor network reviews top-scoring decks. Want us to submit yours?</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email" placeholder="your@email.com" value={adinEmail}
                onChange={(e) => setAdinEmail(e.target.value)}
                className="flex-1 bg-[#141414] border border-[#222] rounded-lg px-4 py-2 text-sm"
              />
              <button onClick={handleAdin} className="bg-[#2ecc71] text-black px-4 py-2 rounded-lg text-sm font-semibold">
                Submit
              </button>
            </div>
          </div>
        )}
        {adinSubmitted && (
          <div className="mt-6 text-center text-[#2ecc71]">✅ Submitted to ADIN! We&apos;ll be in touch.</div>
        )}

        <div className="mt-8 text-center space-x-4">
          <a
            href={`https://twitter.com/intent/tweet?text=My%20pitch%20deck%20scored%20${result.overall_score}/100%20on%20ScoreMyDeck!&url=${encodeURIComponent(shareUrl)}`}
            target="_blank" className="text-sm text-gray-400 hover:text-white"
          >
            Share on X →
          </a>
          <button onClick={() => { setResult(null); setFile(null); }} className="text-sm text-gray-400 hover:text-white">
            Score Another Deck →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Score Your Deck</h1>
      <p className="text-gray-400 mb-10">Upload your pitch deck PDF and get AI-powered analysis in 60 seconds.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-16 transition cursor-pointer ${
          dragging ? "border-[#2ecc71] bg-[#2ecc71]/5" : "border-[#333] hover:border-[#555]"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input" type="file" accept=".pdf" className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }}
        />
        {file ? (
          <div>
            <p className="text-2xl mb-2">📄</p>
            <p className="font-semibold">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-4">📎</p>
            <p className="text-gray-400">Drag & drop your PDF here, or click to browse</p>
          </div>
        )}
      </div>

      {error && <p className="text-[#e74c3c] mt-4 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="mt-8 bg-[#2ecc71] text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#27ae60] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing...
          </span>
        ) : "Analyze My Deck — $29"}
      </button>
      <p className="text-xs text-gray-600 mt-3">Payment integration coming soon. Free during beta.</p>
    </div>
  );
}
