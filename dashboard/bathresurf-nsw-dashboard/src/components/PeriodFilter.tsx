import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';

export type Period = 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'all_time' | 'custom';

interface PeriodFilterProps {
  value: Period;
  onChange: (period: Period) => void;
  options?: Period[];
  customStart?: string;
  customEnd?: string;
  onCustomRangeChange?: (start: string, end: string) => void;
}

const DEFAULT_OPTIONS: Period[] = [
  'today', 'this_week', 'this_month', 'this_quarter', 'this_year', 'all_time'
];

const LABELS: Record<Period, string> = {
  today: 'Today',
  this_week: 'This Week',
  this_month: 'This Month',
  this_quarter: 'This Quarter',
  this_year: 'This Year',
  all_time: 'All Time',
  custom: 'Custom Range'
};

export function PeriodFilter({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  customStart = '',
  customEnd = '',
  onCustomRangeChange,
}: PeriodFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [open]);

  const handleSelect = (option: Period) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div ref={ref} className="relative inline-block">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors shadow-sm min-w-[160px]",
            open
              ? "bg-white border-[#1B2A4A] ring-2 ring-[#1B2A4A]/10 text-slate-900"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="flex-1 text-left">{LABELS[value]}</span>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 transition-transform", open && "rotate-180")} />
        </button>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute z-50 mt-1.5 left-0 min-w-[200px] bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex items-center justify-between w-full px-3.5 py-2 text-sm transition-colors",
                  value === option
                    ? "bg-[#1B2A4A]/5 text-[#1B2A4A] font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span>{LABELS[option]}</span>
                {value === option && <Check className="w-4 h-4 text-[#1B2A4A]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom date range inputs */}
      {value === 'custom' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
          <label className="flex items-center gap-1.5 text-sm text-slate-600">
            <span className="text-slate-500 font-medium min-w-[36px]">From</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomRangeChange?.(e.target.value, customEnd)}
              className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
            />
          </label>
          <label className="flex items-center gap-1.5 text-sm text-slate-600">
            <span className="text-slate-500 font-medium min-w-[36px]">To</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomRangeChange?.(customStart, e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
            />
          </label>
        </div>
      )}
    </div>
  );
}
