#!/usr/bin/env bash
# cleo-run.sh — diagnostic-aware wrapper for invoking Cleo (codex CLI)
#
# Why this exists:
# On 2026-05-04, three consecutive Cleo invocations hung silently for up to 25min.
# Root cause: when bash launches codex in a non-interactive background task,
# stdin is connected to a unix socket (not /dev/null, not a TTY). Codex's --help
# documents: "If stdin is piped and a prompt is also provided, stdin is appended
# as a <stdin> block." Codex blocks waiting for stdin EOF that never comes.
#
# This wrapper enforces:
# 1. ALWAYS `< /dev/null` (the actual bug fix)
# 2. STDOUT to file, STDERR to file (so we capture diagnostics on hang)
# 3. Liveness probe: kill if no session file in ~/.codex/sessions/ within 60s
# 4. Timeout: kill if not done within $CLEO_TIMEOUT_SEC (default 600s = 10min)
# 5. Diagnostic bundle on exit (success or failure) → /tmp/cleo-runs/<id>/
#
# Usage:
#   ./cleo-run.sh "prompt text"
#   ./cleo-run.sh --prompt-file /path/to/prompt.txt
#   ./cleo-run.sh --model gpt-5.5 --reasoning medium "prompt text"
#
# Env vars:
#   CLEO_TIMEOUT_SEC      max wall-clock for codex (default 600)
#   CLEO_LIVENESS_SEC     max wait for session file before declaring hang (default 60)
#   CLEO_LOG_DIR          where to write run bundles (default /tmp/cleo-runs)
#   CLEO_WORKSPACE        codex working dir (default ~/codex-peer-workspace)

set -uo pipefail

# Defaults
TIMEOUT_SEC="${CLEO_TIMEOUT_SEC:-600}"
LIVENESS_SEC="${CLEO_LIVENESS_SEC:-60}"
LOG_DIR="${CLEO_LOG_DIR:-/tmp/cleo-runs}"
WORKSPACE="${CLEO_WORKSPACE:-$HOME/codex-peer-workspace}"
MODEL=""
REASONING=""
SANDBOX=""
PROMPT=""
PROMPT_FILE=""

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --model) MODEL="$2"; shift 2 ;;
    --reasoning) REASONING="$2"; shift 2 ;;
    --sandbox) SANDBOX="$2"; shift 2 ;;
    --prompt-file) PROMPT_FILE="$2"; shift 2 ;;
    --help|-h)
      sed -n '/^# Usage:/,/^$/p' "$0" | sed 's/^# //'
      exit 0 ;;
    *)
      if [[ -z "$PROMPT" ]]; then PROMPT="$1"; else PROMPT="$PROMPT $1"; fi
      shift ;;
  esac
done

# Resolve prompt
if [[ -n "$PROMPT_FILE" ]]; then
  if [[ ! -f "$PROMPT_FILE" ]]; then
    echo "ERROR: prompt file not found: $PROMPT_FILE" >&2
    exit 2
  fi
  PROMPT=$(cat "$PROMPT_FILE")
fi
if [[ -z "$PROMPT" ]]; then
  echo "ERROR: no prompt (provide as arg or --prompt-file)" >&2
  exit 2
fi

# Run id + bundle dir
RUN_ID="$(date +%Y%m%dT%H%M%S)-$$"
BUNDLE="$LOG_DIR/$RUN_ID"
mkdir -p "$BUNDLE"

STDOUT_FILE="$BUNDLE/stdout.log"
STDERR_FILE="$BUNDLE/stderr.log"
META_FILE="$BUNDLE/meta.json"
PROMPT_FILE_OUT="$BUNDLE/prompt.txt"
DIAG_FILE="$BUNDLE/diagnostic.log"

# Save inputs
printf "%s" "$PROMPT" > "$PROMPT_FILE_OUT"

cat > "$META_FILE" <<META
{
  "run_id": "$RUN_ID",
  "started_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "workspace": "$WORKSPACE",
  "model": "${MODEL:-default}",
  "reasoning": "${REASONING:-default}",
  "sandbox": "${SANDBOX:-default}",
  "timeout_sec": $TIMEOUT_SEC,
  "liveness_sec": $LIVENESS_SEC,
  "prompt_bytes": $(wc -c < "$PROMPT_FILE_OUT"),
  "skill_codex_version": "$(codex --version 2>/dev/null | head -1)"
}
META

# Build flags
FLAGS=(--skip-git-repo-check)
[[ -n "$MODEL" ]] && FLAGS+=(-m "$MODEL")
[[ -n "$REASONING" ]] && FLAGS+=(--config "model_reasoning_effort=\"$REASONING\"")
[[ -n "$SANDBOX" ]] && FLAGS+=(--sandbox "$SANDBOX")

# Snapshot of session files BEFORE start (so we can detect new ones)
# BUGFIX 2026-05-04: ls -1 -R only shows top-level dir contents, not the actual files. Use find.
find "$HOME/.codex/sessions/" -name "rollout-*.jsonl" -type f 2>/dev/null | sort > "$BUNDLE/sessions-before.txt" || true

echo "[$(date +%H:%M:%S)] Cleo run $RUN_ID starting" | tee -a "$DIAG_FILE"
echo "  workspace: $WORKSPACE" | tee -a "$DIAG_FILE"
echo "  timeout: ${TIMEOUT_SEC}s, liveness check: ${LIVENESS_SEC}s" | tee -a "$DIAG_FILE"
echo "  bundle: $BUNDLE" | tee -a "$DIAG_FILE"
echo "  flags: ${FLAGS[*]}" | tee -a "$DIAG_FILE"

