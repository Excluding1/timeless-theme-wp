# Timeless Resurfacing — Contractor App — Product Requirements Document (PRD)

**Version:** 1.2 · **Date:** 2026-06-08 · **Status:** for Google AI Studio frontend draft → completed by Clifford + Cleo
**v1.1 changelog (Cleo hardening pass, Pattern C):** reconciled accept = button+confirm (not slide); moved `part_label`/`scheduled_at` to the assignment; aligned status + photo-status enums to the schema; added photo idempotency key; added the locked **multi-day Day1/Day2** phasing, **per-SKU** photo gates, and the Fair-Work **hand-back** path (A6); shrank the profile screen; added expired/no-longer-available/awaiting-time/paused states; softened accept copy.
**v1.2 changelog (7-perspective draft audit, Pattern C):** added the **"during" photo phase** — real job recipes (BTH-01, FBP-01, RSC-02…) require before/**during**/after, not just before/after (`PhotoRequirement.during` + `CapturedPhoto.kind`). Full audit fix-list folded into the build: `contractor-app/AUDIT-2026-06-08.md`.
**Source-of-truth this PRD assembles:** `contractor-app/README.md` (locked v1 feature set) · `docs/specs/contractor-app-blueprint-2026-06-05.md` (architecture, API, state machine) · `contractor-app/supabase/migrations/0001_init_schema.sql` (schema) · `docs/specs/decision-sm8-keep-vs-build-2026-06-05.md` (no-contact rule + Fair-Work guardrails A1–A9 + legal gate).

---

## 0. How to use this document

This PRD specifies a **mobile-first React Progressive Web App (PWA)** that subcontractors use to receive, accept, do, and prove jobs for Timeless Resurfacing (a Sydney bathroom resurfacing + regrouting business).

- **Google AI Studio's job (the DRAFT):** generate the **frontend only** — screens, components, navigation, states, and styling — coding against the **mock data shapes (§9)** and **API contract (§10)** with **stubbed/mocked responses**. Do **not** implement real authentication, real network calls, or any ServiceM8 integration.
- **Clifford + Cleo's job (after the draft):** build the **secure Supabase backend** (the sole holder of the ServiceM8 API key), real per-sub auth (JWT + row-level security), the ServiceM8 integration, web push, the resilient offline photo queue, and an automated **contact-leak test**; then harden and ship.
- **LOCKED — do not change:** the feature set (§5–§6), the cut list (§12), the Fair-Work UX rules (§11), and the **no-customer-contact rule** (subs see customer **name + address only — never phone/email**). These are **business and legal locks**.

---

## 1. Product overview

**One-liner:** an app that shows a subcontractor the jobs offered to them — clearly, in one place — and lets them accept or decline without pressure, say when they can do it, get there, prove the work with photos, and flag problems.

**It does exactly 6 things. Nothing else:** see the offer · accept/decline without pressure · say when they can do it · get there · prove the work · escalate exceptions.

**What it is NOT:** a workforce-management app. No customer contact, no pricing/quoting, no invoicing/payslips, no timesheets/clock-in/roster, no live calendar sync, no decline scoring, no chat. (Full cut list: §12.)

**Why it exists:** subcontractors miss jobs when offers come via scattered SMS/email. One clear surface fixes that — the exact pain that drove competitor Surface Care to build their own contractor app.

---

## 2. Target user & context

A **tradesperson** on a **phone**, often **on-site** with **poor reception**, **not tech-savvy** — wants it fast, obvious, impossible to get wrong. They run **their own business** (own ABN, insurance, tools) and are an **independent contractor, not an employee** — the app must never make them feel rostered or managed.

---

## 3. Goals & success criteria

- "Notified" → "accepted + availability submitted" in **under 2 minutes** of taps.
- **Impossible to accidentally commit** (every commit is confirmed; never a bare tap).
- A photo is **never lost**, even if reception drops mid-upload.
- The sub **never sees** a customer's phone/email.
- Structurally **Fair-Work-clean** (offer not order; penalty-free decline; a real hand-back path).

