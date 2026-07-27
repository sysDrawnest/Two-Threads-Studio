import { z } from 'zod';
import { PromotionType } from '@prisma/client';

export const createCouponAdminSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code cannot exceed 20 characters')
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, 'Code can only contain letters, numbers, hyphens, and underscores'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional().nullable(),
  type: z.nativeEnum(PromotionType),
  discountValue: z.number().positive('Discount value must be a positive number'),
  maxDiscountAmount: z.number().positive('Max discount amount must be a positive number').optional().nullable(),
  minCartSubtotal: z.number().nonnegative('Minimum cart value must be zero or a positive number').default(0),
  usageLimit: z.number().int().positive('Usage limit must be a positive integer').optional().nullable(),
  perUserLimit: z.number().int().positive('Per user limit must be a positive integer').default(1),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  isStackable: z.boolean().default(false),
  isExclusive: z.boolean().default(false),
  isActive: z.boolean().default(true),
  eligibleCategories: z.array(z.string()).default([]),
  eligibleCollections: z.array(z.string()).default([]),
  eligibleProducts: z.array(z.string()).default([]),
  eligibleCustomerTiers: z.array(z.string()).default([]),
});

export const updateCouponAdminSchema = createCouponAdminSchema.partial().omit({ code: true });

export type CreateCouponAdminDto = z.infer<typeof createCouponAdminSchema>;
export type UpdateCouponAdminDto = z.infer<typeof updateCouponAdminSchema>;
