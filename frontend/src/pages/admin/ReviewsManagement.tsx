import React, { useState } from 'react';
import { MessageSquare, Star, CheckCircle, XCircle, Trash2, EyeOff, Pin, Award, ExternalLink } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('newest');
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete' | 'hide' | 'feature' | 'pin'>('approve');

  const { data: response, isLoading } = useAdminReviews({
    page,
    limit: 15,
    search,
    status,
    sortBy
  });

  const { mutate: moderateReview, isPending: isModerating } = useModerateReview();

  const handleActionClick = (review: any, type: 'approve' | 'reject' | 'delete' | 'hide' | 'feature' | 'pin') => {
    setSelectedReview(review);
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedReview) return;
    
    let action: 'approve' | 'reject' | 'delete' | 'moderate' = 'moderate';
    let data: any = {};

    if (actionType === 'approve') {
      action = 'approve';
    } else if (actionType === 'reject') {
      action = 'reject';
    } else if (actionType === 'delete') {
      action = 'delete';
    } else if (actionType === 'hide') {
      data = { status: 'HIDDEN' };
    } else if (actionType === 'feature') {
      data = { isFeatured: !selectedReview.isFeatured };
    } else if (actionType === 'pin') {
      data = { isPinned: !selectedReview.isPinned };
    }

    moderateReview(
      { id: selectedReview.id, action, data },
      { onSuccess: () => setConfirmOpen(false) }
    );
  };

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Hidden', value: 'HIDDEN' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Highest Rating (5★ → 1★)', value: 'rating_desc' },
    { label: 'Lowest Rating (1★ → 5★)', value: 'rating_asc' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Most Helpful', value: 'helpful' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Reviews Moderation</h1>
          <p className="text-sm text-on-secondary-container mt-1">Manage customer reviews, pin featured notes, and moderate media attachments.</p>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by product, customer, or comment content..."
            className="w-full sm:w-80"
          />
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <AdminFilterBar
              label="Filter by"
              options={statusOptions}
              value={status}
              onChange={(v) => { setStatus(v); setPage(1); }}
            />
            <AdminFilterBar
              label="Sort by"
              options={sortOptions}
              value={sortBy}
              onChange={(v) => { setSortBy(v); setPage(1); }}
            />
          </div>
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
                  <AdminTableHead>Product & Customer</AdminTableHead>
                  <AdminTableHead>Ratings & Badges</AdminTableHead>
                  <AdminTableHead>Maker Review Details</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {response.data.reviews.map((review: any) => (
                  <AdminTableRow key={review.id}>
                    <AdminTableCell className="max-w-[200px]">
                      <div>
                        <p className="font-medium text-primary-container line-clamp-1">{review.product?.name || 'Unknown Product'}</p>
                        <p className="text-xs text-on-secondary-container mt-1">
                          By: <span className="font-medium">{review.user?.firstName} {review.user?.lastName}</span>
                        </p>
                        <p className="text-[10px] text-on-secondary-container">{review.user?.email}</p>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="whitespace-nowrap">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-[#b06000]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium text-sm">{review.rating}/5</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {review.isVerified && (
                            <AdminBadge variant="success" className="text-[9px] px-1 py-0.2">VERIFIED</AdminBadge>
                          )}
                          {review.isFeatured && (
                            <AdminBadge variant="info" className="text-[9px] px-1 py-0.2 bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
                              FEATURED
                            </AdminBadge>
                          )}
                          {review.isPinned && (
                            <AdminBadge variant="default" className="text-[9px] px-1 py-0.2 bg-[#fff8e1] text-[#f57f17] border border-[#ffe082]">
                              PINNED
                            </AdminBadge>
                          )}
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="max-w-md">
                      <div>
                        {review.title && <p className="font-bold text-sm text-primary-container">"{review.title}"</p>}
                        <p className="text-xs text-on-secondary-container mt-1">{review.comment}</p>
                        
                        {/* Custom attributes display */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {review.qualityRating && <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-primary-container">Quality: {review.qualityRating}/5</span>}
                          {review.packagingRating && <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-primary-container">Pkg: {review.packagingRating}/5</span>}
                          {review.valueRating && <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-primary-container">Value: {review.valueRating}/5</span>}
                          {review.easeOfUseRating && <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-primary-container">Easy: {review.easeOfUseRating}/5</span>}
                        </div>

                        {/* Attached Media List */}
                        {review.media && review.media.length > 0 && (
                          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
                            {review.media.map((med: any) => (
                              <a 
                                key={med.id} 
                                href={med.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="relative h-12 w-12 rounded-lg overflow-hidden border border-outline-variant flex-shrink-0 hover:opacity-80 transition-opacity"
                              >
                                {med.type === 'IMAGE' ? (
                                  <img src={med.url} alt="Review attachment" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full bg-black flex items-center justify-center text-[8px] text-white font-bold">VIDEO</div>
                                )}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminBadge variant={
                        review.status === 'APPROVED' ? 'success' :
                        review.status === 'REJECTED' ? 'error' :
                        review.status === 'HIDDEN' ? 'default' : 'warning'
                      }>
                        {review.status}
                      </AdminBadge>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {review.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleActionClick(review, 'approve')}
                            className="p-1.5 text-[#0f9d58] hover:bg-[#e8f5e9] rounded transition-colors"
                            title="Approve & Verify"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {review.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleActionClick(review, 'reject')}
                            className="p-1.5 text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        {review.status === 'APPROVED' && (
                          <button
                            onClick={() => handleActionClick(review, 'hide')}
                            className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
                            title="Hide Review"
                          >
                            <EyeOff className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleActionClick(review, 'feature')}
                          className={`p-1.5 rounded transition-colors ${review.isFeatured ? 'text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d2e3fc]' : 'text-neutral-400 hover:bg-neutral-100'}`}
                          title={review.isFeatured ? 'Unfeature Review' : 'Feature Review'}
                        >
                          <Award className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleActionClick(review, 'pin')}
                          className={`p-1.5 rounded transition-colors ${review.isPinned ? 'text-[#f57f17] bg-[#fff8e1] hover:bg-[#ffe082]' : 'text-neutral-400 hover:bg-neutral-100'}`}
                          title={review.isPinned ? 'Unpin Review' : 'Pin Review'}
                        >
                          <Pin className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleActionClick(review, 'delete')}
                          className="p-1.5 text-[#c5221f] hover:bg-[#fce8e6] rounded transition-colors"
                          title="Delete Review"
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
        title={
          actionType === 'approve' ? 'Approve Review' : 
          actionType === 'reject' ? 'Reject Review' : 
          actionType === 'hide' ? 'Hide Review' :
          actionType === 'feature' ? (selectedReview?.isFeatured ? 'Unfeature Review' : 'Feature Review') :
          actionType === 'pin' ? (selectedReview?.isPinned ? 'Unpin Review' : 'Pin Review') :
          'Delete Review'
        }
        description={
          actionType === 'approve' ? 'This will approve the review and make it visible on the storefront.' :
          actionType === 'reject' ? 'This will mark the review as rejected.' :
          actionType === 'hide' ? 'This will set the review status to HIDDEN, hiding it from storefront search.' :
          actionType === 'feature' ? `This will ${selectedReview?.isFeatured ? 'remove the featured flag from' : 'mark this review as featured and highlight'} this review.` :
          actionType === 'pin' ? `This will ${selectedReview?.isPinned ? 'unpin' : 'pin this review to the top of'} the product page.` :
          'Are you sure you want to permanently delete this review? This action cannot be undone.'
        }
        onConfirm={handleConfirmAction}
        confirmText={
          actionType === 'approve' ? 'Approve' : 
          actionType === 'reject' ? 'Reject' : 
          actionType === 'hide' ? 'Hide' :
          actionType === 'feature' ? (selectedReview?.isFeatured ? 'Remove Feature' : 'Feature') :
          actionType === 'pin' ? (selectedReview?.isPinned ? 'Unpin' : 'Pin') :
          'Delete'
        }
        isDestructive={actionType === 'delete' || actionType === 'reject' || actionType === 'hide'}
        isLoading={isModerating}
      />
    </div>
  );
};
