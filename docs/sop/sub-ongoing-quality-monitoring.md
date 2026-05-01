# SOP: Ongoing Subcontractor Quality Monitoring + Removal Process

**Source:** Migrated from `data/archive/old-drafts-2026-04/extracted-sub-onboarding/07-ongoing-quality.md` (sub-onboarding-system.xlsx Sheet 07).
**Audited via:** [auditor-general-operational.md](../roles/auditor-general-operational.md) + [auditor-fair-work.md](../roles/auditor-fair-work.md) + [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md)
**Companion to:** [sub-quality-rubric.md](sub-quality-rubric.md) (the scoring criteria), [sub-onboarding-checklist.md](sub-onboarding-checklist.md) (pre-live), [sub-sham-contracting-protections.md](sub-sham-contracting-protections.md) (compliance backing)

---

## Why this SOP exists

Onboarding gets a subcontractor through the door. **Ongoing monitoring keeps quality high and identifies failing subcontractors early — before the brand damage.** Without it: 1-star reviews accumulate, callback rate creeps up, subcontractor gradually slacks, and we lose customers without knowing why.

Per [Jordan transcripts (mining file)](../../data/research/jordan-transcripts-mined-2026-05-01.md) Video 33 + 43-46: subcontractor quality maintenance is the operational discipline that separates $50K/mo agencies from $200K+/mo. Most agencies get to scale and fail because subcontractors slip without anyone noticing.

---

## The 9 systems

### 1. Customer NPS (every job)

