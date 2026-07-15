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
  RETURNED: 'shipment.returned',
};

export const RiskEvents = {
  TRUST_SCORE_UPDATED: 'risk.trust_score_updated',
  ORDER_FLAGGED: 'risk.order_flagged',
  COD_BLOCKED: 'risk.cod_blocked',
};
