# Dashboard Audit + Improvement Plan (2026-05-01)

**Trigger:** Allan's directive — *"fix, clean up, improve UI, improve architect, improve code, add goals, etc do everything give these tasks to your manager role md expert to delegate and plan out tasks to the employees expert"* + *"everything on the dashboard including data and ui code and code functions are a draft only, needs improving and fixing"*

**Manager:** [manager-business-orchestrator.md](../roles/manager-business-orchestrator.md)
**Status:** Manager has decomposed + delegated; some work executed this session via direct Supabase access; remainder pending Allan-provided frontend repo access.

---

## Discovered state (read via Supabase service_role 2026-05-01)

### Tables (18 total) + row counts
| Table | Rows | Notes |
|---|---|---|
| business_settings | 3 | Cashflow draft plan: tax_reserve=25, growth_reserve=30, buffer_target=20000 |
| business_links | 4 | External links library |
| credentials | 4 | Sensitive (services + logins) |
| finances | 6 | Starting capital + 5 expenses YTD |
| goals | 20 (added this session) | Empty before — CEO populated |
| messages | 12 | Internal Allan ↔ Marko |
| notes | 1 | ABN reference |
| notifications | 7 | All "Subscription Renewal Soon" |
| subscriptions | 5 | $38.60/mo current + GHL trial |
| tasks | 49 + 17 (added this session) | Phase 0 setup tasks + new strategic tasks |
| (others) | 0 | calendar_events, contacts, kpi_snapshots, subcontractors, weekly_review_*, quick_links, user_preferences |

### Cash position (per finances table)
- **Starting capital (Allan + Marko):** $1,500 (2026-03-15)
- **Expenses YTD:** $187.56 (ASIC $45 + Hosting $99 + GW Email $18.88 + Cloudflare $14.68 + International calls $10)
- **Real cash:** $1,500 - $187.56 = **$1,312.44** (STATE.md says $1,500 — needs sync)

### Subscriptions monthly burn
- Google Workspace: $18.88/mo
- Ventraip WP hosting: $222/yr ÷ 12 = $18.50/mo
- Cloudflare domain: $14.68/yr ÷ 12 = $1.22/mo
- **Current:** ~$38.60/mo
- **Post May 27 (GHL paid):** +$155 = $193.60/mo

### Existing 49 tasks — broad picture
- Phase 0 setup tasks (mostly): ABN registration, business name, dashboard setup, GHL trial, etc.
- Some marked done (ABN registered, business name, business bank, Google Workspace, domain registered)
- Most still todo (GHL setup, Stripe, Google Ads, sub recruitment, ServiceM8, Slack, etc.)
- One in_progress: "Build pricing plan sheet" (now complete per pricing-audit-2026-05-findings.md)

---

## What CEO did this session (Supabase direct via service_role)

### Goals tab populated (20 goals)
3 categories: foundation milestones, revenue + jobs ramp, KPI discipline:

**Foundation milestones:**
- Cash savings $5K (founder draw trigger)
- Cash buffer $20K (per business_settings)
- First 3 customers (Override 1)
- 3 active subcontractors

**Revenue + jobs ramp:**
- Month 6: $25K/mo revenue, 15 jobs/mo, 6-sub roster
- Month 12: $50K/mo revenue, 30 jobs/mo, 12-sub roster
- Year 1: $500K (CEO realistic) / $1M (Allan stretch)
- Year 2: $1.5M (Jordan path)
- 50 Google reviews 4-5⭐

**KPI discipline (V56 Jordan benchmarks):**
- Form-fill 13%+, Quote-sent 70%+, Close 28%+
- Net margin 35%+ (after all indirect)
- NPS promoter 50%+
- Repeat customer 35%+ (V82)

### Tasks tab — 17 new strategic tasks added
Categories: Infrastructure (4), Dashboard (5), Pricing (2), Operations (2), Compliance (2), Tooling (1), AI Agents (1)

Highlights:
- 🔴 URGENT: Deploy persistent CEO agent to VPS
- 🔴 URGENT: Provide Netlify dashboard frontend repo URL + GitHub access (BLOCKER for code/UI fixes)
- 🔴 URGENT: Marko first resurfacing subcontractor onboarding
- 🟠 HIGH: Rotate service_role key after persistent deployment
- 🟠 HIGH: Install 3 Claude Code plugins (gsd, claude-code-templates, ui-ux-pro-max-skill)

---

## Manager's decomposition + delegation plan

