// my-jobs — Phase 2 read adapter for ContractorApi (available / booked / detail / profile).
// Runs AS the authenticated sub (their JWT) so RLS scopes every row to them. Contact-free by the
// Phase-1 filter (job_mirror has no contact columns). verify_jwt=true (default) gates the gateway.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';
import { suburbFrom } from '../_shared/address.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

type Row = Record<string, unknown>;

function toAssignment(a: Row, j: Row) {
  return {
    id: a.id,
    job: {
      sm8_job_uuid: j.sm8_job_uuid,
      generated_job_id: j.generated_job_id ?? null,
      customer_name: j.customer_name ?? null,
      job_address: j.job_address ?? null,
      suburb: suburbFrom((j.job_address as string) ?? null),
      job_category: j.job_category ?? 'Combo',
      scope: j.scope ?? '',
      reference_photos: [],
      required_photos: Array.isArray(j.required_photos) ? j.required_photos : [],
      work_days: 1,
      chat_enabled: j.chat_enabled !== false,
    },
    sub_pay: { amount: Number(a.sub_pay_amount ?? 0), currency: 'AUD' },
    part_label: a.part_label ?? null,
    status: a.status,
    availability: a.sub_availability ?? null,
    scheduled_at: a.scheduled_at ?? null,
    current_day: 1,
    problem: a.problem_open ? { reason: (a.problem_reason as string) ?? '', status: 'open' } : null,
    decline_reason: a.decline_reason ?? null,
    eta_minutes: a.eta_minutes ?? null,
    eta_sent_at: a.eta_sent_at ?? null,
  };
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  const origin = req.headers.get('origin');

  const authz = req.headers.get('Authorization') ?? '';
  if (!authz.startsWith('Bearer ')) return fail(401, 'unauthorized', origin);

  // Client acting AS the sub -> RLS scopes every query to their rows.
  const supabase = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authz } },
    auth: { persistSession: false },
  });

  const url = new URL(req.url);
  const view = url.searchParams.get('view') ?? 'available';

  try {
    if (view === 'profile') {
      const { data, error } = await supabase
        .from('subs')
        .select('full_name, abn, pl_insurance_verified, pl_insurance_expiry')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return fail(404, 'no_profile', origin);
      return json({
        ok: true,
        profile: {
          full_name: data.full_name ?? '',
          abn: data.abn ?? '',
          pl_insurance_verified: !!data.pl_insurance_verified,
          pl_insurance_expiry: data.pl_insurance_expiry ?? '',
        },
      }, 200, origin);
    }

    let q = supabase.from('job_assignments').select('*, job:job_mirror(*)');
    if (view === 'booked') q = q.in('status', ['accepted', 'in_progress']);
    else if (view === 'detail') {
      const id = url.searchParams.get('id') ?? '';
      // Validate BEFORE querying: a non-UUID id is a Postgres cast error -> opaque 500. Make it a 404.
      if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
        return fail(404, 'not_found', origin);
      }
      q = q.eq('id', id);
    } else q = q.eq('status', 'offered'); // available
    const { data, error } = await q;
    if (error) throw error;

    const items = (data ?? [])
      .filter((r: Row) => r.job)
      .map((r: Row) => toAssignment(r, r.job as Row));

    if (view === 'detail') {
      return items[0] ? json({ ok: true, assignment: items[0] }, 200, origin) : fail(404, 'not_found', origin);
    }
    return json({ ok: true, assignments: items }, 200, origin);
  } catch {
    return fail(500, 'query_failed', origin);
  }
});
