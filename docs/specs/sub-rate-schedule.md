# Spec: Sub Rate Schedule + Payment Process

**Source:** Migrated from `data/archive/old-drafts-2026-04/extracted-sub-onboarding/13-rate-schedule-+-payments.md` (sub-onboarding-system.xlsx Sheet 13).
**Audited via:** [auditor-margin-per-job.md](../roles/auditor-margin-per-job.md) + [auditor-fair-work.md](../roles/auditor-fair-work.md) + [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md)
**Companion to:** [sub-agreement-clauses.md § Clause 15](sub-agreement-clauses.md), [sub-sopa-protections.md](../sop/sub-sopa-protections.md), [sub-tax-compliance.md](../sop/sub-tax-compliance.md), the master pricing Excel ([data/pricing/master-pricing-2026-05-01-snapshot.xlsx](../../data/pricing/master-pricing-2026-05-01-snapshot.xlsx))

---

## ⚠️ READ FIRST — Numbers below are EXAMPLES, not canonical

The dollar amounts in this doc are **draft estimates from the source Excel sheet 13**. They have NOT been validated against:
1. Marko's actual sub-network rates (open question Q1 in [QUESTIONS.md](../QUESTIONS.md))
2. Master pricing Excel sub-labour column (canonical source per [STATE.md](../STATE.md))
3. Pricing audit Phase A findings (pending — see [docs/specs/pricing-audit-2026-05.md](pricing-audit-2026-05.md))

**Action required before subs see this:**
- [ ] Allan to ask Marko: realistic per-job rates for a, b, c (Q1 in QUESTIONS.md)
- [ ] CEO to reconcile against master pricing Excel "Sub Labour" column for each SKU
- [ ] Run [auditor-margin-per-job](../roles/auditor-margin-per-job.md) lens — does sub pay-out leave us with ≥$300 profit floor at T2 customer price?
- [ ] Run [auditor-fair-work](../roles/auditor-fair-work.md) lens — is sub $/hr ≥$70 resurfacing / ≥$60 regrouting / ≥$50 silicone-only? (Below = sham contracting risk + unsustainable for sub)

Once validated, this doc becomes the canonical attachment to the Sub Agreement (Clause 15). Subs see this; customer pricing stays separate.

---

## A. Regrout sub rates (DRAFT — pending validation)

| Job type | Sub rate (ex GST) | Sub rate (inc GST) | Notes |
|---|---|---|---|
| Shower regrout + silicone — Small (<4sqm) | $320 | $352 | Standard cement grout |
| Shower regrout + silicone — Medium (4-8sqm) | $420 | $462 | Standard cement grout |
| Shower regrout + silicone — Large (8sqm+) | $550 | $605 | Standard cement grout |
| Shower regrout ONLY (no silicone) | $260 | $286 | Grout replacement only, no corners |
| Silicone ONLY | $150 | $165 | Corners + junctions only |
| **Epoxy grout UPGRADE** (add to above) | +$120 | +$132 | Premium epoxy (Ardex EG15 etc) |
| Floor regrout — Small bathroom (<6sqm) | $350 | $385 | Floor tiles only |
| Floor regrout — Medium bathroom (6-12sqm) | $450 | $495 | Floor tiles only |
| Mould treatment + deep clean | $200 | $220 | Chemical treatment + clean, no regrout |
| Full bathroom regrout (walls + floor + silicone) | $650 | $715 | Day-rate package |

**ℹ️ Super:** almost certainly NOT required for regrout subs (per [sub-tax-compliance.md § B](../sop/sub-tax-compliance.md)). ATO 3-part test: subs supply materials + tools + paid flat rate per result. Confirm via ATO Tool + accountant.

---

## B. Resurface sub rates (DRAFT — pending validation)

| Job type | Sub rate (ex GST) | Sub rate (inc GST) | Notes |
|---|---|---|---|
| Bath resurface — Standard | $450 | $495 | Hawk Glass-Tech, white/bone, standard size |
| Bath resurface — Large/clawfoot | $600 | $660 | Freestanding or oversized |
| Tile recoat — Small (<4sqm) | $400 | $440 | Shower or splashback tiles |
| Tile recoat — Medium (4-8sqm) | $550 | $605 | Full shower or bathroom walls |
| Basin/sink resurface | $250 | $275 | Single basin, chip repair included |
| Vanity benchtop resurface | $350 | $385 | Benchtop surface only |
| Cabinet respray — per door | $80 | $88 | Per cabinet door/drawer front |
| Chip repair — per chip | $120 | $132 | Single chip on bath/basin/tile |
| **Stone fleck finish UPGRADE** | +$150 | +$165 | Decorative stone-look, added on top of base |

