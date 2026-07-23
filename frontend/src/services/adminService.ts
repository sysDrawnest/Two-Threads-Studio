/**
 * Admin Service — Phase 6A
 * Centralized API client for all admin operations
 */

import { apiClient } from './apiClient';
import { Product } from '../types/product';

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
export type User = any;
export type Review = any;

export const adminService = {
  // ── Upload ────────────────────────────────────────────────────────────────
  getUploadStatus: async () => {
    const response = await apiClient.get('/upload/status');
    return response;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/upload/single', formData);
    return response;
  },

  uploadMultipleImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await apiClient.post('/upload/multiple', formData);
    return response;
  },

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
  
  // ── PIM / Products ────────────────────────────────────────────────────────
  listProducts: async (params?: any): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products/admin', { params });
    return response.data;
  },
  
  getProduct: async (id: string) => {
    const response = await apiClient.get(`/products/admin/${id}`);
    return response.data;
  },
  
  createProduct: async (data: any) => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },
  
  updateProduct: async (id: string, data: any) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
  
  duplicateProduct: async (id: string, data: any) => {
    const response = await apiClient.post(`/products/${id}/duplicate`, data);
    return response.data;
  },
  
  bulkProductAction: async (data: any) => {
    const response = await apiClient.post('/products/admin/bulk-action', data);
    return response.data;
  },
  
  addProductMedia: async (id: string, data: any) => {
    const response = await apiClient.post(`/products/${id}/media`, data);
    return response.data;
  },
  
  removeProductMedia: async (id: string, mediaId: string) => {
    const response = await apiClient.delete(`/products/${id}/media/${mediaId}`);
    return response.data;
  },
  
  reorderProductMedia: async (id: string, data: any) => {
    const response = await apiClient.put(`/products/${id}/media/reorder`, data);
    return response.data;
  },
  
  upsertProductVariant: async (id: string, data: any) => {
    const response = await apiClient.post(`/products/${id}/variants`, data);
    return response.data;
  },
  
  deleteProductVariant: async (id: string, variantId: string) => {
    const response = await apiClient.delete(`/products/${id}/variants/${variantId}`);
    return response.data;
  },
  
  getProductAnalytics: async (id: string) => {
    const response = await apiClient.get(`/products/${id}/analytics`);
    return response.data;
  },
  
  listInventory: async (params?: any): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/admin/inventory', { params });
    return response.data;
  },
  
  adjustStock: async (id: string, data: { adjustment: number, reason?: string, variantId?: string }) => {
    const response = await apiClient.patch(`/admin/inventory/${id}`, data);
    return response.data;
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

  // ── Categories ────────────────────────────────────────────────────────────
  listCategoriesAdmin: async (): Promise<any> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  createCategory: async (data: any) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },
  updateCategory: async (id: string, data: any) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },

  // ── Collections ───────────────────────────────────────────────────────────
  listCollectionsAdmin: async (): Promise<any> => {
    const response = await apiClient.get('/collections');
    return response.data;
  },
  createCollection: async (data: any) => {
    const response = await apiClient.post('/collections', data);
    return response.data;
  },
  updateCollection: async (id: string, data: any) => {
    const response = await apiClient.put(`/collections/${id}`, data);
    return response.data;
  },
  deleteCollection: async (id: string) => {
    const response = await apiClient.delete(`/collections/${id}`);
    return response.data;
  },

  // ── Refunds ───────────────────────────────────────────────────────────────
  processRefund: async (paymentId: string, data: { amount?: number; reason?: string }) => {
    const response = await apiClient.post(`/admin/payments/${paymentId}/refund`, data);
    return response;
  },

  // ── Security & RBAC ───────────────────────────────────────────────────────
  getSecurityAuditLogs: async (params?: any) => {
    const response = await apiClient.get('/admin/risk/dashboard', { params });
    return response;
  },

  updateSecuritySettings: async (data: any) => {
    const response = await apiClient.patch('/admin/settings/company', data);
    return response;
  },
};
