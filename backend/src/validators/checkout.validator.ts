import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  sessionToken: z.string().optional(),
});

export const updateCheckoutCustomerSchema = z.object({
  customerEmail: z.string().email('Enter a valid email address'),
  customerPhone: z.string().min(10, 'Enter valid 10-digit phone number'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
});

export const updateCheckoutAddressSchema = z.object({
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
  billingAddressId: z.string().optional(),
  billingSameAsShipping: z.boolean().optional().default(true),
});

export const updateCheckoutShippingSchema = z.object({
  shippingMethodId: z.string().min(1, 'Shipping method is required'),
});

export type CreateCheckoutSessionDto = z.infer<typeof createCheckoutSessionSchema>;
export type UpdateCheckoutCustomerDto = z.infer<typeof updateCheckoutCustomerSchema>;
export type UpdateCheckoutAddressDto = z.infer<typeof updateCheckoutAddressSchema>;
export type UpdateCheckoutShippingDto = z.infer<typeof updateCheckoutShippingSchema>;
