-- ============================================================================
-- BathResurf NSW Dashboard — Supabase Migration
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ============================================================================

-- Enable UUID extension (likely already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Finances ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  gst_included BOOLEAN NOT NULL DEFAULT FALSE,
  receipt_photos TEXT[] DEFAULT '{}',
  linked_job TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── KPI Snapshots ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_ending DATE NOT NULL,
  leads_total INTEGER NOT NULL DEFAULT 0,
  leads_google INTEGER NOT NULL DEFAULT 0,
  leads_meta INTEGER NOT NULL DEFAULT 0,
  leads_organic INTEGER NOT NULL DEFAULT 0,
  quotes_sent INTEGER NOT NULL DEFAULT 0,
  quotes_accepted INTEGER NOT NULL DEFAULT 0,
  jobs_completed INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  ad_spend_google NUMERIC(10,2) NOT NULL DEFAULT 0,
  ad_spend_meta NUMERIC(10,2) NOT NULL DEFAULT 0,
  ad_spend_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  avg_job_value NUMERIC(10,2),
  avg_profit_per_job NUMERIC(10,2),
  cpl NUMERIC(10,2),
  cpbj NUMERIC(10,2),
  conversion_rate NUMERIC(5,2),
  poas NUMERIC(8,2),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Subscriptions ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'trial')),
  cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'annually', 'one-off')),
  next_renewal DATE,
  auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
  managed_by TEXT,
  login_url TEXT,
  plan_name TEXT,
  notes TEXT,
  linked_credential_id UUID,
  price_changes JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Credentials ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  login_url TEXT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  two_fa_method TEXT,
  two_fa_notes TEXT,
  linked_subscription_id UUID,
  notes TEXT,
  last_password_update TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Tasks ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL DEFAULT 'shared' CHECK (visibility IN ('personal', 'shared')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  assigned_to TEXT,
  category TEXT,
  checklist JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  owner_id UUID REFERENCES auth.users(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Calendar Events ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL DEFAULT 'shared' CHECK (visibility IN ('personal', 'shared')),
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  is_all_day BOOLEAN NOT NULL DEFAULT FALSE,
  category TEXT,
  colour TEXT NOT NULL DEFAULT '#0D9488',
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Subcontractors ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subcontractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business_name TEXT,
  abn TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT,
  type TEXT NOT NULL DEFAULT 'regrout' CHECK (type IN ('regrout', 'resurface', 'dual', 'specialist')),
  tier TEXT NOT NULL DEFAULT 'tier_2' CHECK (tier IN ('tier_1', 'tier_2', 'tier_3')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'removed', 'prospect')),
  coverage_suburbs TEXT,
  skills TEXT[] DEFAULT '{}',
  pl_insurance_expiry DATE,
  agreement_signed BOOLEAN NOT NULL DEFAULT FALSE,
  agreement_date DATE,
  trial_job_status TEXT,
  trial_job_score NUMERIC(3,1),
  avg_nps NUMERIC(4,1),
  jobs_completed INTEGER NOT NULL DEFAULT 0,
  callback_rate NUMERIC(5,2),
  last_job_date DATE,
  prospect_stage TEXT CHECK (prospect_stage IS NULL OR prospect_stage IN ('new', 'contacted', 'interested', 'considering', 'not_interested')),
  last_contacted DATE,
  source TEXT,
  rejection_reason TEXT,
  notes TEXT,
  documents_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Contacts ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Goals ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  target_value NUMERIC(12,2) NOT NULL,
  current_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '#' CHECK (unit IN ('$', '%', '#')),
  period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly', 'quarterly', 'annual', 'all_time')),
  lower_is_better BOOLEAN NOT NULL DEFAULT FALSE,
  deadline DATE,
  notes TEXT,
  -- Pre-defined target progression. When current_value crosses target_value,
  -- system auto-advances target_value to the next rung in this array.
  -- Example: [5000, 10000, 20000, 50000, 100000] for Monthly revenue.
  targets_ladder JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add column to existing live DBs if they were created before this column existed
ALTER TABLE goals ADD COLUMN IF NOT EXISTS targets_ladder JSONB DEFAULT '[]';

-- ── Weekly Review Items ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS weekly_review_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Weekly Review Checks ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS weekly_review_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES weekly_review_items(id) ON DELETE CASCADE,
  week_of DATE NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  checked_by UUID REFERENCES auth.users(id),
  checked_at TIMESTAMPTZ,
  UNIQUE (item_id, week_of)
);

-- ── Notes ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'shared' CHECK (visibility IN ('personal', 'shared')),
  category TEXT,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  attachments JSONB DEFAULT '[]',
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Business Links ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS business_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🔗',
  description TEXT,
  category TEXT NOT NULL DEFAULT 'link' CHECK (category IN ('sheet', 'doc', 'link', 'tool')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Notifications ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('system', 'message', 'reminder')),
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('overdue_task', 'insurance_expiry', 'subscription_renewal', 'general')),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link_to TEXT,
  replies JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Quick Links ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quick_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT '🔗',
  sort_order INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'credential')),
  credential_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================================
