/**
 * Maintenance Service
 * API client methods for fetching public maintenance status and updating maintenance mode as Admin.
 */

import { apiClient } from './apiClient';

export interface MaintenanceStatusResponse {
  maintenanceMode: boolean;
}

export const maintenanceService = {
  /**
   * Public: Fetch active maintenance status from database.
   * Fail-open: returns { maintenanceMode: false } on error.
   */
  getMaintenanceStatus: async (): Promise<MaintenanceStatusResponse> => {
    try {
      const response = await apiClient.get('/maintenance/status');
      if (response && typeof response.maintenanceMode === 'boolean') {
        return { maintenanceMode: response.maintenanceMode };
      }
      if (response && response.data && typeof response.data.maintenanceMode === 'boolean') {
        return { maintenanceMode: response.data.maintenanceMode };
      }
      return { maintenanceMode: false };
    } catch {
      // Safe Fail-Open Fallback: Return maintenanceMode: false on error
      return { maintenanceMode: false };
    }
  },

  /**
   * Admin: Toggle website Maintenance Mode status in database
   */
  updateMaintenanceMode: async (
    maintenanceMode: boolean
  ): Promise<{ success: boolean; maintenanceMode: boolean; message: string }> => {
    const response = await apiClient.put(
      '/admin/settings/maintenance',
      { maintenanceMode }
    );
    return {
      success: response?.success ?? true,
      maintenanceMode: response?.maintenanceMode ?? maintenanceMode,
      message: response?.message || `Maintenance Mode updated`,
    };
  },
};
