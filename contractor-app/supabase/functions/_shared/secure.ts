// _shared/secure.ts — constant-time-ish comparison for shared secrets / tokens.
// Does not early-exit on first mismatch (avoids the obvious timing leak). The remaining length-timing
// signal is negligible for the high-entropy secrets we use; a SHA-256-based compare is a P2 follow-up.
export function secureCompare(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
