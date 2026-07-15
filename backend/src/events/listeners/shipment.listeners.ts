/**
 * Shipment Event Listeners
 */

import { eventDispatcher } from '../LocalEventDispatcher';
import { ShipmentEvents } from '../OrderEvents';
import { orderNotifications } from '../../notifications/order.notifications';
import logger from '../../lib/logger';

eventDispatcher.on(ShipmentEvents.CREATED, async ({ order, shipment }: any) => {
  logger.info(
    { orderId: order.id, orderNumber: order.orderNumber, shipmentId: shipment.id },
    'Event Listener: shipment.created'
  );
  orderNotifications.onShipmentCreated(order, shipment).catch((err) => {
    logger.error({ err }, 'Failed to send shipment created notification');
  });
});

eventDispatcher.on(ShipmentEvents.SHIPPED, async ({ order, shipment }: any) => {
  logger.info(
    { orderId: order.id, shipmentId: shipment.id, trackingNumber: shipment.trackingNumber },
    'Event Listener: shipment.shipped'
  );
  orderNotifications.onOrderShipped(order, shipment).catch((err) => {
    logger.error({ err }, 'Failed to send order shipped notification');
  });
});

eventDispatcher.on(ShipmentEvents.DELIVERED, async ({ order }: any) => {
  logger.info({ orderId: order.id, orderNumber: order.orderNumber }, 'Event Listener: shipment.delivered');
  orderNotifications.onOrderDelivered(order).catch((err) => {
    logger.error({ err }, 'Failed to send order delivered notification');
  });
});
