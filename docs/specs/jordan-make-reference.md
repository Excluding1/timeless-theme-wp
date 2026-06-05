# Jordan Schofield (Surface Care) — Make.com scenario, as observed by Allan (2026-06-04)

**PRIMARY SOURCE:** Allan's eyewitness read of Jordan's Make blueprint on screen (Rule 9 — Allan eyewitness = top authority). Some labels are Allan's best read of small/cut-off icons → flagged *approx*. "sms" in Allan's notes = **ServiceM8 (SM8)**.

## Allan's observation (verbatim, lightly cleaned)
**Main scenario, left→right:**
1. **GHL trigger** — stage **"Job in ServiceM8"**.
2. Get custom values/default of the **job opportunity** (GHL).
3. Get custom fields from **"Job Details"** (GHL).
4. **Multiple images** (Iterator over images).
5. **Find contact via email**.
6. Router: **"new or old contact?"** → splits into **TWO lanes** (one partly cut off):
   - **Lane A (new):** create new job for contact → **sleep 3s** → *(approx)* SM8 assign job to **"ACT" queue** → add GHL data to **spreadsheet**.
   - **Lane B (existing):** cross-reference job → **sleep 3s** → cross-reference client → create new job for contact → SM8 assign job to ACT queue → add GHL quote/data to spreadsheet.

**Separate helper group (3 HTTP / "internet" icons):**
- SM8 **get list of job queues** → queue UUID.
- SM8 **get list of categories** → category UUID.
- GHL **get custom details** of the job opportunity.

**BREAK (error-handler) icons throughout** the pipeline.

## Map to OUR Scenario 1 v2
| Jordan's step | Our v2 equivalent | Verdict |
|---|---|---|
| GHL trigger, stage "Job in ServiceM8" | Pipeline-Stage-Changed @ stage 11 | ✅ match |
| Get opp custom values + "Job Details" fields | We **push** these via the GHL webhook custom-data (fewer modules than Jordan's "get" calls) | ✅ equivalent |
| **Multiple images (Iterator)** | We **deferred** photos to fast-follow | ⚠️ **DECISION** — Jordan does it in v1 (see below) |
| Find contact via email + "new/old?" router → 2 lanes | Single **mobile-first find-or-create** (B2) — one path handles both | ✅ simpler, same result |
| **Sleep 3s** before dependent steps | Not in v2 yet | ➕ **ADOPT** — his eventual-consistency handling |
| SM8 assign to ACT queue | `queue_uuid` on create (B4) | ✅ match |
| Add GHL data to **spreadsheet** | Make **Data store** (B5) — machine state | ◐ diverge (could add a Sheet for human audit later) |
| 3 HTTP: get queue UUID + category UUID dynamically | We **hardcoded** the 6 category UUIDs + ACT UUID (captured live) | ◐ intentional diverge (fewer ops; 6 fixed categories) |
| **Break handlers throughout** | v2 adds Break/retry on B2/B4 + dead-letter | ✅ match (validated!) |

## ADOPT from Jordan (fold into v2)
- **Sleep ~3s** before create-then-read steps (SM8 read-after-write consistency — exactly the race the webhook-auditor flagged; Jordan's pragmatic fix).
- **Break error-handlers throughout** — already in v2; Jordan confirms it's the norm, not over-engineering.

## ✅ DECISION (CEOs + experts, 2026-06-04) — photos in v1
**v1 = photo LINK in the job description** (the `ghl_link` field → the sub taps to view the photos in GHL). **Photo-FILE attachment** (Jordan's image Iterator: Cloudinary GET bytes → SM8 `Attachment.json` → `Attachment/{uuid}.file`) = the **IMMEDIATE fast-follow**, added right after the core flow is proven, before the first real customer.
**Why:** pushing photo *files* is the one part that genuinely bloats the build (~3 ops/photo, 2-step binary upload). The *link* gives the sub the photos now with zero added complexity — same end result, simpler path. field-ops + Make-engineer experts + Cleo + Clifford agree; Allan delegated the call (clear + simple, no back-and-forth).

## INTENTIONAL divergence (simpler, per Allan's "simple-but-complete")
- **Hardcoded UUIDs** (we captured the 6 category + ACT queue UUIDs) instead of Jordan's dynamic "get list" HTTP lookups → fewer ops, deterministic. Cost: if an SM8 UUID is ever recreated, update the switch. Low risk for 6 fixed categories. Revisit only if categories churn.
- **One find-or-create** instead of two new/old lanes → same outcome, fewer modules, easier for Allan to maintain.
