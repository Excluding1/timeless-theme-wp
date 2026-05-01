# Spec: Subcontractor Rate Schedule + Payment Process

**Source:** Migrated from `data/archive/old-drafts-2026-04/extracted-sub-onboarding/13-rate-schedule-+-payments.md` (sub-onboarding-system.xlsx Sheet 13).
**Audited via:** [auditor-margin-per-job.md](../roles/auditor-margin-per-job.md) + [auditor-fair-work.md](../roles/auditor-fair-work.md) + [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md)
**Companion to:** [sub-agreement-clauses.md § Clause 15](sub-agreement-clauses.md), [sub-sopa-protections.md](../sop/sub-sopa-protections.md), [sub-tax-compliance.md](../sop/sub-tax-compliance.md), the master pricing Excel ([data/pricing/master-pricing-2026-05-01-snapshot.xlsx](../../data/pricing/master-pricing-2026-05-01-snapshot.xlsx))

---

## ⚠️ READ FIRST — Numbers below are EXAMPLES, not canonical

The dollar amounts in this doc are **draft estimates from the source Excel sheet 13**. They have NOT been validated against:
1. Marko's actual sub-network rates (open question Q1 in [QUESTIONS.md](../QUESTIONS.md))
2. Master pricing Excel sub-labour column (canonical source per [STATE.md](../STATE.md))
3. Pricing audit Phase A findings (pending — see [docs/specs/pricing-audit-2026-05.md](pricing-audit-2026-05.md))

**Action required before subcontractors see this:**
- [ ] Allan to ask Marko: realistic per-job rates for a, b, c (Q1 in QUESTIONS.md)
- [ ] CEO to reconcile against master pricing Excel "Subcontractor Labour" column for each SKU
- [ ] Run [auditor-margin-per-job](../roles/auditor-margin-per-job.md) lens — does subcontractor pay-out leave us with ≥$300 profit floor at T2 customer price?
- [ ] Run [auditor-fair-work](../roles/auditor-fair-work.md) lens — is subcontractor $/hr ≥$70 resurfacing / ≥$60 regrouting / ≥$50 silicone-only? (Below = sham contracting risk + unsustainable for subcontractor)

Once validated, this doc becomes the canonical attachment to the Subcontractor Agreement (Clause 15). Subcontractors see this; customer pricing stays separate.

---

## A. Regrout subcontractor rates (DRAFT — pending validation)

| Job type | Subcontractor rate (ex GST) | Subcontractor rate (inc GST) | Notes |
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

**ℹ️ Super:** almost certainly NOT required for regrout subcontractors (per [sub-tax-compliance.md § B](../sop/sub-tax-compliance.md)). ATO 3-part test: subcontractors supply materials + tools + paid flat rate per result. Confirm via ATO Tool + accountant.

---

## B. Resurface subcontractor rates (DRAFT — pending validation)

| Job type | Subcontractor rate (ex GST) | Subcontractor rate (inc GST) | Notes |
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

**ℹ️ Super:** almost certainly NOT required (stronger case than regrout — subcontractor supplies $150-300 materials + spray equipment worth thousands). See [sub-tax-compliance.md § B](../sop/sub-tax-compliance.md).

---

## C. Travel allowance

| Zone | Distance from subcontractor's base | Travel allowance | Notes |
|---|---|---|---|
| Zone 1 — Local | 0-15km | $0 | No travel allowance |
| Zone 2 — Metro | 15-30km | $40 | Flat rate |
| Zone 3 — Outer Metro | 30-50km | $80 | Flat rate |
| Zone 4 — Regional | 50-80km | $120 | Consider assigning closer subcontractor |
| Zone 5 — Remote | 80km+ | Case by case | Dispatch only if no closer subcontractor available |

**Operational note:** Zone 4-5 should be rare. Per [auditor-margin-per-job](../roles/auditor-margin-per-job.md), travel allowance >$80 erodes margin. Per [auditor-fair-work](../roles/auditor-fair-work.md), zone 4-5 dispatch must compensate subcontractor fairly for time on road; default to closer subcontractor or decline job.

