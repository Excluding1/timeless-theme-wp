-- Phase 2 — per-sub Auth + RLS. Each authenticated sub sees ONLY their own data.
-- Service-role Edge Functions still bypass RLS (SM8 sync + writes stay server-side).

-- The sub's pay for THIS part/assignment (set by the office when offering). Not in 0001.
alter table job_assignments add column if not exists sub_pay_amount numeric(10,2);

-- Helper: the subs.id for the currently-authenticated user.
-- security definer so the policy can resolve auth.uid() -> sub without needing a self-referential policy.
create or replace function current_sub_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select id from subs where auth_user_id = auth.uid()
$$;
revoke all on function current_sub_id() from public;
grant execute on function current_sub_id() to authenticated;

-- subs: read only your own profile.
drop policy if exists subs_self_read on subs;
create policy subs_self_read on subs for select to authenticated
  using (auth_user_id = auth.uid());

-- job_assignments: read only the assignments that are yours.
drop policy if exists assignments_own_read on job_assignments;
create policy assignments_own_read on job_assignments for select to authenticated
  using (sub_id = current_sub_id());

-- job_mirror: readable only if you hold an assignment on that job (never browse all jobs).
drop policy if exists job_mirror_via_assignment on job_mirror;
create policy job_mirror_via_assignment on job_mirror for select to authenticated
  using (exists (
    select 1 from job_assignments a
    where a.sm8_job_uuid = job_mirror.sm8_job_uuid and a.sub_id = current_sub_id()
  ));

-- photos: read your own (writes land in Phase 4 via Edge Functions).
drop policy if exists photos_own_read on photos;
create policy photos_own_read on photos for select to authenticated
  using (sub_id = current_sub_id());
