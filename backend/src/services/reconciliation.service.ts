import prisma from '../prisma';
import { paymentService } from './payment.service';
import logger from '../lib/logger';
import { RefundStatus } from '@prisma/client';

export const reconciliationService = {
  /**
   * Run structured reconciliation job across all stuck refunds.
   * Clusters-safe execution protected by CronJobLock.
   */
  runReconciliation: async (lockedBy: string = 'cron_worker') => {
    const lockId = 'refund_reconciliation';
    const now = new Date();
    const lockExpiry = new Date(now.getTime() + 30 * 60 * 1000); // 30 mins lock expiry

    // 1. Acquire Lock
    try {
      const lock = await prisma.cronJobLock.findUnique({ where: { id: lockId } });

      if (lock && lock.expiresAt > now) {
        logger.info({ lockBy: lock.lockedBy }, '[Reconciliation] Job already locked by another worker. Skipping.');
        return { status: 'skipped', lockedBy: lock.lockedBy };
      }

      await prisma.cronJobLock.upsert({
        where: { id: lockId },
        update: {
          lockedAt: now,
          lockedBy,
          expiresAt: lockExpiry,
        },
        create: {
          id: lockId,
          lockedAt: now,
          lockedBy,
          expiresAt: lockExpiry,
        },
      });
    } catch (err: any) {
      logger.warn({ err: err.message }, '[Reconciliation] Lock acquisition failed. Skipping run.');
      return { status: 'skipped', reason: 'lock_failed' };
    }

    logger.info({ lockedBy }, '[Reconciliation] Job lock acquired. Starting run.');
    const startTime = Date.now();
    let checkedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;

    try {
      // 2. Query refunds stuck in INITIATED / PROCESSING older than 2 hours
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const stuckRefunds = await prisma.refund.findMany({
        where: {
          status: {
            in: [RefundStatus.INITIATED, RefundStatus.PROCESSING],
          },
          initiatedAt: {
            lt: twoHoursAgo,
          },
          providerRefundId: {
            not: null,
          },
        },
      });

      checkedCount = stuckRefunds.length;

      for (const refund of stuckRefunds) {
        try {
          const updated = await paymentService.syncRefundStatus(refund.id);
          if (updated && updated.status === RefundStatus.PROCESSED) {
            updatedCount++;
          }
        } catch (err: any) {
          failedCount++;
          logger.error({ refundId: refund.id, err: err.message }, '[Reconciliation] Individual refund sync failed');
        }
      }
    } catch (err: any) {
      logger.error({ err: err.message }, '[Reconciliation] Critical error in reconciliation worker run');
    } finally {
      // 3. Release Lock
      try {
        await prisma.cronJobLock.delete({ where: { id: lockId } });
      } catch (err: any) {
        logger.warn({ err: err.message }, '[Reconciliation] Failed to release job lock');
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(
      { checkedCount, updatedCount, failedCount, duration },
      `[Reconciliation] Job Finished. Summary: Checked=${checkedCount}, Updated=${updatedCount}, Failed=${failedCount}, Duration=${duration}s`
    );

    return {
      status: 'completed',
      checkedCount,
      updatedCount,
      failedCount,
      duration,
    };
  },
};
