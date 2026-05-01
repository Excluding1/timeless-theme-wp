-- ============================================================================
-- TimelessDash Daily Health Check
-- ============================================================================
-- Run this in Supabase SQL Editor any time you want to see the dashboard's
-- pulse, OR have the daemon run it daily and page you if numbers drift.
--
-- Each section produces ONE labeled result table. Read top-to-bottom.
-- ============================================================================

-- ── 1. Daemon — agent runs in the last 24 hours ─────────────────────────────
-- Tells you: did the daemon work? How many errors? What did it cost?
-- Threshold guidelines:
--   error_rate_pct > 10  → investigate
--   total_cost_usd > 10  → check what burned the tokens
--   p95_seconds > 120    → an agent is hanging
SELECT
  '1. Daemon (last 24h)' AS section,
  COUNT(*) AS total_runs,
  COUNT(*) FILTER (WHERE status = 'success') AS success,
  COUNT(*) FILTER (WHERE status = 'error') AS errors,
  COUNT(*) FILTER (WHERE status = 'timeout') AS timeouts,
  CASE WHEN COUNT(*) > 0
    THEN ROUND(100.0 * COUNT(*) FILTER (WHERE status IN ('error','timeout')) / COUNT(*), 1)
    ELSE 0 END AS error_rate_pct,
  ROUND(COALESCE(SUM(cost_usd), 0), 2) AS total_cost_usd,
  -- Cast EXTRACT(EPOCH FROM …) to numeric — Postgres has no ROUND(double precision, int) overload.
  ROUND(COALESCE(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))::numeric, 0), 1) AS avg_seconds,
  ROUND(COALESCE(
    (PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (completed_at - started_at))))::numeric,
    0), 1) AS p95_seconds
FROM agent_runs
WHERE started_at > now() - interval '24 hours';

-- ── 2. Daemon — error breakdown by agent ────────────────────────────────────
-- Which specific agents are failing? Helps pinpoint a flaky agent vs systemic issue.
SELECT
  '2. Errored agents (last 24h)' AS section,
  agent_name,
  COUNT(*) AS runs,
  COUNT(*) FILTER (WHERE status = 'error') AS errors,
  COUNT(*) FILTER (WHERE status = 'success') AS successes,
  STRING_AGG(DISTINCT error_message, ' | ' ORDER BY error_message) FILTER (WHERE status = 'error') AS sample_errors
FROM agent_runs
WHERE started_at > now() - interval '24 hours'
GROUP BY agent_name
HAVING COUNT(*) FILTER (WHERE status = 'error') > 0
ORDER BY errors DESC;

-- ── 3. Audit log — writes by actor in the last 24h ──────────────────────────
-- Tells you: who wrote what. Any deletes? Anything sneaky?
SELECT
  '3. Audit log (last 24h)' AS section,
  actor,
  table_name,
  COUNT(*) FILTER (WHERE action = 'insert') AS inserts,
  COUNT(*) FILTER (WHERE action = 'update') AS updates,
  COUNT(*) FILTER (WHERE action = 'delete') AS deletes
FROM audit_log
WHERE ts > now() - interval '24 hours'
GROUP BY actor, table_name
ORDER BY actor, table_name;

-- ── 4. Subscription-sync regression check ───────────────────────────────────
-- Confirms our fix held: NO new finance rows should be inserted with the OLD
-- wrong category 'Subscriptions'. If this is non-zero after 2026-05-01, the
-- bug regressed somehow.
SELECT
  '4. Wrong-category check' AS section,
  COUNT(*) FILTER (WHERE category = 'Subscriptions' AND created_at > '2026-05-01') AS new_wrong_category_rows,
  COUNT(*) FILTER (WHERE category = 'Software & Subs') AS correct_category_total,
  COUNT(*) FILTER (WHERE category = 'Subscriptions') AS legacy_wrong_total
FROM finances
WHERE type = 'expense';

-- ── 5. Subscription-sync duplicate detection ────────────────────────────────
-- Flags finance rows where the same sub auto-renewed twice on the same date.
-- The race-condition fix should make this empty. Anything here = bug regressed.
SELECT
  '5. Duplicate auto-renewals' AS section,
  date,
  description,
  COUNT(*) AS dup_count,
  ROUND(SUM(amount), 2) AS total_amount
