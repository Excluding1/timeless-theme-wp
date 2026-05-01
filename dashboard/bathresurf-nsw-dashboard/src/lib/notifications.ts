import { differenceInDays, parseISO, isBefore, startOfDay } from 'date-fns';
import type { Task, Subscription, Subcontractor } from './database';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  return new Notification(title, {
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    ...options,
  });
}

// Deduplicate notifications per session so we don't spam on every re-render
const notifiedThisSession = new Set<string>();

function notifyOnce(key: string, title: string, body: string, tag?: string) {
  if (notifiedThisSession.has(key)) return;
  notifiedThisSession.add(key);
  sendLocalNotification(title, { body, tag: tag || key });
}

export function checkOverdueTasks(tasks: Task[]) {
  const today = startOfDay(new Date());
  const overdue = tasks.filter(
    t => t.status !== 'done' && t.due_date && isBefore(parseISO(t.due_date), today)
  );
  if (overdue.length > 0) {
    notifyOnce(
      'overdue-tasks',
      'Overdue Tasks',
      `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. Check your task board.`
    );
  }
}

export function checkSubscriptionRenewals(subscriptions: Subscription[]) {
  const now = new Date();
  subscriptions.forEach(s => {
    if (s.status === 'active' && s.next_renewal) {
      const days = differenceInDays(parseISO(s.next_renewal), now);
      // 7-day warning
      if (days >= 0 && days <= 7) {
        notifyOnce(
          `renewal-7d-${s.id}`,
          'Subscription Renewal — 7 Days',
          `${s.name} renews in ${days} day${days !== 1 ? 's' : ''} ($${s.cost.toFixed(2)}).`
        );
      }
      // Day-before warning
      if (days === 1) {
        notifyOnce(
          `renewal-1d-${s.id}`,
          'Subscription Renewal — Tomorrow',
          `${s.name} renews tomorrow ($${s.cost.toFixed(2)}). Cancel now if you don't need it.`
        );
      }
      // Due today
      if (days === 0) {
        notifyOnce(
          `renewal-today-${s.id}`,
          'Subscription Renewal — Today',
          `${s.name} is renewing today ($${s.cost.toFixed(2)}).`
        );
      }
    }
  });
}

export function checkInsuranceExpiry(subcontractors: Subcontractor[]) {
  const now = new Date();
  subcontractors.forEach(s => {
    if (s.status === 'active' && s.pl_insurance_expiry) {
      const days = differenceInDays(parseISO(s.pl_insurance_expiry), now);
      if (days >= 0 && days <= 14) {
        notifyOnce(
          `insurance-${s.id}`,
          'Insurance Expiring Soon',
          `${s.name}'s PL insurance expires in ${days} day${days !== 1 ? 's' : ''}.`
        );
      }
    }
  });
}
