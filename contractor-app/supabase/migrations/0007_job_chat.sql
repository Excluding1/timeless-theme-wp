-- Job chat relay + ETA (ratified 2026-07-07 — docs/specs/booking-coordination-plan-2026-07-07.md Phase 2).
-- Masked relay: customer texts the BUSINESS number -> GHL -> Make -> `messages-inbound` writes
-- sender='customer'; sub replies in-app -> Make relays sender='sub' rows out via GHL SMS.
-- The sub never sees a customer number; the customer never sees a sub number. ADDITIVE ONLY.

-- ── Per-job kill switch (office can silence a thread) + the sub's ETA on THEIR assignment.
-- NOTE: the design sketch said "eta on the job", but a job can be held by N subs (multi-sub model,
-- migration 0001) — one job-level ETA column would clobber between subs. The assignment is the
-- correct owner: it is where every other per-sub state (scheduled_at, availability) already lives.
alter table job_mirror add column if not exists chat_enabled boolean not null default true;
alter table job_assignments add column if not exists eta_minutes int
  check (eta_minutes is null or eta_minutes between 5 and 240);
alter table job_assignments add column if not exists eta_sent_at timestamptz;

-- ── The thread ─────────────────────────────────────────────────────────────
create table if not exists job_messages (
  id uuid primary key default gen_random_uuid(),
  sm8_job_uuid uuid not null references job_mirror(sm8_job_uuid),
  sub_id uuid references subs(id),     -- set when sender='sub' (multi-sub jobs: who said it)
  sender text not null check (sender in ('customer', 'sub', 'office')),
  kind text not null default 'chat' check (kind in ('chat', 'eta')),  -- Make relays 'eta' IMMEDIATELY
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz                  -- set when the sub opens the thread (customer rows only)
);

create index if not exists job_messages_thread on job_messages (sm8_job_uuid, created_at);
-- Make's outbound poll: sub rows it hasn't relayed yet (relay bookkeeping is Make-side; this index
-- keeps the "recent sub messages" scan cheap either way).
create index if not exists job_messages_outbound on job_messages (created_at) where sender = 'sub';

-- ── DB-level guards (defence-in-depth: the app validates too, but the DATABASE enforces) ──
--  1. contact-leak block: no phone/email in ANY sub/customer body — the relay must never store a
--     leaked number in either direction (inbound is stripContact'd first; this catches everything else)
--  2. anti-spam: sub messages capped at 10/hour and 30/day per job
--  3. kill switch: sub messages rejected when job_mirror.chat_enabled = false
create or replace function job_messages_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_hour int;
  v_day int;
  v_enabled boolean;
begin
  if new.sender in ('sub', 'customer') then
    -- email
    if new.body ~* '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' then
      raise exception 'contact_blocked';
    end if;
    -- 8+ digits in a row allowing common separators (catches 04xx xxx xxx, +61..., landlines, intl)
    if new.body ~ '[0-9]([[:space:].()/-]?[0-9]){7,}' then
      raise exception 'contact_blocked';
    end if;
    -- explicit AU shapes (redundant with the run-length rule; kept per spec, belt-and-braces)
    if new.body ~ '\+?61[[:space:]().-]*4([[:space:]().-]*[0-9]){6,}'
       or new.body ~ '04([[:space:]().-]*[0-9]){8}' then
      raise exception 'contact_blocked';
    end if;
  end if;

  if new.sender = 'sub' then
    select chat_enabled into v_enabled from job_mirror where sm8_job_uuid = new.sm8_job_uuid;
    if coalesce(v_enabled, true) = false then
      raise exception 'chat_disabled';
    end if;

    select count(*) into v_hour from job_messages
     where sm8_job_uuid = new.sm8_job_uuid and sender = 'sub'
       and created_at > now() - interval '1 hour';
    if v_hour >= 10 then
      raise exception 'rate_limited';
    end if;

    select count(*) into v_day from job_messages
     where sm8_job_uuid = new.sm8_job_uuid and sender = 'sub'
       and created_at > now() - interval '24 hours';
    if v_day >= 30 then
      raise exception 'rate_limited';
    end if;
  end if;

  return new;
end $$;

drop trigger if exists job_messages_guard_trg on job_messages;
create trigger job_messages_guard_trg
  before insert on job_messages
  for each row execute function job_messages_guard();

-- ── RLS: a sub sees/writes ONLY threads for jobs they hold ──────────────────
alter table job_messages enable row level security;

drop policy if exists job_messages_read on job_messages;
create policy job_messages_read on job_messages for select to authenticated
  using (exists (
    select 1 from job_assignments a
    where a.sm8_job_uuid = job_messages.sm8_job_uuid
      and a.sub_id = current_sub_id()
      and a.status in ('accepted', 'in_progress', 'completed')
  ));

drop policy if exists job_messages_send on job_messages;
create policy job_messages_send on job_messages for insert to authenticated
  with check (
    sender = 'sub'
    and sub_id = current_sub_id()
    and exists (
      select 1 from job_assignments a
      where a.sm8_job_uuid = job_messages.sm8_job_uuid
        and a.sub_id = current_sub_id()
        and a.status in ('accepted', 'in_progress')
    )
  );
-- (no UPDATE/DELETE policies: read_at is set by the service-role `messages` function only)
