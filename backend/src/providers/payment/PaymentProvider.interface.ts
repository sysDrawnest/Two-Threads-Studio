/**
 * PaymentProvider Interface
 *
 * Abstract contract for all payment providers. Controllers and services
 * depend on this interface — not on Razorpay, Stripe, or any specific SDK.
 *
 * To add a new provider: implement this interface and register in the factory.
 */

export interface CreateProviderOrderParams {
  /** Internal order ID (from database) */
  orderId: string;
  /** Amount in smallest currency unit (paise for INR) */
  amount: number;
  /** ISO 4217 currency code */
  currency: string;
  /** Short description shown to payer */
  receipt?: string;
  /** Free-form notes stored on the provider order */
  notes?: Record<string, string>;
}

export interface ProviderOrderResult {
  /** Provider-generated order ID */
  providerOrderId: string;
  /** Actual amount to charge (may differ if provider rounds) */
  amount: number;
  currency: string;
  /** Provider-specific status (e.g. "created") */
  status: string;
  /** Raw provider response for auditability */
  raw: Record<string, unknown>;
}

export interface VerifySignatureParams {
  /** Provider order ID */
  providerOrderId: string;
  /** Provider payment ID returned by the SDK popup */
  providerPaymentId: string;
  /** HMAC signature returned by the SDK popup */
  providerSignature: string;
}

export interface RefundParams {
  /** Provider payment ID to refund */
  providerPaymentId: string;
  /** Amount in smallest currency unit; omit for full refund */
  amount?: number;
  /** Reason shown to customer / provider */
  reason?: string;
}

export interface RefundResult {
  /** Provider-generated refund ID */
  refundId: string;
  status: string;
  amount: number;
  raw: Record<string, unknown>;
}

export interface PaymentProvider {
  /**
   * Create a payment order on the provider side.
   * Returns the providerOrderId needed to open the payment popup.
   */
  createOrder(params: CreateProviderOrderParams): Promise<ProviderOrderResult>;

  /**
   * Verify a payment's HMAC signature.
   * Returns true if the signature is valid and the payment has not been tampered.
   * MUST be called server-side — never trust the frontend.
   */
  verifySignature(params: VerifySignatureParams): boolean;

  /**
   * Process a full or partial refund.
   */
  processRefund(params: RefundParams): Promise<RefundResult>;
}
