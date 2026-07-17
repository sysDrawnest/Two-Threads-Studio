/**
 * Admin Service — Phase 6A
 * Centralized API client for all admin operations
 */

import { apiClient } from './apiClient';
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Basic types to satisfy the compiler
export type Order = any;
export type Product = any;
export type User = any;
export type Review = any;

export const adminService = {
  // ── Dashboard ─────────────────────────────────────────────────────────────
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response;
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  listOrders: async (params?: any): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get('/admin/orders', { params });
    return response;
  },
  
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return response;
  },
  
  updateOrderStatus: async (id: string, status: string, note?: string) => {
    const response = await apiClient.patch(`/admin/orders/${id}/status`, { status, note });
    return response;
  },
  
  updateOrderNote: async (id: string, note: string) => {
    const response = await apiClient.patch(`/admin/orders/${id}/note`, { note });
    return response;
  },
  
  // ── Customers ─────────────────────────────────────────────────────────────
  listCustomers: async (params?: any): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/admin/customers', { params });
    return response;
  },
  
  getCustomer: async (id: string) => {
    const response = await apiClient.get(`/admin/customers/${id}`);
    return response;
  },
  
  updateCustomerStatus: async (id: string, isActive: boolean) => {
    const response = await apiClient.patch(`/admin/customers/${id}/status`, { isActive });
    return response;
  },
  
  // ── Products & Inventory ──────────────────────────────────────────────────
  // Note: Standard product CRUD uses existing productService, 
  // but we can proxy admin-specific ones here or use them directly.
  listInventory: async (params?: any): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/admin/inventory', { params });
    return response;
  },
  
  adjustStock: async (id: string, data: { adjustment: number, reason?: string, variantId?: string }) => {
    const response = await apiClient.patch(`/admin/inventory/${id}`, data);
    return response;
  },
  
  // ── Reviews ───────────────────────────────────────────────────────────────
  listReviews: async (params?: any): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get('/admin/reviews', { params });
    return response;
  },
  
  approveReview: async (id: string) => {
    const response = await apiClient.patch(`/admin/reviews/${id}/approve`);
    return response;
  },
  
  rejectReview: async (id: string) => {
    const response = await apiClient.patch(`/admin/reviews/${id}/reject`);
    return response;
  },
  
  deleteReview: async (id: string) => {
    const response = await apiClient.delete(`/admin/reviews/${id}`);
    return response;
  },
  
  // ── Risk & Fraud ──────────────────────────────────────────────────────────
  getRiskDashboard: async () => {
    const response = await apiClient.get('/admin/risk/dashboard');
    return response;
  },
  
  listFraudFlags: async (params?: any) => {
    const response = await apiClient.get('/admin/risk/fraud-flags', { params });
    return response;
  },
  
  resolveFraudFlag: async (flagId: string) => {
    const response = await apiClient.patch(`/admin/risk/fraud-flags/${flagId}/resolve`);
    return response;
  },
  
  listReviewQueue: async (params?: any) => {
    const response = await apiClient.get('/admin/risk/review-queue', { params });
    return response;
  },
  
  approveOrder: async (orderId: string, note?: string) => {
    const response = await apiClient.post(`/admin/risk/review-queue/${orderId}/approve`, { note });
    return response;
  },
  
  rejectOrder: async (orderId: string, note?: string) => {
    const response = await apiClient.post(`/admin/risk/review-queue/${orderId}/reject`, { note });
    return response;
  },

  blockCustomer: async (userId: string, data: { isBlocked: boolean, reason?: string }) => {
    const response = await apiClient.patch(`/admin/risk/customers/${userId}/block`, data);
    return response;
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  getAnalyticsRevenue: async (params?: any) => {
    const response = await apiClient.get('/admin/analytics/revenue', { params });
    return response;
  },
  
  getAnalyticsOrders: async (params?: any) => {
    const response = await apiClient.get('/admin/analytics/orders', { params });
    return response;
  },
  
  getAnalyticsProducts: async (params?: any) => {
    const response = await apiClient.get('/admin/analytics/products', { params });
    return response;
  },
  
  getAnalyticsCustomers: async (params?: any) => {
    const response = await apiClient.get('/admin/analytics/customers', { params });
    return response;
  },

  getAnalyticsCategories: async (params?: any) => {
    const response = await apiClient.get('/admin/analytics/categories', { params });
    return response;
  },
  
  // ── Settings ──────────────────────────────────────────────────────────────
  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response;
  },
  
  updateSettingsCompany: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/company', data);
    return response;
  },
  
  updateSettingsGst: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/gst', data);
    return response;
  },
  
  updateSettingsShipping: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/shipping', data);
    return response;
  },
  
  updateSettingsCod: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/cod', data);
    return response;
  },
  
  updateSettingsReturns: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/returns', data);
    return response;
  },
  
  updateSettingsInvoice: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/invoice', data);
    return response;
  },
  
  updateSettingsContact: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/contact', data);
    return response;
  },
  
  updateSettingsEmailTemplates: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/email-templates', data);
    return response;
  },
};
