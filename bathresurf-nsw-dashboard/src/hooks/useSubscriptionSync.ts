import { useEffect, useRef } from 'react';
import { useData } from './useData';
import { addMonths, addQuarters, addYears, parseISO, isValid, isBefore, startOfDay, format } from 'date-fns';
import type { Subscription, Finance } from '../lib/database';

/**
 * Runs on page load. For each active subscription:
 * 1. If next_renewal is today or past → create a finance expense entry + advance renewal date
 * 2. If a price_change effective_date has passed → apply the new cost + remove the change
 *
 * Idempotent — checks for existing finance entries to avoid duplicates.
 * Only runs once per session (useRef guard).
 */
export function useSubscriptionSync() {
  const { data: rawSubs, update: updateSub } = useData('subscriptions');
  const { data: rawFinances, create: createFinance } = useData('finances');
  const hasRun = useRef(false);

  const subscriptions = rawSubs as unknown as Subscription[];
  const finances = rawFinances as unknown as Finance[];

  useEffect(() => {
    // Only run once per session, and only when data is loaded
    if (hasRun.current || subscriptions.length === 0) return;
    hasRun.current = true;

    const today = startOfDay(new Date());

    subscriptions.forEach(async (sub) => {
      // Skip inactive, cancelled, or one-off subs
      if (sub.status === 'cancelled' || sub.status === 'paused') return;
      if (sub.billing_cycle === 'one-off') return;

      let updated = false;
      let newCost = Number(sub.cost) || 0;
      let newPriceChanges = sub.price_changes ? [...sub.price_changes] : [];

      // ── 1. Apply any past price changes ───────────────────────────────
      if (newPriceChanges.length > 0) {
        const remaining: typeof newPriceChanges = [];
        newPriceChanges.forEach((pc) => {
          if (!pc.effective_date) { remaining.push(pc); return; }
          const effectiveDate = parseISO(pc.effective_date);
          if (!isValid(effectiveDate)) { remaining.push(pc); return; }
          if (isBefore(effectiveDate, today) || effectiveDate.getTime() === today.getTime()) {
            // Price change has taken effect — apply it
            newCost = Number(pc.new_cost) || newCost;
            updated = true;
          } else {
            // Still in the future — keep it
            remaining.push(pc);
          }
        });
        newPriceChanges = remaining;
      }

      // ── 2. Check if renewal is due ────────────────────────────────────
      if (sub.next_renewal) {
        const renewalDate = parseISO(sub.next_renewal);
        if (isValid(renewalDate) && (isBefore(renewalDate, today) || renewalDate.getTime() === today.getTime())) {
          // Check if we already logged this payment (avoid duplicates)
          const renewalStr = format(renewalDate, 'yyyy-MM-dd');
          const alreadyLogged = finances.some(
            (f) =>
              f.type === 'expense' &&
              f.category === 'Subscriptions' &&
              f.description?.includes(sub.name) &&
              f.date === renewalStr
          );

          if (!alreadyLogged && newCost > 0) {
            // Create the finance entry
            try {
              await createFinance({
                date: renewalStr,
                type: 'expense',
                category: 'Subscriptions',
                description: `${sub.name}${sub.plan_name ? ` (${sub.plan_name})` : ''} — auto-renewal`,
                amount: newCost,
                payment_method: 'Credit Card',
                gst_included: false,
                receipt_photos: [],
                notes: 'Auto-logged by subscription sync',
              } as any);
            } catch {
              // Silently fail — don't break the app over a sync issue
            }
          }

          // Advance to next renewal date
          const nextRenewal = advanceDate(renewalDate, sub.billing_cycle);
          updated = true;

          // Apply all updates
          try {
            await updateSub(sub.id, {
              cost: newCost,
              next_renewal: format(nextRenewal, 'yyyy-MM-dd'),
              price_changes: newPriceChanges.length > 0 ? newPriceChanges : [],
            } as any);
          } catch {
            // Silently fail
          }
          return; // Already updated, skip the standalone price change update below
        }
      }

      // ── 3. If only price changes were applied (no renewal due) ────────
      if (updated) {
        try {
          await updateSub(sub.id, {
            cost: newCost,
            price_changes: newPriceChanges.length > 0 ? newPriceChanges : [],
          } as any);
        } catch {
          // Silently fail
        }
      }
    });
  }, [subscriptions, finances, createFinance, updateSub]);
}

function advanceDate(from: Date, cycle: string): Date {
  switch (cycle) {
    case 'monthly':   return addMonths(from, 1);
    case 'quarterly': return addQuarters(from, 1);
    case 'annually':  return addYears(from, 1);
    default:          return addMonths(from, 1);
  }
}
