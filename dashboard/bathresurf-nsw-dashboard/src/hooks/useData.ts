import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Finance, KpiSnapshot, Subscription, Credential, Task,
  CalendarEvent, Subcontractor, Contact, Goal, GoalMilestone,
  WeeklyReviewItem, WeeklyReviewCheck, Note, QuickLink, BusinessLink, AppNotification, Message
} from '../lib/database';
import * as mock from '../lib/mockData';

// Map table names to their element types
interface TableTypeMap {
  finances: Finance;
  kpi_snapshots: KpiSnapshot;
  subscriptions: Subscription;
  credentials: Credential;
  tasks: Task;
  calendar_events: CalendarEvent;
  subcontractors: Subcontractor;
  contacts: Contact;
  goals: Goal;
  goal_milestones: GoalMilestone;
  weekly_review_items: WeeklyReviewItem;
  weekly_review_checks: WeeklyReviewCheck;
  notes: Note;
  quick_links: QuickLink;
  business_links: BusinessLink;
  notifications: AppNotification;
  messages: Message;
}

type TableName = keyof TableTypeMap;

const MOCK_DATA: { [K in TableName]: TableTypeMap[K][] } = {
  finances: mock.mockFinances,
  kpi_snapshots: mock.mockKpis,
  subscriptions: mock.mockSubscriptions,
  credentials: mock.mockCredentials,
  tasks: mock.mockTasks,
  calendar_events: mock.mockCalendarEvents,
  subcontractors: mock.mockSubcontractors,
  contacts: mock.mockContacts,
  goals: mock.mockGoals,
  goal_milestones: [],
  weekly_review_items: mock.mockWeeklyReviewItems,
  weekly_review_checks: mock.mockWeeklyReviewChecks,
  notes: mock.mockNotes,
  quick_links: mock.mockQuickLinks,
  business_links: mock.mockBusinessLinks,
  notifications: mock.mockNotifications,
  messages: mock.mockMessages,
};

export function useData<K extends TableName>(
  table: K,
  options?: { orderBy?: string; ascending?: boolean }
) {
  type Item = TableTypeMap[K];
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setData([...MOCK_DATA[table]] as Item[]);
      setLoading(false);
      return;
    }

    try {
      let q = supabase.from(table).select('*');
      if (options?.orderBy) {
        q = q.order(options.orderBy, { ascending: options.ascending ?? false });
      }
      const { data: result, error: err } = await q;
      if (err) throw err;
      setData((result as Item[]) || []);
    } catch (e: any) {
      setError(e.message);
      setData([...MOCK_DATA[table]] as Item[]);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = useCallback(async (item: Partial<Item>) => {
    if (!supabase) {
      const newItem = { ...item, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Item;
      setData(prev => [...prev, newItem]);
      return newItem;
    }
    const { data: result, error } = await supabase.from(table).insert(item as any).select().single();
    if (error) throw error;
    const typed = result as Item;
    setData(prev => [...prev, typed]);
    return typed;
  }, [table]);

  const update = useCallback(async (id: string, updates: Partial<Item>) => {
    if (!supabase) {
      setData(prev => prev.map(item =>
        (item as any).id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      ));
      return { id, ...updates } as Item;
    }
    const { data: result, error } = await supabase.from(table).update(updates as any).eq('id', id).select().single();
    if (error) throw error;
    const typed = result as Item;
    setData(prev => prev.map(item => (item as any).id === id ? typed : item));
    return typed;
  }, [table]);

  const remove = useCallback(async (id: string) => {
    if (!supabase) {
      setData(prev => prev.filter(item => (item as any).id !== id));
      return;
    }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    setData(prev => prev.filter(item => (item as any).id !== id));
  }, [table]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
    setData,
  };
}
