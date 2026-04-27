# Changelog

All notable changes to the Timeless Resurfacing theme are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **MAJOR** version (`X.0.0`) — breaking changes, theme rebuilds, removed features
- **MINOR** version (`1.X.0`) — new features, page additions, schema additions
- **PATCH** version (`1.1.X`) — bug fixes, content tweaks, no functional change

---

## [Unreleased] — `develop` branch

### Performance — Day 3 self-hosting fonts + WebP images
- **Material Symbols subset** (1.06 MB CDN → 10 KB local, 99.7% smaller). Variable font instanced at wght=400/GRAD=0/opsz=24, FILL axis kept for filled-icon variants. Audit-fix-audit loop converged after 4 passes (caught 2 critical bugs: dynamic `faucet` icon in PHP array; JS-injected `check_circle` bypassing PHP filter).
- **Inter body font subset** (200-300 KB across multiple Google Fonts CDN requests → 99 KB local single file, plus eliminates 2 third-party DNS lookups). Variable font with wght (100..900) and opsz (14..32) axes preserved. Latin + essential punctuation + ★ for ratings. No italic variant (theme has zero italic usage).
- **WebP image companions** (1.67 MB savings for WebP-capable browsers, 0 wasted bytes elsewhere). Smart converter at `scripts/convert-images-to-webp.py` writes `image.jpg.webp` companions ONLY when WebP beats the source size — 102 of 205 images got companions, 103 already-optimized PNGs correctly skipped. PHP output filter `timeless_webp_picture_filter()` wraps `<img src="x.jpg">` in `<picture><source srcset="x.jpg.webp" type="image/webp">…</picture>` so 96%+ of browsers get WebP transparently. Original URLs unchanged — easy rollback, no broken backlinks.
- **Audit-fix-audit loop formalized as Rule 4a** in WORKFLOW.md. Documents the methodology that caught regressions the first audit missed (stale comments, asymmetric regex word-boundaries, missed star character, WebP bloat on already-optimized PNGs).

### UI/UX
- SECTION 2B before/after cards capped at `max-w-md` on 4 big service pages. Were rendering ~552×368 on desktop (dominating text columns); now 448×299 with proper visual balance.
- H2 sizing standardized across all 19 service pages + about + homepage to `text-3xl sm:text-4xl`. Was inconsistent — some sections rendered at 30px while neighbors used 36px.
- Homepage "Full Renovation" badge icon swapped from `delete` (trash) to `close` (X) to match the row icons visually.

### Coming next (v1.2.0)
- Day 3 Task D: Configure Cloudflare cache rules (HTML 30min, static 1yr) — dashboard work
- Day 4: Schema as code + analytics setup (GA4, Microsoft Clarity)
- Day 5: Suburb programmatic landing pages
- Day 6: Service page polish (H1s, customer language variants)
- Off-page: GBP claim, citations, review collection

---

## [1.1.0] — 2026-04-27

This release moves the theme from a CDN-runtime architecture to a properly compiled build pipeline, completes the comprehensive SEO/performance audit, and introduces the local development workflow.

### Added
- **Tailwind CSS v4.2.4** with PostCSS build pipeline (replaces CDN runtime)
  - `package.json`, `tailwind.config.js`, `postcss.config.js`, `src/main.css`
  - Custom 18-color Material Design 3-style palette preserved
  - Safelist for JS-dynamic classes (`bg-primary`, `text-secondary`, etc.)
  - Compiled output: `assets/main.min.css` (~61 KB raw, ~11 KB gzipped)
  - 85% size reduction vs CDN runtime (409 KB → 61 KB)
- **`AUDIT.md`** — comprehensive verified audit + 2-day execution plan
- **`BUILD.md`** — build pipeline documentation (setup, build, deploy, troubleshoot)
- **`llms.txt`** — AI search engine summary (ChatGPT, Perplexity, Google AI Overviews)
- **`.gitignore`** — exclude `node_modules/`, dev tool artifacts, screenshots
- **Local WordPress development** via wp-now (no install required, runs on localhost:8881)
- **Permalink self-heal** — auto-sets `/%postname%/` on truly default WordPress installs
  - Three hooks for reliability: `after_switch_theme`, `admin_init`, `init` priority 5
  - Production-safe: only acts when permalink_structure is empty (never overrides)