---

## 4. Design principles & system

- **Mobile-first PWA**, installable, one-handed.
- **One primary action per screen**, large/high-contrast/thumb-reachable.
- **Confirm before any commit** (accept, mark-done, problem, hand-back). Never a bare tap.
- **Offer-language only.** "Available", "New job available", "Accept". Never "assigned/rostered/your shift/you must".
- **No countdown timers.**
- **Photo-forward job cards.**
- **Plain, friendly, direct copy.**
- **Always show state:** loading · empty · error · **offline** · and the lifecycle states in §6.
- **Big tap targets** (≥48×48px), high contrast for outdoor visibility.

**Visual system:** Colours — Primary `#041534` navy · Accent/Gold `#e7c08b` · Secondary text `#595e6d` · Surface `#f7f9fb` · Error `#ba1a1a` · success green for "done". Type — Inter. Icons — Material Symbols (Outlined). Tone — clean, calm, professional, white space, rounded cards.

---

## 5. End-to-end flow (the sub's journey)

1. 🔔 **Push** "New job available" (SMS fallback) → opens the app.
2. 📋 **Job offer card** — photos · scope · address · category · **their pay**. (No customer phone/email.)
3. ✅ **Accept** (button → confirm sheet → 5-sec Undo) **OR** ❌ **Decline** (one tap, penalty-free, reason optional).
4. 🗓️ On accept → **submit one availability window**. Office (Marko) confirms the time.
5. 📋 Confirmed job in **"My Jobs"** with date + time (or "Awaiting time" until the office books it).
6. 🧭 **Navigate** — one tap to Maps.
7. 📸 On the day → **before/after photos** in **per-SKU labelled slots**, on a resilient offline queue. (Multi-day jobs: **Day 2 is locked until Day 1 photos are uploaded**.)
8. ✅ **"Mark my part done"** (confirmed; requires the photos) → when all parts are done, the whole job auto-completes.
9. ⚠️ **"I have a problem"** → typed reason + photo → alerts the office and **pauses** the job. (And, separately, an accepted job can be **handed back** — never a "call customer" button.)

---

## 6. Screen-by-screen specification

> Copy below is **illustrative** — final sub-facing wording is approved by both CEOs (Rule 8) before ship. Build the screens and states exactly; treat words as placeholders.

### 6.1 Sign in
Logo · title · email + password (or magic-link) · "Sign in" button. **States:** idle · submitting · error (bad credentials) · offline ("You're offline — connect to sign in").

### 6.2 Home — "Available" and "My Jobs" tabs
Two tabs, photo-forward cards.
- **Available card:** thumbnail · category chip · suburb · **pay** · "New" badge for unseen offers.
- **My Jobs card:** thumbnail · category · **date+time** (Booked) or **"Awaiting time"** (availability submitted, not yet booked) · status chip: **Accepted · Booked · In progress · Paused · Completed**.
- **States:** loading skeletons · empty ("No jobs available right now — we'll notify you") · error (retry) · offline (cached list + offline banner).

