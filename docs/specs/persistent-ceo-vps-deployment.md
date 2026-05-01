# Persistent CEO Deployment — VPS Architecture (24/7 Always-On)

**Trigger:** Allan 2026-05-01 — *"why not just get a vps server now if we going to have to do it eventually so we dont deal with the switching in the future and also if theres something that comes up thats important before the scheduled task at least you can react to it your the ceo you need to react 24/7"*

**Decision:** **VPS now, not Cloud Function.** Reasons in § 1.

**Audited via:** [auditor-general-operational](../roles/auditor-general-operational.md) (architecture) + [auditor-compliance-aus](../roles/auditor-compliance-aus.md) (security + Privacy Act for hosted customer data) + [auditor-webhook-integrity](../roles/auditor-webhook-integrity.md) (webhook reliability)

---

## 1. Why VPS over Cloud Function (Allan was right)

| Capability | Cloud Function | VPS | Our need |
|---|---|---|---|
| Scheduled jobs (5am brief) | ✅ via Cloud Scheduler | ✅ via cron | Both work |
| Webhook receivers (GHL/Stripe/SM8) | ✅ but cold-start lag 1-5s | ✅ instant always-on | **VPS wins** — Stripe webhooks need <3s response |
| Real-time anomaly monitoring | ❌ stateless, can't loop | ✅ daemon process | **VPS only** |
| Slack slash command response (<3s SLA) | ⚠️ cold start risk | ✅ always warm | **VPS wins** |
| 24/7 ad-hoc CEO reaction | ❌ doesn't exist between triggers | ✅ daemon listens always | **VPS only** |
| Persistent in-memory state | ❌ stateless | ✅ holds context | **VPS wins** for rate limits, dedup |
| Future migration cost | LOW→HIGH if needs grow | LOW→LOW (just scale up) | Avoid switching cost |
| Cost at our scale | $0-$3/mo | $7-12/mo | **+$5/mo for capability we'll need anyway** |

**Verdict:** VPS now. The marginal $5-7/mo is rounding error vs avoiding migration tax + getting 24/7 reactivity.

---

## 2. Recommended provider: Hetzner Cloud OR DigitalOcean

### Option A: Hetzner Cloud CPX11 (cheapest, EU-based)
- **Cost:** €4.50/mo (~$7.50 AUD)
- **Specs:** 2 vCPU, 4GB RAM, 40GB SSD, 20TB traffic
- **Region:** EU (Helsinki/Nuremberg/Falkenstein) — adds ~250-300ms latency to Sydney
- **Pros:** cheapest, very reliable, simple billing
- **Cons:** EU-distance latency for webhooks (acceptable but not ideal)

### Option B: DigitalOcean Basic Droplet ✅ RECOMMENDED
- **Cost:** $6 USD/mo (~$9 AUD)
- **Specs:** 1 vCPU, 1GB RAM, 25GB SSD, 1TB transfer
- **Region:** **Sydney datacenter (SYD1)** — local low latency
- **Pros:** Sydney-based (~10-30ms latency to AU services), AUD billing via Stripe
- **Cons:** slightly less RAM than Hetzner; will need upgrade to $12/mo when AI agents scale

### Option C: Vultr High Frequency Sydney
- **Cost:** $6 USD/mo
- **Specs:** 1 vCPU, 1GB RAM
- **Pros:** Sydney datacenter, fast NVMe
- **Cons:** smaller provider; less ecosystem tooling

