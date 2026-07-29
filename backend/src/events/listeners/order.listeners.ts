import { eventDispatcher } from '../LocalEventDispatcher';
import { OrderEvents } from '../OrderEvents';
import { orderNotifications } from '../../notifications/order.notifications';
import prisma from '../../prisma';
import logger from '../../lib/logger';
import { AuditAction, AuditActorType } from '@prisma/client';

// Listen to order.created
eventDispatcher.on(OrderEvents.CREATED, (order: any) => {
  logger.info({
    type: 'order_created',
    orderNo: order.orderNumber,
    customer: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Guest',
    amount: Number(order.grandTotal),
    payment: order.paymentMethod,
    risk: (order.user?.customerRisk?.trustScore ?? 100) < 40 ? 'HIGH' : 'LOW',
  });
  orderNotifications.onOrderCreated(order).catch((err) => {
    logger.error({ err }, 'Failed to process order creation notification');
  });
});

// Listen to order.cancelled
eventDispatcher.on(OrderEvents.CANCELLED, (order: any) => {
  logger.info({ orderId: order.id, orderNumber: order.orderNumber }, 'Event Listener: order.cancelled');
  // Notification stub or background jobs
});

// Listen to order.status_changed
eventDispatcher.on(OrderEvents.STATUS_CHANGED, ({ order, previousStatus, newStatus }: any) => {
  logger.info(
    { orderId: order.id, orderNumber: order.orderNumber, previousStatus, newStatus },
    'Event Listener: order.status_changed'
  );

  if (newStatus === 'CONFIRMED') {
    orderNotifications.onOrderConfirmed(order).catch(() => {});
  } else if (newStatus === 'SHIPPED') {
    orderNotifications.onOrderShipped(order).catch(() => {});
  } else if (newStatus === 'DELIVERED') {
    orderNotifications.onOrderDelivered(order).catch(() => {});
  }
});

// Listen to order.invoice_viewed
eventDispatcher.on(OrderEvents.INVOICE_VIEWED, async ({ orderId, userId, actorType, details }: any) => {
  logger.info({ orderId, userId, actorType }, 'Event Listener: order.invoice_viewed');
  try {
    await prisma.orderAuditLog.create({
      data: {
        orderId,
        action: AuditAction.INVOICE_VIEWED,
        actorType: actorType || AuditActorType.CUSTOMER,
        actorId: userId || 'SYSTEM',
        details: details || {},
      },
    });
  } catch (err) {
    logger.error({ err }, 'Failed to write invoice viewed audit log');
  }
});

// Listen to ReturnEvents
eventDispatcher.on('return.requested', ({ returnRequest }: any) => {
  logger.info({ returnRequestId: returnRequest?.id }, 'Event Listener: return.requested');
});

eventDispatcher.on('return.approved', ({ returnRequest }: any) => {
  logger.info({ returnRequestId: returnRequest?.id }, 'Event Listener: return.approved — sending pickup instructions');
});

eventDispatcher.on('return.picked_up', ({ returnRequest }: any) => {
  logger.info({ returnRequestId: returnRequest?.id }, 'Event Listener: return.picked_up — package in transit');
});

eventDispatcher.on('return.received', ({ returnRequest }: any) => {
  logger.info({ returnRequestId: returnRequest?.id }, 'Event Listener: return.received — queued for inspection');
});

eventDispatcher.on('return.inspection_passed', ({ returnRequest }: any) => {
  logger.info({ returnRequestId: returnRequest?.id }, 'Event Listener: return.inspection_passed — processing refund');
});

eventDispatcher.on('return.inspection_failed', ({ returnRequest }: any) => {
  logger.info({ returnRequestId: returnRequest?.id }, 'Event Listener: return.inspection_failed');
});

eventDispatcher.on('return.refunded', ({ returnRequest, finalRefund }: any) => {
  logger.info({ returnRequestId: returnRequest?.id, finalRefund }, 'Event Listener: return.refunded — return closed');
});

eventDispatcher.on('return.rejected', ({ returnRequest, note }: any) => {
  logger.info({ returnRequestId: returnRequest?.id, note }, 'Event Listener: return.rejected');
});
