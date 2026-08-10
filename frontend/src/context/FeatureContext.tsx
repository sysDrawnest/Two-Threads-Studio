/**
 * FeatureContext & Provider
 * Manages global feature flag state using React Query.
 * Defaults safely to LEARNING_HUB: false to guarantee non-blocking initial rendering.
 */

import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeatureFlags, DEFAULT_FEATURES } from '../config/features';
import { featureService } from '../services/featureService';
import { toast } from 'react-hot-toast';

interface FeatureContextType {
  features: FeatureFlags;
  isLoading: boolean;
  isUpdating: boolean;
  updateFeature: (key: keyof FeatureFlags, enabled: boolean) => Promise<void>;
}

const FeatureContext = createContext<FeatureContextType>({
  features: DEFAULT_FEATURES,
  isLoading: false,
  isUpdating: false,
  updateFeature: async () => {},
});

export const featureKeys = {
  all: ['features'] as const,
};

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Asynchronously query feature flags with a 5-minute stale time
  const { data: features = DEFAULT_FEATURES, isLoading } = useQuery({
    queryKey: featureKeys.all,
    queryFn: featureService.getPublicFeatures,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Admin Mutation for toggling feature flags in DB
  const updateMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: keyof FeatureFlags; enabled: boolean }) =>
      featureService.updateFeatureFlag(key, enabled),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: featureKeys.all });
      toast.success(res.message || 'Feature configuration saved');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update feature flag');
    },
  });

  const updateFeature = async (key: keyof FeatureFlags, enabled: boolean) => {
    await updateMutation.mutateAsync({ key, enabled });
  };

  return (
    <FeatureContext.Provider
      value={{
        features,
        isLoading,
        isUpdating: updateMutation.isPending,
        updateFeature,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = () => useContext(FeatureContext);
