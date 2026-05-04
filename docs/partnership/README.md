# Partnership Protocol Snapshots

This folder is the **github-durable mirror** of the dual co-CEO partnership between Clifford (Claude/Anthropic) and Cleo (Codex/OpenAI). Established 2026-05-04 by Allan.

## Files

### Core protocol
| File | Purpose |
|---|---|
| `PARTNERSHIP-PROTOCOL.md` | Dual-CEO collaboration patterns + sync architecture |
| `CLEO-PEER-PROTOCOL.md` | Cleo's orientation file (read on every codex invocation) |
| `MEMORY-INDEX.md` | Full memory file index |

### GHL setup spec
| File | Status | Purpose |
|---|---|---|
| `ghl_setup_spec_v2_2026-05-05.md` | **DRAFT v2 awaiting Allan sign-off** | The active spec. Incorporates Cleo's 12 findings + research agent's verified capabilities + Reddit/Jordan tips. After Allan sign-off → CANONICAL. |
| `ghl_setup_spec_2026-05-05.md` | DEPRECATED | v1 — Clifford-solo + overconfident. Kept for history. |
| `cleo_ghl_spec_review_2026-05-05.md` | Reference | Cleo's 12-finding peer-review that forced v2 |
| `ghl_starter_capabilities_verified_2026-05-05.md` | Reference | Research agent's verification of GHL Starter capabilities (replaces v1 §12 open questions) |

### Cleo's other peer-reviews
| File | Purpose |
|---|---|
| `cleo_peer_review_2026-05-04.md` | Pass 1 — partial (focused on GHL pricing + Slack non-native) |
| `cleo_followup_review_2026-05-04.md` | Pass 2 — comprehensive (stage verdicts, Cloudinary flow, ACMA Sender ID) |
| `cleo_form_audit_2026-05-05.md` | Pass 3 — 4-lens form audit (12 personas + UI + pricing + code quality) |
| `cleo_p0_review_2026-05-05.md` | Pass 4 — review of Clifford's P0 fix diff |

### Locked decisions + reminders
| File | Purpose |
|---|---|
| `feedback_form_is_intake_not_quoting.md` | Locked rule: form is intake, photos disambiguate, anti-slip default-on, no ACMA opt-ins |
| `task_google_ads_pixel_setup_phase2.md` | Future task: wire Google Ads conversion pixel when ads launch |

### Operational + post-mortems
| File | Purpose |
|---|---|
| `bug_codex_stdin_hang_2026-05-04.md` | Post-mortem on the codex stdin hang + harness fix |
| `backlog_triage_2026-05-04.md` | 90+ uncommitted master-repo files, 6 atomic commit buckets |
| `scripts/cleo-run.sh` | Cleo invocation harness (stdin redirect + liveness watchdog) |

### Earlier plans (reference, not active)
| File | Purpose |
|---|---|
| `plan_ghl_setup_draft_v2_2026-05-05.md` | Earlier higher-level plan; the GHL setup spec v2 is the executable detail. |

## Drift rule

These are SNAPSHOTS. Canonical files live OUTSIDE this repo (Claude Code session memory + symlink workspace + harness directory). When canonical updates, refresh by re-running mirror copy commands.
