import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Plus, Trash2, Copy, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import {
  useAdminCoupons,
  useCloneCoupon,
  useDeleteCoupon,
  useToggleCouponActive,
  useCouponAnalytics,
} from '../../hooks/useAdminPromotions';
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
  AdminEmptyState,
  AdminConfirmDialog,
} from '../../components/admin/ui';

export const CouponsManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [promoType, setPromoType] = useState('');

  // Delete target modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: response, isLoading } = useAdminCoupons({
    page,
    limit: 15,
    search,
    isActive: status === 'ACTIVE' ? 'true' : status === 'INACTIVE' ? 'false' : undefined,
    type: promoType || undefined,
  });

  const { data: analytics, isLoading: isLoadingAnalytics } = useCouponAnalytics();

  const { mutate: deleteCoupon } = useDeleteCoupon();
  const { mutate: cloneCoupon } = useCloneCoupon();
  const { mutate: toggleActive } = useToggleCouponActive();

  const handleToggleStatus = (id: string) => {
    toggleActive(id);
  };

  const handleClone = (id: string) => {
    cloneCoupon(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteCoupon(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  };

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active Only', value: 'ACTIVE' },
    { label: 'Inactive Only', value: 'INACTIVE' },
  ];

  const typeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Percentage', value: 'PERCENTAGE' },
    { label: 'Fixed Amount', value: 'FIXED' },
    { label: 'Free Shipping', value: 'FREE_SHIPPING' },
    { label: 'First Order', value: 'FIRST_ORDER' },
    { label: 'VIP Member', value: 'VIP' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1c1c1b]">Promotions & Coupons</h1>
          <p className="text-sm text-zinc-500 mt-1">Design discount rules, manage active campaigns, and track redemption analytics</p>
        </div>
        <Link
          to="/admin/coupons/new"
          className="inline-flex items-center gap-2 bg-zinc-950 text-white text-[11px] uppercase tracking-widest font-mono font-semibold px-4 py-2.5 hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Coupon
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-200 bg-white p-4 space-y-2">
          <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Active Campaigns</p>
          <p className="text-2xl font-serif font-bold text-zinc-950">
            {isLoadingAnalytics ? '...' : analytics?.activeCoupons || 0}
          </p>
        </div>
        <div className="border border-zinc-200 bg-white p-4 space-y-2">
          <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Total Redemptions</p>
          <p className="text-2xl font-serif font-bold text-zinc-950">
            {isLoadingAnalytics ? '...' : analytics?.totalRedemptions || 0}
          </p>
        </div>
        <div className="border border-zinc-200 bg-white p-4 space-y-2">
          <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Influenced Revenue</p>
          <p className="text-2xl font-serif font-bold text-emerald-700">
            {isLoadingAnalytics ? '...' : `₹${analytics?.influencedRevenue || 0}`}
          </p>
        </div>
        <div className="border border-zinc-200 bg-white p-4 space-y-2">
          <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Discounts Applied</p>
          <p className="text-2xl font-serif font-bold text-[#A34A38]">
            {isLoadingAnalytics ? '...' : `₹${analytics?.totalDiscountValue || 0}`}
          </p>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="border border-zinc-200 bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b border-zinc-200 bg-zinc-50/50">
          <AdminSearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by code or title..."
            className="w-full md:w-80"
          />
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <AdminFilterBar
              label="Status"
              options={statusOptions}
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            />
            <AdminFilterBar
              label="Type"
              options={typeOptions}
              value={promoType}
              onChange={(v) => {
                setPromoType(v);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Coupons List / Table */}
        {isLoading ? (
          <div className="p-4">
            <AdminSkeleton className="h-96 w-full" />
          </div>
        ) : !response?.data?.coupons || response.data.coupons.length === 0 ? (
          <AdminEmptyState
            icon={Tag}
            title="No coupons found"
            description={search || status || promoType ? 'Try adjusting your filters' : 'You do not have any coupons yet.'}
          />
        ) : (
          <>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Code & Campaign</AdminTableHead>
                  <AdminTableHead>Type</AdminTableHead>
                  <AdminTableHead>Value / Discount</AdminTableHead>
                  <AdminTableHead>Threshold</AdminTableHead>
                  <AdminTableHead>Usage Count</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {response.data.coupons.map((coupon: any) => (
                  <AdminTableRow key={coupon.id}>
                    <AdminTableCell>
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-bold text-zinc-950 bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                          {coupon.code}
                        </span>
                        <p className="text-xs font-medium font-serif mt-1.5 text-zinc-900">{coupon.title}</p>
                        {coupon.description && <p className="text-[10px] text-zinc-500 line-clamp-1">{coupon.description}</p>}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="text-[10px] font-mono uppercase text-zinc-600 bg-zinc-100/70 px-1.5 py-0.5 border border-zinc-200">
                        {coupon.type}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell className="font-mono text-xs font-semibold text-zinc-900">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </AdminTableCell>
                    <AdminTableCell className="font-mono text-xs text-zinc-600">
                      {Number(coupon.minCartSubtotal) > 0 ? `₹${coupon.minCartSubtotal}+` : 'None'}
                    </AdminTableCell>
                    <AdminTableCell className="font-mono text-xs text-zinc-600">
                      {coupon.usedCount} / {coupon.usageLimit || '∞'}
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminBadge variant={coupon.isActive ? 'success' : 'default'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </AdminBadge>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className="text-zinc-500 hover:text-zinc-950 transition-colors p-1"
                          title="Toggle Active/Inactive"
                        >
                          {coupon.isActive ? (
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-zinc-400" />
                          )}
                        </button>
                        {/* Clone */}
                        <button
                          onClick={() => handleClone(coupon.id)}
                          className="text-zinc-500 hover:text-zinc-950 transition-colors p-1"
                          title="Clone/Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {/* Edit */}
                        <Link
                          to={`/admin/coupons/edit/${coupon.id}`}
                          className="text-[11px] font-mono uppercase tracking-widest text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-950 px-2.5 py-1 bg-white hover:bg-zinc-50 transition-all font-semibold"
                        >
                          Edit
                        </Link>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTargetId(coupon.id)}
                          className="text-[#A34A38] hover:text-red-700 transition-colors p-1"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>

            {/* Pagination */}
            {response?.pagination && response.pagination.totalPages > 1 && (
              <div className="p-4 border-t border-zinc-200">
                <AdminPagination
                  currentPage={page}
                  totalPages={response.pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Coupon"
        description="Are you sure you want to permanently delete this coupon campaign? This action is destructive and cannot be undone."
      />
    </div>
  );
};
