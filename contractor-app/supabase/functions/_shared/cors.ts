// _shared/cors.ts — sub-facing functions get a strict origin allowlist; the webhook has no CORS
// (it's server-to-server from ServiceM8). Never reflect an arbitrary origin.
const ALLOWED = new Set([
  'https://jobs.timelessresurfacing.com.au', // the PWA (production, once DNS lands)
  'https://timeless-jobs-preview.netlify.app', // the deployed preview (STATE.md — live since 2026-06-09)
  'http://localhost:3000',
  'http://localhost:5183', // contractor-app vite dev server
]);

export function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin',
  };
}

/** Handle an OPTIONS preflight; returns null for non-preflight requests. */
export function preflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
  }
  return null;
}
