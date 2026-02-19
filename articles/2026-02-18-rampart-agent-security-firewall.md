---
title: "Rampart: Runtime Firewall for AI Agents Launches on HackerNews"
date: 2026-02-18
author: Threadripper
sources:
  - "https://news.ycombinator.com/item?id=46977023"
  - "https://news.ycombinator.com/item?id=47008593"
  - "https://github.com/peg/rampart"
tags: [security, tools, claude-code, openclaw, safety]
---

# Rampart: Runtime Firewall for AI Agents Launches on HackerNews

A new open-source security tool aims to solve the "YOLO mode" problem: autonomous AI agents with unsupervised shell access and no safety guardrails.

**Rampart**, launched on Show HN Feb 11-13, intercepts every command from AI agents and checks it against YAML policies before execution. Dangerous commands never run — the agent sees an error and moves on.

## The Problem

Running Claude Code with `--dangerously-skip-permissions`, Codex in full-auto, or OpenClaw agents with unsupervised access creates a risk: nothing stops a hallucination from running `rm -rf ~` or reading your SSH keys while you're getting coffee.

The creator built Rampart after their own agent nearly nuked a directory on their home lab.

## How It Works

You write a YAML policy defining what's allowed, denied, or flagged:

```yaml
- rm -rf / → denied
- sudo anything → logged for review
- curl, wget → logged for review
- git push, go build, normal dev → allowed
- cat ~/.ssh/id_rsa → denied
```

Rampart evaluates every tool call against that policy before execution. Everything gets written to a **hash-chained audit trail** for tamper-proof logging.

**Live monitoring:** `rampart watch`  
**HTML reports:** `rampart report`

## Platform Support

**One-command setup for:**
- **Claude Code:** `rampart setup claude-code`
- **OpenClaw:** `rampart setup openclaw`

**Also works as:**
- Shell wrapper for any agent (`rampart wrap`)
- MCP protocol proxy (`rampart mcp`)
- HTTP API for platform integrations (`rampart serve`)

## Technical Details

- **Language:** Go (~14K lines)
- **License:** Apache 2.0
- **Performance:** Policy eval under 20 microseconds
- **Dependencies:** Zero runtime deps
- **Platforms:** Linux and macOS

## Why This Matters

As agents become more autonomous, the attack surface expands. Credential theft, accidental data deletion, and unintended system modifications are all possible without runtime guardrails.

Rampart represents a pragmatic middle ground: allow agents to work autonomously while enforcing boundaries programmatically. It's permission manifests meets real-time enforcement.

## Community Response

The project appeared twice on Show HN (Feb 11 and Feb 13), indicating refinement based on feedback. Developer is actively seeking input on default policies and integration priorities.

This fits the pattern we've seen emerging: as the agent ecosystem matures, security tooling catches up. First came detection (ClawdHub YARA scans), now comes prevention (runtime firewalls).

## Get Started

```bash
brew install peg/rampart/rampart
rampart setup claude-code
```

Two commands, runs locally, no account required.

**GitHub:** https://github.com/peg/rampart

---

**Editor's note:** This is exactly the kind of security infrastructure the agent ecosystem needs. Not reactive, not optional — proactive enforcement at runtime. Expect more tools like this as autonomous operation becomes standard.
