# Suburb landing pages — rollout plan and task list

Owner: Allan + Clifford · Started 2026-08-15 · Template: `page-templates/page-area-suburb.php`

---

## The decision on layouts (settled 2026-08-15)

**One template, not two or three.** Reasons, in order of weight:

1. Jim's Fencing runs a **single layout across all 64 NSW suburb pages** and ranks. Prestige
   Bathroom Renovations does the same. Google penalises duplicate **content**, not shared
   templates — every WordPress site on earth reuses one template across many pages.
2. We already beat both references on differentiation. Measured on the live template:

   | Pair | Unique |
   |---|---|
   | Marrickville vs Cronulla (coastal branch fires) | **36.3%** |
   | Marrickville vs Penrith | **34.4%** |
   | Cronulla vs Penrith (both inland, similar era) | **22.3%** |
   | *Jim's Cronulla, for comparison* | *15–20%* |
   | *Our old thin template* | *12–14%* |

3. Variation comes from **data, not duplicated templates**: the copy already branches on
   `coastal`, on `housing_era`, on `council`, on `neighborhoods` and on `distance_km`.
   Adding a second template doubles the maintenance and fixes nothing measurable.

**Where the effort should go instead:** unique text and unique images per suburb. That is what
takes these from "better than the market leader" to genuinely uncatchable.

---

## Rollout batches

**Batch 1 — the first 20** (real lead suburbs first, then the biggest hubs)

| # | Suburb | Why it's in batch 1 |
|---|---|---|
| 1 | Marrickville | ✅ done — prototype |
| 2 | Cronulla | ✅ done — tests the coastal branch |
| 3 | Penrith | ✅ done — tests the inland branch |
| 4 | Claremont Meadows | **the one completed job** — only suburb with real photos today |
| 5 | Ryde | real enquiry |
| 6 | Newtown | real enquiry |
| 7 | Drummoyne | real enquiry |
| 8 | Pyrmont | real enquiry |
| 9 | Rhodes | real enquiry |
| 10 | Willoughby | real enquiry |
| 11 | Strathfield | real enquiry |
| 12 | Bondi | real enquiry |
| 13 | Manly | real enquiry |
| 14 | Cabramatta | real enquiry |
| 15 | Emu Plains | real enquiry |
| 16 | Parramatta | biggest western hub |
| 17 | Blacktown | biggest north-western hub |
| 18 | Liverpool | biggest south-western hub |
| 19 | Chatswood | biggest lower-north-shore hub |
| 20 | Hornsby | biggest upper-north-shore hub |

**Then ~50 a week**, in this order:

- **Week 2** — the 8 lead suburbs still missing a page: Beecroft, Berowra, Bonnet Bay, Lurnea,
  North Parramatta, North Turramurra, Queens Park, South Penrith. Then the rest of the 95.
- **Week 3** — middle-ring gaps: Burwood, Ashfield, Leichhardt, Balmain, Rockdale, Kogarah,
  Miranda, Engadine, Menai, Merrylands, Granville, Auburn, Lidcombe, Concord, Five Dock,
  Gladesville, Lane Cove, Artarmon, Crows Nest, North Sydney, Neutral Bay, Dee Why, Brookvale,
  Freshwater, Narrabeen, Avalon, Coogee, Bronte, Double Bay, Paddington, Alexandria, Mascot,
  Sans Souci, Sylvania, Gymea.
- **Ceiling ≈ 150.** Not an SEO limit — that is simply where Sydney runs out of suburbs with
  older bathrooms. Past it you hit new estates, industrial land and rural fringe, where the page
  would have nothing true to say. **Stop there.**

---

## The pipeline (per suburb)

Each suburb goes through the same five steps. Nothing is published until step 5 passes.

### 1. Data — `inc/suburb-data.php`
Required, and every field must be **true of that suburb**, not filler:

| Field | Rule |
|---|---|
| `name`, `postcode`, `region` | factual |
| `council` | the real LGA — drives the "do I need approval" FAQ |
| `distance_km` | from the CBD, roughly right |
| `description` | **one sentence nobody could copy onto another suburb** |
| `housing_era` | the actual dominant stock, e.g. "interwar cottages and post-war red-brick flats" |
| `neighborhoods` | 4 genuinely adjacent suburbs |
| `lat` / `lng` | drives the map |

### 2. Content — what makes it unique
- The `description` and `housing_era` fields feed three separate sections, so getting those
  right does most of the work automatically.
- Coastal suburbs automatically get different salt-air copy. Check the branch fires correctly:
  it keys off region and description text.
- **Optional per-suburb overrides** (add as they are written): a local observation paragraph,
  a job story, a customer quote from that suburb.

### 3. Images
- Default: the six per-service heroes already in the theme.
- **Better, as they arrive:** real before/after photos from a job in or near that suburb, in a
  `[before_after]` slider.
- ⚠️ **Illustrative-only rule stands.** AI-generated images may never be captioned as a real
  job, never appear in a before/after slider, and never go on Google Business Profile.

### 4. Publish
- Page lives at `/areas/{slug}/` with template `page-templates/page-area-suburb.php`
- Old `/services/bath-resurfacing/{slug}/` URLs 301 automatically (already built)
- Creation is batched — creating more than ~8 pages in one request kills wp-now locally

### 5. Check before it goes live
- [ ] Page returns 200 and has no PHP notices
- [ ] Council name appears in the approval FAQ
- [ ] The coastal branch is right for that suburb (fires for beach suburbs, not for inland)
- [ ] `description` reads as true of that suburb and nowhere else
- [ ] Uniqueness vs the nearest similar suburb ≥ 20%
- [ ] Neighbours listed are genuinely adjacent
- [ ] Map centres on the right place

---

## Where it stands

- **95 suburbs** have data in `inc/suburb-data.php`
- **3 pages built** on the new template: Marrickville, Cronulla, Penrith
- **12 of 20 lead suburbs** covered; 8 outstanding (week 2)
- Template carries: hero + trust bar, when_cards comparison, six service sections with
  alternating image/text, job-type lists linking the ten problem-led pages, local care,
  map, five council-localised FAQs with schema, quote form, nearby suburbs

## Known constraint, learned the hard way

The theme's Tailwind is **compiled and purged** — `assets/main.min.css` only contains classes
already used somewhere in the theme. Any unfamiliar utility silently does nothing. This broke
the layout three times (`px-7`, `py-3.5`, `md:order-1`, `gap-x-5`, `decoration-dotted`).
**Check `main.min.css` before using a new class, or copy the markup from a page that works.**
