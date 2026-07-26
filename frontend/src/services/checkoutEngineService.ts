/**
 * Checkout Service — Phase 7.1 Frontend Client
 * Client wrapper for Phase 7.1 Checkout Engine REST API.
 */

import { apiClient } from './apiClient';
import { Address } from '../hooks/useCommerce';

export interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description: string | null;
  basePrice: number;
  minOrderForFree: number | null;
  estDispatchDays: number;
  estDeliveryDays: number;
  cutoffTime: string;
  shipWeekends: boolean;
  priority: number;
  isEnabled: boolean;
}

export interface DeliveryEta {
  estDispatchDate: string;
  estDeliveryDateMin: string;
  estDeliveryDateMax: string;
  estDispatchText: string;
  estDeliveryText: string;
  isCutoffPassed: boolean;
  shippingMethodId: string;
  shippingMethodName: string;
}

export interface ServerPricing {
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productName: string;
  }>;
  subtotal: number;
  shipping: number;
  shippingMethodId?: string | null;
  shippingMethodName?: string;
  tax: number;
  gstMode: 'inclusive' | 'exclusive';
  gstPercent: number;
  codFee: number;
  grandTotal: number;
  currency: string;
}

export interface CheckoutSummaryResponse {
  session: {
    id: string;
    sessionToken: string;
    step: 'INFORMATION' | 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION';
    isGuest: boolean;
    customerEmail: string | null;
    customerPhone: string | null;
    customerName: string | null;
    shippingAddressId: string | null;
    billingAddressId: string | null;
    shippingMethodId: string | null;
    paymentMethod: 'ONLINE' | 'COD' | 'BANK_TRANSFER' | null;
    expiresAt: string;
  };
  pricing: ServerPricing;
  eta: DeliveryEta;
  availableShippingMethods: ShippingMethod[];
  shippingAddress: Address | null;
  billingAddress: Address | null;
}

export const checkoutEngineService = {
  createOrResumeSession: async (sessionToken?: string): Promise<{ session: any }> => {
    const res = await apiClient.post('/checkout/session', { sessionToken });
    return res;
  },

  getSummary: async (sessionToken: string): Promise<CheckoutSummaryResponse> => {
    const res = await apiClient.get(`/checkout/summary?sessionToken=${sessionToken}`);
    return res;
  },

  updateCustomerInfo: async (
    sessionToken: string,
    data: { customerEmail: string; customerPhone: string; customerName: string }
  ) => {
    const res = await apiClient.patch('/checkout/customer', { sessionToken, ...data });
    return res;
  },

  updateAddresses: async (
    sessionToken: string,
    data: { shippingAddressId: string; billingAddressId?: string; billingSameAsShipping?: boolean }
  ) => {
    const res = await apiClient.patch('/checkout/address', { sessionToken, ...data });
    return res;
  },

  updateShippingMethod: async (sessionToken: string, shippingMethodId: string) => {
    const res = await apiClient.patch('/checkout/shipping', { sessionToken, shippingMethodId });
    return res;
  },

  listShippingMethods: async (): Promise<{ methods: ShippingMethod[]; eta: DeliveryEta }> => {
    const res = await apiClient.get('/checkout/shipping-methods');
    return res;
  },
};
