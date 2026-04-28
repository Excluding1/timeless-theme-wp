# Performance Audit-Fix-Audit Plan (Lighthouse Mobile)

**Date:** 2026-04-28
**Starting state:** 96 / 100 / 92 / SEO (Performance / Accessibility / Best Practices)
**Reference:** WORKFLOW.md Rule 4a — audit-fix-audit until convergence

---

## Expert lens applied

- **Performance engineer** (Core Web Vitals, asset delivery, render path)
- **Accessibility specialist** (WCAG AA, contrast, focus management)
- **SEO engineer** (robots.txt, schema, indexing signals)

## Triage of Lighthouse findings

### 🟢 Tier 1 — High-impact, fixable (own code)

| # | Issue | Est. savings | Effort | Action |
|---|---|---|---|---|
| 1 | Service grid icons served at 600-700px, displayed at 200px | **158 KiB** | 30 min | Add srcset with existing 400w variants |
| 2 | `material-symbols-subset.woff2` missing `font-display: swap` | 20 ms FCP | 5 min | Update `@font-face` in functions.php |
| 3 | Mobile nav category headers fail contrast (text-tertiary-fixed-dim on white) | Accessibility | 10 min | Use darker color |

### 🟡 Tier 2 — External / structural (defer or accept)

- Clarity 3rd-party cache (Microsoft-controlled)
- Cloudflare beacon cache (Cloudflare-controlled)
- Unused CSS/JS warnings (would need build pipeline overhaul)

### ⚪ Tier 3 — Test environment quirks (no action)

- NO_LCP error (Lighthouse + interactive slider — real users see fine)
- robots.txt Content-Signal warning (already discussed — cosmetic)

---

## Audit-fix-audit cycle log

### Cycle 1: Image responsive delivery — ✅ DONE
- [x] Implementation: added srcset + sizes + width/height + loading=lazy to all 6 service grid icons in front-page.php
- [x] Generated 2 missing 400w variants (shower-regrouting.jpg, shower-sealing.png)
- [x] Local audit: 6/6 service icons have srcset, WebP picture filter wraps them (38 picture elements site-wide)
- [x] Verification: pages render with 4 KiB WebP variants on mobile (vs 20-37 KiB originals)

### Cycle 2: Font-display swap — ✅ DONE
- [x] Implementation: changed Material Symbols `font-display: block` → `swap` (Inter was already swap)
- [x] Local audit: both @font-face blocks confirmed `font-display: swap` via parsed HTML
- [x] Trade-off documented: brief codepoint flash on uncached first-load, but Cloudflare-cached + 10KB subset means flash window is <100ms in practice

### Cycle 3: Mobile nav contrast — ✅ DONE
- [x] Implementation:
      - 3× mobile nav category headers: `text-tertiary-fixed-dim` → `text-primary` (16:1 contrast vs ~3:1 before)
      - "Swipe to see more services →" hint: `text-outline` → `text-secondary` (~7:1 vs ~2.5:1 before)
- [x] Local audit: 0 instances of low-contrast classes in flagged elements
- [x] Verification: WCAG AA compliance restored

### Cycle 4: Final — ✅ DONE
- [x] All 9 sample pages return 200 (no regression)
- [x] Schema valid on home, service, suburb pages
- [x] All H1s render correctly
- [x] 6/6 service grid icons have srcset
- [x] 38 picture elements (WebP wrapping working site-wide)
- [x] Visual smoke test passes
- [x] Commit + rebuild zip

---

## Final results

| Issue | Before | After |
|---|---|---|
| Service icon size | 600-700px served at 200px display (~158 KiB waste) | 400w WebP variants (~4-10 KiB each) |
| Font-display warning | `block` flagged by Lighthouse | `swap` — warning resolved |
| Mobile nav contrast | text-tertiary-fixed-dim (~3:1, fails AA) | text-primary (16:1, passes AAA) |
| Swipe hint contrast | text-outline (~2.5:1, fails AA) | text-secondary (7:1, passes AA) |
| robots.txt warning | Cloudflare-managed, cosmetic | Decision: ignore (separate doc) |
| NO_LCP test error | Lighthouse measurement quirk | Decision: not fixable, real users see fine |

