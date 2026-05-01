# Pricing Schedule Audit — May 2026

**Purpose:** Deep audit of `data/pricing/master-pricing-2026-05-01-snapshot.xlsx` (140 SKUs, T1/T2/T3 tiers) against real Sydney 2026 market data, Bert/AUSTRS material costs, fair subcontractor rates, and Jordan/Surface Care 47% margin benchmark.

**Owner:** CEO designs + executes audit; Allan approves recommended Excel changes; CEO commits Excel updates to data/pricing/.

**Status:** ⏳ Specification complete, audit execution scheduled next session

**Phase:** Phase 2 (pre-quote-templates)

---

## Why this audit matters NOW

1. Excel is a **draft** per Allan — needs careful validation before customer quotes go out
2. **Customer #1 already in pipeline** (Marko's referrer) — needs accurate quote
3. **First quote we issue sets pricing precedent** — change-it-later is expensive
4. **Jordan benchmark = 47% margin** — fact-checked from transcripts. We're at 42-57% across Excel. Need to validate the soft spots.
5. **BTH-01 standard bath resurface = 42% margin** flagged as below-benchmark anomaly (likely material cost underestimated per Bert real prices)

---

## Methodology — the 3-auditor pattern (5 lenses available)

Per [CEO playbook § Methodology](../CEO.md), every meaningful pricing decision passes through 3 minimum auditors. For this audit:

| # | Auditor | What they check |
|---|---|---|
| 1 | [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md) | Customer perspective: market band, transparency, no surprise fees, value-for-money signal |
| 2 | [auditor-fair-work.md](../roles/auditor-fair-work.md) | Subcontractor perspective: $/hr fair, take-home justifies risk + own-tools/insurance/no-benefits, indep contractor test passes |
| 3 | [auditor-margin-per-job.md](../roles/auditor-margin-per-job.md) | Business perspective: $300+ floor, 47%+ Jordan benchmark, sustainable cash, no leak through travel/PPE/overhead |
| 4 | [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) | Regulatory: warranty claims accurate, ACL-compliant, no misleading conduct |
| 5 | [expert-pricing-trade.md](../roles/expert-pricing-trade.md) | Domain: NSW reality on hours, materials, market — used as primary lens |

**Reconciliation:** if all 3 of (customer + subcontractor + business) agree → ship. If 2 of 3 → trade-off documented. If only 1 → don't ship; rethink.

---

## Audit scope — phased

### Phase A: Top 20 SKUs (highest priority — covers 80%+ of expected volume)
Focus on the SKUs most likely to be quoted in first 6 months:

**Showers:**
- RSC-01 Small shower regrout (cement)
- RSC-02 Standard shower regrout (cement)
- RSC-03 Large shower regrout (cement)
- RSE-01 Small shower regrout (epoxy)
- RSE-02 Standard shower regrout (epoxy)
- RSE-03 Large shower regrout (epoxy)

