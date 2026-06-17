# Quote-Drafter Kit v0 — board step 1.16

**Goal:** any quote drafted in **under 10 minutes**, consistently, grounded in the master pricing sheet — never eyeballed. Manual now (Allan); becomes the AI quote-drafter agent later (board 6.11 / Override 6).

**Canonical price source:** `data/pricing/master-pricing-2026-05-01-snapshot.xlsx` → sheet **"All Services & Pricing"**. Every line has: Avg Hours · Materials · Sub Labour · Total Cost · **T1/T2/T3 (inc GST)** · Profit@T2 · True Margin% · Sub $/hr. **Use these columns — do NOT reinvent sub costs.** Supporting sheets: Upcharges & Modifiers, Travel Zones, Multi-Bathroom Pricing, Rejection Criteria.

Worked reference example: `docs/research/job-analysis-mick-2bath-2026-06-17.md` (Mick, 2-bathroom package).

---

## The 10-minute workflow
1. **Read the intake** (form fields + photos). Classify: scope (regrout / resurface / both), per area, **tile-area band**, spa vs standard bath, basin count, material, condition flags. *(Photo-determinable details are the QUOTER's job, not the form — per the form-is-intake rule.)*
2. **Pick the anchor SKU/combo** closest to the whole scope (see Rule 1). 
3. **Add adjustments** — epoxy upgrade, colour, area band, upcharges, off-sheet trades.
4. **Apply tier** (suburb → T1/T2/T3) + at most **one** discount; **check the margin floor**.
5. **Split asked vs recommended.**
6. **Format** to the right shape (3-tier / two-solution / package).
7. **Rule-8 dual-CEO check** on the copy + numbers → send.

---

## The rules (all learned/confirmed on the Mick job, 2026-06-17)
1. **Combo-anchor — do NOT sum standalone full-service SKUs.** Summing e.g. FBR-03 (full regrout $3,700) + TSR-13 (full tile resurface $3,090) double-counts shared setup/masking/travel and massively over-prices. Use the closest **combo** (TRC-/TBC-/FBP-/CMB- series), then adjust. (Mick: TRC-03 $5,280 anchor, not $9,570 summed.)
2. **Tile area = bands, not exact m²** unless measured: Small 10–15 m² · Standard 15–25 m² · Large 25–35 m² (sheet's own size guide). Classify, confirm exact at the site measure.
3. **Multi-bath discount = FLAT, off our margin, sub unchanged:** −$200 off the 2nd bathroom (same visit) / −$100 (separate visits) / −$300 3rd. **Not a %.**
4. **Never double-discount.** T3 (cheap-suburb tier) **and** the multi-bath discount stacked crushes margin (Mick T3 fell to ~28–40%). Pick one, or prove it still clears the floor + target.
5. **Upcharges (apply the real ones, from the Upcharges sheet):** epoxy grout +$250 · custom colour beyond white/bone/almond +$80 · hard-water (Hills/Western Syd) +$50 · mosaic/small-tile +$250–350 · natural stone +$300 · strip-back (old peeling coat) +$250 · textured/3D +$200 · glass tile +$200 · inner-city parking +$50 · urgency/weekend.
6. **Spa bath:** the sheet's BTV-05/06 sub ($483/$578) is **stale** vs the real ~$880 — reprice the spa (~$2,000–2,200 customer) to hold margin, and flag the sheet for update. (Pending: fix BTV SKUs — board 6.9.)
7. **Off-sheet trades = PAINTING + PLUMBING** (no SKU yet — board 6.9 gap). Cost ad-hoc (painter ~$450–500/bathroom sub; plumber chrome-swap ~$400–500 + hardware ~$300–500 if we supply) and label clearly until SKUs exist.
8. **Asked vs recommended — always split.** Quote the customer's stated requests, then list found/recommended items SEPARATELY, each justified against a visible issue, a safety need, or the customer's own goal — else it reads as padding. (Mick: chrome + repaint = asked; leak-check + cornice + basin + anti-slip = recommended.)
9. **Coating ≠ waterproofing (AS 3740).** Failed grout must be raked + re-done BEFORE coating; "whole-bathroom regrout" ≠ shower-only. A customer saying "paint the tiles" means **resurface** (tiles can't be painted); only bare plaster walls are the painter's.
10. **Margin gate:** every job clears the **$300/job floor**; target **45–60%** (the sheet's design). Below target → flag, don't silently send. Margin is on **ex-GST** revenue (prices are inc GST).
11. **Multi-bathroom = ONE transparent customer package** (total + GST + any discount shown), but **invoiced per bathroom internally** (HBA <$5k each).
12. **Warranty per material, ACL-accurate:** epoxy grout 5yr · cement grout 2yr · silicone 1yr · resurface up-to-5yr (private) / 6mo (rental). Never blanket "5-year."
13. **Site visit locks the price.** The quote is a tier range/estimate; firm it at the site measure (substrate tap/flex-test, tile area, leak check, exact tints). Say so on the quote.
14. **Reject, don't quote, the Rejection-Criteria jobs** (active leak through ceiling, etc.) — refer out.

---

## The three shapes (board 1.16 must support all three)
- **A · 3-TIER (default, CEO.md):** T1 / T2 / T3 from the sheet, same scope, framed good/better/best by finish + warranty. Suburb sets the realistic tier; show one.
- **B · TWO-SOLUTION (damage-triage, e.g. Lisa):** two distinct *approaches* priced side by side — e.g. "replace the basin" vs "reglaze/resurface it" — with the trade-offs, not three tiers of the same thing.
- **C · PACKAGE (multi-bathroom / multi-service makeover, e.g. Mick):** combo-anchor each area, present ONE matched package (total inc GST + discount), internal per-bathroom invoices. Day-by-day program if multi-day (sequential, one bathroom always usable, 48–72h cure).

---

## Pre-send gate checklist
- [ ] Every line traces to a real sheet SKU (or is a clearly-labelled off-sheet trade).
- [ ] Anchored on a combo, not summed standalone SKUs.
- [ ] At most one discount; margin ≥ $300 floor and within/near target (flagged if not).
- [ ] Asked vs recommended separated; each recommended line justified.
- [ ] Prices inc GST stated; multi-bath shown as one package.
- [ ] Warranty stated per material (ACL-accurate), no blanket "5-year."
- [ ] Site-visit caveat where substrate/area/tints/leak unconfirmed.
- [ ] **Rule-8 dual-CEO check** on copy + numbers before it goes to the customer.
