# Quote Form → Master Pricing SKU Map

**Source:** `MASTER_PRICING_UPDATED 111.xlsx` — sheet "All Services & Pricing" (135 SKUs)
**Form:** `src/QuoteForm.jsx` v9.2 — 27 customer-facing service options + 9 multi-mode bundles

---

## How the mapping works

The form is a **lead intake**, not a quote calculator. Customers don't see SKU codes — they pick from plain-English options like "Fix tiles + corners". Each form pick maps to **one or more SKUs** in the Excel; the tradie/sub picks the final SKU after seeing photos.

Mapping legend:
- **1:1** → Form pick maps to exactly one Excel SKU
- **1:N** → Form pick maps to several SKUs, photo review picks the right one
- **🟡 Ambiguous** → Form label is fuzzy, could land in multiple Excel categories
- **❌ Unmapped** → Form pick has no clear Excel home (gap to investigate)
- **🚫 Unreachable** → Excel SKU exists but no form path leads there

---

## Single-area mode

### Shower (sh1–sh6)

| Form ID | Form label | Excel SKUs | Type |
|---|---|---|---|
| sh1 | Fix tiles + corners | RSC-01..04 (cement) OR RSE-01..04 (epoxy) — picked via `epoxyPicks` flag, sized by photo | 1:N |
| sh2 | Fix just the tile lines | RGC-01..04 (cement) OR RGE-01..04 (epoxy) — same logic as sh1 | 1:N |
| sh3 | Fix mouldy corners only | SIL-01 (Shower Only) | 1:1 |
| sh4 | Resurface — change the tile colour | TSR-01..03 (walls only) OR TSR-04..06 (walls + floor), sized by photo | 1:N |
| sh5 | Fix a cracked tile | TRP-01 (1 tile) OR TRP-02 (2-4 tiles) — count from photo | 1:N |
| sh6 | Deep clean & protect | 🟡 GRS-01 (clear sealer) OR DTL-01 (detailing) — depends on what the customer means | 🟡 |

### Bath (bt1–bt4)

| Form ID | Form label | Excel SKUs | Type |
|---|---|---|---|
| bt1 | Resurface — make it look new | BTH-01/02/03 (size variants) OR BTV-01..06 (material variants — acrylic/porcelain/cast iron/fibreglass/spa) | 1:N |
| bt2 | Fix a chip or dent | CHR-01 (1 chip <20mm) OR CHR-02 (2-5 chips) — count from photo | 1:N |
| bt3 | Remove scratches / stains | 🟡 POL-01 (polish) OR CHR-11 (scratches) OR RST-01 (rust) OR HWD-01 (hard water) — needs photo + sometimes customer description | 🟡 |
| bt4 | Fix the mouldy seal | SIL-02 (Bath Only) | 1:1 |

### Basin (bs1–bs2)

| Form ID | Form label | Excel SKUs | Type |
|---|---|---|---|
| bs1 | Resurface — make it look new | BSN-01 (standalone) OR BSN-02 (add-on, same job as bath) OR BSN-03 (double — triggered by `basinCnt=2`) | 1:N |
| bs2 | Fix a chip or dent | CHR-03 (single basin chip <15mm) | 1:1 |

### Vanity (vn1–vn4)

| Form ID | Form label | Excel SKUs | Type |
|---|---|---|---|
| vn1 | Resurface the benchtop | VAN-01 (moulded — basin + top integrated) OR VAN-02 (countertop only) OR LBR-01/02 (laminate) — picked from photo | 1:N |
| vn2 | Repaint the cabinet | VCR-01 (small) OR VCR-02 (standard) — sized from photo | 1:N |
| vn3 | Give it a stone look | SFL-01 (Stone-Fleck Finish) | 1:1 |
| vn4 | Fix a chip or scratch | CHR-08 (vanity top chip/scratch) | 1:1 |

### Mould & corners (ml1–ml3)

