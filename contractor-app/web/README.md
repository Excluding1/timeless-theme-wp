# Timeless Jobs — Contractor App (frontend)

React + Vite **PWA** for Timeless Resurfacing subcontractors. Spec: `../PRD.md` (v1.2). Build fix-list: `../AUDIT-2026-06-08.md`.

## Dev
```bash
npm install
npm run dev         # http://localhost:3000 (also on your LAN IP for phone testing)
npm run typecheck   # tsc --noEmit (strict)
npm run build       # production PWA build (manifest + service worker)
npm run preview     # serve the production build
```

## Architecture
- `src/types.ts` — domain types, schema-aligned to `../supabase/migrations/0001`. **No customer phone/email — ever.**
- `src/lib/api.ts` — the single data seam (`ContractorApi`). **Wiring Supabase = write `supabaseApi.ts` implementing this + flip the export here.**
- `src/lib/mockApi.ts` — mock implementation (active until the backend is wired).
- `src/lib/store.ts` — Zustand single-source-of-truth + localStorage photo persistence (offline-resilient).
- `src/pages/*` — screens. `src/components/*` — shared UI (Button/Card/Badge/BottomSheet/Snackbar/ErrorBoundary).

## Status
Frontend draft, audited + hardened (7-perspective panel, 2026-06-08). Mock data only; secure Supabase backend (sole ServiceM8 key-holder) is the next build phase.

## To finish for full iOS install polish
Drop PNG app icons into `public/` (192×192, 512×512, and `apple-touch-icon.png` 180×180) and add them to the `vite.config.ts` PWA `manifest.icons`. The SVG icon already covers Chrome/Android install.