# Launch codex with stdin from /dev/null (THE BUG FIX)
cd "$WORKSPACE" || { echo "ERROR: workspace not found" | tee -a "$DIAG_FILE"; exit 3; }

codex exec "${FLAGS[@]}" "$PROMPT" \
  < /dev/null \
  > "$STDOUT_FILE" \
  2> "$STDERR_FILE" &
CODEX_PID=$!
echo "  codex pid: $CODEX_PID" | tee -a "$DIAG_FILE"

# Liveness watchdog: must see a new session file within LIVENESS_SEC, else KILL
LIVE=0
LIVENESS_DEADLINE=$(($(date +%s) + LIVENESS_SEC))
while [[ $(date +%s) -lt $LIVENESS_DEADLINE ]]; do
  if ! kill -0 $CODEX_PID 2>/dev/null; then
    LIVE=2  # process exited before liveness check completed (could be normal fast finish, could be error)
    break
  fi
  # Check for new session file
  # BUGFIX 2026-05-04: Use find for recursive descent
  find "$HOME/.codex/sessions/" -name "rollout-*.jsonl" -type f 2>/dev/null | sort > "$BUNDLE/sessions-now.txt" || true
  NEW_SESSIONS=$(comm -13 "$BUNDLE/sessions-before.txt" "$BUNDLE/sessions-now.txt" 2>/dev/null | head -1)
  if [[ -n "$NEW_SESSIONS" ]]; then
    LIVE=1
    echo "[$(date +%H:%M:%S)] LIVENESS OK — new session: $NEW_SESSIONS" | tee -a "$DIAG_FILE"
    break
  fi
  sleep 5
done

if [[ $LIVE -eq 0 ]]; then
  # Hung — no session file appeared within liveness window
  echo "[$(date +%H:%M:%S)] LIVENESS FAIL — no codex session file in ${LIVENESS_SEC}s — KILLING" | tee -a "$DIAG_FILE"
  echo "Likely cause: stdin/auth/network. Check stderr.log + diagnostic.log" | tee -a "$DIAG_FILE"
  ps -ef | grep -E "codex" | grep -v grep | tee -a "$DIAG_FILE"
  lsof -nP -p $CODEX_PID 2>&1 | head -20 | tee -a "$DIAG_FILE"
  kill $CODEX_PID 2>/dev/null
  wait $CODEX_PID 2>/dev/null
  echo "[$(date +%H:%M:%S)] Killed. Bundle: $BUNDLE" | tee -a "$DIAG_FILE"
  echo ""
  echo "=== STDERR head (likely contains startup info / error) ==="
  head -40 "$STDERR_FILE"
  exit 10  # Liveness fail
fi

# Liveness OK — wait for completion or main timeout
TIMEOUT_DEADLINE=$(($(date +%s) + TIMEOUT_SEC))
PROGRESS_LAST_BYTES=0
PROGRESS_STALL_COUNT=0
while [[ $(date +%s) -lt $TIMEOUT_DEADLINE ]]; do
  if ! kill -0 $CODEX_PID 2>/dev/null; then
    break  # finished
  fi
  CURR_BYTES=$(wc -c < "$STDERR_FILE")
  ELAPSED=$(( $(date +%s) - $(stat -f %B "$BUNDLE/meta.json" 2>/dev/null || echo 0) ))
  if [[ $CURR_BYTES -eq $PROGRESS_LAST_BYTES ]]; then
    PROGRESS_STALL_COUNT=$((PROGRESS_STALL_COUNT + 1))
  else
    PROGRESS_STALL_COUNT=0
  fi
  PROGRESS_LAST_BYTES=$CURR_BYTES
  echo "[$(date +%H:%M:%S)] alive (stderr=${CURR_BYTES}B stall=${PROGRESS_STALL_COUNT})" >> "$DIAG_FILE"
  # Stall detector: if no stderr growth for 60s, something's stuck
  if [[ $PROGRESS_STALL_COUNT -ge 6 ]]; then  # 6 * 10s = 60s stall
    echo "[$(date +%H:%M:%S)] STALL DETECTED: no stderr growth in 60s. Continuing watch." >> "$DIAG_FILE"
  fi
  sleep 10
done

if kill -0 $CODEX_PID 2>/dev/null; then
  echo "[$(date +%H:%M:%S)] TIMEOUT after ${TIMEOUT_SEC}s — KILLING" | tee -a "$DIAG_FILE"
  kill $CODEX_PID 2>/dev/null
  wait $CODEX_PID 2>/dev/null
  EXIT=124  # timeout
else
  wait $CODEX_PID 2>/dev/null
  EXIT=$?
  echo "[$(date +%H:%M:%S)] codex exited with code $EXIT" | tee -a "$DIAG_FILE"
fi

# Final diagnostics
{
  echo "=== Final state ==="
  echo "Exit: $EXIT"
  echo "STDOUT bytes: $(wc -c < "$STDOUT_FILE")"
  echo "STDERR bytes: $(wc -c < "$STDERR_FILE")"
  echo "Wall time: $(( $(date +%s) - $(stat -f %B "$BUNDLE/meta.json" 2>/dev/null || echo 0) ))s"
} | tee -a "$DIAG_FILE"

# Summary
echo ""
echo "================ Cleo run $RUN_ID summary ================"
echo "Bundle: $BUNDLE"
echo "Exit code: $EXIT"
echo "STDOUT bytes: $(wc -c < "$STDOUT_FILE")"
if [[ -s "$STDOUT_FILE" ]]; then
  echo ""
  echo "=== Cleo response (stdout) ==="
  cat "$STDOUT_FILE"
fi
exit $EXIT
