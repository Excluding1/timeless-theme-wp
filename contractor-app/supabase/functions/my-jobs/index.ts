// my-jobs — Phase 2: per-sub JWT + RLS read adapter for ContractorApi
// (getAvailableJobs / getBookedJobs / getJobDetail / getProfile from job_mirror + job_assignments).
// Stub until Phase 2 (no real sub touches this until Auth + the legal gate clear).
import { fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';

Deno.serve((req) => preflight(req) ?? fail(501, 'not_implemented_phase_2', req.headers.get('origin')));
