import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface UserPreferences {
  dashboard_sections: string[];
  default_task_view: 'kanban' | 'list';
  default_sub_view: 'cards' | 'table';
  default_subscription_view: 'cards' | 'table';
  default_calendar_view: 'month' | 'week';
  default_finance_period: string;
  default_overview_period: string;
  default_cashflow_period: string;
  hidden_nav_items: string[];
  sidebar_collapsed: boolean;
  nav_item_order: string[];
  top_nav_collapsed: boolean;
  nav_grouped: boolean;
  nav_pinned_items: string[];
}

const defaultPreferences: UserPreferences = {
  dashboard_sections: ['quick_links', 'todos', 'events', 'revenue', 'alerts'],
  default_task_view: 'kanban',
  default_sub_view: 'cards',
  default_subscription_view: 'cards',
  default_calendar_view: 'month',
  default_finance_period: 'this_month',
  default_overview_period: 'this_month',
  default_cashflow_period: 'this_month',
  hidden_nav_items: [],
  sidebar_collapsed: false,
  nav_item_order: ['dashboard', 'overview', 'tasks', 'messages', 'calendar', 'finances', 'cashflow', 'kpis', 'subscriptions', 'subs', 'contacts', 'credentials', 'goals', 'weekly_review', 'notes', 'links', 'notifications', 'settings'],
  top_nav_collapsed: false,
  nav_grouped: false,
  nav_pinned_items: ['dashboard', 'tasks', 'messages', 'finances', 'cashflow', 'subs', 'goals', 'settings'],
};

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    if (!supabase) {
      // Mock preferences for preview
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (data && data.preferences) {
        setPreferences({ ...defaultPreferences, ...data.preferences });
      } else if (error && error.code === 'PGRST116') {
        // No row exists, insert default
        await supabase.from('user_preferences').insert({
          user_id: user.id,
          preferences: defaultPreferences,
        });
      }
      setLoading(false);
    };

    fetchPreferences();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);

    if (supabase && user) {
      await supabase
        .from('user_preferences')
        .update({ preferences: updated })
        .eq('user_id', user.id);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
