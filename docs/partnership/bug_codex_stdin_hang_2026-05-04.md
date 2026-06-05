---
name: BUG — codex CLI silent hang when invoked from Bash background task
description: Cleo's first three invocations hung silently for up to 25 min. Root cause: codex CLI tries to read additional input from stdin when stdin is non-TTY non-EOF (a unix socket from Bash background task). Fix: always invoke codex with `< /dev/null` redirect. Permanent harness at scripts/cleo-run.sh enforces this.
type: bug-log
originSessionId: 2026-05-04-codex-integration
status: RESOLVED — fix verified, harness in place
severity: HIGH (blocked the peer-CEO partnership for ~40 min on day 1)
date_discovered: 2026-05-04
date_resolved: 2026-05-04
---

# BUG: codex CLI silent hang from Bash background task

## Symptom

Three consecutive Cleo (`codex exec`) invocations hung silently:

| Run | Flags | Prompt size | Elapsed before kill | Output bytes | Session file created |
|---|---|---|---|---|---|
| v1 | `-m gpt-5.5 --config model_reasoning_effort="high" --sandbox read-only --skip-git-repo-check -C path` | 25KB | 25 min | 0 | NO |
| v2 | same as v1 but reasoning="medium" | 5KB | 6 min | 0 | NO |
| v3 | minimal: `--skip-git-repo-check` only | 5KB | 2 min | 0 | NO |
| v4 (test) | minimal + `< /dev/null` | 5KB | started writing immediately | growing stderr | YES, in 5s |

In hung runs:
- Process alive, 0% CPU
- 0 bytes stdout
- 39 bytes stderr (just the initial "Reading additional input from stdin..." line)
- NO new session file in `~/.codex/sessions/2026/MM/DD/`
- `~/.codex/logs_2.sqlite-wal` mtime frozen
- No active TCP connection to OpenAI

## Why we couldn't see the bug initially

The skill `~/.claude/skills/codex/SKILL.md` documented appending `2>/dev/null` to suppress thinking tokens. We followed that. Result: every diagnostic signal was redirected to /dev/null. We had no way to tell hung from running.

## Root cause

Codex CLI's `--help` documents:
> "Initial instructions for the agent. If not provided as an argument (or if `-` is used), instructions are read from stdin. **If stdin is piped and a prompt is also provided, stdin is appended as a `<stdin>` block.**"

