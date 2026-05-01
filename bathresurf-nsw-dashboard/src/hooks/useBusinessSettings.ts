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

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('business_settings')
      .select('key, value')
      .then(({ data }) => {
        if (data) {
          const merged = { ...DEFAULTS };
          data.forEach(row => {
            const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
            merged[row.key] = typeof parsed === 'number' ? parsed : Number(parsed) || parsed;
          });
          setSettings(merged);
        }
        setLoading(false);
      });
  }, []);

  const updateSetting = useCallback(async (key: string, value: number | string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    if (supabase) {
      await supabase
        .from('business_settings')
        .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    }
  }, []);

  return { settings, loading, updateSetting };
}
