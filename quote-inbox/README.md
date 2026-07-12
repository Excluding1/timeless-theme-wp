# Quote Inbox

A clean, decision-ready view of every quote-form request — so you can quote or call in
seconds instead of scrolling GoHighLevel and opening Cloudinary tabs.

**Open it:** double-click `Quote Inbox.command` (in this folder, or the copy in `~/Downloads`).
It opens http://localhost:4319.

## What each card shows
One card per request, ordered newest first:
- **Header:** customer, address (tap → Google Maps), and the quoting trio up top —
  **pricing tier · bathroom count · photo count · phone** (tap to call).
- **⚠ Lost-photo banner** (when it applies): if a full-bathroom submission's photos were
  destroyed by the form bug (see below), a loud red banner tells you to call and re-request.
- **Before you quote:** a risk / missing-info checklist — no phone, multi-bathroom, access
  notes, ventilation not captured, per-area detail that didn't save, etc.
- **Job scope:** the per-area breakdown (Walls → Regrout, Shower → Full regrout, …) from GHL's
  Resolved Line Items, plus **priced modifier chips** (e.g. *Epoxy grout upgrade +$250*,
  *Multi-bathroom −$200*). This is the closest thing to a quote in the data.
- **Customer's request** in plain text, with a one-click **Copy** button.
- **Photos, inline and grouped by area** — HEIC (iPhone) images are auto-converted to JPG so
  they actually display. Click any photo for a full-screen lightbox (Prev/Next, download original).
- **Extra detail** (basin finish, epoxy, full-bathroom scope, previously resurfaced).
- **Call · Open in GHL · Mark reviewed** attached to the card.

Tabs: **New** (Quote Requested) · **Q&A** · **All open** · **Reviewed**.
Search the header box (or press `/`) to jump by name/address.
Keyboard: `←` `→` move · `C` call · `R` reviewed · `G` open in GHL · `/` search. Swipe on mobile.
Dark mode follows your system setting.

## How it works
- Zero dependencies, localhost only, dev tooling — **never deployed** (excluded from the theme zip).
- Reads the GHL Private Integration Token from `../.secrets/ghl-pit.key` **server-side only**;
  the token is never sent to the browser. The browser only ever receives cleaned quote data.
- Pulls **all** open opportunities from the **Sales** pipeline (paginates past 100), maps the
  ~100 raw GHL custom fields to readable labels, and rewrites Cloudinary URLs for display.
- Reviewed state is kept in `data/reviewed.json` (atomic writes). It's local to this Mac.
- GHL non-2xx responses surface as a visible "couldn't reach GHL" error with a retry — never
  as a fake empty inbox (so an expired token can't hide new customers).

## Known form-side bugs it surfaces (fix in the React quote-form repo, not here)
These are data problems created *before* the data reaches this app; the app flags them so you
don't get caught out, but the real fix is in the form (TimelessDash):
1. **Lost full-bathroom photos.** When a customer picks *Full Bathroom Mode = yes*, photos are
   written only to `Photos Full Bathroom Urls`, which the form saves as the literal string
   `[object Object]` — so those photos never reach GHL and are unrecoverable. Confirmed on a real
   job (mick connolly: 12 photos lost). The card shows the red banner; **the fix is to
   `JSON.stringify` that URL array like the per-area fields do.**
2. **`[object Object]` per-area fields.** Area Services, Photo Count By Area, Basin Custom
   Surfaces, Chip Repair Addon — same stringification bug; the card shows "some per-area detail
   did not save."
3. **Corrupted em-dashes.** Descriptions arrive with `—` mangled into `�` characters; the app
   cleans these cosmetically, but the form is writing bad bytes.
4. **Quote totals never written.** `Quote Total Min/Max` are empty on every opp, so the "Est $–$"
   badge only appears if/when the form starts populating them.

## Not yet (v2 ideas)
- **Deploy to phone / LAN** with auth so Allan can quote in the field without the Mac running.
- **GHL-synced reviewed state** (currently local only).
- **One-tap actions** beyond Call: send estimate, request missing photos, book inspection.

Port override: `QUOTE_INBOX_PORT=xxxx node server.js`.
