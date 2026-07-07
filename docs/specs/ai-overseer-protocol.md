# AI Overseer protocol (2026-07-07)

The "ultimate AI that looks over everything": a REPEATABLE review pass, not a daemon. Run it via
the `/overseer` skill (`.claude/skills/overseer/`, local) or by pasting this protocol to Clifford.
Cadence: weekly (Friday), after any big build, or on request.

## What one overseer run does (in order)

1. **Sweep state** — read `docs/STATE.md`, `cockpit/data/{pipeline,tasks,needs}.json`, latest
   memory session-resume, `git log --oneline -20`, and the two atlas data files. Diff docs vs
   reality: anything shipped but not recorded, recorded but not shipped, or contradictory.
2. **Health-check the estate** — every launch.json app: does it start, does its data parse, is
   its "updated" stamp older than the newest real change? Live site: incognito curl for
   `main.js?ver=` timestamp + cf-cache-status (the 2026-06-11 lesson).
3. **Verify the money-critical path** — W1 ack state, quote validity wording, margin gate,
   deposit-before-stage-11 rule, warranty issuance. Any drift here outranks everything else.
4. **Re-rank the work** — rebuild the ordered next-task list by: revenue unblocked > legal/time
   gates (longest lead first) > compliance risk > automation leverage > polish. Compare against
   the cockpit board; propose moves, never silently reorder locked plans.
5. **Brainstorm delta** — max 5 NEW improvement ideas this run (not a wish-list dump), each with
   effort/impact and which existing phase it belongs to.
6. **Write the report** — `cockpit/data/config/overseer-YYYY-MM-DD.md` (renders as a cockpit
   card; keep the previous reports). Sections: Verdict / Ordered priorities / Drift found+fixed /
   Risks / New ideas / Numbers (quotes sent, accepted, revenue, margin, cash vs employee-trigger).
   Update the Obsidian vault's [[3 Next Steps]] note to match.
7. **Fix what is safe, flag what is not** — doc drift: fix immediately (internal docs only;
   customer-facing = Rule-8 both-CEO check). Config/GHL/live-site changes: flag for Allan.

## Standing red lines the overseer always re-checks
- No customer-facing "written"/"guarantee"/review-gating/untrue claims (ACL).
- No sub signature before the s15AA clearance; no job > $5k inc GST while unlicensed.
- Never stage 11 before deposit. Secrets never committed/deployed; rotation list until done.
- Warranty ladder consistency (5yr/2yr/12mo + 6mo rental) across site, PDFs, quotes.

## Standing triggers (check EVERY run — fire = move the item onto the board)
| Trigger condition | Fires |
|---|---|
| 2-3 partner subs signed to the rate card | **Sub-quote-before-customer-quote loop** (pipeline stages 3-5 go live; every quote gets a real cost under it) |
| Phase 5 reached OR agent fleet API-limited | **BigQuery data layer** (~$50/mo; sync GHL out nightly; agents query the warehouse — Jordan's architecture) |
| Money lane automated AND ~20 bathroom jobs done | **Service-line expansion test** (landing page + $5-10/day ads for benchtop/stone repair; fulfil by subcontracting competitors first — James's validation playbook) |
| Allan admin > ~2h/day OR > ~10 leads/day | **VA hire** (record-yourself-a-week replacement method) |
| 10 completed jobs with time+cost data | **Profit-per-hour ranking** (which services to push in ads) |
| Cash buffer $25-30k + 6-8 booked jobs/wk × 4wks | **Employee Phase E1** (Marko trains — employee-transition-plan) |
Details: docs/research/transcript-strategy-ideas-2026-07-07.md.

## Inputs it may not skip
STATE.md · cockpit data · memory MEMORY.md index · git status/log · the pass-bar in
MASTER-FINALIZATION-MAP (12 conditions) — the overseer's "FINALISED?" verdict is always judged
against that bar, nothing softer.
