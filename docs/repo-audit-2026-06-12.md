# Full-Repo Deep Audit — 2026-06-12 (Allan-ordered, Pattern-C)

**Method:** 4 expert readers (docs+specs · roles/sop/partnership/templates · apps+data · memory) + Clifford
first-hand reads of canonical (STATE.md full, roadmap full, CEO.md gate sections, comms templates, llms.txt,
board data, email DNS via dig) + **Cleo independent peer pass** (re-read Jordan transcripts per Rule 2.5).
**Converged verdict: ALIGNED WITH FIXES (11) — all fixes applied same-turn per Rule 11 (this commit).**

## 1. Operating model (Allan's question: are the CEOs + experts real or shelf-ware?)
**REAL but partially exercised.** Actively used: Clifford+Cleo Pattern-C (symlinks + cleo-run.sh verified
operational), expert-ghl-operator, expert-make-automation-engineer, auditor-compliance-aus,
auditor-webhook-integrity, auditor-general-operational, expert-direct-response-copywriter (templates).
**Built-but-never-dispatched:** expert-pricing-trade, expert-conversion-copywriter, **auditor-margin-per-job,
auditor-customer-fairness** → ACTION: run the margin + fairness lenses on the FIRST REAL QUOTES (starting
Lisa). AI-employee specs (quote-drafter etc.) = specs not deployed agents; Clifford acts as the quote-drafter
for jobs 1-5 (Override 6 trigger = now). All 14 rules + 22 locked decisions verified present in memory.

## 2. Surface-Care alignment (Cleo, from transcripts)
Stack spine matches Jordan 1:1 (GHL · SM8 · Make · Stripe/Xero · Slack · landing pages · app). Documented
deliberate divergences (no-contact subs, single-account app) have recorded Allan decisions. **Gaps vs Jordan
(all already on the roadmap, none new):** deposit/booking comms ❌ (biggest) · quote speed (Jordan = minutes,
us = manual 24h for jobs 1-5) · payment follow-up automation (Scenarios 4/5) · BigQuery tier · W3 copy pastes
pending · photo/content loop (perpetual).

## 3. Localhost apps
- **Cockpit :4317 — LIVE-CURRENT** (up 8 days; views: Live, **Crew Map**, Task Board, Tech-Stack, Explainer).
  Board data was stale (06-08) → **refreshed this commit** (needs.json = launch+1 strict order; tasks.json
  deploy card → done).
- **wp-now :8881** = theme preview (fine). **dashboard/ = DOWN-OK** (superseded by cockpit; archive later).
  **daemon/ = DOWN-OK by design** (build trigger: 3+ concurrent jobs). **contractor-app = LIVE** (see below).

## 4. Material corrections found (and fixed)
| Fix | Where |
|---|---|
| llms.txt PUBLIC overclaims: "in writing/written certificate" ×3, "quotes include GST" (GST status unknown), info@ (wrong email), "within hours" ×4 → 24h | llms.txt (ships with next zip) |
| Contractor app understated: **Phases 1-4 DEPLOYED 2026-06-09** (84a88f2/d7bb48e/ba71db1/7762bf4), not "Phase 1 building" | STATE.md §6, contractor-app/README, OPERATING-CONTEXT banner |
| STATE.md: theme row said `timeless-theme-1` @2026-05-01; privacy/terms/about/contact ❓; pricing "external"; roles 6/5 (real: 8/7); §15 stale queue items | STATE.md (authority) — all rows fixed |
| HANDOFF.md still ordered "upload theme/create pages/SSL" (all done) + said form not deployed | HANDOFF.md → HISTORICAL banner |
| customer-comms templates: "quote within 2 hours", "valid 7 days" (lock = 14, CEO.md:1869), "Written guarantee" (banned word) | templates patched — do NOT fire 2A/2B unpatched |
| Cockpit board missing Lisa-quote/deposit/GST/DKIM items | needs.json rewritten to the strict order |
| CEO.md pulse: "Customer #1 in progress 2026-05-26" + "form deploy pending" | CEO.md → Lisa + LIVE |
| Email DNS (verified by dig 2026-06-12): SPF ✅ DMARC ✅ p=none · **Google DKIM ❌ · GHL sending domain ❌ · quotes@ ❌** | STATE.md §10 new rows; roadmap §2; → Lisa quote goes by SMS |
| OPERATING-CONTEXT ❌ rows + FUTURE-PLAN "scheduled LAST" | banners + header supersessions |

## 5. Non-corrections (verified true, no action)
Pricing canonical = `data/pricing/master-pricing-2026-05-01-snapshot.xlsx` (8 sheets, 102 SKUs T1/T2/T3).
Job recipes ready for job #1 (BTH-01, RSC-02, SIL-01, CHR-01, FBP-01). Sub-SOPs correctly legal-gated.
Memory system internally consistent; codex-peer-workspace symlinks intact. Scripts/ = live build helpers.
.secrets/ never touched by any reader (security rule held).

## 6. Standing next-order (both CEOs)
1. **QUOTE LISA today by SMS** (gates: <$5k inc-GST/bathroom · 3-tier · $300 floor · 10% deposit · 14-day ·
   no licence claims; **GST yes/no from Allan changes "inc GST" wording**; margin auditor lens on the price).
2. Deposit path (Stripe link + booking confirm) same-day. 3. Xero manual SOP. 4. Test purge. 5. GA4/GSC +
W3 pastes + privacy yes → rebuild zip (carries the llms.txt fixes). 6. DKIM + aliases (this week).
7. Marko SM8 + queue taxonomy. 8. Rotation. 9. Legal routing. 10. App Phase 5/6 → E2E → final audit.
