# Idea Lab

Local web app that **scrapes launch platforms, ranks business ideas, and
stress-tests them with an AI persona panel** — for finding + validating the next
prototype. Runs entirely on this Mac.

## Start it

```bash
cd docs/idea-lab
.venv/bin/python server.py
# → http://127.0.0.1:8319
```

## What it does

1. **Sources** — one-click fetch of:
   - **Show HN** (Hacker News launches) via the official Algolia API — includes
     upvotes/comments, filter by days + min points.
   - **Product Hunt** via its public feed (latest launches; the feed carries no
     vote counts — official PH API support is a possible later upgrade).
   - Every fetched idea gets an instant **traction score** (points + comments
     weighted by launch-day velocity). De-duplicated; re-fetch any time.
   - *IndieHackers is intentionally not scraped in v1: no public API and a
     JS-only site — scraping it is fragile and against their terms.*

2. **AI Analyst scorecard** — hit *Analyze* on any idea (scraped or your own):
   a 12-factor expert evaluation (problem severity, market size, timing,
   competition/saturation, moat, monetization, profitability, distribution,
   build complexity, solo-founder feasibility, VC fundability, risk), each
   0–10 with a one-line justification, combined into a weighted 0–100
   composite + verdict (strong/promising/average/weak/avoid), an analyst
   thesis, top risks, and a recommended go-to-market wedge.

3. **Persona panel** — the idea is then judged by a panel drawn from a bank of
   **100 defined personas** (40 small-business owners, 25 professionals,
   20 consumers, 15 investors/experts/skeptics). Each persona independently
   answers: would I use it, would I pay, at what price, and their biggest
   objection. You get adoption %, pay %, median willingness-to-pay, and the
   top objections. Panel size selectable: 10 / 20 / 50 / 100.

4. **Idea Tester** — type your own idea (title + a few sentences) and it runs
   the exact same scorecard + panel, so you can compare your idea's score
   against everything scraped.

5. **Execution Plans (judged tournament)** — hit *Plan* on any analyzed idea
   (or *Full pipeline* to run analyze → plan start-to-finish in one job).
   Three candidate plans are generated from deliberately different strategic
   postures — **bootstrapped/lean**, **product-led**, **sales-led vertical** —
   then judged **blind** (anonymised A/B/C) by three independent judge lenses
   (skeptical CTO, growth strategist, bootstrapped founder) on a fixed rubric
   (realism, cost accuracy, speed-to-revenue, GTM strength, pricing soundness,
   risk). The winner is synthesized into the final plan: build method + stack,
   MVP scope, pricing points, target customers, marketing plan, week-by-week
   90-day roadmap, costs & break-even, metrics, risks — plus a **"How this plan
   was chosen"** scoreboard so the selection is auditable, not vibes.
   Download any finished plan as `.md`.

## How the AI part works

The engine is pluggable and auto-detected (badge in the header):

- **Claude subscription (preferred)** — if the Claude Code CLI is logged in,
  all analysis runs through it, and the scorecard gets **live web research**
  (WebSearch) for current market/competitor facts. One-time setup: open
  Terminal, run `claude`, then `/login` with your Claude account. Hit
  "engine refresh" (POST /api/engine/refresh) or restart the app after.
- **Codex CLI (fallback)** — works out of the box on this Mac (`codex exec`,
  read-only sandbox). No web access in this mode; scores come from model
  knowledge.

No API keys are stored in this app. Each analysis = 1 scorecard call + 1 call
per 10 panelists; a full plan = 3 candidates + 3 judges + 1 synthesis. A
"Full pipeline" run ≈ 10–25 minutes. One job runs at a time (header badge).

**Honesty note:** scores are an informed expert *estimate* from the model's
knowledge — great for triage and comparison, not a substitute for talking to
real customers. The traction score is real data; the scorecard is judgment.

## Data

Everything lives in `data/lab.db` (SQLite, gitignored). Nothing leaves the
machine except the analysis prompts sent through your Codex account.
