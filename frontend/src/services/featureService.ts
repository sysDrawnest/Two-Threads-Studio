/**
 * Feature Service
 * API client methods for fetching public feature flags and updating feature flags as Admin.
 */

import { apiClient } from './apiClient';
import { FeatureFlags, DEFAULT_FEATURES } from '../config/features';

export const featureService = {
  /**
   * Public: Fetch active feature flags from database
   */
  getPublicFeatures: async (): Promise<FeatureFlags> => {
    try {
      const response = await apiClient.get('/features');
      if (response && response.data) {
        return response.data;
      }
      return DEFAULT_FEATURES;
    } catch {
      // Safe Fallback: Return DEFAULT_FEATURES (LEARNING_HUB: false) on network/server error
      return DEFAULT_FEATURES;
    }
  },

  /**
   * Admin: Update specific feature flag status in database
   */
  updateFeatureFlag: async (
    key: keyof FeatureFlags,
    enabled: boolean
  ): Promise<{ message: string; data: FeatureFlags }> => {
    const response = await apiClient.put(
      `/admin/features/${key}`,
      { enabled }
    );
    return {
      message: response?.message || `Feature flag updated`,
      data: response?.data || DEFAULT_FEATURES,
    };
  },
};
