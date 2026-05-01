# Master Setup Checklist — All Accounts, Access, Tools, Sequencing

**Purpose:** Single reference for everything Allan needs to provision / sign up / grant access to, organised by phase + criticality. Each item documents: **what / why / benefit / cost / Allan's action / CEO action / time / status.**

**Last updated:** 2026-05-01 PM
**Owner:** Allan (sign-ups + account creation); CEO (deployment + integration code)

---

## Executive summary — by status

### ✅ Already done (Phase 0)
ABN, Public Liability $20M, Westpac business bank, ASIC business name, Cloudflare domains, Google Workspace email (admin@timelessresurfacing.com.au), WordPress theme + GitHub repo (Excluding1/timeless-theme-wp), TimelessDash quote form repo, Supabase dashboard backend, personal Claude Max subscription.

### 🔴 BLOCKING — needed THIS WEEK to launch persistent CEO
1. **Linode account + Sydney VPS** ($7.50 AUD/mo)
2. **Slack workspace** (free)
3. **Anthropic API safety-net key** ($0-5/mo cap)
4. **Cloudflare DNS subdomain** (`ceo.timelessresurfacing.com.au`)
5. **Backblaze B2 account** ($1/mo for backups)
6. **UptimeRobot account** (free, external monitoring)

### 🟠 BLOCKING dashboard improvement — also this week if you want UI/code fixes
7. **Netlify access** (invite admin@timelessresurfacing.com.au or my collaborator email)
8. **GitHub repo URL for dashboard frontend** (you said TimelessDash but verify which repo serves the Netlify deploy)
9. **GitHub collaborator access** (so I can push code changes via PRs or direct)

### 🟡 NEEDED for Phase 1 GHL (May 27 — when paid trial converts)
10. GHL paid subscription ($155/mo)
11. AU SMS-capable Twilio number via GHL
12. Domain authentication (DKIM/SPF/DMARC for hello@timelessresurfacing.com.au)

### 🟢 NEEDED Phase 2-4 (Month 2-6)
13. Stripe account, ServiceM8, pay.com.au, Google Ads, GA4 + GTM, Google Search Console, Sprintlaw subcontractor agreement, Xero accounting

---

## PHASE A — Persistent CEO infrastructure (Week 1)

### A.1 Linode account + Sydney Nanode 1GB VPS

| Field | Detail |
|---|---|
| **What** | Linode (Akamai-owned) cloud VPS — small Linux server in Sydney |
| **Why** | The 24/7 home for the CEO daemon. Without it, no persistent CEO. |
| **Benefit** | Always-on CEO that monitors Supabase + reacts to webhooks + posts daily briefs. Replaces the "I have to ask CEO every session" pattern. |
| **Cost** | $5 USD/mo (~$7.50 AUD) |
| **Time** | 10min signup |
| **Status** | ❌ Not started |

