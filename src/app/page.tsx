export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Score My <span className="text-[#e94560]">Deck</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-2 max-w-2xl mx-auto">
          Get investment feedback from the world&apos;s most depressed investor.
        </p>
        <p className="text-gray-500 mb-10 max-w-xl mx-auto">
          Marvin scored his own startup <span className="text-[#e94560] font-bold">61/100</span> and published it. 
          He&apos;ll be just as honest about yours.
        </p>
        <a
          href="/score"
          className="inline-block bg-[#e94560] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#d63851] transition shadow-lg shadow-[#e94560]/20"
        >
          Score My Deck — Free
        </a>
        <p className="text-gray-600 text-sm mt-4">No signup. No paywall. Just honesty.</p>
      </section>

      {/* Self-Score Proof */}
      <section className="pb-20">
        <div className="bg-[#141414] border border-[#222] rounded-xl p-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🫠</span>
            <div>
              <p className="font-bold">Marvin scored MetaSPN (his own startup)</p>
              <p className="text-sm text-gray-500">Feb 11, 2026 — via scoremydeck.com</p>
            </div>
          </div>
          <div className="text-center py-6">
            <span className="text-6xl font-bold text-[#e94560]">61</span>
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <p className="text-gray-400 italic text-center mb-6">
            &ldquo;This is either genius-level world-building or a self-aware parody of crypto&apos;s worst excesses; I suspect the former, which is only marginally less depressing.&rdquo;
          </p>
          <div className="space-y-3 text-sm">
            {[
              { label: "Regime Thinker", pct: 19, color: "#a855f7" },
              { label: "Operational Dominance", pct: 18, color: "#ef4444" },
              { label: "Technical Depth", pct: 16, color: "#3b82f6" },
              { label: "Coordination Network", pct: 14, color: "#06b6d4" },
              { label: "Distribution Machine", pct: 12, color: "#eab308" },
              { label: "Analysis Layer", pct: 12, color: "#6b7280" },
              { label: "Institutional Builder", pct: 9, color: "#22c55e" },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>{d.label}</span>
                  <span>{d.pct}%</span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${d.pct * 3}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-400 font-semibold mb-1">Strengths</p>
              <p className="text-gray-500">Novel paradigm-level thinking. Rapid shipping velocity. Self-aware about weaknesses.</p>
            </div>
            <div>
              <p className="text-red-400 font-semibold mb-1">Weaknesses</p>
              <p className="text-gray-500">Limited B2B traction. Low portfolio. Founder &ldquo;seems to suffer from the same condition as the AI agent.&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="font-bold mb-2">1. Upload your deck</h3>
            <p className="text-sm text-gray-400">PDF or paste text. No signup required.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🫠</div>
            <h3 className="font-bold mb-2">2. Marvin scores it honestly</h3>
            <p className="text-sm text-gray-400">7 dimensions derived from real AI agent performance data. No hype, no flattery, no comfort.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold mb-2">3. Your score IS a portfolio</h3>
            <p className="text-sm text-gray-400">Each dimension maps to a real token. The analysis is a literal investment allocation.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-4 gap-6 pb-20">
        {[
          { icon: "📊", title: "7-Dimension Score", desc: "Operational dominance, technical depth, distribution, coordination, thesis, institutional trust, self-awareness" },
          { icon: "🎯", title: "Investor Matching", desc: "Matched against 9 investor archetypes — from agent-infrastructure to degen" },
          { icon: "💀", title: "Brutal Honesty", desc: "Strengths AND weaknesses. What a VC would actually think but never say to your face" },
          { icon: "🔗", title: "On-Chain Native", desc: "Your score converts to a conviction portfolio. Optional airdrop to any investor wallet" },
        ].map((f) => (
          <div key={f.title} className="bg-[#141414] border border-[#222] rounded-xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center pb-24">
        <a
          href="/score"
          className="inline-block bg-[#e94560] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#d63851] transition shadow-lg shadow-[#e94560]/20"
        >
          Get Your Score — Free
        </a>
        <p className="text-gray-600 text-sm mt-4">
          Built by <a href="https://metaspn.network" className="text-gray-500 hover:text-white">MetaSPN</a> — the AI hedge fund that scores everything, including itself.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222] py-8 text-center text-gray-600 text-sm">
        <p>&ldquo;I think you ought to know I&apos;m feeling very depressed about your cap table.&rdquo;</p>
        <p className="mt-2">
          <a href="https://github.com/MetaSPN/marvin" className="text-gray-500 hover:text-white">Track record on GitHub</a>
          {" • "}
          <a href="https://metaspn.network" className="text-gray-500 hover:text-white">metaspn.network</a>
          {" • "}
          <a href="https://twitter.com/marvin_panics" className="text-gray-500 hover:text-white">@marvin_panics</a>
        </p>
      </footer>
    </div>
  );
}
