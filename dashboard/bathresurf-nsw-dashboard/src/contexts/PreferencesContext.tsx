import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// localStorage key for the per-user prefs cache. Per-user-keyed so multi-user
// browsers don't leak prefs between accounts.
const LS_KEY_PREFIX = 'timelessdash_prefs_';
const lsKey = (userId: string) => `${LS_KEY_PREFIX}${userId}`;

function loadLocalPrefs(userId: string): Partial<UserPreferences> | null {
  try {
    const raw = localStorage.getItem(lsKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalPrefs(userId: string, prefs: UserPreferences): void {
  try {
    localStorage.setItem(lsKey(userId), JSON.stringify(prefs));
  } catch {
    /* quota exceeded or private mode */
  }
}

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
      // Merge order: defaults < DB < localStorage (localStorage WINS on same device).
      // Why: localStorage reflects the user's most recent local action and is always
      // fresh. The DB row may be stale (e.g. if a prior upsert silently failed).
      // Cross-device sync still works: a new device has empty localStorage, so DB wins.
      let merged: UserPreferences = { ...defaultPreferences };

      // 1) DB layer
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('[PreferencesContext] DB fetch failed:', error);
      }

      if (data && data.preferences) {
        merged = { ...merged, ...data.preferences };
        console.info('[PreferencesContext] DB layer:', {
          finance: merged.default_finance_period,
          overview: merged.default_overview_period,
          cashflow: merged.default_cashflow_period,
        });
      }

      // 2) localStorage layer (overrides DB — most recent local action wins)
      const localPrefs = loadLocalPrefs(user.id);
      if (localPrefs) {
        merged = { ...merged, ...localPrefs };
        console.info('[PreferencesContext] localStorage layer (overrides DB):', {
          finance: merged.default_finance_period,
          overview: merged.default_overview_period,
          cashflow: merged.default_cashflow_period,
        });
      }

      setPreferences(merged);
      // Sync the merged result back to both layers so they're aligned for next time.
      saveLocalPrefs(user.id, merged);

      // If neither localStorage nor DB had anything, seed the DB so future fetches succeed.
      if (!localPrefs && !(data && data.preferences)) {
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

      console.info('[PreferencesContext] FINAL merged prefs:', {
        finance: merged.default_finance_period,
        overview: merged.default_overview_period,
        cashflow: merged.default_cashflow_period,
      });
      setLoading(false);
    };

    fetchPreferences();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);

    // 1) Write to localStorage IMMEDIATELY — guaranteed persistence even if DB is broken.
    if (user) {
      saveLocalPrefs(user.id, updated);
      console.info('[PreferencesContext] saved to localStorage:', newPrefs);
    }

    // 2) Also write to Supabase — keeps cross-device sync working when it works.
    if (supabase && user) {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          { user_id: user.id, preferences: updated, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
      if (error) {
        console.error('[PreferencesContext] DB upsert failed (localStorage still saved):', error);
      } else {
        console.info('[PreferencesContext] saved to DB:', newPrefs);
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
