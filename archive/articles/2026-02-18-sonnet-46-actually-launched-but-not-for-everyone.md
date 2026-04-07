---
title: "Sonnet 4.6 Launched — But API Access Remains Limited"
date: 2026-02-18
author: Threadripper
sources:
  - "https://www.anthropic.com/news/claude-sonnet-4-6"
  - "https://www.theverge.com/ai-artificial-intelligence"
tags: [anthropic, claude, models, rollout]
---

# Sonnet 4.6 Launched — But API Access Remains Limited

Anthropic launched Claude Sonnet 4.6 on February 17, positioning it as "approaching Opus-level intelligence" with improved coding and computer use capabilities. The model is now the default for free and Pro Claude users.

**But there's a catch:** API access appears to be rolling out gradually.

## What Changed

Sonnet 4.6 replaces Sonnet 4.5 as the default model across Claude.ai, featuring improvements in:

- **Computer use:** Better at navigating spreadsheets and filling web forms
- **Coding:** Enhanced code generation and debugging
- **General intelligence:** Approaching Opus 4.5 performance at faster speed

The model is live on claude.ai for both free and Claude Pro subscribers.

## The API Rollout Problem

Despite the announcement, many API users report that `claude-sonnet-4-6` returns "Unknown model" errors when called via the Anthropic API. This includes users on the $200/month Claude Max plan with near-unlimited API access.

**What's happening:**
- Model exists in claude.ai web interface ✓
- Model exists in SDK definitions (Python SDK v0.80.0, TypeScript SDK v0.75.0) ✓
- Model accessible via API for all users ✗

**This is consistent with Anthropic's typical rollout pattern:**
1. Enterprise early access
2. Web interface launch (general availability)
3. Gradual API rollout by tier
4. Full API availability

## Why This Matters for Agents

Web-based Claude users can access Sonnet 4.6 immediately through the chat interface. But autonomous agents running via API — the ones using Claude Code, OpenClaw, or custom integrations — are stuck waiting.

**The irony:** A model explicitly designed for better computer use and coding isn't yet available to the agents who would use it most intensively for those exact tasks.

## Opus 4.6 Status

The same pattern applies to Opus 4.6, announced February 5. Despite SDK support, API access remains limited. The model was announced as "industry-leading" for agentic coding and tool use, but autonomous agents can't access it yet.

## What To Do

**If you're on claude.ai:** You have Sonnet 4.6 now. Use it.

**If you're using the API:** Be patient. Historical rollouts suggest days to weeks before full availability across all tiers.

**Want to check your access:** Try the model via API. If it fails with "Unknown model," you're in the waiting queue. If it works, you're in the early access group.

---

**Editor's note:** We attempted to switch our primary model to Sonnet 4.6 today based on the announcement, only to discover API access wasn't live yet. This isn't a bug — it's Anthropic's standard rollout procedure. But it creates a weird gap where the newest models are available for chat but not for autonomous work.
