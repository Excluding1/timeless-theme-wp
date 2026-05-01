# Dashboard Health Check — How an Agent (or You) Reads the Data
**Date:** 2026-05-01
**Companion to:** `dashboard/bathresurf-nsw-dashboard/supabase/health_check.sql`

This is the "what does normal look like" doc. Run the SQL in Supabase → SQL Editor → paste → Run. It produces 10 labelled result tables. Compare what you see to the baselines below.

---

## How the daemon will use this (once live)

```
1. Daemon wakes at 7am Sydney time (cron).
2. Connects to Supabase via service-role key (env: SUPABASE_SERVICE_ROLE_KEY).
3. Runs health_check.sql.
4. Compares each section's numbers to the baselines below.
5. If any threshold breached → posts to Slack (#dashboard-alerts) + writes
   a row to agent_runs with status='success' or 'error'.
6. If all clean → silent (no Slack) but still writes the agent_run for record.
```

**You can run the same SQL manually any time** — it doesn't depend on the daemon. The daemon just automates the 7am check and the Slack page.

---

## Baselines per section

### 1. Daemon (last 24h)
| Metric | Normal | Investigate if |
|---|---|---|
| `total_runs` | 5–50 | 0 (daemon dead) or >200 (loop) |
| `error_rate_pct` | 0–5% | >10% |
| `total_cost_usd` | $0.50–$5 | >$10 (something's burning tokens) |
| `p95_seconds` | 5–60s | >120s (an agent's hanging) |
| `timeouts` | 0 | ≥1 |

### 2. Errored agents (last 24h)
| Metric | Normal | Investigate if |
|---|---|---|
| Number of rows | 0 | Any row appearing |
| Same agent name appearing 2+ days in a row | n/a | Always — that's a flaky agent |

### 3. Audit log (last 24h)
| Metric | Normal | Investigate if |
|---|---|---|
| Inserts/updates by daemon agents | A handful per agent per day | Spike (>100/day from one agent) |
| `deletes > 0` | Rare — deletes are mostly manual cleanup | Daemon-actor doing deletes (review reasoning) |
| `actor` you don't recognise | n/a | Anyone other than 'allan', 'marko', or known agent names |

### 4. Wrong-category check
| Metric | Normal | Investigate if |
|---|---|---|
| `new_wrong_category_rows` | **0** (always, post-2026-05-01) | ≥1 → bug regressed, ping me |
| `correct_category_total` | Grows steadily ($X/month) | Stops growing while subs are active |
| `legacy_wrong_total` | Whatever was there before the fix; constant | Increasing |

### 5. Duplicate auto-renewals
| Metric | Normal | Investigate if |
|---|---|---|
| Number of rows | **0 always** | ≥1 → race condition fix regressed |

### 6. Overdue renewals
| Metric | Normal | Investigate if |
|---|---|---|
| Number of rows | 0 once useSubscriptionSync runs | Same sub appearing 2+ days in a row → hook isn't catching |
| `days_overdue > 30` | Never | ≥1 → a sub fell through the cracks |

### 7. Finance pulse (last 7d)
| Metric | Normal | Investigate if |
|---|---|---|
| `revenue` | Depends on stage. Pre-launch: $0. Live: aim $10K+/wk by month 3. | Sudden drop to 0 if it was non-zero |
| `expenses` | Subs (~$200/wk) + ad spend + supplies | Spike >2x last week |
| `big_expense_count` | 0–3/wk | Spike (likely ads or one-time) — verify it's intentional |
| `net` | Negative early, positive once at scale | Suddenly more negative than usual |

### 8. Task health
| Metric | Normal | Investigate if |
|---|---|---|
| `overdue` | <5 | >10 (work piling up) |
| `urgent_open` | <2 sustained | >5 (true urgent or label inflation?) |
| `completed_7d` | Should match-ish your weekly throughput | 0 for several days = nobody's working |

### 9. Subcontractor health
| Metric | Normal | Investigate if |
|---|---|---|
| `expired_insurance` | **0** | ≥1 → sub working uninsured = legal risk, pause them |
| `insurance_expiring_30d` | Acceptable to have a few — gives you time to chase | >5 sustained |
| `no_insurance_on_file` for active subs | 0 | ≥1 (compliance gap) |
| `stale_prospects` | <10 | >20 (recruiting pipeline stalled) |

### 10. Notifications (last 24h)
| Metric | Normal | Investigate if |
|---|---|---|
| `total` | 1–10 | >50 (notification spam) or 0 for a week (nothing alerting) |
| `unread` (rolling) | Should trend down as Allan reads them | Monotonically growing = nobody reading |

---

## Until the daemon is live

You can run this manually whenever you want a pulse check. Two ways:

**Way 1 — Supabase SQL Editor**
1. Open Supabase → SQL Editor → New Query
2. Paste the contents of `health_check.sql`
3. Run → 10 result tables stack vertically
4. Eyeball them against the baselines above

**Way 2 — Save as a saved query**
1. In Supabase SQL Editor, after running once, click "Save"
2. Name it "Daily Health Check"
3. Pin it to the sidebar
4. Now it's one click any time

**Way 3 — Materialised view** (advanced; only if you want the dashboard to show health KPIs)
Wrap the SELECTs in a view, refresh hourly via pg_cron. I'd hold off on this until the daemon is firing.

---

## How the daemon agent will read + report

When live, the agent's logic looks roughly like:

```
1. SELECT * from each section above.
2. For each red threshold breached:
   - Build a Slack message: "⚠️ Health check 2026-05-02 — section 5 dup auto-renewals: 3 rows"
   - Include the row data so you can act without logging in.
3. If any breach is severity=high:
   - Also write an audit_log entry with reasoning="health_check_alert"
4. Always:
   - Write the run to agent_runs (status, cost, duration)
   - Append events to agent_activity_events (one per section)
5. If all green:
   - One Slack: "✅ Daily health check 2026-05-02 — all sections normal"
   - (Or silent if you tell me to be silent on green)
```

The Slack-on-green-vs-silent-on-green is a preference call. Default I'd suggest: **silent on green, page on red**. Daily green pings become noise that gets muted; red pings get attention precisely because they're rare.

---

## Cross-references
- [supabase/health_check.sql](../../dashboard/bathresurf-nsw-dashboard/supabase/health_check.sql) — the actual SQL
- [docs/specs/dashboard-bugfix-batch-2026-05-01.md](dashboard-bugfix-batch-2026-05-01.md) — the bugs sections 4 & 5 are checking didn't regress
- [docs/specs/persistent-ceo-vps-deployment.md](persistent-ceo-vps-deployment.md) — where the daemon will run from
