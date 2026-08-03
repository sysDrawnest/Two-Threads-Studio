/**
 * MockShippingProvider
 *
 * Development / staging implementation of ShippingProvider.
 * Generates realistic mock data without calling any external API.
 * Reports full capabilities so all UI buttons and features are testable.
 *
 * Activate: SHIPPING_PROVIDER=mock (default)
 * Deactivate: SHIPPING_PROVIDER=shiprocket
 */

import { randomBytes } from 'crypto';
import type { ShippingProvider, ProviderCapabilityError as _CapErr } from '../interfaces/ShippingProvider';
import type { ShippingCapabilities } from '../interfaces/ShippingCapabilities';
import type {
  CancelShipmentRequest,
  CourierOption,
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
  TrackingResponse,
} from '../interfaces/ShippingDto';

// ─────────────────────────────────────────────────────────────────────────────
// Mock helpers
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_COURIERS: CourierOption[] = [
  { code: 'BLUEDART', name: 'BlueDart Express', etaDays: 2, price: 149, rating: 4.5, codAvailable: true },
  { code: 'DELHIVERY', name: 'Delhivery', etaDays: 3, price: 89, rating: 4.1, codAvailable: true },
  { code: 'DTDC', name: 'DTDC Courier', etaDays: 4, price: 69, rating: 3.8, codAvailable: true },
  { code: 'ECOM', name: 'Ecom Express', etaDays: 3, price: 99, rating: 4.0, codAvailable: false },
];

function genId(prefix: string): string {
  return `${prefix}${randomBytes(5).toString('hex').toUpperCase()}`;
}

function delay(ms = 30): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function futureDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Implementation
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_CAPABILITIES: ShippingCapabilities = {
  supportsPickup: true,
  supportsManifest: true,
  supportsReturns: true,
  supportsLabelPDF: true,
  supportsInvoicePDF: true,
  supportsCOD: true,
  supportsInsurance: false,
  supportsRateEstimation: true,
  supportsServiceabilityCheck: true,
  supportsCancellation: true,
  supportsWebhook: false,
  supportsCourierRecommendation: true,
  supportsNDR: false,
};

export const mockShippingProvider: ShippingProvider = {
  name: 'Mock',
  capabilities: MOCK_CAPABILITIES,

  async authenticate(): Promise<boolean> {
    // No authentication required for mock
    return false;
  },

  async createShipment(req: CreateShipmentRequest): Promise<CreateShipmentResponse> {
    await delay();
    const awb = genId('TTS');
    const shipmentId = genId('MOCK-SHP-');
    const courier = MOCK_COURIERS[0];

    return {
      externalShipmentId: shipmentId,
      externalOrderId: genId('MOCK-ORD-'),
      externalAwbNumber: awb,
      courierCode: courier.code,
      courierName: courier.name,
      trackingUrl: `https://mock-track.example.com/track/${awb}`,
      estimatedDelivery: futureDate(courier.etaDays),
      shippingCost: courier.price,
      labelUrl: `https://mock-labels.example.com/${awb}.pdf`,
      raw: {
        provider: 'MOCK',
        orderId: req.orderId,
        awb,
        shipmentId,
        createdAt: new Date().toISOString(),
      },
    };
  },

  async cancelShipment(_req: CancelShipmentRequest): Promise<void> {
    await delay();
    // No-op in mock
  },

  async generateLabel(externalShipmentId: string): Promise<LabelResponse> {
    await delay();
    return { labelUrl: `https://mock-labels.example.com/${externalShipmentId}.pdf` };
  },

  async generateInvoice(externalShipmentId: string): Promise<InvoiceResponse> {
    await delay();
    return { invoiceUrl: `https://mock-invoices.example.com/${externalShipmentId}.pdf` };
  },

  async generateManifest(externalShipmentIds: string[]): Promise<ManifestResponse> {
    await delay();
    return { manifestUrl: `https://mock-manifests.example.com/${externalShipmentIds.join('-')}.pdf` };
  },

  async schedulePickup(req: SchedulePickupRequest): Promise<PickupResponse> {
    await delay();
    return {
      pickupId: genId('MOCK-PICKUP-'),
      scheduledDate: req.pickupDate ?? futureDate(1),
      raw: { provider: 'MOCK', shipmentId: req.externalShipmentId },
    };
  },

  async trackShipment(externalAwbNumber: string): Promise<TrackingResponse> {
    await delay();
    const now = new Date();
    return {
      status: 'IN_TRANSIT',
      location: 'Mumbai Sorting Hub',
      timestamp: now,
      events: [
        {
          status: 'PICKED_UP',
          location: 'Kolkata Workshop',
          timestamp: new Date(now.getTime() - 8 * 3600_000),
          description: 'Package picked up from artisan workshop',
        },
        {
          status: 'IN_TRANSIT',
          location: 'Mumbai Sorting Hub',
          timestamp: now,
          description: 'Package arrived at regional sorting facility',
        },
      ],
      raw: { provider: 'MOCK', awb: externalAwbNumber },
    };
  },

  async estimateShipping(_req: EstimateShippingRequest): Promise<EstimateResponse> {
    await delay();
    return { couriers: MOCK_COURIERS };
  },

  async checkServiceability(_req: ServiceabilityRequest): Promise<ServiceabilityResponse> {
    await delay();
    return { available: true, couriers: MOCK_COURIERS };
  },

  async createReturnShipment(req: CreateReturnShipmentRequest): Promise<CreateShipmentResponse> {
    await delay();
    const awb = genId('RTTS');
    const shipmentId = genId('MOCK-RET-');

    return {
      externalShipmentId: shipmentId,
      externalOrderId: genId('MOCK-RORD-'),
      externalAwbNumber: awb,
      courierCode: MOCK_COURIERS[1].code,
      courierName: MOCK_COURIERS[1].name,
      trackingUrl: `https://mock-track.example.com/return/${awb}`,
      estimatedDelivery: futureDate(5),
      shippingCost: MOCK_COURIERS[1].price,
      raw: {
        provider: 'MOCK',
        type: 'RETURN',
        orderId: req.orderId,
        awb,
      },
    };
  },

  async getCourierRecommendations(_externalShipmentId: string): Promise<CourierOption[]> {
    await delay();
    return MOCK_COURIERS;
  },

  async healthCheck(): Promise<ProviderHealthResponse> {
    return {
      provider: 'Mock',
      authenticated: false,
      latencyMs: 30,
      capabilities: MOCK_CAPABILITIES as unknown as Record<string, boolean>,
    };
  },
};
