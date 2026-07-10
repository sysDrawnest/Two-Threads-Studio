import { create } from 'zustand';

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

export interface ShippingInfo {
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'upi';
  last4?: string;
}

interface CheckoutState {
  currentStep: CheckoutStep;
  shippingInfo: ShippingInfo | null;
  paymentMethod: PaymentMethod | null;
  
  setStep: (step: CheckoutStep) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  currentStep: 'cart',
  shippingInfo: null,
  paymentMethod: null,
  
  setStep: (step) => set({ currentStep: step }),
  setShippingInfo: (info) => set({ shippingInfo: info }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  resetCheckout: () => set({ currentStep: 'cart', shippingInfo: null, paymentMethod: null }),
}));