**My pick: DigitalOcean SYD1.** Sydney latency matters for webhook response times (Stripe + GHL retry on >3s response). $9 AUD/mo is fine. Easy Australian invoicing.

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  DigitalOcean Droplet (Sydney SYD1)                          │
│  Ubuntu 24.04 LTS — $6 USD/mo                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ceo daemon (systemd service, always running)         │   │
│  │                                                       │   │
│  │  • Background scheduler (5am brief, weekly review)   │   │
│  │  • Anomaly detection loop (every 5min poll Supabase) │   │
│  │  • Slack event listener (slash commands)             │   │
│  │  • In-memory state (rate limits, conversation cache) │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  webhook server (FastAPI, port 8000 internal)        │   │
│  │                                                       │   │
│  │  • POST /webhook/ghl  → form submission, stage move  │   │
│  │  • POST /webhook/stripe → payment received           │   │
│  │  • POST /webhook/sm8  → job complete, photo upload   │   │
│  │  • POST /webhook/slack → slash commands              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  nginx (port 80/443, public)                         │   │
│  │  • TLS via Let's Encrypt (auto-renew)                │   │
│  │  • Reverse proxy: ceo.timelessresurfacing.com.au:443│   │
│  │    → 127.0.0.1:8000                                  │   │
│  │  • Rate limiting + bot blocking                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Outbound calls:                                             │
│  • Supabase REST API (read/write tasks, KPIs, finances)     │
│  • Claude API (morning brief generation, anomaly analysis)  │
│  • Slack webhook (post messages, alert channels)            │
│  • GHL API (when Phase 1 live)                              │
└─────────────────────────────────────────────────────────────┘
                ↑
                │ Inbound webhooks (HTTPS)
                │
        ┌───────┴────────────────┐
        │                        │
   GHL workflows         Stripe webhooks      ServiceM8
   (form submit,         (payment            (job complete,
    stage move)          received)            photo upload)
```

---

## 4. Tech stack

### OS + runtime
- **Ubuntu 24.04 LTS** (security updates until 2029)
- **Python 3.12** (or 3.11 for stability)
- **systemd** for service management

### Python dependencies
```
supabase>=2.5.0       # Supabase client
anthropic>=0.40.0     # Claude API
slack-sdk>=3.27.0     # Slack webhook + bot
fastapi>=0.115.0      # Webhook receivers
uvicorn>=0.32.0       # ASGI server
schedule>=1.2.0       # Background scheduler
python-dotenv>=1.0.0  # Env var loading
sentry-sdk>=2.0.0     # Error tracking (optional, free tier)
```

### Web server + TLS
- **nginx** as reverse proxy + TLS terminator
- **Let's Encrypt** via certbot (free TLS, auto-renew)

### DNS
- **Cloudflare** (you already use them) — point `ceo.timelessresurfacing.com.au` A record to droplet IP
- Optionally use Cloudflare proxy mode for DDoS protection (free tier)

---

## 5. Step-by-step deployment recipe

### 5.1 Provision the VPS (10 min)

```bash
# Sign up at digitalocean.com
# Create droplet:
#   - Region: Sydney (SYD1)
#   - Image: Ubuntu 24.04 LTS
#   - Plan: Basic ($6/mo)
#   - Auth: SSH key (generate with `ssh-keygen` if needed; paste public key)
#   - Hostname: ceo-timeless

# Get droplet IP from DO console; SSH in:
ssh root@DROPLET_IP
```

### 5.2 Initial server hardening (10 min)

```bash
# Update + install essentials
apt update && apt upgrade -y
apt install -y python3-pip python3-venv git nginx certbot python3-certbot-nginx ufw fail2ban tmux htop

# Create non-root user
adduser ceo --disabled-password
usermod -aG sudo ceo
mkdir /home/ceo/.ssh
cp ~/.ssh/authorized_keys /home/ceo/.ssh/
chown -R ceo:ceo /home/ceo/.ssh
chmod 700 /home/ceo/.ssh
chmod 600 /home/ceo/.ssh/authorized_keys

# Disable root SSH
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd

