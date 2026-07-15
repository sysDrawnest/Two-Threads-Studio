export const OrderEvents = {
  CREATED: 'order.created',
  CANCELLED: 'order.cancelled',
  STATUS_CHANGED: 'order.status_changed',
  INVOICE_VIEWED: 'order.invoice_viewed',
};

export const PaymentEvents = {
  CAPTURED: 'payment.captured',
  FAILED: 'payment.failed',
  REFUND_INITIATED: 'payment.refund_initiated',
};

export const ShipmentEvents = {
  CREATED: 'shipment.created',
  SHIPPED: 'shipment.shipped',
  DELIVERED: 'shipment.delivered',
};
