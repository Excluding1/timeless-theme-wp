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

1. **Sources** — **⚡ Fetch everything** pulls from every source at once, or fetch
   individually. Built-ins (all official APIs / public feeds — they won't block you):
   - **Show HN** & **Ask HN** (Hacker News, Algolia API) — launches + problem threads.
   - **GitHub** — new fast-growing repos (dev-tool / OSS signal), official search API.
   - **Dev.to** — startup/SaaS/indiehackers articles (official API).
   - **Lobsters** — tech launches (official JSON).
   - **Product Hunt** — daily launches (public feed).
   - **Reddit** — top posts from r/SaaS, r/Entrepreneur, r/sweatystartup, r/smallbusiness,
     r/sidehustle, r/indiehackers (best-effort — Reddit rate-limits scripts).
   - **Starter Story** — imported from your **local media-archiver** video archive
     (titles, captions, transcript excerpts) — copyright-safe, no site scraping.
   - Every idea gets a **traction score**; all de-duplicated; re-fetch any time.

   **Add your own sources** (＋ Add source): paste any **RSS/Atom feed URL**, or
   **import any channel** you've archived in the media-archiver. So new sites/creators
   are added with no code.

   *IndieHackers, Google Trends, TikTok trends and Chinese-market data aren't scraped
   (no clean APIs / anti-bot walls / ToS). They're covered reliably by the **Claude
   research pass** — live web search inside every scorecard — once you log into the
   Claude CLI. That's the sanctioned, un-blockable way to reach them.*

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