### Track 1: UI audit (BLOCKED on frontend repo access)
**Delegated to:** UI/UX Designer (need to build role) + auditor-customer-fairness
**Skill to leverage:** ui-ux-pro-max-skill plugin (161 reasoning rules, 67 UI styles)
**Work items:**
- Per-tab audit (16 tabs): completeness, design consistency, mobile responsiveness, dark/light mode, accessibility (WCAG AA), data display clarity, loading states, error states
- Surface "draft data" warning UI (per Allan's note)
- Quick-links + business-links tabs feel underutilised — suggest consolidation
- Notifications tab — only "Subscription Renewal Soon" types; expand to alerts, KPI movements, sub events

### Track 2: Architecture audit (BLOCKED on frontend repo access)
**Delegated to:** Fullstack Engineer (need to build role) + auditor-general-operational + auditor-webhook-integrity
**Work items:**
- Supabase client usage patterns (singleton? per-component?)
- RLS policy audit — service_role is open; anon should be locked per-table per Privacy Act
- Type safety (TS strict?)
- Error handling (where do errors surface to user?)
- State management (single source of truth?)
- Build pipeline (Netlify auto-deploy on git push?)
- Code splitting + bundle size

### Track 3: Data audit (CEO doing — partially done this session)
**Delegated to:** CEO direct via Supabase + auditor-compliance-aus (PII)
**Work items:**
- ✅ Inventoried all 18 tables + row counts
- ✅ Identified credentials table contains sensitive data (must stay locked)
- ✅ Identified finances table has 6 entries (matches CEO.md cash math)
- 🟠 Pending: mark each row's status (canonical / draft / sandbox) per Allan
- 🟠 Pending: enforce RLS policies on customer PII tables once contacts populate
- 🟠 Pending: backup strategy for Supabase data (weekly export to git per Allan recurring cadence)

### Track 4: Integration audit (BLOCKED on Phase 1 GHL setup)
**Delegated to:** expert-ghl-operator + auditor-webhook-integrity
**Work items (deferred until Phase 1 GHL live):**
- GHL form submit → contact creation in dashboard
- Stripe payment → finances + cashflow + KPI auto-update
- SM8 job complete → tasks closed + KPI updated
- pay.com.au sub paid → subcontractors tracker + cashflow

### Track 5: Security audit (CEO partially done)
**Delegated to:** auditor-compliance-aus
**Work items:**
- ✅ RLS confirmed locking anon access (good)
- ✅ Service_role key noted for rotation post-deployment
- 🟠 Pending: build audit_log table for all CEO+agent writes
- 🟠 Pending: customer PII table policies when contacts populate
- 🟠 Pending: credentials table — encrypt password column or move to Supabase Vault

### Track 6: Performance audit (BLOCKED on frontend repo access)
**Delegated to:** expert-cro-specialist + auditor-mobile-abandonment
**Work items:**
- Page load times (Core Web Vitals)
- Mobile rendering (most founders check on phone)
- Real-time update latency (Supabase realtime channels?)
- Bundle size + code splitting

---

## What Allan must provide to unblock 4 of 6 tracks

🔴 **HIGHEST PRIORITY:**
1. **Netlify frontend repo URL + GitHub access** — without this, UI / Architecture / Performance audits all blocked
2. **Confirmation:** can CEO commit changes directly OR PR-only workflow?
3. **Backup branch protection rules** — should main be protected?

---

## Recommended Claude Code primitive integration (per Skills Report 2026 Apr)

Per the Skills Report v1 findings:

### High-leverage primitives to adopt
1. **`/skeptic` prefix** for decision questions (5.5× improvement over baseline at catching wrong premises)
2. **PERSONA with specifics** for domain work (we already do this via role files)
3. **`/steelman`** before committing to contrarian decisions
4. **Sub-agents for code review + photo review** (20-40% more issues caught)
5. **Hooks** for deterministic automation around AI

### Plugins to install (per Allan request)
```bash
# In Claude Code session, run these slash commands:
/plugin install gsd-build/get-shit-done
/plugin install davila7/claude-code-templates
/plugin install nextlevelbuilder/ui-ux-pro-max-skill
```

**Skipped:**
- ❌ vibe-kanban (sunsetting — README opens with shutdown announcement)
- ⚪ claude-code-toolkit (lower priority — useful for maintenance, not build phase)

### Built-in parallel agent execution (already available)
My Agent tool dispatches multiple specialized agents concurrently in a single message. This IS the multi-agent parallelism Allan wanted. No external tool needed.

---

## Persistent deployment plan (per Allan: "operate 24/7 with daily 5am checks like Jordan")

**Architecture:** Cloud Function + Supabase + Slack + Claude API

**Components:**
- **VPS (Hetzner CPX11 €4.50/mo) OR Cloud Function (Google Cloud Run / Vercel Functions, free tier covers our scale)**
- **Cron schedule:** daily 5am Sydney → CEO morning brief
- **Slack workspace:** for slash commands + alerts
- **Claude API key:** Anthropic, ~$2-10/mo at our scale
- **Supabase service_role key:** stored as env var (not in code), audit log tracks all writes

**Daily 5am morning brief content (auto-generated):**
- Cash position
- Yesterday's events (form submits, payments, NPS)
- Open task triage (urgent/blocked)
- Goal progress vs targets
- Anomaly alerts (KPI deviations >20%)

**Slack slash commands:**
- `/dashboard task add "..." --owner=allan --due=tomorrow`
- `/dashboard kpi cash-on-hand`
- `/dashboard expense add 30 cement-grout`
- `/ceo brief` — on-demand morning brief
- `/ceo audit dashboard` — trigger full audit

**Build sequence (5 sprints):**
1. **Sprint 1 (Week 1):** Cloud Function reads Supabase + posts daily 5am Slack message
2. **Sprint 2 (Week 2):** Slack slash commands for read operations
3. **Sprint 3 (Week 3):** Slack slash commands for write operations
4. **Sprint 4 (Week 4):** Real-time event handlers (Stripe webhook → dashboard auto-update)
5. **Sprint 5 (Month 2):** Multi-agent orchestration — sub-agents for specialized audits

**Cost:** $0-15/mo at our scale.

**Owner:** Allan to greenlight + provision Cloud Function project. CEO writes the code. Once deployed, CEO is "always on."

---

## Cross-references

- [docs/roles/manager-business-orchestrator.md](../roles/manager-business-orchestrator.md) — Manager doing the delegation
- [docs/specs/dashboard-integration-plan.md](dashboard-integration-plan.md) — L1+L2+L3 architecture
- [docs/CEO.md § Dashboard integration plan](../CEO.md) — original CEO outline
- [docs/CEO.md § Founder draw policy](../CEO.md) — sync target with business_settings
- [docs/QUESTIONS.md](../QUESTIONS.md) — Q19 (Supabase access ✅ resolved this session) + Q20 (founder draw formula)