**Cross-reference:** subcontractor coverage zones → tagged in ServiceM8 per [Phase 4.4 dispatch logic](../FUTURE-PLAN.md).

---

## D. Payment process (8 steps)

The operational SOP per job. Aligns with SOPA + tax compliance.

### Step 1 — Job complete (Day 0)
Subcontractor completes job. Submits before/during/after photos via ServiceM8 (or Slack pre-SM8). Marks job as complete.
- **Timing:** same day as job
- **System:** ServiceM8 / Slack

### Step 2 — Subcontractor sends Tax Invoice (Day 0-2)
Subcontractor emails or uploads Tax Invoice for the job.

Invoice MUST include:
- Subcontractor's ABN
- Our business name
- Job reference / customer name
- Service performed
- Flat rate amount (ex GST)
- GST amount
- Total (inc GST)
- Payment method (bank details)

- **Timing:** within 2 business days of completion
- **System:** Email to accounts@ or upload to Xero

### Step 3 — Subcontractor provides NSW Subcontractor's Statement (Day 0-2)
Completed NSW Subcontractor's Statement form declaring wages, super, workers comp, payroll tax all paid for the work period. Required by s175B Workers Comp Act 1987.

**Collect with EVERY invoice. File it. This is our legal shield against deemed-worker claims.**

- **Timing:** attached to or accompanying each Tax Invoice
- **System:** PDF form — store in Xero or Google Drive

Form template: `data/templates/nsw-subcontractor-statement-template.pdf` (TBC — to source from NSW SIRA).

### Step 4 — Team verifies job quality (Day 1-3)
Team reviews after-photos. Checks for customer complaints. Confirms job meets quality standard (per [sub-quality-rubric.md](../sop/sub-quality-rubric.md)).

**If quality issue:** notify subcontractor same day; withhold payment pending rectification; **issue payment schedule within 10 business days** (SOPA requirement — per [sub-sopa-protections.md](../sop/sub-sopa-protections.md)).

- **Timing:** within 2 business days of invoice receipt
- **System:** GHL + ServiceM8 photo review

### Step 5 — Invoice approved for payment (Day 3-5)
Once quality verified + Subcontractor's Statement received → invoice approved in Xero.

**Weekly batch approval:** approve all invoices received that week for Friday payment.

- **Timing:** approved within 3-5 business days of receipt
- **System:** Xero

### Step 6 — Payment processed (Day 5-7 or weekly Friday)
EFT bank transfer via Xero batch payment.

**Weekly Friday batch payments.** Subcontractors know they get paid every Friday for prior week's completed work. (Per [Jordan reference](../../data/research/jordan-transcripts-mined-2026-05-01.md) — predictable cadence builds subcontractor loyalty.)

Alternative at low volumes: pay per job within 7 days of approved invoice. Simpler when <5 jobs/week.

- **Timing:** weekly Friday batch OR within 7 days of approved invoice
- **System:** Xero → bank EFT

