import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize a user-supplied URL to prevent javascript: injection.
 * Only allows http://, https://, mailto:, and tel: protocols.
 * Returns '#' for anything else.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  if (/^tel:/i.test(trimmed)) return trimmed;
  // Bare domain like "google.com/sheet" — prepend https
  if (/^[a-z0-9][\w.-]+\.[a-z]{2,}/i.test(trimmed) && !trimmed.includes(':')) {
    return `https://${trimmed}`;
  }
  return '#';
}

/** Safe localStorage wrapper that won't throw in private browsing / quota exceeded */
export function safeGetItem(key: string, fallback: string = ''): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export function safeSetItem(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* quota exceeded or private mode */ }
}