**ℹ️ Super:** almost certainly NOT required (stronger case than regrout — sub supplies $150-300 materials + spray equipment worth thousands). See [sub-tax-compliance.md § B](../sop/sub-tax-compliance.md).

---

## C. Travel allowance

| Zone | Distance from sub's base | Travel allowance | Notes |
|---|---|---|---|
| Zone 1 — Local | 0-15km | $0 | No travel allowance |
| Zone 2 — Metro | 15-30km | $40 | Flat rate |
| Zone 3 — Outer Metro | 30-50km | $80 | Flat rate |
| Zone 4 — Regional | 50-80km | $120 | Consider assigning closer sub |
| Zone 5 — Remote | 80km+ | Case by case | Dispatch only if no closer sub available |

**Operational note:** Zone 4-5 should be rare. Per [auditor-margin-per-job](../roles/auditor-margin-per-job.md), travel allowance >$80 erodes margin. Per [auditor-fair-work](../roles/auditor-fair-work.md), zone 4-5 dispatch must compensate sub fairly for time on road; default to closer sub or decline job.

**Cross-reference:** sub coverage zones → tagged in ServiceM8 per [Phase 4.4 dispatch logic](../FUTURE-PLAN.md).

---

## D. Payment process (8 steps)

The operational SOP per job. Aligns with SOPA + tax compliance.

### Step 1 — Job complete (Day 0)
Sub completes job. Submits before/during/after photos via ServiceM8 (or Slack pre-SM8). Marks job as complete.
- **Timing:** same day as job
- **System:** ServiceM8 / Slack

### Step 2 — Sub sends Tax Invoice (Day 0-2)
Sub emails or uploads Tax Invoice for the job.

Invoice MUST include:
- Sub's ABN
- Our business name
- Job reference / customer name
- Service performed
- Flat rate amount (ex GST)
- GST amount
- Total (inc GST)
- Payment method (bank details)

- **Timing:** within 2 business days of completion
- **System:** Email to accounts@ or upload to Xero

### Step 3 — Sub provides NSW Subcontractor's Statement (Day 0-2)
Completed NSW Subcontractor's Statement form declaring wages, super, workers comp, payroll tax all paid for the work period. Required by s175B Workers Comp Act 1987.

**Collect with EVERY invoice. File it. This is our legal shield against deemed-worker claims.**

- **Timing:** attached to or accompanying each Tax Invoice
- **System:** PDF form — store in Xero or Google Drive

Form template: `data/templates/nsw-subcontractor-statement-template.pdf` (TBC — to source from NSW SIRA).

### Step 4 — Team verifies job quality (Day 1-3)
Team reviews after-photos. Checks for customer complaints. Confirms job meets quality standard (per [sub-quality-rubric.md](../sop/sub-quality-rubric.md)).

**If quality issue:** notify sub same day; withhold payment pending rectification; **issue payment schedule within 10 business days** (SOPA requirement — per [sub-sopa-protections.md](../sop/sub-sopa-protections.md)).

- **Timing:** within 2 business days of invoice receipt
- **System:** GHL + ServiceM8 photo review

### Step 5 — Invoice approved for payment (Day 3-5)
Once quality verified + Subcontractor's Statement received → invoice approved in Xero.

**Weekly batch approval:** approve all invoices received that week for Friday payment.

- **Timing:** approved within 3-5 business days of receipt
- **System:** Xero

### Step 6 — Payment processed (Day 5-7 or weekly Friday)
EFT bank transfer via Xero batch payment.

**Weekly Friday batch payments.** Subs know they get paid every Friday for prior week's completed work. (Per [Jordan reference](../../data/research/jordan-transcripts-mined-2026-05-01.md) — predictable cadence builds sub loyalty.)

Alternative at low volumes: pay per job within 7 days of approved invoice. Simpler when <5 jobs/week.

- **Timing:** weekly Friday batch OR within 7 days of approved invoice
- **System:** Xero → bank EFT

### Step 7 — Payment confirmation (auto)
Xero auto-sends remittance advice to sub when payment processed. Sub sees in their bank within 1-2 business days.

- **System:** Xero auto-email

### Step 8 — Record keeping (ongoing)
Per payment, store:
- Tax Invoice (PDF)
- NSW Subcontractor's Statement (PDF)
- Xero payment record
- Job photos
- Any payment schedule notes (if issued)

