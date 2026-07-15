/**
 * Payment Provider Factory
 *
 * Returns the correct PaymentProvider based on environment configuration.
 * To add a new provider (e.g., StripeProvider), add a case here.
 */

import type { PaymentProvider } from './PaymentProvider.interface';
import { razorpayProvider } from './RazorpayProvider';

type ProviderName = 'razorpay';

export function getPaymentProvider(name: ProviderName = 'razorpay'): PaymentProvider {
  switch (name) {
    case 'razorpay':
      return razorpayProvider;
    default:
      throw new Error(`Unknown payment provider: ${name}`);
  }
}

// Default singleton — used by payment.service.ts
export const paymentProvider: PaymentProvider = getPaymentProvider('razorpay');
