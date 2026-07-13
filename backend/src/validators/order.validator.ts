import { z } from 'zod';
import { OrderStatus, PaymentMethod, CouponType } from '@prisma/client';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().min(1, 'Shipping address ID is required'),
    billingAddressId: z.string().min(1, 'Billing address ID is required'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').nullable().optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional().default(PaymentMethod.ONLINE),
    couponCode: z.string().nullable().optional(),
    couponDiscount: z.number().min(0).optional().default(0),
    promotionId: z.string().nullable().optional(),
    couponType: z.nativeEnum(CouponType).nullable().optional(),
  }),
});

export const cancelOrderSchema = z.object({
  body: z.object({
    reason: z.string().max(200, 'Cancellation reason is too long').optional(),
  }),
});

export const adminUpdateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus),
    note: z.string().max(500, 'Note is too long').optional(),
  }),
});

export const adminUpdateOrderNoteSchema = z.object({
  body: z.object({
    note: z.string().max(500, 'Note is too long'),
  }),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>['body'];
export type CancelOrderDto = z.infer<typeof cancelOrderSchema>['body'];
export type AdminUpdateOrderStatusDto = z.infer<typeof adminUpdateOrderStatusSchema>['body'];
export type AdminUpdateOrderNoteDto = z.infer<typeof adminUpdateOrderNoteSchema>['body'];
