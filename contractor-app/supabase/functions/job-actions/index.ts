// job-actions — Phase 3: accept / decline / availability / hand-back / complete / problem +
// the SM8 write-back, behind per-sub JWT (the one genuinely-new build = the accept/decline machine).
// Stub until Phase 3.
import { fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';

Deno.serve((req) => preflight(req) ?? fail(501, 'not_implemented_phase_3', req.headers.get('origin')));
