/**
 * Delivery & ETA Engine — Phase 7.1
 * Calculates dispatch ETA, estimated delivery dates, cutoff rules, and weekend skip rules.
 */

import prisma from '../prisma';

export interface DeliveryEtaResult {
  estDispatchDate: string; // ISO date string
  estDeliveryDateMin: string; // ISO date string
  estDeliveryDateMax: string; // ISO date string
  estDispatchText: string;
  estDeliveryText: string;
  isCutoffPassed: boolean;
  shippingMethodId: string;
  shippingMethodName: string;
}

export const deliveryEtaEngine = {
  /**
   * Calculates dispatch and delivery ETAs for a given shipping method and order placement time.
   */
  calculateEta: async (shippingMethodId?: string | null, orderTime = new Date()): Promise<DeliveryEtaResult> => {
    // 1. Fetch shipping method or default to standard
    let method = shippingMethodId
      ? await prisma.shippingMethod.findUnique({ where: { id: shippingMethodId } })
      : null;

    if (!method) {
      method = await prisma.shippingMethod.findFirst({
        where: { isEnabled: true },
        orderBy: { priority: 'desc' },
      });
    }

    const dispatchDays = method?.estDispatchDays ?? 1;
    const deliveryDays = method?.estDeliveryDays ?? 4;
    const cutoffTimeStr = method?.cutoffTime ?? '14:00';
    const shipWeekends = method?.shipWeekends ?? false;

    // 2. Check if cutoff time for today has passed
    const [cutoffHours, cutoffMinutes] = cutoffTimeStr.split(':').map(Number);
    const cutoffDate = new Date(orderTime);
    cutoffDate.setHours(cutoffHours, cutoffMinutes, 0, 0);

    const isCutoffPassed = orderTime.getTime() > cutoffDate.getTime();

    // 3. Calculate Dispatch Date
    let dispatchDate = new Date(orderTime);
    if (isCutoffPassed) {
      dispatchDate.setDate(dispatchDate.getDate() + 1);
    }

    // Add dispatch business days
    let addedDays = 0;
    while (addedDays < dispatchDays) {
      dispatchDate.setDate(dispatchDate.getDate() + 1);
      const dayOfWeek = dispatchDate.getDay(); // 0 = Sun, 6 = Sat
      if (!shipWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
        continue; // skip weekend
      }
      addedDays++;
    }

    // 4. Calculate Delivery Range (min to max days)
    const minDeliveryDate = new Date(dispatchDate);
    const maxDeliveryDate = new Date(dispatchDate);

    let addedMin = 0;
    while (addedMin < Math.max(1, deliveryDays - 1)) {
      minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);
      const day = minDeliveryDate.getDay();
      if (!shipWeekends && (day === 0 || day === 6)) continue;
      addedMin++;
    }

    let addedMax = 0;
    while (addedMax < deliveryDays + 1) {
      maxDeliveryDate.setDate(maxDeliveryDate.getDate() + 1);
      const day = maxDeliveryDate.getDay();
      if (!shipWeekends && (day === 0 || day === 6)) continue;
      addedMax++;
    }

    // 5. Format human readable strings (en-IN)
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const estDispatchText = dispatchDate.toLocaleDateString('en-IN', options);
    const minDeliveryStr = minDeliveryDate.toLocaleDateString('en-IN', options);
    const maxDeliveryStr = maxDeliveryDate.toLocaleDateString('en-IN', options);

    return {
      estDispatchDate: dispatchDate.toISOString(),
      estDeliveryDateMin: minDeliveryDate.toISOString(),
      estDeliveryDateMax: maxDeliveryDate.toISOString(),
      estDispatchText: `Est. Dispatch: ${estDispatchText}`,
      estDeliveryText: `Est. Delivery: ${minDeliveryStr} – ${maxDeliveryStr}`,
      isCutoffPassed,
      shippingMethodId: method?.id ?? '',
      shippingMethodName: method?.name ?? 'Standard Courier',
    };
  },
};