**Baths:**
- BTH-01 Standard bath resurface
- BTH-02 Large bath resurface
- BTH-03 Freestanding/clawfoot bath resurface
- SOB-01..04 Shower-over-bath SKUs (combo unit — for Marko's customer #1)
- BTV-05/06 Spa bath resurface

**Basins:**
- BSN-01 Standalone basin resurface
- BSN-02 Basin add-on (same property)
- BSN-03 Double basin add-on

**Silicone:**
- SIL-01..04 (shower / bath / shower+bath / full)

**Floor + Walls (regrouting):**
- BFR-01..02 Floor regrout cement (small/standard)
- BFR-03..04 Floor regrout epoxy (small/standard)
- BWR-01..02 Wall regrout (cement/epoxy)

**Full bathroom:**
- FBP-01 Standard cement
- FBP-02 Standard epoxy
- FBP-03 Family large
- FBP-04 Family large epoxy

**Modifiers:**
- Strip-back surcharge (Rejection #9 territory) — needed for Marko's customer #1
- Travel zone surcharges
- Multi-bathroom discounts

### Phase B: Next 30 SKUs (medium priority)
After Phase A approved, expand to:
- Tile resurfacing (TSR series)
- Vanity SKUs (VAN, VCR, LBR)
- Chip repair (CHR series)
- Tile replacement (TRP series)

### Phase C: Long-tail SKUs (low priority)
- Specialist SKUs (DTL, GCS, GRS, RST, HWD, etc.)
- Spot-check via consistency rules (margin %, $/hr, tier ratios)
- Flag outliers for human review

---

## Audit checklist per SKU

For each SKU, validate against this checklist:

### A. Hours estimate validation
- [ ] Compare to expert-pricing-trade reality benchmarks (e.g., RSC-02 should be 6-9hr, current 7hr ✓)
- [ ] Account for: setup, prep, cure intervals, cleanup
- [ ] Flag if outside ±20% of real-world Sydney operator range

### B. Materials cost validation
- [ ] Cross-reference Bert/AUSTRS CSV for resurfacing materials (resin, primer, etch, cleaners)
- [ ] Cross-reference Bunnings/local trade supplier for regrouting materials (cement grout, silicone, blades)
- [ ] Include consumables (drop cloths, masking, gloves)
- [ ] Flag if Excel cost differs >15% from real-world

### C. PPE cost validation
- [ ] Realistic per-job PPE: $15-25 typical
- [ ] Flag if Excel PPE differs significantly (>$40 may be over, <$10 may be under)

### D. Subcontractor labour validation (sub-fairness lens)
- [ ] Calculate Subcontractor $/hr = Subcontractor Labour ÷ Hours
- [ ] Compare to market floor:
  - Resurfacing skilled: ≥$70/hr
  - Regrouting skilled: ≥$60/hr
  - Silicone-only: ≥$50/hr
- [ ] Flag if below market floor (subcontractor feels exploited) OR significantly above (eats margin)
- [ ] Sanity check: would a subcontractor with own ABN, insurance, tools take this rate for steady jobs?

### E. Total cost reconciliation
- [ ] Total Cost = Materials + PPE + Subcontractor Labour
- [ ] Add overhead allocation (~$10-15/job for tools/admin/marketing)
- [ ] Flag if missing categories (e.g., travel for outer zones)

### F. T2 price market validation (customer-fairness lens)
- [ ] Compare to market average band per service:
  - Standard shower regrout: $1,100-1,400 (we're $1,660 — premium-ish, justified by warranty/quality?)
  - Standard bath resurface: $750-1,000 (we're $1,000 — top of average, reasonable)
- [ ] Flag if below cheapest cowboys (signals shortcut perception) OR above premium (need premium delivery to match)

### G. Profit + margin validation (business lens)
- [ ] Profit @ T2 = (T2 ÷ 1.1) − Total Cost
- [ ] Profit ≥ $300 floor (HARD)
- [ ] Margin % ≥ 47% benchmark (target — soft)
- [ ] Margin % ≤ 65% (above this signals price-too-high; customer fairness flag)

### H. Tier ratios consistency
- [ ] T1:T2 ratio = 1.20-1.35× (premium tier should justify price)
- [ ] T3:T2 ratio = 0.78-0.85× (budget tier should still be margin-positive)
- [ ] Flag if outside these ratios

### I. Warranty terms validation (compliance lens)
- [ ] Cement grout: 2-year (Excel current ✓)
- [ ] Epoxy grout: 5-year (Excel current ✓)
- [ ] Bath resurface: 5-year private home / 6 months rental (Bert benchmark)
- [ ] No 7+ year claims (Bert: "not in control of yourself")
- [ ] Flag any "lifetime" or vague claims

### J. SKU description / scope clarity
- [ ] Service name, area, dimensions, scope, "How to Judge from Photo" all readable
- [ ] No internal jargon leaking to customer-facing fields
- [ ] Flag ambiguous descriptions

---

## Specific known issues to investigate (Phase A priority)

### Issue 1: BTH-01 below 47% benchmark (42%)
**Current:** Materials $155, PPE $5, Subcontractor Labour $370, Total $530, T2 $1,000, Profit $379, Margin 42%

**Hypothesis:** Materials underestimated. Real bathtub resurface materials per Bert prices:
- Glas-Tech 9100 1qt: ~$68
- Catalyst (1/4 qt): ~$17
- Ultragrip primer + catalyst (1qt of each): ~$130
- Etch (1/4 of 32oz): ~$14
- Cleaners + Surface Wash: ~$20
- Drop cloths/masking/masks: ~$15
- Misc: ~$10
- **Real cost: ~$274** vs Excel $155

If real materials are $274:
- New total cost = $274 + $5 + $370 = $649
- T2 of $1,000 → ex-GST $909
- Profit = $260 — BELOW $300 FLOOR 🔴

**Implication:** Either (a) raise BTH-01 T2 to ~$1,100-1,200 OR (b) confirm $155 materials is accurate (maybe subcontractor buys cheaper materials than retail Bert prices).

**Action:** AUDIT-RESEARCH → confirm with Marko's resurfacing subcontractor network what they actually pay for materials; OR confirm with Bert if there's a wholesale-bulk discount we're getting.

### Issue 2: PPE costs vary widely between similar SKUs
**Examples:**
- Shower regrout RSC-02: PPE $48 (high)
- Bath resurface BTH-01: PPE $5 (low)
- These are similar duration jobs — why 10× difference?

**Hypothesis:** Bath resurface PPE may be undercosted (still need respirator + filters for 2-pack spray which is more hazardous than regrouting).

**Action:** AUDIT — verify which SKUs have which PPE allocation; reconcile.

### Issue 3: Subcontractor $/hr varies — is it consistent?
**Examples:**
- RSC-01: $370 ÷ 5.5hr = $67.27/hr
- RSC-02: $460 ÷ 7hr = $65.71/hr
- RSE-02: $490 ÷ 8hr = $61.25/hr
- BTH-01: $370 ÷ 5.5hr = $67.27/hr
- FBP-01: $860 ÷ 12hr = $71.67/hr
- FBP-02: $940 ÷ 13hr = $72.31/hr

Subcontractor $/hr range = $61-72/hr. Mostly reasonable. Epoxy series ($61) is LOWEST despite being more skill-required — may be unfair to subcontractors.

**Action:** AUDIT — verify epoxy subcontractor take should be EQUAL or HIGHER than cement (more skill, more hazardous), not lower.

### Issue 4: SOB (Shower-over-bath) needed for customer #1
**Status:** Excel SKUs SOB-01..04 exist but I haven't extracted/reviewed.

**Action:** AUDIT — pull SOB rows from Excel, validate hours/materials/labour/price per audit checklist.

### Issue 5: Strip-back surcharge for previously coated surfaces
**Status:** Excel has Modifier R5 "Strip-back +$250" referenced in OPERATING-CONTEXT.md.

**Action:** AUDIT — verify $250 covers real strip-back time + materials per Bert "manually grind it out" guidance. May need higher charge if 2-3 hours of grinding needed.

---

## Deliverable format

Per Phase A audit (top 20 SKUs), CEO produces a single document `docs/specs/pricing-audit-2026-05-findings.md`:

For each SKU audited:
```
## SKU: RSC-02 — Standard shower regrout (cement)

### Current state
| Field | Value |
|---|---|
| Hours | 7 |
| Materials | $117 |
| PPE | $48 |
| Subcontractor Labour | $460 |
| Subcontractor $/hr | $65.71 |
| Total Cost | $625 |
| T2 Price | $1,660 |
| Profit @ T2 | $884 |
| Margin % | 58% |
| Warranty | 2-year (cement) |

### Audit findings
🟢 / 🟠 / 🔴 per item
- Hours: 🟢 Within 6-9hr realistic range
- Materials: 🟢 Validated against Bunnings 2026 prices
- PPE: 🟢 Reasonable
- Subcontractor $/hr: 🟢 $65.71 = fair AU 2026 skilled regrouter rate
- T2 price: 🟢 At top of $1,100-1,400 market band; warranty + brand justifies premium
- Margin: 🟢 58% beats 47% benchmark

### 3-auditor verdict
- Customer-fairness: 🟢 Fair price, transparent inclusions
- Sub-fairness: 🟢 $65.71/hr respects skilled trade time
- Business-margin: 🟢 58% margin ≥ 47% target

### Recommendation
✅ KEEP AS-IS. No changes.
```

For SKUs with issues, recommendation includes specific Excel cell changes:
```
### Recommendation: ADJUST
- Materials: $155 → $190 (+$35) — Bert real prices for bath resurface materials
- T2 Price: $1,000 → $1,100 (+$100) — restores 47% margin
- New Profit @ T2: $809 (was $379)
- New Margin: 49.0% (was 42%)
- Risk: customer-fairness check — $1,100 is still in $750-1,000 market band UPPER end. Acceptable given quality/warranty.
```

---

## Approval workflow

1. CEO completes audit (Phase A — top 20 SKUs)
2. CEO produces `pricing-audit-2026-05-findings.md`
3. Allan reviews findings
4. Allan approves changes (yes/no per SKU)
5. CEO updates `master-pricing-2026-05-XX-snapshot.xlsx` (versioned filename)
6. CEO commits Excel + findings doc
7. CEO updates [docs/roles/auditor-margin-per-job.md](../roles/auditor-margin-per-job.md) if floor benchmarks shifted

---

## Estimated effort

- Phase A (top 20 SKUs): ~3-4 hours of CEO work + 30 min Allan review
- Phase B (next 30): ~2-3 hours CEO + 20 min Allan review
- Phase C (long tail spot-check): ~1 hour CEO + 10 min Allan review

**Total to fully audit 140 SKUs: ~6-8 hours of CEO time over 2-3 sessions.**

---

## Research mandate before audit execution

Before this audit runs, CEO must:
- [ ] Web search current 2026 NSW trade hourly rates (skilled bathroom)
- [ ] Web search current Sydney bathroom resurfacing competitor pricing (3-5 competitors)
- [ ] Verify Bert/AUSTRS CSV is current (already verified 2026-04-30)
- [ ] Web search Bunnings + Reece + tradies' supply for current cement grout, silicone, blade prices (multiple brands per category)
- [ ] Cross-reference Hipages "average price for X" data (if accessible)
- [ ] Research SUB EQUIPMENT options (HVLP turbines, vacuums, sanders, fans, zip walls) with multiple brand alternatives at quality tier

## Approved materials & equipment list (deliverable B from this audit)

**Allan requirement (2026-05-01 PM):** "high quality even for disposable items as we want high quality jobs. Multiple approved items even if same product, different brands. We don't mind the brand as long as it's good quality."

Pricing audit produces a SECOND deliverable: an Approved Materials & Equipment List that tells subcontractors what to use. Per category, list 2-3 approved alternatives at the same quality tier so subcontractors can buy what's locally available without breaking standards.

### Categories to cover
| Category | Examples of approved-alternatives needed |
|---|---|
| **Cement grout (regrouting)** | Davco SuperColour / Mapei Ultracolor Plus / Ardex FG-C MicroTec |
| **Epoxy grout (regrouting premium)** | Mapei Kerapoxy / Davco Hydroepoxy / Laticrete SpectraLOCK |
| **Silicone (sanitary, mould-resistant)** | Selleys Wet Area / Sika Sanisil / Soudal Silirub MA / Bostik Cementone |
| **Grout removal blades** | Premium oscillating blades only — research brands |
| **Surface cleaners** | Cement: Sugar Soap / industrial degreasers. Resurfacing: Bert's Step 1 + Step 2 (no alternatives — Hawk system) |
| **Masking tape (no bleed)** | 3M Scotch Blue 2090 / Tesa Premium / Selleys 3-day painter's tape |
| **Drop cloths** | Pro-grade canvas (12oz+) — multiple Bunnings/Total Tools brands |
| **Disposable gloves** | Nitrile, powder-free, 4mm+: Ansell TouchNTuff / Bastion / Microflex |
| **Respirators** | 3M 6000-series half-mask + organic vapour cartridges / Sundström / Moldex |
| **HVLP turbine systems (resurfacing)** | Bert: Fuji Spray D6 / Apollo HVLP / Earlex Spray Station — confirm brand approvals |
| **Vacuums (dust extraction)** | Festool CT26 (premium) / Makita VC4710 / Bosch GAS 35 / Karcher WD entry+ |
| **Sanders** | Festool / Mirka / Bosch / Makita random-orbital with dust port |
| **Fans/extractors** | Bunnings industrial fan + flexible duct / portable HEPA negative-pressure unit |
| **Zip wall systems** | 12-pole zip wall (sourced AU locally) — verify brand options |

### Format for the future SOP
A separate file `docs/sop/sub-materials-standard.md` will contain the full approved list with:
- Category name
- 2-3 approved brand+SKU options
- Where to buy (Bunnings / Reece / Bert / Total Tools / etc)
- Approximate price per category
- Quality criteria (e.g., "any nitrile glove ≥4mm thickness, AS/NZS 4011 standard")
- What NOT to use (avoid list — e.g., dollar-shop tape that bleeds, super-cheap silicone that yellows)

**Trigger to build the SOP:** after first 2-3 subcontractors onboarded + CEO has run the pricing audit research with real Sydney supplier prices.

---

## Related documents

- Pricing Excel: `data/pricing/master-pricing-2026-05-01-snapshot.xlsx`
- Bert prices: `data/suppliers/austrs-bert-prices-2026-04-30.csv`
- Expert lens: [docs/roles/expert-pricing-trade.md](../roles/expert-pricing-trade.md)
- Auditors: [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md), [auditor-fair-work.md](../roles/auditor-fair-work.md), [auditor-margin-per-job.md](../roles/auditor-margin-per-job.md)
- Bert spec: [docs/specs/bert-supplier.md](bert-supplier.md)
- Margin benchmark source: Jordan/Surface Care transcripts (Videos 39, 41, 49)

---

*This audit is the most important business-fundamentals task in our 90-day plan. Pricing wrong = either lost revenue (under-priced) or lost customers (over-priced) for every quote we send. Worth doing right.*
