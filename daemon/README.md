# CEO Daemon

A persistent autonomous agent running on a $5/mo Linode VPS that observes the
business via Supabase, posts daily health checks to Slack, and (in later phases)
takes routine actions on Allan's behalf with full audit trails.

## What it does (Phase 1, this commit)

- **Daily 7am Sydney health check** — runs `supabase/health_check.sql`,
  posts a summary to Slack with any threshold breaches.

That's the only task Phase 1 ships. Each future task (weekly review walk,
KPI rollup, anomaly alert, etc.) is a new `tasks/<name>.sh` script + a
matching `systemd/<name>.service` + `<name>.timer`. The infrastructure
scales to as many tasks as you want.

## What it does NOT do (yet)

- No AI / Claude API calls. Phase 1 is pure bash + SQL + Slack.
  Adding AI tasks is Phase 5+ and uses the `claude` CLI authenticated
  with your Max account.
- No writes to your dashboard data. Daily health check is read-only.
- No external integrations (SM8, Xero, GHL). Those come later.

## Architecture

```
daemon/
├── README.md                   # This file
├── setup.sh                    # One-shot VPS bootstrap (run once as root)
├── .env.example                # Template — you copy to .env and fill in secrets
├── lib/
│   ├── env.sh                  # Loads .env safely
│   ├── log-run.sh              # Inserts agent_runs row + updates on completion
│   └── slack-post.sh           # POSTs to Slack webhook (silent on green by default)
├── tasks/
│   └── daily-health-check.sh   # The one task in Phase 1
└── systemd/
    ├── daily-health-check.service
    └── daily-health-check.timer
```

**Authority tier (per the master spec):** every task in Phase 1 is **Tier 1**
(read-only, no writes). Future tasks may be Tier 2 (writes that get logged
to `audit_log`) or Tier 3 (irreversible — propose to Slack and wait for
your approval). Phase 1 doesn't exercise the higher tiers; the schema is
ready when we get there.

## Provisioning a fresh VPS

You do this **once**. About 10 minutes of clicking + 5 minutes of running
setup.sh.

### 1. Linode account + server

1. Sign up at [linode.com](https://www.linode.com) (Akamai-owned, Australian PSPF data residency, $5 USD signup credit usually applies).
2. Create Linode → **Nanode 1GB** plan ($5 USD/mo, 1 vCPU, 1GB RAM, 25GB SSD)
   - Region: **Sydney**
   - Image: **Ubuntu 24.04 LTS**
   - Label: `timeless-ceo-daemon`
   - Root password: generate a strong one, save to your password manager
3. Click "Create Linode". Wait ~30s for it to provision.
4. Copy the IP address.

### 2. Get your secrets ready

You'll paste these into setup.sh when it asks:

- **SUPABASE_URL** — from Supabase → Project Settings → API → "Project URL"
- **SUPABASE_SERVICE_ROLE_KEY** — same page → "service_role" secret (the
  scary one — bypasses RLS. NEVER commit it. Setup will write it to a
  600-permissioned env file).
- **SLACK_WEBHOOK_URL** — Slack → your workspace → Apps → search "Incoming
  Webhooks" → install → pick the channel (e.g. `#ceo-daemon`) → copy URL.

### 3. SSH in + run setup

```bash
# From your local machine:
ssh root@<your-linode-ip>

# Once you're on the box:
apt update && apt install -y git
git clone https://github.com/Excluding1/timeless-theme-wp.git /opt/timeless
cd /opt/timeless/daemon
bash setup.sh
```

The script will:
1. Update apt + install: `nodejs` (v20), `postgresql-client`, `jq`, `curl`, `ufw`, `fail2ban`
2. Create unprivileged user `ceo` (the daemon runs as this user)
3. Configure ufw (deny inbound except SSH)
4. Configure fail2ban (block SSH brute force)
5. Prompt you for the 3 secrets above + write `/opt/timeless/daemon/.env` (chmod 600)
6. Install + enable the systemd timer (daily 7am Sydney)
7. Run the health check ONCE so you can verify Slack receives the message

If everything works, you'll see ✅ in your Slack channel within 60 seconds of the script finishing.

### 4. After setup — what runs and when

| Task | Schedule | What it does |
|---|---|---|
| `daily-health-check` | 07:00 Sydney every day | Runs the 10-section SQL health check. Silent on green. Slack-pings if any threshold breached (high error rate, duplicate auto-renewals, expired sub insurance, etc.) |

To check status manually:
```bash
sudo systemctl list-timers daily-health-check.timer
sudo journalctl -u daily-health-check.service --since today
```

To trigger immediately for testing:
```bash
sudo systemctl start daily-health-check.service
```

## Adding a new task (future phases)

1. Write the script: `tasks/<name>.sh` — read env via `lib/env.sh`,
   call `lib/log-run.sh start <name>` at top + `lib/log-run.sh finish <run_id>`
   at bottom, do whatever the task does.
2. Add systemd unit: `systemd/<name>.service` (runs the script as ceo user)
   + `systemd/<name>.timer` (when to fire).
3. Re-run `bash setup.sh --reload` to install + enable the new units.

## Costs

| Item | Monthly | Annual |
|---|---|---|
| Linode Nanode 1GB | ~$7.50 AUD | ~$90 AUD |
| Anthropic API safety budget (Phase 5+ AI tasks) | $5-15 USD | $60-180 USD |
| **Phase 1 total** | **~$7.50 AUD** | **~$90 AUD** |

## Security

- Daemon runs as unprivileged `ceo` user. Cannot escalate.
- Env file is `chmod 600` owned by `ceo`. Even root reading it leaves a trail.
- No inbound ports except SSH (and SSH is fail2ban'd).
- Service-role Supabase key is sensitive but ALL daemon writes (when we add them in later phases) get logged to `audit_log` with reasoning. You can grep `audit_log` for anything suspicious.
- Backups: nightly `pg_dump` to Backblaze B2 will be added in Phase 6.

## Troubleshooting

**"setup.sh exited with error 'PostgreSQL connection failed'":**
Verify SUPABASE_URL is correct (should be `https://<project>.supabase.co`)
and the service role key is the long `eyJ...` JWT, not the anon key.

**"Slack post never arrived":**
Test the webhook directly:
```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"daemon test"}' \
  $SLACK_WEBHOOK_URL
```
If that doesn't show in Slack, regenerate the webhook URL in Slack admin.

**"Timer fires but task fails":**
Check logs:
```bash
sudo journalctl -u daily-health-check.service -n 100
```
Common causes: env file missing, psql not in PATH, disk full.
