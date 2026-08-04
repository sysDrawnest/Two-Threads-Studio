/**
 * ShipmentStatusMapper
 *
 * Single source of truth for translating any provider's raw status string
 * into a normalized internal ShipmentStatus string.
 *
 * When switching providers:
 *  - Only this file changes for status translation
 *  - Business logic, service layer, and DB schema are unaffected
 *
 * Pattern: statusMap[rawProviderStatus] → InternalShipmentStatus
 */

// Internal canonical status values (must match ShipmentStatus enum in schema.prisma)
export type InternalShipmentStatus =
  | 'PENDING'
  | 'PACKING'
  | 'READY_TO_SHIP'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_PICKED_UP'
  | 'RETURN_IN_TRANSIT'
  | 'RETURN_RECEIVED';

// ─────────────────────────────────────────────────────────────────────────────
// Shiprocket Status Map
// ─────────────────────────────────────────────────────────────────────────────
// Source: https://apidocs.shiprocket.in/#tracking

export const SHIPROCKET_STATUS_MAP: Record<string, InternalShipmentStatus> = {
  // Pre-dispatch
  'SHIPMENT CREATED': 'PENDING',
  'AWB ASSIGNED': 'PENDING',
  'INVOICE GENERATED': 'PENDING',
  'LABEL GENERATED': 'PACKING',
  'PICKUP SCHEDULED': 'PICKUP_SCHEDULED',
  'PICKUP QUEUED': 'PICKUP_SCHEDULED',
  'PICKUP GENERATED': 'PICKUP_SCHEDULED',
  'PICKUP ERROR': 'PICKUP_SCHEDULED', // Stays scheduled — retry expected
  // In transit
  'PICKED UP': 'PICKED_UP',
  'IN TRANSIT': 'IN_TRANSIT',
  'MISROUTED': 'IN_TRANSIT',
  'TRANSIT DELAY': 'IN_TRANSIT',
  // Delivery
  'OUT FOR DELIVERY': 'OUT_FOR_DELIVERY',
  'DELIVERED': 'DELIVERED',
  // Failure
  'UNDELIVERED': 'FAILED_DELIVERY',
  'DELIVERY FAILED': 'FAILED_DELIVERY',
  'DELIVERY ATTEMPTED': 'FAILED_DELIVERY',
  'NDR': 'FAILED_DELIVERY',
  // Cancellation
  'CANCELLED': 'CANCELLED',
  'CANCELLATION REQUESTED': 'CANCELLED',
  // Returns
  'RTO INITIATED': 'RETURN_REQUESTED',
  'RTO IN TRANSIT': 'RETURN_IN_TRANSIT',
  'RTO OUT FOR DELIVERY': 'RETURN_IN_TRANSIT',
  'RTO DELIVERED': 'RETURN_RECEIVED',
};

// ─────────────────────────────────────────────────────────────────────────────
// IThink Logistics Status Map
// ─────────────────────────────────────────────────────────────────────────────

export const ITHINK_STATUS_MAP: Record<string, InternalShipmentStatus> = {
  'ORDER PLACED': 'PENDING',
  'SHIPMENT CREATED': 'PACKING',
  'MANIFESTED': 'PACKING',
  'PICKUP SCHEDULED': 'PICKUP_SCHEDULED',
  'PICKED UP': 'PICKED_UP',
  'OUT FOR PICKUP': 'PICKUP_SCHEDULED',
  'IN TRANSIT': 'IN_TRANSIT',
  'IN-TRANSIT': 'IN_TRANSIT',
  'REACHED AT HUB': 'IN_TRANSIT',
  'OUT FOR DELIVERY': 'OUT_FOR_DELIVERY',
  'DELIVERED': 'DELIVERED',
  'UNDELIVERED': 'FAILED_DELIVERY',
  'DELIVERY FAILED': 'FAILED_DELIVERY',
  'CANCELLED': 'CANCELLED',
  'CANCELED': 'CANCELLED',
  'RTO INITIATED': 'RETURN_REQUESTED',
  'RTO IN TRANSIT': 'RETURN_IN_TRANSIT',
  'RTO DELIVERED': 'RETURN_RECEIVED',
};

// ─────────────────────────────────────────────────────────────────────────────
// Delhivery Status Map (placeholder — extend when adapter is added)
// ─────────────────────────────────────────────────────────────────────────────

export const DELHIVERY_STATUS_MAP: Record<string, InternalShipmentStatus> = {
  'Booked': 'PENDING',
  'In Transit': 'IN_TRANSIT',
  'Out For Delivery': 'OUT_FOR_DELIVERY',
  'Delivered': 'DELIVERED',
  'RTO': 'RETURN_REQUESTED',
  'RTO Delivered': 'RETURN_RECEIVED',
};

// ─────────────────────────────────────────────────────────────────────────────
// Factory function — resolve a status string for a given provider
// ─────────────────────────────────────────────────────────────────────────────

export type SupportedProviderKey = 'ithink' | 'shiprocket' | 'delhivery' | 'mock';

const STATUS_MAPS: Record<SupportedProviderKey, Record<string, InternalShipmentStatus>> = {
  ithink: ITHINK_STATUS_MAP,
  shiprocket: SHIPROCKET_STATUS_MAP,
  delhivery: DELHIVERY_STATUS_MAP,
  mock: {},
};

/**
 * Map a raw provider status string to an internal shipment status.
 * @param provider - e.g. 'shiprocket' | 'delhivery'
 * @param rawStatus - The exact status string returned by the provider API/webhook
 * @param fallback - Status to return when no mapping is found (defaults to 'IN_TRANSIT')
 */
export function mapProviderStatus(
  provider: SupportedProviderKey,
  rawStatus: string,
  fallback: InternalShipmentStatus = 'IN_TRANSIT'
): InternalShipmentStatus {
  const map = STATUS_MAPS[provider] ?? {};
  const normalized = rawStatus.trim().toUpperCase();

  // Try exact match first (case-normalized)
  for (const [key, value] of Object.entries(map)) {
    if (key.toUpperCase() === normalized) return value;
  }

  return fallback;
}
