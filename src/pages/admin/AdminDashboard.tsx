import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import { dashboardStats, mockAdminOrders, mockAdminProducts, revenueChartData, popularProducts } from '../../data/adminData';

const statusColors: Record<string, string> = {
  pending: 'bg-[#fef3e8] text-[#8b5a00]',
  processing: 'bg-[#e8f0fe] text-[#1a56db]',
  shipped: 'bg-[#e8f4e8] text-[#3a6b3a]',
  delivered: 'bg-[#e8f4e8] text-[#2d5a2d]',
  cancelled: 'bg-error-container text-error',
};

// Mini bar chart using divs (no library needed)
const RevenueChart: React.FC = () => {
  const max = Math.max(...revenueChartData.map(d => d.revenue));
  return (
    <div className="flex items-end gap-3 h-40 w-full">
      {revenueChartData.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <span className="font-sans text-[10px] text-on-surface-variant">${(d.revenue / 1000).toFixed(1)}k</span>
          <div
            className="w-full bg-primary-container/80 hover:bg-primary-container transition-colors rounded-sm"
            style={{ height: `${(d.revenue / max) * 100}%`, minHeight: 4 }}
            title={`${d.month}: $${d.revenue}`}
          />
          <span className="font-sans text-[10px] text-on-surface-variant">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const recentOrders = mockAdminOrders.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-primary-container">Dashboard Overview</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Welcome back. Here's what's happening with your studio.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue" value={dashboardStats.totalRevenue} prefix="$"
          growth={dashboardStats.revenueGrowth}
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard
          label="Total Orders" value={dashboardStats.totalOrders}
          growth={dashboardStats.ordersGrowth}
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
        />
        <StatCard
          label="Total Customers" value={dashboardStats.totalCustomers}
          growth={dashboardStats.customersGrowth}
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard
          label="Active Members" value={dashboardStats.activeMembers}
          growth={dashboardStats.membersGrowth}
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
        />
        <StatCard
          label="Tutorial Enrollments" value={dashboardStats.tutorialEnrollments}
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
        />
        <StatCard
          label="Total Products" value={dashboardStats.totalProducts}
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background border border-outline-variant p-6">
          <h2 className="font-serif text-xl text-primary-container mb-6">Revenue Trend</h2>
          <RevenueChart />
        </div>
        <div className="bg-background border border-outline-variant p-6">
          <h2 className="font-serif text-xl text-primary-container mb-6">Popular Products</h2>
          <div className="flex flex-col gap-4">
            {popularProducts.map((p, i) => {
              const maxSales = popularProducts[0].sales;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-sans text-xs text-on-surface-variant truncate max-w-[60%]">{p.name}</span>
                    <span className="font-sans text-xs font-medium text-primary-container">{p.sales} sales</span>
                  </div>
                  <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-on-secondary-container" style={{ width: `${(p.sales / maxSales) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-background border border-outline-variant p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl text-primary-container">Recent Orders</h2>
            <Link to="/admin/orders" className="font-sans text-xs text-on-secondary-container hover:text-primary-container transition-colors no-underline">View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-outline-variant last:border-0">
                <div>
                  <p className="font-sans text-sm text-primary-container">{order.id}</p>
                  <p className="font-sans text-xs text-on-surface-variant">{order.customer}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block font-sans text-[10px] px-2 py-1 uppercase tracking-wider ${statusColors[order.status]}`}>{order.status}</span>
                  <p className="font-sans text-sm text-primary-container mt-1">${order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-background border border-outline-variant p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl text-primary-container">Low Stock Alert</h2>
            <Link to="/admin/products" className="font-sans text-xs text-on-secondary-container hover:text-primary-container transition-colors no-underline">Manage →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {mockAdminProducts.filter(p => p.inventory < 20).map(product => (
              <div key={product.id} className="flex items-center gap-4 py-3 border-b border-outline-variant last:border-0">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover bg-surface-container flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-primary-container truncate">{product.name}</p>
                  <p className="font-sans text-xs text-on-surface-variant">{product.collection}</p>
                </div>
                <span className={`font-sans text-xs font-medium ${product.inventory === 0 ? 'text-error' : 'text-[#8b5a00]'}`}>
                  {product.inventory === 0 ? 'Out of stock' : `${product.inventory} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
