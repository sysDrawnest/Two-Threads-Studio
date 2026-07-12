import { z } from 'zod';

// ─── Base ─────────────────────────────────────────────────────────────────────
const collectionBaseSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100).trim(),
  description: z.string().max(500).trim().optional(),
  bannerImage: z.string().url('Banner image must be a valid URL').optional(),
  isActive:    z.boolean().default(true),
  sortOrder:   z.number().int().nonnegative().default(0),
});

// ─── Create ───────────────────────────────────────────────────────────────────
export const createCollectionSchema = z.object({
  body: collectionBaseSchema,
});

export type CreateCollectionDto = z.infer<typeof createCollectionSchema>['body'];

// ─── Update ───────────────────────────────────────────────────────────────────
export const updateCollectionSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid collection ID'),
  }),
  body: collectionBaseSchema.partial(),
});

export type UpdateCollectionDto = z.infer<typeof updateCollectionSchema>['body'];

// ─── ID Param ─────────────────────────────────────────────────────────────────
export const collectionIdParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid collection ID'),
  }),
});
