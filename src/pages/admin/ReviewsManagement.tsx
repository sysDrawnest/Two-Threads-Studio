import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import { mockAdminReviews, AdminReview } from '../../data/adminData';

const statusColors: Record<string, string> = {
  published: 'bg-[#e8f4e8] text-[#3a6b3a]',
  pending: 'bg-[#fef3e8] text-[#8b5a00]',
  flagged: 'bg-error-container text-error',
};

const ReviewsManagement: React.FC = () => {
  const columns = [
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    {
      key: 'rating', label: 'Rating',
      render: (r: AdminReview) => (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} width="12" height="12" fill={i <= r.rating ? '#785d4b' : 'none'} stroke="#785d4b" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
      )
    },
    { key: 'comment', label: 'Comment', render: (r: AdminReview) => <span className="line-clamp-1 max-w-xs">{r.comment}</span> },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'status', label: 'Status',
      render: (r: AdminReview) => (
        <span className={`font-sans text-[10px] px-2 py-1 uppercase tracking-wider ${statusColors[r.status]}`}>{r.status}</span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (r: AdminReview) => (
        <div className="flex gap-2">
          <button className="font-sans text-xs text-[#3a6b3a] hover:text-primary-container bg-transparent border-none cursor-pointer underline">Approve</button>
          <button className="font-sans text-xs text-error hover:text-error/70 bg-transparent border-none cursor-pointer underline">Remove</button>
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-primary-container">Reviews</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Moderate customer reviews and ratings.</p>
      </div>
      <div className="bg-background border border-outline-variant p-6">
        <DataTable data={mockAdminReviews} columns={columns} searchPlaceholder="Search reviews..." />
      </div>
    </div>
  );
};

export default ReviewsManagement;
