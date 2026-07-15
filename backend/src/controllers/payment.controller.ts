import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { HTTP_STATUS } from '../constants/httpStatus';
import { successResponse } from '../utils/response';


export const paymentController = {
  /**
   * POST /api/payments/orders/:orderId/razorpay-order
   * Creates a Razorpay order and returns it to the frontend for popup
   */
  createRazorpayOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await paymentService.createRazorpayOrder(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, result, 'Razorpay order created');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/payments/orders/:orderId/verify
   * Verifies Razorpay signature after popup success
   */
  verifyPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const result = await paymentService.verifyPayment(
        req.params['orderId'] as string,
        req.user!.id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      return successResponse(res, result, 'Payment verified successfully');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/payments/orders/:orderId/cod
   * Confirms a COD order (no Razorpay involved)
   */
  confirmCodOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await paymentService.confirmCodOrder(req.params['orderId'] as string, req.user!.id);
      return successResponse(res, result, 'COD order confirmed');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/payments/orders/:orderId
   * Get payment status for an order (customer)
   */
  getPaymentStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await paymentService.getPaymentByOrderId(req.params['orderId'] as string, req.user!.id);
      return successResponse(res, payment);
    } catch (err) {
      next(err);
    }
  },

  // ── Admin ──────────────────────────────────────────────────────────────────

  adminListPayments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, page, limit } = req.query as any;
      const result = await paymentService.adminListPayments(
        { status },
        Number(page) || 1,
        Number(limit) || 10
      );
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  adminProcessRefund: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, reason } = req.body;
      const result = await paymentService.processRefund(
        req.params['paymentId'] as string,
        req.user!.id,
        amount,
        reason
      );
      return successResponse(res, result, 'Refund processed successfully');
    } catch (err) {
      next(err);
    }
  },
};
