# SCENARIO TRACEABILITY MATRIX — appendix to the COMPLETE BUILD PLAN (2026-06-12)

**Why this exists:** Cleo's parity audit required the 64-scenario universe to be auditable BY ID, not by
cluster inference. This is that artifact: every scenario family → its build-plan home (plan refs = phases in
`COMPLETE-BUILD-PLAN-2026-06-12.md`; pipeline IDs = `cockpit/data/pipeline.json`, the working board).
**Result: 64/64 homed after the 2026-06-12 patch (12 orphans found by the traceability audit → all homed;
2 conflicts resolved). Reverse check: ZERO over-build — every plan item traces to a scenario, a pass-bar
point, or a Jordan-stack element. Cleo parity score: 96% (remaining deltas: quote speed manual until the
AI quote-drafter; money/payment-chase planned-not-live; pay.com.au = deliberate deferral, Decision 12 v2.)**

## A. Sub-side runbooks (28/28 ✅)
All 28 scenarios in `docs/sop/sub-risk-scenarios-playbook.md` §1-28 → pipeline 1.13 (snippets), 1.6 (issue
routing), 6.4-6.8 (app security, legal gate, matching, pre-flight), money-lane SOP §5-6 (fees, refunds).

## B. Customer comms lifecycle (34/34 ✅ after patch)
- Ack/recovery/cadence/delivery/nudges → 0.3, 1.1, 4.2 (templates 1A, 2A-2D)
- Quote-delayed 1C · photo-resend 1B · rejection 2G · on-my-way 3C → **1.13 snippet pack** *(were orphans)*
- **Expired-quote 2F → 1.2** — CONFLICT RESOLVED: validity = 14 days (CEO.md lock); win-back fires day 15;
  the template's "day 7" was a stale pre-lock draft (patched in the templates doc this date)
- **72h email 2E → 4.2** — RESOLVED: W3 stays SMS-only; email variants are Phase-4 additions post-DKIM
- Booking 3A → 1.3 · day-before 3B → 1.4 · cure 3D → 1.5 · NPS/detractor/review 4A-4C → 1.6-1.7
- Referral 4D · PM/builder/landlord nurture 5A-5D · win-back 6A/6B → **10.6 lifecycle marketing pack**
  *(were orphans — deliberately Phase 10 per Allan's growth-last order; all commercial/STOP)*
- Payment reminders → 5.2 (M6-M8 automated)

## C. GHL workflows (19/19 ✅) → pipeline 1.1–1.15 (incl. W4 missed-call + W7 logger added by Cleo)
## D. Make scenarios (8/8 ✅) → 0.2/0.4 (S1-S3 live), 2.1-2.5 (S4, S5+R2, photo-attach, client, heartbeat)
## E. Form hardening (7/7 ✅) → 3.1-3.6 + 1.13 (out-of-area)
## F. Lead-side edge cases (10/10 ✅ after patch)
Spam/abuse → 3.2 · invalid phone → 3.2 · duplicate → 3.4 · out-of-area → 1.13 · strata → 1.12 ·
asbestos-era → 1.12/1.6 · multi-bathroom → 3.3 · **agency-PM enquiry → 1.13 intake SOP + 10.6 nurture**
*(was orphan)* · **phone-call instead of form → 1.9 (W4) + 1.13 intake SOP** *(was orphan)* ·
**customer-texts-photos → 1.13 intake SOP** *(was orphan)*
## G. Money-side (11/11 ✅) → money-lane SOP (manual now) + 5.1-5.8 (automation) + 2.2 (R2)
## H. System failures (10/10 ✅) → 2.5 (heartbeat/toggle), 8.2 (vendor runbooks + uptime), 8.3 (backups),
1.10 (W7 error routing), 3.6 (cache-bust), 9.1 (forced-failure drills)

## The 2 resolved conflicts (for the record)
1. **Quote expiry timing:** locked = 14-day validity (CEO.md:1869-1872) → win-back day 15. Template §2F
   "day 7" = stale artifact from the pre-lock Excel migration; patched with a supersession note.
2. **72h email vs SMS-only W3:** W3 = SMS d1/d3/d7 (Cleo-approved pack). The 2E email is an ADDITION that
   arrives with the Phase-4 email twin-set, not a W3 step.

*Full per-scenario tables live in the 2026-06-12 audit transcripts; this appendix is the by-ID index the
final audit (pipeline 9.2) checks against.*
