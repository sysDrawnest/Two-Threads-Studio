import { z } from 'zod';

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  sessionToken: z.string().optional(),
});

export const removeCouponSchema = z.object({
  sessionToken: z.string().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
});

export type ApplyCouponDto = z.infer<typeof applyCouponSchema>;
export type RemoveCouponDto = z.infer<typeof removeCouponSchema>;
export type ValidateCouponDto = z.infer<typeof validateCouponSchema>;
