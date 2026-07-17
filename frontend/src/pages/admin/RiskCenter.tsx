import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { 
  AdminStatCard,
  AdminSkeleton,
  AdminEmptyState
} from '../../components/admin/ui';

export const RiskCenter: React.FC = () => {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin', 'risk-dashboard'],
    queryFn: () => adminService.getRiskDashboard(),
  });

  if (isLoading) {
    return <div className="space-y-6"><AdminSkeleton className="h-[400px] w-full" /></div>;
  }

  const riskData = dashboard?.data || { pendingReviews: 0, highRiskOrders: 0, activeFraudFlags: 0, blockedUsers: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#c5221f] flex items-center gap-2">
            <ShieldAlert className="h-6 w-6" />
            Risk Center
          </h1>
          <p className="text-sm text-on-secondary-container mt-1">Monitor fraud flags, high-risk orders, and security alerts</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Pending Reviews"
          value={riskData.pendingReviews}
          icon={AlertTriangle}
          className={riskData.pendingReviews > 0 ? "bg-[#fce8e6] border-[#c5221f]/30" : ""}
        />
        <AdminStatCard
          title="High Risk Orders"
          value={riskData.highRiskOrders}
          icon={ShieldAlert}
          className={riskData.highRiskOrders > 0 ? "bg-[#fce8e6] border-[#c5221f]/30" : ""}
        />
        <AdminStatCard
          title="Active Fraud Flags"
          value={riskData.activeFraudFlags}
          icon={ShieldAlert}
          className={riskData.activeFraudFlags > 0 ? "bg-[#fef7e0] border-[#b06000]/30" : ""}
        />
        <AdminStatCard
          title="Blocked Users"
          value={riskData.blockedUsers}
          icon={ShieldCheck}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
          <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
            <h2 className="font-serif text-lg font-medium text-primary-container">Manual Review Queue</h2>
          </div>
          {riskData.pendingReviews === 0 ? (
            <AdminEmptyState
              icon={ShieldCheck}
              title="All clear"
              description="No orders currently require manual review."
            />
          ) : (
             <div className="p-6 text-center text-sm text-on-secondary-container">
               Orders pending manual review will appear here.
             </div>
          )}
        </div>

        <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
          <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
            <h2 className="font-serif text-lg font-medium text-primary-container">Active Fraud Flags</h2>
          </div>
          {riskData.activeFraudFlags === 0 ? (
            <AdminEmptyState
              icon={ShieldCheck}
              title="All clear"
              description="No active fraud flags detected."
            />
          ) : (
            <div className="p-6 text-center text-sm text-on-secondary-container">
               Active system fraud flags will appear here.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
