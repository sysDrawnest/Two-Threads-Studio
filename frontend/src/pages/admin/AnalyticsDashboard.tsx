import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { 
  AdminChart, 
  AdminFilterBar, 
  AdminSkeleton 
} from '../../components/admin/ui';

export const AnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState('30d');

  const { data: revenueData, isLoading: revLoading } = useQuery({
    queryKey: ['admin-analytics-revenue', period],
    queryFn: () => adminService.getAnalyticsRevenue({ period }),
  });
  
  const { data: ordersData, isLoading: ordLoading } = useQuery({
    queryKey: ['admin-analytics-orders', period],
    queryFn: () => adminService.getAnalyticsOrders({ period }),
  });
  
  const { data: categoryData, isLoading: catLoading } = useQuery({
    queryKey: ['admin-analytics-categories', period],
    queryFn: () => adminService.getAnalyticsCategories({ period }),
  });

  const periodOptions = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Year to Date', value: 'ytd' },
  ];

  if (revLoading || ordLoading || catLoading) {
    return (
      <div className="space-y-6">
        <AdminSkeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <AdminSkeleton className="h-[400px] w-full" />
          <AdminSkeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Analytics</h1>
          <p className="text-sm text-on-secondary-container mt-1">Insights into store performance and customer behaviour</p>
        </div>
        <AdminFilterBar
          label="Period"
          options={periodOptions}
          value={period}
          onChange={setPeriod}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-outline-variant bg-background p-6">
          <h2 className="font-serif text-lg font-medium text-primary-container mb-6">Revenue Over Time</h2>
          <AdminChart
            type="area"
            data={revenueData?.data?.timeline || []}
            xAxisKey="date"
            series={[{ key: 'revenue', name: 'Revenue', color: '#785d4b' }]}
            valueFormatter={(val) => `₹${val.toLocaleString()}`}
            height={320}
          />
        </div>

        {/* Orders Chart */}
        <div className="rounded-xl border border-outline-variant bg-background p-6">
          <h2 className="font-serif text-lg font-medium text-primary-container mb-6">Orders Volume</h2>
          <AdminChart
            type="bar"
            data={ordersData?.data?.timeline || []}
            xAxisKey="date"
            series={[{ key: 'orders', name: 'Orders', color: '#2d2520' }]}
            height={320}
          />
        </div>

        {/* Category Performance */}
        <div className="rounded-xl border border-outline-variant bg-background p-6 lg:col-span-2">
          <h2 className="font-serif text-lg font-medium text-primary-container mb-6">Revenue by Category</h2>
          <AdminChart
            type="bar"
            data={categoryData?.data?.categories || []}
            xAxisKey="category"
            series={[{ key: 'revenue', name: 'Revenue', color: '#d1c4bd' }]}
            valueFormatter={(val) => `₹${val.toLocaleString()}`}
            height={320}
          />
        </div>
      </div>
    </div>
  );
};
