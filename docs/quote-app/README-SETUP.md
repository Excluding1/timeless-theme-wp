# Timeless Resurfacing — Quote & Invoice Web App

Branded quote + tax-invoice PDFs in the browser. The quote uses the premium card template
(navy cards, condensed headers, script Thank-you, gold rule); the TAX INVOICE uses a distinct
invoice-form layout modelled on the business's original invoice and the ATO's requirements.

**Features**
- **Quick Draft (built-in, offline):** paste the job in your own words ("$1,300 tiles on top,
  wall resurfacing and stripback - 1800, regrout 1000…") and it binds each price to the right
  service from the price book, headlines the main job, and composes THE JOB description
  (all services + how we do each), "What to expect" (real durations per service) and the
  exact per-material warranty (resurfacing up to 5yr / grout 2yr / silicone 1yr). No API keys,
  nothing leaves the browser. You always review before a PDF exists.
- **Mini AI (optional, local, works throughout):** a language model that runs entirely in the
  browser — Chrome's built-in model when available, else a one-time ~1GB WebLLM download
  (opt-in, Settings). It helps at three points: **✨ AI draft** reads messy notes and fills the
  form — including **identifying options** (it splits "resurface 1540 or strip back and
  resurface 1990" into Option A / Option B, keeps shared work in both, and handles "included"
  items and "3 tiles at 90 each"); **✨ Polish wording** rewrites the job description + options
  note; **✨ Tidy conditions** cleans the warranty special conditions. **Guardrails (verified with a 21-case adversarial
  test):** every AI output is validated before it's applied — an amount is accepted only if that
  exact number appears in your notes (a hallucinated or 10× price is dropped and flagged), no
  banned words, no invented numbers or dates, and warranty/period/totals always come from the
  price book, never the model. If the AI result breaks a rule, your original text is kept. AI
  draft falls back to the offline parser if no model is available.
- **Price book (Settings):** every service, wording, price, keywords and "main job" flag is
  editable; add your own services; Quick Draft uses your edited book. **Option library:**
  "☆ Save" any option and re-insert it on future quotes.
- Quote **and** TAX INVOICE (one click converts; deposit received / balance due under the full
  total; quote reference carried over).
- **Warranty PDF (after the job):** a signed single-page "Limited Workmanship Warranty" that
  matches the services on the document — per-material periods (resurfacing up to 5yr / tiling
  up to 5yr / grout 2yr / silicone 12mo), auto-composed special conditions + care + exclusions
  (incl. tile-over specifics), the **exact ACL reg 90(4) mandatory text** verbatim, and a claims
  address. **Signing:** clicking Warranty opens a popup where you pick who is signing (Allan /
  Marko, editable in Settings → Warranty signing) and sign fresh on the spot; the signer's name
  prints on the PDF. A saved signature is optional (one-tap reuse in the popup). Add a
  **business/postal address** in Settings (the warranty rules require a claims address).
  Legally it must be given WITH the final invoice at completion, not just linked — the app
  reminds you. Adapted from our subbie's Ultra Glaze operator card, rebuilt to our brand + ACL rules.
- **Clickable links** to `/warranty/`, `/care-instructions/` and `/terms/` on your site print
  in the footer of every quote, invoice and warranty PDF.
- **Copy send message** button: one-click email/SMS text for a quote or invoice.
- Photos (upload, auto-compress, pick one, caption), live PDF preview, duplicate, statuses
  (draft → sent → accepted → invoiced → paid), JSON backup.
- **Numbering:** prefix + counter, prints as `TR-1022`, `TR-1023`, … (Settings). Quotes are
  **valid 7 days** ("Valid until" printed top-right and in the footer).
- GST: the business IS registered — totals are GST-inclusive, GST shown = total ÷ 11.
- Saves locally out of the box; connect **Supabase** in Settings to save online across devices.

## Run it
Any static host or local server — no build step. Locally: serve this folder on any port
(e.g. the `quote-app` launch config, port 8920).

## Go online (once)
1. **Supabase** (free): create a project → SQL Editor → run `supabase-schema.sql` →
   Authentication → Users → **Add user** (your email + strong password = the app login) →
   Project Settings → API: copy the **Project URL** + **anon public key**.
2. **Netlify:** drag this folder onto app.netlify.com (or `netlify deploy --prod --dir=docs/quote-app`).
3. In the app: click the gold **Sign in to sync** badge (the connection is pre-wired) →
   "Copy this browser's quotes → cloud" if you drafted any locally.

The anon key is safe in the app (public by design; login + row security protect the data).
Never use the `service_role` key anywhere.

## Tax invoice compliance (researched 2026-07-05, primary sources)
The TAX INVOICE layout carries everything the ATO requires (QC22438 + GSTR 2013/1):
"TAX INVOICE" heading · seller identity + ABN · issue date · buyer identity (required at
$1,000+, we always print it) · itemised description with prices · **"Total price includes GST
of $X"** (ATO-endorsed wording when GST is exactly 1/11th, which is our case) · when a deposit
was taken: full total first, then "Deposit received" and "Balance due" (GSTR 2013/1 pattern —
never a balance-only invoice). Payment reference = the invoice number. Issue within 28 days
of a request.

**NSW flags (Home Building Act):**
- Bathroom resurfacing IS licensable "minor maintenance" work in NSW when a job is worth
  **more than $5,000 in labour + materials inc GST** — the app warns on any document over
  $5,000. Until a contractor licence is held, keep jobs under that threshold (lawyer question
  is already queued with the Fair-Work brief).
- Once licensed, the licence number legally belongs on all stationery/advertising — add it
  to Settings (the "NSW licence no" field is already there) → it prints under the ABN.
- Jobs $5,000–$20,000 need a written small-jobs contract containing the licence number;
  NSW caps home-building deposits at **10%** (our standard).

## Files
```
index.html            app shell (script order matters: config → vendor → rules → catalogue → warranty → draft → pdfgen → db → minillm → app)
js/warranty.js        warranty model: per-service periods, special-condition composer
css/app.css           brand styling, responsive
js/rules.js           GST maths, sanitiser, banned words, validation (incl. the >$5k NSW warning)
js/catalogue.js       price book defaults + composer metadata (phrase/process/expect/warranty per service)
js/draft.js           Quick Draft parser (run-binding engine) + THE JOB / warranty / expect composer
js/pdfgen.js          PDF engine: quote card template + distinct TAX INVOICE layout
js/minillm.js         local mini AI (Chrome built-in → WebLLM), validated output
js/db.js              localStorage ↔ Supabase, settings migrations, TR- numbering
js/vendor/            pdf-lib, fontkit, supabase-js, webllm (all vendored, no CDN)
fonts/ assets/        embeddable fonts (Barlow Condensed / Great Vibes) + logos
supabase-schema.sql   run once in Supabase
netlify.toml          security headers (noindex)
```
House rules baked in: GST-inclusive (÷11) · no em-dashes · banned words flagged
(written/guarantee/certificate) · account Timeless Resurfacing BSB 032146 Acc 025303 ·
10% deposit · warranty per material, never overclaimed.
