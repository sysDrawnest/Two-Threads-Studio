import { apiClient } from './apiClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  productSlug: string;
  productImage: string | null;
  sku: string | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  customization: any;
  engravingText: string | null;
  giftWrap: boolean;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  previousStatus: string | null;
  newStatus: string;
  changedBy: string;
  note: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  shippingAddressId: string;
  billingAddressId: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  paymentMethod: string;
  notes: string | null;
  estimatedCompletionDate: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  shippingAddress?: any;
  billingAddress?: any;
}

export const orderService = {
  createOrder: async (data: {
    shippingAddressId: string;
    billingAddressId: string;
    notes?: string | null;
    paymentMethod?: string;
  }): Promise<{ success: boolean; order: Order }> => {
    return apiClient.post('/orders', data);
  },

  getOrders: async (page = 1, limit = 10): Promise<{ success: boolean; orders: Order[]; pagination: any }> => {
    return apiClient.get(`/orders?page=${page}&limit=${limit}`);
  },

  getOrderById: async (id: string): Promise<{ success: boolean; order: Order }> => {
    return apiClient.get(`/orders/${id}`);
  },

  cancelOrder: async (id: string, reason?: string): Promise<{ success: boolean; order: Order }> => {
    return apiClient.post(`/orders/${id}/cancel`, { reason });
  },

  downloadInvoice: async (id: string, orderNumber: string): Promise<void> => {
    const token = localStorage.getItem('tt_access_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/orders/${id}/invoice`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error('Failed to download invoice PDF');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice_${orderNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