# Firewall
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP (Let's Encrypt)
ufw allow 443/tcp    # HTTPS (webhooks)
ufw --force enable

# fail2ban for SSH protection (default config is fine)
systemctl enable --now fail2ban

# Switch to ceo user
su - ceo
```

### 5.3 DNS setup (5 min)

In Cloudflare dashboard:
- Add A record: `ceo.timelessresurfacing.com.au` → DROPLET_IP
- Proxy status: DNS-only initially (set proxied later if you want CF protection)
- TTL: Auto

### 5.4 Deploy CEO agent code (15 min)

```bash
# (As ceo user)
cd ~
git clone git@github.com:Excluding1/timeless-theme-wp.git
cd timeless-theme-wp/ceo-agent  # NOTE: this folder will be created in next batch

# Set up Python venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env file (NOT in git)
cat > .env <<'EOF'
SUPABASE_URL=https://gnsrpeaosocjmnrqgcic.supabase.co
SUPABASE_SERVICE_KEY=<rotate-after-deploy-and-paste-new-key-here>
CLAUDE_API_KEY=<get-from-console.anthropic.com>
SLACK_WEBHOOK_URL=<get-from-slack-incoming-webhooks>
SLACK_BOT_TOKEN=<for-slash-commands>
SLACK_SIGNING_SECRET=<for-webhook-verification>
GHL_API_KEY=<when-Phase-1-live>
STRIPE_WEBHOOK_SECRET=<when-Stripe-set-up>
SENTRY_DSN=<optional-error-tracking>
EOF
chmod 600 .env  # owner-only readable

# Test run
python main.py --healthcheck
# Should print: "OK — Supabase connected, Claude API ready, Slack reachable"
```

### 5.5 Set up systemd service (5 min)

```bash
# (As ceo user)
sudo tee /etc/systemd/system/ceo.service > /dev/null <<'EOF'
[Unit]
Description=Timeless CEO Agent (24/7 daemon)
After=network.target

[Service]
Type=simple
User=ceo
WorkingDirectory=/home/ceo/timeless-theme-wp/ceo-agent
EnvironmentFile=/home/ceo/timeless-theme-wp/ceo-agent/.env
Environment="PATH=/home/ceo/timeless-theme-wp/ceo-agent/.venv/bin"
ExecStart=/home/ceo/timeless-theme-wp/ceo-agent/.venv/bin/python main.py
Restart=always
RestartSec=10
StandardOutput=append:/home/ceo/ceo-agent.log
StandardError=append:/home/ceo/ceo-agent-error.log

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ceo
sudo systemctl start ceo
sudo systemctl status ceo  # confirm "active (running)"

# Watch logs
tail -f /home/ceo/ceo-agent.log
```

### 5.6 Set up nginx + TLS (10 min)

```bash
# (As ceo user, sudo)
sudo tee /etc/nginx/sites-available/ceo > /dev/null <<'EOF'
server {
    listen 80;
    server_name ceo.timelessresurfacing.com.au;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rate limit basic
    limit_req_zone $binary_remote_addr zone=ceo_rate:10m rate=10r/s;
    location ~ ^/webhook {
        limit_req zone=ceo_rate burst=20 nodelay;
        proxy_pass http://127.0.0.1:8000;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/ceo /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t  # test config
sudo systemctl reload nginx

# Get TLS cert (Let's Encrypt — free, auto-renew)
sudo certbot --nginx -d ceo.timelessresurfacing.com.au --non-interactive --agree-tos -m allanpham106@gmail.com

# Verify auto-renew set up
sudo certbot renew --dry-run
```

### 5.7 Verify (5 min)

```bash
# From your laptop:
curl https://ceo.timelessresurfacing.com.au/health
# Should return: {"status":"ok","supabase":"connected","claude":"ready","slack":"reachable"}

# Test webhook (simulated):
curl -X POST https://ceo.timelessresurfacing.com.au/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test":"hello"}'
# Should appear in Slack #ceo-events channel

# Trigger morning brief on demand:
curl -X POST https://ceo.timelessresurfacing.com.au/admin/morning-brief \
  -H "Authorization: Bearer $ADMIN_TOKEN"
# Should post brief to Slack #weekly-numbers
```

---

## 6. CEO daemon code structure (to be built in next batch)

Folder layout for `ceo-agent/` in repo:

```
ceo-agent/
├── main.py                  # daemon entry point
├── requirements.txt         # Python deps
├── README.md                # how to deploy + run
├── .env.example             # template (real .env in .gitignore)
├── .gitignore               # ensures .env never committed
├── core/
│   ├── supabase_client.py   # wrapper for Supabase service_role API
│   ├── claude_client.py     # Claude API + prompt templates
│   ├── slack_client.py      # Slack webhook + bot interface
│   └── audit_log.py         # writes every CEO action to audit_log table
├── jobs/
│   ├── morning_brief.py     # 5am Sydney scheduled
│   ├── weekly_review.py     # Friday 5pm Sydney
│   ├── anomaly_check.py     # every 5min Polling
│   └── monthly_close.py     # 1st of month
├── webhooks/
│   ├── ghl.py               # GHL form/stage events
│   ├── stripe.py            # payment received/failed
│   ├── sm8.py               # job complete + photos
│   └── slack.py             # slash commands, message events
├── prompts/
│   ├── morning_brief.txt    # system prompt for Claude
│   ├── anomaly_alert.txt
│   └── weekly_review.txt
└── tests/
    └── test_smoke.py        # basic health checks
```

**Total LOC estimate: ~600-800 lines.** Will write in next sprint.

---

## 7. What CEO will do once deployed

### Daily (autonomous)
- **5am Sydney:** post morning brief to Slack `#weekly-numbers` — cash, yesterday's events, urgent tasks, KPI deviations
- **Every 5min:** poll Supabase for anomalies (cash drop, NPS detractor, sub flight, KPI drop) — alert Slack instantly
- **Every webhook:** react to GHL/Stripe/SM8 events in <3s

### Weekly (autonomous)
- **Friday 5pm:** post weekly review draft to Slack — pulled metrics + 5 actionable insights
- **Sunday 6pm:** queue maintenance-reminder draft cycle (per [maintenance-reminder.md](ai-employees/maintenance-reminder.md))

### Monthly (autonomous)
- **1st of month:** P&L close + founder draw decision per [CEO § Founder draw policy](../CEO.md)
- **1st of month:** sub tier review reminder + insurance expiry check
- **1st of month:** subscription renewal audit

### On-demand (via Slack slash commands)
- `/ceo brief` — generate morning brief now
- `/ceo cash` — current cash + runway
- `/ceo task add "..." --owner=allan --due=tomorrow`
- `/ceo finance add 30 --category=materials --description="grout for RSC-02"`
- `/ceo audit goals` — current goal progress
- `/ceo subs status` — active sub roster + utilization
- `/ceo decide "..."` — apply CEO Rule 12 structured decisioning

---

## 8. Security discipline

Per [auditor-compliance-aus](../roles/auditor-compliance-aus.md):

### Secret management
- **Never commit `.env` to git** — `.gitignore` enforces; pre-commit hook double-checks
- **Service_role key rotation:** quarterly via Supabase Settings → API → Reset
- **Claude API key rotation:** quarterly via console.anthropic.com
- **TLS keys:** auto-managed by certbot, rotated every 60 days
- **SSH:** key-based only, root disabled, fail2ban watching

### Audit log
- Every Supabase write by CEO daemon → `audit_log` table row with: actor='ceo', action, table, row_id, before, after, reasoning, ts
- Allan can review at any time
- Privacy-sensitive operations (write to contacts/credentials) require explicit Slack approval before commit (CEO daemon prompts)

### Backup
- Supabase auto-backups daily (Supabase managed)
- VPS state backup: weekly tar + push to S3 or Backblaze B2 (~$1/mo for 10GB)
- Code backed up via git push (origin = Excluding1/timeless-theme-wp)

### Webhook signature verification
- Stripe webhooks: verify `Stripe-Signature` header against `STRIPE_WEBHOOK_SECRET`
- GHL webhooks: verify HMAC if GHL provides; otherwise use IP allowlist
- Slack: verify `X-Slack-Signature` against `SLACK_SIGNING_SECRET`

---

## 9. Cost summary

| Item | Cost AUD/mo |
|---|---|
| DigitalOcean SYD1 droplet ($6 USD) | ~$9 |
| Claude API (estimated usage) | $5-15 |
| Domain (already paid via Cloudflare) | $0 marginal |
| Backblaze B2 backup (~10GB) | ~$1 |
| Sentry error tracking (free tier) | $0 |
| Slack workspace (free tier) | $0 |
| Let's Encrypt TLS | $0 |
| **Total** | **$15-25/mo** |

Compared to Cloud Function ($0-5/mo) — **+$10-20/mo for 24/7 reactive CEO + future-proof architecture.**

---

## 10. Build sequence (sprints)

### Sprint 1 (Week 1): Provision + skeleton CEO daemon
- Buy DigitalOcean droplet
- Run § 5.1-5.7 deployment recipe
- Deploy skeleton `main.py` with /health endpoint + basic Slack post on 5am
- **Deliverable:** Allan wakes up to a Slack message at 5am Sydney saying "CEO online, X tasks pending, $Y cash"

### Sprint 2 (Week 2): Webhook receivers
- Implement /webhook/slack for slash commands
- `/ceo brief`, `/ceo cash`, `/ceo task add` working
- **Deliverable:** Allan can trigger CEO actions from Slack instantly

### Sprint 3 (Week 3): Anomaly detection loop
- 5min poll Supabase for: cash <$1,200 floor, NPS detractor, sub no-accept >2hr
- Alert routing to right Slack channels
- **Deliverable:** CEO catches problems before Allan does

### Sprint 4 (Week 4): Weekly review automation
- Friday 5pm: pull last week's data, generate 5 actionable insights via Claude API
- Post to `#weekly-numbers` for Allan + Marko review
- **Deliverable:** weekly review prep done before Allan opens dashboard

### Sprint 5 (Month 2): GHL + Stripe webhook integration (when Phase 1 live)
- /webhook/ghl handles form submit, stage move events
- /webhook/stripe handles payment received, fail
- Auto-update dashboard finances + KPIs in real-time
- **Deliverable:** dashboard data is live, not stale

### Sprint 6+ (Month 3+): Multi-agent orchestration
- Sub-agents for specialised audits triggered by CEO daemon
- Pricing audit re-run quarterly automatically
- Competitive intelligence weekly scan automatic
- Maintenance reminder cycle weekly automatic

---

## 11. Cross-references

- [docs/specs/dashboard-integration-plan.md](dashboard-integration-plan.md) — supersedes L1+L2 plan with this VPS architecture
- [docs/specs/ai-employees/](ai-employees/) — AI employees that run on this VPS
- [docs/CEO.md § 24/7 monitoring infrastructure](../CEO.md) — original outline; this doc is the implementation
- [docs/CEO.md § Founder draw policy](../CEO.md) — monthly close logic the CEO daemon executes
- [data/research/nsw-bathroom-trade-tam-2026-05-01.md](../../data/research/nsw-bathroom-trade-tam-2026-05-01.md) — TAM research grounding the goals CEO monitors
- [docs/QUESTIONS.md](../QUESTIONS.md) — Q19 (Supabase access ✅) + Q21 NEW (DigitalOcean account + service_role key rotation timing)

---

## 12. What Allan needs to do (next 7 days)

To go from zero to "CEO online":

1. **Sign up DigitalOcean** ([digitalocean.com](https://digitalocean.com)) — 10min, free credit at signup
2. **Decide hostname:** `ceo.timelessresurfacing.com.au` ✅ recommended
3. **Sign up Slack workspace** if not done — create channels per [ghl-pipeline-13-stage.md § Slack](ghl-pipeline-13-stage.md)
4. **Get Claude API key** at [console.anthropic.com](https://console.anthropic.com) — set $20 monthly cap
5. **Provision droplet** per § 5.1
6. **Tell me when droplet is up + DNS pointed** — I'll write the daemon code + deploy it
7. **Plan service_role key rotation** for ~Day 14 (after CEO daemon stable, rotate the key that was shared in chat)

Total Allan time: ~30min spread over week. Total my time (write daemon code): ~4-6hr deep work in next session.

After that: CEO is live 24/7. You stop telling me what to check; CEO tells you what's happening.
