-- ============================================================================
-- Timeless Resurfacing — Goals + Weekly Review starter content
-- Run in Supabase SQL Editor (bypasses RLS).
-- Safe to re-run: each insert checks for existence first.
-- ============================================================================

-- ── Goals ───────────────────────────────────────────────────────────────────
-- Modeled on Jordan Schofield's Surface Care numbers: a $2M/yr operator
-- targets ~13.7% form-fill, 72.3% quote-sent, 28.2% close. We size targets
-- conservatively for first 90 days, then ramp.

INSERT INTO goals (metric_name, target_value, current_value, unit, period, lower_is_better, deadline, notes)
SELECT * FROM (VALUES
  -- Money
  ('Monthly revenue', 5000, 0, '$', 'monthly', false, NULL::date,
   'Month 1: $5k. Bump to $15k by month 3, $30k+ by month 6 once Marko has subs trained.'),

  ('Avg job value', 1100, 0, '$', 'monthly', false, NULL::date,
   'Industry benchmark: $1,000-$1,500 per shower regrout, $700-$1,200 bath resurface. Track to ensure mix is healthy.'),

  ('Quote-to-booking conversion %', 28, 0, '%', 'monthly', false, NULL::date,
   'Jordan does 28.2%. Below 20% = price too high or quote messaging weak. Above 35% = leaving money on table (under-priced).'),

  ('Cost per lead (CPL)', 80, 0, '$', 'monthly', true, NULL::date,
   'Lower is better. Google Ads target: <$80 CPL. Meta: <$45. Anything above = pause + refine targeting.'),

  ('Cost per booked job (CPBJ)', 280, 0, '$', 'monthly', true, NULL::date,
   'Lower is better. CPL ÷ conversion %. At 28% close + $80 CPL → $285 CPBJ. Target <$300.'),

  ('POAS (profit on ad spend)', 4, 0, '$', 'monthly', false, NULL::date,
   '$ profit per $1 ad spend. Target 4:1 minimum. Below 2:1 = unprofitable acquisition.'),

  -- Operations
  ('Active subcontractors', 5, 0, '#', 'monthly', false, NULL::date,
   'Want at least 5 trained + insured subs by month 3 — covers North/East/West/South Sydney + 1 specialist.'),

  ('Avg NPS score', 9, 0, '#', 'monthly', false, NULL::date,
   '0-10 scale. Below 8 = service quality issue. Below 7 = stop using that sub until retrained.'),

  ('Job callback rate %', 5, 0, '%', 'monthly', true, NULL::date,
   'Lower is better. % of jobs that needed a return visit for rework. Target <5%. Above 10% = sub or process issue.'),

  -- Annual
  ('Year 1 revenue', 250000, 0, '$', 'annual', false, NULL::date,
   'Stretch goal year 1. Modest if month 6 hits $30k/mo and stays steady.')
) AS new_goals(metric_name, target_value, current_value, unit, period, lower_is_better, deadline, notes)
WHERE NOT EXISTS (
  SELECT 1 FROM goals g WHERE g.metric_name = new_goals.metric_name
);


-- ── Weekly Review Items ─────────────────────────────────────────────────────
-- Inspired by Jordan's operating cadence: every Monday morning, walk this
-- list to spot leaks before they compound. Each item is something a co-CEO
-- can verify in <60 seconds.

INSERT INTO weekly_review_items (text, sort_order, is_active)
SELECT * FROM (VALUES
  -- Numbers
  ('Reviewed last week''s revenue vs target', 10, true),
  ('Checked CPL across Google + Meta — both under threshold?', 20, true),
  ('Reviewed POAS (profit on ad spend) — still ≥4:1?', 30, true),
  ('Logged this week''s KPI snapshot', 40, true),

  -- Pipeline
  ('Followed up every unsent quote (>2 days old)', 50, true),
  ('Followed up every sent-but-unaccepted quote (>5 days old)', 60, true),
  ('Reviewed pipeline conversion stage by stage', 70, true),

  -- Operations
  ('Reviewed all jobs completed last week — any rework needed?', 80, true),
  ('Read all NPS replies from last week — any below 8?', 90, true),
  ('Checked sub insurance expiries (anything within 30 days?)', 100, true),
  ('Confirmed every active sub has signed agreement on file', 110, true),

  -- Money
  ('Reconciled bank account in Xero (all transactions categorised)', 120, true),
  ('Updated cashflow buffer — still ≥1 month of operating expenses?', 130, true),
  ('Reviewed subscription costs — anything we''re not using?', 140, true),

  -- Comms
  ('Posted weekly numbers to #weekly-numbers Slack', 150, true),
  ('Replied to any customer email/SMS older than 24h', 160, true),

  -- Hygiene
  ('Backed up Supabase data (export latest CSV)', 170, true),
  ('Reviewed dashboard health check — all 10 sections green?', 180, true)
) AS new_items(text, sort_order, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM weekly_review_items w WHERE w.text = new_items.text
);

-- ============================================================================
-- Done. Verify with:
--   SELECT count(*) FROM goals;             -- should grow by 10 (or be 10 on fresh DB)
--   SELECT count(*) FROM weekly_review_items WHERE is_active; -- should grow by 18
-- ============================================================================
