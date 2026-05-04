---
name: TASK — Google Ads pixel setup when ads launch
description: Reminder for Phase 2 — when Allan starts Google Ads campaigns, we need to wire the Google Ads conversion pixel + tag manager so the GA4 events the form already fires get attributed correctly to ad clicks. Created 2026-05-05.
type: task
status: PENDING — wait for Allan to set up Google Ads
trigger: When Allan tells me "Google Ads is set up" OR when the first ad campaign is launching
originSessionId: 04add9fa-fa52-416e-bc34-9d39692a49df
---
# What's already in place

The React quote form (`master-repo/quote-form/src/QuoteForm.jsx`) already fires two GA4 conversion events:

- `quote_partial` — fires when customer completes Step 1 (name + email + phone) but doesn't finish the form
- `quote_submit` — fires when the form successfully submits to GHL

Both events are defensive: they no-op silently if `window.gtag` isn't loaded (e.g. local dev). They will fire automatically once GA4 is loaded on the page.

# What's MISSING (Phase 2 task)

1. **Google Ads conversion tag** — the actual pixel that tells Google Ads "this person converted." Different from GA4 events.
2. **Linking GA4 to Google Ads** — so GA4 events feed into Ads optimisation
3. **Conversion linker tag** (recommended) — tracks gclid across page navigations
4. **Enhanced conversions** (optional) — pass hashed email/phone to Google for better cross-device match rates
5. **Phone call conversion tracking** — if we ever use a Google-tracked forwarding phone number for ads

# When to do this

Trigger: Allan tells me "Google Ads is set up" OR sets up the first campaign.

# What we'll do

1. Get the Google Ads Conversion ID + Conversion Label from Allan's Google Ads account
2. Add Google tag manager script (or direct gtag.js) to the WordPress page templates that host the quote form
3. Map `quote_submit` to a Google Ads conversion action
4. Optionally map `quote_partial` to a "soft conversion" for early Smart Bidding signal
5. Test end-to-end: real ad click → form submit → conversion appears in Google Ads dashboard within ~6 hours

# Cost / impact

- Setup: ~1-2 hours (~10 min Allan + ~1 hr me)
- Ongoing: zero recurring cost, just attribution
- Without this: Google Ads is blind, can't optimise — wastes ad spend
- With this: Google Ads finds more people LIKE the ones who convert

# Files that will change

- `master-repo/header.php` (or wherever GA tags get injected — possibly `functions.php` enqueueing a head script)
- WordPress Customizer might be the cleanest entry point
- Form code: NO change needed — events already fire

# Reference

- Plan v2 §11 (Cleo's pre-first-quote must-haves) listed "GA4 conversion event for full submit; partial event for abandoned quote; Google Ads enhanced conversion if consent allows"
- Form code already has `fireGA4Event` helper — see `QuoteForm.jsx` around line 172

— Clifford, 2026-05-05
