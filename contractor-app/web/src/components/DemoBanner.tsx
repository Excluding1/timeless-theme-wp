import { isDemo } from '../lib/demo';

// Small, always-visible badge so it's obvious the app is running on mock data (not the
// real business). Fixed + pointer-events-none so it never blocks a tap on any screen.
export function DemoBanner() {
  if (!isDemo()) return null;
  return (
    <div className="fixed top-2 right-2 z-[70] pointer-events-none select-none">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
        Demo mode
      </span>
    </div>
  );
}
