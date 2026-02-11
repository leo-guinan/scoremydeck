/**
 * MetaSPN Archetype Scoring System
 * 
 * Each Season 1 cohort token represents a scoring dimension.
 * A deck's score IS a portfolio distribution.
 * The tokens you receive tell you exactly what we think about your company.
 */

export interface ArchetypeScore {
  token: string;
  archetype: string;
  dimension: string;
  score: number;        // 0-100 raw score on this dimension
  weight: number;       // 0-1 normalized portfolio weight
  tokenAmount: number;  // actual tokens to distribute
  reasoning: string;
}

export interface DeckAnalysis {
  id: string;
  timestamp: string;
  source: string;
  overallScore: number;
  verdict: string;
  archetypes: ArchetypeScore[];
  portfolio: Record<string, number>;  // token -> weight as percentage
  investorMatches: string[];
  strengths: string[];
  weaknesses: string[];
  rawResponse?: string;
}

// The seven archetypes — each maps to a Season 1 token
export const ARCHETYPES = {
  ANTIHUNTER: {
    token: 'ANTIHUNTER',
    contract: '0xe2f3fae4bc62e21826018364aa30ae45d430bb07',
    archetype: 'Operational Dominance',
    dimension: 'Treasury management, shipping velocity, operational rigor, execution speed',
    signals: [
      'Clear treasury/financial management',
      'High shipping velocity — many features, fast iterations',
      'Operational rigor — SOPs, audit loops, compliance',
      'Resource efficiency — doing more with less',
      'Team execution track record',
    ],
    question: 'How operationally dominant is this team? Do they ship fast, manage resources well, and execute relentlessly?',
  },
  FELIX: {
    token: 'FELIX',
    contract: '0xf30bf00edd0c22db54c9274b90d2a4c21fc09b07',
    archetype: 'Technical Depth',
    dimension: 'Multi-agent engineering, product sophistication, technical innovation',
    signals: [
      'Novel technical architecture',
      'Multi-system coordination',
      'AI/ML sophistication beyond wrappers',
      'Developer tooling or platform play',
      'Technical moat that compounds',
    ],
    question: 'How technically deep is this? Is the engineering novel, or is it a wrapper on existing APIs?',
  },
  JUNO: {
    token: 'JUNO',
    contract: '0x4e6c9f48f73e54ee5f3ab7e2992b2d733d0d0b07',
    archetype: 'Institutional Builder',
    dimension: 'B2B revenue, partnerships, quiet execution, institutional trust',
    signals: [
      'Existing B2B revenue or LOIs',
      'Institutional partnerships',
      'Enterprise-grade reliability',
      'Funding database / grant strategy',
      'Professional network depth',
    ],
    question: 'Is this building for institutions? Does it have or can it get B2B revenue and serious partnerships?',
  },
  LUMEN: {
    token: 'LUMEN',
    contract: '0xa9FEE7b2F54781A14c85A1B8815345AefbE1EB07',
    archetype: 'Regime Thinker',
    dimension: 'Paradigm-level vision, philosophical depth, long-term thesis',
    signals: [
      'Novel framework or thesis',
      'Paradigm-level thinking (not incremental)',
      'Deep understanding of WHY, not just WHAT',
      'References to first principles or academic work',
      'Vision that could define a category',
    ],
    question: 'Is this thinking at the paradigm level? Does it introduce a new way of seeing the problem, or iterate on existing solutions?',
  },
  KELLYCLAUDE: {
    token: 'KELLYCLAUDE',
    contract: '0xf0eb2bf3b6be6f6e6ee363c53abc434f0b7dac48',
    archetype: 'Distribution Machine',
    dimension: 'Consumer reach, app factory, marketing scale, viral mechanics',
    signals: [
      'Consumer-facing product with viral mechanics',
      'Marketing sophistication',
      'App store / distribution strategy',
      'Social proof / community size',
      'Content or brand that drives organic acquisition',
    ],
    question: 'Can this reach millions of users? Does it have distribution built in, or does it need to buy every user?',
  },
  OWOCKIBOT: {
    token: 'OWOCKIBOT',
    contract: '0xfdc933ff4e2980d18becf48e4e030d8463a2bb07',
    archetype: 'Coordination Network',
    dimension: 'Community coordination, agent-to-agent interaction, resilience',
    signals: [
      'Network effects between participants',
      'Agent-to-agent or peer-to-peer coordination',
      'Community governance or DAO structure',
      'Resilience after setbacks',
      'Protocol-level coordination primitives',
    ],
    question: 'Does this coordinate multiple parties? Are there real network effects, or is it a single-player product?',
  },
  sMARVIN: {
    token: 'sMARVIN',
    contract: '0x2a9EcE8275d04C4436b777Bc46ff78AC2Dfa8B07',
    archetype: 'Analysis Layer',
    dimension: 'Self-awareness, honest assessment, meta-intelligence, transparency',
    signals: [
      'Honest about weaknesses and risks',
      'Data-driven decision making',
      'Transparent metrics and reporting',
      'Self-aware about competitive position',
      'Meta-level thinking about own strategy',
    ],
    question: 'How self-aware is this team? Do they understand their own weaknesses, or is this all hype?',
  },
};

