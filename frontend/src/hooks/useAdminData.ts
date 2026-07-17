/**
 * Admin React Query Hooks — Phase 6A
 * Custom hooks for data fetching and mutations in the admin panel
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';
import { toast } from 'react-hot-toast';

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  customers: () => [...adminKeys.all, 'customers'] as const,
  customerDetail: (id: string) => [...adminKeys.customers(), id] as const,
  orders: () => [...adminKeys.all, 'orders'] as const,
  orderDetail: (id: string) => [...adminKeys.orders(), id] as const,
  inventory: () => [...adminKeys.all, 'inventory'] as const,
  reviews: () => [...adminKeys.all, 'reviews'] as const,
  settings: () => [...adminKeys.all, 'settings'] as const,
  analytics: () => [...adminKeys.all, 'analytics'] as const,
  risk: () => [...adminKeys.all, 'risk'] as const,
};

// ── Dashboard ─────────────────────────────────────────────────────────────

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: adminService.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ── Customers ─────────────────────────────────────────────────────────────

export const useAdminCustomers = (params: any) => {
  return useQuery({
    queryKey: [...adminKeys.customers(), params],
    queryFn: () => adminService.listCustomers(params),
    placeholderData: (prev) => prev, // keep previous data while fetching new page
  });
};

export const useAdminCustomerDetail = (id: string) => {
  return useQuery({
    queryKey: adminKeys.customerDetail(id),
    queryFn: () => adminService.getCustomer(id),
    enabled: !!id,
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      adminService.updateCustomerStatus(id, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customerDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.customers() });
      toast.success(data.message || 'Customer status updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update customer status');
    }
  });
};

// ── Orders ────────────────────────────────────────────────────────────────

export const useAdminOrders = (params: any) => {
  return useQuery({
    queryKey: [...adminKeys.orders(), params],
    queryFn: () => adminService.listOrders(params),
    placeholderData: (prev) => prev,
  });
};

export const useAdminOrderDetail = (id: string) => {
  return useQuery({
    queryKey: adminKeys.orderDetail(id),
    queryFn: () => adminService.getOrder(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) => 
      adminService.updateOrderStatus(id, status, note),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.orderDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
      toast.success(data.message || 'Order status updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  });
};

// ── Inventory ─────────────────────────────────────────────────────────────

export const useAdminInventory = (params: any) => {
  return useQuery({
    queryKey: [...adminKeys.inventory(), params],
    queryFn: () => adminService.listInventory(params),
    placeholderData: (prev) => prev,
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { adjustment: number; reason?: string; variantId?: string } }) => 
      adminService.adjustStock(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.inventory() });
      toast.success('Stock adjusted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to adjust stock');
    }
  });
};

// ── Reviews ───────────────────────────────────────────────────────────────

export const useAdminReviews = (params: any) => {
  return useQuery({
    queryKey: [...adminKeys.reviews(), params],
    queryFn: () => adminService.listReviews(params),
    placeholderData: (prev) => prev,
  });
};

export const useModerateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' | 'delete' }) => {
      if (action === 'approve') return adminService.approveReview(id);
      if (action === 'reject') return adminService.rejectReview(id);
      return adminService.deleteReview(id);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reviews() });
      const msg = variables.action === 'approve' ? 'Review approved' : variables.action === 'reject' ? 'Review rejected' : 'Review deleted';
      toast.success(msg);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to moderate review');
    }
  });
};

// ── Settings ──────────────────────────────────────────────────────────────

export const useAdminSettings = () => {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: adminService.getSettings,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ section, data }: { section: string; data: any }) => {
      switch(section) {
        case 'company': return adminService.updateSettingsCompany(data);
        case 'gst': return adminService.updateSettingsGst(data);
        case 'shipping': return adminService.updateSettingsShipping(data);
        case 'cod': return adminService.updateSettingsCod(data);
        case 'returns': return adminService.updateSettingsReturns(data);
        case 'invoice': return adminService.updateSettingsInvoice(data);
        case 'contact': return adminService.updateSettingsContact(data);
        case 'email-templates': return adminService.updateSettingsEmailTemplates(data);
        default: throw new Error('Invalid settings section');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
      toast.success(data.message || 'Settings updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    }
  });
};
