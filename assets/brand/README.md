# Brand Assets

**Purpose:** Single home for all brand-related files (logos, favicons, vehicle livery designs, uniform mockups, marketing photos, style guide). Version-controlled in git so nothing gets lost.

**Owner:** Allan (designs + sourcing); CEO references for spec accuracy.

---

## Folder structure

```
assets/brand/
├── logo/                  ← Primary logo files (SVG, PNG variants)
├── favicon-source/        ← Source files for favicons (the live favicons live in ../favicon/ already)
├── vehicle-livery/        ← Magnetic decal designs, vinyl wrap mockups
├── uniforms/              ← Polo / hi-vis / hat designs
├── business-cards/        ← Card designs, both founders + subcontractor variants
├── marketing-photos/      ← Pro-shot real-job photography (NOT theme structural images)
└── style-guide/           ← Brand colours, fonts, tone-of-voice doc
```

---

## Files to add (when available)

### logo/
- [ ] `logo-primary.svg` — full vector wordmark (current state: TBC — Canva file?)
- [ ] `logo-primary.png` — 1024×1024 transparent
- [ ] `logo-horizontal.svg` — horizontal version for website headers
- [ ] `logo-stacked.svg` — vertical/stacked version
- [ ] `logo-monogram.svg` — small icon-only mark
- [ ] `logo-white-on-dark.png` — for dark backgrounds
- [ ] `logo-source.canva` (or `.fig`) — editable source file
- [ ] Mascot file (axolotl idea per Jordan inspiration — TBC if Allan wants)

### favicon-source/
- [ ] `favicon-source.svg` — vector source
- (Live favicons already live in `assets/favicon/` for the theme to load)

### vehicle-livery/
- [ ] `magnetic-decal-side.svg` — side door magnetic
- [ ] `magnetic-decal-back.svg` — rear bumper magnetic
- [ ] `wrap-mockup.png` — full vehicle wrap (if going premium)

### uniforms/
- [ ] `polo-front.png` — chest logo placement
- [ ] `polo-back.png` — back logo + slogan
- [ ] `hi-vis-front.png` — for sub-supplied uniforms
- [ ] `hat-design.png` — cap embroidery

### business-cards/
- [ ] `card-allan-front.svg`
- [ ] `card-allan-back.svg`
- [ ] `card-marko-front.svg`
- [ ] `card-marko-back.svg`
- [ ] `card-sub-front.svg` — for subcontractors to leave with customers (still our brand)

### marketing-photos/
- [ ] First-job pro-photoshoot (~30 photos when first customer #1 job done)
- [ ] Before/after pairs from real jobs
- [ ] Tradesperson on-job action shots (with subcontractor permission)
- [ ] Brand-style hero photos for landing pages

### style-guide/
- [ ] `brand-colours.md` — hex values + usage rules
- [ ] `typography.md` — Inter font usage, hierarchy
- [ ] `voice-tone.md` — brand voice principles (currently in CEO.md § Brand identity, can extract)
- [ ] `photography-style.md` — what real-job photos should look like
- [ ] `do-not-do.md` — anti-examples (no comic-sans, no fake stock)

---

## Brand spec (working — until full style guide exists)

### Colours (from CLAUDE.md + theme)
| Use | Hex | Name |
|---|---|---|
| Primary | `#041534` | Deep navy |
| Secondary text | `#595e6d` | Slate grey (theme uses) / `#44495a` (quote form uses) — pick one |
| Accent / Gold | `#e7c08b` | Gold |
| Surface | `#f7f9fb` | Off-white |
| Error | `#ba1a1a` | Red |
| Success | `#0F6E56` | Forest green |

### Typography
- Primary font: **Inter** (Google Fonts)
- Material Symbols Outlined for icons

### Brand promise (locked)
**"Fresh bathroom. One day. No renovation."**

### Voice
- Direct, no fluff
- Plain English, Year 8-10 reading level
- Active voice
- Australian English (colour, not color)
- Friendly + competent

---

## How CEO uses these

When designing customer-facing content (quote templates, SMS messages, landing page copy, GHL workflows), CEO references this folder for:
- Logo files to reference in templates
- Brand colour codes (hex values)
- Voice + tone consistency

When advising on visual decisions (uniform colour, vehicle livery, business card design), CEO references the style guide here.

---

## Excluded from theme deploy

This folder lives under `assets/brand/` but is **NOT excluded** from the theme zip — that means brand files DO ship with WordPress deploys if you `git add` them. **Recommendation:** for files customers don't need on the website (uniform mockups, business card designs, source files), put them under `assets/brand/internal/` and we'll add that subfolder to the deploy exclusion. Logos that the website actually uses can stay shippable.

---

## Adding files

```bash
# Add a new logo variant
cp ~/Downloads/logo-final.svg /Users/angelapham/Downloads/timeless-theme-wp/assets/brand/logo/

# Stage + commit
git add assets/brand/logo/logo-final.svg
git commit -m "brand: add primary logo SVG"
git push origin develop
```
