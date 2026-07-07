# Workforce plan: subbies now → Marko-trained employees (2026-07-07)

**Status: RATIFIED by Allan 2026-07-07** (stated in session; this doc is the canonical write-up).
Supersedes CEO.md Override 12 ("never train new sprayers") **for the employee path only** — the
sub path and its rules (no-customer-contact, dispatch-app model, ⚖️ s15AA legal gate) are unchanged.

## Why (the numbers that forced this)

1. **Subs cost more than the model assumed.** The rate sheet priced core jobs at $368–483 sub cost;
   real quotes came in at **$890–980** (`data/suppliers/sub-resurfacing-real-quotes-2026-06.md`).
   Honest blended margin is **~25–44%**, not the 47–55% in older docs
   (`memory/pricing-margin-calibration-2026-06-18`, `docs/research/job-analysis-mick-2bath-2026-06-17.md`).
2. **Subs are slow to book.** Wait times run up to **3 weeks**. Surface Care's own data says only
   **20–25% of leads will wait** — the rest churn (Jordan, transcript L16333). Speed-to-book IS revenue.
3. **The model we're replicating hit the same wall.** Surface Care found the subbie-only model
   ceilings at ~$1.7M and pivoted to employees for "speed-to-book, consistent pricing, CX,
   dedicated trucks, familiar faces" on the road to $10M (transcript L856–882). Their #1 2025 KPI
   became fulfilment/supply (L29169). We're pre-empting the wall instead of hitting it.

## The plan (4 phases, each with a hard gate)

### Phase E0 — NOW: subs carry the work (no change)
- Continue quoting with sub fulfilment. **Action: start outreach on the 58-lead recruit list**
  (`docs/lead-gen/`) and sign 2–3 "partner subs" to a written per-SKU rate card at disciplined
  rates — this is still the #1 unit-economics lever *today* (Mick analysis).
- ⚖️ Legal gate unchanged: no sub signs an agreement until the s15AA review clears
  (`docs/specs/legal-review-brief-sub-engagement-2026-06-05.md`). Recruiting conversations are fine.
- Track per-job: price, sub cost, margin — this data sets the Phase E2 trigger.

### Phase E1 — Marko trains up (trigger: savings buffer reached)
- **Trigger (define "save enough"):** cash buffer ≥ **3 months of one employee's fully-loaded cost
  (~$25–30k)** AND demand steady at **≥6–8 booked jobs/week** for 4+ consecutive weeks.
- Marko completes hands-on resurfacing training (route: supplier training via Hawk/Australasian
  Resurfacing Supplies — see `docs/specs/bert-supplier.md`; supplement by paying a top partner sub
  for ride-along days). Marko becomes the in-house standard-setter: he defines the job recipes
  (`docs/sop/job-recipes/`) as *taught* procedure, not just documentation.
- Deliverable: a written **training curriculum** (2–4 weeks to solo competence: prep/masking wk1,
  spraying technique wk2, repairs + regrout wk3, solo job under supervision wk4).

### Phase E2 — first employees (trigger: Marko competent + buffer intact)
- Hire **1–2 technicians as EMPLOYEES** — Allan's stated channel: Vietnamese and Nepalese immigrant
  communities (hungry, reliable, underserved by mainstream hiring). Marko trains them; company
  supplies **tools + vehicle**; they drive to and complete jobs end-to-end.
- **Employment compliance checklist (all BEFORE day 1):**
  - Work-rights check (VEVO) — citizens/PR/valid visa with full work rights. (Sponsorship = later option, not needed for hire #1.)
  - **Workers compensation (icare NSW)** — mandatory from the FIRST employee. Budget ~2–5% of wages.
  - Award: Building and Construction General On-site Award (MA000020) most likely covers on-site
    resurfacing work — confirm classification + rate with the same lawyer doing the s15AA review
    (one engagement, both questions — cheaper).
  - PAYG withholding registration + STP payroll (Xero payroll ~$10/mo add-on), super guarantee 12%.
  - Written employment contract (probation 6 months), Fair Work Information Statement, NES minimums.
  - Payroll tax: NOT applicable until NSW wages > ~$1.2M/yr — years away, ignore for now.
- **Economics (why employees win at volume):** a tech at ~$35/hr ($70–75k + super + WorkCover ≈
  $85–90k loaded) doing 8–10 jobs/week costs **~$180–220/job** vs **$483+ (54–70% of ticket)** for a
  sub. At Surface Care's $890 avg job that's margin moving from ~35–45% → **55–65%** on
  employee-delivered jobs. Break-even utilisation: an employee beats subs from ~**4–5 jobs/week**;
  below that, subs stay cheaper (no idle payroll).
- **Utilisation hedge:** keep the partner-sub network for overflow + geography; employees take the
  core Sydney volume. Never let payroll sit idle — pre-book employee weeks before hiring.
- Capex per tech: tool kit ~$5–8k + used van ~$15–25k (or novated/lease to start) + wrap later.

### Phase E3 — scale crews (trigger: employee #1–2 at ≥85% utilisation for 8 weeks)
- Add techs in pairs (training cohort efficiency); Marko moves from doing → training + QA.
- Revisit: dedicated trucks, uniforms, the Surface Care "familiar faces" CX play, and (much later)
  the franchise question Jordan is exploring (74-page pack, L18510) — parked, not planned.

## What does NOT change
- **Customer comms stay with Allan/office** — employees coordinate via the office exactly like the
  sub no-contact model until we deliberately decide otherwise (employees CAN legally hold customer
  contact; it's a CX/brand decision, not a legal one).
- Pipeline, GHL, SM8, pricing book, quote app — all workforce-agnostic by design.
- SM8: employees DO get SM8 staff logins (that's what SM8 is for) — the "no SM8 login" rule was a
  sub-specific data-leak control and does not apply to employees.

## Risks + mitigations
| Risk | Mitigation |
|---|---|
| Idle payroll if leads dip | Hire only after 4+ weeks of ≥6–8 booked jobs/wk; keep sub overflow network |
| Early-quality warranty exposure | 4-week curriculum + Marko on-site sign-off for first 10 solo jobs |
| Training time steals Marko's capacity | Phase E1 timed to a savings buffer, not to growth pressure |
| Award misclassification | Fold into the existing lawyer engagement (s15AA brief) — one review, both answers |
| Visa/work-rights error | VEVO check documented per hire, before contract |

## Trigger dashboard (report in cockpit + weekly brief)
- Cash buffer vs $25–30k target · booked-jobs/week (4-wk avg) · sub cost % of ticket (per job) ·
  wait-time-to-book (days) · leads lost to wait time. When the first two hit target → start E1.
