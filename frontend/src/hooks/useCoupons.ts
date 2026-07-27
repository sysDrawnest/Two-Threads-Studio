import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: string;
  discountValue: number;
  maxDiscountAmount: number | null;
  minCartSubtotal: number;
  endDate: string | null;
}

export const useCoupons = (sessionToken?: string) => {
  const queryClient = useQueryClient();

  // Fetch available promotions
  const availableCouponsQuery = useQuery<{ coupons: CouponItem[] }>({
    queryKey: ['availableCoupons'],
    queryFn: async () => {
      const res = await apiClient.get('/coupons/available');
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Apply Coupon Mutation
  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiClient.post('/coupons/apply', { code, sessionToken });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkoutSummary'] });
    },
  });

  // Remove Coupon Mutation
  const removeCouponMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/coupons/remove', { sessionToken });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkoutSummary'] });
    },
  });

  return {
    availableCoupons: availableCouponsQuery.data?.coupons || [],
    isLoadingCoupons: availableCouponsQuery.isLoading,
    applyCoupon: applyCouponMutation.mutateAsync,
    isApplyingCoupon: applyCouponMutation.isPending,
    applyError: applyCouponMutation.error,
    removeCoupon: removeCouponMutation.mutateAsync,
    isRemovingCoupon: removeCouponMutation.isPending,
  };
};
