# Spec: Dashboard Integration — CEO + AI Agent Access

**Source:** Allan's direction 2026-05-01 PM — *"we plan on not withdrawing any money until 5k... we have a draft plan in the dashboard... we will need to install agents or you or something best method for you to manage and also edit and add stuff if needed like add tasks to the task board etc"*

**Audited via:** [auditor-general-operational](../roles/auditor-general-operational.md) + [auditor-compliance-aus](../roles/auditor-compliance-aus.md) (data privacy + access control)
**Companion to:** [docs/specs/ai-employees/dashboard-connector.md (pending build)](ai-employees/), [CEO § Dashboard integration plan](../CEO.md#dashboard-integration-plan-added-2026-05-01-pm), [CEO § 24/7 monitoring infrastructure](../CEO.md#247-monitoring-infrastructure-added-2026-05-01-pm)

---

## Current dashboard state

**Per Allan (2026-05-01):**
- Hosted on **Netlify** (frontend)
- Backend: **Supabase** (PostgreSQL + auth + storage)
- "Half messy" — built ad-hoc, has gaps

**Tabs in dashboard** (per Allan's earlier list):
1. Dashboard (overview)
2. Tasks
3. Messages
4. Calendar
5. Finances
6. Cashflow
7. KPIs
8. Subscriptions
9. Subs Tracker (subcontractors)
10. Contacts
11. Credentials (sensitive — handle carefully)
12. Goals
13. Weekly Review
14. Notes
15. Links & Sheets
16. Notifications

**Draft plan exists** in Cashflow tab covering founder-draw formula (per [CEO § Founder draw policy](../CEO.md#founder-draw-policy-formalised-2026-05-01-pm-per-allans-direction)).

---

## Integration approach — hybrid (CEO direct + Agent persistent)

**My recommendation: hybrid approach.** Three layers:

| Layer | Who acts | When | What |
|---|---|---|---|
| **L1: CEO direct (in-session)** | Me (CEO), via Allan's session | When Allan is talking to me + I need to read/edit dashboard | Read live state, edit ad-hoc, add tasks, surface insights inline |
| **L2: AI Dashboard Connector agent (persistent)** | Cloud Function 24/7 | Scheduled + Slack-triggered | Daily metric refresh, weekly review prep, alert on anomalies, Slack slash commands |
| **L3: Native dashboard UI** | Allan + Marko direct | Anytime | Manual edits via existing Netlify UI; no automation |

Each layer has different access pattern + risk profile. Layered = redundancy + flexibility.

---

## L1: CEO direct access (immediate — works this session if Allan provides)

### What I need from Allan

To enable CEO direct access during sessions, Allan provides:
- **Supabase URL** (e.g., `https://xxxxx.supabase.co`)
- **Supabase API key** with **read+write scope** (anon key OK if RLS policies set; otherwise service_role key — handle as secret)
- **Database schema** (table names + columns) — easiest: Allan exports from Supabase dashboard as a screenshot or pastes table list

### What I can do once enabled

- **Read dashboard state**: open any session → query Supabase → see current cash, jobs, KPIs, tasks, etc
- **Add tasks**: insert into `tasks` table with title, description, owner, due-date
- **Edit existing entries**: update task status, KPI values, finance entries
- **Cross-reference**: when Allan asks "what's our cash position?" I query live data, not memory
- **Bulk operations**: e.g., "add 12 tasks for Phase 1 GHL setup" — I write SQL to insert all 12

### Security discipline (per [auditor-compliance-aus § Privacy Act 1988](../roles/auditor-compliance-aus.md))

- **Customer PII separation**: I should NOT have direct access to customer contact tables — those flow through GHL with proper consent. Dashboard access scoped to ops data only (tasks, KPIs, finances, internal contacts).
- **Audit log**: every CEO write to Supabase logs with timestamp + reasoning + session-id (so Allan can review what I changed)
- **Rotate keys quarterly**: Supabase API keys rotated every 3 months
- **Read-only by default for sensitive tables**: Credentials, customer-PII, financial-account-numbers tables → I get read-only access; writes go through Allan
- **No bulk deletes without confirmation**: any DELETE statement requires Allan inline approval in chat

### Risks + mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Accidental data corruption (bad UPDATE/DELETE) | High | Test queries first as SELECT; use transactions; backup before bulk operations |
| API key leak | High | Never paste API key in commit messages or public docs; store in `.env.local` (gitignored) when CEO accesses |
| RLS bypass | Medium | Use anon key with proper Row-Level Security; only escalate to service_role when needed for specific tasks |
| CEO acts on stale data | Low | Always query right before write; never rely on cached state across sessions |

---

## L2: AI Dashboard Connector agent (Phase 6.6a — persistent, 24/7)

### Status

Pending build. Spec exists at [docs/specs/ai-employees/](ai-employees/) — was placeholder `dashboard-connector.md` referenced in [FUTURE-PLAN Phase 6.6a](../FUTURE-PLAN.md). Promote priority: **Month 4-5** target (after dashboard data has real value via GHL/Stripe/SM8 integration).

### What it does

**Daily (5am Sydney time):**
- Refresh KPIs tab: pull latest from GHL/Stripe/SM8 → update dashboard
- Detect anomalies (cash drop, conversion drop, sub flight) → Slack alert

**Weekly (Friday 5pm):**
- Generate weekly review prep: pull last week's numbers, write 5-bullet summary, post to Slack `#weekly-numbers`
- Update Goals tab progress bars

**On-demand (Slack slash commands):**
- `/dashboard task add "Call Marko" --owner=allan --due=2026-05-15` → inserts task
- `/dashboard kpi cash-on-hand` → returns current cash
- `/dashboard expense add "GHL May" 155 --category=software` → logs expense
- `/dashboard subscription list` → shows all active subscriptions
- `/dashboard sub list` → list active subcontractors with status
- `/dashboard contact add "John Smith" --phone=0400000000` → adds contact

**Per dashboard event** (real-time):
- Customer payment received in Stripe → dashboard Cashflow + Finances + KPIs auto-update
- Sub paid via pay.com.au → dashboard Subs Tracker + Cashflow updates
- New form submission → dashboard Contacts auto-update

### Build requirements

- **Cloud Function** (Google Cloud or Vercel) running on schedule + webhook triggers
- **Supabase client** with service_role API key (env var, secret-managed)
- **Slack workspace + bot integration** for slash commands + alerts
- **Claude API** for natural-language → SQL translation (e.g., "/dashboard expense add 30 cement-grout" → INSERT INTO expenses)
- **Audit log** every action with timestamp + Slack message
- **Kill switch** (env var) toggles agent off without breaking system

### Cost estimate

- Cloud Function invocations: free tier 2M/mo (we'd use <1k)
- Supabase: free tier covers <500MB / 50,000 rows
- Claude API: ~$2-5/mo for typical command volume
- Slack: free tier
- **Total: $0-5/mo at our scale**

### Build sequencing

**Phase 6.6a-1 (Month 4-5):** Read-only daily refresh (lowest risk; surfaces value immediately)
**Phase 6.6a-2 (Month 5-6):** Slack slash commands for write operations (tasks, expenses)
**Phase 6.6a-3 (Month 6-7):** Real-time event-driven updates (Stripe webhooks → dashboard)
**Phase 6.6a-4 (Month 9+):** Full natural-language interface (Claude API translates user intent)

---

## L3: Native UI (always available)

Allan + Marko continue to use the existing Netlify UI for:
- Manual entry of items not yet automated
- Visual review of charts + dashboards
- Approval flows where human judgment needed

L1 + L2 layer ON TOP of L3 — they don't replace it. Allan/Marko always have the option to do anything manually.

---

## Recommended next actions for Allan

### Immediate (this session if you want CEO direct access)

1. **Send me Supabase URL + API key** (anon key first; service_role only if RLS is too restrictive)
2. **Send me table schema** — easiest: take screenshot of Supabase Table Editor view, OR paste output of `\dt` in SQL editor
3. **Optionally: send me draft cashflow plan** from Cashflow tab so I can sync founder-draw policy in CEO.md

I can then in same session:
- Read current cash position
- Read task board
- Add session deliverables as tasks
- Sync founder-draw policy

### Short-term (Month 4-5)

4. **Approve building the Dashboard Connector AI agent** — Cloud Function + Supabase service-role + Slack
5. **Allocate $0-5/mo budget** for the agent (negligible)
6. **Decide write-access scope** — should agent be able to add tasks autonomously, or only suggest? (Recommend: tasks autonomous, expenses suggest-only initially)

### Medium-term (Phase 6+)

7. **Dashboard audit + cleanup** — per [CEO § Dashboard integration plan Phase A](../CEO.md): claudeable workers (dashboard expert + coding expert) audit every tab, surface what to keep/fix/remove/add
8. **Connect dashboard to operating data** — GHL/Stripe/SM8 → dashboard auto-update (per Phase B)

---

## Sample interactions (what this looks like in practice)

### L1: CEO direct (during session)

```
Allan: "what's our cash on hand right now?"
CEO: [queries Supabase] → "Cash on hand per dashboard: $1,512.40 as of 2026-05-01 14:23.
       That's $1,500 starting + $12.40 from a refund credit. Below the $1,200 hard floor by $312."

Allan: "add a task to call Marko about subs this week"
CEO: [INSERTS into tasks table] → "Done. Task #47 added: 'Call Marko about subs',
       owner=allan, due=2026-05-04 (Friday), priority=medium. Visible in Tasks tab."
```

### L2: Agent in Slack (24/7)

```
Slack #weekly-numbers (Friday 5pm):
  🤖 Weekly digest auto-posted by AI Dashboard Connector
  📊 Week ending 2026-05-08:
     - Cash: $1,512 (no change — no jobs this week)
     - Quotes sent: 0 (no leads — GHL not yet live)
     - Reminder: GHL paid kicks in May 27 — must have first job by then
  🚨 Alert: 0 jobs in 7 days. Override 1 (network outreach) needs traction.

Allan in Slack:
  /dashboard task add "Marko to call 5 sub candidates" --owner=marko --due=tomorrow
  🤖 Task #48 added.
```

### L3: Native UI (manual, anytime)

Allan opens Netlify dashboard → clicks Tasks tab → sees the tasks created by L1 + L2 mixed in with manual ones.

---

## Compliance + governance

### Per [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md)

- **Privacy Act 1988** — customer PII tables segregated; CEO + agent get read-only on these
- **Records retention** — dashboard data backed up daily (Supabase auto-backup; export weekly to git for redundancy)
- **Audit trail** — every L1 + L2 write logged with who/what/when

### Per [auditor-fair-work.md](../roles/auditor-fair-work.md)

- **Subcontractor data** in Subs Tracker: never share full subcontractor list externally; respect Clause 10 confidentiality
- **Tier system data** for subs (T1/T2/T3) handled with discretion — subs see only their tier when surfaced via app

### Quarterly governance review (per [auditor-general-operational](../roles/auditor-general-operational.md))

- [ ] L1 CEO write activity reviewed — any drift from intended scope?
- [ ] L2 agent action log audited — false positives? false negatives?
- [ ] API keys rotated
- [ ] Supabase RLS policies still appropriate for current schema
- [ ] Cost trend (should stay <$5/mo at our scale)

---

## Cross-references

- [docs/CEO.md § Dashboard integration plan](../CEO.md#dashboard-integration-plan-added-2026-05-01-pm) — original CEO-level outline (Phase A audit / B connect / C refine)
- [docs/CEO.md § Founder draw policy](../CEO.md#founder-draw-policy-formalised-2026-05-01-pm-per-allans-direction) — what dashboard syncs to
- [docs/CEO.md § 24/7 monitoring infrastructure](../CEO.md#247-monitoring-infrastructure-added-2026-05-01-pm) — alerts architecture this builds on
- [docs/specs/ghl-pipeline-13-stage.md](ghl-pipeline-13-stage.md) — GHL events that feed dashboard updates
- [docs/specs/ai-employees/](ai-employees/) — sister AI employee specs (pricing-researcher, materials-validator, competitive-intelligence, trades-researcher, maintenance-reminder, dm-handler)
- [docs/FUTURE-PLAN.md § Phase 6.6a](../FUTURE-PLAN.md) — original AI Dashboard Connector spec (placeholder)
- [docs/QUESTIONS.md](../QUESTIONS.md) — Q-NEW will track Supabase URL + key + schema once Allan provides
