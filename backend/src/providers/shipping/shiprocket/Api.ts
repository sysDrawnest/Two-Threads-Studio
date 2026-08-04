/**
 * ShiprocketApi
 *
 * Raw HTTP client for the Shiprocket REST API.
 * Every method maps 1:1 to a single Shiprocket endpoint.
 *
 * RULES:
 *  - This file returns raw Shiprocket JSON types (ShiprocketXxxResponse).
 *  - No internal DTOs are used here — mapping happens in Mapper.ts.
 *  - Every call uses an idempotency key header where the API supports it.
 *  - Retries use exponential backoff: 1s → 3s → 8s (3 attempts max).
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import logger from '../../../lib/logger';
import type { ShiprocketAuth } from './Auth';

const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1_000, 3_000, 8_000];

// ─────────────────────────────────────────────────────────────────────────────
// Raw Shiprocket Response Types (used only within shiprocket/ directory)
// ─────────────────────────────────────────────────────────────────────────────

export interface ShiprocketOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id?: number;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email?: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    hsn?: number;
  }>;
  payment_method: 'Prepaid' | 'COD';
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number; // kg
}

export interface ShiprocketCreateOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

export interface ShiprocketAwbResponse {
  awb_assign_status: number;
  response: {
    data: {
      awb_code: string;
      courier_company_id: number;
      courier_name: string;
      cod: number;
      applied_weight: number;
    };
  };
}

export interface ShiprocketPickupResponse {
  pickup_status: number;
  response: {
    pickup_scheduled_date: string;
    pickup_token_number: string;
  };
}

export interface ShiprocketLabelResponse {
  label_created: number;
  label_url: string;
  not_created?: Array<{ id: number; message: string }>;
}

export interface ShiprocketInvoiceResponse {
  is_invoice_created: boolean;
  invoice_url: string;
  not_created?: number[];
}

export interface ShiprocketManifestResponse {
  manifest_url: string;
}

export interface ShiprocketTrackEvent {
  date: string;
  activity: string;
  location: string;
  'sr-status'?: string;
  'sr-status-label'?: string;
}

export interface ShiprocketTrackResponse {
  tracking_data: {
    track_status: number;
    shipment_status?: string;
    shipment_track: Array<{
      awb_code: string;
      courier_company_id: number;
      courier_name: string;
      current_status: string;
      delivered_date?: string;
      estimated_delivery_date?: string;
    }>;
    shipment_track_activities: ShiprocketTrackEvent[];
  };
}

export interface ShiprocketCourierResponse {
  courier_id: number;
  courier_name: string;
  rate: number;
  etd: string; // e.g. "3 Days"
  rating?: number;
  cod_charges?: number;
  is_surface?: boolean;
}

export interface ShiprocketServiceabilityResponse {
  status: number;
  data: {
    available_courier_companies: ShiprocketCourierResponse[];
    shiprocket_recommended_courier_id?: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP Client with Retry + Auth
// ─────────────────────────────────────────────────────────────────────────────

export class ShiprocketApi {
  private client: AxiosInstance;

  constructor(private auth: ShiprocketAuth) {
    this.client = axios.create({
      baseURL: SHIPROCKET_BASE,
      timeout: 30_000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ─── Internal helpers ────────────────────────────────────────────────────

  private async authHeader(): Promise<Record<string, string>> {
    const token = await this.auth.getAccessToken();
    return { Authorization: `Bearer ${token}` };
  }

  /** POST with exponential backoff retry */
  private async post<T>(
    path: string,
    body: unknown,
    idempotencyKey?: string
  ): Promise<T> {
    const extraHeaders: Record<string, string> = idempotencyKey
      ? { 'X-Idempotency-Key': idempotencyKey }
      : {};

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const headers = { ...(await this.authHeader()), ...extraHeaders };
        const res = await this.client.post<T>(path, body, { headers });
        return res.data;
      } catch (err) {
        const isLast = attempt === MAX_RETRIES - 1;
        const status = (err as AxiosError)?.response?.status;

        // Don't retry 4xx client errors (except 429 rate limit)
        if (status && status >= 400 && status < 500 && status !== 429) {
          logger.error({ path, status, attempt }, '[ShiprocketApi] Non-retryable error');
          throw err;
        }

        if (isLast) throw err;
        const delay = RETRY_DELAYS_MS[attempt]!;
        logger.warn({ path, attempt, delay, status }, '[ShiprocketApi] Retrying after error');
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw new Error('[ShiprocketApi] Exceeded max retries');
  }

  /** GET with retry */
  private async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const headers = await this.authHeader();
        const res = await this.client.get<T>(path, { headers, params });
        return res.data;
      } catch (err) {
        const isLast = attempt === MAX_RETRIES - 1;
        const status = (err as AxiosError)?.response?.status;
        if (status && status >= 400 && status < 500 && status !== 429) throw err;
        if (isLast) throw err;
        const delay = RETRY_DELAYS_MS[attempt]!;
        logger.warn({ path, attempt, delay, status }, '[ShiprocketApi] Retrying GET');
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw new Error('[ShiprocketApi] Exceeded max retries');
  }

  // ─── Public API methods ──────────────────────────────────────────────────

  /** Create a new order+shipment in Shiprocket */
  async createOrder(
    payload: ShiprocketOrderPayload,
    idempotencyKey: string
  ): Promise<ShiprocketCreateOrderResponse> {
    return this.post<ShiprocketCreateOrderResponse>(
      '/orders/create/adhoc',
      payload,
      idempotencyKey
    );
  }

  /** Assign a courier and AWB to a Shiprocket shipment */
  async assignAwb(
    shipmentId: number,
    courierCode?: number
  ): Promise<ShiprocketAwbResponse> {
    const body: Record<string, unknown> = { shipment_id: [shipmentId] };
    if (courierCode) body['courier_id'] = courierCode;
    return this.post<ShiprocketAwbResponse>('/courier/assign/awb', body);
  }

  /** Schedule a courier pickup */
  async requestPickup(
    shipmentId: number,
    pickupDate?: string,
    idempotencyKey?: string
  ): Promise<ShiprocketPickupResponse> {
    const body: Record<string, unknown> = { shipment_id: [shipmentId] };
    if (pickupDate) body['pickup_date'] = pickupDate;
    return this.post<ShiprocketPickupResponse>('/courier/generate/pickup', body, idempotencyKey);
  }

  /** Generate a shipping label PDF */
  async generateLabel(
    shipmentIds: number[],
    idempotencyKey?: string
  ): Promise<ShiprocketLabelResponse> {
    return this.post<ShiprocketLabelResponse>(
      '/courier/generate/label',
      { shipment_id: shipmentIds },
      idempotencyKey
    );
  }

  /** Generate an invoice PDF */
  async generateInvoice(
    orderIds: number[],
    idempotencyKey?: string
  ): Promise<ShiprocketInvoiceResponse> {
    return this.post<ShiprocketInvoiceResponse>(
      '/orders/print/invoice',
      { ids: orderIds },
      idempotencyKey
    );
  }

  /** Generate a manifest PDF for bulk pickup */
  async generateManifest(
    shipmentIds: number[],
    idempotencyKey?: string
  ): Promise<ShiprocketManifestResponse> {
    return this.post<ShiprocketManifestResponse>(
      '/manifests/generate',
      { shipment_id: shipmentIds },
      idempotencyKey
    );
  }

  /** Track a shipment by AWB number */
  async trackByAwb(awb: string): Promise<ShiprocketTrackResponse> {
    return this.get<ShiprocketTrackResponse>(`/courier/track/awb/${awb}`);
  }

  /** Get courier serviceability and rate estimates for a route */
  async getServiceability(
    deliveryPostcode: string,
    pickupPostcode: string,
    weightKg: number,
    isCOD: boolean
  ): Promise<ShiprocketServiceabilityResponse> {
    return this.get<ShiprocketServiceabilityResponse>('/courier/serviceability/', {
      pickup_postcode: pickupPostcode,
      delivery_postcode: deliveryPostcode,
      weight: weightKg,
      cod: isCOD ? 1 : 0,
    });
  }

  /** Cancel Shiprocket orders by order IDs */
  async cancelOrders(orderIds: number[]): Promise<void> {
    await this.post('/orders/cancel', { ids: orderIds });
  }

  /** Create a return (reverse logistics) order */
  async createReturnOrder(
    payload: ShiprocketOrderPayload,
    idempotencyKey: string
  ): Promise<ShiprocketCreateOrderResponse> {
    return this.post<ShiprocketCreateOrderResponse>(
      '/orders/create/return',
      payload,
      idempotencyKey
    );
  }
}
