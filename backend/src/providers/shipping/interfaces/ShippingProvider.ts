/**
 * ShippingProvider Interface
 *
 * Abstract contract for ALL courier/shipping providers.
 *
 * RULES:
 *  1. All method signatures use internal DTOs ONLY — no provider-specific types.
 *  2. Every provider declares its capabilities via `capabilities`.
 *  3. Before calling any optional method, check `capabilities.supportsXxx === true`.
 *  4. Providers MUST implement all interface methods, but may throw
 *     `ProviderCapabilityError` for unsupported operations.
 *
 * Current implementations:
 *  - mock/MockShippingProvider.ts   (development/test)
 *
 * Future implementations:
 *  - shiprocket/ShiprocketProvider.ts
 *  - delhivery/DelhiveryProvider.ts
 */

import type { ShippingCapabilities } from './ShippingCapabilities';
import type {
  CancelShipmentRequest,
  CreateReturnShipmentRequest,
  CreateShipmentRequest,
  CreateShipmentResponse,
  EstimateResponse,
  EstimateShippingRequest,
  InvoiceResponse,
  LabelResponse,
  ManifestResponse,
  PickupResponse,
  ProviderHealthResponse,
  SchedulePickupRequest,
  ServiceabilityRequest,
  ServiceabilityResponse,
  CourierOption,
  TrackingResponse,
} from './ShippingDto';

/**
 * Thrown when calling a method that the active provider does not support.
 * Callers should check `capabilities` before calling optional methods.
 */
export class ProviderCapabilityError extends Error {
  constructor(providerName: string, operation: string) {
    super(`[${providerName}] does not support: ${operation}`);
    this.name = 'ProviderCapabilityError';
  }
}

export interface ShippingProvider {
  /** Human-readable provider name (e.g. "Mock", "Shiprocket") */
  readonly name: string;

  /** Declared capabilities for this provider instance */
  readonly capabilities: ShippingCapabilities;

  /**
   * Authenticate with the provider (refresh/validate token).
   * Called automatically by the factory on initialization.
   * Returns true if authenticated, false if auth is not required (e.g. Mock).
   */
  authenticate(): Promise<boolean>;

  /**
   * Create a shipment (forward or return) with the provider.
   * Must be idempotent: same `idempotencyKey` should return the same result.
   */
  createShipment(req: CreateShipmentRequest): Promise<CreateShipmentResponse>;

  /**
   * Cancel a shipment. Check `capabilities.supportsCancellation` before calling.
   */
  cancelShipment(req: CancelShipmentRequest): Promise<void>;

  /**
   * Generate and return a shipping label URL.
   * Check `capabilities.supportsLabelPDF` before calling.
   */
  generateLabel(externalShipmentId: string): Promise<LabelResponse>;

  /**
   * Generate and return an invoice PDF URL.
   * Check `capabilities.supportsInvoicePDF` before calling.
   */
  generateInvoice(externalShipmentId: string): Promise<InvoiceResponse>;

  /**
   * Generate a consolidated manifest PDF for bulk pickup.
   * Check `capabilities.supportsManifest` before calling.
   */
  generateManifest(externalShipmentIds: string[]): Promise<ManifestResponse>;

  /**
   * Book a courier pickup from the fulfillment location.
   * Check `capabilities.supportsPickup` before calling.
   */
  schedulePickup(req: SchedulePickupRequest): Promise<PickupResponse>;

  /**
   * Fetch current tracking status by AWB number.
   * Always implemented — even mock providers return synthetic tracking.
   */
  trackShipment(externalAwbNumber: string): Promise<TrackingResponse>;

  /**
   * Estimate shipping cost and ETA across all available couriers.
   * Check `capabilities.supportsRateEstimation` before calling.
   */
  estimateShipping(req: EstimateShippingRequest): Promise<EstimateResponse>;

  /**
   * Check whether a destination pincode is serviceable.
   * Check `capabilities.supportsServiceabilityCheck` before calling.
   */
  checkServiceability(req: ServiceabilityRequest): Promise<ServiceabilityResponse>;

  /**
   * Create a return (reverse logistics) shipment.
   * Check `capabilities.supportsReturns` before calling.
   */
  createReturnShipment(req: CreateReturnShipmentRequest): Promise<CreateShipmentResponse>;

  /**
   * Get ranked courier recommendations for an already-created shipment.
   * Check `capabilities.supportsCourierRecommendation` before calling.
   */
  getCourierRecommendations(externalShipmentId: string): Promise<CourierOption[]>;

  /**
   * Run a health check against the provider.
   * Returns auth status, token TTL, API latency, and capability map.
   */
  healthCheck(): Promise<ProviderHealthResponse>;
}
