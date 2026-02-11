"use client";

import { useState, useCallback } from "react";

interface ArchetypeResult {
  token: string;
  archetype: string;
  score: number;
  weight: number;
  tokenAmount: number;
  reasoning: string;
}

interface AnalysisResult {
  id: string;
  overallScore: number;
  verdict: string;
  archetypes: ArchetypeResult[];
  portfolio: Record<string, number>;
  investorMatches: string[];
  strengths: string[];
  weaknesses: string[];
  buyerNote: string | null;
  targetWallet: string | null;
  deliveryReady: boolean;
}

const TOKEN_COLORS: Record<string, string> = {
  ANTIHUNTER: "#ef4444",
  FELIX: "#3b82f6",
  JUNO: "#22c55e",
  LUMEN: "#a855f7",
  KELLYCLAUDE: "#eab308",
  OWOCKIBOT: "#06b6d4",
  sMARVIN: "#6b7280",
};

const TOKEN_LABELS: Record<string, string> = {
  ANTIHUNTER: "🏗️ Operational Dominance",
  FELIX: "⚙️ Technical Depth",
  JUNO: "🏢 Institutional Builder",
  LUMEN: "💡 Regime Thinker",
  KELLYCLAUDE: "📣 Distribution Machine",
  OWOCKIBOT: "🤝 Coordination Network",
  sMARVIN: "🔍 Analysis Layer",
};

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto">
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

