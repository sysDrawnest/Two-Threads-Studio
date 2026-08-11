import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMaintenance } from '../../context/MaintenanceContext';
import { useAuth } from '../../context/AuthContext';
import { MaintenancePage } from '../../pages/MaintenancePage';
import { AdminMaintenanceBanner } from './AdminMaintenanceBanner';

interface MaintenanceGateProps {
  children: React.ReactNode;
}

/**
 * MaintenanceGate Component
 * Centralized storefront gate enforcing server-side Maintenance Mode.
 *
 * Rules:
 *  - /admin/* and /auth/* routes are always accessible.
 *  - If Maintenance Mode is ON:
 *      - Logged-in ADMINs see AdminMaintenanceBanner + live storefront preview.
 *      - Guests and Customers see MaintenancePage immediately before heavy storefront resources load.
 *  - If Maintenance Mode is OFF:
 *      - Normal storefront renders cleanly.
 */
export const MaintenanceGate: React.FC<MaintenanceGateProps> = ({ children }) => {
  const { maintenanceMode } = useMaintenance();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isAuthRoute = location.pathname.startsWith('/auth');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // 1. Admin dashboard & authentication routes are always accessible
  if (isAdminRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // 2. If Maintenance Mode is active
  if (maintenanceMode) {
    // Authenticated ADMINs bypass the gate to inspect live storefront
    if (isAdmin) {
      return (
        <>
          <AdminMaintenanceBanner />
          {children}
        </>
      );
    }

    // Customers & Guests get the clean, lightweight Maintenance Page
    return <MaintenancePage />;
  }

  // 3. Normal Storefront (Maintenance Mode OFF)
  return <>{children}</>;
};

export default MaintenanceGate;
