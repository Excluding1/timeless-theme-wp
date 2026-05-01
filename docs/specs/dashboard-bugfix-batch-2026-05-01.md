# Dashboard Bug-Fix Batch — Manager+Expert audit findings applied
**Date:** 2026-05-01
**Branch:** `develop`
**Scope:** `dashboard/bathresurf-nsw-dashboard/` subtree
**Audit method:** 4 parallel expert agents (feature-dev:code-reviewer x3 + general-purpose UX) → 32 bugs surfaced → HIGH + selected MEDIUM applied this round.

---

## What Allan needs to do

### 1. Run the updated migration on live Supabase (5 min)
The file `dashboard/bathresurf-nsw-dashboard/supabase/migration.sql` now matches the live schema **plus** adds three new tables for the CEO daemon. Run it in Supabase → SQL Editor → New Query → paste full file → Run.

`CREATE TABLE IF NOT EXISTS` makes it safe to re-run on a DB that already has some tables — existing tables are left alone, new ones are created.

**New tables this round:**
| Table | Why | Used by |
|---|---|---|
| `business_settings` | k/v store for tunables — was live, missing from migration | `useBusinessSettings.ts` (cashflow reserves) |
| `messages` | team chat — was live, missing from migration | `Messages.tsx` |
| `user_preferences` | per-user UI prefs JSON — was live, missing from migration | `PreferencesContext.tsx` |
| `agent_runs` | one row per CEO daemon agent invocation | future AI Activity tab |
| `agent_activity_events` | timeline events within a run (tool calls, thoughts, writes) | future AI Activity tab |
| `audit_log` | every write the CEO/agent makes to the dashboard | security + recovery |

### 2. Optional: clean up existing wrong-category subscription rows
Before this batch, both `Subscriptions.tsx` and `useSubscriptionSync.ts` were inserting auto-renewal expenses with `category: 'Subscriptions'`, but the rest of the app expects `'Software & Subs'`. So existing auto-logged rows in `finances` may have the wrong category and won't roll up properly in Cashflow / Overview.

