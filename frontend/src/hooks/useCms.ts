/**
 * CMS React Query Hooks — Phase 9 (CMS Phase 1)
 * useHeroConfig — used by the storefront DynamicHero to resolve the active template.
 * useAdminHeroConfig / useUpdateHeroConfig — used by the Admin CMS Dashboard.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsService } from '../services/cmsService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const cmsKeys = {
  all: ['cms'] as const,
  heroConfig: () => [...cmsKeys.all, 'heroConfig'] as const,
  merchandising: () => [...cmsKeys.all, 'merchandising'] as const,
};

/**
 * Storefront hook — fetches the active hero template with a generous stale time.
 * No auth required.
 */
export const useHeroConfig = () =>
  useQuery({
    queryKey: cmsKeys.heroConfig(),
    queryFn: cmsService.getHeroConfig,
    staleTime: 5 * 60 * 1000, // 5 min — reduces round-trips on every page visit
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

/**
 * Storefront hook — fetches homepage merchandising layout configuration.
 */
export const useHomepageMerchandising = () =>
  useQuery({
    queryKey: cmsKeys.merchandising(),
    queryFn: cmsService.getHomepageMerchandising,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

/**
 * Admin read hook — same query, gated by isAdmin so customer sessions
 * never fire admin-scoped requests.
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
 * Admin write hook — updates activeTemplate and invalidates both
 * the admin query and the storefront query so the preview is instant.
 */
export const useUpdateHeroConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activeTemplate: 1 | 2 | 3 | 4) => cmsService.updateHeroConfig(activeTemplate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.heroConfig() });
      toast.success(data.message || 'Hero template saved');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save hero template');
    },
  });
};

/**
 * Admin write hook — updates homepage merchandising configuration.
 */
export const useUpdateHomepageMerchandising = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => cmsService.updateHomepageMerchandising(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.merchandising() });
      toast.success(data.message || 'Homepage merchandising saved');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save merchandising config');
    },
  });
};