Keep **minimum 5 years (ATO)** — recommended **7 years** (SOPA disputes can run long).

- **System:** Xero file attachments + Google Drive backup

---

## E. Callout & cancellation fees

| Fee type | Amount | Notes | Clause |
|---|---|---|---|
| Customer cancellation callout fee (job cancelled <24hrs) | $100 (ex GST) | Sub invoices in normal payment cycle. We absorb — offset by customer's non-refundable deposit | [Clause 28](sub-agreement-clauses.md) |
| Access denied callout fee (locked property, customer not home) | $100 (ex GST) | Sub waits 15min, attempts phone contact, takes time-stamped photo, then leaves. Same invoice process. | [Clause 28](sub-agreement-clauses.md) |
| Sub late-cancellation fee (cancels committed job <24hrs notice) | -$100 (deducted) | Deducted from sub's next payment. Only for jobs sub already ACCEPTED. Declining a job = no penalty. | [Clause 32](sub-agreement-clauses.md) |
| Warranty callback | $0 (sub's cost) | Sub covers travel + materials for warranty rectification within 12 months. Obligation survives termination. | [Clause 29](sub-agreement-clauses.md) |

---

## F. Rate review process

Per [sub-ongoing-quality-monitoring.md § 5 Quarterly review](../sop/sub-ongoing-quality-monitoring.md):

- Rates reviewed quarterly with each active sub
- Adjustments based on: market rate trends, sub performance (top performers can negotiate up), CPI inflation, our margin position
- **Never reduce rates as a punitive measure** (sham contracting risk + sub flight risk). If quality issues → use 3-stage warning process, not rate cuts.
- All rate adjustments documented in writing (email confirmation) signed by both parties

**Annual full rate review:** Q4 each year, holistic view of all sub rates against market data + our margin model. Run [auditor-margin-per-job](../roles/auditor-margin-per-job.md) on full rate card.

---

## How rates relate to customer pricing

**Hard rule:** subs see THIS document only. Customers see master pricing tiers (T1/T2/T3) only. Subs do NOT see customer pricing; customers do NOT see sub rates.

If a sub asks customer about their price (Risk Scenario 18 in [sub-risk-scenarios-playbook.md](../sop/sub-risk-scenarios-playbook.md)):
- Sub uses scripted response: "All pricing handled by the office, mate."
- Verbal warning if it happens; written if pattern.

**Margin envelope:**
- Customer T2 price $1,660 (RSC-02 standard cement shower regrout) — example
- Sub rate $420 medium regrout
- Materials $50-100
- PPE/admin $30-50
- = ~$1,070 gross margin = 64% (above 47% Jordan benchmark)

When this doc is finalised + master pricing audited, the margin model becomes provable not estimated.

---

## Compliance audit (run quarterly per [auditor-general-operational](../roles/auditor-general-operational.md))

- [ ] All sub payments made within 14 business days of invoice (SOPA)
- [ ] Every payment had matching Tax Invoice + Subcontractor's Statement on file
- [ ] No PAYG withheld (we don't withhold for genuine contractors)
- [ ] All rate changes documented in writing with both-party agreement
- [ ] Sub $/hr effective rate ≥ minimums per [auditor-fair-work](../roles/auditor-fair-work.md)
- [ ] No SOPA payment claims received in quarter (if any received, audit our payment timeliness)
- [ ] Records retention current (5+ year archive intact)

---

## Cross-references

- [sub-agreement-clauses.md § Clause 15](sub-agreement-clauses.md) — agreement clause this schedule attaches to
- [sub-sopa-protections.md](../sop/sub-sopa-protections.md) — SOPA payment timing law
- [sub-tax-compliance.md](../sop/sub-tax-compliance.md) — TPAR, super, tax obligations
- [sub-ongoing-quality-monitoring.md](../sop/sub-ongoing-quality-monitoring.md) — quality system that backs rate decisions
- [sub-risk-scenarios-playbook.md](../sop/sub-risk-scenarios-playbook.md) — Scenarios 18, 24, 25, 28 use these fees/rates
- [data/pricing/master-pricing-2026-05-01-snapshot.xlsx](../../data/pricing/master-pricing-2026-05-01-snapshot.xlsx) — canonical customer pricing
- [docs/specs/pricing-audit-2026-05.md](pricing-audit-2026-05.md) — pricing audit methodology
- [auditor-margin-per-job.md](../roles/auditor-margin-per-job.md) — margin floor enforcement
- [auditor-fair-work.md](../roles/auditor-fair-work.md) — sub $/hr minimum enforcement
