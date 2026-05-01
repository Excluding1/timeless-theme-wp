import { useEffect, useRef } from 'react';
import { useData } from './useData';
import { sendLocalNotification } from '../lib/notifications';
import { differenceInCalendarDays, parseISO, isBefore, isValid, startOfDay, format } from 'date-fns';
import type { Task, Subscription, Subcontractor, AppNotification } from '../lib/database';

export function useNotificationAlerts() {
  const { data: tasks, loading: tasksLoading } = useData('tasks');
  const { data: subscriptions, loading: subsLoading } = useData('subscriptions');
  const { data: subcontractors, loading: subsTrackerLoading } = useData('subcontractors');
  const { data: notifications, loading: notisLoading, create } = useData('notifications');

  // Only run checks once per session to avoid infinite re-render loops
  const hasChecked = useRef(false);

  useEffect(() => {
    if (tasksLoading || subsLoading || subsTrackerLoading || notisLoading) return;
    if (hasChecked.current) return;
    hasChecked.current = true;

    const today = format(new Date(), 'yyyy-MM-dd');
    const existingCategories = new Set(
      (notifications as AppNotification[])
        .filter(n => {
          if (!n.created_at) return false;
          const d = parseISO(n.created_at);
          return isValid(d) && format(d, 'yyyy-MM-dd') === today;
        })
        .map(n => n.category)
    );

    function createIfNew(
      category: AppNotification['category'],
      data: Omit<AppNotification, 'id' | 'created_at' | 'updated_at'>
    ) {
      if (existingCategories.has(category)) return;
      existingCategories.add(category); // prevent double-creates in same batch
      create(data as any);

      // Also fire browser push notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        sendLocalNotification(data.title, { body: data.body, tag: `${category}-${today}` });
      }
    }

    // Overdue tasks — guard parseISO so a malformed due_date doesn't crash the entire effect.
    const todayDate = startOfDay(new Date());
    const overdue = (tasks as Task[]).filter(t => {
      if (t.status === 'done' || !t.due_date) return false;
      const d = parseISO(t.due_date);
      return isValid(d) && isBefore(d, todayDate);
    });
    if (overdue.length > 0) {
      createIfNew('overdue_task', {
        type: 'system',
        category: 'overdue_task',
        title: 'Overdue Tasks',
        body: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. Check your task board.`,
        read: false,
        link_to: '/tasks',
      });
    }

    // Subscription renewals within 7 days
    const now = new Date();
    const renewingSubs = (subscriptions as Subscription[]).filter(s => {
      if (s.status !== 'active' || !s.next_renewal) return false;
      const d = parseISO(s.next_renewal);
      if (!isValid(d)) return false;
      const days = differenceInCalendarDays(d, now);
      return days >= 0 && days <= 7;
    });
    if (renewingSubs.length > 0) {
      const sub = renewingSubs[0];
      const days = differenceInCalendarDays(parseISO(sub.next_renewal!), now);
      createIfNew('subscription_renewal', {
        type: 'system',
        category: 'subscription_renewal',
        title: 'Subscription Renewal Soon',
        body: renewingSubs.length === 1
          ? `${sub.name} renews in ${days} day${days !== 1 ? 's' : ''} ($${sub.cost.toFixed(2)}).`
          : `${renewingSubs.length} subscriptions renew within 7 days.`,
        read: false,
        link_to: '/subscriptions',
      });
    }

    // Insurance expiry within 14 days
    const expiringSubs = (subcontractors as Subcontractor[]).filter(s => {
      if (s.status !== 'active' || !s.pl_insurance_expiry) return false;
      const d = parseISO(s.pl_insurance_expiry);
      if (!isValid(d)) return false;
      const days = differenceInCalendarDays(d, now);
      return days >= 0 && days <= 14;
    });
    if (expiringSubs.length > 0) {
      const sub = expiringSubs[0];
      const days = differenceInCalendarDays(parseISO(sub.pl_insurance_expiry!), now);
      createIfNew('insurance_expiry', {
        type: 'system',
        category: 'insurance_expiry',
        title: 'Insurance Expiring Soon',
        body: expiringSubs.length === 1
          ? `${sub.name}'s PL insurance expires in ${days} day${days !== 1 ? 's' : ''}.`
          : `${expiringSubs.length} subcontractors have insurance expiring within 14 days.`,
        read: false,
        link_to: '/subs',
      });
    }
  }, [tasks, subscriptions, subcontractors, notifications, tasksLoading, subsLoading, subsTrackerLoading, notisLoading, create]);
}
