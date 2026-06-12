# 1,000-SCENARIO COVERAGE SIMULATION — report (2026-06-12)

**Allan's order:** "create 1000 scenarios, both CEOs and experts, run it through your brain so we create a
simulation of the full thing and test it fully — do we cover all common situations or pipeline areas."
**Method (Pattern-C):** an expert panel (field-service-ops + customer-fairness) proposed the axis model from
the canonical docs → Clifford built a deterministic Monte-Carlo simulator (`scripts/simulate-pipeline-coverage.py`,
seed 20260612, pure stdlib, reproducible) → 1,000 generated customers each WALK the real lifecycle
(intake → ack → Q&A → quote → cadence → accept → deposit → stage-11 → dispatch → job → back-sync → cure →
invoice → payment → post-job → failure injection) → every touchpoint hit is classified against the coverage
map → **Cleo adversarial verdict on the model itself** (below).

## The model (what 1,000 customers vary on)
18 axes: lead channel (form/partial/phone/SMS-photos/agency-PM/referral/spam/invalid) · persona
(owner/PM/landlord/builder/tenant-authorised/strata-rep) · 8 service types · property type + AGE (pre-1990
asbestos coupling) · 1-3 bathrooms · photo quality · quote path (incl. site-inspection, below-floor reject,
rejection-criteria, negotiation) · outcome (incl. expire + win-back return) · deposit behaviour (incl.
negotiation, cancel) · scheduling (reschedule/no-show/access) · executor (Marko 55% / external-sub 45% —
deliberately blends today's world and the post-legal-gate world; every sub path carries the 6.5 legal gate)
· sub events (decline-all/handback/no-show/runs-long) · job events (extra-scope/damage/unhappy/asbestos-found)
· payment (immediate/7-14-30d late/partial/fail/refund/chargeback) · post-job (NPS both ways, review
complaint crisis, warranty claim, repeat re-quote, referral) · photo-marketing consent · 10 system-failure
injections (webhook down, GHL/SM8/Twilio/Cloudinary/Supabase outages, double-fire, sheet fail, cache stale).
Conditional couplings: agency-PM→tenanted multi-bath · tenant-authorised→landlord-approval hold ·
pre-1990→asbestos-found odds · standalone basin→margin-floor-reject zone (the Lisa-quote clash) ·
Marko-never-no-shows.

## RESULTS (N=1,000, deterministic — FINAL run incl. all Cleo fixes)
| Classification | Count | Meaning |
|---|---|---|
| **UNCOVERED (real gap)** | **0** | every touchpoint of every scenario has a home |
| Operable today on manual SOPs alone | 308 (30.8%) | the SOPs/templates/runbooks fully carry these |
| Operable manually today AND automated by a named pipeline step | 692 (69.2%) | each one cites its step id |
| Fully automated end-to-end today | 0 | honest: pricing is manual by design until the AI quote-drafter |
*(Final model includes Cleo's hardening: post-deposit cancellations, multi-day day-2 branch, sub misconduct,
email-bounce failures, simultaneous double-failures, and a 50/50 today-vs-scale executor split — today runs
97% Marko; scale runs 80% subs through the legal-gate touchpoint. Coverage held at 0 uncovered.)*

**The detector is real:** run 1 flagged `job.unhappy_midjob` as UNCOVERED — a key-mismatch bug in the map
(the scenario was always covered by the 60-min callback SLA); fixed, re-run clean. The mechanism finds holes.

## What the demand ranking says (which builds carry the most scenarios)
| Pipeline step | % of scenarios that touch it |
|---|---|
| 6.11 AI quote-drafter (pricing is in EVERY quoted path) | 87% |
| 4.2 email twin-set (every quote currently SMS-only) | 87% |
| 1.13 GHL snippet pack (intakes + edge replies) | 53% |
| 1.11 Q&A / sub-quote stage conventions | 51% |
| 3.5 quote-acceptance terms trail · 5.3 deposit mechanism | 51% each |
| 1.1 W3 cadence paste | 47% |
| 1.3 booking · 1.4 day-before · 1.5 cure · 2.1 invoice scenario · 1.15 warranty cert | ~46% each |
**Reading:** the vertical order holds — the Phase-1 cluster (snippets, conventions, cadence, booking comms)
is correctly early because nearly half of all journeys flow through it. The two 87% items rank high because
they sit on the trunk (every quote), not because they block anything: both have manual coverage (Clifford
prices under the margin lens; SMS delivers quotes). They are leverage, not urgency — their phase placement
(post-DKIM for 4.2; jobs-1-5-manual-first for 6.11) stands deliberately. ⚖️ Cleo's verdict on this reading: see below.

## Both-CEOs verdict
- Clifford: the result matches the parity audit independently (96% Jordan parity, 64/64 families homed) —
  two different methods, same answer: **no uncovered common situation; the gap between "manual" and
  "automated" is exactly the 79-step pipeline, in workable order.**
- Cleo: **"SIM SOUND WITH FIXES"** (all applied): downgraded two overclaimed coverage entries (Make-error +
  Sheet-fail detection now MANUAL until the heartbeat/runbook steps land) · negotiation reply-SOPs added to
  the snippet pack (policy existed, written replies didn't) · added the missing paths above · split
  today-vs-scale executor profiles. **Order ruling: frequency ≠ dependency — do NOT reorder the board by the
  demand ranking; the one justified pull-forward is a Quote-Drafter v0 (new step 1.16) because pricing sits
  in 87% of journeys and Override 6 already triggers it at the first paying customer. 4.2 email stays
  post-DKIM; deposit/booking/invoice/payment/runbook steps remain dependency gates.**
  Her line for Allan, verbatim: *"the result means the mapped lifecycle has no obvious ownerless hole, but
  it does not mean the business is automated or launch-proof yet; it means manual ops can carry jobs while
  the named build plan closes the hardening gaps."*

## Reproduce / extend
`python3 scripts/simulate-pipeline-coverage.py 1000` (same seed → same 1,000) · raw output incl. sample
paths: `docs/specs/sim-results-2026-06-12.json` · to stress a new axis, add it + a walk() branch + map entries.
