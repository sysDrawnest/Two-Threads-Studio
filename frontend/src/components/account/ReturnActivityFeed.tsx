/**
 * ReturnActivityFeed.tsx
 * Chronological activity timeline feed for Return Requests
 */

import React from 'react';
import { ReturnTimelineEvent } from './DynamicReturnStepper';
import { History, User, ShieldAlert } from 'lucide-react';

interface Props {
  timeline?: ReturnTimelineEvent[];
}

export const ReturnActivityFeed: React.FC<Props> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#e8d7c8] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#e8d7c8]/60">
        <History className="w-4 h-4 text-[#8b6f5c]" />
        <h4 className="font-serif font-semibold text-base text-[#5c4a3e]">Activity & Update History</h4>
      </div>

      <div className="relative pl-4 border-l-2 border-[#e8d7c8] space-y-4">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Dot */}
            <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-[#8b6f5c] border-2 border-white shadow-sm" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5c4a3e]">
                {item.status.replace(/_/g, ' ')}
              </span>
              <span className="text-[11px] text-[#8b6f5c] font-mono">
                {formatDate(item.createdAt)}
              </span>
            </div>

            {item.note && (
              <p className="text-xs text-[#78675c] mt-1 leading-relaxed bg-white border border-[#e8d7c8]/60 rounded-md p-2.5">
                {item.note}
              </p>
            )}

            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#a3968e]">
              {item.actorType === 'ADMIN' ? (
                <span className="flex items-center gap-1 text-[#8b6f5c] font-medium">
                  <ShieldAlert className="w-3 h-3" /> Studio Admin
                </span>
              ) : item.actorType === 'COURIER' ? (
                <span className="flex items-center gap-1 text-[#8b6f5c] font-medium">
                  🚚 Logistics Partner
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> Customer Request
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
