import { z } from 'zod';

// ─── Password Rule ────────────────────────────────────────────────────────────
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').max(50).trim(),
    lastName: z.string().min(1, 'Last name is required').max(50).trim(),
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: passwordSchema,
  }),
});

export type RegisterDto = z.infer<typeof registerSchema>['body'];

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type LoginDto = z.infer<typeof loginSchema>['body'];

// ─── Refresh ──────────────────────────────────────────────────────────────────
export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export type RefreshDto = z.infer<typeof refreshSchema>['body'];

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: passwordSchema,
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'New password must be different from current password',
      path: ['newPassword'],
    }),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>['body'];
