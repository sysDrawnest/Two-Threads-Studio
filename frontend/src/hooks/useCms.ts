/**
 * CMS React Query Hooks — Phase 9 (CMS Engine)
 * useHeroConfig / useHomepageConfig — used by storefront sections.
 * useAdminHomepageConfig / useUpdateHomepageConfig — used by Admin CMS Dashboard.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsService, HomepageCMSConfig } from '../services/cmsService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const cmsKeys = {
  all: ['cms'] as const,
  heroConfig: () => [...cmsKeys.all, 'heroConfig'] as const,
  homepageConfig: () => [...cmsKeys.all, 'homepageConfig'] as const,
};

/**
 * Storefront hook — fetches active hero template with generous stale time.
 */
export const useHeroConfig = () =>
  useQuery({
    queryKey: cmsKeys.heroConfig(),
    queryFn: cmsService.getHeroConfig,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

/**
 * Admin read hook for Hero Config.
 */
export const useAdminHeroConfig = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: cmsKeys.heroConfig(),
    queryFn: cmsService.getHeroConfig,
    enabled: isAdmin,
  });
};

/**
 * Admin write hook for Hero Config.
 */
export const useUpdateHeroConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activeTemplate: 1 | 2 | 3 | 4 | 5) => cmsService.updateHeroConfig(activeTemplate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.heroConfig() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.homepageConfig() });
      toast.success(data.message || 'Hero template saved');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save hero template');
    },
  });
};

/**
 * Storefront hook — fetches full homepage CMS configuration.
 */
export const useHomepageConfig = () =>
  useQuery({
    queryKey: cmsKeys.homepageConfig(),
    queryFn: cmsService.getHomepageConfig,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

/**
 * Admin read hook for full Homepage Config.
 */
export const useAdminHomepageConfig = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: cmsKeys.homepageConfig(),
    queryFn: cmsService.getHomepageConfig,
    enabled: isAdmin,
  });
};

/**
 * Admin write hook for full Homepage Config.
 */
export const useUpdateHomepageConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<HomepageCMSConfig>) => cmsService.updateHomepageConfig(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.homepageConfig() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.heroConfig() });
      toast.success(data.message || 'Homepage CMS configuration saved');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save homepage configuration');
    },
  });
};
