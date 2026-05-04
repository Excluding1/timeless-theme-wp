# Quote Form — Image Brief & Shopping List

Comprehensive list of every image the React quote form references — current state, photo briefs, technical specs.

**Last updated:** 2026-05-04 — full rewrite after restructure (chip-repair upgrade pattern, Custom basin/vanity, dropped tile-replacement, Full Bathroom inventory + sectioned photos).

**Folder structure on disk** (path is relative to `quote-form/public/` for dev and `assets/quote-form/` after build):

```
images/
├── areas/                   ← Step 3 picture cards (Pick your area) — 6 OFFICIAL PNGs
│   ├── shower.png
│   ├── bath.png
│   ├── basin-vanity.png
│   ├── walls.png
│   ├── floor.png
│   └── full-bathroom.png
└── services/                ← Step 4 before/after card pairs
    ├── shower/   (sh1-before, sh1-after, sh4-before, sh4-after)
    ├── bath/     (bt1-before, bt1-after, bt2-before, bt2-after)
    ├── basin/    (bs1-before, bs1-after — currently UNUSED, folded into Custom)
    ├── vanity/   (vn1-before, vn1-after, vn4-before, vn4-after)
    ├── walls/    ← currently EMPTY — all 4 cards need images
    └── floor/    (fl1-before, fl1-after — only the regrout pair exists)
```

**Status legend:**
- 🟢 Image exists, works, swap when better available
- 🟡 Image exists but needs verification or swap
- 🔴 No image at all — must source

---

## 1. Step 3 — Area picker (6 official brand-asset PNGs) — DONE ✅

All six area picker cards now use official brand PNGs (~700-800 KB each).

| # | Filename | Status | Notes |
|---|---|---|---|
| 1 | `images/areas/shower.png` | 🟢 | Walk-in shower with glass screen, white subway tiles |
| 2 | `images/areas/bath.png` | 🟢 | Modern bath with subway tile backdrop |
| 3 | `images/areas/basin-vanity.png` | 🟢 | Modern vanity, wood cabinet, white benchtop |
| 4 | `images/areas/walls.png` | 🟢 | Smart red-outline overlay highlighting tiled walls outside shower |
| 5 | `images/areas/floor.png` | 🟢 | Bathroom tile floor wide |
| 6 | `images/areas/full-bathroom.png` | 🟢 | Wide bathroom shot showing bath + vanity + toilet in one frame |

**Follow-up D6**: PNG file sizes are ~700KB ea. Target 100-200 KB via TinyPNG / WebP conversion when total page weight matters.

---

## 2. Step 4 — Service before/after cards (per area)

Each service card has a side-by-side BEFORE/AFTER pair. Both images render at **~190×100 px each** in the side-by-side layout. Format: **PNG or JPG**, ~80 KB each.

**Photo brief:** matched-pair photos taken from the SAME ANGLE, same framing, same lighting. Before = shows the problem clearly. After = shows the result.

### 2a. Shower — 3 cards, all images present 🟢

| Card | Service | befImg | aftImg | Status |
|---|---|---|---|---|
| **Bundle (ALL-IN-ONE)** | Resurfacing + Regrouting | `sh1-before.png` | `sh4-after.png` | 🟢 |
| | Just tile resurfacing | `sh4-before.png` | `sh4-after.png` | 🟢 |
| | Just full shower regrouting | `sh1-before.png` | `sh1-after.png` | 🟢 |

### 2b. Bath — 3 cards, all images present 🟢

| Card | Service | befImg | aftImg | Status |
|---|---|---|---|---|
| **Bundle (ALL-IN-ONE)** | Resurface + repair | `bt1-before.png` | `bt1-after.png` | 🟢 |
| | Just bath resurfacing | `bt1-before.png` | `bt1-after.png` | 🟢 (reused) |
| | Just chip / scratch / burn / stain repair | `bt2-before.png` | `bt2-after.png` | 🟢 |

### 2c. Basin / vanity — 3 cards (restructured to hybrid)

