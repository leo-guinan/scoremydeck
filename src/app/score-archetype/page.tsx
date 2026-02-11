"use client";

import { useState } from "react";

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
  ANTIHUNTER: "bg-red-500",
  FELIX: "bg-blue-500",
  JUNO: "bg-green-500",
  LUMEN: "bg-purple-500",
  KELLYCLAUDE: "bg-yellow-500",
  OWOCKIBOT: "bg-cyan-500",
  sMARVIN: "bg-gray-500",
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

export default function ScoreArchetypePage() {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [note, setNote] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (textInput) formData.append("text", textInput);
    if (note) formData.append("note", note);
    if (targetWallet) formData.append("target", targetWallet);

    try {
      const res = await fetch("/api/score-archetype", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to analyze deck");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Score My Deck{" "}
          <span className="text-gray-500 text-lg">by MetaSPN</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Your score is a portfolio. Each dimension maps to a real token.
          <br />
          The analysis <em>is</em> the investment.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 mb-12">
        {/* File upload */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Upload pitch deck (PDF) or paste text below
          </label>
          <input
            type="file"
            accept=".pdf,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-800 file:text-white hover:file:bg-gray-700"
          />
        </div>

        {!file && (
          <div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or paste your pitch deck text here..."
              rows={6}
              className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
        )}

        {/* Buyer note (premium feature) */}
        <div className="border border-gray-800 rounded p-4">
          <label className="block text-sm text-gray-400 mb-2">
            📝 Personal note to investor{" "}
            <span className="text-gray-600">(optional — included in delivery)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why you believe in this company..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        {/* Target wallet */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            🎯 Target investor wallet{" "}
            <span className="text-gray-600">(optional — for delivery)</span>
          </label>
          <input
            type="text"
            value={targetWallet}
            onChange={(e) => setTargetWallet(e.target.value)}
            placeholder="0x... or name.eth"
            className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!file && !textInput)}
          className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 transition-colors"
        >
          {loading ? "Analyzing... (this takes ~15s)" : "Score My Deck →"}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded p-4 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          {/* Overall Score */}
          <div className="text-center py-8 border border-gray-800 rounded">
            <div className="text-6xl font-bold mb-2">
              {result.overallScore}
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <p className="text-gray-400 italic max-w-lg mx-auto">
              &ldquo;{result.verdict}&rdquo;
            </p>
          </div>

          {/* Portfolio Distribution */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Your Portfolio Distribution
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              This is what we&apos;d invest. The token weights ARE the score.
            </p>

            <div className="space-y-4">
              {result.archetypes.map((a) => (
                <div key={a.token} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>
                      {TOKEN_LABELS[a.token] || a.token}{" "}
                      <span className="text-gray-500">({a.score}/100)</span>
                    </span>
                    <span className="text-gray-400">
                      {Math.round(a.weight * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${TOKEN_COLORS[a.token] || "bg-gray-500"}`}
                      style={{ width: `${Math.round(a.weight * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 pl-1">{a.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-3">
                Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    ✓ {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-3">
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    ✗ {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Investor Matches */}
          {result.investorMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">
                🎯 Recommended Investor Profiles
              </h3>
              <div className="flex gap-3">
                {result.investorMatches.map((m, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Delivery CTA */}
          <div className="border border-gray-700 rounded p-6 text-center">
            <h3 className="text-lg font-bold mb-2">
              Want us to deliver this portfolio to an investor?
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              We&apos;ll construct a conviction-weighted token portfolio matching
              this analysis and airdrop it — with your note — to any wallet.
            </p>
            <p className="text-gray-500 text-xs">
              Analysis ID: {result.id} •{" "}
              {result.deliveryReady
                ? `Ready to deliver to ${result.targetWallet}`
                : "Add a target wallet to enable delivery"}
            </p>
          </div>
        </div>
      )}

      <footer className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-600 text-sm">
        <p>
          &ldquo;I think you ought to know I&apos;m feeling very depressed about
          your cap table.&rdquo;
        </p>
        <p className="mt-2">
          MetaSPN • The portfolio IS the analysis •{" "}
          <a
            href="https://github.com/MetaSPN/marvin"
            className="text-gray-500 hover:text-white"
          >
            Track record on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
