# Make Scenario 1 — DATA CAPTURE (job log) — build spec

**Status:** DECISION LOCKED 2026-06-05. Allan raised it; **Cleo + data-engineer + Clifford converged → ADD NOW.** One `Google Sheets → Add a Row` at the END of Scenario 1. Warehouse choice (BigQuery) deferred + reversible. Read with `make-scenario-1-STATE-2026-06-04.md`.

## Why (the decision logic)
- **Capture = one-way door (unrecoverable).** Repeat-customer / household / same-address history, price-at-time-of-job, and the AI quote-drafter's training set are all *rows written when the job happened*. Not logged = gone; can't backfill (GHL opps archive/merge, SM8 lacks lead-source + quote-at-stage-11, stage timestamps overwrite on 11→Hold→11).
- **Storage/warehouse = reversible.** A Sheet promotes to BigQuery anytime (external table = live, zero-ETL; or one-time CSV load). The 180-day cap only applies to the automated Data Transfer Service, not manual/external. So we capture now, choose the warehouse later — no BQ work today.
- **Evidence (Cleo, transcripts):** Jordan's household quote-integrity agent + pricing "super equal" + "entire database" check for prior jobs at an address (all-transcripts-2026-04-30.md:161–163); all data in Google Cloud/BigQuery (line 321). HONEST CAVEAT: transcript does NOT state his Make *spreadsheet* is the BQ feeder — the data-layer + AI-pricing strategy is explicit, the exact pipe is inferred. Conclusion (capture now) holds regardless.
- **Matches Jordan's v1** (he logs every job). We were diverging by logging only machine-state to the dedup store.

## The build (ONE module)
- **Module:** `Google Sheets → Add a Row`.
- **Placement:** LAST module, **after `Add Job Contact`** (logs only real, fully-succeeded jobs). *(Could sit after `Mark created`; end-of-chain is cleaner — sm8_job_uuid + contact success both known.)*
- **Error handler:** **Resume/Skip → Slack note.** The log must NEVER roll back or block a job — analytics is observational. Mirrors the Add-Job-Contact rule.
- **Target:** a PRIVATE `timeless_job_log` spreadsheet, one tab, **header row = schema below**. STABLE column order — don't reorder/rename (external tables are fragile to header drift).
- **Cost:** +1 operation/job. Negligible at our volume.

## Schema (header row + Make mapping)
| Column | Map from | Why it's load-bearing |
|---|---|---|
| `opp_id` | `{{1.opp_id}}` | Primary key; joins GHL + dedup store; de-dups the log |
| `logged_at` | `{{now}}` | Event timestamp — spine of every funnel/longitudinal query |
| `sm8_job_uuid` | `{{<Create SM8 Job>.x-record-uuid}}` | Joins log → SM8 job/invoice |
| `customer_email` | `{{1.email}}` (lower/trim) | Identity key for repeat-customer detection |
| `customer_phone` | `{{1.phone}}` (+61 normalised) | Secondary identity key |
| `full_address` | `{{1.full_address}}` | **The household/same-address signal** |
| `suburb` | parse / GHL field if present | Geo pricing, area win-rate (may backfill) |
| `postcode` | parse / GHL field if present | Same (may backfill) |
| `service_category` | `{{Job Category}}` | Mix + per-category pricing + training label |
| `job_description` | `{{1.full_name}} \| notes` | Free-text feature for quote-drafter (text→price) |
| `quote_amount` | GHL monetary/Quote-Sent field if present at stage 11 | Price target var; **create column now even if blank**, backfill from Accounts later |
| `accepted_price` | (later, from Accounts) | Final accepted price; column now, populate later |
| `lead_source` | GHL `contact.source`/UTM if in payload | Conversion + ad-ROI; un-reconstructable later |
| `ghl_stage` | constant `"Job in ServiceM8"` | Funnel position |
| `ghl_pipeline` | constant `"Sales"` | Disambiguates once Accounts pipeline logs too |

*(Add `company_uuid` column when find-or-create lands.)*

## PII / Privacy (data-engineer flag)
- email/phone/address = personal info under the Privacy Act. **Same data already in GHL + SM8** — no NEW category; obligation is secure + disclose.
- **Keep PII OUT of the dedup data store** (machine-only; already enforced by the safety spec). The Sheet is the PII home.
- PRIVATE sheet, business Google account, Allan/Marko only.
- **$3M small-business exemption scheduled for removal ~Dec 2026** (penalties up to $50M) → plan to comply as a regulated APP entity within the year. Privacy policy must disclose data storage + quoting-improvement/AI use + a retention note. (Privacy-policy review task spawned.)
- **De-identify at AI-training time** (hash/drop direct identifiers at the BQ-load step), NOT at capture (you can always strip; never un-strip).

## BigQuery-later path (deferred, reversible)
When quote-drafter work starts: point a BigQuery **external table** at the Sheet (live, zero-ETL) or one-time CSV load. No BQ setup now.

## Forward-compat
Find-or-create (deferred) inserts BEFORE Create-SM8-Job; this end-of-chain log is unaffected — just add the `company_uuid` column/mapping when it lands.

## Sources (data-engineer)
Make Data Store vs Google Sheets (thinkpeak.ai) · Make Add-a-Row docs · Make community (data-store CSV export limits) · Google Cloud (Drive/Sheets external tables; Data Transfer backfill) · Schiller Legal + OAIC (AU $3M privacy exemption removal).
