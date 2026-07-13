import { z } from 'zod';
import { AddressType } from '@prisma/client';

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required').max(100).trim(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number cannot exceed 15 digits').trim(),
    company: z.string().max(100).trim().nullable().optional(),
    line1: z.string().min(1, 'Address line 1 is required').max(150).trim(),
    line2: z.string().max(150).trim().nullable().optional(),
    city: z.string().min(1, 'City is required').max(100).trim(),
    district: z.string().max(100).trim().nullable().optional(),
    state: z.string().min(1, 'State is required').max(100).trim(),
    country: z.string().min(2, 'Country is required').max(100).trim(),
    postalCode: z.string().min(4, 'Postal code is too short').max(10, 'Postal code is too long').trim(),
    landmark: z.string().max(100).trim().nullable().optional(),
    type: z.nativeEnum(AddressType).default(AddressType.HOME),
    isDefaultBilling: z.boolean().default(false).optional(),
    isDefaultShipping: z.boolean().default(false).optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: createAddressSchema.shape.body.partial(),
});

export const setDefaultAddressSchema = z.object({
  body: z.object({
    type: z.enum(['shipping', 'billing', 'both']),
  }),
});

export type CreateAddressDto = z.infer<typeof createAddressSchema>['body'];
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>['body'];
export type SetDefaultAddressDto = z.infer<typeof setDefaultAddressSchema>['body'];
