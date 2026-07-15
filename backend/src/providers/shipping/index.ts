/**
 * Shipping Provider Factory
 *
 * Reads SHIPPING_PROVIDER from environment and returns the correct implementation.
 * Default: MockShippingProvider (safe for development).
 */

import type { ShippingProvider } from './ShippingProvider.interface';
import { mockShippingProvider } from './MockShippingProvider';

type ShippingProviderName = 'mock';

export function getShippingProvider(
  name: ShippingProviderName = (process.env.SHIPPING_PROVIDER as ShippingProviderName) || 'mock'
): ShippingProvider {
  switch (name) {
    case 'mock':
      return mockShippingProvider;
    default:
      console.warn(`[ShippingProvider] Unknown provider "${name}", falling back to mock.`);
      return mockShippingProvider;
  }
}

// Default singleton used by shipment.service.ts
export const shippingProvider: ShippingProvider = getShippingProvider();