| Card | Service | befImg | aftImg | Status |
|---|---|---|---|---|
| **Bundle (ALL-IN-ONE)** | Full vanity resurfacing | `vn1-before.png` | `vn1-after.png` | 🟢 |
| | Custom — pick what needs work | — | — | N/A (no images — it's an expander chooser) |
| | Just chip or scratch repair | `vn4-before.png` | `vn4-after.png` | 🟢 |

**Dropped from previous brief:**
- ~~vn2-before/after (Stone-fleck premium finish)~~ → stone-fleck is now an upgrade toggle, not a card
- ~~Basin & benchtop (top_only) standalone card~~ → folded into Custom expander
- ~~Just the basin (basin_only) standalone card~~ → folded into Custom expander

### 2d. Tiled walls — 4 cards 🔴 ALL MISSING

These cards currently render with NO image (block hidden). High priority to source — walls cards look anemic next to shower/bath/basin/floor.

| # | Card | Filename | Status | Before brief | After brief |
|---|---|---|---|---|---|
| 1 | **Bundle (ALL-IN-ONE)** Resurfacing + Regrouting | `walls/wall-bundle-before.jpg` | 🔴 | Wall above bath OR behind vanity with **dated tile colour AND dirty/stained grout** | Same wall after full regrout + new tile colour — bright modern finish |
| 2 | Just wall tile resurfacing | `walls/wall-resurface-before.jpg` | 🔴 | Dated wall tile colour outside the shower (e.g. behind vanity, splashback) | Same wall, modern resurfaced tile colour, grout untouched |
| 3 | Just wall regrouting | `walls/wall-regrout-before.jpg` | 🔴 | Wall tile with stained / dark / mouldy grout lines | Same wall, bright clean grout lines, tiles untouched |
| 4 | Just chip or crack repair | `walls/wall-chip-before.jpg` | 🔴 | Wall tile with one or more chips, scratches, or hairline cracks | Same area, chip/crack filled and colour-matched (invisible repair) |

(The "after" filenames mirror the "before" with `-after` suffix.)

### 2e. Floor — 4 cards, partially missing

| # | Card | Filename | Status | Before brief | After brief |
|---|---|---|---|---|---|
| 1 | **Bundle (ALL-IN-ONE)** Resurfacing + Regrouting | `floor/fl1-before.png` + `fl1-after.png` | 🟡 | Currently uses the regrout pair — works but a "both" pair showing colour change AND clean grout would be better | Better photo when available |
| 2 | Just floor tile resurfacing | `floor/floor-resurface-before.jpg` | 🔴 | Outdated floor tile colour (no specific damage) | Same floor, modern resurfaced colour with anti-slip texture |
| 3 | Just floor regrouting | `floor/fl1-before.png` + `fl1-after.png` | 🟢 | Floor with dark cracked grout lines | Clean uniform white grout |
| 4 | Just chip or crack repair | `floor/floor-chip-before.jpg` | 🔴 | Floor with one or more chipped/cracked tiles | Same area, repair filled and colour-matched |

---

## 3. Step 4 — Full Bathroom Makeover scope cards (text-only, no images)

The 3 scope cards on Step 3 (when "Full bathroom makeover" is toggled on) use the existing `FULL_SCOPE_OPTIONS` list and render as text + radio + sparkle icon — NO before/after imagery. They didn't have images before and still don't need them; the area-picker hero image (`full-bathroom.png`) sets the visual context.

If you want image-anchored scope cards in future, ~1200×900 wide-bathroom shots would slot in cleanly:
- Bundle: a fresh bright bathroom (the result)
- Just regrout: focused shot of clean grout lines across multiple surfaces
- Just resurface: focused shot of fresh tile/bath colour change

Not blocking — defer until walls + floor cards are sourced first.

---

## 4. Summary — what to source

### 🔴 Highest priority (currently zero image)

**Walls — 4 pairs (8 images):**
- `walls/wall-bundle-before.jpg` + `-after.jpg`
- `walls/wall-resurface-before.jpg` + `-after.jpg`
- `walls/wall-regrout-before.jpg` + `-after.jpg`
- `walls/wall-chip-before.jpg` + `-after.jpg`

**Floor — 2 new pairs (4 images):**
- `floor/floor-resurface-before.jpg` + `-after.jpg`
- `floor/floor-chip-before.jpg` + `-after.jpg`

**Total NEW: 12 images** (6 pairs across walls + floor)

### 🟡 Optional improvements

- Better "both" pair for floor showing colour change AND clean grout (currently reuses the regrout-only pair which doesn't show colour change)

### 🟢 Already shipped

- All 6 area picker hero images (Step 3) — official brand PNGs
- All 12 shower + bath + basin/vanity service before/after images (10 unique pairs)
- Floor regrout pair (`fl1`)

---

## 5. Technical specs

| Property | Value |
|---|---|
| **Format** | JPG for areas (smaller), PNG for service before/after (better for crisp transitions). WebP optional. |
| **Resolution** | 1200×900 for area cards, 800×600 for service before/after, 1600×900 for full-bathroom hero |
| **Aspect ratio** | 4:3 for cards, 16:9 for full-bathroom hero |
| **File size** | Target 100–200 KB after compression. Vite doesn't auto-optimise — compress before commit ([TinyPNG](https://tinyjpg.com), [Squoosh](https://squoosh.app)). |
| **Colour space** | sRGB |
| **Naming** | Lowercase, hyphenated, no spaces. Match the exact filename in the table. |

---

## 6. How to deliver these images

**Option A (preferred): GitHub repo upload**
1. Make sure all images are sized + compressed per specs above
2. Drop them into `quote-form/public/images/services/{walls|floor}/` matching the exact filenames
3. Commit + push to the WP theme repo (`timeless-theme-wp`)
4. On next theme deploy, `cd quote-form && npm run build` — new images get bundled into `assets/quote-form/images/` automatically

**Option B: Send to me, I drop in**
- Send them in a zip with the folder structure preserved
- I'll commit them in one batch

**Option C: Stock photos as a stopgap**
- Adobe Stock / Unsplash for context shots (acceptable since these are illustrative)
- DON'T use stock for the bundle pair (false advertising risk — must be real Marko jobs or clean illustrative diagrams)

---

## 7. Marko photo session brief (when shooting real jobs)

The highest-leverage extra 5 minutes at any walls/floor job: capture matched-pair shots.

1. **Same angle, same lighting, same framing** — tripod or marker tape on the floor for the second shot
2. **Phone in landscape, well-lit** (open the bathroom door, daylight if possible)
3. **One wide + one detail per surface worked on**
4. **No people, no clutter** in frame — clear bottles, mats off the floor
5. **Customer permission** — even if they say yes, ask each time and confirm we can use the photos for marketing

**Job-by-job target for walls + floor jobs specifically:**
- 1 wide before, 1 wide after of every surface worked
- 1 detail before, 1 detail after of any specific repair (chip, grout line)
- Save in folder named by suburb + month, e.g. `bondi-2026-05/`
- Filename pattern: `{job-id}-{surface}-{before|after}.jpg`

After ~5 walls jobs and ~5 floor jobs, we'll have a full set to swap in. Until then the cards render with the bundle/regrout images they have, missing ones render text-only (still functional but visually weaker).

---

## 8. Counts

| Category | Total cards | Have images | Gaps |
|---|---|---|---|
| Area picker (Step 3) | 6 | 6 ✅ | 0 |
| Shower (Step 4) | 3 | 3 ✅ | 0 |
| Bath (Step 4) | 3 | 3 ✅ | 0 |
| Basin/vanity (Step 4) | 3 (one is Custom expander, no image) | 2 ✅ | 0 (Custom card by design has no befImg) |
| Walls (Step 4) | 4 | 0 ❌ | **4 pairs (8 images)** |
| Floor (Step 4) | 4 | 2 ✅ | **2 pairs (4 images)** |
| **Total NEW images to source** | — | — | **12 images** (6 pairs) |

---

*Last updated: 2026-05-04 by CEO Claude — full rewrite after Phase 1 form restructure*
*Next update: when first batch of walls + floor before/afters lands*
