/**
 * Phase 7.4 Payment Infrastructure Types & State Machine
 */

export enum PaymentStateMachine {
  CREATED = 'CREATED',
  INITIATED = 'INITIATED',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RETRY_PENDING = 'RETRY_PENDING',
  FAILED_FINAL = 'FAILED_FINAL',
  REFUND_REQUESTED = 'REFUND_REQUESTED',
  REFUND_INITIATED = 'REFUND_INITIATED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentConfigResponse {
  keyId: string;
  isLive: boolean;
  currency: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentAnalyticsSummary {
  totalPayments: number;
  capturedCount: number;
  failedCount: number;
  successRate: number;
  totalVolume: number;
  methodBreakdown: Record<string, number>;
  failureReasonCounts: Record<string, number>;
}
