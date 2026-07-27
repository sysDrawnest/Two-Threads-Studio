/**
 * Phase 7.4 Payment Reconciliation Engine
 * Automatically queries PENDING payments older than 15 minutes to reconcile orphaned orders.
 */

import prisma from '../prisma';
import { paymentService } from './payment.service';
import logger from '../lib/logger';
import { PaymentStatus } from '@prisma/client';

export const reconciliationEngine = {
  /**
   * Run reconciliation job on pending payments
   */
  runReconciliation: async (thresholdMinutes = 15) => {
    const cutoffTime = new Date(Date.now() - thresholdMinutes * 60 * 1000);

    logger.info({ cutoffTime }, '[ReconciliationEngine] Starting reconciliation scan for PENDING payments...');

    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.PENDING,
        createdAt: { lte: cutoffTime },
        providerOrderId: { not: null },
      },
      include: {
        order: true,
      },
      take: 50,
    });

    logger.info(`[ReconciliationEngine] Found ${pendingPayments.length} pending payments to reconcile.`);

    let reconciledCount = 0;
    let failedCount = 0;

    for (const payment of pendingPayments) {
      try {
        // If payment is pending past threshold and has no captured reference, mark as expired/failed
        if (payment.order && payment.order.orderStatus === 'PENDING') {
          await paymentService.handlePaymentFailure(
            payment.orderId,
            'Payment session expired after 15 minutes of inactivity',
            'SESSION_EXPIRED'
          );
          failedCount++;
        }
      } catch (err) {
        logger.error({ err, paymentId: payment.id }, '[ReconciliationEngine] Error reconciling payment');
      }
    }

    logger.info(
      { reconciledCount, failedCount, totalScanned: pendingPayments.length },
      '[ReconciliationEngine] Reconciliation scan completed.'
    );

    return {
      scanned: pendingPayments.length,
      reconciled: reconciledCount,
      failed: failedCount,
    };
  },
};
