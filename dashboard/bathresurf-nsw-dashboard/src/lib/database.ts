import {
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfQuarter, endOfQuarter, startOfYear, endOfYear, subDays, subWeeks,
  subMonths, subQuarters, subYears
} from 'date-fns';
import type { Period } from '../components/PeriodFilter';

// Types
export interface Finance {
  id: string;
  date: string;
  type: 'revenue' | 'expense';
  category: string;
  description: string;
  amount: number;
  payment_method?: string;
  gst_included: boolean;
  receipt_photos: string[];
  linked_job?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KpiSnapshot {
  id: string;
  week_ending: string;
  leads_total: number;
  leads_google: number;
  leads_meta: number;
  leads_organic: number;
  quotes_sent: number;
  quotes_accepted: number;
  jobs_completed: number;
  revenue: number;
  ad_spend_google: number;
  ad_spend_meta: number;
  ad_spend_total: number;
  avg_job_value?: number;
  avg_profit_per_job?: number;
  cpl?: number;
  cpbj?: number;
  conversion_rate?: number;
  poas?: number;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

export interface PriceChange {
  effective_date: string;
  new_cost: number;
  note?: string;
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'paused' | 'cancelled' | 'trial';
  cost: number;
  billing_cycle: 'monthly' | 'quarterly' | 'annually' | 'one-off';
  next_renewal?: string;
  auto_renew: boolean;
  managed_by?: string;
  login_url?: string;
  plan_name?: string;
  notes?: string;
  linked_credential_id?: string;
  price_changes?: PriceChange[];
  start_date?: string;
  created_by?: string;
  created_at?: string;
}

export interface Credential {
  id: string;
  service_name: string;
  category: string;
  login_url?: string;
  username: string;
  password: string;
  two_fa_method?: string;
  two_fa_notes?: string;
  linked_subscription_id?: string;
  notes?: string;
  last_password_update?: string;
  created_by?: string;
  created_at?: string;
}

export interface Attachment {
  id: string;
  url: string;        // base64 data URL (pre-Cloudinary) or Cloudinary URL (post)
  name: string;
  type: string;        // MIME type e.g. 'image/png'
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  visibility: 'personal' | 'shared';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: string;
  category?: string;
  checklist: { text: string; done: boolean }[];
  attachments?: Attachment[];
  owner_id?: string;
  sort_order: number;
  completed_at?: string;
  created_at?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  visibility: 'personal' | 'shared';
  date: string;
  start_time?: string;
  end_time?: string;
  is_all_day: boolean;
  category?: string;
  colour: string;
  owner_id?: string;
  created_at?: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  business_name?: string;
  abn: string;
  phone: string;
  email?: string;
  type: 'regrout' | 'resurface' | 'dual' | 'specialist';
  tier: 'tier_1' | 'tier_2' | 'tier_3';
  status: 'active' | 'on_hold' | 'removed' | 'prospect';
  coverage_suburbs?: string;
  skills: string[];
  pl_insurance_expiry?: string;
  agreement_signed: boolean;
  agreement_date?: string;
  trial_job_status?: string;
  trial_job_score?: number;
  avg_nps?: number;
  jobs_completed: number;
  callback_rate?: number;
  last_job_date?: string;
  prospect_stage?: 'new' | 'contacted' | 'interested' | 'considering' | 'not_interested';
  last_contacted?: string;
  source?: string;
  rejection_reason?: string;
  notes?: string;
  documents_url?: string;
  created_by?: string;
  created_at?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company?: string;
  phone?: string;
  email?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

export interface Goal {
  id: string;
  metric_name: string;
  target_value: number;
  current_value: number;
  unit: '$' | '%' | '#';
  period: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  lower_is_better: boolean;
  deadline?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

export interface GoalMilestone {
  id: string;
  goal_id?: string;
  metric_name: string;
  target_value: number;
  achieved_value: number;
  unit: string;
  period?: string;
  days_to_achieve?: number;
  achieved_at: string;
}

export interface WeeklyReviewItem {
  id: string;
  text: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface WeeklyReviewCheck {
  id: string;
  item_id: string;
  week_of: string;
  checked: boolean;
  checked_by?: string;
  checked_at?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  visibility: 'personal' | 'shared';
  category?: string;
  pinned: boolean;
  attachments?: Attachment[];
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  category: 'sheet' | 'doc' | 'link' | 'tool';
  sort_order: number;
  created_at?: string;
}

export interface NotificationReply {
  id: string;
  sender_name: string;
  body: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  type: 'system' | 'message' | 'reminder';
  category: 'overdue_task' | 'insurance_expiry' | 'subscription_renewal' | 'general';
  title: string;
  body: string;
  read: boolean;
  link_to?: string;
  replies?: NotificationReply[];
  created_at?: string;
  updated_at?: string;
}

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon?: string;
  sort_order: number;
  source: 'manual' | 'credential';
  credential_id?: string;
  important?: boolean;
  created_at?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  body: string;
  created_at: string;
}

// Period date range calculation
export function getPeriodDateRange(period: Period): { start: Date; end: Date } | null {
  const now = new Date();
  switch (period) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'this_week':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case 'this_month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'this_quarter':
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
    case 'this_year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'all_time':
      return null;
    default:
      return null;
  }
}

export function getPreviousPeriodRange(period: Period): { start: Date; end: Date } | null {
  const now = new Date();
  switch (period) {
    case 'today':
      return { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) };
    case 'this_week':
      return { start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }) };
    case 'this_month':
      return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
    case 'this_quarter':
      return { start: startOfQuarter(subQuarters(now, 1)), end: endOfQuarter(subQuarters(now, 1)) };
    case 'this_year':
      return { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) };
    default:
      return null;
  }
}

