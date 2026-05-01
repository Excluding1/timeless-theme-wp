# Deep Audit — Form Gaps + Excel Pricing Review

**Date:** 2026-04-29
**Scope:** Every step + branch of QuoteForm.jsx, every SKU + modifier in Master Pricing Excel.
**Framing:** Find ALL gaps — let user decide what ships, what defers, what's accepted as-is.

---

## PART 1 — Form Flow Gaps

Walking every step + every conditional branch. Categorising as 🔴 critical, 🟡 worth fixing, ⚪ accepted by design.

### Step 1 — About you

✅ **Solid coverage:** name, phone (mobile or landline), email, customer type, tenant auth path, landlord email, company name (PM/Builder), honeypot, validation gates.

| Finding | Severity | Recommendation |
|---|---|---|
| No "preferred contact method" (SMS vs email vs call) | ⚪ | Skip — most flexible AU customers OK with multi-channel |
| No "best time to contact" | ⚪ | Skip — adds friction; tradies just leave voicemail |
| Builder type not segmented (hobbyist / small biz / major contractor) | ⚪ | Skip — `notes` field catches this when relevant |
| PM portfolio size not asked | ⚪ | Skip — pricing tier doesn't kick in until >5 properties; ask in follow-up call |

### Step 2 — Where

✅ **Solid:** address with NSW-restricted Google Places autocomplete, NSW chkAddr fallback, property type, lift access (apt only), waitlist for non-NSW.