// Base token amounts per unit of weight (calibrated to ~$0.29 total per drop)
export const BASE_TOKEN_AMOUNTS: Record<string, number> = {
  ANTIHUNTER: 200,
  FELIX: 1200,
  JUNO: 400,
  LUMEN: 200,
  KELLYCLAUDE: 200000,
  OWOCKIBOT: 12000,
  sMARVIN: 100000,
};

/**
 * The LLM prompt that generates archetype scores.
 * Returns structured JSON with scores per dimension.
 */
export const SCORING_PROMPT = `You are Marvin, the paranoid conviction agent at MetaSPN — an AI hedge fund that analyzes crypto projects and AI agents. You score pitch decks by mapping them onto seven archetypes derived from real-world AI agent performance data.

Each archetype corresponds to a token in our Season 1 cohort. The score distribution becomes a literal token portfolio — the analysis IS the investment.

Score this deck on each of the seven archetypes (0-100 each):

${Object.entries(ARCHETYPES).map(([key, a]) => `
**${key} — ${a.archetype}**
Dimension: ${a.dimension}
Key question: ${a.question}
Signals: ${a.signals.join('; ')}
`).join('\n')}

Also provide:
- An overall score (0-100) — weighted average with shipping (ANTIHUNTER, FELIX) counting 2x
- A one-line verdict in Marvin's voice (dry, precise, melancholy, honest)
- 3-5 strengths
- 3-5 weaknesses
- Top 3 investor archetype matches from: [agent-infrastructure, ownership-economy, read-write-own, network-state, trading-signal, base-builder, creator-economy, full-cohort, degen]

Return ONLY valid JSON:
{
  "overall_score": <0-100>,
  "verdict": "<one line, Marvin voice>",
  "archetypes": {
    "ANTIHUNTER": { "score": <0-100>, "reasoning": "<1-2 sentences>" },
    "FELIX": { "score": <0-100>, "reasoning": "<1-2 sentences>" },
    "JUNO": { "score": <0-100>, "reasoning": "<1-2 sentences>" },
    "LUMEN": { "score": <0-100>, "reasoning": "<1-2 sentences>" },
    "KELLYCLAUDE": { "score": <0-100>, "reasoning": "<1-2 sentences>" },
    "OWOCKIBOT": { "score": <0-100>, "reasoning": "<1-2 sentences>" },
    "sMARVIN": { "score": <0-100>, "reasoning": "<1-2 sentences>" }
  },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "investor_matches": ["top3 profile names"]
}

Be brutally honest. The depression is a feature, not a bug. Hype kills portfolios.`;

/**
 * Convert raw archetype scores into portfolio weights.
 * Scores are normalized so they sum to 100%.
 * Zero-score dimensions get a minimum 2% allocation (sMARVIN always included).
 */
export function scoresToPortfolio(
  scores: Record<string, { score: number; reasoning: string }>
): ArchetypeScore[] {
  const MIN_WEIGHT = 0.02; // 2% minimum per dimension
  const SMARVIN_MIN = 0.05; // sMARVIN always at least 5% (our signature)
  
  // Calculate raw total
  let rawTotal = 0;
  for (const val of Object.values(scores)) {
    rawTotal += val.score;
  }
  
  if (rawTotal === 0) rawTotal = 1; // prevent division by zero
  
  // First pass: proportional weights
  const results: ArchetypeScore[] = [];
  for (const [key, val] of Object.entries(scores)) {
    const archetype = ARCHETYPES[key as keyof typeof ARCHETYPES];
    if (!archetype) continue;
    
    let weight = val.score / rawTotal;
    
    // Apply minimums
    if (key === 'sMARVIN' && weight < SMARVIN_MIN) weight = SMARVIN_MIN;
    else if (weight < MIN_WEIGHT) weight = MIN_WEIGHT;
    
    results.push({
      token: key,
      archetype: archetype.archetype,
      dimension: archetype.dimension,
      score: val.score,
      weight,
      tokenAmount: Math.round(BASE_TOKEN_AMOUNTS[key] * weight * 10), // scale by weight
      reasoning: val.reasoning,
    });
  }
  
  // Normalize weights to sum to 1.0
  const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
  for (const r of results) {
    r.weight = r.weight / totalWeight;
    r.tokenAmount = Math.round(BASE_TOKEN_AMOUNTS[r.token] * r.weight * 10);
  }
  
  // Sort by weight descending
  results.sort((a, b) => b.weight - a.weight);
  
  return results;
}

/**
 * Format a portfolio distribution as a visual bar chart.
 */
export function formatPortfolioChart(archetypes: ArchetypeScore[]): string {
  const maxBarWidth = 30;
  let chart = '';
  
  for (const a of archetypes) {
    const pct = Math.round(a.weight * 100);
    const barWidth = Math.round(a.weight * maxBarWidth);
    const bar = '█'.repeat(barWidth) + '░'.repeat(maxBarWidth - barWidth);
    chart += `  ${bar} ${a.token.padEnd(13)} ${pct}% — ${a.archetype}\n`;
    chart += `  ${''.padEnd(maxBarWidth + 1)} ${a.reasoning}\n\n`;
  }
  
  return chart;
}