| Form ID | Form label | Excel SKU | Type |
|---|---|---|---|
| ml1 | Just the shower corners | SIL-01 | 1:1 |
| ml2 | Shower + bath corners | SIL-03 | 1:1 |
| ml3 | Everywhere in bathroom | SIL-04 | 1:1 |

### Bathroom floor (fl1–fl5)

| Form ID | Form label | Excel SKUs | Type |
|---|---|---|---|
| fl1 | Fix lines between tiles | BFR-01 (small) OR BFR-02 (standard) — sized by photo | 1:N |
| fl2 | Resurface — change tile colour | TSR-07/08/09 (small/standard/large bathroom floor) | 1:N |
| fl3 | Make floor less slippery | ❌ ASL-01 exists for "Shower Floor Anti-Slip" only — bathroom floor anti-slip isn't a separate SKU. Currently maps to ASL-01 with override note. | ❌ |
| fl4 | Fix a cracked tile | TRP-01/02 OR CHR-04/05 (tile chip repair) | 1:N |
| fl5 | White powdery buildup | EFF-01 (Efflorescence Treatment) | 1:1 |

### Wall tiles (wl1–wl3)

| Form ID | Form label | Excel SKUs | Type |
|---|---|---|---|
| wl1 | Fix lines between wall tiles | BWR-01 (Bathroom Wall Regrout — half/splashback) | 1:1 |
| wl2 | Resurface wall tile colour | TSR-10 (half-height) OR TSR-11 (full-height) — picked from photo + customer description | 1:N |
| wl3 | Fix a cracked wall tile | TRP-01/02 (tile replacement) | 1:N |

---

## Multi-area mode (`multiPicks`)

When customer picks multiple areas, the form moves into "multi" mode with these bundle options:

| Multi ID | Form label | Excel SKUs (combo bundles) | Type |
|---|---|---|---|
| m_shower_regrout | Shower — fix tiles & corners | RSC-01..04 / RSE-01..04 | 1:N |
| m_shower_recoat | Shower — change tile colour | TSR-01..06 | 1:N |
| m_bath_resurface | Bath — make it look new | BTH-01..03 / BTV-01..06 | 1:N |
| m_bath_chip | Bath — fix a chip or dent | CHR-01/02 | 1:N |
| m_basin | Sink — make it look new | BSN-01..03 | 1:N |
| m_vanity | Vanity — refresh benchtop or cabinet | VAN-01/02, LBR-01/02, VCR-01/02 | 1:N |
| m_floor | Floor tiles — fix lines or colour | BFR-01/02 OR TSR-07..09 | 1:N |
| m_full | The whole bathroom needs a refresh | FBP-01..06 (Full Bathroom packages) — pricing engine bundles based on what's selected | 1:N |
| m_regrout_all | Fix all tile lines in whole bathroom | FBR-01 (standard) OR FBR-02 (large) | 1:N |
| m_maintenance | Annual maintenance check | AMP-01 (single bathroom) OR AMP-02 (per unit, PM) | 1:N |

**Combo SKUs reached implicitly via multi mode:**
- CMB-01..11 (Shower + Bath combos) ← when m_shower_* AND m_bath_resurface picked together
- MIX-01..03 (Mixed shower + bath variants) ← same trigger
- ENS-01..03 (Ensuite packages) ← detected via `prop="apt"` + small bathroom indicators
- TBC-01..04 (Tile + Bath combo) ← when m_shower_recoat AND m_bath_resurface picked
- TRC-01..03 (Tile + Regrout combo) ← when m_shower_regrout AND any m_*_recoat picked

---

## Modifiers & flags wired correctly

