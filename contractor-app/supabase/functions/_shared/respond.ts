// _shared/respond.ts — uniform JSON responses + a generic error shaper.
// Never echo SM8 bodies / headers / stack traces to a caller; log detail server-side, return a code.
import { corsHeaders } from './cors.ts';

export function json(body: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

/** Generic, safe error response — a stable code only, never internal detail. */
export function fail(status: number, code: string, origin: string | null = null): Response {
  return json({ ok: false, error: code }, status, origin);
}
