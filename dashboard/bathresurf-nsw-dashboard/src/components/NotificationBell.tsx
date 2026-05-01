import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, MessageSquare, Clock, CheckCheck, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import type { AppNotification } from '../lib/database';

const CATEGORY_ICON: Record<string, React.ElementType> = {
  overdue_task: AlertTriangle,
  insurance_expiry: AlertTriangle,
  subscription_renewal: Clock,
  general: MessageSquare,
};

const CATEGORY_COLOR: Record<string, string> = {
  overdue_task: 'text-red-500',
  insurance_expiry: 'text-amber-500',
  subscription_renewal: 'text-blue-500',
  general: 'text-slate-500',
};

export function NotificationBell() {
  const { data: rawData, update } = useData('notifications');
  const notifications = rawData as unknown as AppNotification[];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const recent = useMemo(
    () => [...notifications]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 10),
    [notifications]
  );

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  async function markAllRead() {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => update(n.id, { read: true })));
  }

  async function handleClickNotification(n: AppNotification) {
    if (!n.read) await update(n.id, { read: true });
    setOpen(false);
    if (n.link_to) navigate(n.link_to);
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-[#0D9488] hover:text-[#0f766e] font-medium transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Items */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {recent.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No notifications yet</p>
              </div>
            ) : (
              recent.map(n => {
                const Icon = CATEGORY_ICON[n.category] || MessageSquare;
                const color = CATEGORY_COLOR[n.category] || 'text-slate-500';
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotification(n)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors",
                      !n.read && "bg-[#0D9488]/5"
                    )}
                  >
                    <div className={cn("mt-0.5 shrink-0", color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm truncate", !n.read ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-[#0D9488] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{n.body}</p>
                      {n.created_at && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50">
            <button
              onClick={() => { setOpen(false); navigate('/notifications'); }}
              className="w-full text-center text-sm text-[#0D9488] hover:text-[#0f766e] font-medium flex items-center justify-center gap-1 transition-colors"
            >
              View all notifications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
