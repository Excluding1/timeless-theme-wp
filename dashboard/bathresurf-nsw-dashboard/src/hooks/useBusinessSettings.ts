import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface BusinessSettings {
  cashflow_tax_reserve: number;
  cashflow_growth_reserve: number;
  cashflow_buffer_target: number;
  [key: string]: number | string | boolean;
}

const DEFAULTS: BusinessSettings = {
  cashflow_tax_reserve: 25,
  cashflow_growth_reserve: 30,
  cashflow_buffer_target: 5000,
};

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('business_settings')
      .select('key, value')
      .then(({ data, error: queryError }) => {
        if (queryError) {
          setError(queryError.message);
          setLoading(false);
          return;
        }
        if (data) {
          const merged = { ...DEFAULTS };
          data.forEach(row => {
            // Per-row try/catch — one malformed row can't kill the whole settings load.
            try {
              const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
              merged[row.key] = typeof parsed === 'number' ? parsed : Number(parsed) || parsed;
            } catch {
              // Leave default for this key
            }
          });
          setSettings(merged);
        }
        setLoading(false);
      });
  }, []);

  const updateSetting = useCallback(async (key: string, value: number | string | boolean) => {
    if (!supabase) {
      setSettings(prev => ({ ...prev, [key]: value }));
      return;
    }
    // Optimistic update with rollback on error
    const prevSettings = settings;
    setSettings(prev => ({ ...prev, [key]: value }));
    const { error: upsertError } = await supabase
      .from('business_settings')
      .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (upsertError) {
      setSettings(prevSettings);
      throw upsertError;
    }
  }, [settings]);

  return { settings, loading, error, updateSetting };
}