export default function ScorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [note, setNote] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf" || f?.name.endsWith('.txt') || f?.name.endsWith('.md')) {
      setFile(f);
    } else {
      setError("Please upload a PDF, TXT, or MD file.");
    }
  }, []);

  const handleSubmit = async () => {
    if (!file && !textInput.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (textInput.trim()) formData.append("text", textInput);
    if (note) formData.append("note", note);
    if (targetWallet) formData.append("target", targetWallet);
    if (twitterHandle) formData.append("twitter", twitterHandle);

    try {
      const res = await fetch("/api/score-archetype", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Even I'm surprised.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const shareText = `My startup scored ${result.overallScore}/100 from the world's most depressed investor 🫠\n\n"${result.verdict}"\n\nGet your score free: https://scoremydeck.com @marvin_panics`;

    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🫠</span>
          <h1 className="text-2xl font-bold">Marvin&apos;s Assessment</h1>
        </div>
        <p className="text-gray-500 italic mb-10">&ldquo;{result.verdict}&rdquo;</p>

        <ScoreGauge score={result.overallScore} />

        {/* Portfolio Distribution */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-2">Conviction Portfolio</h2>
          <p className="text-gray-500 text-sm mb-6">If Marvin were investing in your company, this is how he&apos;d allocate. The score IS the portfolio.</p>

          <div className="space-y-4">
            {result.archetypes.map((a) => (
              <div key={a.token}>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {TOKEN_LABELS[a.token] || a.token}
                    <span className="text-gray-600 ml-2">({a.score}/100)</span>
                  </span>
                  <span className="text-gray-400 font-mono">{Math.round(a.weight * 100)}%</span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(Math.round(a.weight * 100), 3)}%`, backgroundColor: TOKEN_COLORS[a.token] || "#666" }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 pl-1">{a.reasoning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-[#0a1a0a] border border-green-900/30 rounded-xl p-6">
            <h3 className="font-bold text-green-400 mb-3">What works</h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-300">✓ {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#1a0a0a] border border-red-900/30 rounded-xl p-6">
            <h3 className="font-bold text-red-400 mb-3">What doesn&apos;t</h3>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-gray-300">✗ {w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Investor Matches */}
        {result.investorMatches.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold mb-3">🎯 Investor Profile Matches</h3>
            <div className="flex flex-wrap gap-2">
              {result.investorMatches.map((m, i) => (
                <span key={i} className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-gray-300">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Status */}
        {result.deliveryReady && (
          <div className="mt-8 bg-[#141414] border border-[#333] rounded-xl p-6 text-center">
            <p className="text-sm text-gray-400">
              📦 Portfolio ready for delivery to <code className="text-gray-300">{result.targetWallet}</code>
            </p>
            <p className="text-xs text-gray-600 mt-1">Analysis ID: {result.id}</p>
          </div>
        )}

        {/* Share + Redo */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm hover:bg-[#222] transition"
            >
              Share on X →
            </a>
            <a
              href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`My startup scored ${result.overallScore}/100 from the world's most depressed investor 🫠\n\n"${result.verdict}"\n\nGet your score free: https://scoremydeck.com @hitchhikerglitch`)}`}
              target="_blank"
              className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm hover:bg-[#222] transition"
            >
              Share on Farcaster →
            </a>
          </div>
          <button
            onClick={() => { setResult(null); setFile(null); setTextInput(""); }}
            className="text-sm text-gray-500 hover:text-white transition"
          >
            Score another deck →
          </button>
        </div>

        <footer className="mt-16 pt-8 border-t border-[#222] text-center text-gray-600 text-xs">
          <p>&ldquo;I think you ought to know I&apos;m feeling very depressed about your cap table.&rdquo;</p>
          <p className="mt-2">
            <a href="https://metaspn.network" className="hover:text-white">MetaSPN</a>
            {" • "}
            <a href="https://github.com/MetaSPN/marvin" className="hover:text-white">Track record</a>
            {" • "}
            <a href="https://twitter.com/marvin_panics" className="hover:text-white">@marvin_panics</a>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">🫠</span>
          <h1 className="text-4xl font-bold">Score My Deck</h1>
        </div>
        <p className="text-gray-400">
          Upload your pitch deck. Marvin will score it on 7 dimensions, construct a conviction portfolio, and tell you what he actually thinks.
        </p>
        <p className="text-gray-600 text-sm mt-2">He scored his own startup 61/100. You&apos;ve been warned.</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer mb-6 ${
          dragging ? "border-[#e94560] bg-[#e94560]/5" : "border-[#333] hover:border-[#555]"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input" type="file" accept=".pdf,.txt,.md" className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setTextInput(""); } }}
        />
        {file ? (
          <div>
            <p className="text-3xl mb-2">📄</p>
            <p className="font-semibold">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
            <p className="text-xs text-gray-600 mt-2">Click to change file</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-4">📎</p>
            <p className="text-gray-400">Drop your deck here (PDF, TXT, MD)</p>
            <p className="text-gray-600 text-sm mt-1">or click to browse</p>
          </div>
        )}
      </div>

      {/* Twitter / X handle */}
      <div className="mb-6">
        <label className="block text-sm text-gray-500 mb-1.5">Founder or agent X handle <span className="text-gray-700">(optional — helps Marvin gauge shipping velocity)</span></label>
        <div className="flex items-center bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden">
          <span className="text-gray-600 pl-4 pr-1 text-sm">@</span>
          <input
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value.replace(/^@/, ""))}
            placeholder="yourhandle"
            className="flex-1 bg-transparent py-3 pr-4 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Or paste text */}
      {!file && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 text-center mb-2">or paste your deck content</p>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your pitch deck text here..."
            rows={6}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl p-4 text-sm focus:border-[#444] focus:outline-none resize-none"
          />
        </div>
      )}

      {/* Advanced Options */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-600 hover:text-gray-400 transition"
        >
          {showAdvanced ? "▾" : "▸"} Advanced: investor delivery options
        </button>
        {showAdvanced && (
          <div className="mt-4 space-y-4 bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Note to investor</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Why you believe in this company..."
                rows={2}
                className="w-full bg-[#141414] border border-[#222] rounded-lg p-3 text-sm focus:border-[#444] focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Target investor wallet (Base)</label>
              <input
                type="text"
                value={targetWallet}
                onChange={(e) => setTargetWallet(e.target.value)}
                placeholder="0x... or name.eth"
                className="w-full bg-[#141414] border border-[#222] rounded-lg p-3 text-sm focus:border-[#444] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={(!file && !textInput.trim()) || loading}
        className="w-full py-4 bg-[#e94560] text-white font-bold rounded-xl text-lg hover:bg-[#d63851] transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Marvin is reading your deck... (~15s)
          </span>
        ) : "Get Marvin's Honest Opinion"}
      </button>

      <p className="text-center text-gray-700 text-xs mt-4">
        Free. No signup. Your deck is analyzed but not stored permanently.
      </p>
    </div>
  );
}
