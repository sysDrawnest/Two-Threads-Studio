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

export const returnOrderSchema = z.object({
  body: z.object({
    reason: z.enum([
      'DAMAGED', 'WRONG_PRODUCT', 'DEFECTIVE', 'NOT_AS_DESCRIBED',
      'SIZE_ISSUE', 'COLOR_DIFFERENCE', 'QUALITY_ISSUE',
      'MISSING_PARTS', 'CHANGED_MIND', 'OTHER'
    ] as const),
    notes: z.string().max(500).optional(),
    mediaUrls: z.array(z.string()).max(10).optional().default([]),
    refundType: z.enum(['ORIGINAL_PAYMENT', 'STORE_CREDIT', 'WALLET_CREDIT', 'GIFT_CARD']).optional().default('ORIGINAL_PAYMENT'),
    items: z.array(z.object({
      orderItemId: z.string().min(1),
      quantity: z.number().int().min(1),
      reason: z.string().max(200).optional(),
    })).min(1, 'Select at least one item to return'),
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
export type ReturnOrderDto = z.infer<typeof returnOrderSchema>['body'];
export type AdminUpdateOrderStatusDto = z.infer<typeof adminUpdateOrderStatusSchema>['body'];
export type AdminUpdateOrderNoteDto = z.infer<typeof adminUpdateOrderNoteSchema>['body'];

export const adminApproveReturnSchema = z.object({
  body: z.object({
    note: z.string().max(500).optional(),
    approvedAmount: z.number().positive().optional(),
    refundType: z.enum(['ORIGINAL_PAYMENT', 'STORE_CREDIT', 'WALLET_CREDIT', 'GIFT_CARD']).optional(),
  }),
});

export const adminRejectReturnSchema = z.object({
  body: z.object({
    note: z.string().min(10, 'Rejection reason must be at least 10 characters').max(500),
  }),
});

export const adminInspectReturnSchema = z.object({
  body: z.object({
    passed: z.boolean(),
    disposition: z.enum(['RESTOCK', 'DAMAGED', 'REPAIR', 'DISPOSE', 'QUALITY_CHECK']).optional(),
    note: z.string().max(500).optional(),
    adjustedAmount: z.number().positive().optional(),
  }),
});
