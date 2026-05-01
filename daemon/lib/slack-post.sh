#!/usr/bin/env bash
# Post a message to the Slack webhook configured in $SLACK_WEBHOOK_URL.
#
# Usage from another script:
#   source "$(dirname "$0")/../lib/env.sh"
#   "$DAEMON_ROOT/lib/slack-post.sh" "Daily health check ✅"
#   "$DAEMON_ROOT/lib/slack-post.sh" --severity=red "🚨 ${count} duplicate auto-renewals detected"
#
# Severity flag controls emoji prefix and (eventually) which channel.
# For Phase 1 it's just metadata in the agent_runs row.

set -euo pipefail

severity="green"
if [[ "${1:-}" == --severity=* ]]; then
  severity="${1#--severity=}"
  shift
fi

msg="${1:-}"
if [[ -z "${msg}" ]]; then
  echo "Usage: $0 [--severity=green|amber|red] <message>" >&2
  exit 2
fi

# Slack uses application/json. jq builds the payload safely (no shell injection
# from a message containing quotes or backticks).
payload="$(jq -nc --arg text "${msg}" '{text: $text}')"

http_code="$(curl -sS -o /dev/null -w '%{http_code}' \
  -X POST \
  -H 'Content-Type: application/json' \
  --data "${payload}" \
  "${SLACK_WEBHOOK_URL}")"

if [[ "${http_code}" != "200" ]]; then
  echo "WARN: Slack post returned HTTP ${http_code}" >&2
  exit 1
fi

# Echo the severity for callers that want to log it
echo "${severity}"
