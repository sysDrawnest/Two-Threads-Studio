import React from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Users, AlertCircle, TrendingUp, Package } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminData';
import { 
  AdminStatCard, 
  AdminSkeleton, 
  AdminBadge, 
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow
} from '../../components/admin/ui';

export const AdminDashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <AdminSkeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminSkeleton className="h-96 w-full" />
          <AdminSkeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="rounded-lg border border-outline-variant bg-[#fce8e6] p-6 text-[#c5221f]">
        <h3 className="font-semibold mb-2">Error loading dashboard</h3>
        <p>There was a problem fetching the dashboard data. Please try again.</p>
      </div>
    );
  }

  const { data } = dashboardData;
  const { revenue, orders, customers, inventory, riskAlerts, recentOrders } = data;

  return (
    <div className="space-y-6">
      {/* Risk Alerts Banner */}
      {(riskAlerts.manualReview > 0 || riskAlerts.fraudFlags > 0) && (
        <div className="flex items-center gap-3 rounded-lg border border-[#fce8e6] bg-[#fce8e6]/50 px-4 py-3 text-[#c5221f]">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Attention needed: {riskAlerts.manualReview} orders pending review, {riskAlerts.fraudFlags} active fraud flags.
          </p>
          <Link to="/admin/risk" className="ml-auto text-sm font-bold underline">
            Go to Risk Center
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Today's Revenue"
          value={`₹${revenue.today.toLocaleString()}`}
          icon={IndianRupee}
          description={`₹${revenue.thisWeek.toLocaleString()} this week`}
          trend={{ value: 12, isPositive: true }}
        />
        <AdminStatCard
          title="Orders Today"
          value={orders.today.toString()}
          icon={ShoppingBag}
          description={`${orders.pending} pending processing`}
        />
        <AdminStatCard
          title="New Customers"
          value={customers.newToday.toString()}
          icon={Users}
          description={`${customers.newThisWeek} new this week`}
          trend={{ value: 5, isPositive: true }}
        />
        <AdminStatCard
          title="Avg. Order Value"
          value={`₹${(orders.today > 0 ? revenue.today / orders.today : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          description="Based on today's orders"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container/30">
            <h2 className="font-serif text-lg font-medium text-primary-container">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-on-secondary-container hover:text-primary-container">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-on-secondary-container text-sm">No recent orders</div>
          ) : (
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Order</AdminTableHead>
                  <AdminTableHead>Customer</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Total</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {recentOrders.slice(0, 5).map((order: any) => (
                  <AdminTableRow key={order.id}>
                    <AdminTableCell>
                      <Link to={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                        #{order.id.slice(-6).toUpperCase()}
                      </Link>
                    </AdminTableCell>
                    <AdminTableCell>
                      {order.user.firstName} {order.user.lastName}
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminBadge variant={
                        order.orderStatus === 'DELIVERED' ? 'success' :
                        order.orderStatus === 'CANCELLED' ? 'error' : 'default'
                      }>
                        {order.orderStatus}
                      </AdminBadge>
                    </AdminTableCell>
                    <AdminTableCell className="text-right font-medium">
                      ₹{order.grandTotal}
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          )}
        </div>

        {/* Inventory Alerts */}
        <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container/30">
            <h2 className="font-serif text-lg font-medium text-primary-container">Inventory Alerts</h2>
            <Link to="/admin/inventory" className="text-sm font-medium text-on-secondary-container hover:text-primary-container">
              Manage Stock
            </Link>
          </div>
          
          {inventory.outOfStock.length === 0 && inventory.lowStock.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <Package className="h-8 w-8 text-on-secondary-container opacity-50 mb-2" />
              <p className="text-sm text-on-secondary-container">Inventory is healthy</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {inventory.outOfStock.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-primary-container line-clamp-1">{p.name}</p>
                    <p className="text-xs text-on-secondary-container mt-0.5">SKU: {p.sku}</p>
                  </div>
                  <AdminBadge variant="error">OUT OF STOCK</AdminBadge>
                </div>
              ))}
              {inventory.lowStock.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-primary-container line-clamp-1">{p.name}</p>
                    <p className="text-xs text-on-secondary-container mt-0.5">SKU: {p.sku}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#b06000]">{p.stockQuantity} left</span>
                    <AdminBadge variant="warning">LOW STOCK</AdminBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
