# Data — supplier prices, pricing schedules, research files

**Purpose:** Single home for non-code data files (CSV, Excel, JSON, docs). Excluded from theme deploy zip so it doesn't bloat WordPress uploads.

**Conventions:**
- Filenames include date in `YYYY-MM-DD` format when versioning matters
- Each subfolder has its own README explaining what's there
- Old versions go in `archive/` subfolder, never deleted
- Excel files: keep authoritative editable copy here; export critical sheets to CSV for git diff visibility

---

## Folder structure

```
data/
├── suppliers/        ← Supplier price lists, contact info, agreements
├── pricing/          ← Our pricing schedules (Excel, CSV exports)
├── research/         ← Competitor research, market data, audit findings
└── archive/          ← (within each subfolder) old versions
```

---

## Active files

### data/suppliers/

| File | Source | Date | Use case |
|---|---|---|---|
| `austrs-bert-prices-2026-04-30.csv` | Australasian Resurfacing Supplies (Bert Heynen) website scrape | 2026-04-30 | Material cost lookup for resurfacing margin model. Cross-referenced in [docs/specs/bert-supplier.md](../docs/specs/bert-supplier.md) |
| `sub-resurfacing-real-quotes-2026-06.md` | Real sub quotes collected 2026-06 | 2026-06 | REAL sub cost data ($890-980 range) — supersedes sub-rate-schedule draft figures |

### data/pricing/

| File | Source | Date | Use case |
|---|---|---|---|
| `master-pricing-2026-05-01-snapshot.xlsx` | Allan's authoritative pricing schedule (in-repo CANONICAL snapshot) | 2026-05-01 | 140 SKUs T1/T2/T3 tiers — feeds quote drafting (STATE.md §11 agrees this is canonical) |
| `master-pricing-2026-04-archived-pre-audit.xlsx` | Pre-audit copy archived alongside | 2026-04 | Provenance only |

> ⚠️ **`master-pricing-2026-05-01-audited.xlsx` — referenced as the output of [docs/specs/pricing-audit-2026-05-findings.md](../docs/specs/pricing-audit-2026-05-findings.md) — is NOT on disk. Regenerate it or re-point the findings doc at the snapshot (flagged 2026-07-07).**

*(The old "TBC: external at `/Users/excluding/Downloads/MASTER_PRICING_UPDATED 111.xlsx`" row is resolved — the in-repo snapshot above is canonical.)*

### data/research/

| File | Source | Date | Use case |
|---|---|---|---|
| `jordan-transcripts-mined-2026-05-01.md` | Jordan Schofield (Surface Care) video transcripts, mined | 2026-05-01 | Benchmark model — cited across CEO.md / SOPs |
| `nsw-bathroom-trade-tam-2026-05-01.md` | Market research | 2026-05-01 | NSW TAM sizing |
| `surfacecare-mystery-shop-2026-06-13.md` | Mystery shop of Surface Care | 2026-06-13 | Competitor pricing/process intel |

*(Job-level analyses live in `docs/research/` — e.g. [job-analysis-mick-2bath-2026-06-17.md](../docs/research/job-analysis-mick-2bath-2026-06-17.md), the real-margin calibration source.)*

---

## How to update

### When a new supplier price list arrives
1. Save CSV/Excel into `data/suppliers/` with filename pattern `<supplier-name>-<topic>-YYYY-MM-DD.<ext>`
2. Update this README's "Active files" table
3. If old version exists, move to `data/suppliers/archive/`
4. Commit to git with message `data: <supplier> price update <date>`
5. Update [docs/specs/bert-supplier.md](../docs/specs/bert-supplier.md) (or relevant spec) to reference latest filename

### When pricing schedule changes
1. Update Excel file in `data/pricing/` (in-place edit, save with new version suffix if major change)
2. Export critical pricing sheet to CSV for git diff: `data/pricing/exports/master-pricing-tiers-YYYY-MM-DD.csv`
3. Update this README
4. Commit to git
5. Update [docs/CEO.md](../docs/CEO.md) money plan if material cost assumptions changed
6. Update [docs/roles/auditor-margin-per-job.md](../docs/roles/auditor-margin-per-job.md) if margin floor needs revision

### When competitor research lands
1. Save in `data/research/<competitor-name>-YYYY-MM-DD.md` (or PDF)
2. Update this README
3. Cross-reference in CEO.md if strategic implications

---

## Deploy exclusion

**This folder is EXCLUDED from the WordPress theme zip.** The deploy command in [CLAUDE.md](../CLAUDE.md) now excludes `data/*`. Do not put theme assets here.

---

## How CEO accesses these files across sessions

CEO reads:
- This README first to know what's available
- Specific files when relevant decision needs them (e.g., margin audit reads `austrs-bert-prices-2026-04-30.csv`)
- File paths are referenced from CEO.md / STATE.md / specs/ for cross-navigation

If a file is needed and missing, CEO surfaces the gap to Allan/Marko in a direct question.
