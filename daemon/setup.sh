#!/usr/bin/env bash
# CEO Daemon — one-shot bootstrap for a fresh Ubuntu 24.04 VPS.
# Run as root from inside the daemon/ directory of the cloned repo:
#
#   git clone https://github.com/Excluding1/timeless-theme-wp.git /opt/timeless
#   cd /opt/timeless/daemon
#   bash setup.sh
#
# Idempotent: safe to re-run if you tweak something. Won't double-create user,
# duplicate UFW rules, or re-prompt for env vars that are already set.

set -euo pipefail

# ── Sanity checks ─────────────────────────────────────────────────────────────
if [[ "${EUID}" -ne 0 ]]; then
  echo "FATAL: setup.sh must run as root (try: sudo bash setup.sh)" >&2
  exit 1
fi

if [[ ! -f /etc/os-release ]] || ! grep -q '^ID=ubuntu' /etc/os-release; then
  echo "WARN: This script targets Ubuntu 24.04. Continuing anyway..." >&2
fi

DAEMON_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${DAEMON_ROOT}/.." && pwd)"

echo "═══════════════════════════════════════════════════════════════"
echo "CEO Daemon setup"
echo "Repo:    ${REPO_ROOT}"
echo "Daemon:  ${DAEMON_ROOT}"
echo "═══════════════════════════════════════════════════════════════"
echo

# ── 1. Set timezone to Sydney ─────────────────────────────────────────────────
echo "[1/8] Setting timezone to Australia/Sydney..."
timedatectl set-timezone Australia/Sydney
echo "  → $(date)"

# ── 2. Install system packages ────────────────────────────────────────────────
echo "[2/8] Installing system packages (apt)..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq \
  curl \
  git \
  jq \
  postgresql-client \
  ufw \
  fail2ban \
  bc \
  ca-certificates >/dev/null
echo "  → installed"

# ── 3. Install Node 20 (for the future when AI tasks need claude CLI) ─────────
if ! command -v node >/dev/null 2>&1 || [[ "$(node --version)" != v20* ]]; then
  echo "[3/8] Installing Node 20 via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs >/dev/null
  echo "  → $(node --version)"
else
  echo "[3/8] Node 20 already installed — skipping."
fi

# ── 4. Create unprivileged ceo user ───────────────────────────────────────────
if ! id ceo >/dev/null 2>&1; then
  echo "[4/8] Creating unprivileged 'ceo' user..."
  useradd --system --create-home --shell /bin/bash --home-dir /home/ceo ceo
  echo "  → user 'ceo' created (uid=$(id -u ceo))"
else
  echo "[4/8] User 'ceo' already exists — skipping."
fi

# Make sure ceo can read the daemon directory
chown -R ceo:ceo "${REPO_ROOT}"

# ── 5. UFW firewall — deny inbound except SSH ─────────────────────────────────
echo "[5/8] Configuring UFW firewall..."
if ! ufw status | grep -q '^Status: active'; then
  ufw --force default deny incoming >/dev/null
  ufw --force default allow outgoing >/dev/null
  ufw --force allow 22/tcp >/dev/null
  ufw --force enable >/dev/null
  echo "  → UFW enabled (SSH allowed, all other inbound denied)"
else
  echo "  → UFW already active"
fi

# ── 6. fail2ban — block SSH brute force ───────────────────────────────────────
echo "[6/8] Enabling fail2ban (SSH brute force protection)..."
systemctl enable --now fail2ban >/dev/null 2>&1
echo "  → fail2ban running"

# ── 7. Prompt for + write .env ────────────────────────────────────────────────
ENV_FILE="${DAEMON_ROOT}/.env"
if [[ -f "${ENV_FILE}" ]] && grep -q 'SUPABASE_SERVICE_ROLE_KEY=eyJ' "${ENV_FILE}"; then
  echo "[7/8] .env already populated — skipping prompt."
else
  echo "[7/8] Prompting for secrets..."
  echo
  echo "Get these from:"
  echo "  - Supabase: Project Settings → API"
  echo "  - Slack:    Incoming Webhooks app"
  echo

  read -rp "SUPABASE_URL (https://<project>.supabase.co): " supabase_url
  read -rp "SUPABASE_SERVICE_ROLE_KEY (eyJ...): " supabase_key
  read -rp "DATABASE_URL (postgresql://postgres.xxx:yyy@...pooler.supabase.com:6543/postgres): " database_url
  read -rp "SLACK_WEBHOOK_URL (https://hooks.slack.com/services/T.../B.../...): " slack_url

  # Write the env file
  cat > "${ENV_FILE}" <<EOF
SUPABASE_URL=${supabase_url}
SUPABASE_SERVICE_ROLE_KEY=${supabase_key}
DATABASE_URL=${database_url}
SLACK_WEBHOOK_URL=${slack_url}
TZ=Australia/Sydney
DAEMON_NAME=ceo-daemon-v1
EOF

  chown ceo:ceo "${ENV_FILE}"
  chmod 600 "${ENV_FILE}"
  echo "  → wrote ${ENV_FILE} (chmod 600, owner=ceo)"
fi

# ── 8. Install systemd units + enable timers ──────────────────────────────────
echo "[8/8] Installing systemd units..."
for unit in "${DAEMON_ROOT}/systemd"/*.service "${DAEMON_ROOT}/systemd"/*.timer; do
  cp "${unit}" /etc/systemd/system/
  echo "  → /etc/systemd/system/$(basename "${unit}")"
done

systemctl daemon-reload

# Enable + start every timer in the systemd/ directory
for timer in "${DAEMON_ROOT}/systemd"/*.timer; do
  name="$(basename "${timer}")"
  systemctl enable --now "${name}" >/dev/null
  echo "  → enabled ${name}"
done

# Make scripts executable
chmod +x "${DAEMON_ROOT}/tasks"/*.sh "${DAEMON_ROOT}/lib"/*.sh

echo
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Setup complete."
echo "═══════════════════════════════════════════════════════════════"
echo
echo "Active timers:"
systemctl list-timers '*health*' '*ceo*' --no-pager 2>/dev/null | head -5 || true
echo
echo "Run the health check NOW (with FORCE_POST=1 to verify Slack works):"
echo "  sudo -u ceo FORCE_POST=1 ${DAEMON_ROOT}/tasks/daily-health-check.sh manual"
echo
echo "Tail logs:"
echo "  sudo journalctl -u daily-health-check.service --since today -f"