| Finding | Severity | Recommendation |
|---|---|---|
| **No pre-1990 / asbestos check** (Excel Rejection #8) | 🔴 | **Add** — Yes/No/Unsure radio. Already on WP form (parity gap). |
| **No active-leak / water-damage flag** (Excel Rejection #4) | 🟡 | Add as Step 5 checkbox group OR rely on photo review |
| **No hollow-tiles flag** (Excel Rejection #5) | 🟡 | Same — Step 5 checkbox OR photo review |
| No bathroom-count question for PM/Builder | ⚪ | Design uses "Have another bathroom?" repeat-submit pattern — accepted |

### Step 3 — What (areas)

✅ **Solid:** 7 area checkboxes, full-bathroom shortcut, shower-over-bath flag, unsure mode with text description, contextual helpers.

| Finding | Severity | Recommendation |
|---|---|---|
| **Multi-mode (2+ areas) SKIPS services step** — goes straight to photos | 🔴 | **Fix** — see Part 1.5 below |
| No "how many of each fixture" (e.g., 2 showers in master bath) | ⚪ | Edge case — photos catch it |

### Step 4 — Services

| Finding | Severity | Recommendation |
|---|---|---|
| **Multi-mode renders nothing** — user picks 2+ areas, jumps straight to photos | 🔴 | **Fix** — show services per area as compact rows |
| **No spa bath flag** (Excel BTV-05/06, +$440 over standard) | 🔴 | **Add** — conditional on bath area + bath resurface pick |
| Chip count (1 vs 2-5) not asked | 🟡 | Excel CHR-01 ($280) vs CHR-02 ($390). Photo can usually count, but ambiguous. Consider quick add. |
| Niche/shelf count not asked (Modifier R11 +$100/niche) | 🟡 | Common in modern showers. Photo catches some, not all. |
| Tile material flag (natural stone, mosaic — pricing modifiers) | ⚪ | Photo review handles; minority of jobs |

### Step 5 — Photos + Submit

✅ **Solid:** photo upload per area (with client-side compression), previously-resurfaced flag, ventilation flag, notes, marketing consent, privacy notice, submit with 3-retry exponential backoff, honeypot bail.

| Finding | Severity | Recommendation |
|---|---|---|
| **No urgency selection** (Excel Modifier R16 +$150 for <48hr; R17 +$200 weekend) | 🟡 | Add 3-button: "ASAP / Within 2 weeks / Flexible". Captures revenue + sets expectation. |
| No preferred-timeline question | ⚪ | Covered by urgency above |
| No photo-count minimum (could submit 0 photos) | 🟡 | Usually customer adds at least 1. Add soft warning if 0? Or accept? |
| No drag-and-drop photo zone (button-only) | ⚪ | Mobile users dominate, mobile doesn't drag-drop. Accept. |
| No order summary screen before submit | 🟡 | Customer doesn't see "you're requesting: shower regrout + bath resurface" recap. Adding summary increases trust + reduces submit-then-realize-mistake. |

### Part 1.5 — Multi-mode services fix (recommended approach)

**Problem:** customer picks ["shower", "bath"] → form jumps to photos. GHL gets `areas: shower, bath` with no service detail. Tradie has to call to clarify.

**Three options:**

| Option | UX cost | Accuracy gain |
|---|---|---|
| **A. Loop through areas (sub-steps)** — show shower services → bath services → photos | Highest (extra clicks, longer form) | Highest (granular per-area picks) |
| **B. Single combined screen** — render all selected areas' services on one page, stacked | Medium (one long screen, scrollable) | High |
| **C. Use existing MULTI_ITEMS bundles** — show 2-3 high-level options per area | Low (compact bundle list) | Medium (less granular than single-mode services) |

**My pick: Option B.** One screen, no new step, customer sees everything at a glance. Use compact rows (no before/after card images) to keep the page short. Maintains the 5-step rhythm.

---

## PART 2 — Excel Pricing Audit

Reviewed 135 SKUs across 32 categories + 27 upcharges. Comparing against Australian 2026 market rates for bathroom resurfacing/regrouting.

### Pricing strategy assessment

**Three pricing tiers (T1/T2/T3):**
- T1 = premium (top of market)
- T2 = mid (default tier — what's quoted by default, looking at form integration)
- T3 = budget (price-sensitive customers)

**Margin distribution:**
- Average true margin: ~55% on T2 (healthy)
- Loss leaders (~40% margin): BTH-01 Standard Bath, BTV-01 Acrylic, BTV-04 Fibreglass — strategic baseline pricing
- Premium services (60%+ margin): GSP-01 grout spot, CHR-10 add-on chip, TBC-04 premium combo

**Sub-pay rates:** $60–$90/hr — fair NSW trades market rate. Median $67/hr. Premium packages pay $76–$87/hr. Reasonable.

### 🟢 What's priced well

| SKU | T2 Price | AU market range | Verdict |
|---|---|---|---|
| RGC-02 Std Shower Regrout (cement) | $1,380 | $800–$1,500 | Top of market — premium positioning |
| BTH-01 Standard Bath Resurface | $1,000 | $500–$1,000 | Market-aligned |
| VCR-02 Standard Cabinet Respray | $1,160 | $900–$1,500 | Mid-market |
| SFL-01 Stone-Fleck Vanity | $1,320 | $1,000–$2,500 | Mid-market |
| BTV-05 Spa Bath Standard | $1,440 | $1,200–$2,200 | Mid-market — fair |
| ASL-01 Anti-Slip Shower Floor | $230 | $150–$350 | Reasonable |
| CHR-01 Bath Chip Single | $280 | $180–$400 | Market-aligned |

### 🟡 Pricing concerns worth reviewing

#### 1. **Combo pricing within a single bathroom doesn't discount**

Example: CMB-02 Std Shower Regrout+Sil(C) + Std Bath Resurface = **T2 $2,870**

Component math:
- RSC-02 (Std Regrout+Sil Cement) = $1,660
- BTH-01 (Standard Bath) = $1,000
- Sum = $2,660
- **CMB-02 charges $210 MORE than sum of parts**

This is the opposite of typical AU bundle pricing. Customers expect "buy together, save 5–10%." Currently they pay a premium.

**Verdict:** Likely a pricing-engine bug or an intentional "we charge more for setup time on combo days" decision that may surprise customers. **Worth the user verifying the intent.**

Same pattern across all CMB and FBP SKUs — ~$120–$260 over sum of parts.

#### 2. **Anti-slip standalone may cause sticker shock**

ASL-01 Shower Floor: T2 **$230 for 45 minutes** ($307/hr revenue rate). Reasonable hourly margin for the business, but customer perception: "I'm paying $230 for a chemical wipe?"

**Recommendation:** Reposition as add-on — "Add anti-slip to any shower regrout/resurface for $149." Same margin, reframed value. Or bundle into shower base resurface (SBR-01).

#### 3. **Tile chip volume discount may be too steep**

- CHR-04 Single tile chip: $230 for 0.75h
- CHR-05 2-5 tile chips: $330 for 1.5h

Single-tile customer pays $230. Five-tile customer pays $330 = $66/tile. **Customer with 4 tiles vs 1 tile pays only $100 more for 4× the work.**

Tradies might lose money if "2-5 chips" customer turns out to be at the high end (5 chips = real 1.5h+ on site, plus higher material cost).

**Recommendation:** Either tighten brackets (CHR-05a "2-3 chips" $290, CHR-05b "4-5 chips" $390) OR expand to 6-10 chip tier.

Same pattern: CHR-02 Bath chips 2-5 = $390 (single $280 → 5-chip $390 = $78/chip). Watch the lower-bound profitability.

#### 4. **Acrylic + Fibreglass bath resurface margins are tight (38–40%)**

These are loss leaders. Two risks:
- One bad job (rework needed) wipes the margin entirely
- If sub rates rise (inflation), margin compresses to <30% quickly

**Recommendation:** Watch quarterly. Fine for Year 1 to win market share; revisit if more than 5% of jobs need rework.

#### 5. **Walk-in shower regrout (T2 $2,040 cement, $2,310 epoxy) is at the top of AU market**

AU market for walk-in shower regrout: $1,500–$2,400. Excel is at upper bound. Premium positioning is fine for Sydney CBD/Eastern Suburbs but could lose Hills/Western Sydney customers.

**Recommendation:** Consider zone-based T2/T3 routing — Eastern Suburbs gets T2, Western Sydney gets T3 by default. (Modifier R21 already adds +$50 for hard-water Hills areas — could combine with auto-tier logic.)

### 🔴 Pricing red flags / inconsistencies

#### 0. ✅ **RESOLVED 2026-04-29 — Non-shower epoxy regrouting SKUs missing**

User caught: form's `fl1` (floor regrout) and `wl1` (wall regrout) carry `epoxy: true` flag, but Excel had cement-only SKUs (BFR/BWR/FBR). Customers picking "epoxy floor regrout" got the same price as cement.

Verified via Australian industry research (GroutPro, Megasealed, Tile Rescue, Zephyr+Stone): **epoxy IS the recommended best practice for bathroom floors in AU 2026** — wet-area Building Code, mould resistance, no resealing schedule. The form's flag was correct; the Excel was incomplete.

**Fix applied:** added 5 new epoxy SKUs to Excel (R122-R126), totals updated to 140 SKUs.

**Sub-pay bumped per AU 2026 trades data + Modifier R6:** PayScale + Indeed + ServiceTasker show Sydney skilled trade rates $60-100/hr; epoxy specialist work commands premium. Modifier R6 in user's own Excel says "+$50 labour" for epoxy — now actually applied (existing shower epoxy SKUs were paying subs LESS than cement, which was inconsistent with stated policy).

Sub-labour formula: (hours × cement-equivalent hourly rate) + **$50 flat epoxy bonus**. Retail bumped ~7% to preserve 54-59% margin.

| New SKU | Hours | Materials | Sub-pay | Total cost | T1 | T2 | T3 | Margin | $/hr base |
|---|---|---|---|---|---|---|---|---|---|
| BFR-03 — Bathroom Floor Regrout: Small (Epoxy) | 4 | $95 | $300 (incl. $50 bonus) | $425 | $1,300 | $1,040 | $840 | 57.0% | $63 |
| BFR-04 — Bathroom Floor Regrout: Standard (Epoxy) | 6 | $135 | $410 | $580 | $1,770 | $1,410 | $1,150 | 54.7% | $60 |
| BWR-02 — Bathroom Wall Regrout: Splashback/Half (Epoxy) | 5 | $135 | $350 | $515 | $1,550 | $1,240 | $1,010 | 54.3% | $60 |
| FBR-03 — Full Bathroom Regrout: Standard (Epoxy) | 15 | $300 | $1,055 | $1,410 | $4,640 | $3,700 | $3,020 | 58.1% | $67 |
| FBR-04 — Full Bathroom Regrout: Large (Epoxy) | 18 | $385 | $1,292 | $1,742 | $5,720 | $4,560 | $3,720 | 58.0% | $69 |

**Hour uplift rationale:** epoxy adds 0.5-1h per surface vs cement (industry pattern from your existing RGE/RSE/FLR-02/WLL-02 SKUs). Single-area jobs (BFR/BWR) get +0.5-1h. Full-bathroom (FBR) covers shower + floor + walls back-to-back, so total +3h vs cement equivalent — matches the cumulative reality of doing 3 epoxy surfaces in one job.

Pricing derived from AU 2026 market data + existing shower cement→epoxy patterns. Warranty extended from 2yr (cement) to 4yr (epoxy) per material durability. Sub gets honest +$50 bonus for harder skilled work — matches Modifier R6 stated policy.

**Note for future review:** existing shower epoxy SKUs (RGE/RSE/FLR-02/WLL-02) currently pay subs LESS per hour than their cement counterparts — opposite of intended Modifier R6 policy. Worth aligning these to also include the $50 epoxy bonus when next pricing pass happens.

#### 1. **Combo pricing breaks bundle expectation** — already covered above. This is the biggest concern.

#### 2. **CHR-04 (Tile Chip Single Tile) and CHR-08 (Vanity Top Chip)** are both T2 $230 but are different surfaces requiring different prep. Possibly fine, possibly should differ. Worth user reviewing.

#### 3. **MIX-01 (Shower Regrout Only + Bath Resurface) = T2 $2,370** vs **CMB-01 (Std Shower Regrout(C) + Std Bath Resurface) = T2 $2,640.** These look like the same bundle but different prices. The difference is "Regrout Only" vs "Regrout+Sil" — but CMB-01 says just "Regrout(C)" not Regrout+Sil. **Possible naming inconsistency — worth user verifying.**

#### 4. **Modifier R6 says "Epoxy upgrade +$250 (built into E-series pricing)"** — meaning the +$250 is ALREADY in RGE/RSE prices, not added on top. But if the form sends `epoxy_preference: yes` AND the pricing engine independently looks up the E-series SKU, double-charging is possible. **Verify pricing logic in GHL workflow once webhooks wired (Phase 2).**

### Upcharges check (vs AU market)

| Modifier | Excel | AU norm | Verdict |
|---|---|---|---|
| Extreme mould +$150 | $150 | $100–$200 | ✅ Fair |
| Strip-back previous resurface +$250 | $250 | $200–$350 | ✅ Fair |
| Cast iron / antique bath +$200 | $200 | $150–$300 | ✅ Fair |
| Multi-storey no lift +$80 | $80 | $50–$150 | ✅ Conservative (low end) |
| Inner-city parking +$50 | $50 | $30–$80 | ✅ Fair |
| Urgency <48hr +$150 | $150 | $100–$300 | ✅ Reasonable |
| Weekend booking +$200 | $200 | $150–$400 | ✅ Reasonable |
| Hard water area +$50 | $50 | n/a (often free) | 🟡 Mild — most competitors absorb |
| Mosaic tiles <150mm +$350 | $350 | $200–$500 | ✅ Fair |
| Stone-fleck premium +$350 | $350 | $300–$500 | ✅ Fair |

**Verdict:** Upcharges are reasonable. None look gouge-y or under-priced.

### Multi-bathroom discounts (vs AU market)

- 2nd bathroom: **−$200** (AU market: $100–$300 discount) ✅ Fair
- 3rd bathroom: **−$300** ✅ Fair
- 4+ PM portfolio: **−$300/extra** ✅ Generous (good for B2B retention)
- Ongoing PM contract 5+/quarter: **−$350/extra + priority** ✅ Strong B2B incentive

These are well-structured.

---

## Combined Recommendations (Ranked by Impact × Effort)

### 🔴 P0 — Ship soon (high impact, low effort)

| # | Change | Effort | Impact |
|---|---|---|---|
| 1 | **Multi-mode services screen** (Option B — combined per-area picks) | 2 hrs | Stops every multi-area lead requiring a clarifying call. Big tradie-time saver. |
| 2 | **Asbestos check on Step 2** | 30 min | Restores parity with WP form. Legal/safety baseline. |
| 3 | **Spa bath flag on Step 4** | 30 min | Captures BTV-05/06 vs BTH-01 — ~$440/job pricing accuracy |

**Total: ~3 hrs of dev. Closes the largest revenue/operational gaps.**

### 🟡 P1 — Consider next (medium impact, low-medium effort)

| # | Change | Effort | Why |
|---|---|---|---|
| 4 | **Urgency selector on Step 5** (ASAP / 2 weeks / Flexible) | 30 min | Captures Modifier R16/R17 revenue ($150–$200 per urgent job) |
| 5 | **Order summary before submit** | 1 hr | Trust signal, reduces submit-regret bouncebacks |
| 6 | **Active-leak / hollow-tiles checkbox group on Step 5** | 30 min | Catches Excel Rejection #4/#5 before truck-rolls waste tradie time |

### ⚪ P2 — Defer / accept (low impact OR high effort)

- Chip count brackets in form (rely on photos)
- Niche/shelf count (rely on photos)
- Tile material flag (rely on photos)
- Drag-drop photo zone (mobile-first, not needed)
- Builder/PM segmentation (notes field catches it)

### 💰 Pricing actions (Excel side — your call)

| # | Excel finding | Action |
|---|---|---|
| 1 | Combo pricing in single bathroom is more than sum of parts | **Verify intent.** If unintentional, consider 5–10% bundle discount. If intentional ("setup time premium"), accept + maybe explain to customers. |
| 2 | Anti-slip standalone $230 sticker shock | Reposition as add-on or bundle into shower base resurface |
| 3 | Tile chip 2-5 too compressed pricing | Consider 2-3 vs 4-5 brackets |
| 4 | MIX-01 vs CMB-01 naming inconsistency | Verify these are different services or align naming |
| 5 | Walk-in shower at AU market top | Consider auto-tier by suburb (Eastern T2, Western T3) |
| 6 | Epoxy "+$250" double-charge risk | Verify GHL workflow doesn't duplicate when both `epoxy_preference=yes` AND E-series SKU sent |

---

## What I want to ship vs. ask first

**Ship (with your nod):** items #1, #2, #3 from P0 above. ~3 hours of focused work, closes the biggest gaps, fits the existing audit-fix-audit pattern.

**Ask first:**
- Pricing items — I can flag concerns but you own the business decisions on pricing strategy.
- P1 items — depends on how much friction you want vs accuracy.

**Accept as-is:** all P2 items.

---

## My honest expert verdict

The form is in **good shape** — 11 cycles of hardening have made it solid. The 3 P0 fixes are the genuinely missing pieces. After those, you're at ship-quality for Phase 1 and can move to GHL webhook wiring (Phase 2) + Cloudinary photo upload (Phase 3).

The Excel pricing is **mostly correct + fair for Australian market**, with healthy margins and competitive sub-pay rates. The 6 pricing items I flagged are worth a 30-minute review pass, not a structural rework.