| Form field | Excel modifier | Status |
|---|---|---|
| `epoxyPicks` | Modifier R6 "Epoxy upgrade +$250" + RGE/RSE series | ✅ Wired |
| `showerOverBath` | SOB-01..04 (Shower-Over-Bath SKUs) | ✅ Wired |
| `basinCnt` (2 vs 1) | BSN-03 (Double Basin Add-On) | ✅ Wired |
| `lift` (apartment) | Modifier R14 "Multi-storey +$80" | ✅ Wired |
| `prevResurfaced` | Modifier R5 "Strip-back +$250" + Rejection #9 | ✅ Wired |
| `hasVentilation` | Rejection #19 (regroups + resurface jobs require fan) | ✅ Wired |
| `cust=pm` | Multi-bathroom contract pricing (5+/quarter discount) | ✅ Wired (via cust flag in payload) |

---

## 🚫 Excel SKUs NOT directly reachable from form (gaps)

These services exist in the Excel but no form option leads customers to ask for them. Either intentional (specialist services) or genuine gap.

| Excel SKU | Service | Customer reach via... |
|---|---|---|
| GCS-01..04 | Grout Colour Seal (recolour grout, not regrout) | 🟡 sh6 vague — "Deep clean & protect" doesn't say "recolour" |
| BRN-01 | Burn repair (cigarette, curling iron) | ❌ No form option — currently slots into bt2/CHR-01 incorrectly |
| CRK-01 | Crack repair (fibreglass/acrylic, not chip) | ❌ No form option — slots into bt2 or sh5 |
| HWD-01/02 | Hard water / calcium deposit removal | 🟡 bt3 covers loosely |
| RST-01 | Rust stain treatment | 🟡 bt3 covers loosely |
| GSP-01/02 | Grout spot repair (1-15 lines, not full regrout) | ❌ No "small grout fix" option in form |
| GRS-01/02 | Clear grout sealer (post-regrout protection) | 🟡 sh6 covers loosely; usually a tradie-suggested add-on |
| CHR-09 | Spa bath chip | ❌ No spa flag in form |
| BTV-05/06 | Spa bath resurface | ❌ No spa flag — quoted as standard BTH |
| AMP-01/02 | Annual maintenance | ✅ Reachable via m_maintenance (multi mode only — not on single-area path) |

---

## ❌ Form options with weak Excel mapping

These form options leave the tradie guessing. Either narrow the form labels OR train the tradie on disambiguation.

| Form ID | Issue | Recommended fix |
|---|---|---|
| sh6 "Deep clean & protect" | Maps to GRS-01 OR DTL-01 OR GCS-01..04 — three different services | Either split into 2-3 options or accept it as "tradie investigates during follow-up call" |
| bt3 "Remove scratches / stains" | Maps to POL-01 / CHR-11 / RST-01 / HWD-01 — four services | Photo review almost always disambiguates; OK as-is |
| fl3 "Anti-slip — bathroom floor" | ASL-01 exists for SHOWER floor only. Bathroom floor anti-slip uses different chemistry. | Either rename to "Anti-slip — shower floor" OR add bathroom-floor SKU to Excel |

---

## Expert verdict

**The form correctly aligns with the Excel for its intended purpose: customer intake, not quote calculation.**

- Every form path that a real customer would pick maps to at least one Excel SKU
- Modifiers + flags (epoxy, shower-over-bath, basin count, lift, previous resurface, ventilation) are wired correctly
- 1:N mappings (where photo review picks the final SKU) are intentional — this is the tradie's job

**The 5 real gaps worth considering** (in order of impact on revenue/quote accuracy):

1. **Spa bath flag** — BTV-05/06 are ~+$200 over BTH. Form has no spa option. Currently quoted as standard bath = lost margin OR underbid.
2. **Pre-1990 / asbestos check** — Rejection #8. Form has no built-year question. Should be a P0 add (covered in audit doc).
3. **Burn / crack repair separate from chip** — BRN-01, CRK-01. Currently mis-mapped as chip. Different SKU, different price.
4. **Spa bath chip** — CHR-09 (covered if #1 is added).
5. **Grout colour seal disambiguation** — GCS-01..04. sh6 is vague; could split.

**My recommendation:** add #1 (spa flag) and #2 (built-year). Skip #3-5 — they're <5% of jobs, photo review catches them.

The form is doing its job. Don't over-engineer the intake.