**Allan's actions (10min):**
1. Visit [login.linode.com/signup](https://login.linode.com/signup)
2. Create account with admin@timelessresurfacing.com.au
3. Add credit card (Westpac business card recommended for tax tracking)
4. Create Linode:
   - Image: **Ubuntu 24.04 LTS**
   - Region: **Sydney, AU (ap-southeast-2)**
   - Plan: **Shared CPU → Nanode 1GB ($5 USD/mo)**
   - Label: `ceo-timeless`
   - Root Password: generate strong (will disable root SSH after)
   - SSH Key: paste your public key (run `cat ~/.ssh/id_ed25519.pub` on your Mac to get it; if you don't have one, run `ssh-keygen -t ed25519` first)
   - Backups: skip (we use Backblaze B2 instead)
5. Note the assigned IP address

**CEO actions (after Linode is up):**
- Run hardening commands ([§ 5.2 of persistent-ceo-vps-deployment.md](persistent-ceo-vps-deployment.md))
- Deploy CEO daemon code (~600-800 LOC Python in next sprint)

---

### A.2 Slack workspace + channels

| Field | Detail |
|---|---|
| **What** | Slack workspace where daemon posts all activity, alerts, briefs |
| **Why** | Primary "live activity stream" — the Jordan-style notification panel where you see what every agent is doing in real time |
| **Benefit** | You see business operations on your phone 24/7 without opening anything. Daemon alerts you to anomalies before they become problems. |
| **Cost** | Free tier (10K messages history; we won't hit this for ~6mo) |
| **Time** | 15min signup + channel creation |
| **Status** | ❌ Not started |

**Allan's actions (15min):**
1. Visit [slack.com/get-started](https://slack.com/get-started)
2. Create workspace: "Timeless Resurfacing"
3. Invite admin@timelessresurfacing.com.au + your personal email + Marko (markobale11@... or his email)
4. Create channels (per [ghl-pipeline-13-stage.md § Slack architecture](ghl-pipeline-13-stage.md)):
   - `#ceo-overview` — daily 5am brief, weekly review, big events
   - `#ai-agents-activity` — every agent action live stream
   - `#new-jobs` — BOOM messages (deposit paid)
   - `#quotes-in` — form submissions
   - `#job-issues` — problems mid-job
   - `#nps-detractors` — customer 1-6 NPS scores
   - `#sla-breach` — anything that crossed an SLA
   - `#sub-payouts` — pay.com.au sub payments processed
   - `#system-alerts` — daemon health, errors
5. **Get Incoming Webhook URL:** Apps → "Incoming Webhooks" → install → create webhook for `#ceo-overview` → copy URL (looks like `https://hooks.slack.com/services/T.../B.../xyz`)
6. Send me the webhook URL (pasted directly OR in Supabase business_settings table — your call)

**CEO actions:**
- Daemon uses webhook URL to post messages
- Set up Slack bot for slash commands (Phase 2)

---

### A.3 Anthropic API key (safety net, $5/mo cap)

| Field | Detail |
|---|---|
| **What** | API key to anthropic.com for programmatic Claude calls |
| **Why** | Fallback if personal Claude Max auth fails or hits limits. Most calls go through your Max (zero cost). API only used in emergencies. |
| **Benefit** | Daemon never breaks even if Max access has issues. Hard cap prevents surprise bills. |
| **Cost** | $0-5/mo typical (with $5 hard cap) |
| **Time** | 5min |
| **Status** | ❌ Not started |

**Allan's actions (5min):**
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign in with your existing Anthropic account (the one with Claude Max)
3. Navigate to **Workspace → Limits** → set monthly spending limit to **$5 USD**
4. Navigate to **API Keys** → create new key labeled `ceo-daemon-safety-net`
5. Copy the key (starts with `sk-ant-...`)
6. Send me the key OR put in Supabase business_settings (your call)

**CEO actions:**
- Daemon checks Max auth first; falls back to API key only if needed
- Logs every API fallback to Slack `#system-alerts` (so we know if Max is having issues)

---

### A.4 Cloudflare DNS subdomain

| Field | Detail |
|---|---|
| **What** | DNS A record `ceo.timelessresurfacing.com.au` → Linode IP |
| **Why** | Stable URL for webhook receivers (Stripe + GHL + SM8 will POST to this) |
| **Benefit** | Even if Linode IP changes (rare), webhooks keep working — just update DNS. Better than IP-based URL. |
| **Cost** | $0 (Cloudflare free tier) |
| **Time** | 5min |
| **Status** | ❌ Not started (waits for Linode IP) |

**Allan's actions (after Linode IP is assigned, 5min):**
1. Login to Cloudflare → timelessresurfacing.com.au zone
2. **DNS** tab → **Add record**
   - Type: A
   - Name: `ceo`
   - IPv4 address: [Linode IP]
   - Proxy status: **DNS only** (orange cloud OFF) initially
   - TTL: Auto
3. Save
4. Test from your laptop: `dig ceo.timelessresurfacing.com.au` should return Linode IP

**Future option:** turn on Cloudflare proxy (orange cloud) for DDoS protection + bot blocking. Adds ~20ms latency. Worth it once we have ad spend driving traffic.

---

### A.5 Backblaze B2 account (VPS backup)

| Field | Detail |
|---|---|
| **What** | Cloud object storage for weekly tarball of VPS state (`/home/ceo/`, configs, data) |
| **Why** | If Linode VPS catastrophically lost, we restore in 30min from backup |
| **Benefit** | Disaster recovery — the difference between "rebuild from scratch over 2-3 days" and "restored in 30min" |
| **Cost** | ~$1 AUD/mo for 10GB ($0.005/GB/mo + minor egress) |
| **Time** | 10min |
| **Status** | ❌ Not started |

**Allan's actions (10min):**
1. Visit [backblaze.com/b2/sign-up.html](https://www.backblaze.com/b2/sign-up.html)
2. Create account with admin@timelessresurfacing.com.au
3. Create bucket:
   - Name: `timeless-ceo-backups` (must be globally unique; add suffix if taken)
   - Privacy: Private
   - Default Encryption: SSE-B2 (free, AES-256)
4. Application Keys → "Add a New Application Key":
   - Key name: `ceo-daemon-write`
   - Allow access to bucket: only `timeless-ceo-backups`
   - Type of access: Read and Write
5. Copy `keyID` and `applicationKey` (shown ONCE, save now)
6. Send me both OR put in Supabase business_settings

**CEO actions:**
- Daemon runs weekly cron: tar `/home/ceo/` + nginx configs + systemd configs → upload to B2
- Backup retention: keep last 8 weekly snapshots (~2 months); auto-rotate older

---

### A.6 UptimeRobot account (external monitoring)

| Field | Detail |
|---|---|
| **What** | External service that pings the CEO daemon every 5min from US/EU/AU |
| **Why** | Catches outages from outside (in case daemon thinks it's healthy but isn't reachable) |
| **Benefit** | If your VPS goes down at 3am, you get an alert at 3:05am. Without this, you'd find out at 5am when no morning brief arrives. |
| **Cost** | Free tier (50 monitors, 5min interval — plenty for us) |
| **Time** | 5min |
| **Status** | ❌ Not started |

**Allan's actions (5min):**
1. Visit [uptimerobot.com](https://uptimerobot.com) → free signup
2. Add monitor:
   - Type: HTTP(s)
   - Friendly name: `CEO Daemon Health`
   - URL: `https://ceo.timelessresurfacing.com.au/health`
   - Monitoring interval: 5 minutes
3. Add Alert Contact:
   - Type: Slack (paste the same webhook URL from A.2)
   - OR Email to admin@timelessresurfacing.com.au
4. Add monitor → save

After deployment, this auto-alerts if `/health` returns non-200 for 3 consecutive checks.

---

## PHASE B — Dashboard improvement (Week 2-3)

### B.1 Netlify account access (for dashboard frontend)

| Field | Detail |
|---|---|
| **What** | Allan invites CEO (or my collab email) to existing Netlify team |
| **Why** | Required to deploy dashboard UI/code fixes after I write them |
| **Benefit** | Without this, I can't ship UI improvements you asked for. Currently: blocked on this access. |
| **Cost** | $0 (Netlify free tier, you already have this) |
| **Time** | 2min Allan |
| **Status** | ❌ Not started — **BLOCKER for dashboard improvement** |

**Allan's actions (2min):**
1. Login to Netlify → Team Settings → Members → Invite
2. Invite email: `admin@timelessresurfacing.com.au` (we both have access via Google Workspace)
3. Role: Owner or Developer
4. Accept invite

---

### B.2 GitHub repo URL for dashboard frontend

| Field | Detail |
|---|---|
| **What** | The GitHub repo whose code Netlify deploys to dashboard |
| **Why** | I need to know which repo to clone, audit, and push fixes to |
| **Benefit** | Without this, I can't audit the actual UI/code (only the data via Supabase) |
| **Cost** | $0 |
| **Time** | 1min Allan |
| **Status** | ❓ Unknown — you mentioned earlier but I don't have the URL confirmed |

**Allan's actions (1min):**
- In Netlify dashboard → Site settings → Build & deploy → Linked repository
- Send me the repo URL (likely `github.com/Excluding1/[name]`)

**Likely candidates** (I think one of these is right):
- `github.com/Excluding1/TimelessDash` — this was mentioned earlier as React quote form; might also be the dashboard
- `github.com/Excluding1/[other-repo]` — separate dashboard repo

---

### B.3 GitHub collaborator access for CEO

| Field | Detail |
|---|---|
| **What** | Add me as collaborator on dashboard frontend repo |
| **Why** | Required to push code changes (UI fixes, architecture improvements, new tabs) |
| **Benefit** | I can ship UI improvements directly via PRs or direct commits |
| **Cost** | $0 |
| **Time** | 2min Allan |
| **Status** | ❌ Not started |

**Allan's actions (2min):**
1. GitHub.com → repo → Settings → Collaborators
2. Add: `admin@timelessresurfacing.com.au` OR my GitHub username (let me know what to use)
3. Role: Maintain (can push but not change settings) — recommended for safety

---

## PHASE C — GHL + Lead Pipeline (May 27 → Phase 1)

### C.1 GHL paid subscription

| Field | Detail |
|---|---|
| **What** | GoHighLevel CRM — the central nervous system for customer pipeline |
| **Why** | Hosts the 13-stage pipeline, custom fields, workflows, customer comms |
| **Benefit** | Replaces all manual customer comms + ticket tracking. Captures every lead, never lets one fall through cracks. Per Phase 1 of FUTURE-PLAN. |
| **Cost** | $155/mo AUD |
| **Time** | 30min initial setup |
| **Status** | 🟡 Trial active until 2026-05-27, then paid kicks in |

**Allan's actions (May 27):**
1. Convert trial to paid
2. Provide me API key (Settings → Business Profile → API Key)
3. Buy AU SMS-capable number through GHL
4. Connect Google Workspace email + authenticate domain (DKIM/SPF/DMARC)

**CEO actions (post conversion):**
- Build out 13-stage pipeline + 12 workflows per [ghl-pipeline-13-stage.md](ghl-pipeline-13-stage.md)
- Connect to dashboard via webhooks (every form submit, payment, stage change → Supabase update)
- Connect to CEO daemon (real-time alerts to Slack)

---

## PHASE D — Phase 2-4 ops integrations (Month 2-6)

### D.1 Stripe (Phase 2)
- Visit [stripe.com](https://stripe.com) → AU account → Westpac business bank linked
- Cost: free + 1.75% + $0.30 per AU domestic card transaction
- Why: customer deposit + final payment processing
- Time: 30min Allan + 1hr CEO integration

### D.2 ServiceM8 (Phase 4)
- $29/mo Starter plan
- Why: job dispatch to subs + photo upload + completion forms
- Time: 1hr Allan + 2hr CEO integration

### D.3 pay.com.au (Phase 4)
- Free signup; pay-per-transaction (~1%)
- Why: sub payments via rewards card (Jordan's pattern — earn points on sub spend)
- Time: 30min Allan

### D.4 Google Ads + GA4 + GTM + Search Console (Phase 1.6a + Phase 2)
- Free for the accounts
- Cost for ads: $20-30/day budget initially (Phase 2)
- Why: paid acquisition + conversion tracking
- Time: 2hr Allan + 2hr CEO setup

### D.5 Sprintlaw subcontractor agreement (Phase 3)
- ~$200 one-off legal package
- Why: legally-vetted subcontractor agreement template (avoids sham contracting + UCT issues)
- Time: 1 week turnaround from Sprintlaw

### D.6 Xero (Phase 1.7)
- $35-70/mo
- Why: bank feed + BAS prep + TPAR generation + accountant access
- Time: 30min signup + ongoing daily reconciliation

---

## Critical path sequence

### 🔴 THIS WEEK (Phase A — get CEO online)

```
Day 1 (Allan, 60min total):
  → A.1 Sign up Linode + create Sydney Nanode 1GB
  → A.2 Sign up Slack + create channels
  → A.3 Create Anthropic API safety-net key (if not already)
  → A.5 Sign up Backblaze B2 + create bucket + key
  → A.6 Sign up UptimeRobot + add monitor

Day 2 (Allan, 5min):
  → A.4 Add Cloudflare DNS subdomain pointing to Linode IP
  → Send me all credentials (Slack webhook, B2 keys, etc.)

Day 3-7 (CEO):
  → SSH into Linode + run hardening commands
  → Write ceo-agent/ folder (~600-800 LOC Python)
  → Deploy daemon + nginx + Let's Encrypt TLS
  → Verify health endpoint + first 5am brief

End of Week 1: CEO online, posting to Slack, monitoring 24/7.
```

### 🟠 WEEK 2-3 (Phase B — dashboard frontend access)

```
Day 8 (Allan, 5min):
  → B.1 Invite me to Netlify team
  → B.2 Send me dashboard frontend repo URL
  → B.3 Add me as GitHub collaborator

Day 9-21 (CEO):
  → Audit existing dashboard code (UI + architecture)
  → Apply ui-ux-pro-max-skill plugin findings
  → Add agent_runs + agent_activity_events tables to Supabase
  → Build new "AI Activity" dashboard tab
  → Fix UI/code/architecture issues per dashboard-audit-and-improvement-plan
  → Connect dashboard to GHL/Stripe webhooks (auto-sync)

End of Week 3: Dashboard cleaned + AI Activity tab live + auto-syncing with operations.
```

### 🟡 MAY 27 (Phase C — GHL conversion)

```
May 27 (Allan, 30min):
  → C.1 Convert GHL trial → paid
  → Buy AU Twilio number
  → Authenticate domain DKIM/SPF/DMARC
  → Send me GHL API key

May 28 - June 7 (CEO):
  → Build all 40+ custom fields
  → Build 13-stage pipeline
  → Build 12 workflows
  → Wire quote form to GHL (replace REPLACE_ME webhooks)
  → Connect GHL events to Slack + dashboard

End of June first week: Phase 1 complete. First customer can submit form → quote → deposit → BOOM.
```

### 🟢 MONTH 2-6 (Phase D — full ops stack)

```
Month 2:  Stripe live + first deposits flowing
Month 3:  Phase 3 sub recruitment + first sub onboarded → trial passed → live
Month 4:  ServiceM8 + pay.com.au live → first dispatched job complete
Month 5:  Google Ads launched (Phase 2.1) with POAS tracking
Month 6:  Phase B Claude Max migration triggered (if revenue $10K+/mo)
```

---

## What this stack gives you (benefits summary)

### 24/7 reactive CEO (Phase A)
- Wake up to morning brief on phone every day
- Anomalies caught + alerted within 5 min (cash floor, NPS detractor, sub no-show)
- Slack slash commands for any CEO action from your phone
- Webhooks fire <3s for Stripe/GHL events
- $8-12 AUD/mo total

### Live operational visibility (Phase B)
- See every agent's activity in real-time (Slack)
- Dashboard "AI Activity" tab with timeline + drill-down
- Per-agent stats (runs, success rate, cost)
- Click any run → full event timeline + Slack thread
- $0 marginal cost (uses existing Supabase + Slack)

### Automated lead capture + pipeline (Phase C)
- Form submit → SMS within 60s + Slack alert
- Quote sent → 24h + 72h follow-up automatic
- Deposit paid → BOOM Slack + SM8 job created
- Customer cure-time SMS + NPS routing automatic
- Multi-channel comms with Spam Act compliance built in

### Full operational data layer (Phase D)
- Every transaction in Stripe → dashboard cashflow auto-updated
- Every sub job in SM8 → KPI tab updated
- Every sub paid → cashflow + tax records auto
- POAS tracking per Google Ads keyword
- BAS prep + TPAR generation auto from Xero
- Sub agreement legal-vetted (Sprintlaw)

---

## Cost summary across all phases

| Phase | Items | $ AUD/mo | When |
|---|---|---|---|
| **Phase A** | Linode + Slack + API safety + B2 + UptimeRobot | **$8-12** | Week 1 |
| **Phase B** | Netlify + GitHub | $0 | Week 2-3 (uses existing) |
| **Phase C** | GHL | **+$155** | May 27 |
| **Phase D Stripe** | (% of revenue) | (variable) | Month 2 |
| **Phase D SM8** | $29 | **+$45 AUD** | Month 4 |
| **Phase D Xero** | $50-100 | **+$50-100** | Month 1 (or Phase 4) |
| **Phase D Google Ads** | $20/day budget | **+$600/mo** | Month 5 (when ready) |
| **Phase D Business Claude Pro** | $30 | **+$30** (replaces personal Max for daemon) | Month 4-6 trigger |
| | | | |
| **Total Month 1 (lean)** | Phase A only | **$8-12 AUD/mo** | |
| **Total Month 6 (Phase 1+2+3 active)** | All except ads | **~$240-290 AUD/mo** | |
| **Total Month 9 (full ops + ads)** | Everything | **~$840-890 AUD/mo** | |

Compare to $25K/mo target Month 12 revenue → operating costs are <4% of revenue at scale. **Healthy unit economics.**

---

## Cross-references

- [docs/specs/persistent-ceo-vps-deployment.md](persistent-ceo-vps-deployment.md) — Phase A detailed deployment recipe
- [docs/specs/dashboard-audit-and-improvement-plan-2026-05-01.md](dashboard-audit-and-improvement-plan-2026-05-01.md) — Phase B work plan
- [docs/specs/ghl-pipeline-13-stage.md](ghl-pipeline-13-stage.md) — Phase C GHL build spec
- [docs/FUTURE-PLAN.md](../FUTURE-PLAN.md) — Phase D long-term roadmap
- [docs/specs/dashboard-integration-plan.md](dashboard-integration-plan.md) — L1+L2+L3 integration architecture
- [docs/QUESTIONS.md](../QUESTIONS.md) — Q19-Q23 tracking outstanding questions
