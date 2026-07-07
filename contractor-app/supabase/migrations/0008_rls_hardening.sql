-- Phase 6 — RLS hardening (2026-07-07 security review). ADDITIVE/reversible (policy swap only).
--
-- Finding: the Phase-2 job_mirror policy granted read access via ANY assignment, including
-- declined / expired / reoffered / cancelled ones. A sub who declined (or lost) a job could still
-- read the customer's name + address through PostgREST indefinitely. Customer-privacy rule:
-- access ends when the engagement ends. 'completed' stays readable (their work record + photo gates).
drop policy if exists job_mirror_via_assignment on job_mirror;
create policy job_mirror_via_assignment on job_mirror for select to authenticated
  using (exists (
    select 1 from job_assignments a
    where a.sm8_job_uuid = job_mirror.sm8_job_uuid
      and a.sub_id = current_sub_id()
      and a.status in ('offered', 'accepted', 'in_progress', 'completed')
  ));

-- Same lens on the assignment rows themselves: keep them readable (the sub's own history — a
-- declined row carries no customer data; job_mirror above is what holds name+address). No change.

-- Photos: subs read their own rows (Phase-2 policy) — storage bytes live in the PRIVATE bucket with
-- NO storage.objects policies (service-role only), so no tightening needed there. No change.
