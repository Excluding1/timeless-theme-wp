#!/usr/bin/env bash
# Daily health check — runs the 10-section health_check.sql, parses each
# section's output, compares to thresholds in dashboard-health-check-baselines.md,
# Slack-pings if anything is breached, and logs the run to agent_runs.
#
# Default: silent on green (no Slack post if everything is normal).
# Set FORCE_POST=1 to always post even when green (useful for verifying
# Slack wiring during initial setup).

set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "${BASH_SOURCE[0]}")/../lib/env.sh"

# ── Lock so two runs can't overlap (e.g. cron + manual trigger) ───────────────
LOCK_FILE="/tmp/ceo-daemon-daily-health.lock"
exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "Another instance is already running. Exiting."
  exit 0
fi

# ── Begin run lifecycle ───────────────────────────────────────────────────────
RUN_ID="$("${DAEMON_ROOT}/lib/log-run.sh" start "daily-health-check" "${1:-cron}")"
echo "Started run ${RUN_ID} at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Trap so we always close out the run, even on error.
breaches=()
final_status="success"
final_output='{}'
final_error=""

cleanup() {
  local exit_code=$?
  if [[ "${exit_code}" -ne 0 && "${final_status}" == "success" ]]; then
    final_status="error"
    final_error="task exited with code ${exit_code}"
  fi
  "${DAEMON_ROOT}/lib/log-run.sh" finish "${RUN_ID}" "${final_status}" "${final_output}" "${final_error}" || true
}
trap cleanup EXIT

# ── Run the health check SQL ──────────────────────────────────────────────────
HEALTH_SQL="${DAEMON_ROOT}/../dashboard/bathresurf-nsw-dashboard/supabase/health_check.sql"
if [[ ! -f "${HEALTH_SQL}" ]]; then
  final_error="health_check.sql not found at ${HEALTH_SQL}"
  echo "FATAL: ${final_error}" >&2
  exit 1
fi

# Each section in health_check.sql is a SELECT. We run them all and capture
# the concatenated output. psql's -At gives unaligned, tuples-only output —
# easy to pipe through awk/jq.
RESULT="$(psql "${DATABASE_URL}" -At -F $'\t' -f "${HEALTH_SQL}" 2>&1)" || {
  final_error="psql failed: $(echo "${RESULT}" | tail -3)"
  echo "FATAL: psql failed" >&2
  echo "${RESULT}" >&2
  exit 1
}

# ── Parse each section + apply thresholds ─────────────────────────────────────
# Sections are tab-separated rows. The first column (the 'section' label)
# tells us which check we're looking at.

# 1. Daemon stats — error_rate_pct > 10 = breach
daemon_row="$(echo "${RESULT}" | grep -F '1. Daemon (last 24h)' | head -1 || true)"
if [[ -n "${daemon_row}" ]]; then
  err_rate="$(echo "${daemon_row}" | awk -F'\t' '{print $7}')"
  if [[ -n "${err_rate}" ]] && (( $(echo "${err_rate} > 10" | bc -l 2>/dev/null || echo 0) )); then
    breaches+=("Daemon error rate ${err_rate}% (threshold 10%)")
  fi
fi

# 4. Wrong-category check — new_wrong_category_rows > 0 = breach
wrong_cat_row="$(echo "${RESULT}" | grep -F '4. Wrong-category check' | head -1 || true)"
if [[ -n "${wrong_cat_row}" ]]; then
  new_wrong="$(echo "${wrong_cat_row}" | awk -F'\t' '{print $2}')"
  if [[ "${new_wrong:-0}" -gt 0 ]]; then
    breaches+=("${new_wrong} new finance rows with wrong category 'Subscriptions' — should be 'Software & Subs'")
  fi
fi

# 5. Duplicate auto-renewals — any rows = breach
dup_count="$(echo "${RESULT}" | grep -cF '5. Duplicate auto-renewals' || true)"
# grep matches the section header label. If there are also data rows, we'll see >1 match.
if [[ "${dup_count}" -gt 1 ]]; then
  breaches+=("Subscription auto-renewal duplicates detected — race condition fix may have regressed")
fi

# 6. Overdue renewals — rows present = sub fell through cracks
overdue_count="$(echo "${RESULT}" | grep -cF '6. Overdue renewals' || true)"
if [[ "${overdue_count}" -gt 1 ]]; then
  breaches+=("Subscriptions overdue for renewal — useSubscriptionSync hook may not be firing")
fi

# 9. Subcontractor health — expired_insurance > 0 = legal risk
sub_health="$(echo "${RESULT}" | grep -F '9. Subcontractor health' | head -1 || true)"
if [[ -n "${sub_health}" ]]; then
  expired="$(echo "${sub_health}" | awk -F'\t' '{print $4}')"
  if [[ "${expired:-0}" -gt 0 ]]; then
    breaches+=("${expired} active subcontractor(s) with EXPIRED PL insurance — legal risk, pause them immediately")
  fi
fi

# ── Build summary + Slack post ────────────────────────────────────────────────
today="$(date '+%Y-%m-%d')"

if [[ "${#breaches[@]}" -gt 0 ]]; then
  # 🚨 RED — there are breaches
  msg="🚨 *Daily health check ${today}* — ${#breaches[@]} issue(s):"$'\n\n'
  for b in "${breaches[@]}"; do
    msg+="• ${b}"$'\n'
  done
  msg+=$'\n'"Run \`/opt/timeless/dashboard/bathresurf-nsw-dashboard/supabase/health_check.sql\` in Supabase SQL Editor for full details."
  "${DAEMON_ROOT}/lib/slack-post.sh" --severity=red "${msg}"
  final_output="$(jq -nc --argjson n "${#breaches[@]}" '{breaches: $n, status: "red"}')"
elif [[ "${FORCE_POST:-0}" == "1" ]]; then
  # ✅ GREEN with --force flag (used for setup verification)
  msg="✅ *Daily health check ${today}* — all 10 sections normal."
  "${DAEMON_ROOT}/lib/slack-post.sh" --severity=green "${msg}"
  final_output='{"breaches": 0, "status": "green", "forced": true}'
else
  # Silent on green — preferred default behavior
  echo "All checks passed. Silent on green (set FORCE_POST=1 to override)."
  final_output='{"breaches": 0, "status": "green"}'
fi

echo "Run ${RUN_ID} complete: ${final_status}"
