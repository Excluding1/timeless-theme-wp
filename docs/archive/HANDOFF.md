# Timeless Resurfacing — WordPress Theme Session Handoff

> ⚠️ **HISTORICAL — THEME-focused, STALE below this banner (last real update 2026-05).** Do NOT act on task lists in this file (its "upload theme / create pages / SSL" items were all completed by 2026-06-11 — **site + GHL-wired quote form are LIVE and certified end-to-end; first real customer captured 2026-06-11**). CURRENT canonical state: **`docs/STATE.md`** (the authority) + the newest `memory/SESSION_RESUME_*.md` (06-12 at time of writing) + **`docs/specs/FINALIZATION-ROADMAP-2026-06-07.md`** + the CEO Cockpit board (`node cockpit/server.js` → http://localhost:4317). Kept only as the historical theme-architecture reference.

## Quick Start for New Session
```
cd /Users/excluding/Downloads/timeless-theme-wp
```

## GitHub Repo
- **WordPress Theme:** https://github.com/Excluding1/timeless-theme-wp (THIS repo)
- **React Quote Form + Dashboard:** https://github.com/Excluding1/TimelessDash (separate repo, branch `quote-form/react-v8`)

## Live Site
- **URL:** https://timelessresurfacing.com.au
- **WordPress Admin:** https://timelessresurfacing.com.au/wp-admin/
- **Hosting:** VentraIP cPanel (shared IP `110.232.143.168`)
- **SSL:** AutoSSL (free Let's Encrypt) — `timelessresurfacing.com.au` validated, `www.` pending

## Theme Architecture
```
timeless-theme-wp/
├── style.css              # Theme metadata + custom CSS (animations, slider, mobile menu)
├── functions.php          # Theme setup, Tailwind CDN, Customizer, security, AJAX form handler
├── header.php             # Nav bar, mobile menu, meta tags
├── footer.php             # Footer, mobile sticky CTA
├── front-page.php         # Homepage with before/after slider, services, FAQ, quote form
├── 404.php                # Custom 404
├── index.php              # Fallback template
├── page.php               # Default page template
├── htaccess-security.txt  # Security rules to add to .htaccess
├── images/
│   ├── before-bath.jpg    # Real before photo (716KB)
│   └── after-bath.jpg     # Real after photo (672KB)
├── js/
│   └── main.js            # Mobile menu, FAQ accordion, scroll reveal, before/after slider JS
└── page-templates/        # 24 page templates
    ├── page-about.php
    ├── page-contact.php
    ├── page-gallery.php
    ├── page-areas.php
    ├── page-privacy.php
    └── page-[service-name]-sydney.php (×19 service pages)
```

## Design System
- **CSS:** Tailwind CDN (`cdn.tailwindcss.com`) with custom palette in `functions.php`
- **Font:** Inter (Google Fonts)
- **Icons:** Material Symbols Outlined
- **Primary:** `#041534` (dark navy)
- **Secondary text:** `#595e6d` (was `#44495a` in quote form)
- **Accent:** `#e7c08b` (gold)
- **Surface:** `#f7f9fb` (off-white)

## Current State of the Site

### What's Working
- ✅ WordPress installed and theme activated
- ✅ Homepage with before/after slider (real photos)
- ✅ All 25 page templates created in theme
- ✅ Tailwind CSS, Inter font, Material Symbols all loading
- ✅ Mobile responsive with sticky CTA bar
- ✅ SEO structured data (LocalBusiness + FAQPage schemas)
- ✅ Security hardening (XML-RPC disabled, login rate limiting, headers)
- ✅ SSL on main domain (AutoSSL)

### What Still Needs Doing

#### Immediate (upload to WordPress)
1. **Upload updated theme zip** (`/Users/excluding/Downloads/timeless-theme.zip`, 1.5MB)
   - wp-admin → Appearance → Themes → Add New → Upload → Replace current
2. **Create all 25 WordPress pages** via plugin
   - Upload `/Users/excluding/Downloads/timeless-page-creator.zip`
   - wp-admin → Plugins → Add New → Upload → Activate → then Deactivate & Delete
3. **Set permalinks** to `/%postname%/` (plugin does this, but verify at Settings → Permalinks)
4. **Configure Customizer** — wp-admin → Appearance → Customize → Business Details:
   - Real phone number (replace `0400 000 000`)
   - Real email (replace `info@timelessresurfacing.com.au`)
   - NSW licence: LEAVE BLANK — never claim "NSW Licensed" (Override 5 v2; jobs kept <$5K inc GST). Do NOT set a licence number.
   - ABN (once registered)

#### Short-term
5. **Add HTTPS redirect** in `.htaccess`:
   ```
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```
6. **Get www. SSL working** — currently only non-www is validated
7. **Replace 30 placeholder Unsplash images** with real before/after photos as jobs are completed
8. **Warranty copy audit** (per-material — **NOT a bulk sed**; that would over-claim grout/silicone = ACL breach): keep cement grout 2yr / silicone 1yr / epoxy 5yr / resurface up-to-5yr private, 6mo rental. Reconcile the live "3yr vs Up to 5-Year" page contradictions case-by-case after Allan confirms the headline figure. See STATE.md §15.

#### Medium-term (business setup)
9. **GHL (GoHighLevel) account setup** — needed for:
   - Replace `REPLACE_ME` webhook URLs in React QuoteForm.jsx
   - CRM pipeline
   - SMS/email automation
   - Review requests
10. **Google Business Profile** → link to website
11. **Google Ads** → landing pages ready
12. **ServiceM8 + Xero + Stripe** integration
13. **ABN registration**
14. **Find subcontractors** (Phase 1: regrouting only)

#### Content/SEO
15. **Real testimonials** — replace placeholder quotes
16. **Blog setup** — WordPress already supports posts, just need to add blog page template
17. **Google Search Console** → submit sitemap
18. **Google Analytics / Tag Manager** setup

## QuoteForm.jsx (React — separate repo)
- File: `/Users/excluding/Downloads/timeless-quote-app/src/QuoteForm.jsx` (v9.2)
- Repo: `TimelessDash` branch `quote-form/react-v8`
- ✅ NOW WIRED to LIVE GHL (W1 new-lead webhook + `secret_token` in `.env.local`; locationId `Uz8fQwDiUxAHVtlruspD`) — verified 2026-06-05; the `REPLACE_ME` note is stale. ⚠️ STILL TODO: `npm run build` + deploy the *wired* form to the live site (the currently-deployed bundle is the older, un-wired one)
- 5-step wizard with photo upload, GCLID tracking, partial lead recovery
- NOT part of the WordPress theme — it's a standalone React embed

## Key Decisions Made
- WordPress for SEO (not React SPA) — Google indexes server-rendered HTML properly
- Tailwind via CDN (not build step) — simpler deploys for WordPress
- No Gutenberg/block editor — all pages are PHP templates for speed + consistency
- Images: theme structural images in git, content images via WordPress Media Library
- Before/after slider: pure CSS/JS (no library), uses `clip` technique with drag handle

## Deploying Theme Changes
1. Make changes in `/Users/excluding/Downloads/timeless-theme-wp/`
2. Commit & push to GitHub
3. Zip the theme: `cd /Users/excluding/Downloads && zip -r timeless-theme.zip timeless-theme-wp/ --exclude "*/.secrets/*" "*/.DS_Store" "*/.git*"`
4. Upload via wp-admin → Appearance → Themes → Upload → Replace current

## For Blog Posts in the Future
- Just log into wp-admin → Posts → Add New
- Write in WordPress editor (Gutenberg)
- Add images via Media Library (uploaded to server, not git)
- No theme changes needed — WordPress handles blog posts natively
