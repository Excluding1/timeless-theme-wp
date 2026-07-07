-- Phase 5 — Web Push (VAPID) notifications. ADDITIVE ONLY.
-- Delivery model (no pg_net dependency): the pg_cron-driven `reconcile` function sweeps for
--   (a) assignments still 'offered' that haven't been notified  -> "New job available" push
--   (b) accepted assignments whose scheduled_at just got set     -> "Time confirmed" push
-- and marks them notified. Push payloads NEVER carry customer name/address — suburb + category only
-- (a lock screen is not a trusted surface; the no-contact rule extends to notifications).

-- ── Push subscriptions (one row per browser/device the sub enabled push on) ──
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  sub_id uuid not null references subs(id),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now(),
  last_used_at timestamptz,
  revoked_at timestamptz              -- set instead of delete when a push service says 404/410
);

-- Service-role only (no policies) — subscriptions are written via the `push` Edge Function.
alter table push_subscriptions enable row level security;

create index if not exists push_subscriptions_by_sub
  on push_subscriptions (sub_id) where revoked_at is null;

-- ── Notification bookkeeping on the assignment (what the reconcile sweep uses) ──
alter table job_assignments add column if not exists offer_notified_at timestamptz;
alter table job_assignments add column if not exists booking_notified_at timestamptz;

create index if not exists assignments_offer_notify_due
  on job_assignments (offered_at) where status = 'offered' and offer_notified_at is null;
create index if not exists assignments_booking_notify_due
  on job_assignments (scheduled_at) where status = 'accepted' and scheduled_at is not null and booking_notified_at is null;
