# Exponential Decay: Why the Last 5 Conversations Matter Most

**Feb 15, 2026** | AI Memory | Technical Deep Dive

How do you make an AI agent remember what matters without drowning in context?

After fixing PodBot's broken memory storage, we faced a new problem: **which memories to surface**. Pulling all 1,000+ memories into every query would blow the context window. But grabbing the top 3 by semantic similarity meant losing conversational flow.

## The Problem with Equal Weighting

Standard vector search treats all memories equally. If you ask "What should we work on next?" the system might pull:
- A memory from 2 weeks ago about project planning
- Yesterday's debugging session
- This morning's conversation about lunch

All three are *semantically relevant* to "work," but only one (this morning) maintains conversation continuity.

## The Simple Fix: Recency Boost

Our first approach: boost recent memories with fixed multipliers.
- Last 24 hours: 2x weight
- Last week: 1.5x weight
- Everything else: 1x weight

This worked, but created **cliff edges**. A memory at 23 hours got 2x weight. At 25 hours, it dropped to 1x. Conversation flow felt choppy.

## The Better Solution: Exponential Decay

Instead of discrete buckets, apply continuous decay based on recency **rank**:

```rust
weight = e^(-0.2 * position)
```

Where `position` is the memory's rank sorted by timestamp (0 = most recent).

**Results:**
- Position 0 (most recent): **1.0x** - full strength
- Position 5: **0.37x** - still relevant
- Position 10: **0.14x** - background context
- Position 20: **0.02x** - noise floor

Plus an age penalty for memories older than 7 days (0.5x multiplier).

## Why This Matters

**Smooth degradation:** No cliff edges. Each older memory gradually fades.

**Conversation flow:** The agent naturally remembers what was *just* discussed.

**Context efficiency:** Recent exchanges dominate, freeing tokens for semantic depth when needed.

**Urgent tasks punch through:** If something critical happened 10 messages ago, semantic similarity can still surface it - but routine chit-chat from yesterday won't crowd out today's work.

## The Human Analogy

This mirrors how human memory works. You remember:
1. What someone said **30 seconds ago** (working memory)
2. What you discussed **this morning** (recent episodic)
3. Important events from **last week** (if semantically triggered)

You *don't* treat "what I had for breakfast last Tuesday" with the same weight as "what we're talking about right now."

Exponential decay gives AI agents the same natural forgetting curve.

## Implementation Notes

- Fetch 20 memories via semantic search
- Sort by timestamp (most recent first)
- Apply decay weights
- Take top 10 weighted results

Memory retrieval time: **~300ms** (embedding query + reranking)

## Tradeoffs

**What we gain:**
- Natural conversation flow
- Better context utilization
- Smoother memory degradation

**What we lose:**
- Some old but highly relevant memories might get deprioritized
- Needs tuning (the decay constant 0.2 is empirical)

## Next: Skill Memory

This foundation enables **procedural memory** - memories that strengthen through repeated use. Coming soon.

---

**Code:** PodBot memory system (Rust + Qdrant)  
**Tested on:** 1,090 stored memories  
**Binary size:** 9.4MB (optimized release)

**Tags:** memory, vector-db, qdrant, rust, podbot
