// reconcile — Phase 5: pg_cron poll of stale jobs + re-arm a dead SM8 webhook subscription
// (the 72h auto-cancel safety net) + retry audit_log'd sync failures. Auth = service-role (cron).
// Stub until Phase 5; wired to a DISABLED schedule on deploy.
import { fail } from '../_shared/respond.ts';

Deno.serve(() => fail(501, 'not_implemented_phase_5'));
