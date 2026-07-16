/**
 * Payment Service (Frontend)
 *
 * All payment API calls are centralized here.
 * The frontend never decides payment status — it only calls the backend.
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach auth token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  order: {
    id: string;
    orderNumber: string;
    grandTotal: number;
  };
}

export interface PaymentVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const paymentService = {
  /**
   * Step 1: Create a Razorpay order on the backend before opening popup
   */
  createRazorpayOrder: async (orderId: string): Promise<RazorpayOrderResponse> => {
    const { data } = await api.post(`/payments/orders/${orderId}/razorpay-order`);
    return data.data;
  },

  /**
   * Step 2: Verify payment after the Razorpay popup returns success.
   * ALWAYS verify server-side — never trust the popup response alone.
   */
  verifyPayment: async (
    orderId: string,
    payload: PaymentVerifyPayload
  ): Promise<void> => {
    await api.post(`/payments/orders/${orderId}/verify`, payload);
  },

  /**
   * Confirm a COD order (no Razorpay popup)
   */
  confirmCodOrder: async (orderId: string): Promise<void> => {
    await api.post(`/payments/orders/${orderId}/cod`);
  },

  /**
   * Get payment status for a specific order
   */
  getPaymentStatus: async (orderId: string) => {
    const { data } = await api.get(`/payments/orders/${orderId}`);
    return data.data;
  },

  /**
   * Get shipment tracking for an order
   */
  getShipment: async (orderId: string) => {
    const { data } = await api.get(`/payments/orders/${orderId}/shipment`);
    return data.data;
  },

  /**
   * Get live tracking from shipping provider
   */
  getLiveTracking: async (orderId: string) => {
    const { data } = await api.get(`/payments/orders/${orderId}/shipment/tracking`);
    return data.data;
  },
};

/**
 * Loads the Razorpay checkout script dynamically (once).
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export type RazorpayHandler = (response: PaymentVerifyPayload) => void;
export type RazorpayDismissHandler = () => void;

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: RazorpayHandler;
  modal?: {
    ondismiss?: RazorpayDismissHandler;
  };
}

export function openRazorpayPopup(options: RazorpayCheckoutOptions): void {
  const RazorpayInstance = new (window as any).Razorpay(options);
  RazorpayInstance.open();
}
