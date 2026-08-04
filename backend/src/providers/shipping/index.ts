/**
 * Shipping Provider Factory
 *
 * Reads SHIPPING_PROVIDER from environment and returns the correct provider.
 * Default: MockShippingProvider (safe for development — no external API calls).
 *
 * To switch providers:
 *  1. Set SHIPPING_PROVIDER=shiprocket in .env
 *  2. Add SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_CHANNEL_ID
 *  3. Zero changes required to services, controllers, or UI
 *
 * Provider capability system:
 *  All providers expose a `capabilities` object.
 *  Use `shippingProvider.capabilities.supportsXxx` to guard optional operations.
 */

import type { ShippingProvider } from './interfaces/ShippingProvider';
import { mockShippingProvider } from './mock/MockShippingProvider';
import { shiprocketProvider } from './shiprocket/ShiprocketProvider';

export type ShippingProviderName = 'mock' | 'shiprocket' | 'delhivery' | 'nimbuspost';

export function getShippingProvider(
  name: ShippingProviderName = (process.env['SHIPPING_PROVIDER'] as ShippingProviderName) || 'mock'
): ShippingProvider {
  switch (name) {
    case 'mock':
      return mockShippingProvider;
    case 'shiprocket':
      return shiprocketProvider;

    default:
      console.warn(
        `[ShippingFactory] Unknown provider "${name}", falling back to MockShippingProvider.`
      );
      return mockShippingProvider;
  }
}

/**
 * Singleton shipping provider used throughout the application.
 * Services import this directly: `import { shippingProvider } from '../providers/shipping'`
 */
export const shippingProvider: ShippingProvider = getShippingProvider();

// Re-export types and interfaces for convenience
export type { ShippingProvider } from './interfaces/ShippingProvider';
export { ProviderCapabilityError } from './interfaces/ShippingProvider';
export type { ShippingCapabilities } from './interfaces/ShippingCapabilities';
export * from './interfaces/ShippingDto';
export * from './interfaces/ShipmentStatusMapper';
