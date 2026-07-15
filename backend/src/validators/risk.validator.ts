/**
 * Risk Validators — Phase 5C
 */

import { z } from 'zod';

export const codEligibilitySchema = z.object({
  query: z.object({
    orderTotal: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid amount'),
    productIds: z.string().optional(), // comma-separated
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    recipient: z.string().min(10, 'Phone number must be at least 10 digits').max(13),
    purpose: z.enum([
      'FIRST_ORDER_VERIFICATION',
      'COD_VERIFICATION',
      'HIGH_VALUE_ORDER',
      'PHONE_CHANGE',
      'PHONE_REGISTRATION',
    ]),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    recipient: z.string().min(10).max(13),
    purpose: z.enum([
      'FIRST_ORDER_VERIFICATION',
      'COD_VERIFICATION',
      'HIGH_VALUE_ORDER',
      'PHONE_CHANGE',
      'PHONE_REGISTRATION',
    ]),
    otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/),
  }),
});

export const adminBlockSchema = z.object({
  body: z.object({
    isBlocked: z.boolean(),
    blockReason: z.string().optional(),
  }),
});

export const adminNotesSchema = z.object({
  body: z.object({
    notes: z.string().max(500),
  }),
});

export const reviewQueueActionSchema = z.object({
  body: z.object({
    note: z.string().optional(),
  }),
});

export const returnPolicySchema = z.object({
  body: z.object({
    eligibility: z.enum(['FULL_RETURN', 'EXCHANGE_ONLY', 'NO_RETURN']),
    windowDays: z.number().int().min(0).max(30),
    reason: z.string().optional(),
  }),
});

export const pinLookupSchema = z.object({
  query: z.object({
    pin: z.string().length(6).regex(/^\d{6}$/),
    state: z.string().optional(),
    city: z.string().optional(),
  }),
});
