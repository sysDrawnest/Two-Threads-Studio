import React, { useState } from 'react';
import { Tag, Check, X, Sparkles } from 'lucide-react';
import { useCoupons, CouponItem } from '../../hooks/useCoupons';



interface CouponInputProps {
  sessionToken?: string;
  appliedCouponCode?: string | null;
  onCouponApplied?: () => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  sessionToken,
  appliedCouponCode,
  onCouponApplied,
}) => {
  const { availableCoupons, applyCoupon, isApplyingCoupon, removeCoupon, isRemovingCoupon } = useCoupons(sessionToken);
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApply = async (codeToApply?: string) => {
    const targetCode = codeToApply || code;
    if (!targetCode.trim()) return;

    setErrorMessage(null);
    try {
      await applyCoupon(targetCode.trim());
      setCode('');
      if (onCouponApplied) onCouponApplied();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to apply coupon.');
    }
  };

  const handleRemove = async () => {
    setErrorMessage(null);
    try {
      await removeCoupon();
      if (onCouponApplied) onCouponApplied();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove coupon.');
    }
  };

  return (
    <div className="border border-zinc-200 p-4 bg-white space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-800">
        <Tag className="w-3.5 h-3.5 text-[#A34A38]" />
        <span>Promo Code / Coupon</span>
      </div>

      {appliedCouponCode ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-800">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Coupon <strong>{appliedCouponCode}</strong> Applied</span>
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemovingCoupon}
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
            title="Remove Coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ENTER CODE (e.g. WELCOME10)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 border border-zinc-200 p-2 text-xs font-mono uppercase tracking-wider focus:border-zinc-950 focus:outline-none"
          />
          <button
            onClick={() => handleApply()}
            disabled={isApplyingCoupon || !code.trim()}
            className="bg-zinc-950 text-white text-[11px] px-4 py-2 hover:bg-zinc-800 transition-colors uppercase tracking-widest font-mono disabled:opacity-50"
          >
            {isApplyingCoupon ? 'Applying...' : 'Apply'}
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 text-[11px] font-mono leading-tight">{errorMessage}</p>
      )}

      {!appliedCouponCode && availableCoupons.length > 0 && (
        <div className="pt-2 border-t border-zinc-100">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#A34A38]" />
            Available Studio Offers
          </p>
          <div className="space-y-1.5">
            {availableCoupons.map((c: CouponItem) => (
              <div

                key={c.id}
                onClick={() => handleApply(c.code)}
                className="flex items-center justify-between border border-dashed border-zinc-200 p-2 text-xs hover:border-zinc-950 cursor-pointer transition-all bg-zinc-50/50"
              >
                <div>
                  <span className="font-mono font-bold text-zinc-900">{c.code}</span>
                  <p className="text-[10px] text-zinc-500">{c.description}</p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A34A38] font-semibold">
                  Tap to Apply
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
