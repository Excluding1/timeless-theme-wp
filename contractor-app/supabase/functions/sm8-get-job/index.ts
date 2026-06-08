// sm8-get-job — internal probe (PHASE-1-PLAN.md). Proves the X-API-Key path + contact filter
// end-to-end. Auth = ADMIN_PROBE_TOKEN (Bearer). Returns the FILTERED mirror shape, never raw SM8.
import { getJob } from '../_shared/sm8Client.ts';
import { sm8JobToMirror } from '../_shared/contactFilter.ts';
import { json, fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';

const ADMIN_TOKEN = Deno.env.get('ADMIN_PROBE_TOKEN') ?? '';

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  const origin = req.headers.get('origin');

  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) return fail(401, 'unauthorized', origin);

  const uuid = new URL(req.url).searchParams.get('uuid') ?? '';
  try {
    const raw = await getJob(uuid); // SSRF-guarded
    const mirror = sm8JobToMirror(raw, new Date().toISOString());
    return json({ ok: true, job: mirror }, 200, origin); // FILTERED shape only — never raw SM8
  } catch (e) {
    const status = (e as { status?: number }).status;
    return fail(status && status >= 400 && status < 600 ? status : 500, 'sm8_fetch_failed', origin);
  }
});
