/**
 * ReturnTrackingCard.tsx
 * Reverse courier pickup & shipment tracking card for Two Threads Studio
 */

import React from 'react';
import { Truck, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

interface Props {
  courierPartner?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  pickupScheduledAt?: string | null;
  estimatedDelivery?: string | null;
  pickupStatus?: string | null;
}

export const ReturnTrackingCard: React.FC<Props> = ({
  courierPartner,
  trackingNumber,
  trackingUrl,
  pickupScheduledAt,
  estimatedDelivery,
  pickupStatus,
}) => {
  if (!trackingNumber && !courierPartner) return null;

  const formatDate = (dStr?: string | null) => {
    if (!dStr) return null;
    try {
      return new Date(dStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dStr;
    }
  };

  const defaultTrackingUrl = trackingUrl || (trackingNumber ? `https://track.shiprocket.in/${trackingNumber}` : undefined);

  return (
    <div className="bg-[#FAF8F5] border border-[#e8d7c8] rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8d7c8]/60">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#8b6f5c]" />
          <h4 className="font-serif font-semibold text-base text-[#5c4a3e]">Return Shipment Tracking</h4>
        </div>
        <span className="text-xs font-semibold text-[#8b6f5c] bg-[#f4ece4] border border-[#d2c4bc] px-2.5 py-1 rounded-md">
          {pickupStatus ? pickupStatus.replace(/_/g, ' ') : 'Pickup Scheduled'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border border-[#e8d7c8]/70 rounded-lg p-3">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#8b6f5c] mb-1">
            Courier Partner
          </span>
          <span className="font-serif font-bold text-sm text-[#5c4a3e] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8b6f5c]" />
            {courierPartner || 'Studio Reverse Logistics'}
          </span>
        </div>

        <div className="bg-white border border-[#e8d7c8]/70 rounded-lg p-3">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#8b6f5c] mb-1">
            AWB Tracking No.
          </span>
          <span className="font-mono text-xs font-bold text-[#5c4a3e]">
            {trackingNumber || 'N/A'}
          </span>
        </div>

        <div className="bg-white border border-[#e8d7c8]/70 rounded-lg p-3">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#8b6f5c] mb-1">
            Pickup Date
          </span>
          <span className="text-xs font-semibold text-[#5c4a3e] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#8b6f5c]" />
            {formatDate(pickupScheduledAt) || 'Scheduled'}
          </span>
        </div>
      </div>

      {estimatedDelivery && (
        <p className="text-xs text-[#78675c] mb-4">
          Expected Warehouse Arrival:{' '}
          <strong className="text-[#5c4a3e]">{formatDate(estimatedDelivery)}</strong>
        </p>
      )}

      {defaultTrackingUrl && (
        <a
          href={defaultTrackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#8b6f5c] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#765d4d] transition-colors shadow-sm"
        >
          <ExternalLink className="w-4 h-4" /> Track Return Shipment
        </a>
      )}
    </div>
  );
};