### 6.3 Job offer detail
- **Content:** photo gallery (swipeable) · **scope** · **category** · **full address** · **their pay** · the **per-SKU photo checklist** they'll need (e.g. "Bath: 3 before / 3 after"). Customer name may show as secondary; **NO phone / NO email**.
- **Primary actions:** large **"Accept"** + secondary **"Decline"**.
- **Edge state — offer no longer available:** if the sub opens a stale offer that expired or was taken/re-routed, show **"This job is no longer available"** with a back-to-list action (don't let them accept a dead offer).
- **States:** loading · error · offline (cached detail viewable; Accept/Decline disabled with "Reconnect to respond").

### 6.4 Accept — confirmation sheet
- **Behaviour (RESOLVED 2026-06-08 — button + confirm, over slide-to-accept; simpler/more familiar for a tradie):** tapping **"Accept"** opens a bottom sheet — **"Accept this job? You're agreeing to take it on."** with **[Accept]** / **[Not now]**. On confirm → brief **"Accepted ✓"** + a **5-second Undo** snackbar. After Undo expires → proceed to availability (§6.6).
- Add a quiet line: "Changed your mind later? You can hand it back from the job."
- **Rule:** never a single bare tap. No countdown.

### 6.5 Decline — sheet
"Decline this job?" → **[Decline]** / **[Cancel]**, with an **optional** reason (clearly skippable). On confirm → "Declined" → back to Available. **Zero penalty, no score, no nag.**

### 6.6 Availability submission (after accept)
A simple picker — preferred **date(s)** + a **time window** (morning / afternoon / anytime). **One window**, minimal taps. "When can you do this job? We'll confirm the exact time with you." **States:** submitting · success ("Sent — we'll confirm your time") · offline (queue + retry).

### 6.7 Booked job detail (in "My Jobs")
- **Content:** confirmed **date+time**, big **"Navigate"** button, scope, the **per-SKU photo checklist** with progress, and on-the-day actions: **"Add photos" · "Mark my part done" · "I have a problem" · "Hand back"**.
- **Multi-day jobs (e.g. full-bathroom):** show **"Day 1 of 2" / "Day 2 of 2"**. **Day 2 actions are locked until Day 1's photos are uploaded** — show "Complete Day 1 photos to unlock Day 2".
- **Paused state:** if a problem is open, show a **"Paused — office notified"** banner and disable photo/complete actions until the office resolves it.
- **States:** upcoming · today (emphasised) · in-progress · paused · completed.

### 6.8 Photo capture (before/after, per-SKU)
- **Components:** **per-SKU labelled slots** (e.g. "Bath — Before 1/2/3", "Bath — After 1/2/3"; "Shower — …"), camera/gallery picker, thumbnails, and a **per-photo upload-status chip** (queued / uploading / uploaded / failed-retry).
- **Offline (critical):** photos save to a **local resilient queue** the instant they're taken and upload when there's signal — **never lost**. Persistent banner: "X photos waiting to upload — keep the app open."
- **Gate:** each SKU's **minimum** before/after photos are **required** before "Mark my part done" enables. On multi-day jobs the gate is **per day**.
- **States:** empty (no photos yet) · capturing · uploading · failed (retry) · offline.

### 6.9 Mark my part done
Enabled only once the required photos exist (per day on multi-day jobs). Tap → confirm sheet: "Mark your part as done? Make sure your photos are uploaded." → **[Mark done]** / **[Cancel]** → success. (Backend handles the multi-sub all-parts roll-up; the sub never sees it.) **States:** disabled (with a hint) · confirming · done.

### 6.10 "I have a problem"
- **Components:** typed reasons (cards): **Can't get access · Asbestos / pre-1990 suspected · Job bigger than quoted · Substrate damage · Something else** (→ short text) + a **required photo**. Submit → "Reported — the office will be in touch" → the job moves to **Paused** (§6.7): on-the-day actions disabled until the office resolves and re-opens it.
- **Rule:** **never** a "call the customer" button.

### 6.11 Notifications permission
Friendly prompt ("Get notified the moment a new job is available") → request web-push permission. Graceful fallback if denied (SMS still reaches them); show a subtle "Notifications off — you'll get an SMS instead" hint.

### 6.12 Profile (read-only, minimal)
Name · ABN · a simple **"Insurance: Verified ✓ (expires DD/MM/YYYY)"** indicator · **Sign out**. Nothing editable. (Compliance/onboarding is a **backend** gate — NOT a sub workflow in v1.)

### 6.13 Hand back an accepted job (Fair-Work A6)
- **Purpose:** a real, visible route to hand back a job the sub already **accepted** — distinct from declining an unstarted offer. Required for contractor-independence (A6).
- **Behaviour:** under a booked job, **"Hand back"** → sheet: "Need to hand this job back? The office will re-arrange it." → **reason (optional)** + **[Hand back]** / **[Cancel]** → office alerted, job re-routed, removed from this sub's list.
- **Framing:** allowed and penalty-free, but clearly **separate** from "Decline" (which is for offers you haven't taken) — because a booked job has a customer time attached.

---

## 7. Functional requirements

- **FR-1** Subs see **only their own** offered + booked jobs.
- **FR-2** Offers show photos, scope, category, full address, **their pay**; never customer phone/email.
- **FR-3** Accept = button + confirm + 5-sec Undo. Decline = one confirm, reason optional, no penalty.
- **FR-4** After accept → submit **one** availability window; the office confirms the booked time.
- **FR-5** Booked jobs list with date/time (or "Awaiting time"); one-tap navigation.
- **FR-6** **Per-SKU** before/after photo capture with per-photo upload status; uploads survive reception loss; the per-SKU (and per-day) minimums gate completion.
- **FR-7** "Mark my part done" enabled only after required photos; confirmed; hides the multi-sub roll-up.
- **FR-8** "I have a problem" → typed reason + required photo → alerts office + **pauses** the job until resolved.
- **FR-9** Push on a new offer, SMS fallback.
- **FR-10** Multi-sub: one job offered to several subs as separate **parts** (`part_label`); each sub sees/does only their own.
- **FR-11** Multi-day: jobs may span **Day 1 / Day 2**; Day 2 is locked until Day 1 photos are uploaded.
- **FR-12** **Hand back** an accepted job (A6) — separate from decline.

---

## 8. Non-functional requirements

- **Offline-first:** opens + shows cached jobs offline; network-only actions clearly disabled with an offline hint; **photo capture works offline and syncs later**; availability may queue offline; **accept/decline/complete/problem/hand-back require server confirmation** (not queued).
- **Security (backend):** SM8 key server-side only; app → our backend → SM8; per-sub auth + RLS; **no endpoint ever returns a customer phone/email** (build-failing test).
- **Performance:** fast first load; works on mid-range Android + iPhone over 3G/4G.
- **Accessibility:** large text, high contrast, big tap targets, screen-reader labels.
- **PWA:** installable, icon + splash, offline shell, web-push (iOS 16.4+).

---

## 9. Data model — mock shapes (schema-aligned; frontend codes against these)

> Contact-stripped by design — there is **no** `customer_phone`/`customer_email` field anywhere. Aligned to `0001_init_schema.sql`: the **job** lives in `job_mirror`; this sub's relationship to it (pay, part, status, availability, booking time) lives in `job_assignments`.

```ts
type Job = {                       // ← job_mirror
  sm8_job_uuid: string;
  generated_job_id: string;        // "JOB-1042"
  customer_name: string;           // NAME ONLY (secondary in UI; address is primary)
  job_address: string;
  suburb: string;                  // backend follow-up: derive from job_address
  job_category: "Resurfacing" | "Regrouting" | "Silicone & Sealing" | "Repairs" | "Specialist" | "Combo";
  scope: string;
  reference_photos: string[];      // job photos from the quote (backend follow-up: mirror SM8 attachments → job_mirror.reference_photos)
  required_photos: PhotoRequirement[];   // PER-SKU, not a flat count
  work_days: 1 | 2;                // multi-day (full-bathroom = 2)
};

type PhotoRequirement = {
  sku: string;                     // "BTH-01"
  label: string;                   // "Bath"
  before: number;                  // min before
  during: number;                  // min during — progress shots (primer/coats evidence); recipes require these
  after: number;                   // min after
  day?: 1 | 2;                     // which day this gate belongs to
};

type Assignment = {                // ← job_assignments
  id: string;
  job: Job;
  sub_pay: { amount: number; currency: "AUD" };   // backend follow-up: job_assignments.sub_pay_amount
  part_label?: string | null;      // multi-sub: "Floor 1 sinks 1-10" | null = whole job
  status: "offered" | "accepted" | "declined" | "in_progress" | "completed" | "expired" | "reoffered" | "cancelled";
  availability?: { dates: string[]; window: "morning" | "afternoon" | "anytime" };
  scheduled_at?: string | null;    // ISO; when set → UI label "Booked"; null + accepted → "Awaiting time"
  current_day?: 1 | 2;             // multi-day progress
  problem?: { reason: string; note?: string; status: "open" | "resolved" };  // present → job is "Paused"
  decline_reason?: string;         // optional, never required
};

type CapturedPhoto = {             // ← photos
  id: string;
  slot: string;                    // "BTH-01-before-1"
  sku: string;
  kind: "before" | "during" | "after";
  day?: 1 | 2;
  localUri: string;
  client_idem_key: string;         // idempotent upload (schema: photos.client_idem_key UNIQUE)
  upload_status: "queued" | "uploading" | "uploaded" | "attaching" | "attached" | "failed";
  // "uploading" is a UI-only state; backend lifecycle = queued → uploaded → attaching → attached (or failed)
};

type SubProfile = {                // ← subs (read-only summary)
  full_name: string;
  abn: string;
  pl_insurance_verified: boolean;  // simple indicator; the compliance GATE is backend, not a sub workflow
  pl_insurance_expiry: string;     // ISO date (display only)
};

// Derived UI labels (compute, don't store):
//  "Booked"        = status in (accepted,in_progress) AND scheduled_at != null
//  "Awaiting time" = status == accepted AND scheduled_at == null
//  "Paused"        = problem?.status == "open"
//  "No longer available" = status in (expired,reoffered,cancelled) when opened from a stale link
```

---

## 10. API contract — endpoints the frontend calls (mock these in the draft)

| Endpoint | Method | Does | Returns |
|---|---|---|---|
| `/my/jobs?tab=available` | GET | this sub's offered jobs *(tab is a frontend filter over the blueprint's `GET /my/jobs`)* | `Assignment[]` |
| `/my/jobs?tab=booked` | GET | this sub's accepted/booked jobs | `Assignment[]` |
| `/my/jobs/{id}` | GET | one job's detail | `Assignment` |
| `/my/jobs/{id}/accept` | POST | offered → accepted (immediate); SM8 queue/badge write is **debounced 5s** so Undo can revert before it fires | `{ ok, undo_window_seconds: 5 }` |
| `/my/jobs/{id}/accept/undo` | POST | revert within the 5s window (accepted → offered; no SM8 write happened yet) | `{ ok }` |
| `/my/jobs/{id}/decline` | POST | offered → declined (reason optional) | `{ ok }` |
| `/my/jobs/{id}/availability` | POST | submit one availability window | `{ ok }` |
| `/my/jobs/{id}/handback` | POST | **A6** — accepted job → handed back to office, re-routed (separate from decline) | `{ ok }` |
| `/my/jobs/{id}/photos` | POST | register a captured photo `{ client_idem_key, slot, sku, kind, day }` (binary via the resumable queue) | `{ ok, photo_id }` |
| `/my/jobs/{id}/complete` | POST | this sub's part done (requires the per-SKU/per-day photos) | `{ ok }` |
| `/my/jobs/{id}/problem` | POST | `{ reason, note?, photo }` → alert office, **pause** job | `{ ok }` |
| `/me` | GET | read-only profile/compliance | `SubProfile` |

Auth: every request carries the sub's session token (wired later). The backend applies the contact filter on every response.

---

## 11. Fair-Work UX requirements (BINDING — guardrails A1–A9)

- **A1** Offer-language only — never "assigned/rostered/your shift/you must".
- **A2** No auto-assign — the sub always chooses.
- **A3** Decline silent + zero-penalty — no counter/score/streak/throttle/coaching in the UI; reason optional.
- **A4** No roster/timesheet/clock-in UI.
- **A5** No "our team"/uniform/company-email identity for the sub.
- **A6** **Real hand-back path** — a visible route to hand back an accepted job (§6.13), not just "don't block it".
- **A7** Compliance gate (verified ≥$10M PL, not expired) is **backend** — a non-compliant sub is never shown an offer; the profile shows status only.
- **A8** No payslip — show the agreed pay; never generate a payslip or run payroll.
- **A9** Name + address only — never customer contact.
- **"Decline" (free) ≠ "Hand back" (booked job, has a customer time)** — keep them visually + behaviourally distinct; neither carries a penalty in the UI.

---

## 12. Out of scope — DO NOT build in v1

Customer contact · quoting/pricing/margin/profit · invoicing/payments/payslips · time-clock/timesheet/roster/shift · live two-way calendar sync · `.ics` files (native "Add to Calendar" = v2) · decline-rate dashboard or any scoring · a ServiceM8 fallback/mirror view · a blank SWMS form (the asbestos STOP-flow covers v1 safety) · in-app chat. **Do not overload the sub.**

---

## 13. Acceptance criteria

- [ ] Installs as a PWA; opens offline; shows cached jobs.
- [ ] Available + My Jobs render mock data with photo-forward cards + all states (loading/empty/error/offline) + lifecycle chips (Accepted/Booked/Awaiting time/In progress/Paused/Completed).
- [ ] Detail shows photos, scope, category, full address, pay, per-SKU photo checklist — and **no phone/email**; stale offers show "no longer available".
- [ ] Accept = button + confirm sheet + 5-sec Undo; no bare-tap commit; no countdown; copy = "agreeing to take it on".
- [ ] Decline = one confirm, reason optional, zero-penalty UI; **Hand back** exists on booked jobs and is distinct from Decline.
- [ ] Availability = single window with "we'll confirm your time".
- [ ] Booked job shows date/time (or Awaiting time) + one-tap Navigate; multi-day shows Day1/Day2 with Day 2 locked until Day 1 photos.
- [ ] Per-SKU photo slots with per-photo upload status; "Mark my part done" disabled until the minimums (per day) exist; completion confirmed.
- [ ] "I have a problem" = typed reasons + required photo → job shows **Paused**; no customer-call option.
- [ ] All copy uses offer-language; profile is read-only (no compliance workflow).

---

## 14. Ready-to-paste Google AI Studio build prompt

> Paste this into Google AI Studio's app builder. You can also attach this whole PRD for richer context.

```
Build a mobile-first, installable React PWA called "Timeless Jobs" — an app for independent subcontractors of a Sydney bathroom resurfacing business to receive and complete job offers. Use mocked/stubbed data and API responses (no real auth, no external API calls).

USERS: tradespeople on phones, often on-site with poor reception, not tech-savvy. Prioritise speed, clarity, large tap targets (>=48px), one primary action per screen, and impossibility of accidental commitment.

BRAND: primary navy #041534, gold accent #e7c08b, secondary text #595e6d, surface #f7f9fb, error #ba1a1a; Inter font; Material Symbols icons; clean, calm, professional, lots of white space, rounded photo-forward cards.

SCREENS:
1) Sign in (email + password, mock) with idle/submitting/error/offline states.
2) Home with two tabs: "Available" (offered jobs) and "My Jobs" (accepted/booked) — photo-forward cards showing thumbnail, category chip, suburb, pay, and a status chip (Accepted / Booked / Awaiting time / In progress / Paused / Completed). Loading/empty/error/offline states.
3) Job offer detail: swipeable photos, scope, category, full address, the sub's pay, and a PER-SKU "photos needed" checklist (e.g. "Bath: 3 before / 3 after"). Large "Accept" + secondary "Decline". If the offer is no longer available (expired/taken), show a "This job is no longer available" state instead of letting them accept. NEVER show a customer phone or email.
4) Accept = a confirmation bottom sheet ("Accept this job? You're agreeing to take it on." [Accept]/[Not now]) then a 5-second Undo snackbar. NOT a slide-to-accept. No countdown timers ever.
5) Decline = a confirm sheet with an OPTIONAL reason; no penalty.
6) After accept: submit ONE availability window (date + morning/afternoon/anytime) with copy "We'll confirm the exact time with you."
7) Booked job detail: confirmed date/time (or "Awaiting time"), big "Navigate" button (maps deep link), scope, per-SKU photo checklist progress, and actions "Add photos", "Mark my part done", "I have a problem", "Hand back". For multi-day jobs show "Day 1 of 2"/"Day 2 of 2" and LOCK Day 2 actions until Day 1 photos are uploaded. If a problem is open, show a "Paused — office notified" banner and disable photo/complete actions.
8) Photo capture: PER-SKU labelled before/after slots (e.g. "Bath — Before 1/2/3"), thumbnails, a per-photo upload-status chip (queued/uploading/uploaded/failed), and a persistent "X photos waiting to upload — keep the app open" banner. Photos must feel resilient to lost signal.
9) "Mark my part done": enabled only after the minimum photos (per day on multi-day jobs); confirmation sheet before completing.
10) "I have a problem": typed reasons (Can't get access / Asbestos or pre-1990 suspected / Job bigger than quoted / Substrate damage / Something else) + a REQUIRED photo; submitting moves the job to Paused. Never a "call customer" button.
11) Notifications permission prompt (web push) with a graceful "off -> you'll get an SMS" fallback.
12) Read-only profile: name, ABN, an "Insurance: Verified" indicator + expiry, sign out. Nothing editable.
13) "Hand back" (on a booked job only): a sheet "Need to hand this job back? The office will re-arrange it." + optional reason + confirm. Keep it clearly separate from Decline.

LANGUAGE RULE (important): offer-language only — "available", "new job available", "accept/decline". Never "assigned", "rostered", "your shift", or "you must". No decline counter/score. No timesheets/clock-in. No pricing/invoicing/payslips. No customer contact details anywhere.

MOCK DATA LAYER (match these shapes): Job {sm8_job_uuid, generated_job_id, customer_name, job_address, suburb, job_category, scope, reference_photos[], required_photos[{sku,label,before,after,day?}], work_days}; Assignment {id, job, sub_pay{amount,currency}, part_label?, status: offered|accepted|declined|in_progress|completed|expired|reoffered|cancelled, availability?, scheduled_at?, current_day?, problem?{reason,note?,status}}; CapturedPhoto {id, slot, sku, kind, day?, localUri, client_idem_key, upload_status: queued|uploading|uploaded|attaching|attached|failed}. Derive UI labels: "Booked" when scheduled_at is set, "Awaiting time" when accepted with no scheduled_at, "Paused" when a problem is open. Make every list and detail handle loading, empty, error, and offline states.
```

---

**Maintenance / backend follow-ups (surfaced by this PRD — for migration 0002 + business):**
1. **`job_assignments.sub_pay_amount`** — so the offer can show the sub their pay. *(Also needs canonical sub rates — a business decision with Marko; currently `sub-rate-schedule.md` is examples-only.)*
2. **`job_mirror.suburb`** (or derive from `job_address`) — for list cards.
3. **`job_mirror.reference_photos jsonb`** + add photos to the contact-filter allowlist — so the app can show the quote's job photos.
4. **Multi-day fields** — `work_days` / per-day photo gates.
5. **Per-SKU photo-requirement** structure on `job_mirror.required_photos` (currently a free `jsonb` — formalise as `[{sku,label,before,after,day}]`).
6. **Undo semantics** — accept is immediate; the SM8 queue/badge write is debounced 5s so `/accept/undo` can revert before any SM8 call fires.

Final sub-facing copy is approved by both CEOs (Rule 8) before ship.