When Bash launches a command via `run_in_background: true` (Claude Code's Bash tool), the child process inherits a stdin that is **a unix-domain socket pair, not a TTY and not /dev/null**. Codex detects that stdin is "piped" (not a TTY), tries to read it to append as a `<stdin>` block, and **blocks forever waiting for EOF that never comes** (the socket is held open indefinitely by the parent).

Confirmed by inspecting open file descriptors of a hung process:
```
zsh 24447  0u  unix 0x30e764bfafe8923a -> 0xc72fe97f71e11cc9
```
That `unix 0x...` socket is the root of the hang.

## Fix

**Always redirect stdin from /dev/null when invoking codex non-interactively:**

```bash
codex exec [flags] "prompt" < /dev/null
```

`< /dev/null` gives codex an immediate EOF on stdin. Codex sees nothing to append, proceeds with just the positional argument prompt. Confirmed: same prompt + flags as v3, hung. Add `< /dev/null` → started writing within 5 seconds.

## Permanent enforcement

`/Users/excluding/codex-peer-workspace/scripts/cleo-run.sh` is the diagnostic harness for all Cleo invocations. It enforces:

1. **stdin redirected to /dev/null** (the actual bug fix)
2. **stderr captured to a log file** (so we can see errors, not /dev/null them away)
3. **stdout captured to a separate log file**
4. **Liveness watchdog**: kills the process if no new session file appears in `~/.codex/sessions/` within `CLEO_LIVENESS_SEC` (default 60s) — which is the unambiguous signal of a hang
5. **Wall-clock timeout**: kills at `CLEO_TIMEOUT_SEC` (default 600s)
6. **Diagnostic bundle**: writes meta.json + prompt.txt + stdout.log + stderr.log + diagnostic.log to `/tmp/cleo-runs/<run_id>/`
7. **Stall detector**: warns if stderr stops growing for 60s mid-run

Usage:
```bash
~/codex-peer-workspace/scripts/cleo-run.sh "prompt"
~/codex-peer-workspace/scripts/cleo-run.sh --prompt-file /path/to/prompt.txt
~/codex-peer-workspace/scripts/cleo-run.sh --model gpt-5.5 --reasoning medium "prompt"
```

Self-test verified 2026-05-04: PONG response in 11 seconds, exit 0.

## Detection signals (the right ones)

Going forward, the reliable distinguishers between "running" and "hung":

| Signal | What it means |
|---|---|
| New file in `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` within 60s of starting | **ALIVE** — codex made first API call |
| No file after 60s | **HUNG** — kill + diagnose |
| `~/.codex/logs_2.sqlite-wal` mtime advancing every few seconds | **ALIVE** — actively reasoning/processing |
| stderr growing | **ALIVE** — streaming reasoning summaries / progress |
| stdout still 0 bytes during run | **NORMAL** — codex writes stdout only at completion |

The harness automates all of these checks.

## Lesson for partnership protocol

This bug exposed three protocol gaps:
1. **`2>/dev/null` is dangerous for long-running tasks** — we lose error visibility. Capture stderr to file instead.
2. **`run_in_background: true` requires explicit stdin handling for ANY tool** — not just codex. Other CLIs (gemini, openai-python, anything reading from stdin by default) will hit the same trap.
3. **The auditor-webhook-integrity.md role file warned us** — line 4: "data goes to die silently if not designed carefully." We didn't apply our own auditor lens to OUR tooling. The dual-CEO partnership IS itself an integration that needs the auditor lens.

## Re-occurrence prevention

- All future Cleo invocations MUST go through `scripts/cleo-run.sh`
- PEER-PROTOCOL.md updated to mandate the harness
- This file (`bug_codex_stdin_hang_2026-05-04.md`) referenced in MEMORY.md so future Clifford reads it on session start
- If the harness self-test fails, halt and re-diagnose before any real work

## Follow-up bug B (introduced by harness, fixed same session)

The first version of `cleo-run.sh` had a liveness-check bug that **falsely killed a working Cleo at 60s**:

```bash
# WRONG (the bug)
ls -1 "$HOME/.codex/sessions/" -R 2>/dev/null | sort > "$BUNDLE/sessions-before.txt"
```

`ls -1 -R` of `~/.codex/sessions/` only emitted top-level dir contents (just "2026"), not the recursive subtree of files. So `comm -13` always found nothing new even when codex created a real session file. The harness then killed the process believing it was hung.

Symptoms:
- Cleo's session file `rollout-2026-05-04T23-45-02-019df33c-...jsonl` grew to 247KB
- Session log showed Cleo doing actual work — web searches to gohighlevel.com pricing, GHL marketplace docs, Slack integration query
- Harness still reported "LIVENESS FAIL — no codex session file in 60s — KILLING"
- Cleo killed mid-research

**Fix:**
```bash
# RIGHT
find "$HOME/.codex/sessions/" -name "rollout-*.jsonl" -type f 2>/dev/null | sort > "$BUNDLE/sessions-before.txt"
```

`find` recurses by default. The `-name "rollout-*.jsonl"` filter targets exactly the session files we care about. Same fix applied to the in-loop `sessions-now.txt` snapshot.

**Lesson:** Don't trust `ls -R` for programmatic use. Use `find` with explicit name patterns. `ls -R` is for human-readable directory listings, not parseable output.

**Also:** the killed Cleo session was preserved on disk (codex doesn't delete session files on SIGTERM). Resumed via `codex exec --skip-git-repo-check resume --last` per SKILL.md, with stdin via stdin: `echo "continue" | codex exec resume --last`.

## Bonus discoveries from the diagnostic process

While debugging:
- `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` is the per-session transcript log. Useful for post-mortem.
- `~/.codex/logs_2.sqlite-wal` is the SQLite WAL — its mtime is a good liveness indicator.
- `models_cache.json` (199KB) — codex caches available models locally. Could inspect this for valid model names.
- `state_5.sqlite` — internal state. Don't touch.

— Clifford, 2026-05-04, post-bug post-mortem
