# Changelog

All notable changes to the Timeless Resurfacing theme are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **MAJOR** version (`X.0.0`) — breaking changes, theme rebuilds, removed features
- **MINOR** version (`1.X.0`) — new features, page additions, schema additions
- **PATCH** version (`1.1.X`) — bug fixes, content tweaks, no functional change

---

## [Unreleased] — `develop` branch

### Coming next (v1.3.0)
- Day 4: Schema-as-code audit + GA4 + Microsoft Clarity setup
- Day 5: Suburb programmatic landing pages (`/services/X/parramatta/` etc.)
- Day 6: Service page polish (H1 tweaks, customer-language audit)
- Off-page (parallel, 4-6 weeks): GBP claim, citations, reviews campaign

---

## [1.2.0] — 2026-04-28

The "performance + accessibility" release. Mobile Lighthouse score 97 verified
on production after deploy. Major shifts: every external font/icon CDN
self-hosted, WebP + responsive image variants, Cloudflare edge caching active,
custom Google Places reviews integration replacing paid Trustindex.

### Performance (Day 3)
- **Material Symbols icon subset** — 1.06 MB CDN → 10 KB local (99.7% smaller).
  Variable font instanced at fixed axes except FILL (kept for filled variants).
  PHP buffer filter swaps icon names → codepoints at output. Build pipeline
  reproducible via `scripts/audit-icons.sh` + `scripts/subset-material-symbols.py`.
- **Inter body font subset** — 200-300 KB CDN multi-request → 99 KB local single
  file. Variable wght (100..900) + opsz (14..32) axes preserved. Eliminates 2
  third-party DNS lookups (fonts.googleapis.com + fonts.gstatic.com).
  Build via `scripts/subset-inter.py`.
- **WebP image companions** — 1.67 MB savings on WebP-capable browsers (96%+ of
  users), 0 wasted bytes on the ~103 already-optimized PNGs. Smart converter
  only writes `.webp` when smaller than source. PHP filter wraps `<img>` in
  `<picture>` automatically.
- **Responsive image variants** (`-400w`, `-800w`, `-1600w` per source ≥800px).
  Mobile fetches the small variant via `srcset` + `sizes` instead of the full
  desktop resolution. Hero image: ~80 KB → ~6 KB on mobile. 213 variants
  generated, gitignored as build artifacts (regenerable via `scripts/`).
- **Cloudflare cache rules + .htaccess** — HTML edge cache 30 min, static
  1 year. `Expires` + `AddType image/webp` + gzip in .htaccess. Brotli +
  HTTP/3 + Speed Brain + Early Hints enabled in CF dashboard. Every page
  + every asset returns `cf-cache-status: HIT`. Production TTFB drops from
  500-800ms to 50-100ms.
- **Audit-fix-audit loop formalized as WORKFLOW.md Rule 4a**. Caught 2 critical
  Material Symbols bugs (dynamic `faucet` icon in PHP array; JS-injected
  `check_circle` bypassing PHP filter), CSS cascade-layer footguns,
  asymmetric regex word-boundaries, and more across 4+ audit passes.

### Accessibility & UX (Day 3 Task E)
- **WCAG AA contrast** — added `primary-soft: #5a6789` token (5.62:1 on white).
  Replaced ~40 misuses of `text-on-primary-container` on light backgrounds
  (was 2.94:1, FAILED AA). Footer `text-white/30` → `text-white/60` (was
  2.64:1, now 6.97:1).
- **Heading hierarchy** — fixed H2→H4 skips in footer (3 cards) + page-about.php
  (4 cards). All pages now have clean nesting.
- **Decorative star characters** — `aria-hidden="true"` + sr-only "5 out of 5
  stars" SR fallback on all 22 star clusters. Was failing WCAG 1.4.11.
- **Reviews widget rebuilt** (3-stage evolution): Trustindex (paywall expired) →
  Featurable (free but third-party CDN) → **custom self-hosted Google Places API
  integration**. Server-side fetch via `places.googleapis.com/v1/places/{id}`
  (new endpoint, not legacy), 24-hour transient cache, smart Place ID
  resolver accepting business name OR Maps URL OR direct ID. Renders our own
  Tailwind cards. Trustindex-style carousel (manual click + wrap-around) +
  modal popup for "Read more" with click-outside / ESC dismiss.
- **Days-based time labels** ("9 days ago" instead of Google's vague
  "a week ago") computed from publishTime in Sydney timezone.
- **Hover tooltips** on Google G logo, Verified badge, time label
  (full timestamp). Pure CSS, no JS, with focus-within for keyboard a11y.
- **Favicon set** — multi-format (ico, PNG 96x96, apple-touch-icon, manifest).
  theme-color set to brand `#041534`. SVG omitted from link tags due to
  bloated upstream (1.46 MB raster-in-SVG); inline comment in header.php
  documents how to restore once a real vector is provided.

### UI/UX (also Day 3 Task E)
- SECTION 2B before/after cards capped at `max-w-md` on 4 big service pages.
- H2 sizing standardized across all 19 service pages + about + homepage to
  `text-3xl sm:text-4xl`.
- Homepage "Full Renovation" badge icon: `delete` (trash) → `close` (X).

### Verified on production
- Mobile Lighthouse score: **97** (up from previous baseline)
- All assets `cf-cache-status: HIT`
- HTTP/3 advertised, Brotli compression active
- Real Google reviews rendering (3 reviews, real photos, days-ago labels,
  hover tooltips functional)

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
