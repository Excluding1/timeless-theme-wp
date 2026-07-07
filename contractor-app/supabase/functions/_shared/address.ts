// _shared/address.ts — display-only helpers derived from the (already contact-filtered) job address.
/** "42 Wallaby Way, Surry Hills NSW 2010, Australia" -> "Surry Hills" (best-effort, display only). */
export function suburbFrom(address: string | null): string {
  if (!address) return '';
  const parts = address.split(',').map((s) => s.trim());
  if (parts.length < 2) return '';
  return parts[1].replace(/\b(NSW|VIC|QLD|SA|WA|TAS|ACT|NT)\b.*$/i, '').trim();
}
