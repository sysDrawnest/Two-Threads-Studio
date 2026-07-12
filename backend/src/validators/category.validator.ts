import { z } from 'zod';

// ─── Base ─────────────────────────────────────────────────────────────────────
const categoryBaseSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100).trim(),
  description: z.string().max(500).trim().optional(),
  image:       z.string().url('Image must be a valid URL').optional(),
  isActive:    z.boolean().default(true),
  sortOrder:   z.number().int().nonnegative().default(0),
});

// ─── Create ───────────────────────────────────────────────────────────────────
export const createCategorySchema = z.object({
  body: categoryBaseSchema,
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>['body'];

// ─── Update ───────────────────────────────────────────────────────────────────
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid category ID'),
  }),
  body: categoryBaseSchema.partial(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>['body'];

// ─── ID Param ─────────────────────────────────────────────────────────────────
export const categoryIdParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid category ID'),
  }),
});
