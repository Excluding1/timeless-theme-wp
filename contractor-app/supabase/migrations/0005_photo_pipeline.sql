-- Phase 4 COMPLETION — real photo pipeline (2026-07-07).
-- The README claimed Phase 4 done, but only the complete->SM8 write-back was real: the app captured a
-- MOCK image and registerPhoto() was a stub. This migration is the storage half of the real path:
--   capture (device) -> IndexedDB queue -> `photos` Edge Function -> Storage bucket -> photos row
--   -> sm8_write_outbox('photo_attach') -> SM8 2-step attach (best-effort now, reconcile retries).
-- ADDITIVE ONLY — no drops, no data rewrites. Reversible by dropping the new column/bucket rows.

-- ── photos: link each photo to the assignment it proves (ownership checks + per-part evidence) ──
alter table photos add column if not exists assignment_id uuid references job_assignments(id);
alter table photos add column if not exists content_type text not null default 'image/jpeg';

-- ── Private storage bucket. NO storage.objects policies on purpose: with RLS default-deny, only the
--    service-role Edge Functions can read/write it — same posture as every other write surface.
--    (Subs keep their local copy for display; they never need to re-download.)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('job-photos', 'job-photos', false, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- ── Drain efficiency: reconcile looks up photos by outbox target_value (photo id = PK, already
--    indexed). Retry lookups by job are common in ops queries:
create index if not exists photos_by_job on photos (sm8_job_uuid);
create index if not exists photos_by_assignment on photos (assignment_id) where assignment_id is not null;
