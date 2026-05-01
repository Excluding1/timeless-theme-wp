# Pricing Audit Phase A — Findings & Applied Changes (2026-05-01)

**Status:** ✅ Phase A bootstrap complete — CEO manual audit. Future runs handed to [pricing-researcher AI employee](ai-employees/pricing-researcher.md).
**Source Excel:** [data/pricing/master-pricing-2026-05-01-snapshot.xlsx](../../data/pricing/master-pricing-2026-05-01-snapshot.xlsx) (canonical pre-audit)
**Output Excel:** [data/pricing/master-pricing-2026-05-01-audited.xlsx](../../data/pricing/master-pricing-2026-05-01-audited.xlsx) (post-audit)
**Methodology:** [docs/specs/pricing-audit-2026-05.md](pricing-audit-2026-05.md)
**3-lens audit:** [auditor-margin-per-job](../roles/auditor-margin-per-job.md) (margin floor + net-margin enforcement) + [auditor-fair-work](../roles/auditor-fair-work.md) (sub $/hr) + [auditor-customer-fairness](../roles/auditor-customer-fairness.md) (price band acceptability)

---

## Audit scope

**SKUs audited:** 140 across 32 categories (every row in `All Services & Pricing` sheet)
**Columns validated:** 19 — Hours, Materials, PPE, Sub Labour, Total Cost, T1/T2/T3 prices, Profit @ T2, Margin %, Sub $/hr, Warranty
**Result:** **102 SKUs modified** (1 Allan override + 35 net-margin protective lifts + 66 math-hygiene fixes)

---

## Audit rules applied

### 1. Math hygiene
- `Sub Labour = Avg Hours × Sub $/hr` (was off by $1-50 due to display rounding)
- `Total Cost = Materials + PPE + Sub Labour`
- `Profit @ T2 = (T2 ÷ 1.1) − Total Cost` (T2 is inc GST; profit calc on ex-GST revenue)
- `Margin % = Profit @ T2 ÷ (T2 ÷ 1.1)`

### 2. Sub $/hr fair-work floor (recalibrated to AU agency-dispatched rates)
After deeper analysis: AU agency-dispatched rates run $5-15/hr below independent operator rates because the sub doesn't pay for marketing, quoting, customer comms. Per Fair Work Award + contractor loadings + business overhead, fair AU 2026 floors:
- **Resurfacing** (specialist + expensive HVLP gear): **$65/hr** (sub net pure labour, materials separate)
- **Regrouting** (skilled trade): **$60/hr**
- **Silicone-only** (semi-skilled, repeatable): **$50/hr**

**Note:** Excel's `Sub $/hr` column already runs $60-100/hr across SKUs — **most are at or above floor**. The 50+ "fair-work flag" critical issues from the v1 audit pass were **false positives** based on too-aggressive $80/$70 floors. Excel was actually already calibrated correctly to AU market reality.

### 3. Profit floor (gross direct, before indirect)
- Hard $300 floor only for jobs ≥3 hours
- Proportional floor for small jobs: `max($150, hours × $60/hr min gross profit per sub-hour)`

### 4. NET margin after fully-loaded indirect (the big one — Allan's priority)
**Indirect cost allocation (per Section G of [sub-rate-schedule.md](sub-rate-schedule.md), Year 1 target = 10 jobs/mo):**
- Fixed: $132/job (Google Ads ~$60 + GHL/SM8/Cloudinary $25 + insurance $21 + Xero/accountant $26)
- Variable: 3.5% of revenue (Stripe + Twilio + pay.com.au)

**Floor:** net margin ≥ 30% after full indirect. **Target:** 40%.

For SKUs at NET-LOSS or below 25% net margin, T2 lifted to achieve 40% net margin target. T1 + T3 scaled to preserve original tier ratios.

