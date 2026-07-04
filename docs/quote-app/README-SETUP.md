# Timeless Resurfacing — Quote & Invoice Web App

Branded quote + tax-invoice PDFs in the browser. Same premium template as
`docs/templates/quote-generator/quote.py` (navy cards, condensed headers, script
Thank-you, gold rule), rebuilt with pdf-lib so it runs anywhere with zero server.

**Features**
- **Quick Draft (built-in AI, offline):** paste the job in your own words
  ("name is Neil… 2250 tiling on top… option a / option b") and it fills the form
  from the trade price book (`js/catalogue.js`). No API keys, nothing leaves the browser.
  You always review before a PDF exists.
- Quote **and** Tax Invoice (one click converts a quote; deposit received / balance due rows).
- Two option-card styles: itemised (price per line, "included" allowed) and feature (one price + bullets).
- Photos: upload, auto-compressed, pick which one prints, caption it.
- Live PDF preview, download, duplicate, status pipeline (draft → sent → accepted → invoiced → paid).
- Sequential numbering, GST-inclusive maths (GST shown = total ÷ 11), house rules enforced
  (em-dashes stripped, banned-word warnings: written / guarantee / certificate).
- Saves **locally** out of the box; connect **Supabase** in Settings to save online across devices.
- JSON export/import backup.

## Run it
Any static host or local server — there is no build step.
```bash
cd docs/quote-app && python3 -m http.server 8920   # then open http://localhost:8920
```

## Go online (once)
1. **Supabase** (free tier): create a project at supabase.com →
   SQL Editor → paste + run `supabase-schema.sql` →
   Authentication → Users → **Add user** (your email + a strong password; this is the app login) →
   Project Settings → API: copy the **Project URL** and the **anon public key**.
2. **Deploy to Netlify:** drag the `quote-app` folder onto app.netlify.com (or
   `netlify deploy --prod --dir=docs/quote-app`). Password-protect the site if on a paid plan;
   otherwise the Supabase login already gates all data (the anon key alone can read nothing).
3. Open the site → **Settings → Online saving** → paste URL + anon key, sign in with the
   user you created → **Copy this browser's quotes → cloud** if you drafted any locally.

The Supabase **anon key is safe to enter in the app** (it is designed to be public;
row-level security + your login protect the data). Never put the `service_role` key anywhere.

## House rules baked in (keep)
- Prices are **GST-inclusive**: Total = sum of lines; "GST included" = total ÷ 11.
- No em-dashes in customer copy (auto-replaced); en-dash ranges become "X to Y".
- Banned words flagged: written / guarantee / certificate / in writing.
- Warranty default: "Up to 5-year workmanship warranty" (+ lifespan + $10M PL).
- Account: Timeless Resurfacing · BSB 032146 · Acc 025303 · 10% deposit.
- Fonts: Barlow Condensed Bold + Great Vibes (open licence, embeddable — the desktop
  script's DIN Condensed / Snell Roundhand are Apple system fonts we cannot ship on the web).

## Quote vs invoice (AU/NSW, plain English)
A **quote** is the offer before work; an **invoice** requests payment after (or for a deposit).
The app converts a quote to a **TAX INVOICE** that carries what the ATO requires: the words
"Tax Invoice", business name + ABN, date, description, buyer identity, and "Total includes GST"
with the GST amount shown. Only use TAX INVOICE if registered for GST (Settings toggle;
unticked it prints "INVOICE" and hides GST lines — you must not charge or show GST unregistered).
NSW note: residential building work priced **over $5,000 inc GST** needs a written contract
(and contractor licensing applies over that threshold) — a signed quote acceptance with the
required details can serve for small jobs; confirm the licensing position with the lawyer.

## Files
```
index.html            app shell (script order matters: vendor → rules → catalogue → draft → pdfgen → db → app)
css/app.css           brand styling, responsive
js/rules.js           GST maths, sanitiser, banned words, defaults
js/catalogue.js       trade price book (edit prices here)
js/draft.js           Quick Draft parser (the built-in "AI")
js/pdfgen.js          the PDF template engine (pdf-lib port of quote.py; UMD, node-testable)
js/db.js              localStorage ↔ Supabase storage layer
js/vendor/            pdf-lib, fontkit, supabase-js (vendored, no CDN)
fonts/ assets/        embeddable fonts + logo
supabase-schema.sql   run once in Supabase
netlify.toml          security headers (noindex)
```
Node smoke test (same code path as the browser): see the session scratchpad `test-pdf.js`
pattern — `require(js/pdfgen.js)(PDFLib, fontkit).generate(doc, settings, assets)`.