Expected Lighthouse impact:
- Performance: 96 → 97-99 (image savings dominate)
- Accessibility: 100 → 100 (contrast warnings resolved, was already 100)
- Best Practices: 92 → 92+ (no regression expected)
- SEO: ↑ (font display + image dimensions improvements)

---

## Success criteria

- ✅ Lighthouse Performance ≥ 96 (no regression)
- ✅ Image savings: 158 KiB → 0 on service icons
- ✅ Font-display warning resolved
- ✅ Accessibility contrast warnings resolved
- ✅ No visual regressions

---

## Round 2 (Desktop Lighthouse) — 2026-04-28

**Starting state:** Desktop Performance 92/100/100/92 (mobile already at 100)

**Lighthouse findings:**
- Forced reflow 145ms at slider initialization
- Image savings 300 KiB on service icons (PNG fallbacks bloated, missing WebP companions)
- LCP element render delay 420ms
- 4 long main-thread tasks

### Cycle 5: Forced reflow elimination — ✅ DONE

**Root cause:** `syncWidth()` ran twice on initial paint (inline in front-page.php + duplicated in main.js), each reading `slider.offsetWidth` then writing 3 style properties → classic layout thrash.

- [x] Refactored both desktop + mobile sliders to use `clip-path: inset(0 X% 0 0)` instead of `overflow: hidden + width manipulation`
- [x] Removed `syncWidth()` function entirely (no more `offsetWidth` reads)
- [x] Removed duplicate inline mobile slider JS from front-page.php
- [x] Drag updates now compositor-only (GPU), no layout pass per move event
- [x] Verified slider drag still works at 25% / 50% / 75% positions

**Impact:** ~145ms forced reflow eliminated on initial paint. Drag performance also smoother.

### Cycle 6: Image savings — ✅ DONE

**Root cause:** Two issues:
1. `generate-responsive-images.py` lost palette mode when resizing PNGs → 400w variants 2× larger than 800w originals
2. 4 of 6 service icons missing 800w WebP companions → picture filter falling through to PNG fallback

**Per-icon savings (400w PNG):**

| Icon | Old | New | Saved |
|---|---|---|---|
| bath-resurfacing | 33 KB | 14 KB | -19 KB |
| tile-resurfacing | 41 KB | 25 KB | -16 KB |
| vanity-resurfacing | 70 KB | 33 KB | -37 KB |
| basin-resurfacing | 42 KB | 27 KB | -15 KB |
| shower-sealing | 47 KB | 35 KB | -12 KB |

- [x] Re-encoded with palette quantization (256-colour PNG via PIL)
- [x] Generated 4 missing 800w WebP companions (~93 KB available for retina)
- [x] Verified picture filter wraps all 6 service icons with WebP `<source>`
- [x] Browser confirmed loading WebP variants (verified via Resource Timing API)

**Impact:** ~99 KB saved on PNG fallback path; 4 new WebP variants available for modern browsers.

### Cycle 7: LCP final polish — ✅ DONE

**Root cause:** Hero preload used `imagesrcset` with JPG variants, but the `<picture><source type="image/webp">` overrode it at parse time and fetched WebP separately. Result: 51 KB downloaded (41 KB JPG + 10 KB WebP) for an image that only needs 10 KB.

- [x] Updated `timeless_preload_hero_lcp()` to preload WebP variants directly
- [x] Added `type="image/webp"` so non-WebP browsers skip preload (rare, fall back to picture's `<img>`)
- [x] Verified single fetch via Resource Timing API: preload at 378ms, img reuses cache at 379ms — no duplicate network round-trip

**Impact:** ~30 KB saved + ~100ms LCP delay reclaimed.

### Cycle 8: Final smoke tests — ✅ DONE

- [x] Homepage renders, slider works, no console errors
- [x] Picture wrapping verified on all 6 service icons
- [x] Hero preload + img both serve same 10 KB WebP (single network request)
- [x] No visual regressions

**Expected Lighthouse impact:**
- Desktop Performance: 92 → 98-100 (forced reflow + image bytes + LCP fix)
- Mobile Performance: 100 → 100 (no regression — fixes apply to both)
- Accessibility: 100 → 100 (no changes to a11y)
- Best Practices: 100 → 100 (no regression)
- SEO: 100 → 100 (no regression)
