import { z } from 'zod';

export const addToWishlistSchema = z.object({
  body: z.object({
    productId: z.string().cuid({ message: 'Invalid product ID format' }),
  }),
});

export const moveToCartSchema = z.object({
  body: z.object({
    variantId: z.string().cuid({ message: 'Invalid variant ID format' }).nullable().optional(),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
    customization: z.record(z.string(), z.any()).nullable().optional(),
    giftWrap: z.boolean().default(false).optional(),
    engravingText: z.string().max(100).trim().nullable().optional(),
  }).optional(),
});

export type AddToWishlistDto = z.infer<typeof addToWishlistSchema>['body'];
export type MoveToCartDto = z.infer<typeof moveToCartSchema>['body'];
