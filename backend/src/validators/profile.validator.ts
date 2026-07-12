import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name cannot be empty').max(50).trim().optional(),
    lastName: z.string().min(1, 'Last name cannot be empty').max(50).trim().optional(),
    phone: z.string().trim().nullable().optional(),
    avatarUrl: z.string().url('Invalid avatar URL').nullable().optional().or(z.literal('')),
    dateOfBirth: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? new Date(val) : val),
      z.date().nullable().optional()
    ),
    gender: z.string().max(20).nullable().optional(),
    profileImage: z.string().url('Invalid profile image URL').nullable().optional().or(z.literal('')),
    preferredLanguage: z.string().min(2).max(10).default('en').optional(),
    newsletterSubscribed: z.boolean().optional(),
    marketingConsent: z.boolean().optional(),
  }),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>['body'];
