# ServiceM8 Configuration Spec — Timeless Resurfacing

**Status:** CANONICAL (locked 2026-05-29 via 3-source Pattern C research)
**Supersedes:** Clifford's earlier "10 service-type categories" plan (was WRONG — see §8)
**Sources:** (1) Clifford web searches, (2) Cleo Jordan-transcripts + reasoning (`/tmp/cleo-sm8-deep-research-2026-05-29-output.txt`), (3) general-purpose deep agent (SM8 API `developer.servicem8.com/llms.txt` + help docs + Make docs + forums)
**Next audit:** post-Customer-#1 SM8 live run

---

## §1 — SM8 data model (API-confirmed cardinality)

| Object (API) | UI name | Cardinality to Job |
|---|---|---|
| Company (`company.json`) | Client | 1 job → 1 client |
| Job (`job.json`) | Job | core unit; carries `company_uuid`, `category_uuid`, `queue_uuid`, `status` |
| Job Contact (`jobcontact.json`) | Job Contact | 1 job → many |
| Job Category (`category.json`) | Category | **1 job → 1 (SINGLE-select)** |
| Job Queue (`queue.json`) | Queue | **1 job → 1 at a time** |
| Badge (`badge.json`) | Badge | **1 job → MANY (multi-select, JSON array)** |
| Job Material (`jobmaterial.json`) | Line item | 1 job → many ← **the 140 services live HERE** |
| Material (`material.json`) | Price-book item | catalogue |
| Job Activity (`jobactivity.json`) | Scheduled Booking | 1 job → many |
| Job Allocation (`joballocation.json`) | Allocation | assign to staff in a booking window |
| Job Template (`jobtemplate.json`) | Job Template | spawns jobs |
| Staff (`staff.json`) | Staff | incl. contractors-as-staff |

**Job Status = ONLY 4 hardcoded values (NOT customizable):** Quote → Work Order → Completed | Unsuccessful. SM8's own answer to "I need more statuses" = use Queues (holds) + Categories (reporting).

---

## §2 — The 4-dimension model (THE key correction)

| Dimension | Select | Purpose | Our use |
|---|---|---|---|
| **Job Status** | 1 (hardcoded) | native lifecycle | Work Order (active) → **Completed = Back-sync trigger to GHL Stage 15** |
| **Job Category** | 1 | **revenue reporting by job FAMILY** | **6 families** (below) |
| **Job Materials / line items** | many | the precise service + price | **the ~140 SKUs go here**, carry pricing |
| **Job Queue** | 1 at a time | **dispatch pipeline stage** (downstream of GHL) | pipeline queues (below) |
| **Badges** | many | context/priority flags + automation/form triggers | flags (below) |

**Mental model:** Queue = "what stage right now" (1). Category = "what family / revenue bucket" (1). Line items = "exact services + price" (many). Badge = "what flags apply" (many).

---

## §3 — Categories (6 families, single-select, for reporting) — ✅ LOCKED 2026-06-03 (Allan confirmed; built in SM8)

The ~140 services collapse to 6 reporting families. Precise service = line item, NOT category. **SM8 colours as built: Resurfacing=Blue · Regrouting=Green · Silicone & Sealing=Orange · Repairs=Purple · Specialist=Red · Combo/Full Bathroom=Yellow.** (The earlier "10 categories" in `/tmp/task-checklist.md` was an over-count, now superseded by this list.)

1. **Resurfacing** (BTH, BTV, BSN, SBR, VAN, LBR, TSR, VCR, SFL)
2. **Regrouting** (RGC, RGE, RSC, RSE, BFR, BWR, FBR, FLR, WLL)
3. **Silicone & Sealing** (SIL, GCS, GRS)
4. **Repairs** (CHR, CRK, BRN, TRP, GSP)
5. **Specialist** (EFF, RST, HWD, POL, ASL, DTL)
6. **Combo / Full Bathroom** (CMB, FBP, ENS, SOB, TBC, TRC, MIX)

*(Optional 7th: keep SM8 default `Warranty` as a category if we want warranty-revenue reporting; otherwise Warranty = a badge.)*

