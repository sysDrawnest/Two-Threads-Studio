/**
 * RefundReceiptCard.tsx
 * Customer-facing refund receipt & bank settlement disclosure card
 */

import React from 'react';
import { CreditCard, CheckCircle2, Building2 } from 'lucide-react';

interface Props {
  refundAmount: number;
  refundId?: string | null;
  paymentMethod?: string;
  refundProcessedAt?: string | null;
}

export const RefundReceiptCard: React.FC<Props> = ({
  refundAmount,
  refundId,
  paymentMethod = 'Original Payment Method',
  refundProcessedAt,
}) => {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(refundAmount);

  const formattedDate = refundProcessedAt
    ? new Date(refundProcessedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-[#fcfaf7] border border-[#e8d7c8] rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8d7c8]/60">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#8b6f5c]" />
          <h4 className="font-serif font-semibold text-base text-[#5c4a3e]">Refund Details</h4>
        </div>
        <span className="text-xs font-semibold text-[#8b6f5c] bg-[#f4ece4] border border-[#d2c4bc] px-2.5 py-1 rounded-md">
          Processed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border border-[#e8d7c8]/70 rounded-lg p-3">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#8b6f5c] mb-1">
            Refund Amount
          </span>
          <span className="font-serif font-bold text-lg text-[#5c4a3e]">{formattedAmount}</span>
        </div>

        <div className="bg-white border border-[#e8d7c8]/70 rounded-lg p-3">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#8b6f5c] mb-1">
            Refund Reference
          </span>
          <span className="font-mono text-xs font-semibold text-[#5c4a3e] block truncate" title={refundId || 'N/A'}>
            {refundId || 'rfnd_processed'}
          </span>
        </div>

        <div className="bg-white border border-[#e8d7c8]/70 rounded-lg p-3">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#8b6f5c] mb-1">
            Refund Destination
          </span>
          <span className="text-xs font-medium text-[#5c4a3e] flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#8b6f5c]" />
            {paymentMethod === 'ONLINE' ? 'Original Payment Method' : paymentMethod || 'Original Payment Method'}
          </span>
        </div>
      </div>

      <div className="bg-[#f4ece4]/60 border border-[#d2c4bc]/60 rounded-lg p-3 text-xs text-[#78675c] flex items-start gap-2.5">
        <Building2 className="w-4 h-4 text-[#8b6f5c] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-[#5c4a3e]">Awaiting Bank Credit</p>
          <p className="mt-0.5 leading-relaxed">
            Your refund has been processed successfully to your original payment method{formattedDate ? ` on ${formattedDate}` : ''}. Most banks credit the amount within 3–7 business days.
          </p>
        </div>
      </div>
    </div>
  );
};
