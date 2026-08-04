/**
 * IThinkApi
 *
 * Raw HTTP client for the IThink Logistics REST API (v3.0).
 * Every method maps 1:1 to an IThink Logistics endpoint.
 */

import axios, { AxiosInstance } from 'axios';
import logger from '../../../lib/logger';
import { IThinkAuth } from './Auth';

const ITHINK_BASE_URL = process.env['ITHINK_SANDBOX'] === 'true'
  ? 'https://sandbox.ithinklogistics.com/api/v3'
  : 'https://api.ithinklogistics.com/api/v3';

// ── Raw Response Interfaces ──────────────────────────────────────────────────

export interface IThinkCreateOrderPayload {
  order_no: string;
  order_date: string;
  payment_method: 'Prepaid' | 'COD';
  total_amount: number;
  sub_total: number;
  consignee_name: string;
  consignee_phone: string;
  consignee_address: string;
  consignee_address2?: string;
  consignee_city: string;
  consignee_state: string;
  consignee_pincode: string;
  pickup_location: string;
  product_details: Array<{
    product_name: string;
    product_qty: number;
    product_price: number;
    product_sku?: string;
  }>;
  shipment_length: number;
  shipment_width: number;
  shipment_height: number;
  weight: number;
}

export interface IThinkCreateOrderResponse {
  status: string;
  status_code: number;
  data?: Record<string, {
    waybill_number?: string;
    order_id?: string;
    reference_no?: string;
    courier_name?: string;
    label_url?: string;
  }>;
  html_message?: string;
}

export interface IThinkTrackingEvent {
  status: string;
  location?: string;
  date_time?: string;
  remark?: string;
}

export interface IThinkTrackResponse {
  status: string;
  status_code: number;
  data?: Record<string, {
    tracking_data?: {
      shipment_track_activities?: IThinkTrackingEvent[];
      current_status?: string;
      delivered_date?: string;
      pickup_date?: string;
    };
  }>;
}

export interface IThinkCourierOption {
  courier_id: string | number;
  courier_name: string;
  rate: number;
  expected_delivery_days?: number;
  cod_charges?: number;
}

export interface IThinkServiceabilityResponse {
  status: string;
  status_code: number;
  data?: {
    available_courier_companies?: IThinkCourierOption[];
  };
}

export interface IThinkLabelResponse {
  status: string;
  status_code: number;
  data?: {
    label_url?: string;
  };
}

export class IThinkApi {
  private http: AxiosInstance;

  constructor(private auth: IThinkAuth) {
    this.http = axios.create({
      baseURL: ITHINK_BASE_URL,
      timeout: 20_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getAuthPayload() {
    const creds = this.auth.getCredentials();
    return {
      access_token: creds.accessToken,
      secret_key: creds.secretKey,
    };
  }

  /** POST /order/add.json — Create shipment & assign AWB */
  async createOrder(shipment: IThinkCreateOrderPayload): Promise<IThinkCreateOrderResponse> {
    const payload = {
      data: {
        shipments: [shipment],
        ...this.getAuthPayload(),
      },
    };

    logger.info({ orderNo: shipment.order_no }, '[IThinkApi] Creating shipment...');
    const { data } = await this.http.post<IThinkCreateOrderResponse>('/order/add.json', payload);
    return data;
  }

  /** POST /order/cancel.json — Cancel shipment */
  async cancelOrder(awbNumber: string): Promise<any> {
    const payload = {
      data: {
        awb_number: awbNumber,
        ...this.getAuthPayload(),
      },
    };

    logger.info({ awbNumber }, '[IThinkApi] Cancelling shipment...');
    const { data } = await this.http.post('/order/cancel.json', payload);
    return data;
  }

  /** POST /order/track.json — Track shipment */
  async trackOrder(awbNumber: string): Promise<IThinkTrackResponse> {
    const payload = {
      data: {
        awb_number: awbNumber,
        ...this.getAuthPayload(),
      },
    };

    const { data } = await this.http.post<IThinkTrackResponse>('/order/track.json', payload);
    return data;
  }

  /** POST /pincode/check.json — Check serviceability & courier rates */
  async checkServiceability(
    pickupPincode: string,
    deliveryPincode: string,
    weightKg: number,
    isCOD: boolean
  ): Promise<IThinkServiceabilityResponse> {
    const payload = {
      data: {
        pickup_pincode: pickupPincode,
        delivery_pincode: deliveryPincode,
        weight: weightKg,
        payment_method: isCOD ? 'COD' : 'Prepaid',
        ...this.getAuthPayload(),
      },
    };

    const { data } = await this.http.post<IThinkServiceabilityResponse>('/pincode/check.json', payload);
    return data;
  }

  /** POST /order/print_label.json — Generate PDF shipping label */
  async generateLabel(awbNumber: string): Promise<IThinkLabelResponse> {
    const payload = {
      data: {
        awb_number: awbNumber,
        ...this.getAuthPayload(),
      },
    };

    const { data } = await this.http.post<IThinkLabelResponse>('/order/print_label.json', payload);
    return data;
  }

  /** POST /order/add_return.json — Create return shipment */
  async createReturnOrder(shipment: IThinkCreateOrderPayload): Promise<IThinkCreateOrderResponse> {
    const payload = {
      data: {
        shipments: [shipment],
        ...this.getAuthPayload(),
      },
    };

    logger.info({ orderNo: shipment.order_no }, '[IThinkApi] Creating return shipment...');
    const { data } = await this.http.post<IThinkCreateOrderResponse>('/order/add_return.json', payload);
    return data;
  }
}