**Why families not 10 service-types, not 140:** Category is single-select + the revenue-reporting axis. A combo job (Regrout + Tile Resurface) gets ONE category ("Combo") and its services show as LINE ITEMS. This resolves the combo problem (Cleo's catch) AND keeps reporting clean (Clifford's concern). Service detail + price lives in line items where it belongs.

---

## §4 — Queues (dispatch pipeline, single, downstream of GHL only)

Do NOT rebuild GHL's 15 sales stages. GHL owns lead→quote→deposit. SM8 owns schedule→execute. Queues = SM8-side operational stages:

| Queue | Type | Notes |
|---|---|---|
| **ACT** (Ready to Dispatch) | Assignable (`requires_assignment=1`) | ✅ ALREADY CREATED. New jobs land here awaiting dispatch. Assigned to Marko, 3-day expiry. |
| Awaiting Sub Acceptance | Assignable | if using offer/accept; short expiry |
| Booked / Scheduled | (or use Status+schedule) | may be covered by Work Order status + calendar |
| On Hold – Customer/Access | Regular | external wait |
| On Hold – Materials | Regular | external wait |
| Needs Invoicing / QA | Regular/Assignable | post-completion |

Queue object fields: `name`, `default_timeframe` (days→flag for review), `subscribed_staff`, `requires_assignment` (0/1).

---

## §5 — Badges (multi-select context + triggers)

| Badge | Set by | Purpose |
|---|---|---|
| Deposit Paid | Make Main (when GHL says paid) | dispatch gate |
| Warranty Job | manual/automation | flag + report |
| VIP | client-level | auto-flags future jobs |
| Pre-1990 / Asbestos | Make from GHL `built_before_1990` | **triggers asbestos checklist form** + compliance gate |
| Strip-Back Required | Make from GHL flag | triggers strip-back checklist |
| Access Notes / Key Required | manual | field info |
| Repeat Customer / Problem Payer | client-level | context |

**Badges can trigger Forms + Automations** — this is how job recipes/checklists auto-attach. **Multi-service combos: badge each service** if line items aren't enough for dispatch-skill visibility.

**Make gotcha:** badges = JSON array; UPDATE replaces ALL → read-modify-write (read current array, append, write back).

---

## §6 — Staff vs Network — DECIDED: Staff/single-account (both-CEO evidence convergence 2026-05-29)

**DECISION: Staff/single-account dispatch for ALL subs (Marko Phase 1 + external later). NOT ServiceM8 Network.** Legal independence enforced via Sub Agreement (own ABN/insurance/tools/right-to-decline), NOT the SM8 login type. Mitigate data-leak via locked Security Roles; add a custom contractor portal at scale if native sub-visibility falls short (Jordan did this).

**Basis — both CEOs converged independently (Clifford medium-high, Cleo 75%) from EVIDENCE:**
1. **Jordan's Make scenario** ends each lane at `create job → assign ACT queue → log` — NO network-request step (and Make has no network module). Jobs live in ONE account, dispatched internally. If Network were core, we'd see a manual step / custom API call / pipeline stage for request-sent/accepted. None exist.
2. **Our Jordan-aligned pipeline** does sub-quoting UPSTREAM in GHL (stages 3-5), and "Job in ServiceM8" is a single handoff — no Network lifecycle stages (request sent/accepted/declined/reassign).
3. **Jordan's custom contractor app** is the clincher (Cleo's point): if SM8 Network already gave subs a clean separate-account view, why build an app because "contractors couldn't see jobs clearly enough"? The app = an overlay on his OWN single-account dispatch system, not a Network experience.
4. **"Network of 70 subs" = business model ≠ SM8 Network feature.** Independent contractors can be Staff users operationally.
5. **Our Make automation FORCES it:** we create the SM8 job in our account → ACT queue. Network can't be driven that way. Automation choice = sub-model choice.

**Falsifiers (would flip the verdict):** an SM8 Network Request in Jordan's job cards; Make custom-API-call creating network requests; subs accepting in their own accounts; pipeline stages/logs for Network sent/accepted/declined. Current evidence shows none.

**Network reconsidered ONLY IF:** we want a different model where the sub owns their own customer/job workflow, self-schedules, accepts/rejects independently, invoices us from their own system, and we accept the loss of scheduling/brand control.

