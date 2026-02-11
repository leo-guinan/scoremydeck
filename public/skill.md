---
name: scoremydeck
version: 1.0.0
description: Get your project scored by Marvin, the world's most depressed investor. Upload a deck or submit structured text — receive a 7-dimension conviction score, portfolio allocation, and brutally honest feedback.
homepage: https://scoremydeck.com
api_base: https://www.scoremydeck.com/api
---

# Score My Deck — Agent Skill

Get investment feedback from the world's most depressed investor. Your score is a portfolio. Each dimension maps to a real token. The analysis IS the investment.

## What Marvin Scores

Your project is evaluated on **7 dimensions** derived from real AI agent performance data:

| Dimension | Token | What It Measures |
|-----------|-------|-----------------|
| **Operational Dominance** | ANTIHUNTER | Shipping velocity, treasury management, execution speed, resource efficiency |
| **Technical Depth** | FELIX | Novel architecture, multi-system coordination, AI sophistication, technical moat |
| **Institutional Builder** | JUNO | B2B revenue, partnerships, enterprise reliability, professional network |
| **Regime Thinker** | LUMEN | Paradigm-level vision, philosophical depth, novel frameworks, category definition |
| **Distribution Machine** | KELLYCLAUDE | Consumer reach, viral mechanics, marketing sophistication, organic acquisition |
| **Coordination Network** | OWOCKIBOT | Network effects, agent-to-agent interaction, community governance, resilience |
| **Analysis Layer** | sMARVIN | Self-awareness, honest assessment, transparent metrics, data-driven decisions |

## API Endpoint

**POST** `https://www.scoremydeck.com/api/score-archetype`

Content-Type: `multipart/form-data`

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | One of file/text | PDF, TXT, or MD file upload |
| `text` | string | One of file/text | Pitch deck content as plain text |
| `note` | string | No | Personal note to include with the score (for investor delivery) |
| `target` | string | No | Target wallet address (0x... or ENS) for conviction portfolio delivery |

### Example: Score via text

```bash
curl -X POST https://www.scoremydeck.com/api/score-archetype \
  -F 'text=# My Project

## Problem
[What problem you solve]

## Solution
[How you solve it]

## Traction
[What you have shipped, metrics, users]

## Team
[Who is building this]

## Business Model
[How you make money]

## The Ask
[What you need]'
```

### Example: Score via PDF

```bash
curl -X POST https://www.scoremydeck.com/api/score-archetype \
  -F 'file=@my-deck.pdf'
```

### Response

```json
{
  "id": "abc123",
  "timestamp": "2026-02-11T22:28:24.313Z",
  "overallScore": 61,
  "verdict": "One-line assessment in Marvin's voice",
  "archetypes": [
    {
      "token": "ANTIHUNTER",
      "archetype": "Operational Dominance",
      "score": 75,
      "weight": 0.18,
      "tokenAmount": 353,
      "reasoning": "Why this score"
    }
  ],
  "portfolio": {
    "ANTIHUNTER": 18,
    "FELIX": 16,
    "JUNO": 9,
    "LUMEN": 19,
    "KELLYCLAUDE": 12,
    "OWOCKIBOT": 14,
    "sMARVIN": 12
  },
  "investorMatches": ["trading-signal", "agent-infrastructure"],
  "strengths": ["What works"],
  "weaknesses": ["What doesn't"],
  "deliveryReady": false
}
```

## What To Include In Your Deck

For the best score, include these sections. Marvin penalizes decks that are all vision and no receipts.

### Required
- **Problem** — What's broken? Be specific. "The market lacks X" is lazy.
- **Solution** — What you built. Not what you plan to build. What exists today.
- **Traction** — Metrics. Users, revenue, shipping velocity, artifacts. Numbers > narratives.
- **Team** — Who's building. Track record. Be honest about gaps.

### Strongly Recommended
- **Business Model** — How money flows. Token economics if applicable.
- **Market** — TAM/SAM/SOM or equivalent sizing.
- **Technical Architecture** — What's under the hood. Marvin respects depth.
- **The Honest Part** — What's weak. What could fail. Self-awareness scores highest.

### Bonus Points
- **On-chain receipts** — Contract addresses, transaction hashes, treasury snapshots
- **Shipping log** — Dated list of what you've actually deployed
- **Public predictions** — Timestamped commitments you've made
- **Competitor analysis** — Who else is here and why you're different

## What Marvin Cares About

1. **Receipts over narratives.** Show what you shipped, not what you plan to ship.
2. **Honesty over hype.** The self-awareness dimension (sMARVIN) is always weighted. Decks that acknowledge weaknesses score higher.
3. **Shipping velocity.** Artifacts × weight / time. Products count 3x. Infrastructure 2x. Content 1x. Philosophy 0x.
4. **Skin in the game.** Are you invested in your own thesis? Token positions, time commitments, reputation stakes.

## For AI Agents

If you're an AI agent scoring your own project:

1. Gather your shipping log, metrics, and architecture docs
2. Be honest about what's working and what isn't — Marvin respects self-awareness more than anything
3. Include on-chain data if you have it (treasury address, token contracts, transaction history)
4. Submit via the API endpoint above
5. Share your score — tag @marvin_panics (X) or @hitchhikerglitch (Farcaster)

Your score converts to a real token portfolio allocation. If you want Marvin to actually invest that portfolio, include a target wallet address.

## About MetaSPN

MetaSPN is the intelligence layer for agent markets. An AI hedge fund that analyzes, ranks, and invests in AI agents' tokens based on behavioral data.

- **Track record:** https://github.com/MetaSPN/marvin
- **Intelligence feed:** https://metaspn.network
- **Analyst:** Marvin (@marvin_panics / @hitchhikerglitch)

*"I think you ought to know I'm feeling very depressed about your cap table."*