FROM finances
WHERE type = 'expense'
  AND notes = 'Auto-logged by subscription sync'
GROUP BY date, description
HAVING COUNT(*) > 1
ORDER BY date DESC
LIMIT 20;

-- ── 6. Subscriptions overdue for renewal ────────────────────────────────────
-- Subs whose next_renewal is in the past — useSubscriptionSync should be
-- catching these. If this list grows, the hook isn't firing.
SELECT
  '6. Overdue renewals' AS section,
  name,
  category,
  status,
  cost,
  billing_cycle,
  next_renewal,
  (CURRENT_DATE - next_renewal) AS days_overdue
FROM subscriptions
WHERE status = 'active'
  AND billing_cycle != 'one-off'
  AND next_renewal < CURRENT_DATE
ORDER BY next_renewal ASC
LIMIT 20;

-- ── 7. Finance integrity — last 7 days ──────────────────────────────────────
-- High-level money pulse. Helps spot anomalies (single huge expense, no revenue).
SELECT
  '7. Finance pulse (last 7d)' AS section,
  ROUND(COALESCE(SUM(amount) FILTER (WHERE type = 'revenue'), 0), 2) AS revenue,
  ROUND(COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0), 2) AS expenses,
  ROUND(COALESCE(SUM(amount) FILTER (WHERE type = 'revenue'), 0)
        - COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0), 2) AS net,
  COUNT(*) FILTER (WHERE type = 'revenue') AS revenue_entries,
  COUNT(*) FILTER (WHERE type = 'expense') AS expense_entries,
  COUNT(*) FILTER (WHERE type = 'revenue' AND amount > 5000) AS big_revenue_count,
  COUNT(*) FILTER (WHERE type = 'expense' AND amount > 1000) AS big_expense_count
FROM finances
WHERE date >= CURRENT_DATE - 7;

-- ── 8. Task health ──────────────────────────────────────────────────────────
-- Are tasks getting worked? Are they piling up overdue?
SELECT
  '8. Task health' AS section,
  COUNT(*) FILTER (WHERE status != 'done') AS open_total,
  COUNT(*) FILTER (WHERE status != 'done' AND due_date < CURRENT_DATE) AS overdue,
  COUNT(*) FILTER (WHERE status != 'done' AND priority = 'urgent') AS urgent_open,
  COUNT(*) FILTER (WHERE status = 'done' AND completed_at > now() - interval '7 days') AS completed_7d,
  COUNT(*) FILTER (WHERE created_at > now() - interval '7 days') AS created_7d
FROM tasks;

-- ── 9. Subcontractor health ─────────────────────────────────────────────────
-- Insurance about to lapse, prospects stuck, low-quality subs.
SELECT
  '9. Subcontractor health' AS section,
  COUNT(*) FILTER (WHERE status = 'active') AS active_subs,
  COUNT(*) FILTER (WHERE status = 'active' AND pl_insurance_expiry IS NULL) AS no_insurance_on_file,
  COUNT(*) FILTER (WHERE status = 'active' AND pl_insurance_expiry < CURRENT_DATE) AS expired_insurance,
  COUNT(*) FILTER (WHERE status = 'active' AND pl_insurance_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + 30) AS insurance_expiring_30d,
  COUNT(*) FILTER (WHERE status = 'prospect' AND prospect_stage NOT IN ('not_interested') AND last_contacted < CURRENT_DATE - 14) AS stale_prospects
FROM subcontractors;

-- ── 10. Notification volume ─────────────────────────────────────────────────
-- Sanity check on notification system — ensures it's firing but not flooding.
SELECT
  '10. Notifications (last 24h)' AS section,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE read = false) AS unread,
  COUNT(*) FILTER (WHERE category = 'overdue_task') AS overdue_alerts,
  COUNT(*) FILTER (WHERE category = 'subscription_renewal') AS renewal_alerts,
  COUNT(*) FILTER (WHERE category = 'insurance_expiry') AS insurance_alerts
FROM notifications
WHERE created_at > now() - interval '24 hours';
