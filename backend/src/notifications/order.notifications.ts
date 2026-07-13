import logger from '../lib/logger';
import { Order } from '@prisma/client';

export const orderNotifications = {
  onOrderCreated: async (order: Order): Promise<void> => {
    logger.info({ orderId: order.id, orderNumber: order.orderNumber }, '🔔 Hook: Order Created Notification (stub)');
  },

  onOrderConfirmed: async (order: Order): Promise<void> => {
    logger.info({ orderId: order.id, orderNumber: order.orderNumber }, '🔔 Hook: Order Confirmed Notification (stub)');
  },

  onOrderShipped: async (order: Order): Promise<void> => {
    logger.info({ orderId: order.id, orderNumber: order.orderNumber }, '🔔 Hook: Order Shipped Notification (stub)');
  },

  onOrderDelivered: async (order: Order): Promise<void> => {
    logger.info({ orderId: order.id, orderNumber: order.orderNumber }, '🔔 Hook: Order Delivered Notification (stub)');
  },
};