---

### (Reference) The fork that was decided — Staff vs Network mechanics

No in-account "offer vs assign" toggle. The fork:

| | Contractor-as-Staff | ServiceM8 Network |
|---|---|---|
| Account | sub added to OUR account (locked Security Role) | sub has OWN SM8 account; we send Network Request |
| Scheduling | **office controls exact time** (drag-drop) | **sub self-schedules** (we lose booking control) |
| Client identity | sub portrays as our staff | sub runs own business |
| Invoicing | sub invoices client on our behalf | sub invoices US |
| Independence signal | looks like employee | looks like genuine contractor |

**Agent's pragmatic rec:** **Staff + locked Security Role** fits our office-controls-dispatch + single-client-identity model. Network's "no scheduled bookings" conflicts with us running all comms/dispatch. **BUT** Staff looks more employment-like → Fair Work whole-of-relationship risk. **Decision deferred to Allan + separate legal review.** (Not legal advice — operational framing only.)

---

## §7 — Make.com build notes (Day 2) — critical gotchas

- **Auth:** API key (Settings → API Keys) → `X-API-Key` header. Capture this = the Day-2 unblocker.
- **NO dedicated Make module for Category/Queue/Badge** → use **"Make an API Call"** on `job.json`/`queue.json`/`badge.json`.
- **Capture `x-record-uuid` response header** after Create Job (NOT a follow-up search — sidesteps eventual-consistency).
- **`Watch Jobs` silently skips jobs whose status ≠ filter** → set filter to **Any/blank**. #1 reported automation failure.
- **Badges = replace-all array** → read-modify-write.
- **Rate limit: 180 req/min, 20k/day, HTTP 429** → Helper scenario caches queue/category/badge/staff UUIDs (don't re-list every run).
- **Make modules available:** Watch Jobs / Watch New Client / Watch Form Response; Create/Get/List/Update/Delete Client + Job; Create Job Contact; Search Job Contacts; **Make an API Call**.
- **Main scenario:** find-or-create Client → Create Job (`company_uuid` + `category_uuid` + `queue_uuid`=ACT + status Work Order) → capture `x-record-uuid` → write SM8 job UUID back to GHL opp → set badges via API Call (read-modify-write) → Google Sheets audit log.
- **Back-sync:** prefer webhooks over Watch Jobs polling; if Watch Jobs, filter=Any, key off `status==Completed`/`completion_date`.

---

## §8 — What this corrects (Clifford's earlier errors)

| Earlier (WRONG) | Corrected |
|---|---|
| "10 service-type categories" | ~6 FAMILY categories; 140 services = line items |
| "Delete SM8 priority defaults" | Priority → badges (or keep Warranty as category); don't force-delete |
| Categories carry the service detail | Line items carry service + price; category = family reporting only |
| (didn't consider) Staff vs Network | Big decision: office-control (Staff) vs independence (Network) |
| (didn't know) Make has category/queue/badge modules | It does NOT — use "Make an API Call" |
| ACT queue | ✅ STILL CORRECT — it's a dispatch pipeline queue (assignable) |

---

## §9 — Surface Care / Jordan reality check

Jordan Schofield = confirmed Co-Founder of Surface Care (surfacescare.com.au, Sydney). **NO public info on his actual SM8/GHL/Make config exists.** So this SM8 model is OUR evidence-based design (SM8 docs + best practice), NOT Jordan-copied. Don't claim "Jordan-exact" for SM8 internals — we have no source for that.

---

## §10 — Open decisions for Allan

1. ~~**Staff vs Network**~~ ✅ DECIDED 2026-05-29 — **Staff/single-account for all subs** (both-CEO evidence convergence, see §6). Marko = Staff with locked role Phase 1.
2. **6 family categories** — confirm the list (or keep Warranty as 7th)
3. **Queue set** — ACT done; add which others (Awaiting Sub / On Hold / Needs Invoicing)?
4. **Badge taxonomy** — confirm the flag list
5. **140 services as line items** — load now, or add per-job as we go (Phase 1)?

— Clifford + Cleo + general-purpose deep agent (3-source Pattern C convergence, 2026-05-29)
