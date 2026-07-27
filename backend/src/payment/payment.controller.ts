/**
 * Phase 7.4 Payment Controller
 * REST API controller handling config, order creation, HMAC verification, retry, and analytics.
 */

import { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service';
import { reconciliationEngine } from './payment.reconciliation';
import { paymentAnalytics } from './payment.analytics';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const paymentController = {
  /**
   * GET /api/v1/payments/config
   * Returns public Razorpay keyId, environment mode, and currency
   */
  getConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await paymentService.getPaymentConfig();
      return successResponse(res, config, 'Payment configuration retrieved');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/payments/orders/:orderId/razorpay-order
   * Create or resume Razorpay order
   */
  createRazorpayOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.orderId as string;
      const userId = (req.user as any).id;

      const result = await paymentService.createRazorpayOrder(orderId, userId);
      return successResponse(res, result, 'Razorpay order created successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/payments/orders/:orderId/verify
   * Verify HMAC signature from frontend popup callback
   */
  verifyPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.orderId as string;
      const userId = (req.user as any).id;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new AppError('Missing required Razorpay payment response parameters', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await paymentService.verifyPayment(
        orderId,
        userId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      return successResponse(res, result, 'Payment verified and order confirmed successfully');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/payments/reconcile
   * Run manual reconciliation job (Admin only)
   */
  reconcilePayments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await reconciliationEngine.runReconciliation(15);
      return successResponse(res, result, 'Payment reconciliation scan completed');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/payments/analytics
   * Admin Payment Observatory Analytics
   */
  getAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await paymentAnalytics.getAnalyticsSummary();
      return successResponse(res, summary, 'Payment analytics summary retrieved');
    } catch (err) {
      next(err);
    }
  },
};