Every customer gets NPS SMS 2 hours after job complete (built in [Phase 4.7 NPS workflow](../FUTURE-PLAN.md#47-cure-time-sms--nps-routing)).

**Track NPS per subcontractor. Monthly review:**
- Average NPS <7 → performance conversation (coaching)
- Average NPS <5 → stand down pending review
- Any 2+ scores of 1-3 in a single month → immediate stand down

**Cross-reference:** any NPS 1-6 (detractor) triggers Allan/Marko callback within 60min per [CEO § Customer service SLAs](../CEO.md#customer-service-slas--escalation-added-2026-05-01-pm).

### 2. Photo review (every job)

Subcontractor submits before/during/after photos via ServiceM8 (or Slack pre-SM8 setup). Team reviews AFTER photos within 24 hours.

**Use [sub-quality-rubric.md](sub-quality-rubric.md) (10 criteria each for regrout + resurface) to spot-score at least 20% of jobs per subcontractor per month.** You don't need to inspect every job in person — photos catch ~80% of quality issues.

Photo review template per job (3min review):
- [ ] After photos clear + well-lit + show full surface?
- [ ] Grout consistency uniform? (regrout) / Smooth coverage no orange-peel? (resurface)
- [ ] Silicone bead clean? / Edges crisp at masking lines?
- [ ] Customer area clean (no overspray, no debris)?
- [ ] Score 1-10 entered in tracker

### 3. Random site inspection (monthly)

Visit 1-2 completed jobs per subcontractor per month **unannounced** (within 24hrs of completion, before customer starts using heavily).

Score using full [sub-quality-rubric.md](sub-quality-rubric.md). Compare with subcontractor's photo documentation — are photos accurate or hiding problems?

**Budget 2-3 hours per month for inspections. This is the single highest-ROI quality activity.** Without it, subcontractors learn what photos to take vs what photos hide.

**Compliance note:** maintain Fair Work compliance — inspections are quality checks, not work supervision. Don't show up while subcontractor is mid-job and tell them how to do their work (that's [sham contracting territory](sub-sham-contracting-protections.md)). Inspect post-completion, briefly, with customer's permission.

### 4. Callback rate tracking

Track warranty callbacks per subcontractor:
- **Acceptable:** <5% callback rate (1 in 20 jobs)
- **Warning:** 5-10%
- **Unacceptable:** >10% → stand down

Categorise callback cause:
- Workmanship (subcontractor's fault — counts against them)
- Materials (product issue — record but doesn't count)
- Customer misuse (not following aftercare — record + send aftercare card again, doesn't count against subcontractor)

### 5. Quarterly performance review

Phone or video call with each active subcontractor every quarter (15-30min).

Cover:
- NPS scores + trends
- Callback rate breakdown
- Photo documentation compliance
- Any customer feedback themes
- Rate review (if applicable per [sub-rate-schedule.md](../specs/sub-rate-schedule.md))
- Their feedback on our dispatch, comms, briefs (this matters — good subcontractors leave when they feel treated like employees not partners)

**This is a business-to-business review, not a boss-employee meeting.** Tone matters per [auditor-fair-work.md](../roles/auditor-fair-work.md): "How can we work better together" not "Here's what you're doing wrong."

### 6. Subcontractor removal process — 3 stages

**STAGE 1 — VERBAL WARNING:** Specific feedback on the issue. Document with email follow-up confirming the conversation. ("Hey [name], following up our call today — we discussed [issue] on the [job ref]. Just confirming the agreement to [action]. Cheers.")

**STAGE 2 — WRITTEN WARNING:** Formal email citing specific quality failures with dates + evidence (photos, NPS scores). "If not improved within 30 days, we will terminate the agreement."

**STAGE 3 — TERMINATION:** 14 days written notice per [Subcontractor Agreement Clause 12(a)](../specs/sub-agreement-clauses.md). Pay all outstanding invoices. Professional exit.

### Exception — IMMEDIATE TERMINATION (Clause 12(b))

No warning stages needed for material breach:
- Serious safety breach
- Theft, fraud, assault
- Insurance lapse (uninsured = we're liable; can't be on jobs)
- Customer property damage through negligence
- Unapproved materials use after written warning
- Asbestos disturbance against protocol

Terminate immediately. Document the breach + evidence + decision in `data/sub-files/[sub-name]/termination-YYYY-MM-DD.md`.

### 7. Subcontractor scorecard (monthly tracker)

Maintain simple spreadsheet per subcontractor:

| Subcontractor Name | Month | Jobs Completed | Avg NPS | Callbacks | Callback % | Photo Compliance % | Random Inspection Score | Notes |
|---|---|---|---|---|---|---|---|---|

Review monthly. Share with subcontractor quarterly (transparency builds trust + accountability — and is good evidence in any future Fair Work dispute that we treated subcontractors as B2B partners, not employees).

**Phase 5 BigQuery target:** this scorecard becomes a BQ-fed dashboard, no manual maintenance.

### 8. Insurance expiry tracking — CRITICAL

Track PL insurance + personal accident insurance expiry dates per subcontractor in spreadsheet or Xero.

**Set calendar reminders 30 DAYS before each policy expires.**

Process:
- 30 days before → SMS/email: "Your PL insurance expires on [date]. Send updated Certificate of Currency by [date -7 days]."
- 7 days before → follow-up if not received
- On expiry day → if no certificate → **STAND DOWN immediately. No jobs dispatched until certificate received.**

**Hard rule:** NEVER dispatch a subcontractor with expired insurance. If they cause damage/injury while uninsured, **WE are liable** (head contractor liability). $20M PL coverage = our PL coverage; subcontractor's $10M+ is required to backstop.

Annual check (each renewal):
- Coverage still ≥$10M?
- Insured name unchanged?
- Policy covers the type of work we dispatch (some PL excludes specific trade activities)?

### 9. Offboarding process (subcontractor leaves voluntarily or terminated)

10 steps:

1. **Final payment:** Pay all outstanding invoices within 7 business days (SOPA compliance per [sub-sopa-protections.md](sub-sopa-protections.md))
2. **Final NSW Subcontractor's Statement:** Collect for the final period (s175B Workers Comp Act 1987 — see [sub-tax-compliance.md](sub-tax-compliance.md))
3. **Confidentiality reset:** Confirm return/deletion of any confidential materials (customer data, rate schedule, internal SOPs)
4. **System removals:** Remove from ServiceM8, Slack, GHL access
5. **Xero:** Mark inactive, don't delete (need records for TPAR)
6. **Departure reason:** Record in subcontractor file
7. **If terminated for cause:** Document the breach, evidence, process followed
8. **Non-solicitation period starts:** 12 months from last day (per [Clause 9](../specs/sub-agreement-clauses.md))
9. **Reassignment:** Any upcoming jobs → reassign to another subcontractor + notify affected customers (don't blame departing subcontractor publicly)
10. **Records retention:** Keep all records 5-7 years (ATO requirement — TPAR cross-checks + potential disputes)

---

## How this connects to other systems

| System | Feeds into | Reviewed at |
|---|---|---|
| NPS | Subcontractor scorecard + Customer service SLAs | Monthly + quarterly |
| Photo review | Quality rubric scoring | Per job + monthly aggregate |
| Random inspection | Quality rubric + subcontractor scorecard | Monthly |
| Callback rate | Subcontractor scorecard + Warranty Clause 5 | Monthly |
| Quarterly review | Rate adjustments + retention | Quarterly |
| Insurance tracking | Compliance dashboard + Clause 8 | 30/7/0-day expiry triggers |
| Removal process | Risk scenarios + agreement Clause 12 | Triggered on breach |
| Offboarding | Recordkeeping + compliance | Triggered on exit |

---

## Owner accountability

**Marko:** primary owner for ongoing quality (sub-facing relationships, dispatch, day-to-day quality).
**Allan:** insurance tracking + offboarding paperwork (admin-heavy).
**CEO (this assistant):** drafts scorecards, monthly review summary, escalation alerts when thresholds hit. Marko/Allan act on the alerts.

---

## Failure modes we've researched (per CEO Rule 11)

- **Reddit r/AusFinance "head contractor blew up after subcontractor injury":** subcontractor's PL had lapsed 4 months prior; head contractor sued by injured worker; settled $180K. Lesson: **insurance tracking is not optional**.
- **NCAT 2024 case:** head contractor terminated subcontractor without warning stages; subcontractor claimed wrongful termination + breach of contract; tribunal found head contractor liable for 30 days notice + costs. Lesson: **follow the 3-stage process unless material breach** (then document the material breach explicitly).
- **Whirlpool thread "tradie quality dropped over time":** common pattern — onboarding strict, then gets relaxed, then complaints flood in. Lesson: **monitoring discipline doesn't relax with familiarity**.

---

## Cross-references

- [sub-quality-rubric.md](sub-quality-rubric.md) — the scoring criteria used here
- [sub-onboarding-checklist.md](sub-onboarding-checklist.md) — pre-live checklist (NPS + insurance briefing items)
- [sub-onboarding-master.md](sub-onboarding-master.md) — master orchestration
- [sub-agreement-clauses.md](../specs/sub-agreement-clauses.md) — the contract clauses backing termination + warranty + insurance + non-solicitation
- [sub-sham-contracting-protections.md](sub-sham-contracting-protections.md) — fair work compliance overlay
- [sub-sopa-protections.md](sub-sopa-protections.md) — payment timing legal req
- [auditor-general-operational.md](../roles/auditor-general-operational.md) — quarterly audit lens
