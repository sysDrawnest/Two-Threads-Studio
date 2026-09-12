/**
 * CMS Service — Phase 9 (CMS Engine)
 * API calls for reading and writing CMS configuration.
 */

import { apiClient } from './apiClient';

export interface HeroConfig {
  activeTemplate: 1 | 2 | 3 | 4 | 5;
}

export interface CMSSectionConfig {
  productIds?: string[];
  limit?: number;
  title?: string;
  enabled?: boolean;
}

export interface CMSCategoryConfig {
  id: string;
  name: string;
  slug: string;
  image: string;
  count?: number;
  featured?: boolean;
  visible?: boolean;
  sortOrder?: number;
}

export interface CommunityGalleryItem {
  id: string;
  imageUrl: string;
  userHandle: string;
  productName: string;
  productSlug?: string;
  productId?: string;
  tall?: boolean;
  active?: boolean;
  order?: number;
}

export interface CommunityGalleryResponse {
  items: CommunityGalleryItem[];
  instagramUrl: string;
}

export interface HomepageCMSConfig {
  activeHeroTemplate: 1 | 2 | 3 | 4 | 5;
  bestSellersConfig: CMSSectionConfig;
  newArrivalsConfig: CMSSectionConfig;
  menswearConfig: CMSSectionConfig;
  womenswearConfig: CMSSectionConfig;
  categoriesConfig: CMSCategoryConfig[];
  communityGallery?: CommunityGalleryItem[];
  instagramUrl?: string;
}

export const cmsService = {
  /**
   * Public endpoint — fetches active hero template.
   */
  getHeroConfig: (): Promise<{ success: boolean; data: HeroConfig }> =>
    apiClient.get('/cms/hero-config'),

  /**
   * Admin endpoint — updates active hero template.
   */
  updateHeroConfig: (activeTemplate: 1 | 2 | 3 | 4 | 5): Promise<{ success: boolean; message: string; data: HeroConfig }> =>
    apiClient.patch('/admin/cms/hero-config', { activeTemplate }),

  /**
   * Public endpoint — fetches complete homepage CMS config.
   */
  getHomepageConfig: (): Promise<{ success: boolean; data: HomepageCMSConfig }> =>
    apiClient.get('/cms/homepage-config'),

  /**
   * Admin endpoint — updates homepage CMS merchandising configuration.
   */
  updateHomepageConfig: (payload: Partial<HomepageCMSConfig>): Promise<{ success: boolean; message: string; data: HomepageCMSConfig }> =>
    apiClient.patch('/admin/cms/homepage-config', payload),

  /**
   * Public endpoint — fetches active community gallery items and Instagram URL.
   */
  getCommunityGallery: (): Promise<{ success: boolean; data: CommunityGalleryResponse }> =>
    apiClient.get('/cms/community-gallery'),

  /**
   * Admin endpoint — fetches all community gallery items.
   */
  getAdminCommunityGallery: (): Promise<{ success: boolean; data: CommunityGalleryResponse }> =>
    apiClient.get('/admin/cms/community-gallery'),

  /**
   * Admin endpoint — creates or updates a community gallery item.
   */
  upsertCommunityGalleryItem: (item: Partial<CommunityGalleryItem>): Promise<{ success: boolean; message: string; data: { item: CommunityGalleryItem; items: CommunityGalleryItem[] } }> =>
    apiClient.post('/admin/cms/community-gallery', item),

  /**
   * Admin endpoint — deletes a community gallery item.
   */
  deleteCommunityGalleryItem: (id: string): Promise<{ success: boolean; message: string; data: { items: CommunityGalleryItem[] } }> =>
    apiClient.delete(`/admin/cms/community-gallery/${id}`),

  /**
   * Admin endpoint — reorders community gallery items.
   */
  reorderCommunityGallery: (payload: { itemIds?: string[]; items?: CommunityGalleryItem[] }): Promise<{ success: boolean; message: string; data: { items: CommunityGalleryItem[] } }> =>
    apiClient.patch('/admin/cms/community-gallery/reorder', payload),

  /**
   * Admin endpoint — updates studio Instagram URL.
   */
  updateInstagramUrl: (instagramUrl: string): Promise<{ success: boolean; message: string; data: { instagramUrl: string } }> =>
    apiClient.patch('/admin/cms/instagram-url', { instagramUrl }),
};