**Fix:** in Supabase SQL Editor, run:
```sql
UPDATE finances
SET category = 'Software & Subs'
WHERE category = 'Subscriptions'
  AND type = 'expense';
```
(Skip if you haven't logged any subscription expenses yet — i.e. fresh launch.)

### 3. Verify Netlify auto-deploy picked up these fixes
Once I commit + push, Netlify (linked to TimelessDash repo) should build automatically. Confirm at netlify.app dashboard. If still pointing at the standalone TimelessDash repo, this batch ships from there. If we've moved it to the master repo's `dashboard/bathresurf-nsw-dashboard/` subfolder, set Netlify base directory to that path.

---

## What was fixed this round

### HIGH — Page-level bugs
| File | Fix |
|---|---|
| `src/pages/Tasks.tsx` | Attachments dropped on save (SlideOver onSave wired through). Mark-done + unarchive buttons missing `await` + try/catch. Drag-drop now rolls back to previous state on Supabase error. Priority dot has `aria-label` for color-blind users. |
| `src/pages/Finances.tsx` | `parseISO` would crash on malformed dates in two places (filter + table render) — added `isValid` guard fallback. Cloudinary blob URL leak: blobs created on upload-fail are now revoked on remove + on unmount (memory leak + invalid-URL-saved-to-DB). |
| `src/pages/Subscriptions.tsx` | Empty-string `next_renewal` was sorted as if it were a real date. Wrong category `'Subscriptions'` → `'Software & Subs'` at both INSERT sites. |

### HIGH — Hooks layer
| File | Fix |
|---|---|
| `src/hooks/useSubscriptionSync.ts` | Race condition: `hasRun.current = true` used to fire before `finances` had loaded, causing duplicate finance entries on every session start. Now waits for both `subsLoading` + `financesLoading` to settle. Same wrong-category bug fixed at both insert + dedup-check sites. **Plus:** multi-cycle catch-up — a monthly sub overdue 4 months now logs 4 finance entries (previously logged 1 + advanced 1 cycle, leaving 3 missing). |
| `src/hooks/useBusinessSettings.ts` | `JSON.parse` on a malformed row used to throw and leave the entire settings UI in `loading=true` forever. Now per-row try/catch. Supabase query errors surfaced via new `error` return field. `updateSetting` now does optimistic-update-with-rollback if the upsert fails. |

### HIGH — UX / a11y
| File | Fix |
|---|---|
| `src/components/Layout.tsx` | `aria-label` + `aria-current="page"` on every NavLink. `aria-expanded` on group toggle buttons + sidebar collapse buttons. Mobile menu open/close buttons named for screen readers. Sign-out + edit-mode toggle accessible. Decorative icons marked `aria-hidden`. |
| `src/index.css` | `.scrollbar-hide` was referenced in Layout.tsx but not defined — added. Added global `prefers-reduced-motion` honor (vestibular a11y) + visible `:focus-visible` ring (was hidden by `focus:outline-none` in components). |
| `src/pages/Tasks.tsx` | Color-only priority dot now has `title` + `aria-label` so colorblind/screen-reader users know which priority. |

### MEDIUM
| File | Fix |
|---|---|
| `src/pages/Finances.tsx` ReceiptUploader | Blob URL leak: tracked in `useRef<Set<string>>`, revoked on `removePhoto` + on unmount. |

---

## What's still TODO

These were surfaced by the audit but not in this round — flagging so they don't get lost:

### Not blocking launch
- **AI Activity tab** (`src/pages/AIActivity.tsx`) — page route + UI for CEO daemon visibility. Tables are migrated; just needs frontend. ~2-3 hr.
- **Sidebar tablet breakpoint** — at 768-1023px the expanded sidebar takes 33% of viewport. Could auto-collapse via JS or constrain expanded width to `md:w-48 lg:w-64`. Design judgment call — left for Allan to decide.
- **Status pill consistency sweep** — Subscriptions already has both color-dot + text label (a11y-correct). Other pages should be checked for color-only indicators (Subs Tracker, Finances type, Goals progress).

### MEDIUM bugs not yet addressed
- TZ-aware parseISO (date strings interpreted as UTC vs local — affects "today" boundary at midnight Sydney time).
- Touch target sizes (some icon-only buttons under 44×44px on mobile).
- Empty-state component inconsistency — some pages use `EmptyState.tsx`, others render inline.
- `useData` `options` parameter is dead-code-buggy (stale closure) but no callers pass options yet, so doesn't manifest.
- `useNotificationAlerts` — `parseISO` calls without `isValid` guard would throw on a malformed date row.

### Schema follow-ups
- `messages` table: live may have `updated_at` or other columns; my migration only includes the columns inferred from `Message` type in `database.ts`. If Allan added columns via Studio UI, this is a divergence to reconcile (cleanest: dump live schema with `pg_dump --schema-only` and align).
- `audit_log` is created but no triggers wire writes into it yet — that's daemon-tier work.

---

## Files touched this round
```
dashboard/bathresurf-nsw-dashboard/src/pages/Tasks.tsx
dashboard/bathresurf-nsw-dashboard/src/pages/Finances.tsx
dashboard/bathresurf-nsw-dashboard/src/pages/Subscriptions.tsx
dashboard/bathresurf-nsw-dashboard/src/hooks/useSubscriptionSync.ts
dashboard/bathresurf-nsw-dashboard/src/hooks/useBusinessSettings.ts
dashboard/bathresurf-nsw-dashboard/src/components/Layout.tsx
dashboard/bathresurf-nsw-dashboard/src/index.css
dashboard/bathresurf-nsw-dashboard/supabase/migration.sql
```

## Cross-references
- [docs/specs/dashboard-frontend-audit-2026-05-01.md](dashboard-frontend-audit-2026-05-01.md) — original audit
- [docs/specs/persistent-ceo-vps-deployment.md](persistent-ceo-vps-deployment.md) — daemon that will write to `agent_runs` + `audit_log`
- [docs/specs/master-setup-checklist.md](master-setup-checklist.md) — overall sequencing
