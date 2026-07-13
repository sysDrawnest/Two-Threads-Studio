import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().cuid({ message: 'Invalid product ID format' }),
    variantId: z.string().cuid({ message: 'Invalid variant ID format' }).nullable().optional(),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
    customization: z.record(z.string(), z.any()).nullable().optional(),
    giftWrap: z.boolean().default(false).optional(),
    engravingText: z.string().max(100).trim().nullable().optional(),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1').optional(),
    customization: z.record(z.string(), z.any()).nullable().optional(),
    giftWrap: z.boolean().optional(),
    engravingText: z.string().max(100).trim().nullable().optional(),
  }),
});

export const mergeCartSchema = z.object({
  body: z.object({
    guestId: z.string().min(1, 'guestId is required'),
  }),
});

export type AddCartItemDto = z.infer<typeof addCartItemSchema>['body'];
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>['body'];
export type MergeCartDto = z.infer<typeof mergeCartSchema>['body'];
