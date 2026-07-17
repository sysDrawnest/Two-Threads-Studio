import React, { useState } from 'react';
import { MessageSquare, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useAdminReviews, useModerateReview } from '../../hooks/useAdminData';
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
  AdminConfirmDialog
} from '../../components/admin/ui';

export const ReviewsManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete'>('approve');

  const { data: response, isLoading } = useAdminReviews({
    page,
    limit: 15,
    search,
    status
  });

  const { mutate: moderateReview, isPending: isModerating } = useModerateReview();

  const handleActionClick = (review: any, type: 'approve' | 'reject' | 'delete') => {
    setSelectedReview(review);
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedReview) return;
    moderateReview(
      { id: selectedReview.id, action: actionType },
      { onSuccess: () => setConfirmOpen(false) }
    );
  };

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Reviews Moderation</h1>
          <p className="text-sm text-on-secondary-container mt-1">Manage customer reviews and storefront visibility</p>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by product, customer, or content..."
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
        ) : !response?.data?.reviews || response.data.reviews.length === 0 ? (
          <AdminEmptyState
            icon={MessageSquare}
            title="No reviews found"
            description={search || status ? "Try adjusting your filters" : "You haven't received any reviews yet."}
          />
        ) : (
          <>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Product / Customer</AdminTableHead>
                  <AdminTableHead>Rating</AdminTableHead>
                  <AdminTableHead>Review</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {response.data.reviews.map((review: any) => (
                  <AdminTableRow key={review.id}>
                    <AdminTableCell>
                      <div>
                        <p className="font-medium text-primary-container line-clamp-1">{review.product?.name || 'Unknown Product'}</p>
                        <p className="text-xs text-on-secondary-container mt-1">By: {review.user?.firstName} {review.user?.lastName}</p>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="flex items-center gap-1 text-[#b06000]">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="max-w-xs">
                      <p className="text-sm text-primary-container line-clamp-2">{review.title}</p>
                      <p className="text-xs text-on-secondary-container mt-1 line-clamp-2">{review.comment}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminBadge variant={
                        review.status === 'APPROVED' ? 'success' :
                        review.status === 'REJECTED' ? 'error' : 'warning'
                      }>
                        {review.status}
                      </AdminBadge>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleActionClick(review, 'approve')}
                            className="p-2 text-[#137333] hover:bg-[#e6f4ea] rounded transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {review.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleActionClick(review, 'reject')}
                            className="p-2 text-[#b06000] hover:bg-[#fef7e0] rounded transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleActionClick(review, 'delete')}
                          className="p-2 text-[#c5221f] hover:bg-[#fce8e6] rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
            <AdminPagination
              currentPage={response.data.pagination.page}
              totalPages={response.data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AdminConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={actionType === 'approve' ? 'Approve Review' : actionType === 'reject' ? 'Reject Review' : 'Delete Review'}
        description={
          actionType === 'approve' ? 'This will make the review visible on the storefront.' :
          actionType === 'reject' ? 'This will hide the review from the storefront.' :
          'Are you sure you want to permanently delete this review? This action cannot be undone.'
        }
        onConfirm={handleConfirmAction}
        confirmText={actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Delete'}
        isDestructive={actionType === 'delete' || actionType === 'reject'}
        isLoading={isModerating}
      />
    </div>
  );
};
