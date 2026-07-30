/**
 * return.events.ts — Domain Events for Return Workflow
 */

export const ReturnEvents = {
  REQUESTED: 'return.requested',
  APPROVED: 'return.approved',
  PICKUP_CREATED: 'return.pickup_created',
  PICKED_UP: 'return.picked_up',
  RECEIVED: 'return.received',
  INSPECTION_COMPLETED: 'return.inspection_completed',
  REFUND_INITIATED: 'return.refund_initiated',
  REFUNDED: 'return.refunded',
  REJECTED: 'return.rejected',
} as const;
