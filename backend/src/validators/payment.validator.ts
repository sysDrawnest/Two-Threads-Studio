import { z } from 'zod';

export const createRazorpayOrderSchema = z.object({
  params: z.object({
    orderId: z.string().min(1),
  }),
});

export const verifyPaymentSchema = z.object({
  params: z.object({
    orderId: z.string().min(1),
  }),
  body: z.object({
    razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
  }),
});

export const confirmCodSchema = z.object({
  params: z.object({
    orderId: z.string().min(1),
  }),
});

export const adminRefundSchema = z.object({
  params: z.object({
    paymentId: z.string().min(1),
  }),
  body: z.object({
    amount: z.number().positive().optional(),
    reason: z.string().max(500).optional(),
  }),
});
