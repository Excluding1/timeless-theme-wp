-- Timeless Resurfacing — Contractor App — Phase 1 Foundation schema
-- Source: docs/specs/contractor-app-blueprint-2026-06-05.md §4 (+ multi-sub fix 2026-06-08)
-- HARD RULE: subs see NAME + ADDRESS only. job_mirror has NO contact columns. CI leak-test enforces.

-- ── Subs (independent contractors) ──────────────────────────────────────────
create table if not exists subs (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id),
  full_name text not null,
  abn text,
  pl_insurance_expiry date,
  pl_insurance_verified boolean default false,   -- ≥$10M PL sighted before any offer
  zone text,
  skills text[] default '{}',
  tier text default 'standard',
  active boolean default true,
  created_at timestamptz default now()
);

-- ── Job mirror (the ONLY thing subs read — NAME + ADDRESS, never contact) ────
create table if not exists job_mirror (
  sm8_job_uuid uuid primary key,
  generated_job_id text,
  customer_name text,            -- NAME ONLY
  job_address text,
  job_category text,
  scope text,
  required_photos jsonb default '[]',
  sm8_status text,
  sm8_queue_uuid uuid,
  last_synced_at timestamptz,
  created_at timestamptz default now()
  -- ⛔ NO customer_phone, NO customer_email — ever. Absence + CI leak-test is the guarantee.
);

-- ── Assignments (the accept/decline state machine; ONE row per sub per part) ─
do $$ begin
  create type assignment_status as enum
    ('offered','accepted','declined','in_progress','completed','expired','reoffered','cancelled');
exception when duplicate_object then null; end $$;

create table if not exists job_assignments (
  id uuid primary key default gen_random_uuid(),
  sm8_job_uuid uuid not null references job_mirror(sm8_job_uuid),
  sub_id uuid not null references subs(id),
  part_label text,               -- MULTI-SUB: this sub's part, e.g. 'Floor 1 sinks 1-10' / 'Glass panel R&R'. NULL = whole job (single-sub).
  status assignment_status not null default 'offered',
  offer_seq int default 1,
  offered_at timestamptz default now(),
  accepted_at timestamptz,
  sub_availability jsonb,        -- on ACCEPT: the sub's proposed availability window(s) — "when I can do it"
  scheduled_at timestamptz,      -- the confirmed booking time shown in "My Jobs" (native Add-to-Calendar = v2; .ics cut from v1 per README)
  declined_at timestamptz,
  decline_reason text,           -- OPTIONAL, NEVER required (Fair-Work: penalty-free decline)
  completed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- MULTI-SUB (2026-06-08): allow N subs on ONE job (one part each), but never double-offer the SAME sub the same job.
-- Relaxed from one-live-per-JOB → one-live-per-(JOB, SUB).
-- The "all parts done" roll-up = (count of live assignments for a job) = 0  →  app sets SM8 job Completed.
create unique index if not exists one_live_assignment_per_job_sub
  on job_assignments (sm8_job_uuid, sub_id)
  where status in ('offered','accepted','in_progress');

-- ── Photos (resumable upload → SM8 2-step attach via rate governor) ──────────
do $$ begin
  create type photo_upload_status as enum ('queued','uploaded','attaching','attached','failed');
exception when duplicate_object then null; end $$;

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  sm8_job_uuid uuid not null references job_mirror(sm8_job_uuid),
  sub_id uuid not null references subs(id),
  kind text not null,            -- before / after
  slot text,
  storage_path text,
  sm8_attachment_uuid uuid,
  upload_status photo_upload_status default 'queued',
  client_idem_key text unique,   -- idempotent uploads
  created_at timestamptz default now()
);

-- ── Audit log (scrub PII; never log phone/email) ────────────────────────────
create table if not exists audit_log (
  id bigint generated always as identity primary key,
  actor_type text not null,
  actor_id uuid,
  action text not null,
  sm8_job_uuid uuid,
  detail jsonb,
  created_at timestamptz default now()
);

-- ── RLS: locked down now (service-role Edge Functions only). Per-sub policies land in Phase 2 with Auth. ──
alter table subs            enable row level security;
alter table job_mirror      enable row level security;
alter table job_assignments enable row level security;
alter table photos          enable row level security;
alter table audit_log       enable row level security;
-- (No policies yet = only the service-role key can read/write. Per-sub JWT policies added in migration 0002.)
