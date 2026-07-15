/**
 * RazorpayProvider
 *
 * Concrete implementation of PaymentProvider for Razorpay.
 * All Razorpay-specific SDK calls are isolated here.
 * The rest of the application interacts with PaymentProvider only.
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS } from '../../constants/httpStatus';
import type {
  PaymentProvider,
  CreateProviderOrderParams,
  ProviderOrderResult,
  VerifySignatureParams,
  RefundParams,
  RefundResult,
} from './PaymentProvider.interface';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  // Warn at module load — not a hard crash so dev can still start without Razorpay
  console.warn(
    '[RazorpayProvider] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. ' +
      'Razorpay calls will fail at runtime.'
  );
}

const razorpay = new Razorpay({
  key_id: keyId || '',
  key_secret: keySecret || '',
});

export const razorpayProvider: PaymentProvider = {
  async createOrder(params: CreateProviderOrderParams): Promise<ProviderOrderResult> {
    try {
      const order = await razorpay.orders.create({
        amount: params.amount, // paise
        currency: params.currency,
        receipt: params.receipt || params.orderId.slice(0, 40),
        notes: params.notes as Record<string, string> || {
          orderId: params.orderId,
        },
      });

      return {
        providerOrderId: order.id,
        amount: order.amount as number,
        currency: order.currency,
        status: order.status,
        raw: order as unknown as Record<string, unknown>,
      };
    } catch (err: any) {
      throw new AppError(
        `Razorpay order creation failed: ${err?.error?.description || err.message}`,
        HTTP_STATUS.BAD_GATEWAY
      );
    }
  },

  verifySignature(params: VerifySignatureParams): boolean {
    if (!keySecret) {
      throw new AppError('Razorpay key secret is not configured', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const { providerOrderId, providerPaymentId, providerSignature } = params;
    const body = `${providerOrderId}|${providerPaymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providerSignature, 'hex')
    );
  },

  async processRefund(params: RefundParams): Promise<RefundResult> {
    try {
      const refundPayload: any = {
        speed: 'normal',
        notes: { reason: params.reason || 'Customer refund' },
      };
      if (params.amount) {
        refundPayload.amount = params.amount;
      }

      const refund = await razorpay.payments.refund(params.providerPaymentId, refundPayload);

      return {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount as number,
        raw: refund as unknown as Record<string, unknown>,
      };
    } catch (err: any) {
      throw new AppError(
        `Razorpay refund failed: ${err?.error?.description || err.message}`,
        HTTP_STATUS.BAD_GATEWAY
      );
    }
  },
};
