# Quote Form — Standalone React App

This is the **isolated React + Vite app** for the Timeless Resurfacing quote form. It lives on the `feature/quote-form-embed` branch of the WordPress theme repo so it can be developed and updated separately from the main theme code, then embedded later when ready for production.

## Status

**Phase 1 hardening: complete** (see `docs/QUOTE-FORM-HARDENING-PLAN.md`)

- Validation hardening (NSW postcode, tenant email, honeypot)
- Privacy compliance (Privacy Act 1988 + Spam Act 2003)
- Performance (client-side image compression, localStorage persistence)
- Accessibility (WCAG AA — aria-pressed, ≥44px touch targets, role="group")
- Error handling (3-retry exponential backoff, phone CTA)
- Responsive (375 / 768 / 1280)
- Persona testing (12 customer scenarios validated)

**Phase 2-5: pending external setup** — see plan doc for details.

## Pending integrations (waiting on user decisions)

Two `REPLACE_ME` placeholders in `src/QuoteForm.jsx` need real values before the form can submit anywhere:

```js
const GHL_WEBHOOK = "...REPLACE_ME";        // Full submission webhook
const GHL_PARTIAL = "...REPLACE_ME_PARTIAL"; // Partial-capture webhook
```

Plus: photo upload destination (Cloudinary / GHL Files / WP Media — not yet decided).

## Local development

```bash
cd quote-form
npm install         # first time only
npm run dev         # dev server on http://localhost:5173
npm run build       # production build → dist/
```

## How this gets into WordPress (Phase 5)

Plan: build the form, then either
1. Embed the compiled bundle as a script tag in WordPress (treats the form as a single-page widget), OR
2. Replace the existing `front-page.php` quote form section with a div that React mounts into.

Both keep the WordPress theme's PHP-rendered SEO-friendly content while letting the form be a richer JS widget.

## Why this lives on its own branch

- Keeps the production WP theme (`develop` / `main`) clean while the form is being hardened
- Lets you ship WP theme changes (perf fixes, content updates) without entangling form work
- When ready to integrate, this branch merges back into `develop` with the embed wiring as a single coherent change
