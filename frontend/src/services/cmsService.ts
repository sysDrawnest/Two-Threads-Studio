/**
 * CMS Service — Phase 9 (CMS Phase 1)
 * API calls for reading and writing CMS configuration.
 */

import { apiClient } from './apiClient';

export interface HeroConfig {
  activeTemplate: 1 | 2 | 3;
}

export const cmsService = {
  /**
   * Public endpoint — fetches the active hero template ID.
   * Called by the storefront. No authentication required.
   */
  getHeroConfig: (): Promise<{ success: boolean; data: HeroConfig }> =>
    apiClient.get('/cms/hero-config'),

  /**
   * Admin endpoint — updates the active hero template ID.
   * Requires ADMIN role.
   */
  updateHeroConfig: (activeTemplate: 1 | 2 | 3): Promise<{ success: boolean; message: string; data: HeroConfig }> =>
    apiClient.patch('/admin/cms/hero-config', { activeTemplate }),
};
