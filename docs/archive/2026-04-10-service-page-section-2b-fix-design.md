# Service Page SECTION 2B Visual Fix — Design

**Date:** 2026-04-10
**Scope:** 4 service page templates (bath-resurfacing, shower-regrouting, tile-resurfacing, shower-leak-repair)
**Author:** Angela + Claude

## Problem

On the 4 "big" service pages, SECTION 2B ("Expert [Service] in Sydney") uses a
`lg:grid-cols-5` layout with a 2/3 text-to-image split that contains:

1. A text column (`lg:col-span-2`, 467px wide, 286px tall on desktop)
2. An **empty** pink→emerald gradient placeholder (`lg:col-span-3`, 717×478px) with
   only "Before" and "After" text labels — no actual photo

All 16 referenced before/after photos (4 per page × 4 pages) were never added to
the repo. The only real image in each `images/services/[slug]/` folder is `hero.jpg`.

Visible symptoms on desktop (1440×900):
- Section is 2465px tall — larger than a full desktop viewport
- 4 identical text-left/image-right blocks in a row — monotonous rhythm
- 67% height mismatch between text column (286px) and empty placeholder (478px)
- ~1.37 million square pixels of empty decorative gradient per page
- Mobile is even worse: 2973px section height, 912px of empty placeholder space

## Goals

From Angela's feedback:

1. **Alternating zig-zag layout** — not text-left/image-right 4 times in a row
2. **Image sized better** — smaller, less dominant than the text
3. **Text vertically centered** relative to the image (not top-aligned)
4. **Centered, neat, correct sizing, responsive, good UI** across all 4 affected pages

## Non-Goals

- Don't touch the 15 smaller service pages (they don't have this problem)
- Don't touch other sections on the 4 affected pages (hero, trust bar, WHY,
  process, CTA, value prop, comparison, testimonials, FAQ, form)
- Don't add real photo assets yet — Angela will add them over time as jobs
  are completed
- Don't change `functions.php`, `header.php`, `footer.php`, or `js/main.js`

## Design

### Layout: Alternating zig-zag (desktop), stacked (mobile)

Change the outer grid from `lg:grid-cols-5` (2/3 split) to `lg:grid-cols-2`
(1/1 split). Each block uses `items-center` so text vertically centers with
the image.

**Alternation pattern (applied per-block):**

| Block | Mobile DOM order | Desktop display |
|---|---|---|
| 1 | text → image | text-left, image-right |
| 2 | text → image | image-left, text-right |
| 3 | text → image | text-left, image-right |
| 4 | text → image | image-left, text-right |

Mobile always shows text above image (natural reading flow). On desktop,
blocks 2 and 4 use `lg:order-2` on the text column and `lg:order-1` on the
image column to swap sides.

### Image: Branded before/after card (CSS-only, no photo needed)

Replace the empty pink→emerald placeholder with an intentional
split-screen decorative card that conveys "transformation":

- **Outer container:** `aspect-[4/3] max-w-lg mx-auto rounded-2xl shadow-md`
  (~512×384px max — smaller than the 717×478 original)
- **Before side (left half):** `bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300`
  with a muted gray service-specific icon and a "Before" pill-shape label
- **After side (right half):** `bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20`
  with an emerald "clean" icon and an "After" pill-shape label
- **Center overlay:** White circular badge with gold border containing an
  `arrow_forward` icon — visually conveys "transforms from → to"

This design:
- Looks intentional (not a broken image placeholder)
- Uses brand colors (gold `#e7c08b`, primary navy, emerald accent)
- Is CSS-only (zero dependency on unfinished photo assets)
- Scales perfectly on any viewport
- Can be replaced later with real photos without changing other layout

### Text column: Centered, cleaner typography

- Heading: `text-2xl sm:text-3xl` (up from `text-2xl` — more impactful on desktop)
- Description: `text-sm sm:text-base leading-relaxed`
- Bullets: `space-y-2.5` (slight increase from `space-y-2` for breathability)
- CTA button: unchanged, remains bottom-left of text column

### Section header: Centered

Change `max-w-3xl mb-12` to `max-w-3xl mx-auto text-center mb-12 lg:mb-16`
so the section intro is centered to match the zig-zag content rhythm.

### Spacing: Tighter vertical rhythm

- Block-to-block margin: `mb-12 lg:mb-16` (was `mb-16` — slightly tighter on
  mobile, generous on desktop)
- Column gap: `gap-8 lg:gap-16` (was `gap-8` — more breathing room on desktop)

## Per-page icon mapping

### bath-resurfacing.php
| Block | Service | Before icon | After icon |
|---|---|---|---|
| 1 | Chip & Crack Repairs | `broken_image` | `verified` |
| 2 | Stain & Yellowing Removal | `water_drop` | `auto_awesome` |
| 3 | Peeling & Failed DIY | `error` | `restart_alt` |
| 4 | Full Bath Resurface | `bathtub` | `verified` |

### shower-regrouting.php
| Block | Service | Before icon | After icon |
|---|---|---|---|
| 1 | Mouldy Shower Grout | `biotech` | `verified` |
| 2 | Cracked & Crumbling Grout | `broken_image` | `auto_awesome` |
| 3 | Epoxy Grout Upgrade | `schedule` | `shield` |
| 4 | Full Regrout + Silicone | `shower` | `verified` |

### tile-resurfacing.php
| Block | Service | Before icon | After icon |
|---|---|---|---|
| 1 | Outdated Colour Tiles | `palette` | `auto_awesome` |
| 2 | Wall Tile Resurfacing | `view_quilt` | `verified` |
| 3 | Floor Tile Resurfacing | `grid_view` | `verified` |
| 4 | Full Bathroom Tile | `bathroom` | `auto_awesome` |

### shower-leak-repair.php
| Block | Service | Before icon | After icon |
|---|---|---|---|
| 1 | Leaking Shower Silicone | `water_drop` | `verified` |
| 2 | Water Damage Behind Tiles | `water_damage` | `shield` |
| 3 | Mouldy & Dirty Corners | `biotech` | `sanitizer` |
| 4 | Full Waterproof Refresh | `shower` | `verified` |

## Testing plan

Use Playwright against the local template files (via WP-served live site after
upload) OR directly measure the rendered PHP template via the live site. Test
at two breakpoints:

1. **Desktop 1440×900** — verify zig-zag alternation, centered text, image max
   width, overall section height drops from ~2465px to ~1400–1600px
2. **Mobile 390×844** — verify single-column stacking, text always above image,
   no horizontal overflow, no empty whitespace gaps

Success criteria:
- All 4 pages render without broken/empty placeholder divs
- Text vertically centers with image on desktop
- Alternation visible on desktop, invisible on mobile (stacked consistently)
- No layout shift on load (reserve space via aspect ratio)
- Page weight reduction of ~15–25% on the 4 affected pages

## Line-delta estimate

Per page: ~60 lines removed (4 × ~15 line placeholders + 5-col grid wrappers)
+ ~55 lines added (4 × new block template + centered header tweak) = net ~-5 lines.

Across 4 pages: ~-20 lines total, but visual change is significant.

## Rollback plan

Single `git revert` of the implementation commit restores all 4 pages to the
previous state. No database migrations, no asset changes, no JS/functions.php
changes, so rollback is zero-risk.
