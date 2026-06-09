-- Phase 3.5 — record an open problem on an assignment (drives the app's "Paused" state).
alter table job_assignments add column if not exists problem_open boolean not null default false;
alter table job_assignments add column if not exists problem_reason text;
