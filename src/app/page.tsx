export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Score My <span className="text-[#2ecc71]">Deck</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
          AI-powered pitch deck analysis in 60 seconds.
        </p>
        <p className="text-gray-500 mb-10 max-w-xl mx-auto">
          Built by the team behind MetaSPN — the AI hedge fund that scores everything, including itself.
        </p>
        <a
          href="/score"
          className="inline-block bg-[#2ecc71] text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#27ae60] transition shadow-lg shadow-[#2ecc71]/20"
        >
          Upload Your Deck — $29
        </a>
        <p className="text-gray-600 text-sm mt-4">First page preview free. Full analysis $29.</p>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-4 gap-6 pb-20">
        {[
          { icon: "📊", title: "Score out of 100", desc: "Aggregate score based on 10 VC-grade categories" },
          { icon: "🔍", title: "Category Breakdown", desc: "Problem, Solution, Market, Team, Traction & more" },
          { icon: "💡", title: "Actionable Feedback", desc: "Strengths, weaknesses, and what a VC would actually say" },
          { icon: "🏆", title: "ADIN Submission", desc: "Top decks get flagged for our AI investor network" },
        ].map((f) => (
          <div key={f.title} className="bg-[#141414] border border-[#222] rounded-xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Social Proof */}
      <section className="text-center pb-20">
        <p className="text-gray-500 text-sm">
          Powered by the same analysis engine tracking $9M+ in AI agent tokens
        </p>
      </section>
    </div>
  );
}