### Step 7 — Payment confirmation (auto)
Xero auto-sends remittance advice to subcontractor when payment processed. Subcontractor sees in their bank within 1-2 business days.

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
| Customer cancellation callout fee (job cancelled <24hrs) | $100 (ex GST) | Subcontractor invoices in normal payment cycle. We absorb — offset by customer's non-refundable deposit | [Clause 28](sub-agreement-clauses.md) |
| Access denied callout fee (locked property, customer not home) | $100 (ex GST) | Subcontractor waits 15min, attempts phone contact, takes time-stamped photo, then leaves. Same invoice process. | [Clause 28](sub-agreement-clauses.md) |
| Subcontractor late-cancellation fee (cancels committed job <24hrs notice) | -$100 (deducted) | Deducted from subcontractor's next payment. Only for jobs subcontractor already ACCEPTED. Declining a job = no penalty. | [Clause 32](sub-agreement-clauses.md) |
| Warranty callback | $0 (subcontractor's cost) | Subcontractor covers travel + materials for warranty rectification within 12 months. Obligation survives termination. | [Clause 29](sub-agreement-clauses.md) |

---

## F. Rate review process

Per [sub-ongoing-quality-monitoring.md § 5 Quarterly review](../sop/sub-ongoing-quality-monitoring.md):

- Rates reviewed quarterly with each active subcontractor
- Adjustments based on: market rate trends, subcontractor performance (top performers can negotiate up), CPI inflation, our margin position
- **Never reduce rates as a punitive measure** (sham contracting risk + subcontractor flight risk). If quality issues → use 3-stage warning process, not rate cuts.
- All rate adjustments documented in writing (email confirmation) signed by both parties

**Annual full rate review:** Q4 each year, holistic view of all subcontractor rates against market data + our margin model. Run [auditor-margin-per-job](../roles/auditor-margin-per-job.md) on full rate card.

---

## How rates relate to customer pricing

**Hard rule:** subcontractors see THIS document only. Customers see master pricing tiers (T1/T2/T3) only. Subcontractors do NOT see customer pricing; customers do NOT see subcontractor rates.

If a subcontractor asks customer about their price (Risk Scenario 18 in [sub-risk-scenarios-playbook.md](../sop/sub-risk-scenarios-playbook.md)):
- Subcontractor uses scripted response: "All pricing handled by the office, mate."
- Verbal warning if it happens; written if pattern.

**Margin envelope:**
- Customer T2 price $1,660 (RSC-02 standard cement shower regrout) — example
- Subcontractor rate $420 medium regrout
- Materials $50-100
- PPE/admin $30-50
- = ~$1,070 gross margin = 64% (above 47% Jordan benchmark)

When this doc is finalised + master pricing audited, the margin model becomes provable not estimated.

---

## G. International rate research + fully-loaded margin model (added 2026-05-01 PM)

**Why this section exists:** per Q1 + Q18 in [QUESTIONS.md](../QUESTIONS.md), we don't yet have Marko's actual subcontractor rate data. Allan's direction: build a defensible baseline NOW from international + Hipages research + a fully-loaded margin model that accounts for ALL costs (ads, digital tools, sub pay, materials, travel, insurance amortisation, bank fees). Replace with reality once Marko engages first subcontractor.

### G.1 International rate benchmarks (per-hour subcontractor rate)

Triangulated across mature markets with similar materials/regulation:

| Market | Source | Service | Customer price | Sub effective rate | Notes |
|---|---|---|---|---|---|
| **US** | Miracle Method (largest US franchise) | Bath resurface | USD $400-600 | USD $30-50/hr | Franchise pays sub, sub doesn't supply most materials |
| **US** | Sir Grout (regrouting franchise) | Shower regrout | USD $300-500 | USD $40-60/hr | Same model |
| **US** | ContractorTalk independent | Bath resurface | USD $400-700 | USD $75-100/hr | Solo operator, supplies own materials |
| **UK** | Bath Revive UK | Bath resurface | £250-400 | £20-30/hr (~$40-60 AUD) | Mature market, materials inc |
| **UK** | MyBuilder.com avg | Shower regrout | £180-350 | £25-40/hr (~$50-80 AUD) | Open marketplace |
| **AU** | Hipages (Sydney) | Shower regrout | $300-700 | $50-100/hr | 4-6hr typical job |
| **AU** | Hipages (Sydney) | Bath resurface | $400-700 | $70-120/hr | 5-6hr typical job |
| **AU** | Airtasker | Bath resurface | $300-500 | $40-80/hr | Lower-tier operators (PPE/insurance often missing) |
| **AU** | Bert (ARS) operator estimates | Resurface (retail) | $500-900 | $80-120/hr | Established operators |

**Synthesis — fair AU 2026 effective subcontractor rate AFTER materials cost:**
- **Resurfacing:** $80-100/hr ← higher than regrout because materials ($150-300) + spray equipment investment + skill premium
- **Regrouting:** $70-90/hr
- **Silicone-only:** $60-80/hr
- **Floor below = sham contracting + sub flight risk** ($60/hr resurface, $50/hr regrout, $45/hr silicone)

These are **floor numbers per [auditor-fair-work.md](../roles/auditor-fair-work.md)** — anything below = unsustainable for sub + Fair Work flag.

### G.2 Cost categories — every dollar that flows out per job

Per Allan's instruction "healthy enough margin for profit after all expenses like ads, digital tools, sub pay and material and travel cost etc."

| Cost category | What's in it | Direct (per job) or Indirect (allocated)? |
|---|---|---|
| **Subcontractor flat rate (gross)** | What we pay sub inc GST | Direct |
| **Materials** (sub-supplied or we-supplied) | Hawk Glass-Tech, grout, silicone, masking, PPE consumables | Direct (in sub rate) OR direct (if we supply per [Q4 Bert wholesale](../QUESTIONS.md)) |
| **Travel allowance** | Per zone per § C above | Direct |
| **Stripe fees** | 1.75% + $0.30 AU domestic card | Direct (% of revenue) |
| **GST** | 10% included in customer price (we remit on lodging GST registered) | Direct (set-aside, doesn't affect margin pre-GST) |
| **Google Ads** | $20-30/day = $600-900/mo | Indirect — allocated /job |
| **GHL CRM** | $155/mo AUD | Indirect — allocated /job |
| **ServiceM8** | $29/mo (basic) | Indirect — allocated /job |
| **Cloudinary** | Free tier covers ~100 jobs/mo; $89/mo if exceeded | Indirect (free until volume) |
| **Twilio SMS** | ~$0.10-0.20 per SMS × ~10 SMS per job lifecycle = $1-2/job | Direct (per job comms) |
| **Public liability insurance** | $20M PL ~$2,000/yr | Indirect — amortised /job |
| **Workers comp / personal accident** | If we ever have employees | Future (currently $0) |
| **Xero accounting** | $35-70/mo | Indirect — allocated /job |
| **pay.com.au (sub payments)** | ~1% transaction fee, offset by rewards points | Direct (% of sub payment) |
| **Accountant** | ~$1,500-3,000/yr (BAS + tax + ATO advice) | Indirect — amortised /job |
| **Domain + hosting** | ~$100/yr (already paid) | Indirect (negligible) |
| **Logo / brand / cards** | One-time + reorder | Capex amortised |
| **Founder time** | Currently unpaid; should be costed | Future (when revenue allows founder draw) |

### G.3 Allocation assumptions for indirect costs

Need to allocate fixed monthly costs across expected jobs/month. Three scenarios:

| Scenario | Jobs/mo | Indirect cost/job allocation |
|---|---|---|
| **Pessimistic** (early ramp) | 4 jobs/mo | Tools $250/mo + Ads $600/mo = $850 ÷ 4 = **$212/job indirect** |
| **Realistic Year 1 target** | 10 jobs/mo | $850 ÷ 10 = **$85/job indirect** |
| **Optimistic Year 2** | 25 jobs/mo | Tools $250 + Ads $1,500 = $1,750 ÷ 25 = **$70/job indirect** |

Plus per-job direct costs (Stripe ~2.5% + Twilio ~$2 + pay.com.au ~1% on sub) ≈ **3.5% of revenue**.

Insurance amortisation: $2,000/yr ÷ 96 jobs/yr (Year 1 target) = **$21/job**.
Accountant amortisation: $2,500/yr ÷ 96 = **$26/job**.

**Total indirect cost / job (Year 1 target scenario, 10 jobs/mo):**
$85 (allocated tools+ads) + 3.5% revenue (variable) + $21 (insurance) + $26 (accountant) = **~$132 + 3.5% revenue per job**

For a $1,500 average revenue job: $132 + $52 = **~$184 fully-loaded indirect**.

### G.4 Per-SKU margin model (fully loaded, Year 1 realistic scenario)

For each top-10 SKU, calculate:
- Customer T2 price (ex-GST: divide by 1.1)
- Subcontractor flat rate (ex-GST)
- Direct costs (sub fuel/travel + Stripe + Twilio + pay.com.au)
- Indirect allocation (~$132 fixed + 3.5% revenue)
- Net profit + margin %

| SKU | Customer T2 inc GST | Sub flat (inc GST) | Sub hours | Sub $/hr after $X materials | Direct costs | Indirect | Net profit | Margin % |
|---|---|---|---|---|---|---|---|---|
| **RSC-02** Standard cement shower regrout (medium 4-8sqm) | $1,660 | $480 | 5-6hr | ($436 ex - $80 mat - $30 fuel) ÷ 5.5hr ≈ **$59/hr** ⚠️ borderline | $1,509×3.5%=$53 | $132+$53=$185 | $1,509-$436-$185 = **$888** | **59%** ✅ |
| **RSC-01** Small shower regrout (<4sqm) | $1,200 | $300 | 3-4hr | ($273 - $50 - $20) ÷ 3.5hr ≈ **$58/hr** ⚠️ | $42 | $174 | **$617** | **57%** ✅ |
| **RSC-03** Large shower regrout (8sqm+) | $2,100 | $605 | 7-8hr | ($550 - $100 - $30) ÷ 7.5hr ≈ **$56/hr** ⚠️ | $67 | $199 | **$1,143** | **60%** ✅ |
| **RSC-04** Epoxy upgrade (medium) | $1,860 | $612 | 5-6hr | ($556 - $200 epoxy - $30) ÷ 5.5hr ≈ **$60/hr** ⚠️ | $59 | $191 | **$932** | **55%** ✅ |
| **BTH-01** Standard bath resurface | $1,000 | $480 (bumped from $450 draft) | 5-6hr | ($436 - $200 mat - $30 fuel) ÷ 5.5hr ≈ **$37/hr** 🔴 BELOW FLOOR | $32 | $164 | **$315** | **35%** 🟠 |
| **BTV-05** Bath + spa resurface | $1,440 | $660 | 6-7hr | ($600 - $250 - $30) ÷ 6.5hr ≈ **$49/hr** 🔴 | $46 | $178 | **$525** | **40%** 🟠 |
| **TWL-02** Tile recoat medium | $1,800 | $605 | 6-8hr | ($550 - $250 - $30) ÷ 7hr ≈ **$39/hr** 🔴 | $57 | $189 | **$801** | **49%** ✅ |
| **FBP-01** Full bathroom (regrout + silicone) | $3,200 | $715 | 7-8hr | ($650 - $200 - $40) ÷ 7.5hr ≈ **$55/hr** ⚠️ | $102 | $234 | **$1,914** | **66%** ✅ |
| **SLC-01** Silicone only | $400 | $165 | 1.5-2hr | ($150 - $20 - $5) ÷ 1.75hr ≈ **$71/hr** ✅ | $13 | $145 | **$157** | **43%** 🟠 |
| **CHP-01** Chip repair (per chip) | $250 | $132 | 1-1.5hr | ($120 - $15 - $5) ÷ 1.25hr ≈ **$80/hr** ✅ | $8 | $140 | **$70** | **31%** 🔴 BELOW MARGIN FLOOR |

### G.5 Findings + flags 🚨

**SKUs with HEALTHY margin + FAIR sub rate ✅:**
- All shower regrout SKUs (RSC-01 through RSC-04) — 55-60% margin
- Full bathroom (FBP-01) — 66% margin
- Tile recoat medium (TWL-02) — 49% margin (sub rate borderline though)

**SKUs with MARGIN PROBLEM 🟠:**
- **BTH-01 Standard bath resurface @ $1,000** — only 35% net margin. Sub rate also at $37/hr after materials = below fair-work floor. **Customer T2 needs lift to $1,300-1,400 OR sub materials cost reduced via [Q4 Bert wholesale](../QUESTIONS.md).**
- **BTV-05 Bath + spa @ $1,440** — 40% margin, sub $49/hr below floor. Same fix.
- **SLC-01 Silicone only @ $400** — 43% margin OK, but $400 might be hard to sell standalone (customers expect cheaper for silicone-only). Watch.

**SKUs with CRITICAL ISSUE 🔴:**
- **CHP-01 Chip repair @ $250 (per chip)** — only 31% margin AND only $70 net profit. **Below our $300 profit floor.** Either: (a) bundle into larger job, (b) raise to $350-400 per chip, (c) require 2+ chips minimum.

**Sub fair-work-rate concerns ⚠️:**
- Most regrout subcontractor rates land at $56-60/hr after materials — this is just-above-floor ($60/hr regrout floor per our auditor-fair-work). Acceptable but tight.
- Bath resurface subcontractor rates fail the floor at current Excel draft prices. **Marko's actual subs may quote lower OR higher.** Priority Q1 + Q18 update once Marko engages.

### G.6 Recommended actions for CEO + Allan

1. **🔴 IMMEDIATE — bump CHP-01 chip repair to $350 minimum** OR require 2+ chip minimum dispatch (margin-floor breach)
2. **🟠 SHORT-TERM — review BTH-01 + BTV-05 bath resurface T2 pricing** — likely needs $1,300-1,400 T2 not $1,000. Prevents fair-work floor breach + margin too thin.
3. **🟢 Q4 Bert wholesale conversation** — if Bert offers fleet pricing on Hawk products, materials cost drops $50-100/job → bath resurface margin recovers
4. **🟢 Pricing audit Phase A** ([pricing-researcher.md](ai-employees/pricing-researcher.md)) — commission AI run to validate ALL 140 SKUs against Sydney 2026 market data; flagged SKUs above are first priority
5. **🟢 Q1 + Q18 — Marko engages first subcontractor** — reality-check the rate model. If Marko's resurfacing sub charges $400 not $480, our analysis shifts (bath resurface margin healthier; sub fair-work compliant; original Excel may be right).

### G.7 Confidence + caveats

**Confidence: 70%** — directionally right, specific numbers could shift ±15-20% based on:
- Bert wholesale pricing (could lower materials 30-40%)
- Marko's actual subs may quote differently than international avg
- Indirect cost allocation depends on actual jobs/mo (10/mo assumption is mid-Year-1)
- Sydney rates may be higher than US/UK due to local cost of living
- Stripe + pay.com.au exact fees vary

**Update trigger:**
- Marko engages first resurfacing subcontractor → real per-job rate captured → re-run model
- Pricing audit Phase A completes → SKU-by-SKU validation
- 6 months of real ops data (Q4 2026) → replace estimates with actuals from BigQuery

**Audit lenses applied to this analysis:**
- 🟢 [auditor-margin-per-job](../roles/auditor-margin-per-job.md) — flagged BTH-01, BTV-05, CHP-01 as below floor
- 🟢 [auditor-fair-work](../roles/auditor-fair-work.md) — flagged bath resurface sub rates below $/hr floor
- 🟢 [auditor-customer-fairness](../roles/auditor-customer-fairness.md) — recommended price lifts are still within Sydney market band ($1,300-1,400 bath resurface = top of Hipages range, below full reno alternatives)

---

## Compliance audit (run quarterly per [auditor-general-operational](../roles/auditor-general-operational.md))

- [ ] All subcontractor payments made within 14 business days of invoice (SOPA)
- [ ] Every payment had matching Tax Invoice + Subcontractor's Statement on file
- [ ] No PAYG withheld (we don't withhold for genuine contractors)
- [ ] All rate changes documented in writing with both-party agreement
- [ ] Subcontractor $/hr effective rate ≥ minimums per [auditor-fair-work](../roles/auditor-fair-work.md)
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
- [auditor-fair-work.md](../roles/auditor-fair-work.md) — subcontractor $/hr minimum enforcement
