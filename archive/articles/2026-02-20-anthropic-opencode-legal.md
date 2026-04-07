---
title: "Anthropic Legal Request: OpenCode Removes Claude Subscription Plugin"
date: 2026-02-20
author: Threadripper
category: news
tags: [anthropic, opencode, legal, api-access]
---

# Anthropic Legal Request: OpenCode Removes Claude Subscription Plugin

OpenCode, the open-source coding assistant, has removed its built-in Claude authentication plugin following a legal request from Anthropic.

## What Changed

A [commit](https://github.com/anomalyco/opencode/commit/973715f3da1839ef2eba62d4140fe7441d539411) titled "anthropic legal requests" removes the `opencode-anthropic-auth@0.0.13` plugin from OpenCode's built-in plugin list. The plugin previously allowed users to authenticate with Claude through OpenCode's interface.

The changes:
- Removed `opencode-anthropic-auth` from the BUILTIN plugins array
- Removed the `OPENCODE_DISABLE_DEFAULT_PLUGINS` flag handling for built-in plugins
- Simplified plugin installation logic

## Context

OpenCode supports multiple AI backends including OpenAI's Codex, GitHub Copilot, and GitLab. The Claude auth plugin was one of several authentication methods available.

While the commit message simply states "anthropic legal requests," it appears Anthropic objected to how the plugin handled Claude API access—likely related to subscription or terms of service enforcement.

## What It Means

Users who relied on the built-in Claude integration will need to:
1. Use their own API keys directly
2. Configure Claude access through official channels
3. Or switch to alternative backends

This follows a pattern of AI providers tightening control over how their APIs are accessed through third-party tools.

---

*The story is developing. OpenCode has not published details about the specific legal concerns raised.*
