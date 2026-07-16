/**
 * Payment Event Listeners
 *
 * Responds to payment domain events by triggering notifications.
 * Does NOT call services or providers — purely notification orchestration.
 */

import { eventDispatcher } from '../LocalEventDispatcher';
import { PaymentEvents } from '../OrderEvents';
import { orderNotifications } from '../../notifications/order.notifications';
import logger from '../../lib/logger';

eventDispatcher.on(PaymentEvents.CAPTURED, async ({ order, payment }: any) => {
  logger.info({
    type: 'payment_verified',
    orderNo: order.orderNumber,
    gateway: payment.gateway || 'Razorpay',
    transaction: payment.id || 'N/A',
    amount: Number(order.grandTotal),
    status: 'SUCCESS',
  });
  orderNotifications.onPaymentCaptured(order, payment).catch((err) => {
    logger.error({ err }, 'Failed to send payment captured notification');
  });
});

eventDispatcher.on(PaymentEvents.FAILED, async ({ order, payment }: any) => {
  logger.info({
    type: 'payment_error',
    orderNo: order.orderNumber,
    provider: payment.gateway || 'Razorpay',
    message: payment.errorMessage || 'Transaction Failed',
  });
  orderNotifications.onPaymentFailed(order, payment).catch((err) => {
    logger.error({ err }, 'Failed to send payment failed notification');
  });
});

eventDispatcher.on(PaymentEvents.REFUND_INITIATED, async ({ order, payment, refundAmount }: any) => {
  logger.info(
    { orderId: order.id, paymentId: payment.id, refundAmount },
    'Event Listener: payment.refund_initiated'
  );
  orderNotifications.onRefundInitiated(order, refundAmount).catch((err) => {
    logger.error({ err }, 'Failed to send refund initiated notification');
  });
});