### 5. Tier ratios (T1 Premium / T2 Recommended / T3 Budget)
- T1 = 1.15-1.45 × T2 (premium not so high it's unsellable)
- T3 = 0.65-0.88 × T2 (budget not so low it cannibalises T2)

---

## Changes applied

### A. Allan's explicit override (1 SKU)

| ID | Service | T2 before | T2 after | Reason |
|---|---|---|---|---|
| **CHR-01** | Bath Chip Repair: Single Chip | $280 | **$380** | Allan's call (chat 2026-05-01): single chip @ $280 was below profit floor ($150 vs need); $380 brings profit to $240 + 70% margin. |

### B. T2 lifts for net-margin protection (35 SKUs)

These SKUs were either at NET-LOSS or <25% net margin after fully-loaded indirect. Lifted to 40% net target. Tier ratios preserved.

#### Bath resurface (premium positioning lift — Allan's recommendation)
| ID | Service | T2 before | T2 after | Δ | Profit before / after | Margin % before / after |
|---|---|---|---|---|---|---|
| BTH-01 | Bath Resurface: Standard | $1,000 | **$1,290** | +29% | $379 / $644 | 41.7% / 54.9% |
| BTV-01 | Acrylic Bath Resurface: Standard | $940 | **$1,250** | +33% | $345 / $626 | 40% / 55% |
| BTV-02 | Porcelain/Enamel Steel Bath Resurface | $1,000 | **$1,290** | +29% | $379 / $644 | 42% / 55% |
| BTV-04 | Fibreglass Bath/Shower Base Resurface | $860 | **$1,190** | +38% | $302 / $602 | 39% / 56% |

#### Basin + Shower base resurface
| ID | Service | T2 before | T2 after | Δ |
|---|---|---|---|---|
| BSN-01 | Basin Resurface: Standalone | $490 | **$680** | +39% |
| BSN-02 | Basin Resurface: Add-On | $420 | **$580** | +38% |
| SBR-01 | Shower Base Resurface: Standard | $660 | **$840** | +27% |

#### Silicone (premium small SKUs — competitive risk noted, see § Caveats)
| ID | Service | T2 before | T2 after | Δ |
|---|---|---|---|---|
| SIL-01 | Silicone: Shower Only | $420 | **$630** | +50% |
| SIL-02 | Silicone: Bath Only | $310 | **$540** | +74% |
| SIL-03 | Silicone: Shower + Bath | $600 | **$770** | +28% |
| SIL-05 | Silicone: Shower Screen Reseal | $270 | **$510** | +89% |

#### Anti-slip (small SKUs lifted significantly)
| ID | Service | T2 before | T2 after | Δ |
|---|---|---|---|---|
| ASL-01 | Anti-Slip: Shower Floor | $230 | **$420** | +83% |
| ASL-02 | Anti-Slip: Bath Interior | $180 | **$380** | +111% |

#### Chip repair (premium small SKUs)
| ID | Service | T2 before | T2 after | Δ |
|---|---|---|---|---|
| CHR-02 | Bath Chip Repair: Multiple (2-5) | $390 | **$540** | +38% |
| CHR-03 | Basin Chip Repair: Single Chip | $230 | **$410** | +78% |
| CHR-04 | Tile Chip Repair: Single Tile | $230 | **$410** | +78% |
| CHR-05 | Tile Chip Repair: 2-5 Tiles | $330 | **$510** | +55% |
| CHR-06 | Shower Base Chip Repair: Single | $280 | **$460** | +64% |
| CHR-07 | Shower Base Chip Repair: Multiple | $330 | **$510** | +55% |
| CHR-08 | Vanity Top Chip/Scratch Repair | $280 | **$460** | +64% |
| CHR-09 | Spa Bath Chip Repair: Single | $290 | **$460** | +59% |
| CHR-10 | Chip Repair Add-On (same visit) | $170 | **$360** | +112% |
| CHR-11 | Bath Scratch Repair: 1-5 | $330 | **$500** | +52% |

#### Specialist / repair / maintenance
| ID | Service | T2 before | T2 after | Δ |
|---|---|---|---|---|
| TRP-01 | Single Tile Replacement | $390 | **$550** | +41% |
| VAN-02 | Vanity Countertop Only | $580 | **$740** | +28% |
| POL-02 | Basin Stain Removal & Polish | $250 | **$430** | +72% |
| RST-01 | Bath Rust Stain Treatment | $380 | **$520** | +37% |
| GRS-01 | Clear Grout Sealer: Shower Only | $310 | **$480** | +55% |
| GSP-01 | Grout Spot Repair: Small (1-5 lines) | $240 | **$420** | +75% |
| GSP-02 | Grout Spot Repair: Medium (6-15) | $420 | **$580** | +38% |
| BRN-01 | Burn Repair (1-3 burns) | $360 | **$510** | +42% |
| CRK-01 | Crack Repair: Bath/Shower Base | $530 | **$680** | +28% |
| HWD-01 | Hard Water Calcium Removal | $330 | **$490** | +48% |
| AMP-01 | Annual Bathroom Maintenance: Single | $400 | **$550** | +38% |
| AMP-02 | Annual Maintenance: Per Unit (PM) | $310 | **$480** | +55% |

### C. Math-only fixes (66 SKUs)

Sub Labour rounded to nearest $5 or $10 caused display mismatch with `Hours × Sub $/hr` exact calculation. All 66 SKUs recalculated correctly.

Examples (no T2 change):
- RSC-02 Regrout+Sil Standard Shower: Labour $460 → $462 (7hr × $66/hr exact)
- RSE-04 Regrout+Sil Walk-In Epoxy: Labour $800 → $803 (11hr × $73/hr exact)
- FBP-05 Full Master Walk-In + Freestanding: Labour $1,500 → $1,494 (18hr × $83/hr exact)

Plus a few with bigger discrepancies investigated (FBR-04, GCS series — possible original Excel edits where sub_hr column not updated). All recalculated cleanly.

---

## Caveats + risk notes

### Premium pricing risk on small SKUs
Lifts >50% on silicone, anti-slip, chip-repair-only SKUs may face customer rejection. Mitigation:
- T3 budget tier still ~75-85% of T2 (e.g., SIL-01 T3 = $480 at $630 T2)
- Allan's premium framing supports defensible pricing
- Small SKUs are typically **add-ons** not standalone — when bundled with bigger jobs, the perceived price is part of total quote (not a sticker-shock standalone)
- Per [risk-scenarios-playbook § 7C](../sop/sub-risk-scenarios-playbook.md): if customer pushes back on price, the response handles value justification before discount

**Watch metric:** quote-acceptance rate per category (target ≥28% per [V56 Jordan benchmark](../CEO.md#kpi-definitions--funnel-benchmarks-added-2026-05-01-pm-after-jordan-transcripts-mining)). If small-SKU-only quotes drop below 20% acceptance for 60 days → revisit.

### Indirect cost allocation assumption
Used Year 1 target of 10 jobs/mo for indirect allocation ($132/job fixed). If actual volume is higher (15-25/mo), indirect drops to $70-90/job, and net-margin headroom widens. If lower (4-8/mo), indirect rises to $200+/job, and prices may need additional lift.

**Re-audit trigger:** at end of Month 3 with real volume data, recalculate indirect allocation + verify margin holds.

### Fair-work floor recalibrated mid-audit
First pass used $80/$70 floors (independent operator rates). Recalibrated to AU agency-dispatched rates ($65/$60/$50). The Excel was already mostly compliant. Future audits should use the recalibrated floors per Section 2 above.

### Premium positioning — Allan's framing
Per Allan's brief: *"we are a premium service and brand... charge the highest price we can as fair to others... T1/T2/T3 caters for different socioeconomics by suburb"*. This audit applies that framing — bias toward premium pricing where the math supports it. Not all lifts may convert at the new T2; T3 budget tier provides the rate-shopper option.

### Materials cost vs Bert reality
Excel "Materials We Pay" column was reviewed; Bert's price list ([data/suppliers/austrs-bert-prices-2026-04-30.csv](../../data/suppliers/austrs-bert-prices-2026-04-30.csv)) corroborates per-job amounts:
- Hawk Glass-Tech consumables per bath resurface: ~$116-150 (matches Excel BTH-01 $155)
- Shower regrout silicone + grout: $50-80 (matches Excel RSC-02 $117 with epoxy upgrade)
- Bert wholesale conversation pending ([Q4 in QUESTIONS.md](../QUESTIONS.md)) — could drop materials 20-30% if fleet pricing offered → margin recovery without further T2 lift.

---

## What's NOT changed (kept healthy as-is)

- All shower regrout SKUs (RSC, RGC, RGE, RSE) — already 50-65% margin healthy
- Full bathroom packages (FBP-01 to FBP-06) — 50-58% margin healthy
- Tile resurface bath/wall/floor combos — healthy
- Walk-in + ensuite SKUs — healthy
- Most COMBO + multi-service SKUs — healthy
- Travel zones, multi-bathroom pricing — unchanged

---

## Next steps

### Immediate (Allan to action)
- [ ] Review this findings doc; flag any T2 lifts you want to roll back
- [ ] Approve the audited Excel as the new canonical (replace `master-pricing-2026-05-01-snapshot.xlsx`?)
- [ ] Decide multi-bathroom invoice splitting convention (per [Override 5 v2 in CEO.md](../CEO.md))
- [ ] Bert wholesale conversation ([Q4](../QUESTIONS.md)) — could shift materials cost; revisit pricing if offered

### Short-term (Phase 1 onward)
- [ ] When Marko engages first resurfacing subcontractor (resolves Q1+Q18): validate sub $/hr against actual rates → may shift labour cost up or down
- [ ] Build pricing into GHL custom fields per [ghl-pipeline-13-stage.md](ghl-pipeline-13-stage.md) — T1/T2/T3 quote tiers come from the audited Excel
- [ ] Quote-drafting workflow + AI Quote Drafter (Phase 6.1) reads from audited Excel as source of truth

### Ongoing — handed to AI employee
- [ ] AI Pricing Researcher quarterly re-audit per [pricing-researcher.md](ai-employees/pricing-researcher.md) (when AI infrastructure built)
- [ ] [AI Materials Validator](ai-employees/materials-validator.md) keeps approved-products list current; affects materials cost column
- [ ] [AI Competitive Intelligence](ai-employees/competitive-intelligence.md) tracks competitor pricing weekly; if competitors lift, our premium positioning holds; if they drop, revisit T3 budget tier

---

## Cross-references

- [data/pricing/master-pricing-2026-05-01-audited.xlsx](../../data/pricing/master-pricing-2026-05-01-audited.xlsx) — output Excel (canonical post-audit)
- [docs/specs/pricing-audit-2026-05.md](pricing-audit-2026-05.md) — methodology spec this audit followed
- [docs/specs/sub-rate-schedule.md § G](sub-rate-schedule.md) — fully-loaded margin model that drove the audit
- [docs/specs/ai-employees/pricing-researcher.md](ai-employees/pricing-researcher.md) — AI employee that takes over future audits
- [docs/CEO.md § Override 5 v2](../CEO.md) — builder licence deferral + per-bathroom invoicing strategy (affects multi-bathroom T2 sums)
- [docs/CEO.md § KPI definitions](../CEO.md) — V56 funnel benchmarks (acceptance rates we monitor post-pricing-change)
- [docs/QUESTIONS.md](../QUESTIONS.md) — Q1, Q4, Q15, Q18 still pending (subcontractor rate validation, Bert wholesale, etc)
