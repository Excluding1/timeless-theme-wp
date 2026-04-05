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
    └── page-*-sydney.php  # 19 service pages
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
- Customizer stores phone, email, licence, ABN — accessed via `timeless_phone()`, `timeless_email()`, `timeless_licence()`
- Responsive breakpoints: `md:` (768px) for hero grid, `sm:` for general mobile
- All service pages follow identical HTML structure — hero image, problem description, process steps, FAQ, CTA

## Deploy Workflow
1. Edit files in this repo
2. `git add -A && git commit -m "description" && git push`
3. Zip (excluding .git): `zip -r ../timeless-theme.zip . -x ".git/*" "HANDOFF.md" "CLAUDE.md" ".DS_Store"`
4. Upload via wp-admin → Appearance → Themes → Upload → "Replace current with uploaded"

## Related Repos
- **React Quote Form:** https://github.com/Excluding1/TimelessDash (branch `quote-form/react-v8`)
  - Standalone React embed, NOT part of this WordPress theme
  - Has `REPLACE_ME` webhook URLs waiting for GHL account

## Pending Work
See `HANDOFF.md` for the full task list. Key items:
- Upload this theme + page-creator plugin to live WordPress
- Configure Customizer (real phone, email, licence)
- Replace placeholder images with real job photos over time
- Add HTTPS redirect in .htaccess
- Warranty text bulk update: "2-Year" → "Up to 5-Year"
- Blog template for future content marketing
- Google Search Console + Analytics setup

## Do NOT
- Use React/SPA patterns — this is pure server-rendered WordPress for SEO
- Add a build step — Tailwind is loaded via CDN intentionally
- Put content images (blog photos) in git — those go in WordPress Media Library
- Change image filenames — PHP templates reference them by exact path
