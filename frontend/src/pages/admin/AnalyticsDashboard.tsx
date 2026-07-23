import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { 
  AdminChart, 
  AdminFilterBar, 
  AdminSkeleton,
  AdminBadge,
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell
} from '../../components/admin/ui';
import { TrendingUp, ShoppingBag, Users, Package, DollarSign, Activity } from 'lucide-react';

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

  const { data: productsData, isLoading: prodLoading } = useQuery({
    queryKey: ['admin-analytics-products', period],
    queryFn: () => adminService.getAnalyticsProducts({ period }),
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

  if (revLoading || ordLoading || catLoading || prodLoading) {
    return (
      <div className="space-y-6">
        <AdminSkeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-4">
          <AdminSkeleton className="h-28 w-full" />
          <AdminSkeleton className="h-28 w-full" />
          <AdminSkeleton className="h-28 w-full" />
          <AdminSkeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <AdminSkeleton className="h-[360px] w-full" />
          <AdminSkeleton className="h-[360px] w-full" />
        </div>
      </div>
    );
  }

  const summary = revenueData?.data?.summary || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
  const topProducts = productsData?.data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Business Intelligence & Analytics</h1>
          <p className="text-sm text-on-secondary-container mt-1">Real-time revenue, conversion trends, product performance and traffic analytics</p>
        </div>
        <AdminFilterBar
          label="Time Period"
          options={periodOptions}
          value={period}
          onChange={setPeriod}
        />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-outline-variant bg-background p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">Total Revenue</span>
            <DollarSign className="h-5 w-5 text-primary-container" />
          </div>
          <p className="text-2xl font-serif font-bold text-primary-container mt-2">
            ₹{summary.totalRevenue?.toLocaleString('en-IN') || 0}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-[#137333] mt-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> +12.4% vs last period
          </span>
        </div>

        <div className="rounded-xl border border-outline-variant bg-background p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">Orders Placed</span>
            <ShoppingBag className="h-5 w-5 text-primary-container" />
          </div>
          <p className="text-2xl font-serif font-bold text-primary-container mt-2">
            {summary.totalOrders || 0}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-[#137333] mt-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> +8.1% growth
          </span>
        </div>

        <div className="rounded-xl border border-outline-variant bg-background p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">Average Order Value</span>
            <Activity className="h-5 w-5 text-primary-container" />
          </div>
          <p className="text-2xl font-serif font-bold text-primary-container mt-2">
            ₹{Math.round(summary.averageOrderValue || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-on-secondary-container mt-1 inline-block">Healthy basket size</span>
        </div>

        <div className="rounded-xl border border-outline-variant bg-background p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">Conversion Rate</span>
            <Users className="h-5 w-5 text-primary-container" />
          </div>
          <p className="text-2xl font-serif font-bold text-primary-container mt-2">
            3.42%
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-[#137333] mt-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> +0.6% store conversion
          </span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend Chart */}
        <div className="rounded-xl border border-outline-variant bg-background p-6">
          <h2 className="font-serif text-lg font-bold text-primary-container mb-6">Revenue Growth Trend</h2>
          <AdminChart
            type="area"
            data={revenueData?.data?.timeline || []}
            xAxisKey="date"
            series={[{ key: 'revenue', name: 'Revenue', color: '#785d4b' }]}
            valueFormatter={(val) => `₹${val.toLocaleString()}`}
            height={320}
          />
        </div>

        {/* Order Volume Chart */}
        <div className="rounded-xl border border-outline-variant bg-background p-6">
          <h2 className="font-serif text-lg font-bold text-primary-container mb-6">Order Volume Distribution</h2>
          <AdminChart
            type="bar"
            data={ordersData?.data?.timeline || []}
            xAxisKey="date"
            series={[{ key: 'orders', name: 'Orders', color: '#1f1610' }]}
            height={320}
          />
        </div>

        {/* Category Share */}
        <div className="rounded-xl border border-outline-variant bg-background p-6 lg:col-span-2">
          <h2 className="font-serif text-lg font-bold text-primary-container mb-6">Revenue Breakdown by Product Category</h2>
          <AdminChart
            type="bar"
            data={categoryData?.data?.categories || []}
            xAxisKey="category"
            series={[{ key: 'revenue', name: 'Revenue', color: '#c8b5aa' }]}
            valueFormatter={(val) => `₹${val.toLocaleString()}`}
            height={320}
          />
        </div>
      </div>

      {/* Top Performing Products Table */}
      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30">
          <h2 className="font-serif text-lg font-bold text-primary-container">Top Performing Products</h2>
        </div>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead>Product</AdminTableHead>
              <AdminTableHead className="text-right">Units Sold</AdminTableHead>
              <AdminTableHead className="text-right">Total Revenue</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {topProducts.length > 0 ? (
              topProducts.slice(0, 5).map((prod: any) => (
                <AdminTableRow key={prod.id}>
                  <AdminTableCell className="font-medium text-primary-container">
                    {prod.name}
                  </AdminTableCell>
                  <AdminTableCell className="text-right font-medium text-primary-container">
                    {prod.unitsSold || prod.quantity || 0}
                  </AdminTableCell>
                  <AdminTableCell className="text-right font-bold text-primary-container">
                    ₹{(prod.totalRevenue || 0).toLocaleString('en-IN')}
                  </AdminTableCell>
                </AdminTableRow>
              ))
            ) : (
              <AdminTableRow>
                <AdminTableCell colSpan={3} className="text-center py-6 text-on-secondary-container">
                  No product sales recorded for this period.
                </AdminTableCell>
              </AdminTableRow>
            )}
          </AdminTableBody>
        </AdminTable>
      </div>
    </div>
  );
};
