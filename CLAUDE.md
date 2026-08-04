# Timeless Resurfacing — WordPress Theme

## Project Overview
Custom WordPress theme for **timelessresurfacing.com.au** — a bathroom resurfacing and shower regrouting business in Sydney, NSW Australia.

**Live site:** https://timelessresurfacing.com.au
**WordPress admin:** https://timelessresurfacing.com.au/wp-admin/
**Hosting:** VentraIP cPanel (IP `110.232.143.168`)

## Tech Stack
- **WordPress** PHP theme (NOT React — this is server-rendered for SEO)
- **Tailwind CSS** via CDN with custom palette defined in `functions.php`
- **Google Fonts:** Inter
- **Icons:** Material Symbols Outlined
- **No build step** — edit PHP/CSS/JS directly, zip, upload to wp-admin

## Brand Palette
- Primary: `#041534` (dark navy)
- Secondary text: `#595e6d`
- Accent/Gold: `#e7c08b`
- Surface: `#f7f9fb`
- Error: `#ba1a1a`

## File Structure
```
├── style.css              # Theme metadata + animations (slider, mobile menu, FAQ)
├── functions.php          # Tailwind config, Customizer, security, AJAX form, speed optimizations
├── header.php             # Fixed nav, mobile menu, meta tags
├── footer.php             # Footer links, mobile sticky CTA bar
├── front-page.php         # Homepage: hero slider, services grid, FAQ, quote form
├── page.php               # Default page fallback
├── 404.php                # Custom 404
├── js/main.js             # Before/after slider, mobile menu, FAQ accordion, scroll reveal
├── images/                # ALL images organized by page (see below)
└── page-templates/        # 24 page templates
    ├── page-about.php
    ├── page-contact.php
    ├── page-gallery.php
    ├── page-areas.php
    ├── page-privacy.php
    └── page-*.php         # 19 service pages (no -sydney suffix; URLs are /services/<slug>/)
```

## Image Organization
Images are organized by page so they're easy to find and swap:
```
images/
├── homepage/              # before.jpg, after.jpg (slider), gallery-1/2/3.jpg
├── about/                 # hero.jpg, result.jpg, process.jpg
├── gallery/               # surry-hills.jpg, bondi-beach.jpg, parramatta.jpg, etc.
└── services/              # One folder per service page, each has hero.jpg
    ├── shower-regrouting/hero.jpg
    ├── bath-resurfacing/hero.jpg
    ├── tile-resurfacing/hero.jpg
    └── ... (19 folders)
```
To swap an image: replace the `.jpg` file in the matching folder. The PHP references use `get_template_directory_uri()` so filenames must stay the same.

## Conventions
- All image `src` attributes use: `<?php echo get_template_directory_uri(); ?>/images/...`
- Page templates use WordPress `_wp_page_template` meta via the page-creator plugin
- Customizer stores phone, email, licence, ABN — accessed via `timeless_phone()`, `timeless_phone_link()`, `timeless_email()`, `timeless_licence()`, `timeless_abn()`
- Responsive breakpoints: `md:` (768px) for hero grid, `sm:` for general mobile
- All service pages follow identical HTML structure — hero image, problem description, process steps, FAQ, CTA

## Deploy Workflow

### CRITICAL: dev screenshots, build artifacts, and stray files MUST stay out of the deploy zip
Never use `*.png` as a blanket exclusion (that ate hero images on 2026-05-05). Never use `git add -A` when the working tree has unrelated changes. The deploy command below is bulletproof — use it verbatim.

### 1. Edit files in this repo

### 2. Commit ONLY the files you intended to change
```bash
git add path/to/specific/files.php   # NOT git add -A
git commit -m "description"
git push
```

### 3. Build the deploy zip (bulletproof exclusions)
```bash
cd /Users/excluding/Downloads/timeless-theme-wp
# ⚠️ NAME THE ZIP AFTER THE *ACTIVE* THEME FOLDER (currently timeless-theme-2) — WP derives the
# install folder from the zip name; a mismatched name installs a NEW suffixed copy instead of
# offering "Replace current with uploaded" (the 2026-06-11 lesson).
zip -rq ../timeless-theme-2.zip . \
  -x ".git/*" ".gitignore" "HANDOFF.md" "CLAUDE.md" ".DS_Store" \
  ".secrets/*" ".claude/*" "docs/*" "data/*" "quote-form/*" "assets/brand/internal/*" ".playwright-mcp/*" \
  "node_modules/*" "dashboard/*" "daemon/*" "scripts/*" "cockpit/*" "contractor-app/*" "quote-inbox/*" \
  "pipeline/*" \
  "src/*" "postcss.config.js" "package.json" "package-lock.json" \
  "memory/*" "*.log" "*.zip" "*.map" "images/blog/*"
```
(`images/blog/` = AI-illustrative blog images for the wp-now localhost preview ONLY — live posts get them via the Media Library, so they must not ship in the theme.)

**Includes:** all theme PHP, `images/` (incl. responsive variants), `assets/main.min.css` (compiled Tailwind), `assets/quote-form/` (React form build, untracked but required for homepage shortcode), `js/main.js`, `style.css`.

**Excludes:** `.secrets/` (⚠️ live API credentials — ServiceM8 / GHL PIT / Make webhook secret; NEVER deploy to the public site), `.git/`, `.claude/` (dev tooling + screenshots — anything dev-side goes here), `docs/`/`data/`/`memory/` (CEO/AI internal), sibling apps in master-repo (`dashboard/`, `daemon/`, `scripts/`, `contractor-app/`), build pipeline (`node_modules/`, `src/`).

