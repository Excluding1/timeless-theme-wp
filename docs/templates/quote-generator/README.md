# Quote PDF generator (reusable template)

Branded customer-quote PDFs for Timeless Resurfacing. One engine, reused per job.

## Use
1. Open `quote.py`, copy an existing config (`JOHN` = single price + photo, `STEPHANIE` = two options A/B) and edit it. Add it to the `CONFIGS` dict.
2. Run:
   ```
   python3 quote.py JOHN          # build one
   python3 quote.py               # build all configs
   ```
   PDF is written to the config's `out` path (default `~/Downloads/Timeless-Quote-*.pdf`).
3. Render-check before sending (no GUI needed):
   ```
   python3 -c "import fitz; fitz.open('<out.pdf>')[0].get_pixmap(dpi=140).save('/tmp/q.png')"
   ```

Requires `reportlab`, `pymupdf` (render check), `Pillow` (photo sizing): `python3 -m pip install --user reportlab pymupdf pillow`.

## Config fields
`customer · address · access` (e.g. "(first-floor unit)", or "") · `quote_no · date` · `available` (job date, or "" to hide) · `job_intro` · `options` (list: 1 = single price block, 2+ = stacked A/B cards) · `options_note` (shown only for 2+) · `warranty` · `expect` · `photo` (path, or "") · `photo_caption` · `out`.

Reusable blocks: `WARRANTY_5YR`, `EXPECT_DAY`, `EXPECT_HALFDAY`. Job photos live in `photos/`.

## House rules (enforced in copy — keep them)
- **No em-dashes** in sentences (commas / colons / periods). En-dash only in ranges (`24-48h`).
- **Banned words:** "written", "guarantee", "certificate", "in writing".
- Turnaround = **"within 24 hours"**. Resurfacing warranty = **"up to 5 years"** + the ACL line. Prices **inc GST**.
- Run the **customer-fairness / accuracy lens per line** — never state work that isn't real for that job (e.g. don't claim "cornice patched" or "new drain cover" unless that job actually includes it).

## History (configs kept as a record)
- `STEPHANIE` — Canley Vale, two-option (resurface +/- strip-back, new drain cover), $1,450 / $1,550, avail 13 Jul 2026.
- `JOHN` — Unit 60/192 Vimiera Rd Marsfield, single price $1,540, pressed-metal tub + chip repairs, with bath photo.
