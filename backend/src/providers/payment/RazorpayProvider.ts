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

export const razorpayProvider: PaymentProvider = {
  async createOrder(params: CreateProviderOrderParams): Promise<ProviderOrderResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

    try {
      if (!keyId || !keySecret || keyId.includes('dummy') || keyId.includes('your_')) {
        const mockOrderId = `order_mock_${Date.now().toString(36)}`;
        return {
          providerOrderId: mockOrderId,
          amount: params.amount,
          currency: params.currency,
          status: 'created',
          raw: { id: mockOrderId, amount: params.amount, currency: params.currency },
        };
      }

      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order: any = await razorpay.orders.create({
        amount: Math.round(params.amount), // ensure integer paise
        currency: params.currency || 'INR',
        receipt: (params.receipt || params.orderId).slice(0, 40),
        notes: (params.notes as Record<string, string>) || {
          orderId: params.orderId,
        },
      });

      if (!order || typeof order !== 'object' || !order.id) {
        throw new AppError('Razorpay API returned an invalid order object', HTTP_STATUS.BAD_GATEWAY);
      }

      return {
        providerOrderId: order.id,
        amount: Number(order.amount || params.amount),
        currency: order.currency || params.currency,
        status: order.status || 'created',
        raw: (order as Record<string, unknown>) || {},
      };
    } catch (err: any) {
      if (err instanceof AppError) throw err;

      console.error('[RazorpayProvider ERROR]: Name:', err?.name);
      console.error('[RazorpayProvider ERROR]: Message:', err?.message);
      console.error('[RazorpayProvider ERROR]: Status Code:', err?.statusCode);
      console.error('[RazorpayProvider ERROR]: Description:', err?.error?.description || err?.description);
      console.error('[RazorpayProvider ERROR]: Full JSON:', JSON.stringify(err, null, 2));

      const errorMessage =
        err?.error?.description ||
        err?.description ||
        err?.message ||
        (typeof err === 'string' ? err : 'Razorpay API failure');

      throw new AppError(
        `Razorpay order creation failed: ${errorMessage}`,
        HTTP_STATUS.BAD_GATEWAY
      );
    }
  },

  verifySignature(params: VerifySignatureParams): boolean {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

    if (!keyId || keyId.includes('dummy') || keyId.includes('your_') || params.providerOrderId?.startsWith('order_mock_')) {
      return true;
    }

    if (!keySecret) {
      throw new AppError('Razorpay key secret is not configured', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const { providerOrderId, providerPaymentId, providerSignature } = params;
    const body = `${providerOrderId}|${providerPaymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const providedBuf = Buffer.from(providerSignature, 'utf8');

    if (expectedBuf.length !== providedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  },

  async processRefund(params: RefundParams): Promise<RefundResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

    try {
      if (!keyId || !keySecret || keyId.includes('dummy') || keyId.includes('your_')) {
        const mockRefundId = `rfnd_mock_${Date.now().toString(36)}`;
        return {
          refundId: mockRefundId,
          status: 'processed',
          amount: params.amount || 0,
          raw: { id: mockRefundId, status: 'processed', amount: params.amount || 0 },
        };
      }

      const options: any = {
        key_id: keyId,
        key_secret: keySecret,
      };
      if (params.idempotencyKey) {
        options.headers = { 'X-Payment-Idempotency': params.idempotencyKey };
      }

      const razorpay = new Razorpay(options);

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
      console.error('[RazorpayProvider Refund ERROR]: Name:', err?.name);
      console.error('[RazorpayProvider Refund ERROR]: Message:', err?.message);
      console.error('[RazorpayProvider Refund ERROR]: Status Code:', err?.statusCode);
      console.error('[RazorpayProvider Refund ERROR]: Description:', err?.error?.description || err?.description);
      console.error('[RazorpayProvider Refund ERROR]: Full JSON:', JSON.stringify(err, null, 2));

      const errorMessage =
        err?.error?.description ||
        err?.description ||
        err?.message ||
        (typeof err === 'string' ? err : 'Razorpay gateway failure');

      throw new AppError(
        `Razorpay refund failed: ${errorMessage}`,
        HTTP_STATUS.BAD_GATEWAY
      );
    }
  },

  async fetchRefund(refundId: string): Promise<RefundResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

    if (!keyId || !keySecret || keyId.includes('dummy') || keyId.includes('your_')) {
      return {
        refundId,
        status: 'processed',
        amount: 0,
        raw: { id: refundId, status: 'processed' },
      };
    }

    try {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const refund: any = await razorpay.refunds.fetch(refundId);
      return {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount as number,
        raw: refund as unknown as Record<string, unknown>,
      };
    } catch (err: any) {
      throw new AppError(
        `Failed to fetch refund from Razorpay: ${err?.error?.description || err.message}`,
        HTTP_STATUS.BAD_GATEWAY
      );
    }
  },
};