### 4. Upload via wp-admin
Appearance → Themes → Upload → **"Replace current with uploaded"**
⚠️ **WP may instead install a SUFFIXED COPY (e.g. `timeless-theme-2`) and leave the old theme active** (happened 2026-06-11: live kept serving the old theme after "upload done"). After every upload: Appearance → Themes → open **Theme Details** on each "Timeless Resurfacing" card → ACTIVATE the one whose URL says the newest `theme=` slug. **Customizer values (phone/email/ABN) are stored PER theme folder** — note them before switching, re-enter after. Delete stale inactive copies to keep this from recurring.

### 5. Purge BOTH caches (REQUIRED — the step everyone forgets)
1. **SpeedyCache** (WP plugin): admin bar → SpeedyCache → Purge/Delete cache.
2. **Cloudflare**: dashboard → `timelessresurfacing.com.au` → **Caching → Configuration → Purge Everything**.
Without this, customers see cached HTML referencing old assets for up to 1 hour.
⚠️ The Cloudflare Cache Rule "Cache HTML pages" MUST keep its `Cookie does not contain wordpress_logged_in` condition (added 2026-06-11). Without it, an admin browsing the site right after a purge gets their ADMIN-BAR view cached and served to every visitor (this happened; diagnose via `curl -s site | grep -c wpadminbar` + `cf-cache-status`). Always verify the live site in INCOGNITO, never logged in.

### 6. Hard-refresh your browser
Mac: `Cmd + Shift + R`, or open in Incognito.

### 7. Verify
- View page source → search `main.js?ver=` → should be a timestamp, NOT `1.0.0` (filemtime cache-bust working)
- View page source → search `main.min.css?ver=` → should also be a timestamp
- Service page → Section 2B before/after slider has visible white circle handle + arrow SVG
- wp-admin → Themes → Theme Details → version reads `1.5.0`

### Common deploy regressions to avoid (learned 2026-05-05)
| Mistake | Symptom | Prevention |
|---|---|---|
| `*.png` blanket exclusion | All hero images missing | Exclude screenshots **by name** or rely on .gitignore + .claude/screenshots/ |
| Hardcoded `?ver=1.0.0` on JS enqueue | JS updates never reach browsers | Always use `filemtime()` cache-busting on `wp_enqueue_script` |
| `git add -A` with unrelated working tree | Half-done features ship | Stage specific files only |
| Forgot Cloudflare purge | Updates take 1+ hour to appear | Purge after every theme upload |
| Untracked broken templates leak via zip | New page-X.php appears with broken content | Move broken WIP files outside the theme dir |
| Tailwind v3 syntax (`mt-[-22px]`, `w-0.5`) | Slider handles + lines invisible | Use `-mt-[22px]`, `w-[2px]` (v4 correct syntax) |
| Section 2B sliders use `width:X%` clip | BEFORE image compressed, looks "chopped off" | Use `clip-path:inset(0 [100-X]% 0 0)` instead — same as hero slider |

### Where to put things
| Type | Location | Why |
|---|---|---|
| Dev screenshots (Lighthouse runs, regression photos) | `.claude/screenshots/` | Already gitignored + already excluded from zip |
| Live-site curl outputs / debug logs | `.claude/debug/` | Same |
| Local IDE state | `.claude/launch.json` etc. | Already gitignored |
| Sibling apps you don't want deployed | `dashboard/`, `daemon/`, `quote-form/` | Already excluded from zip |
| Real production images (job photos) | `images/services/X/` etc. | Tracked in git so they ship with theme |
| Responsive image variants (`-400w`, `.webp`) | `images/...` (gitignored but on disk) | `timeless_webp_picture_filter` auto-serves them; deploys via zip include |

## Related Repos
- **React Quote Form:** https://github.com/Excluding1/TimelessDash (branch `quote-form/react-v8`)
  - Standalone React embed, NOT part of this WordPress theme
  - ✅ Wired to LIVE GHL (W1 webhook + `secret_token`) — ✅ deployed to the live site 2026-06-11 (theme v1.5, form live on 13 pages).

## Pending Work
**Business-automation roadmap (GHL · Make · ServiceM8 · Slack · contractor sub-app) — canonical = the CEO Cockpit board (localhost:4317) + `memory/SESSION_RESUME_2026-06-05.md` + `docs/specs/decision-sm8-keep-vs-build-2026-06-05.md`. Plan order (2026-06-05): internal backbone → contractor app → launch.**
THEME pending items (older full list in `docs/archive/HANDOFF.md`):
- ~~Upload this theme + page-creator plugin to live WordPress~~ ✅ done — site LIVE since 2026-06-11
- ~~Configure Customizer (real phone, email, licence)~~ ✅ done — site live (licence stays blank per Override 5)
- Replace placeholder images with real job photos over time
- Add HTTPS redirect in .htaccess
- Warranty copy audit (per-material; **NOT a bulk replace** — see STATE.md §15): keep grout 2yr / silicone 1yr / resurface up-to-5yr; use "Up to 5-Year" only with nearby qualifying text (ACL)
- Blog template for future content marketing
- Google Search Console + Analytics setup

## Do NOT
- Use React/SPA patterns **in the WordPress theme** — this is pure server-rendered WordPress for SEO. *(The separate **contractor sub-app** IS a React PWA — a distinct planned project, blueprint in `docs/specs/contractor-app-blueprint-2026-06-05.md`; this rule is theme-only.)*
- Add a build step — Tailwind is loaded via CDN intentionally
- Put content images (blog photos) in git — those go in WordPress Media Library
- Change image filenames — PHP templates reference them by exact path
