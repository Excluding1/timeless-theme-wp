# Job analysis — Mick Connolly, 1 Pearra Way Claremont Meadows (2 bathrooms) — 2026-06-17

First full worked example of a 2-bathroom full-makeover quote. Built by the contractor-persona expert +
Cleo + Clifford from Mick's real photos (grouped by Allan) + the recovered CRM scope. **Reusable rules for
the quote-drafter kit (pipeline 1.16) are flagged ⇒.**

## The customer
Owner-occupier, 1 Pearra Way Claremont Meadows (Western Sydney / Penrith). Two bathrooms, wants them done to
a MATCHING scheme: soft-white walls + wall tiles, warm-grey floor tiles, chrome fixtures, walls above tiles
natural white. Decor is dated "**federation STYLE**" (floral border tiles, octagonal maroon-dot floor) —
**NOT federation era**. **Build is 1990 or later (Allan confirmed)** ⇒ no asbestos/lead hard-gate.

## The two bathrooms (from photos)
- **Bathroom 1 — MAIN (20 photos):** spa bath + glass shower + 3-door vanity + basin. Worse condition:
  mouldy/dirty shower grout, a damaged/patched shower wall tile, and a **cracked, water-stained cornice**
  above the shower (⚠ check for a leak before coating). CRM bathroom_index 1.
- **Bathroom 2 — ENSUITE (8 photos):** framed corner shower + toilet + long-mirror vanity + basin. **NO BATH.**
  Cleaner. CRM bathroom_index 2 ("better condition than main").

## Scope + price (customer prices inc GST; our cost)
⇒ **A bath only exists in the room that has one — don't price a bath into a bathless ensuite.**
⇒ **"Painted/recoloured tiles" = tile RESURFACING (TSR), not the FBP package** — FBP-02 keeps tiles their
old colour, so for a colour-change brief you need FBP/RGE **+ TSR-13**, never FBP alone.
⇒ **Painting IS an offered service** (Allan 2026-06-17: we have a painter subbie) — include it as a
quote LINE (our painter cost ~$450-500/bathroom, charge ~$600-900). ⇒ **No painting SKU exists yet — add
one** so it's priced consistently, not ad-hoc. Bare upper walls + ceiling only (the tiled walls/shower are
the resurfacer's TSR scope, not the painter's).

| | Bathroom 1 (main, has bath) | Bathroom 2 (ensuite, no bath) |
|---|---|---|
| SKU assembly | FBP-02 (epoxy regrout+sil+bath+basin) + TSR-13 (all-tile resurface) | RGE-02 (epoxy shower regrout) + TSR-13 + basin resurface |
| + painting | sub painter ~$500 | sub painter ~$450 |
| Customer (T3→T2) | ~$4,400–6,600 | ~$3,500–5,400 (− $200/−10% multi-bath) |
| Our cost | ~$2,600 | ~$2,100 |

