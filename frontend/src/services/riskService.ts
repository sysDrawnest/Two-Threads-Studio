import { apiClient } from './apiClient';

export interface CodEligibilityResponse {
  codEligible: boolean;
  reason: string | null;
  trustScore: number;
  prepaidDiscountPct: number;
  prepaidDiscountAmount: number;
}

export const riskService = {
  checkCodEligibility: async (orderTotal: number, productIds: string[]): Promise<{ data: CodEligibilityResponse }> => {
    const query = new URLSearchParams({
      orderTotal: orderTotal.toString(),
      productIds: productIds.join(','),
    });
    return apiClient.get(`/risk/cod-eligibility?${query.toString()}`);
  },

  sendOtp: async (recipient: string, purpose: string): Promise<{ success: boolean; data: any }> => {
    return apiClient.post('/risk/otp/send', { recipient, purpose });
  },

  verifyOtp: async (recipient: string, purpose: string, otp: string): Promise<{ success: boolean; data: any }> => {
    return apiClient.post('/risk/otp/verify', { recipient, purpose, otp });
  },

  lookupPin: async (pin: string): Promise<{ success: boolean; data: any }> => {
    return apiClient.get(`/risk/pin-lookup?pin=${pin}`);
  }
};
