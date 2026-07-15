/**
 * ShippingProvider Interface
 *
 * Abstract contract for all courier/shipping providers.
 * Current implementation: MockShippingProvider
 * Future implementations: ShiprocketProvider, DelhiveryProvider, etc.
 */

export interface CreateShipmentParams {
  orderId: string;
  orderNumber: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: Array<{
    productName: string;
    sku?: string | null;
    quantity: number;
    weight?: number;
  }>;
  totalWeight?: number; // grams
}

export interface ShipmentDetails {
  trackingNumber: string;
  carrier: string;
  shippingMethod: string;
  estimatedDelivery: Date;
  labelUrl?: string;
  /** Raw provider response for audit */
  raw: Record<string, unknown>;
}

export interface TrackingStatus {
  status: string;
  location?: string;
  timestamp: Date;
  events: Array<{
    status: string;
    location?: string;
    timestamp: Date;
    description: string;
  }>;
}

export interface ShippingProvider {
  /**
   * Create a shipment with the courier provider.
   * Returns tracking details.
   */
  createShipment(params: CreateShipmentParams): Promise<ShipmentDetails>;

  /**
   * Fetch the latest tracking status for a shipment.
   */
  getTrackingStatus(trackingNumber: string): Promise<TrackingStatus>;
}