-- Row Level Security (RLS) — Authenticated users can do everything
-- This is appropriate for a small team dashboard (2 founders)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_review_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_review_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;

-- Create a simple policy: authenticated users can do everything
-- (Both founders share full access to all data)
-- Drop-then-create makes this safe to re-run on a DB where the policy already exists.
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'finances', 'kpi_snapshots', 'subscriptions', 'credentials',
      'tasks', 'calendar_events', 'subcontractors', 'contacts',
      'goals', 'weekly_review_items', 'weekly_review_checks',
      'notes', 'business_links', 'notifications', 'quick_links'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access" ON %I', tbl);
    EXECUTE format(
      'CREATE POLICY "Authenticated full access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      tbl
    );
  END LOOP;
END
$$;


-- ============================================================================
-- Auto-update updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at (drop-first so the script is re-runnable)
DROP TRIGGER IF EXISTS update_finances_updated_at ON finances;
CREATE TRIGGER update_finances_updated_at BEFORE UPDATE ON finances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- ── Schema-drift catch-up: tables added live but missing from this file ─────
-- ============================================================================

-- ── Business Settings (k/v store for tunables — used by useBusinessSettings) ─

CREATE TABLE IF NOT EXISTS business_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Messages (team chat / threaded comments — used by Messages.tsx) ──────────

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id),
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── User Preferences (per-user UI settings JSON) ─────────────────────────────

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ── New: CEO Daemon agent observability + audit trail ───────────────────────
-- For tracking every agent run + every write the agent makes (security best practice).
-- ============================================================================

-- ── Agent Runs (one row per autonomous agent invocation) ─────────────────────

CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error', 'cancelled', 'timeout')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  input JSONB,
  output JSONB,
  slack_url TEXT,
  cost_usd NUMERIC(10,4) DEFAULT 0,
  confidence NUMERIC(3,2) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  trigger_source TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_name ON agent_runs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at ON agent_runs(started_at DESC);

-- ── Agent Activity Events (timeline within a run) ────────────────────────────

CREATE TABLE IF NOT EXISTS agent_activity_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('start', 'tool_call', 'tool_result', 'thought', 'write', 'message', 'finish', 'error')),
  message TEXT,
  data JSONB,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_events_run_id ON agent_activity_events(agent_run_id, ts);

-- ── Audit Log (every write CEO/agents make to the dashboard) ─────────────────

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
  table_name TEXT NOT NULL,
  row_id UUID,
  before JSONB,
  after JSONB,
  reasoning TEXT,
  agent_run_id UUID REFERENCES agent_runs(id) ON DELETE SET NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table_row ON audit_log(table_name, row_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_audit_log_ts ON audit_log(ts DESC);

-- ── RLS policies for the new tables ──────────────────────────────────────────

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Authenticated full-access for the team-shared tables (matches existing pattern)
-- Drop-then-create makes this safe to re-run.
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'business_settings', 'messages',
      'agent_runs', 'agent_activity_events', 'audit_log'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access" ON %I', tbl);
    EXECUTE format(
      'CREATE POLICY "Authenticated full access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      tbl
    );
  END LOOP;
END
$$;

-- user_preferences is per-user — only the row owner can read/write their preferences.
DROP POLICY IF EXISTS "Users manage own preferences" ON user_preferences;
CREATE POLICY "Users manage own preferences"
  ON user_preferences FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- updated_at triggers for the new tables (drop-first so the script is re-runnable)
DROP TRIGGER IF EXISTS update_business_settings_updated_at ON business_settings;
CREATE TRIGGER update_business_settings_updated_at BEFORE UPDATE ON business_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- ── Goal milestones — log of achieved targets for the celebration feature ──
-- ============================================================================
-- When a goal hits its target, the user clicks "Set next target" → we log the
-- old target + achieved value here, then update the goal with a new target.
-- This becomes the "Recent Wins" strip + a permanent achievement history.

CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  metric_name TEXT NOT NULL,       -- denormalized so milestones outlive their goal
  target_value NUMERIC(12,2) NOT NULL,
  achieved_value NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL,
  period TEXT,
  days_to_achieve INTEGER,         -- how long it took: from goal creation OR previous milestone
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- For DBs that already created goal_milestones without days_to_achieve:
ALTER TABLE goal_milestones ADD COLUMN IF NOT EXISTS days_to_achieve INTEGER;

CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_achieved_at ON goal_milestones(achieved_at DESC);

ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated full access" ON goal_milestones;
CREATE POLICY "Authenticated full access" ON goal_milestones FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ============================================================================
-- Done! 22 tables total with RLS policies.
-- ============================================================================