**AUDITED + CORRECTED (both CEOs + contractor expert, 2026-06-17 — Allan was right on both pushes):**
⇒ **Regrout = WHOLE bathroom**, not shower-only (coating is cosmetic, not waterproofing per AS 3740; failed
grout must be raked first). ⇒ **Resurface area was understated**: MAIN ~18.2 m² (was 16; the tiled dado +
bath surround), ENSUITE ~11.7 m² (a TSR-12 *small* band, not TSR-13 — I'd over-scoped that one).
**Combined all-in: ~$9,844 (T3, the correct default) – $11,384 (T2) inc GST** — MAIN ~$7,370 / ENSUITE ~$4,014
(after −10% multi-bath); our cost ~$5,563 · gross profit ~$4,786 = **46% true margin** (in 45-50% target,
far above $300 floor). The prior $8.8–10.9k was too low; corrected sits at the top of / above that band.
⇒ Audit landmines applied to the webapp: justify every recommended line (leak/cornice/basin/anti-slip) vs a
visible issue or the chrome ask (else reads as padding) · clarify "repaint the rest" scope (trim/doors?) ·
basin resurface = optional/colour-match · TSR tile-resurface sub pay must clear the $70/hr resurfacing floor
(bundle/lift) · add prep/masking + extra primer-coats on dark tiles + cure-day labour + spa-jet masking +
Penrith travel. Honest customer anchor: a full rip-out reno of two bathrooms = ~$35–60k+; this is the
low-disruption alternative. ⇒ **SYSTEM GAPS** (background tasks): TSR-12/13/14 + FBR rows are UNCOSTED
placeholders in the pricing sheet (every makeover reverse-engineers them) — cost them properly; and add
PAINTING + PLUMBING SKUs (both are now real offered trades). Day-by-day program built (sequential, one
bathroom always usable, 48-72h cure each = ~10-11 days / ~2 weeks).

⇒ **WALLS ARE HALF-TILED (Allan corrected 2026-06-17):** a tiled dado (~1.2m) + painted plaster above,
EXCEPT the showers which are full-height tile. So tile-resurface = shower + dado + floor only; the upper
walls are the painter's. Don't price full-height tile resurface on the whole room.
⇒ **GOLD/BRASS tapware → customer wants CHROME = a PLUMBER swaps tapware + re-seats wastes** (resurfacing
can't recolour metal). 4th trade. Also the plumber checks the cornice for a leak before coating.
⇒ Per-bathroom line items (T2): MAIN = tile-resurface $2,600 + bath $1,290 + basin $580 + epoxy regrout/sil
$750 + paint+cornice $800 + plumbing $650 + make-good $250. ENSUITE = tile $2,100 + basin $580 + regrout
$600 + paint $700 + plumbing $480, −10% multi-bath.

## Trades (⇒ 4 distinct skills, not one "bathroom guy"; all coordinated in-house via our subbies)
**4th trade = PLUMBER** (gold→chrome tapware swap, re-seat wastes, leak check). Clean job-package webapp built
+ Netlify-ready: `/Users/excluding/Downloads/mick-job-sheet-netlify/` (index.html + Bathroom-1-MAIN/ +
Bathroom-2-ENSUITE/); served locally at http://localhost:8910 (photos grouped per bathroom, click to enlarge).
1. **Regrouter** — epoxy rake-out + re-grout + silicone.
2. **Resurfacer** — HVLP spray; ONE person does bath (main) + basins + ALL tile recolour (walls white, floor
   grey + anti-slip additive). Tile recolour = same skill as bath resurface.
3. **Painter** — bare walls + ceiling + patch the cornice. Separate trade, but **we have a painter subbie**
   (Allan 2026-06-17) so it's in-house — Mick deals with one company. A solo sub who does all three trades
   is rare in NSW — keep them as separate subbies.

## Process ⇒ order is fixed by physics
Regrout (dirtiest) → paint walls → spray-resurface (last, so nothing contaminates the fresh coating) →
48–72h cure. Main ~4 days (has bath), ensuite ~3 days. **Sequential, not parallel** (same subs; and match the
ensuite colours to the finished main). ~7 days on site over ~2 weeks.

## Site-inspection checklist (no longer a hazmat gate — now a "lock the price" visit)
- The main-bathroom **cornice crack + water stain** → find/rule out the leak source BEFORE coating.
- Tiles sound + adhered (tap-test) — coating needs a stable substrate; loose/drummy tiles = repair first.
- Bath substrate (press-test for acrylic flex/delamination → resurface only if sound).
- Confirm tile area (drives the TSR price) + the exact white/grey tints (lock on bathroom 1, match bathroom 2).
- Residual: a 1990–2003 build still warrants a glance for any ACM-looking sheet, but it is NOT the pre-1990 gate.

## Customer path
Budget range now → quick site visit to confirm tile/substrate/leak + tier → firm per-bathroom fixed quote
with painting + any cornice/tile repair as separate lines. Two internal opps/invoices (HBA <$5k each), one
matched package presented to the customer (per the multi-bathroom fix spec 3.3).
