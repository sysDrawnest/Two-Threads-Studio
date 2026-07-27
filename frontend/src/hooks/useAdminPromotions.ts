/**
 * Admin Promotions React Query Hooks — Phase 7.3
 * Custom hooks for Promotions/Coupons CRUD and Analytics.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { toast } from 'react-hot-toast';

export const promoKeys = {
  all: ['admin', 'promotions'] as const,
  coupons: () => [...promoKeys.all, 'coupons'] as const,
  couponDetail: (id: string) => [...promoKeys.coupons(), id] as const,
  analytics: () => [...promoKeys.all, 'analytics'] as const,
};

export const useAdminCoupons = (params?: any) => {
  return useQuery({
    queryKey: [...promoKeys.coupons(), params],
    queryFn: () => adminService.listCouponsAdmin(params),
    placeholderData: (prev) => prev,
  });
};

export const useAdminCouponDetail = (id: string) => {
  return useQuery({
    queryKey: promoKeys.couponDetail(id),
    queryFn: () => adminService.getCouponAdmin(id),
    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createCouponAdmin(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: promoKeys.coupons() });
      queryClient.invalidateQueries({ queryKey: promoKeys.analytics() });
      toast.success(res.message || 'Coupon created successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to create coupon');
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateCouponAdmin(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: promoKeys.couponDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: promoKeys.coupons() });
      toast.success(res.message || 'Coupon updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to update coupon');
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteCouponAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promoKeys.coupons() });
      queryClient.invalidateQueries({ queryKey: promoKeys.analytics() });
      toast.success('Coupon soft-deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete coupon');
    },
  });
};

export const useCloneCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.cloneCouponAdmin(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: promoKeys.coupons() });
      toast.success(res.message || 'Coupon cloned successfully as inactive draft');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to clone coupon');
    },
  });
};

export const useToggleCouponActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.toggleCouponActiveAdmin(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: promoKeys.couponDetail(id) });
      queryClient.invalidateQueries({ queryKey: promoKeys.coupons() });
      queryClient.invalidateQueries({ queryKey: promoKeys.analytics() });
      toast.success(res.message || 'Status toggled successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to toggle status');
    },
  });
};

export const useCouponAnalytics = () => {
  return useQuery({
    queryKey: promoKeys.analytics(),
    queryFn: adminService.getCouponAnalyticsAdmin,
    staleTime: 2 * 60 * 1000,
  });
};
