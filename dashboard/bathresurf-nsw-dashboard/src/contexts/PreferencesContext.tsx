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
  setup_guide_collapsed: boolean;
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
  setup_guide_collapsed: false,
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
      // maybeSingle returns null (not an error) when no row — safer than .single()
      // which returns PGRST116. We then upsert defaults so the row always exists.
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('[PreferencesContext] fetch failed:', error);
      }

      if (data && data.preferences) {
        setPreferences({ ...defaultPreferences, ...data.preferences });
      } else {
        // No row exists yet — upsert with defaults. Upsert (not insert) so
        // we don't fail if a concurrent process already created the row.
        const { error: upsertError } = await supabase
          .from('user_preferences')
          .upsert(
            { user_id: user.id, preferences: defaultPreferences },
            { onConflict: 'user_id' },
          );
        if (upsertError) {
          console.error('[PreferencesContext] initial upsert failed:', upsertError);
        }
      }
      setLoading(false);
    };

    fetchPreferences();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);

    if (supabase && user) {
      // UPSERT instead of UPDATE — handles the case where the user_preferences row
      // doesn't exist yet (e.g. fetch's no-row INSERT path silently failed earlier).
      // First write creates the row; subsequent writes overwrite. Robust either way.
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          { user_id: user.id, preferences: updated, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
      if (error) {
        console.error('[PreferencesContext] upsert failed:', error);
      }
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
