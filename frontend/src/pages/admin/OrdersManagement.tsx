import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Package } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useAdminData';
import { 
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminBadge,
  AdminPagination,
  AdminSearchBar,
  AdminFilterBar,
  AdminSkeleton,
  AdminEmptyState
} from '../../components/admin/ui';

export const OrdersManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data: response, isLoading } = useAdminOrders({
    page,
    limit: 15,
    search,
    status
  });

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'success';
      case 'CANCELLED': 
      case 'RETURNED': return 'error';
      case 'SHIPPED': return 'info';
      case 'PENDING':
      case 'PROCESSING': return 'warning';
      default: return 'default';
    }
  };

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Handcrafting', value: 'HANDCRAFTING' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Orders</h1>
          <p className="text-sm text-on-secondary-container mt-1">Manage and fulfill customer orders</p>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by order ID, email or name..."
            className="w-full sm:w-80"
          />
          <AdminFilterBar
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
          />
        </div>

        {isLoading ? (
          <div className="p-4"><AdminSkeleton className="h-96 w-full" /></div>
        ) : (() => {
          const ordersList = response?.orders || response?.data?.orders || [];
          const paginationData = response?.pagination || response?.data?.pagination;

          if (ordersList.length === 0) {
            return (
              <AdminEmptyState
                icon={Package}
                title="No orders found"
                description={search || status ? "Try adjusting your filters" : "You haven't received any orders yet."}
              />
            );
          }

          return (
            <>
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Order ID</AdminTableHead>
                    <AdminTableHead>Date</AdminTableHead>
                    <AdminTableHead>Customer</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead>Payment</AdminTableHead>
                    <AdminTableHead className="text-right">Total</AdminTableHead>
                    <AdminTableHead className="text-right">Actions</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>
                <AdminTableBody>
                  {ordersList.map((order: any) => (
                    <AdminTableRow key={order.id}>
                      <AdminTableCell className="font-medium font-mono">
                        #{order.orderNumber || order.id.slice(-8).toUpperCase()}
                      </AdminTableCell>
                      <AdminTableCell>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </AdminTableCell>
                      <AdminTableCell>
                        <div>
                          <p className="font-medium text-primary-container">
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-xs text-on-secondary-container">{order.user?.email}</p>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminBadge variant={getStatusVariant(order.orderStatus)}>
                          {order.orderStatus}
                        </AdminBadge>
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium bg-surface-container px-1.5 py-0.5 rounded">
                            {order.paymentMethod}
                          </span>
                          {order.paymentStatus === 'CAPTURED' && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#137333]"></span>
                          )}
                          {order.paymentStatus === 'PENDING' && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#b06000]"></span>
                          )}
                          {order.paymentStatus === 'FAILED' && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#c5221f]"></span>
                          )}
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="text-right font-medium font-mono">
                        ₹{order.grandTotal}
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <Link 
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center justify-center p-2 text-on-secondary-container hover:bg-surface-container rounded-md transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
              {paginationData && (
                <AdminPagination
                  currentPage={paginationData.page}
                  totalPages={paginationData.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          );
        })()}

      </div>
    </div>
  );
};
