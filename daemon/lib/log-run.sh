#!/usr/bin/env bash
# Wraps every task in an agent_runs lifecycle:
#   - On 'start': INSERT a row with status='running', echoes the run UUID.
#   - On 'finish': UPDATE the row with status='success'|'error', completed_at=now,
#                  optional output JSON.
#
# Usage:
#   run_id="$("$DAEMON_ROOT/lib/log-run.sh" start "daily-health-check" "cron")"
#   # ... task work ...
#   "$DAEMON_ROOT/lib/log-run.sh" finish "$run_id" success '{"sections":10}'
#   # OR on error:
#   "$DAEMON_ROOT/lib/log-run.sh" finish "$run_id" error '{}' "psql connection refused"

set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "${BASH_SOURCE[0]}")/env.sh"

action="${1:-}"
case "${action}" in
  start)
    agent_name="${2:?agent name required}"
    trigger="${3:-cron}"
    run_id="$(psql "${DATABASE_URL}" -At <<SQL
INSERT INTO agent_runs (agent_name, status, started_at, trigger_source)
VALUES ('${agent_name}', 'running', now(), '${trigger}')
RETURNING id;
SQL
)"
    if [[ -z "${run_id}" ]]; then
      echo "FATAL: failed to insert agent_runs row" >&2
      exit 1
    fi
    echo "${run_id}"
    ;;

  finish)
    run_id="${2:?run_id required}"
    status="${3:?status required (success|error|timeout|cancelled)}"
    output_json="${4:-{}}"
    error_msg="${5:-}"

    # Use psql parameter binding to avoid SQL injection from output_json or error_msg.
    psql "${DATABASE_URL}" \
      -v run_id="${run_id}" \
      -v status="${status}" \
      -v output_json="${output_json}" \
      -v error_msg="${error_msg}" \
      <<'SQL'
UPDATE agent_runs
SET status         = :'status',
    completed_at   = now(),
    output         = :'output_json'::jsonb,
    error_message  = NULLIF(:'error_msg', '')
WHERE id = :'run_id'::uuid;
SQL
    ;;

  *)
    echo "Usage: $0 {start <agent_name> [trigger]|finish <run_id> <status> [output_json] [error_msg]}" >&2
    exit 2
    ;;
esac
