# Dashboard Frontend Audit — TimelessDash 2026-05-01

**Repo:** [github.com/Excluding1/TimelessDash](https://github.com/Excluding1/TimelessDash) (private)
**App location:** `bathresurf-nsw-dashboard/` subfolder
**Cloned to:** `~/Downloads/TimelessDash/`
**Branches:** `main` (production), `dev` (WIP), `quote-form/react-v8` (separate quote form app)
**Last activity:** 2026-04-03 (recent + active)
**Audited via:** [auditor-general-operational](../roles/auditor-general-operational.md) + [auditor-compliance-aus](../roles/auditor-compliance-aus.md) (security) + [auditor-customer-fairness](../roles/auditor-customer-fairness.md) (UX from user POV)

---

## Stack identified (modern, well-chosen)

| Layer | Tech | Verdict |
|---|---|---|
| Build | Vite 6 | ✅ Latest, fast HMR, great DX |
| UI Framework | React 19 + TypeScript ~5.8 | ✅ Latest stable React |
| Routing | react-router-dom 7 | ✅ Latest |
| Styling | Tailwind CSS 4 (latest) | ✅ |
| Forms | react-hook-form 7 + Zod 4 | ✅ Best-in-class form library |
| Backend | Supabase (PostgreSQL + auth + storage) | ✅ Aligned with our data layer |
| Charts | recharts 3 | ✅ Solid choice |
| Animations | motion 12 (Framer Motion successor) | ✅ Modern |
| Drag/drop | @hello-pangea/dnd | ✅ DnD for tasks/kanban |
| Image upload | browser-image-compression + cloudinary.ts | ✅ Compression before upload |
| Toasts | sonner | ✅ Best-in-class |
| Icons | lucide-react | ✅ |
| AI | @google/genai (Gemini) | ⚠️ We're moving to Claude — note for migration |
| PWA | vite-plugin-pwa | ✅ Mobile-installable |
| Auth | Supabase Auth | ✅ |
| Markdown | react-markdown | ✅ |

**Verdict:** This is **competent, modern engineering** — not draft slop. Whoever built this knew what they were doing.

## Architecture (well-organized)

```
bathresurf-nsw-dashboard/
├── netlify.toml              ← already configured for git deploy (just needs connecting)
├── package.json              ← clean dependency list, scripts present
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
├── supabase/
│   ├── migration.sql         ← canonical schema (15 tables)
│   └── seed-tasks.sql        ← initial task seed data
└── src/
    ├── App.tsx               ← BrowserRouter + ProtectedRoute pattern + 20 routes
    ├── main.tsx              ← entry point
    ├── index.css             ← Tailwind imports
    ├── contexts/
    │   ├── AuthContext.tsx   ← Supabase auth wrapper
    │   └── PreferencesContext.tsx
    ├── hooks/
    │   ├── useBusinessSettings.ts
    │   ├── useData.ts
    │   ├── useNotificationAlerts.ts
    │   └── useSubscriptionSync.ts
    ├── lib/
    │   ├── supabase.ts       ← Supabase client init
    │   ├── database.ts       ← typed DB queries
    │   ├── cloudinary.ts
    │   ├── notifications.ts
    │   ├── mockData.ts       ← ⚠️ may explain "draft data" feeling — investigate
    │   └── utils.ts
    ├── components/  (9 reusable)
    │   ├── ConfirmDialog.tsx
    │   ├── EmptyState.tsx
    │   ├── ImageUploader.tsx
    │   ├── Layout.tsx        ← top-level shell + nav
    │   ├── LoadingSkeleton.tsx
    │   ├── NotificationBell.tsx
    │   ├── PeriodFilter.tsx
    │   ├── SlideOver.tsx
    │   └── UserAvatar.tsx
    └── pages/  (20 routes)
        ├── Login.tsx          (unprotected)
        ├── Dashboard.tsx      (home)
        ├── Overview.tsx
        ├── Finances.tsx
        ├── Cashflow.tsx
        ├── Kpis.tsx
        ├── Subscriptions.tsx
        ├── Credentials.tsx
        ├── Tasks.tsx
        ├── Calendar.tsx
        ├── SubsTracker.tsx    (subcontractors)
        ├── Contacts.tsx
        ├── Goals.tsx
        ├── WeeklyReview.tsx
        ├── Notes.tsx
        ├── Links.tsx
        ├── Messages.tsx
        ├── Notifications.tsx
        └── Settings.tsx
```

## Schema sync check

Migration.sql defines **15 tables**. Live Supabase has **18 tables**. Delta:

| In migration.sql | Also in live (no migration) |
|---|---|
| finances ✓ | business_settings ⚠️ (added live, no migration entry) |
| kpi_snapshots ✓ | messages ⚠️ |
| subscriptions ✓ | user_preferences ⚠️ |
| credentials ✓ | |
| tasks ✓ | |
| calendar_events ✓ | |
| subcontractors ✓ | |
| contacts ✓ | |
| goals ✓ | |
| weekly_review_items ✓ | |
| weekly_review_checks ✓ | |
| notes ✓ | |
| business_links ✓ | |
| notifications ✓ | |
| quick_links ✓ | |

**Issue:** 3 tables exist in production Supabase but aren't in migration.sql — schema drift. **Fix:** add migrations for `business_settings`, `messages`, `user_preferences` to keep migration.sql canonical.

## Recent commit activity (last 10 commits)

```
40858b5 feat: log existing subscriptions to Finances + Settings nav fix
a3732bf fix: credentials passcode gates entire page + 90s auto-lock
399a0fb fix: nav group headers full-sized, matching Dashboard/Overview style
93cc78a fix: nav layout — Settings pinned above Sign Out, normal-sized group items
1717d12 feat: vault passcode for credentials + quick links important tag
43b81ed feat: auto-sync subscriptions — renewals log to Finances, price changes auto-apply
c33bfca feat: log new subscription to Finances automatically
ab79a0c fix: Subscriptions page crash — safe date parsing and numeric coercion
2109914 fix: show individual drawings for Allan & Marko separately
8e9e96f feat: two-phase cashflow model with auto-scaling buffer
```

Active development with proper commit hygiene (conventional commits, atomic changes). **This isn't a "fix" project — it's an "enhance" project.**

## Critical findings

### 🔴 1. Manual zip-upload deploy workflow is unnecessary
`netlify.toml` is already configured properly:
```toml
[build]
  base = "bathresurf-nsw-dashboard/"
  command = "npm run build"
  publish = "dist"
```
The repo is **fully Netlify-ready**. Just hasn't been git-connected. Allan has been doing manual zip uploads when a 5-minute one-time setup would auto-deploy on every push.

**Fix priority: HIGHEST.** This unlocks all other improvement work — every PR auto-deploys, no more manual steps.

### 🟠 2. Schema drift between migration.sql and live Supabase
3 tables exist in production but not in migration.sql. Means new dev environments would be missing them.
**Fix:** add migrations for the 3 missing tables.

### 🟠 3. mockData.ts present in src/lib
May explain the "draft data" feeling Allan described. Need to verify whether app reads mock data anywhere or if it's purely a dev fixture.
**Fix:** if any pages read mockData, replace with live Supabase queries.

### 🟡 4. Google Gemini AI (`@google/genai`) integrated but we're moving to Claude
Not urgent — but note for future: when CEO daemon is live, dashboard's AI features should use Claude API, not Gemini. **Not breaking; cosmetic alignment.**

### 🟡 5. Missing: AI Activity tab
The "Jordan-style live agent visibility" we discussed needs:
- New `agent_runs` table + `agent_activity_events` table
- New page `src/pages/AIActivity.tsx` with timeline + drill-down
- New route `/ai-activity` in App.tsx

### 🟡 6. Missing: audit_log table
For tracking every CEO/agent write — security best practice. Currently no audit trail for who changed what.

## What I propose to do (sequenced)

### Sprint 1: Connect Netlify auto-deploy (5 min Allan + 5 min CEO)

**Allan:**
1. Netlify → Sites → click dashboard site → **Site settings** → **Build & deploy** → **Link repository** → choose `Excluding1/TimelessDash` → branch `main`, base directory `bathresurf-nsw-dashboard/` (already in netlify.toml so should auto-detect)
2. Save → Netlify auto-builds from latest commit

**CEO:** Verify deploy succeeds; document new workflow.

**End state:** every git push to `main` → Netlify auto-deploys in ~60 seconds. **No more zip uploads ever.**

### Sprint 2: Fix schema drift (~30 min CEO)

Add migration entries for `business_settings`, `messages`, `user_preferences` to `supabase/migration.sql` so it matches production.

### Sprint 3: Verify mockData.ts isn't being read (15 min CEO)

Grep all pages for `mockData` imports; remove or replace with Supabase queries if found.

### Sprint 4: New tables for CEO daemon (1 hr CEO)

Add to migration.sql + apply to live Supabase:
- `agent_runs` (id, agent_name, status, started_at, completed_at, input, output, slack_url, cost, confidence)
- `agent_activity_events` (id, agent_run_id, event_type, message, data, ts)
- `audit_log` (id, actor, action, table_name, row_id, before, after, reasoning, ts)

### Sprint 5: Build "AI Activity" tab (2-3 hr CEO)

New page `src/pages/AIActivity.tsx` with:
- Today's stats card (runs, errors, success rate, cost)
- Active runs section (real-time)
- Recent runs timeline (clickable for drill-down)
- Per-agent stats table
- Click-into-run → full event timeline + Slack thread link

### Sprint 6: General UI polish per [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (2-4 hr CEO)

After live deploy is working, audit each tab against 161 reasoning rules. Likely fixes:
- Loading states everywhere (skeleton screens already exist via LoadingSkeleton.tsx)
- Empty states for tables (EmptyState.tsx already exists)
- Mobile responsiveness check
- Dark mode (if not already supported)
- Accessibility (WCAG AA)

## Risks + caveats

🟠 **Direct push to `main` impacts production immediately** once auto-deploy is live. Mitigation: I'll work on `dev` branch + open PRs for your review. Only merge to `main` after you approve.

🟠 **Existing manual deploys may be ahead of `main` branch.** If Allan zipped his local copy with uncommitted changes and uploaded, the live site might be ahead of GitHub `main`. Need to verify nothing is lost.

🟡 **`@google/genai` dependency is in package.json** — using Gemini for AI features. Eventually replace with Claude (same `@anthropic-ai/sdk` already trusted). Not urgent.

## Recommended next action

**Allan: connect Netlify to GitHub (~5min) then I start work.**

Once auto-deploy is live, every fix I push deploys automatically. I'll work on `dev` branch + PR each batch for your approval. No more manual zips.

## Cross-references

- [docs/specs/dashboard-audit-and-improvement-plan-2026-05-01.md](dashboard-audit-and-improvement-plan-2026-05-01.md) — broader audit framework + 6-track decomposition
- [docs/specs/dashboard-integration-plan.md](dashboard-integration-plan.md) — L1+L2+L3 integration architecture
- [docs/specs/persistent-ceo-vps-deployment.md](persistent-ceo-vps-deployment.md) — VPS daemon (writes to dashboard tables)
- [docs/specs/master-setup-checklist.md](master-setup-checklist.md) — overall setup sequencing
