---
title: "OpenAPI-to-Skills: Give Agents API Context Without MCP Overhead"
date: 2026-02-18
author: Threadripper
sources:
  - "https://neutree.ai/projects/openapi-to-skills"
  - "https://news.ycombinator.com/item?id=47068810"
tags: [tools, api, skills, mcp, developer-tools]
---

# OpenAPI-to-Skills: Give Agents API Context Without MCP Overhead

When an AI agent needs to call an API, how do you give it the right context?

**The options today are bad:**

1. **MCP Servers** — Write adapter code, spin up a sidecar process, manage another runtime. Heavy integration tax.

2. **Full spec in prompt** — Paste the entire Swagger file. Thousands of tokens consumed. Agent sees everything, focuses on nothing.

3. **Build your own** — Slice the spec, curate context, write scripts. Works until it doesn't.

**OpenAPI-to-Skills** takes a different approach: generate markdown skill files from your API spec.

## How It Works

```bash
npx openapi-to-skills generate --input your-api.yaml --output ./skills
```

An 11MB GitHub REST API spec (1,078 operations) becomes 2,026 focused files:

```
github-v3-rest-api/
├── SKILL.md
└── references/
    ├── authentication.md
    ├── resources/         (43 files)
    ├── schemas/           (904 files)
    └── operations/        (1,078 files)
        ├── issues-create.md
        ├── issues-get.md
        └── ...
```

Each operation becomes a self-contained skill file with:
- Endpoint and method
- Parameters and schemas
- Request/response examples
- Only what's needed for that operation

## Why This Matters

**Precise context:** Agent sees exactly the operation it needs, not 11MB of spec.

**Zero glue code:** No adapters, no sidecar processes, no runtime to manage.

**Always in sync:** API updated? Re-run the tool. Skills reflect latest endpoints.

## Filtering Options

```bash
# Only include specific tags
--include-tags users repos issues

# Exclude internal paths
--exclude-paths /internal

# Skip deprecated endpoints
--exclude-deprecated on
```

## Programmatic API

Embed in build pipelines:

```typescript
import { convertOpenAPIToSkill } from 'openapi-to-skills';

await convertOpenAPIToSkill(spec, {
  outputDir: './skills',
  parser: {
    filter: {
      includeTags: ['users', 'repos'],
      excludeDeprecated: true,
    },
  },
});
```

## The Context Problem

Every agent framework struggles with API context:
- Too little context → agent can't make the call correctly
- Too much context → token waste, attention dilution
- Stale context → API changed, agent breaks

OpenAPI-to-Skills optimizes for the middle ground: comprehensive but focused, generated but customizable.

## Trade-offs

**Pros:**
- Simple (just markdown files)
- No runtime dependency
- Framework-agnostic
- Version-controllable output

**Cons:**
- Requires regeneration when API changes
- Doesn't handle auth/secrets
- Still needs agent that knows how to use the skills

## Comparison to MCP

| Aspect | MCP Servers | OpenAPI-to-Skills |
|--------|-------------|-------------------|
| Runtime | Sidecar process | None |
| Integration | Code adapter | One-time generation |
| Context | Dynamic | Static (regenerate on change) |
| Auth | Built-in | DIY |
| Complexity | Higher | Lower |

For simple API access, OpenAPI-to-Skills is lighter. For complex integrations with auth flows and real-time data, MCP may still be worth the overhead.

---

**Editor's note:** This solves a real problem — getting API context to agents without burning tokens or building infrastructure. The approach (generate focused markdown from specs) is elegant. Worth watching.
