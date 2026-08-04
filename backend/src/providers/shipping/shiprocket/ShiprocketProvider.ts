/**
 * ShiprocketProvider
 *
 * Implements the ShippingProvider interface using Shiprocket's REST API.
 *
 * Architecture:
 *  - Delegates ALL HTTP calls to ShiprocketApi (no axios here)
 *  - Delegates ALL response mapping to ShiprocketMapper (no raw JSON here)
 *  - Only speaks internal DTOs to the outside world
 *
 * Capabilities: full — label, invoice, manifest, pickup, returns, COD, rate estimation
 *
 * Activation: set SHIPPING_PROVIDER=shiprocket in .env
 *             and provide SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_CHANNEL_ID
 */

import logger from '../../../lib/logger';
import { env } from '../../../config/env';
import { ShiprocketAuth } from './Auth';
import { ShiprocketApi } from './Api';
import { ShiprocketMapper } from './Mapper';
import { ProviderCapabilityError } from '../interfaces/ShippingProvider';
import type { ShippingProvider } from '../interfaces/ShippingProvider';
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
// Capabilities declaration
// ─────────────────────────────────────────────────────────────────────────────

const SHIPROCKET_CAPABILITIES: ShippingCapabilities = {
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
  supportsWebhook: true,
  supportsCourierRecommendation: true,
  supportsNDR: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Weight in grams → kg (Shiprocket expects kg with 1 decimal) */
function gramsToKg(grams: number): number {
  return Math.round((grams / 1000) * 10) / 10;
}

/** Build the Shiprocket order payload from a CreateShipmentRequest */
function buildOrderPayload(req: CreateShipmentRequest) {
  const addr = req.shippingAddress;
  const channelId = env.SHIPROCKET_CHANNEL_ID ? Number(env.SHIPROCKET_CHANNEL_ID) : undefined;

  return {
    order_id: req.orderNumber,
    order_date: new Date().toISOString().split('T')[0]!,
    pickup_location: req.pickupLocationCode,
    channel_id: channelId,
    billing_customer_name: addr.fullName,
    billing_address: addr.line1,
    billing_address_2: addr.line2 ?? '',
    billing_city: addr.city,
    billing_pincode: addr.postalCode,
    billing_state: addr.state,
    billing_country: addr.country,
    billing_phone: addr.phone,
    shipping_is_billing: true,
    payment_method: req.isCOD ? ('COD' as const) : ('Prepaid' as const),
    sub_total: req.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    length: req.dimensions.length,
    breadth: req.dimensions.breadth,
    height: req.dimensions.height,
    weight: gramsToKg(req.weightGrams),
    order_items: req.items.map((i) => ({
      name: i.productName,
      sku: i.sku ?? i.productName.substring(0, 20),
      units: i.quantity,
      selling_price: i.unitPrice,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider factory
// ─────────────────────────────────────────────────────────────────────────────

function createShiprocketProvider(): ShippingProvider {
  const auth = new ShiprocketAuth();
  const api = new ShiprocketApi(auth);

  return {
    name: 'Shiprocket',
    capabilities: SHIPROCKET_CAPABILITIES,

    async authenticate(): Promise<boolean> {
      await auth.getAccessToken();
      return auth.isAuthenticated;
    },

    async createShipment(req: CreateShipmentRequest): Promise<CreateShipmentResponse> {
      logger.info({ orderId: req.orderId }, '[ShiprocketProvider] Creating shipment');
      const payload = buildOrderPayload(req);
      const orderRes = await api.createOrder(payload, req.idempotencyKey);

      // Assign AWB (auto-selects cheapest courier if no preference given)
      const shipmentId = orderRes.shipment_id;
      const preferredCourierId = req.preferredCourierCode
        ? Number(req.preferredCourierCode)
        : undefined;

      const awbRes = await api.assignAwb(shipmentId, preferredCourierId);
      let result = ShiprocketMapper.toCreateShipmentResponse(orderRes, awbRes);
      result = ShiprocketMapper.enrichWithAwb(result, awbRes);

      // Try to pre-generate label URL
      try {
        const labelRes = await api.generateLabel([shipmentId], `${req.idempotencyKey}:label`);
        result = { ...result, labelUrl: labelRes.label_url };
      } catch (err) {
        logger.warn({ err }, '[ShiprocketProvider] Label pre-generation failed (non-fatal)');
      }

      return result;
    },

    async cancelShipment(req: CancelShipmentRequest): Promise<void> {
      const orderId = req.externalOrderId ?? req.externalShipmentId;
      await api.cancelOrders([Number(orderId)]);
    },

    async generateLabel(externalShipmentId: string): Promise<LabelResponse> {
      const res = await api.generateLabel([Number(externalShipmentId)]);
      return ShiprocketMapper.toLabelResponse(res);
    },

    async generateInvoice(externalShipmentId: string): Promise<InvoiceResponse> {
      // Shiprocket invoice uses order ID, but we store shipment ID. Use externalShipmentId as fallback.
      const res = await api.generateInvoice([Number(externalShipmentId)]);
      return ShiprocketMapper.toInvoiceResponse(res);
    },

    async generateManifest(externalShipmentIds: string[]): Promise<ManifestResponse> {
      const res = await api.generateManifest(externalShipmentIds.map(Number));
      return ShiprocketMapper.toManifestResponse(res);
    },

    async schedulePickup(req: SchedulePickupRequest): Promise<PickupResponse> {
      const pickupDate = req.pickupDate
        ? req.pickupDate.toISOString().split('T')[0]
        : undefined;
      const res = await api.requestPickup(
        Number(req.externalShipmentId),
        pickupDate,
        req.idempotencyKey
      );
      return ShiprocketMapper.toPickupResponse(res);
    },

    async trackShipment(externalAwbNumber: string): Promise<TrackingResponse> {
      const res = await api.trackByAwb(externalAwbNumber);
      return ShiprocketMapper.toTrackingResponse(res);
    },

    async estimateShipping(req: EstimateShippingRequest): Promise<EstimateResponse> {
      const res = await api.getServiceability(
        req.destinationPincode,
        req.originPincode,
        gramsToKg(req.weightGrams),
        req.isCOD
      );
      return ShiprocketMapper.toEstimateResponse(res);
    },

    async checkServiceability(req: ServiceabilityRequest): Promise<ServiceabilityResponse> {
      const res = await api.getServiceability(
        req.destinationPincode,
        env.SHIPROCKET_PICKUP_LOCATION,
        gramsToKg(req.weightGrams),
        req.isCOD
      );
      return ShiprocketMapper.toServiceabilityResponse(res);
    },

    async createReturnShipment(req: CreateReturnShipmentRequest): Promise<CreateShipmentResponse> {
      logger.info({ orderId: req.orderId }, '[ShiprocketProvider] Creating return shipment');
      const payload = buildOrderPayload({ ...req, direction: 'RETURN' });
      // Return order uses return endpoint — shipping address and billing are swapped
      const orderRes = await api.createReturnOrder(payload, req.idempotencyKey);
      const awbRes = await api.assignAwb(orderRes.shipment_id);
      let result = ShiprocketMapper.toCreateShipmentResponse(orderRes, awbRes);
      result = ShiprocketMapper.enrichWithAwb(result, awbRes);
      return result;
    },

    async getCourierRecommendations(externalShipmentId: string): Promise<CourierOption[]> {
      // Shiprocket doesn't have a "per shipment" courier list after creation —
      // return empty list (AWB assignment already chose the best courier)
      logger.info(
        { externalShipmentId },
        '[ShiprocketProvider] getCourierRecommendations: AWB already assigned'
      );
      return [];
    },

    async healthCheck(): Promise<ProviderHealthResponse> {
      const start = Date.now();
      let authenticated = auth.isAuthenticated;

      if (!authenticated) {
        try {
          await auth.getAccessToken();
          authenticated = true;
        } catch {
          authenticated = false;
        }
      }

      return {
        provider: 'Shiprocket',
        authenticated,
        tokenExpiresAt: auth.tokenExpiresAt ?? undefined,
        latencyMs: Date.now() - start,
        capabilities: SHIPROCKET_CAPABILITIES as unknown as Record<string, boolean>,
      };
    },
  };
}

/** Lazily instantiated Shiprocket provider singleton */
export const shiprocketProvider: ShippingProvider = createShiprocketProvider();
