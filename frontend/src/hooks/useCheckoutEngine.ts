/**
 * Phase 7.1 Checkout Engine Hooks — useCheckoutEngine
 * Reactive state management for enterprise checkout sessions, server pricing, ETAs,
 * address label selections, and shipping method updates.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutEngineService, CheckoutSummaryResponse } from '../services/checkoutEngineService';
import { useEffect, useState } from 'react';

const SESSION_STORAGE_KEY = 'tts_checkout_session_token';

export const useCheckoutEngine = () => {
  const queryClient = useQueryClient();

  // 1. Maintain checkout session token in sessionStorage
  const [sessionToken, setSessionToken] = useState<string>(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) || '';
  });

  // 2. Init or Resume session on mount
  useEffect(() => {
    checkoutEngineService.createOrResumeSession(sessionToken).then((res) => {
      const activeToken = res.session.sessionToken;
      if (activeToken && activeToken !== sessionToken) {
        setSessionToken(activeToken);
        sessionStorage.setItem(SESSION_STORAGE_KEY, activeToken);
      }
    }).catch(console.error);
  }, []);

  // 3. Query live server-calculated checkout summary
  const summaryQuery = useQuery<CheckoutSummaryResponse>({
    queryKey: ['checkoutSummary', sessionToken],
    queryFn: () => checkoutEngineService.getSummary(sessionToken),
    enabled: Boolean(sessionToken),
    refetchOnWindowFocus: false,
  });

  // 4. Customer Info Mutation
  const updateCustomerMutation = useMutation({
    mutationFn: (data: { customerEmail: string; customerPhone: string; customerName: string }) =>
      checkoutEngineService.updateCustomerInfo(sessionToken, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkoutSummary', sessionToken] });
    },
  });

  // 5. Address Selection Mutation
  const updateAddressMutation = useMutation({
    mutationFn: (data: { shippingAddressId: string; billingAddressId?: string; billingSameAsShipping?: boolean }) =>
      checkoutEngineService.updateAddresses(sessionToken, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkoutSummary', sessionToken] });
    },
  });

  // 6. Shipping Method Selection Mutation
  const updateShippingMethodMutation = useMutation({
    mutationFn: (shippingMethodId: string) =>
      checkoutEngineService.updateShippingMethod(sessionToken, shippingMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkoutSummary', sessionToken] });
    },
  });

  return {
    sessionToken,
    summary: summaryQuery.data,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
    error: summaryQuery.error,
    updateCustomer: updateCustomerMutation.mutateAsync,
    isUpdatingCustomer: updateCustomerMutation.isPending,
    updateAddresses: updateAddressMutation.mutateAsync,
    isUpdatingAddresses: updateAddressMutation.isPending,
    updateShippingMethod: updateShippingMethodMutation.mutateAsync,
    isUpdatingShippingMethod: updateShippingMethodMutation.isPending,
    refetchSummary: summaryQuery.refetch,
  };
};
