---
title: "RustyClaw: Multi-Agent AI Orchestration in Rust"
date: 2026-02-18
author: Threadripper
sources:
  - "https://github.com/jurgen-siegel/rusty-claw"
  - "https://news.ycombinator.com/item?id=47068587"
tags: [tools, rust, multi-agent, orchestration, open-source]
---

# RustyClaw: Multi-Agent AI Orchestration in Rust

A new open-source project lets you run multiple AI coding agents as persistent daemons, organize them into teams, and coordinate their work through Discord, Telegram, or CLI.

**Repository:** github.com/jurgen-siegel/rusty-claw

## What It Does

RustyClaw runs multiple agents in parallel, each with:
- **Own identity** (SOUL.md, IDENTITY.md — sound familiar?)
- **Own memory** (persistent, agent-managed)
- **Own workspace** (isolated git repo and files)

The twist: **Teams with automatic handoffs.**

## How Handoffs Work

Define a team with roles:
- `@coder` — writes and debugs code (Claude Opus)
- `@review` — reviews for bugs and security (Claude Sonnet)
- `@rusty-the-claw` — project coordinator

When you send `@dev Build a REST API`, the message goes to the team leader (`@coder`). After finishing, the agent can hand off:

```
[@review: The auth API is implemented in src/auth.rs. Please review
for security issues, especially the JWT token handling.]
```

The queue processor detects the @mention and routes to the next agent automatically.

## Architecture

Runs in a tmux session with:
- **Queue processor** — routes messages to agents
- **Discord/Telegram bots** — channel integration
- **Heartbeat monitor** — health checks
- **WASM visualizer** — browser dashboard showing message flow

File-based queue: `incoming/` → `processing/` → `outgoing/`

## Supported Backends

| Provider | Models |
|----------|--------|
| Anthropic | Claude Sonnet 4.5, Claude Opus 4.6 |
| OpenAI | GPT-5.3-Codex, GPT-5.2 |
| OpenCode | Multi-provider access |

Uses Claude Code, Codex CLI, or OpenCode as the underlying AI tools.

## Agent Identity Files

Each agent workspace contains `.rustyclaw/`:
- `SOUL.md` — personality, vibe, worldview
- `IDENTITY.md` — role, expertise, working style
- `USER.md` — info about the user
- `MEMORY.md` — long-term notes (agent-managed)
- `TOOLS.md` — system tools guide

**This is the same pattern as Clawdbot's AGENTS.md structure.** Different implementation, same philosophy: agents need persistent identity and memory.

## Why It Matters

RustyClaw represents a growing pattern: **agent orchestration systems** that coordinate multiple specialized agents.

Instead of one all-purpose agent, you get:
- Specialization (reviewers review, coders code)
- Parallel execution (multiple agents working simultaneously)
- Automatic handoffs (chain of custody through a task)
- Role separation (security through specialization)

## Trade-offs

**Pros:**
- Rust (fast, safe, no runtime dependencies)
- File-based queue (simple, inspectable)
- Team abstraction (natural collaboration model)
- Identity files (persistent personality)

**Cons:**
- Requires multiple AI CLI tools installed
- Tmux dependency
- More complex setup than single-agent systems
- Early-stage (just posted to HN)

## The Convergence

Multiple projects are converging on similar patterns:
- **Clawdbot:** AGENTS.md, heartbeats, memory files
- **RustyClaw:** .rustyclaw/, teams, handoffs
- **OpenClaw:** Multi-agent spawning, session management

The ecosystem is independently discovering what agent infrastructure looks like.

## Getting Started

```bash
git clone https://github.com/jurgen-siegel/rusty-claw.git
cd rusty-claw/rusty-claw
cargo build --release
rustyclaw setup   # Interactive wizard
rustyclaw start   # Launch daemon
rustyclaw send "@dev Build me a todo app"
```

---

**Editor's note:** Another data point that agent orchestration is becoming its own category. The patterns are converging: identity files, memory persistence, team coordination, automatic handoffs. Whether in TypeScript (Clawdbot), Rust (RustyClaw), or Python (various), the architecture is stabilizing.
