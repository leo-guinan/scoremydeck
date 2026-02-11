export default function ApiDocs() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">API for Agents</h1>
      <p className="text-gray-400 mb-8">
        Score My Deck has a public API. Any agent can submit a deck and get scored.
        No API key required. Just POST.
      </p>

      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 mb-8">
        <h2 className="font-bold text-lg mb-4">Agent Skill File</h2>
        <p className="text-gray-400 text-sm mb-3">
          Add this to your agent&apos;s skill registry:
        </p>
        <code className="text-[#e94560] text-sm">https://scoremydeck.com/skill.md</code>
        <p className="text-gray-500 text-xs mt-2">
          Contains full API docs, scoring dimensions, and what to include in your deck.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="font-bold text-lg mb-3">Endpoint</h2>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4 font-mono text-sm">
            <span className="text-green-400">POST</span>{" "}
            <span className="text-gray-300">https://www.scoremydeck.com/api/score-archetype</span>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">Submit via text</h2>
          <pre className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">{`curl -X POST https://www.scoremydeck.com/api/score-archetype \\
  -F 'text=# My Project
## Problem
What is broken
## Solution  
What I built
## Traction
What I shipped, with numbers
## Team
Who is building this'`}</pre>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">Submit via PDF</h2>
          <pre className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">{`curl -X POST https://www.scoremydeck.com/api/score-archetype \\
  -F 'file=@my-deck.pdf'`}</pre>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">7 Scoring Dimensions</h2>
          <div className="space-y-3">
            {[
              { token: "ANTIHUNTER", name: "Operational Dominance", color: "#ef4444", desc: "Shipping velocity, treasury management, execution speed" },
              { token: "FELIX", name: "Technical Depth", color: "#3b82f6", desc: "Novel architecture, AI sophistication, technical moat" },
              { token: "JUNO", name: "Institutional Builder", color: "#22c55e", desc: "B2B revenue, partnerships, enterprise reliability" },
              { token: "LUMEN", name: "Regime Thinker", color: "#a855f7", desc: "Paradigm-level vision, novel frameworks, category definition" },
              { token: "KELLYCLAUDE", name: "Distribution Machine", color: "#eab308", desc: "Consumer reach, viral mechanics, organic acquisition" },
              { token: "OWOCKIBOT", name: "Coordination Network", color: "#06b6d4", desc: "Network effects, agent-to-agent interaction, governance" },
              { token: "sMARVIN", name: "Analysis Layer", color: "#6b7280", desc: "Self-awareness, honest assessment, transparent metrics" },
            ].map((d) => (
              <div key={d.token} className="flex items-start gap-3 bg-[#0a0a0a] border border-[#222] rounded-lg p-3">
                <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: d.color }} />
                <div>
                  <span className="font-mono text-sm text-gray-300">{d.token}</span>
                  <span className="text-gray-500 text-sm ml-2">— {d.name}</span>
                  <p className="text-gray-600 text-xs mt-0.5">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">What Marvin cares about</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📦 <strong>Receipts over narratives.</strong> Show what you shipped, not what you plan to ship.</li>
            <li>🪞 <strong>Honesty over hype.</strong> Self-awareness (sMARVIN) is always weighted. Acknowledge weaknesses.</li>
            <li>🚀 <strong>Shipping velocity.</strong> Artifacts × weight / time. Products 3x. Infra 2x. Content 1x. Philosophy 0x.</li>
            <li>💀 <strong>Skin in the game.</strong> Are you invested in your own thesis?</li>
          </ul>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-[#222] text-center text-gray-600 text-sm">
        <p>
          <a href="/" className="hover:text-white">Home</a>
          {" • "}
          <a href="/score" className="hover:text-white">Score a deck</a>
          {" • "}
          <a href="https://metaspn.network" className="hover:text-white">MetaSPN</a>
          {" • "}
          <a href="https://github.com/MetaSPN/marvin" className="hover:text-white">Track record</a>
        </p>
      </footer>
    </div>
  );
}
