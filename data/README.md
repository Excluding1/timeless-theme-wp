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

### data/pricing/

| File | Source | Date | Use case |
|---|---|---|---|
| TBC: `MASTER_PRICING_v1.xlsx` (currently external at `/Users/angelapham/Downloads/MASTER_PRICING_UPDATED 111.xlsx`) | Allan's authoritative pricing schedule | TBD | 140 SKUs T1/T2/T3 tiers — feeds quote tier templates |

**Recommendation (CEO):** move MASTER_PRICING.xlsx into this folder + commit. Otherwise if Allan's laptop dies, the only authoritative pricing source is gone. ASK ALLAN before moving.

### data/research/

| File | Source | Date | Use case |
|---|---|---|---|
| (none yet) | | | |

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
