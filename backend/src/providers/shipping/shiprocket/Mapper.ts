/**
 * ShiprocketMapper
 *
 * Translates Shiprocket raw JSON responses into provider-neutral internal DTOs.
 * This is the ONLY file in the codebase that knows Shiprocket's JSON field names.
 *
 * When switching to Delhivery/NimbusPost, create a new Mapper.ts in that provider's
 * directory. No other code changes required.
 */

import { mapProviderStatus } from '../interfaces/ShipmentStatusMapper';
import type {
  CreateShipmentResponse,
  TrackingResponse,
  TrackingEvent,
  PickupResponse,
  LabelResponse,
  InvoiceResponse,
  ManifestResponse,
  CourierOption,
  ServiceabilityResponse,
  EstimateResponse,
} from '../interfaces/ShippingDto';
import type {
  ShiprocketCreateOrderResponse,
  ShiprocketAwbResponse,
  ShiprocketPickupResponse,
  ShiprocketLabelResponse,
  ShiprocketInvoiceResponse,
  ShiprocketManifestResponse,
  ShiprocketTrackResponse,
  ShiprocketCourierResponse,
  ShiprocketServiceabilityResponse,
} from './Api';

export const ShiprocketMapper = {
  /**
   * Maps Shiprocket order creation + optional AWB assignment response
   * into a provider-neutral CreateShipmentResponse.
   */
  toCreateShipmentResponse(
    orderRes: ShiprocketCreateOrderResponse,
    awbRes?: ShiprocketAwbResponse
  ): CreateShipmentResponse {
    const awbData = awbRes?.response?.data;

    return {
      externalShipmentId: String(orderRes.shipment_id),
      externalOrderId: String(orderRes.order_id),
      externalAwbNumber: awbData?.awb_code ?? orderRes.awb_code ?? '',
      courierCode: String(awbData?.courier_company_id ?? orderRes.courier_company_id ?? ''),
      courierName: awbData ? '' : (orderRes.courier_name ?? ''), // populated by AWB step
      shippingCost: undefined, // returned separately by serviceability
      raw: {
        shiprocket_order_id: orderRes.order_id,
        shiprocket_shipment_id: orderRes.shipment_id,
        awb: awbData?.awb_code ?? orderRes.awb_code,
        status: orderRes.status,
      },
    };
  },

  /** Merges courier name from AWB response */
  enrichWithAwb(
    base: CreateShipmentResponse,
    awbRes: ShiprocketAwbResponse
  ): CreateShipmentResponse {
    const d = awbRes.response?.data;
    if (!d) return base;
    return {
      ...base,
      externalAwbNumber: d.awb_code ?? base.externalAwbNumber,
      courierCode: String(d.courier_company_id ?? base.courierCode),
      courierName: d.courier_name ?? base.courierName,
    };
  },

  /** Maps Shiprocket pickup response */
  toPickupResponse(res: ShiprocketPickupResponse): PickupResponse {
    const r = res.response;
    return {
      pickupId: r?.pickup_token_number ?? String(Date.now()),
      scheduledDate: r?.pickup_scheduled_date ? new Date(r.pickup_scheduled_date) : undefined,
      raw: res as unknown as Record<string, unknown>,
    };
  },

  /** Maps Shiprocket label generation response */
  toLabelResponse(res: ShiprocketLabelResponse): LabelResponse {
    if (!res.label_url) {
      throw new Error('[ShiprocketMapper] Label URL not returned by Shiprocket.');
    }
    return { labelUrl: res.label_url };
  },

  /** Maps Shiprocket invoice response */
  toInvoiceResponse(res: ShiprocketInvoiceResponse): InvoiceResponse {
    if (!res.invoice_url) {
      throw new Error('[ShiprocketMapper] Invoice URL not returned by Shiprocket.');
    }
    return { invoiceUrl: res.invoice_url };
  },

  /** Maps Shiprocket manifest response */
  toManifestResponse(res: ShiprocketManifestResponse): ManifestResponse {
    if (!res.manifest_url) {
      throw new Error('[ShiprocketMapper] Manifest URL not returned by Shiprocket.');
    }
    return { manifestUrl: res.manifest_url };
  },

  /** Maps Shiprocket tracking response into provider-neutral TrackingResponse */
  toTrackingResponse(res: ShiprocketTrackResponse): TrackingResponse {
    const trackData = res.tracking_data;
    const latestShipment = trackData?.shipment_track?.[0];
    const rawStatus = latestShipment?.current_status ?? '';
    const internalStatus = mapProviderStatus('shiprocket', rawStatus);

    const events: TrackingEvent[] = (trackData?.shipment_track_activities ?? []).map((e) => ({
      status: mapProviderStatus('shiprocket', e['sr-status-label'] ?? e.activity),
      location: e.location,
      timestamp: new Date(e.date),
      description: e.activity,
    }));

    return {
      status: internalStatus,
      location: events[events.length - 1]?.location,
      timestamp: events[events.length - 1]?.timestamp ?? new Date(),
      events,
      raw: res as unknown as Record<string, unknown>,
    };
  },

  /** Maps a single Shiprocket courier entry into a CourierOption */
  toCourierOption(c: ShiprocketCourierResponse): CourierOption {
    // etd format: "3 Days" or "3-5 Days" — extract minimum
    const etdDays = parseInt(c.etd?.split('-')[0] ?? '5', 10) || 5;

    return {
      code: String(c.courier_id),
      name: c.courier_name,
      etaDays: etdDays,
      price: c.rate,
      rating: c.rating ?? 3.5,
      codAvailable: (c.cod_charges ?? 0) >= 0,
    };
  },

  /** Maps Shiprocket serviceability response */
  toServiceabilityResponse(res: ShiprocketServiceabilityResponse): ServiceabilityResponse {
    const couriers = (res.data?.available_courier_companies ?? []).map((c) =>
      ShiprocketMapper.toCourierOption(c)
    );
    return {
      available: couriers.length > 0,
      couriers,
    };
  },

  /** Maps serviceability response into an EstimateResponse (rate estimate) */
  toEstimateResponse(res: ShiprocketServiceabilityResponse): EstimateResponse {
    const couriers = (res.data?.available_courier_companies ?? []).map((c) =>
      ShiprocketMapper.toCourierOption(c)
    );
    return { couriers };
  },
};
