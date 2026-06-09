-- Phase d — ServiceM8 WRITE-BACK: durable outbox + atomic "complete" RPC.
-- DB-first ordering (our DB is the source of truth; SM8 is a downstream mirror of OUR state):
--   1. the assignment transition + the decision-to-write happen ATOMICALLY in complete_assignment()
--   2. the SM8 write is best-effort immediate (job-actions waitUntil) and DURABLY retried (reconcile drains this table)
-- Folds Cleo's adversarial review (2026-06-09): P0#1 last-assignment-only · P0#2 durable retry surface
-- (audit_log is NOT an outbox) · P0#3 atomic compare-and-set · P1#4 idempotency via a semantic unique key.

-- ── The write outbox: one row per (job, target) the backend owes ServiceM8 ────
create table if not exists sm8_write_outbox (
  id uuid primary key default gen_random_uuid(),
  sm8_job_uuid uuid not null references job_mirror(sm8_job_uuid),
  target_kind text not null,                 -- 'status' today (future: 'queue_uuid' for accept-writeback)
  target_value text not null,                -- e.g. 'Completed'
  status text not null default 'pending',    -- pending | sent | failed
  attempts int not null default 0,
  last_error text,
  next_attempt_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz default now(),
  -- IDEMPOTENCY (Cleo P1#4): double-fire / retry collapses to ONE row per semantic target.
  unique (sm8_job_uuid, target_kind, target_value)
);

-- Service-role only (no policies) — same posture as every other table.
alter table sm8_write_outbox enable row level security;

-- Drain index: reconcile selects due pending rows.
create index if not exists sm8_write_outbox_due
  on sm8_write_outbox (next_attempt_at) where status = 'pending';

-- ── Atomic complete: CAS the assignment + (if it was the LAST live part) enqueue the SM8 write ──
-- One transaction => no read-then-update race (P0#3) and no crash-window between "mark complete" and
-- "enqueue" (P0#2). The actual SM8 HTTP call stays OUTSIDE the txn (best-effort; durably retried).
create or replace function complete_assignment(p_assignment_id uuid, p_sub_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_job uuid;
  v_live int;
begin
  -- Compare-and-set: only the request that actually flips accepted/in_progress -> completed wins.
  update job_assignments
     set status = 'completed', completed_at = now()
   where id = p_assignment_id
     and sub_id = p_sub_id
     and status in ('accepted','in_progress')
   returning sm8_job_uuid into v_job;

  if v_job is null then
    -- already completed / wrong state / not owned -> caller returns 409 (idempotent: no double-enqueue).
    return jsonb_build_object('ok', false, 'error', 'conflict');
  end if;

  -- LAST-ASSIGNMENT-ONLY (P0#1): flip SM8 only when no live part remains for this job.
  -- Live = still-in-flight work (matches 0001 roll-up note); declined/expired/cancelled/completed are terminal.
  select count(*) into v_live
    from job_assignments
   where sm8_job_uuid = v_job
     and status in ('offered','accepted','in_progress','reoffered');

  if v_live = 0 then
    insert into sm8_write_outbox (sm8_job_uuid, target_kind, target_value)
    values (v_job, 'status', 'Completed')
    on conflict (sm8_job_uuid, target_kind, target_value) do nothing;
  end if;

  return jsonb_build_object('ok', true, 'sm8_job_uuid', v_job, 'last_completion', v_live = 0);
end $$;

revoke all on function complete_assignment(uuid, uuid) from public;
grant execute on function complete_assignment(uuid, uuid) to service_role;
