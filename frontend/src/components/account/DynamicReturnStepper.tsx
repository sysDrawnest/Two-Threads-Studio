/**
 * DynamicReturnStepper.tsx
 * Premium multi-stage visual return tracking stepper for Two Threads Studio
 */

import React from 'react';
import { Check, Clock, PackageCheck, Truck, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react';

export interface ReturnTimelineEvent {
  status: string;
  note?: string;
  createdAt: string;
  actorType?: string;
}

export interface ReturnRequestData {
  id: string;
  status: string;
  reason: string;
  refundType: string;
  courierPartner?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  pickupScheduledAt?: string | null;
  pickedUpAt?: string | null;
  receivedAt?: string | null;
  inspectedAt?: string | null;
  refundProcessedAt?: string | null;
  estimatedDelivery?: string | null;
  requestedAt: string;
  approvedAt?: string | null;
  resolvedAt?: string | null;
  finalRefundAmount?: number | null;
  timeline?: ReturnTimelineEvent[];
}

interface Props {
  returnRequest: ReturnRequestData;
  isDigital?: boolean;
}

interface StepConfig {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  timestamp?: string | null;
}

export const DynamicReturnStepper: React.FC<Props> = ({ returnRequest, isDigital = false }) => {
  const { status } = returnRequest;

  // Format date helper
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
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

  // Build dynamic steps array
  const allSteps: StepConfig[] = [
    {
      id: 'REQUESTED',
      label: 'Request Submitted',
      description: 'Return request received by Two Threads Studio',
      icon: Clock,
      timestamp: formatDate(returnRequest.requestedAt),
    },
    {
      id: 'APPROVED',
      label: 'Approved',
      description: 'Return request approved by studio team',
      icon: Check,
      timestamp: formatDate(returnRequest.approvedAt),
    },
    !isDigital ? {
      id: 'PICKUP_SCHEDULED',
      label: 'Pickup Scheduled',
      description: returnRequest.courierPartner
        ? `Scheduled with ${returnRequest.courierPartner}`
        : 'Reverse courier pickup scheduled',
      icon: Truck,
      timestamp: formatDate(returnRequest.pickupScheduledAt),
    } : null,
    !isDigital ? {
      id: 'PICKED_UP',
      label: 'Picked Up',
      description: 'Package collected by courier partner',
      icon: PackageCheck,
      timestamp: formatDate(returnRequest.pickedUpAt),
    } : null,
    !isDigital ? {
      id: 'RECEIVED',
      label: 'Warehouse Received',
      description: 'Package delivered to studio warehouse',
      icon: PackageCheck,
      timestamp: formatDate(returnRequest.receivedAt),
    } : null,
    {
      id: 'INSPECTION_PASSED',
      label: 'Quality Inspection',
      description: 'Artisan quality & item condition verified',
      icon: ShieldCheck,
      timestamp: formatDate(returnRequest.inspectedAt),
    },
    {
      id: 'REFUND_PROCESSING',
      label: 'Refund Initiated',
      description: 'Refund request submitted to Razorpay gateway',
      icon: CreditCard,
      timestamp: formatDate(returnRequest.refundProcessedAt || returnRequest.requestedAt),
    },
    {
      id: 'SENT_TO_BANK',
      label: 'Sent to Bank',
      description: 'Payment network processing bank transfer (3–7 days)',
      icon: CreditCard,
      timestamp: status === 'REFUNDED' || status === 'REFUND_PROCESSING' ? 'Processing with Bank' : null,
    },
    {
      id: 'REFUNDED',
      label: 'Bank Credit Completed',
      description: 'Funds credited successfully to customer account',
      icon: Check,
      timestamp: formatDate(returnRequest.resolvedAt),
    },
  ].filter(Boolean) as StepConfig[];

  // Determine current active step index
  const statusRank: Record<string, number> = {
    REQUESTED: 0,
    APPROVED: 1,
    PICKUP_SCHEDULED: 2,
    PICKED_UP: 3,
    IN_TRANSIT: 3,
    RECEIVED: 4,
    INSPECTION_PENDING: 4,
    INSPECTION_PASSED: 5,
    REFUND_PROCESSING: 6,
    REFUNDED: 7,
    CLOSED: 8,
  };

  const currentRank = statusRank[status] ?? (status === 'REJECTED' ? -1 : 0);
  const isRejected = status === 'REJECTED' || status === 'INSPECTION_FAILED';

  if (isRejected) {
    return (
      <div className="bg-[#fcf3f2] border border-[#f5c6cb] rounded-xl p-5 mb-6 text-[#a81a17]">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#c5221f]" />
          <h4 className="font-serif font-semibold text-base">Return Request Update</h4>
        </div>
        <p className="text-xs leading-relaxed text-[#7c1412]">
          This return request has been rejected or did not pass physical quality inspection. If you have questions regarding your item's condition, please contact customer care.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] border border-[#e8d7c8] rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e8d7c8]/60">
        <div>
          <h3 className="font-serif font-semibold text-lg text-[#5c4a3e]">Return Journey & Status</h3>
          <p className="text-xs text-[#78675c] mt-0.5">Track your item from pickup to refund processing</p>
        </div>
        {returnRequest.estimatedDelivery && status !== 'REFUNDED' && (
          <div className="bg-[#f4ece4] border border-[#d2c4bc] rounded-lg px-3 py-1.5 text-right">
            <span className="block text-[10px] uppercase tracking-wider text-[#8b6f5c] font-semibold">Expected Warehouse Arrival</span>
            <span className="font-serif font-bold text-xs text-[#5c4a3e]">
              {formatDate(returnRequest.estimatedDelivery)?.split(',')[0]}
            </span>
          </div>
        )}
      </div>

      {/* Horizontal Stepper (Desktop) */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Progress Connecting Line */}
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#e8ded6] -z-0">
            <div
              className="h-full bg-[#8b6f5c] transition-all duration-500"
              style={{
                width: `${Math.min(100, (currentRank / (allSteps.length - 1)) * 100)}%`,
              }}
            />
          </div>

          {allSteps.map((step, idx) => {
            const isCompleted = idx <= currentRank;
            const isCurrent = idx === currentRank;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group max-w-[100px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#8b6f5c] border-[#8b6f5c] text-white shadow-md ring-4 ring-[#8b6f5c]/20'
                      : isCompleted
                      ? 'bg-[#f4ece4] border-[#8b6f5c] text-[#8b6f5c]'
                      : 'bg-white border-[#d2c4bc] text-[#a3968e]'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>

                <div className="mt-3 text-center">
                  <p className={`text-xs font-semibold leading-snug ${isCurrent ? 'text-[#5c4a3e]' : isCompleted ? 'text-[#78675c]' : 'text-[#a3968e]'}`}>
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <span className="block text-[10px] text-[#8b6f5c] mt-0.5 font-mono">
                      {step.timestamp.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Stepper (Mobile) */}
      <div className="md:hidden space-y-4">
        {allSteps.map((step, idx) => {
          const isCompleted = idx <= currentRank;
          const isCurrent = idx === currentRank;

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-[#8b6f5c] border-[#8b6f5c] text-white shadow-sm ring-2 ring-[#8b6f5c]/20'
                    : isCompleted
                    ? 'bg-[#f4ece4] border-[#8b6f5c] text-[#8b6f5c]'
                    : 'bg-white border-[#d2c4bc] text-[#a3968e]'
                }`}
              >
                {isCompleted && !isCurrent ? <Check className="w-4 h-4" /> : <step.icon className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-semibold ${isCurrent ? 'text-[#5c4a3e]' : 'text-[#78675c]'}`}>
                    {step.label}
                  </h4>
                  {step.timestamp && (
                    <span className="text-[10px] text-[#8b6f5c] font-mono">{step.timestamp}</span>
                  )}
                </div>
                <p className="text-[11px] text-[#a3968e] mt-0.5 leading-snug">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
