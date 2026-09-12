/**
 * CMS React Query Hooks — Phase 9 (CMS Engine)
 * useHeroConfig / useHomepageConfig — used by storefront sections.
 * useAdminHomepageConfig / useUpdateHomepageConfig — used by Admin CMS Dashboard.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsService, HomepageCMSConfig, CommunityGalleryItem } from '../services/cmsService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const cmsKeys = {
  all: ['cms'] as const,
  heroConfig: () => [...cmsKeys.all, 'heroConfig'] as const,
  homepageConfig: () => [...cmsKeys.all, 'homepageConfig'] as const,
  communityGallery: () => [...cmsKeys.all, 'communityGallery'] as const,
  adminCommunityGallery: () => [...cmsKeys.all, 'adminCommunityGallery'] as const,
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

/**
 * Storefront hook — fetches active community gallery items and Instagram URL.
 */
export const useCommunityGallery = () =>
  useQuery({
    queryKey: cmsKeys.communityGallery(),
    queryFn: async () => {
      const res = await cmsService.getCommunityGallery();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

/**
 * Admin read hook for Community Gallery.
 */
export const useAdminCommunityGallery = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: cmsKeys.adminCommunityGallery(),
    queryFn: async () => {
      const res = await cmsService.getAdminCommunityGallery();
      return res.data;
    },
    enabled: isAdmin,
  });
};

/**
 * Admin write hook — upsert community gallery item.
 */
export const useUpsertCommunityGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Partial<CommunityGalleryItem>) => cmsService.upsertCommunityGalleryItem(item),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.adminCommunityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.communityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.homepageConfig() });
      toast.success(data.message || 'Gallery item saved');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save gallery item');
    },
  });
};

/**
 * Admin write hook — delete community gallery item.
 */
export const useDeleteCommunityGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cmsService.deleteCommunityGalleryItem(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.adminCommunityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.communityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.homepageConfig() });
      toast.success(data.message || 'Gallery item removed');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to remove gallery item');
    },
  });
};

/**
 * Admin write hook — reorder community gallery items.
 */
export const useReorderCommunityGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { itemIds?: string[]; items?: CommunityGalleryItem[] }) =>
      cmsService.reorderCommunityGallery(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.adminCommunityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.communityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.homepageConfig() });
      toast.success(data.message || 'Gallery order updated');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to reorder gallery');
    },
  });
};

/**
 * Admin write hook — update Instagram URL.
 */
export const useUpdateInstagramUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (instagramUrl: string) => cmsService.updateInstagramUrl(instagramUrl),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.adminCommunityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.communityGallery() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.homepageConfig() });
      toast.success(data.message || 'Instagram URL updated');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update Instagram URL');
    },
  });
};