### Changed
- **762 Tailwind class renames** across 27 files via official `@tailwindcss/upgrade` tool:
  - `shadow-sm` → `shadow-xs`, `shadow-md` → `shadow-sm`, `shadow-lg` → `shadow-md`, etc.
  - `rounded` → `rounded-sm`, `rounded-sm` → `rounded-xs`
  - `outline-none` → `outline-hidden`
  - `flex-shrink-0` → `shrink-0`
  - `aspect-[3/4]` → `aspect-3/4` (cleaner v4 syntax)
- **WP block library dequeue** — added `classic-theme-styles` and `wp-img-auto-sizes` (WP 6.4+/6.7+)
  - Bumped priority to 999, dual-hook on `wp_print_styles` for stubborn handles
- **PFP review images resized**: reviewer-1.png 316KB → 6KB, reviewer-3.png 116KB → 5KB
  - 96×96 dimensions (Retina-ready for 32×32 display)
  - Saves ~420 KB per page render
- **Trust bar logos**: width/height/loading attributes added (CLS fix per GTmetrix)
- **About page** Section 2: now uses `bathroom-3.jpg` (was incorrectly reusing hero)
- **About images** renamed `.png` → `.jpg` (were JPEG data with wrong extension)
- **Mobile hero image** moved below paragraph on all 8 service pages (homepage pattern)
- **Trust bar mobile**: single column with aligned icons (was 1,1,2 layout)
- **Gallery** restructured: 26 unique cards across 6 categories, `regrouting` filter merged

### Removed
- **Tailwind CDN runtime** (`cdn.tailwindcss.com`) — replaced by compiled CSS
- **`@tailwindcss/container-queries`** plugin — built into v4
- **`autoprefixer`** package — built into v4 PostCSS plugin
- **`X-Powered-By` HTTP header** — security: don't reveal PHP version
- **HTML preview** (`/tmp/timeless-preview/`) — retired in favor of wp-now (real WordPress)

### Fixed
- **Service pages routing on fresh WP installs** (e.g. wp-now)
  - Was: all service URLs silently rendered homepage
  - Now: pretty permalinks auto-set, all 25 pages route correctly
- **WordPress block CSS bloat** still leaked through despite dequeue
- **Tailwind PostCSS migration** — `tailwindcss` → `@tailwindcss/postcss` v4 plugin
- **Phone number wrong defaults** in `timeless_phone()` / `timeless_phone_link()`
- **Chip repair page**: orphaned JSON-LD schema rendering as visible text
- **Shower regrouting hero**: replaced with new singular before/after photo
- **Image format mismatches** — JPEG data with `.png` extensions causing render failures

---

## [1.0.0] — Initial release (multiple commits)

### Added
- Custom WordPress theme for Timeless Resurfacing
- 19 service pages targeting Sydney bathroom resurfacing/regrouting niche
- Hub-and-spoke architecture with mega-menu navigation
- Comprehensive schema.org JSON-LD (Service, FAQPage, BreadcrumbList, AggregateRating, HomeAndConstructionBusiness)
- Per-page unique meta descriptions for all 26 published pages
- Self-referencing canonical URLs (HTTPS, trailing slash)
- Auto-generated XML sitemap at `/sitemap.xml`
- Custom robots.txt blocking crawl-budget-wasting URLs
- Theme Customizer integration for phone, email, licence, ABN
- AJAX quote form with photo upload
- Before/After draggable slider for hero images
- Service grid carousel on homepage
- Gallery filter UI with Load More
- Mobile-first responsive design with custom Tailwind palette
- Geo metadata (geo.region, geo.placename, ICBM)
- Open Graph + Twitter card tags
- hreflang en-au targeting

### Site architecture (initial)
- Homepage (`/`)
- About (`/about/`)
- Contact (`/contact/`)
- Gallery / Before & After (`/gallery/`)
- Service Areas (`/areas/`)
- FAQs (`/faqs/`)
- Privacy Policy (`/privacy/`)
- 19 service pages under `/services/*/`

---

## Versioning Reference

| Version | Date | Branch | Status |
|---------|------|--------|--------|
| 1.2.0 | TBD | `develop` | In development |
| **1.1.0** | **2026-04-27** | **`main`** | **Current stable** |
| 1.0.0 | 2026-04 | (historical) | Initial release |
