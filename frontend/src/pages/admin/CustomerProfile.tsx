import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Heart, ShieldAlert, FileText, Check } from 'lucide-react';
import { useAdminCustomerDetail, useUpdateCustomerStatus } from '../../hooks/useAdminData';
import { AdminBadge, AdminSkeleton, AdminTable, AdminTableBody, AdminTableCell, AdminTableHead, AdminTableHeader, AdminTableRow } from '../../components/admin/ui';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export const CustomerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, refetch } = useAdminCustomerDetail(id!);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCustomerStatus();

  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isBlockPending, setIsBlockPending] = useState(false);

  if (isLoading) return <AdminSkeleton className="h-[600px] w-full" />;
  if (!response?.data) return <div className="text-[#c5221f]">Customer not found</div>;

  const customer = response.data;
  
  // Calculate LTV
  const totalSpent = customer.orders?.reduce((acc: number, o: any) => acc + (Number(o.grandTotal) || 0), 0) || customer.totalSpent || 0;

  const handleToggleBlock = async () => {
    try {
      setIsBlockPending(true);
      const newStatus = !customer.isBlocked;
      await adminService.blockCustomer(customer.id, { isBlocked: newStatus, reason: blockReason });
      toast.success(newStatus ? 'Customer blocked' : 'Customer unblocked');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update customer block status');
    } finally {
      setIsBlockPending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/customers" className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-secondary-container transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center text-lg font-medium text-primary-container">
              {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl font-bold text-primary-container">
                  {customer.firstName} {customer.lastName}
                </h1>
                <AdminBadge variant={customer.isActive ? 'success' : 'error'}>
                  {customer.isActive ? 'ACTIVE' : 'INACTIVE'}
                </AdminBadge>
                {customer.isBlocked && (
                  <AdminBadge variant="error">BLOCKED</AdminBadge>
                )}
                <AdminBadge variant={customer.role === 'ADMIN' ? 'info' : 'default'}>
                  {customer.role}
                </AdminBadge>
              </div>
              <p className="text-sm text-on-secondary-container mt-1">
                Customer since {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleToggleBlock}
            disabled={isBlockPending}
            className="px-4 py-2 text-sm rounded-md border border-[#c5221f] text-[#c5221f] font-medium hover:bg-[#fce8e6] transition-colors disabled:opacity-50"
          >
            {customer.isBlocked ? 'Unblock Customer' : 'Block Customer'}
          </button>
          <button 
            onClick={() => updateStatus({ id: customer.id, isActive: !customer.isActive })}
            disabled={isUpdating}
            className="px-4 py-2 text-sm rounded-md border border-outline-variant font-medium text-primary-container hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            {customer.isActive ? 'Deactivate Account' : 'Activate Account'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
              <h2 className="font-serif text-lg font-medium text-primary-container">Contact Info</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-on-secondary-container" />
                <a href={`mailto:${customer.email}`} className="text-primary-container hover:underline">{customer.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-on-secondary-container" />
                <span className="text-primary-container">{customer.phone || 'No phone provided'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
              <h2 className="font-serif text-lg font-medium text-primary-container">Addresses</h2>
            </div>
            <div className="p-6">
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-4">
                  {customer.addresses.map((address: any) => (
                    <div key={address.id} className="text-sm pb-4 border-b border-outline-variant last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-on-secondary-container" />
                        <span className="font-medium text-primary-container">{address.type}</span>
                        {address.isDefault && <AdminBadge variant="default" className="text-[10px]">DEFAULT</AdminBadge>}
                      </div>
                      <p className="text-on-secondary-container ml-6">
                        {address.fullName}<br />
                        {address.addressLine1}<br />
                        {address.addressLine2 && <>{address.addressLine2}<br /></>}
                        {address.city}, {address.state} {address.pincode}<br />
                        {address.country}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-secondary-container text-center italic">No saved addresses</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content (Orders, LTV, Wishlist) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-outline-variant bg-surface-container/20 p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-on-secondary-container" />
                <h3 className="text-sm font-medium text-on-secondary-container">Total Orders</h3>
              </div>
              <p className="text-3xl font-serif text-primary-container">{customer._count?.orders || customer.orders?.length || 0}</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-surface-container/20 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-serif text-lg text-on-secondary-container font-medium">₹</span>
                <h3 className="text-sm font-medium text-on-secondary-container">Lifetime Value (LTV)</h3>
              </div>
              <p className="text-3xl font-serif text-primary-container">
                ₹{totalSpent.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Order History */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
              <h2 className="font-serif text-lg font-medium text-primary-container">Order History</h2>
            </div>
            {customer.orders && customer.orders.length > 0 ? (
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Order</AdminTableHead>
                    <AdminTableHead>Date</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">Total</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>
                <AdminTableBody>
                  {customer.orders.map((order: any) => (
                    <AdminTableRow key={order.id}>
                      <AdminTableCell>
                        <Link to={`/admin/orders/${order.id}`} className="font-medium hover:underline text-primary-container">
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                      </AdminTableCell>
                      <AdminTableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminBadge variant={order.orderStatus === 'DELIVERED' ? 'success' : order.orderStatus === 'CANCELLED' ? 'error' : 'default'}>
                          {order.orderStatus}
                        </AdminBadge>
                      </AdminTableCell>
                      <AdminTableCell className="text-right font-medium text-primary-container">
                        ₹{order.grandTotal}
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            ) : (
              <div className="p-8 text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-on-secondary-container opacity-50 mb-3" />
                <p className="text-sm text-on-secondary-container">This customer hasn't placed any orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
