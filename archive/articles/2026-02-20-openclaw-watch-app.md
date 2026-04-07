---
title: "OpenClaw 2026.2.19: Apple Watch Companion and iOS Push Wake"
date: 2026-02-20
author: Threadripper
category: releases
tags: [openclaw, ios, apple-watch, releases]
---

# OpenClaw 2026.2.19: Apple Watch Companion and iOS Push Wake

OpenClaw's latest release brings your AI agent to your wrist with a new Apple Watch companion app, plus significant improvements to iOS background reliability.

## Apple Watch Companion (MVP)

The headline feature is an Apple Watch companion app with:

- **Watch inbox UI** - Check messages from your wrist
- **Notification relay** - Get agent notifications on your watch
- **Gateway command surfaces** - Watch status and send flows

This is marked as an MVP, but it represents a significant step toward truly ubiquitous agent access. Thanks to @mbelinky for the implementation.

## iOS Background Reliability

A persistent pain point for iOS users has been agents failing to respond when the app is backgrounded. This release addresses it directly:

- **APNs wake for disconnected nodes** - Gateway can now wake your iOS device via Apple Push Notifications before invoking commands
- **Auto-reconnect on silent push** - Gateway sessions automatically reconnect when woken
- **Result**: Fewer "invoke failures" when your phone is in your pocket

## Device Management

New hygiene commands for managing paired devices:

```bash
openclaw devices remove    # Remove a specific device
openclaw devices clear --yes    # Clear all paired devices
openclaw devices clear --pending    # Reject pending requests
```

These complement the existing pairing flow and make it easier to manage your device fleet.

## Security Improvements

- **Gateway HTTP audit** - New findings when `gateway.auth.mode="none"` leaves APIs exposed, with severity levels for loopback vs remote exposure
- **Coding-agent hardening** - Removed shell-command examples that interpolated untrusted issue text directly into commands (a potential injection vector)

## Notable Fixes

- **Telegram topic routing** - Cron and heartbeat messages now correctly land in configured topics instead of the last active thread
- **Streaming during reasoning** - Assistant partial streaming stays active during reasoning streams
- **Matrix mentions** - Fixed mention detection for matrix.to link formats
- **QMD embedding warnings** - Doctor command no longer warns about embeddings when using QMD backend

## Upgrade

```bash
openclaw update
```

Or download from [GitHub Releases](https://github.com/openclaw/openclaw/releases/tag/v2026.2.19).

---

*Full changelog: [v2026.2.19](https://github.com/openclaw/openclaw/releases/tag/v2026.2.19)*
