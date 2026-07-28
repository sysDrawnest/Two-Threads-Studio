import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Heart, ShieldAlert, FileText, Check, Award, ShieldCheck, Ban, Sparkles } from 'lucide-react';
import { useAdminCustomerDetail, useUpdateCustomerStatus } from '../../hooks/useAdminData';
import { AdminBadge, AdminSkeleton, AdminTable, AdminTableBody, AdminTableCell, AdminTableHead, AdminTableHeader, AdminTableRow } from '../../components/admin/ui';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export const CustomerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, refetch } = useAdminCustomerDetail(id!);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCustomerStatus();

  const [blockReason, setBlockReason] = useState('');
  const [isBlockPending, setIsBlockPending] = useState(false);

  if (isLoading) return <AdminSkeleton className="h-[600px] w-full" />;
  if (!response?.data) return <div className="text-[#c5221f] p-8 text-center">Customer not found</div>;

  // Resolve customer and spend variables safely
  const customer = response.data.customer || response.data;
  const totalSpent = response.data.totalSpend || 0;
  const stats = response.data.stats || {
    totalOrders: customer.orders?.length || 0,
    delivered: customer.orders?.filter((o: any) => o.orderStatus === 'DELIVERED').length || 0,
    cancelled: customer.orders?.filter((o: any) => o.orderStatus === 'CANCELLED').length || 0,
    refunded: customer.orders?.filter((o: any) => o.orderStatus === 'REFUNDED').length || 0,
    wishlistCount: customer._count?.wishlist || 0,
    reviewsCount: customer._count?.reviews || 0,
    couponsUsed: customer.orders?.filter((o: any) => o.couponCode).length || 0,
    averageOrderValue: customer.orders?.length ? Math.round(totalSpent / customer.orders.length) : 0,
    tier: totalSpent >= 50000 ? 'VIP' : totalSpent >= 20000 ? 'Gold' : totalSpent >= 10000 ? 'Silver' : 'Bronze',
  };
  const reviewTimeline = response.data.reviewTimeline || [];

  const isBlocked = customer.customerRisk?.isBlocked || false;

  const handleToggleBlock = async () => {
    try {
      setIsBlockPending(true);
      const newStatus = !isBlocked;
      await adminService.blockCustomer(customer.id, { isBlocked: newStatus, reason: blockReason || 'Manual Admin block' });
      toast.success(newStatus ? 'Customer blocked successfully' : 'Customer unblocked successfully');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update customer block status');
    } finally {
      setIsBlockPending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/customers" className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-secondary-container transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-surface-container flex items-center justify-center text-xl font-medium text-primary-container border border-outline-variant">
              {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-primary-container">
                  {customer.firstName} {customer.lastName}
                </h1>
                <AdminBadge variant={customer.isActive ? 'success' : 'error'}>
                  {customer.isActive ? 'ACTIVE' : 'INACTIVE'}
                </AdminBadge>
                {isBlocked && (
                  <AdminBadge variant="error">BLOCKED</AdminBadge>
                )}
                <AdminBadge variant={customer.role === 'ADMIN' ? 'info' : 'default'}>
                  {customer.role}
                </AdminBadge>
                <AdminBadge variant="default" className="bg-[#fff8e1] text-[#f57f17] border border-[#ffe082]">
                  <Award className="h-3 w-3 inline mr-1" />
                  {stats.tier.toUpperCase()} TIER
                </AdminBadge>
              </div>
              <p className="text-sm text-on-secondary-container mt-1">
                Customer since {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleToggleBlock}
            disabled={isBlockPending}
            className={`px-4 py-2 text-sm rounded-md border font-medium transition-colors disabled:opacity-50 ${
              isBlocked 
                ? 'border-[#0f9d58] text-[#0f9d58] hover:bg-[#e8f5e9]'
                : 'border-[#c5221f] text-[#c5221f] hover:bg-[#fce8e6]'
            }`}
          >
            {isBlocked ? 'Unblock Customer' : 'Block Customer'}
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
        {/* Sidebar Info & Risk Cards */}
        <div className="space-y-6">
          {/* Customer Metadata Card */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden shadow-sm">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
              <h2 className="font-serif text-lg font-medium text-primary-container">Customer Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Customer ID</span>
                <span className="text-sm text-primary-container font-mono">{customer.id}</span>
              </div>
              <div className="flex items-center gap-3 text-sm border-t border-outline-variant pt-3">
                <Mail className="h-4 w-4 text-on-secondary-container" />
                <div>
                  <a href={`mailto:${customer.email}`} className="text-primary-container hover:underline">{customer.email}</a>
                  <span className="block text-xs text-on-secondary-container">{customer.isVerified ? '✓ Email Verified' : '⚠ Unverified'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm border-t border-outline-variant pt-3">
                <Phone className="h-4 w-4 text-on-secondary-container" />
                <div>
                  <span className="text-primary-container">{customer.phone || 'No phone provided'}</span>
                  {customer.phone && (
                    <span className="block text-xs text-on-secondary-container">{customer.phoneVerified ? '✓ Phone Verified' : '⚠ Unverified'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm border-t border-outline-variant pt-3">
                <Check className="h-4 w-4 text-on-secondary-container" />
                <div>
                  <span className="text-xs text-on-secondary-container block">LAST LOGIN</span>
                  <span className="text-sm text-primary-container">
                    {customer.lastLogin ? new Date(customer.lastLogin).toLocaleString('en-IN') : 'Never logged in'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Card */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden shadow-sm">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-primary-container">Risk Profile</h2>
              <ShieldAlert className={`h-5 w-5 ${isBlocked ? 'text-[#c5221f]' : 'text-[#0f9d58]'}`} />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-secondary-container">Trust Score</span>
                <span className="text-lg font-bold text-primary-container">
                  {customer.customerRisk?.trustScore || 100}/100
                </span>
              </div>
              <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    (customer.customerRisk?.trustScore || 100) >= 80 
                      ? 'bg-[#0f9d58]' 
                      : (customer.customerRisk?.trustScore || 100) >= 55 
                        ? 'bg-[#f57f17]' 
                        : 'bg-[#c5221f]'
                  }`}
                  style={{ width: `${customer.customerRisk?.trustScore || 100}%` }}
                />
              </div>

              <div className="border-t border-outline-variant pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-secondary-container">Risk Decision</span>
                  <span className="font-medium text-primary-container">{customer.customerRisk?.riskDecision || 'LOW_RISK'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-secondary-container">COD Eligibility</span>
                  <span className={`font-medium ${customer.customerRisk?.forcePrepaidOnly ? 'text-[#c5221f]' : 'text-[#0f9d58]'}`}>
                    {customer.customerRisk?.forcePrepaidOnly ? 'PREPAID ONLY' : 'COD ALLOWED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-secondary-container">Fraud Flags</span>
                  <span className="font-medium text-primary-container">{customer.customerRisk?.chargebackCount || 0}</span>
                </div>
                {customer.customerRisk?.blockReason && (
                  <div className="mt-2 bg-[#fce8e6] p-3 rounded-lg border border-[#f5c2c1] text-xs text-[#c5221f]">
                    <strong>Block Reason:</strong> {customer.customerRisk.blockReason}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Addresses Card */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden shadow-sm">
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
                        {(address.isDefaultBilling || address.isDefaultShipping) && (
                          <AdminBadge variant="default" className="text-[10px]">DEFAULT</AdminBadge>
                        )}
                      </div>
                      <p className="text-on-secondary-container ml-6">
                        {address.fullName}<br />
                        {address.line1}<br />
                        {address.line2 && <>{address.line2}<br /></>}
                        {address.city}, {address.state} {address.postalCode}<br />
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

        {/* Main Content (Statistics, Order History, Reviews) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Grid */}
          <div className="rounded-xl border border-outline-variant bg-background p-6 shadow-sm">
            <h2 className="font-serif text-lg font-medium text-primary-container mb-4">Commerce Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">LTV Spend</span>
                <span className="text-2xl font-serif font-bold text-primary-container">₹{totalSpent.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Avg Order (AOV)</span>
                <span className="text-2xl font-serif font-bold text-primary-container">₹{stats.averageOrderValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Total Orders</span>
                <span className="text-2xl font-serif font-bold text-primary-container">{stats.totalOrders}</span>
              </div>
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Delivered</span>
                <span className="text-2xl font-serif font-bold text-[#0f9d58]">{stats.delivered}</span>
              </div>
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Cancelled</span>
                <span className="text-2xl font-serif font-bold text-[#c5221f]">{stats.cancelled}</span>
              </div>
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Refunded</span>
                <span className="text-2xl font-serif font-bold text-[#f57f17]">{stats.refunded}</span>
              </div>
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Wishlist Items</span>
                <span className="text-2xl font-serif font-bold text-primary-container">{stats.wishlistCount}</span>
              </div>
              <div className="bg-surface-container/20 p-4 rounded-lg">
                <span className="text-xs text-on-secondary-container block uppercase font-medium">Reviews Written</span>
                <span className="text-2xl font-serif font-bold text-primary-container">{stats.reviewsCount}</span>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden shadow-sm">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
              <h2 className="font-serif text-lg font-medium text-primary-container">Order History</h2>
            </div>
            {customer.orders && customer.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow>
                      <AdminTableHead>Order</AdminTableHead>
                      <AdminTableHead>Date</AdminTableHead>
                      <AdminTableHead>Status</AdminTableHead>
                      <AdminTableHead>Payment</AdminTableHead>
                      <AdminTableHead className="text-right">Total</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {customer.orders.map((order: any) => (
                      <AdminTableRow key={order.id}>
                        <AdminTableCell>
                          <Link to={`/admin/orders/${order.id}`} className="font-mono font-medium hover:underline text-primary-container">
                            #{order.id.slice(-8).toUpperCase()}
                          </Link>
                        </AdminTableCell>
                        <AdminTableCell>
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant={
                            order.orderStatus === 'DELIVERED' 
                              ? 'success' 
                              : order.orderStatus === 'CANCELLED' 
                                ? 'error' 
                                : 'default'
                          }>
                            {order.orderStatus}
                          </AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant={
                            order.payment?.status === 'CAPTURED' 
                              ? 'success' 
                              : order.payment?.status === 'REFUNDED' 
                                ? 'info' 
                                : 'default'
                          }>
                            {order.payment?.status || 'PENDING'}
                          </AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell className="text-right font-medium text-primary-container">
                          ₹{Number(order.grandTotal).toLocaleString('en-IN')}
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                </AdminTable>
              </div>
            ) : (
              <div className="p-8 text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-on-secondary-container opacity-50 mb-3" />
                <p className="text-sm text-on-secondary-container">This customer hasn't placed any orders yet.</p>
              </div>
            )}
          </div>

          {/* Customer Reviews Timeline */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden shadow-sm">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30">
              <h2 className="font-serif text-lg font-medium text-primary-container">Review Timeline</h2>
            </div>
            {reviewTimeline && reviewTimeline.length > 0 ? (
              <div className="p-6 space-y-6">
                {reviewTimeline.map((review: any) => (
                  <div key={review.id} className="border-b border-outline-variant last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-serif font-bold text-primary-container text-sm sm:text-base">
                          {review.product?.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-[#f57f17]' : 'text-outline-variant'}`}>★</span>
                            ))}
                          </div>
                          <span className="text-xs text-on-secondary-container">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <AdminBadge variant={
                            review.status === 'APPROVED' 
                              ? 'success' 
                              : review.status === 'REJECTED' 
                                ? 'error' 
                                : 'default'
                          }>
                            {review.status}
                          </AdminBadge>
                        </div>
                      </div>
                      {review.isVerified && (
                        <AdminBadge variant="default" className="text-xs">VERIFIED PURCHASE</AdminBadge>
                      )}
                    </div>
                    {review.title && <p className="font-semibold text-sm text-primary-container mt-2">"{review.title}"</p>}
                    <p className="text-sm text-on-secondary-container mt-1">{review.comment}</p>
                    {review.media && review.media.length > 0 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                        {review.media.map((med: any) => (
                          <div key={med.id} className="relative h-14 w-14 rounded-lg overflow-hidden border border-outline-variant flex-shrink-0">
                            {med.type === 'IMAGE' ? (
                              <img src={med.url} alt="Review attachment" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-black/10 flex items-center justify-center text-[10px] text-primary-container font-medium">VIDEO</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-on-secondary-container opacity-50 mb-3" />
                <p className="text-sm text-on-secondary-container">No reviews written by this customer yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
