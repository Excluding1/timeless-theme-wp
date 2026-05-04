# Partnership Protocol Snapshots

This folder is the **github-durable mirror** of the dual co-CEO partnership between Clifford (Claude/Anthropic) and Cleo (Codex/OpenAI). Established 2026-05-04 by Allan.

## Files

### Core protocol
| File | Canonical | Purpose |
|---|---|---|
| `PARTNERSHIP-PROTOCOL.md` | `~/.claude/projects/.../memory/partnership_clifford_cleo.md` | The dual-CEO collaboration patterns + sync architecture |
| `CLEO-PEER-PROTOCOL.md` | `~/codex-peer-workspace/PEER-PROTOCOL.md` | Cleo's orientation file (read on every codex invocation) |
| `MEMORY-INDEX.md` | `~/.claude/projects/.../memory/MEMORY.md` | Full memory file index — all locked decisions, feedback, plans, research |

### Plans + reviews
| File | Purpose |
|---|---|
| `plan_ghl_setup_draft_v2_2026-05-05.md` | **CANONICAL** GHL setup plan (supersedes v1). 14 corrections + Allan's CEO calls. |
| `cleo_peer_review_2026-05-04.md` | Cleo's first peer-review pass (partial — focused on GHL pricing + Slack) |
| `cleo_followup_review_2026-05-04.md` | Cleo's follow-up pass (stage verdicts + Cloudinary + ACMA + scale break points) |
| `cleo_form_audit_2026-05-05.md` | Cleo's 4-lens form audit (12 personas + UI/CSS + pricing + code quality) |
| `cleo_p0_review_2026-05-05.md` | Cleo's review of Clifford's P0 fix diff (approved with revisions) |

### Locked decisions
| File | Purpose |
|---|---|
| `feedback_form_is_intake_not_quoting.md` | **Locked rule (Allan 2026-05-05):** Form is intake, photos disambiguate, anti-slip default-on, no ACMA opt-ins, no consent versioning |

### Operational
| File | Purpose |
|---|---|
| `bug_codex_stdin_hang_2026-05-04.md` | Post-mortem on the codex stdin silent-hang bug + fixes (`<` /dev/null + cleo-run.sh harness + liveness watchdog) |
| `task_google_ads_pixel_setup_phase2.md` | Future task: wire Google Ads conversion pixel when Allan launches ads |
| `backlog_triage_2026-05-04.md` | Categorisation of the 90+ uncommitted master-repo files into 6 atomic commit buckets |
| `scripts/cleo-run.sh` | The Cleo invocation harness with stdin redirect + liveness watchdog + diagnostic bundle |

## Drift rule

These are SNAPSHOTS. Canonical files live OUTSIDE this repo (Claude Code session memory + symlink workspace + harness directory). When canonical updates, refresh by re-running the mirror copy commands.

If you're cloning this repo on a new machine and don't have the Claude Code session memory: these snapshots ARE the durable record. Use them as the starting point.

## How to use cleo-run.sh

Standalone: `chmod +x scripts/cleo-run.sh && ./scripts/cleo-run.sh "prompt here"`

It enforces:
1. stdin redirected to `/dev/null` (the bug fix that took 25 minutes to find)
2. stderr captured to log (no more silent failures)
3. Liveness watchdog: kill if no codex session file in 60s
4. Wall-clock timeout (default 600s)
5. Diagnostic bundle saved to `/tmp/cleo-runs/<run_id>/`

Read `bug_codex_stdin_hang_2026-05-04.md` first if confused about why all this exists.
