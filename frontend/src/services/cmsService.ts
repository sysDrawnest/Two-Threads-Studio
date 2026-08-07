/**
 * CMS Service — Phase 9 (CMS Engine)
 * API calls for reading and writing CMS configuration.
 */

import { apiClient } from './apiClient';

export interface HeroConfig {
  activeTemplate: 1 | 2 | 3 | 4;
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

export interface HomepageCMSConfig {
  activeHeroTemplate: 1 | 2 | 3 | 4;
  bestSellersConfig: CMSSectionConfig;
  newArrivalsConfig: CMSSectionConfig;
  menswearConfig: CMSSectionConfig;
  womenswearConfig: CMSSectionConfig;
  categoriesConfig: CMSCategoryConfig[];
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
  updateHeroConfig: (activeTemplate: 1 | 2 | 3 | 4): Promise<{ success: boolean; message: string; data: HeroConfig }> =>
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
};
