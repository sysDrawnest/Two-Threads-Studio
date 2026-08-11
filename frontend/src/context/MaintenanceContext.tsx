/**
 * MaintenanceContext & Provider
 * Manages global website maintenance mode state using React Query.
 * Source of truth is PostgreSQL database via backend API.
 * Fails open (maintenanceMode: false) on network error.
 */

import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '../services/maintenanceService';
import { toast } from 'react-hot-toast';

interface MaintenanceContextType {
  maintenanceMode: boolean;
  isLoading: boolean;
  updateMaintenanceMode: (enabled: boolean) => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType>({
  maintenanceMode: false,
  isLoading: false,
  updateMaintenanceMode: async () => {},
});

export const maintenanceKeys = {
  status: ['maintenance-status'] as const,
};

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Asynchronously query maintenance status from backend with 30-second stale time
  const { data, isLoading } = useQuery({
    queryKey: maintenanceKeys.status,
    queryFn: maintenanceService.getMaintenanceStatus,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
    retry: 1,
  });

  const maintenanceMode = Boolean(data?.maintenanceMode);

  // Admin Mutation for toggling maintenance mode
  const updateMutation = useMutation({
    mutationFn: (enabled: boolean) => maintenanceService.updateMaintenanceMode(enabled),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.status });
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success(res.message || `Website is now ${res.maintenanceMode ? 'in Maintenance Mode' : 'LIVE'}`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update Maintenance Mode');
    },
  });

  const updateMaintenanceMode = async (enabled: boolean) => {
    await updateMutation.mutateAsync(enabled);
  };

  return (
    <MaintenanceContext.Provider
      value={{
        maintenanceMode,
        isLoading,
        updateMaintenanceMode,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);
