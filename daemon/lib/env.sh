#!/usr/bin/env bash
# Sourced by every task. Loads .env safely (no eval injection)
# and validates required vars are set.

set -euo pipefail

# Find the daemon root regardless of how we were invoked.
# (tasks/*.sh sources this via $(dirname "$0")/../lib/env.sh)
DAEMON_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${DAEMON_ROOT}/.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "FATAL: ${ENV_FILE} not found. Copy .env.example to .env and fill it in." >&2
  exit 1
fi

# Load env file. Set -a auto-exports every var defined.
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

# Validate required vars
required=(SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY DATABASE_URL SLACK_WEBHOOK_URL)
for var in "${required[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "FATAL: required env var ${var} is unset (check ${ENV_FILE})" >&2
    exit 1
  fi
done

# Defaults for optional
export TZ="${TZ:-Australia/Sydney}"
export DAEMON_NAME="${DAEMON_NAME:-ceo-daemon-v1}"
export DAEMON_ROOT
