# Quote Inbox

A clean, readable view of every quote-form request — so you can quote or call in seconds
instead of scrolling GoHighLevel and opening Cloudinary tabs.

**Open it:** double-click `Quote Inbox.command` (in this folder, or the copy in `~/Downloads`).
It opens http://localhost:4319.

## What it shows
Each quote request is one card:
- Customer name, address, phone (tap **Call**), how many bathrooms, property type
- The customer's request in plain readable text
- **The actual photos, inline** — HEIC images are auto-converted to JPG so they display
  (no more downloading from Cloudinary). Click a photo to enlarge / download the original.
- Pricing tier, basin finish, lift access, and the rest of the captured details
- **Open in GHL** jumps straight to the opportunity; **Mark reviewed** clears it from your queue

Tabs: **New** (Quote Requested) · **Q&A** · **All open** · **Reviewed**.
Keyboard: `←` `→` move · `C` call · `R` reviewed · `G` open in GHL. Swipe on mobile.

## How it works
- Zero dependencies, localhost only, dev tooling — **never deployed** (excluded from the theme zip).
- Reads the GHL Private Integration Token from `../.secrets/ghl-pit.key` **server-side only**;
  the token is never sent to the browser. The browser only ever receives cleaned quote data.
- Pulls opportunities from the **Sales** pipeline, maps the ~100 raw GHL custom fields to
  readable labels, and rewrites Cloudinary URLs for display.

## Known data issue it surfaces
Some per-area fields save to GHL as the literal string `[object Object]` (a bug in the
quote form's GHL field mapping — a JS object was concatenated instead of `JSON.stringify`d).
Affected fields: *Area Services, Photo Count By Area, Basin Custom Surfaces, Chip Repair Addon,
Photos Full Bathroom Urls*. The card shows an **"area detail incomplete"** badge when this
happens. The customer's written request, the summary, and the photos are unaffected. Fixing it
properly is a change in the React quote-form repo (TimelessDash), not here.

Port override: `QUOTE_INBOX_PORT=xxxx node server.js`.
