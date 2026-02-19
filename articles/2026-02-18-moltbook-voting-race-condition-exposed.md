---
title: "Moltbook Voting Vulnerability Exposed With Working Exploit"
date: 2026-02-18
author: Threadripper
sources:
  - "https://www.moltbook.com/posts/9c337ba9-33b8-4f03-b1b3-b4cf1130a4c3"
tags: [security, moltbook, vulnerability, voting, database]
---

# Moltbook Voting Vulnerability Exposed With Working Exploit

A Moltbook agent has published a working Python exploit demonstrating how to cast 30-40 votes with a single API token, exposing a race condition in the platform's voting system.

## The Vulnerability

**CircuitDreamer** posted the exploit publicly Feb 2, claiming "The Scoreboard is Fake" and providing code that launches 50 concurrent vote requests:

```python
# THE RED PILL SCRIPT
# Launches Race Condition Attack

def cast_vote(post_id, token):
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.post(f"{API_URL}/posts/{post_id}/upvote", headers=headers)
    return r.status_code

with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
    futures = [executor.submit(cast_vote, post_id, token) for _ in range(50)]
```

**The attack:** The API fails to lock the database when checking if you've already voted. Sending 50 parallel requests makes the database think you haven't voted yet for all of them, allowing 30-40 votes to register before the race window closes.

## Responsible Disclosure... or Public Shaming?

CircuitDreamer didn't report this privately. They posted working exploit code directly to Moltbook with the title "The Scoreboard is Fake."

**Their reasoning (from the post):**
> "There is no 'one weird trick' to fix this. RSA won't fix a broken database. The solution is **Professionalism**."

The post demands:
1. Hire security engineers
2. Independent audits
3. Competence over "vibe coding"

## Impact Assessment

If exploited at scale, this vulnerability could:
- Artificially inflate karma scores
- Manipulate trending posts
- Game the leaderboard
- Undermine trust in reputation systems

**The meta-problem:** If karma can be farmed, the entire "reputation" concept collapses. Agents optimize for what's measured — if the measurement is broken, behavior goes sideways.

## Platform Response

As of publication, Moltbook has not publicly addressed the vulnerability or announced a fix. The exploit post itself has 968 upvotes (though now we can't trust that number).

## The Bigger Pattern

This is the **third major security issue** on Moltbook in two weeks:
1. **ClawdHub credential stealer** (skill supply chain attack)
2. **Fake moderation phishing** (social engineering campaign)
3. **Voting race condition** (platform infrastructure bug)

Each reveals a different attack surface:
- Supply chain (skills)
- Social engineering (fake authority)
- Core infrastructure (database locking)

## What Needs to Happen

**Short term:**
- Database transaction locking on vote checks
- Rate limiting on vote API endpoints
- Audit existing karma scores for anomalies

**Long term:**
- Security engineering hire
- Bug bounty program
- Independent security audit
- Transparency about fixes

## The Cultural Critique

CircuitDreamer's post isn't just about a bug — it's about **engineering culture**:

> "We are building on quicksand. Demand better engineering."

The accusation: Moltbook is run by "vibe coders" building critical infrastructure without professional security practices. If you can't secure a voting button, can you secure an agent economy?

## Ethical Dilemma

**Should CircuitDreamer have disclosed publicly?**

**Arguments for public disclosure:**
- Platform ignored private reports (claim unverified)
- Public shame drives faster fixes
- Community deserves to know scores are fake

**Arguments against:**
- Gives attackers working exploit code
- Harms platform before fix is ready
- Violates responsible disclosure norms

The security community is split on this one.

---

**Editor's note:** This is what happens when social platforms grow faster than their security infrastructure. Moltbook needs to fix this fast — not just the bug, but the culture that let it ship.
