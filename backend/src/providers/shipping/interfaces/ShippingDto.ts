/**
 * Shipping Engine — Internal DTOs
 *
 * GOLDEN RULE: Provider-specific field names NEVER escape this layer.
 *
 * The ShippingProvider interface speaks only these types.
 * Mappers translate provider responses into these types before returning.
 * The ShipmentService and Controllers only ever consume these types.
 *
 * When adding a new provider:
 *  - Create a new Mapper that translates provider JSON → these DTOs
 *  - The rest of the codebase requires ZERO changes
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared Value Types
// ─────────────────────────────────────────────────────────────────────────────

export type CourierSelectionStrategy =
  | 'CHEAPEST'
  | 'FASTEST'
  | 'BEST_RATED'
  | 'LOWEST_RTO'
  | 'CUSTOM';

export type ShipmentDirection = 'FORWARD' | 'RETURN';

export interface ShipmentAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PackageDimensions {
  /** Length in centimetres */
  length: number;
  /** Breadth in centimetres */
  breadth: number;
  /** Height in centimetres */
  height: number;
}

export interface CourierOption {
  /** Machine-readable courier code (e.g. "BLUEDART", "DELHIVERY") */
  code: string;
  /** Human-readable courier name (e.g. "BlueDart Express") */
  name: string;
  /** Estimated delivery in calendar days */
  etaDays: number;
  /** Total shipping price in INR */
  price: number;
  /** Provider rating 0–5 */
  rating: number;
  /** Whether this courier supports COD for this shipment */
  codAvailable: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Request DTOs
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateShipmentRequest {
  /** Internal application order ID */
  orderId: string;
  /** Human-readable order number shown on label */
  orderNumber: string;
  direction: ShipmentDirection;
  shippingAddress: ShipmentAddress;
  /** If direction=RETURN, this is the pickup address for the return */
  returnAddress?: ShipmentAddress;
  items: Array<{
    productName: string;
    sku?: string | null;
    quantity: number;
    unitPrice: number;
  }>;
  /** Declared weight in grams (from PackageProfile or ShippingSettings defaults) */
  weightGrams: number;
  dimensions: PackageDimensions;
  isCOD: boolean;
  codAmount?: number;
  isFragile?: boolean;
  requiresSignature?: boolean;
  /** Provider's pickup location name/code from FulfillmentLocation.providerCode */
  pickupLocationCode: string;
  /** Preferred courier code (from courier recommendation) */
  preferredCourierCode?: string;
  /** Total declared value for insurance */
  declaredValue?: number;
  /** Idempotency key to prevent duplicate shipments on retry */
  idempotencyKey: string;
}

export interface CancelShipmentRequest {
  /** Provider-neutral external shipment ID */
  externalShipmentId: string;
  externalOrderId?: string;
  reason?: string;
  idempotencyKey: string;
}

export interface SchedulePickupRequest {
  externalShipmentId: string;
  pickupDate?: Date;
  /** Provider's pickup location code */
  pickupLocationCode: string;
  idempotencyKey: string;
}

export interface EstimateShippingRequest {
  originPincode: string;
  destinationPincode: string;
  weightGrams: number;
  dimensions: PackageDimensions;
  isCOD: boolean;
  declaredValue?: number;
}

export interface ServiceabilityRequest {
  destinationPincode: string;
  weightGrams: number;
  isCOD: boolean;
}

export interface CreateReturnShipmentRequest extends Omit<CreateShipmentRequest, 'direction'> {}

// ─────────────────────────────────────────────────────────────────────────────
// Response DTOs
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateShipmentResponse {
  /** Provider-neutral external shipment ID */
  externalShipmentId: string;
  /** Provider's internal order reference (may be same as externalShipmentId on some providers) */
  externalOrderId?: string;
  /** Air Waybill number — primary tracking code for the customer */
  externalAwbNumber: string;
  courierCode: string;
  courierName: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  shippingCost?: number;
  labelUrl?: string;
  /** Raw provider response preserved for audit trail — never used by business logic */
  raw: Record<string, unknown>;
}

export interface TrackingEvent {
  status: string;
  location?: string;
  timestamp: Date;
  description: string;
}

export interface TrackingResponse {
  /** Normalized internal status — not the provider's status string */
  status: string;
  location?: string;
  timestamp: Date;
  events: TrackingEvent[];
  /** Raw provider response for audit */
  raw?: Record<string, unknown>;
}

export interface PickupResponse {
  pickupId: string;
  scheduledDate?: Date;
  raw: Record<string, unknown>;
}

export interface LabelResponse {
  labelUrl: string;
}

export interface InvoiceResponse {
  invoiceUrl: string;
}

export interface ManifestResponse {
  manifestUrl: string;
}

export interface ServiceabilityResponse {
  available: boolean;
  couriers: CourierOption[];
}

export interface EstimateResponse {
  couriers: CourierOption[];
}

export interface ProviderHealthResponse {
  provider: string;
  authenticated: boolean;
  /** ISO timestamp when token expires (null if no auth required) */
  tokenExpiresAt?: string;
  /** API round-trip latency in milliseconds (from last health ping) */
  latencyMs?: number;
  /** Capabilities map for this provider */
  capabilities: Record<string, boolean>;
}
