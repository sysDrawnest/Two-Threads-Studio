import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, ShieldAlert } from 'lucide-react';
import {
  useAdminCouponDetail,
  useCreateCoupon,
  useUpdateCoupon,
} from '../../hooks/useAdminPromotions';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const CouponForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Queries & Mutations
  const { data: detail, isLoading: isLoadingDetail } = useAdminCouponDetail(id || '');
  const { mutateAsync: createCoupon, isPending: isCreating } = useCreateCoupon();
  const { mutateAsync: updateCoupon, isPending: isUpdating } = useUpdateCoupon();

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | null>(null);
  const [minCartSubtotal, setMinCartSubtotal] = useState(0);
  const [usageLimit, setUsageLimit] = useState<number | null>(null);
  const [perUserLimit, setPerUserLimit] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isStackable, setIsStackable] = useState(false);
  const [isExclusive, setIsExclusive] = useState(true);

  // Rule Targeting inputs
  const [eligibleCategories, setEligibleCategories] = useState<string[]>([]);
  const [eligibleCollections, setEligibleCollections] = useState<string[]>([]);
  const [eligibleProducts, setEligibleProducts] = useState<string[]>([]);

  // Fetch catalog options for multiselects
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  const { data: categoryOptions = [] } = useQuery({
    queryKey: ['adminCategoryOptions'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/categories`);
      return res.data.data.categories.map((c: any) => ({ value: c.id, label: c.name }));
    }
  });
  const { data: collectionOptions = [] } = useQuery({
    queryKey: ['adminCollectionOptions'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/collections`);
      return res.data.data.collections.map((c: any) => ({ value: c.id, label: c.name }));
    }
  });
  const { data: productOptions = [] } = useQuery({
    queryKey: ['adminProductOptions'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/products?limit=100`);
      return res.data.data.products.map((p: any) => ({ value: p.id, label: p.name }));
    }
  });

  // Populate data in edit mode
  useEffect(() => {
    if (isEdit && detail?.coupon) {
      const c = detail.coupon;
      setCode(c.code);
      setTitle(c.title);
      setDescription(c.description || '');
      setType(c.type);
      setDiscountValue(Number(c.discountValue));
      setMaxDiscountAmount(c.maxDiscountAmount ? Number(c.maxDiscountAmount) : null);
      setMinCartSubtotal(Number(c.minCartSubtotal));
      setUsageLimit(c.usageLimit || null);
      setPerUserLimit(c.perUserLimit);
      setIsActive(c.isActive);
      setIsStackable(c.isStackable);
      setIsExclusive(c.isExclusive);

      // Date formats for input datetime-local
      if (c.startDate) {
        setStartDate(new Date(c.startDate).toISOString().slice(0, 16));
      }
      if (c.endDate) {
        setEndDate(new Date(c.endDate).toISOString().slice(0, 16));
      }

      setEligibleCategories(c.eligibleCategories || []);
      setEligibleCollections(c.eligibleCollections || []);
      setEligibleProducts(c.eligibleProducts || []);
    }
  }, [isEdit, detail]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() && !isEdit) {
      toast.error('Coupon code is required');
      return;
    }
    if (!title.trim()) {
      toast.error('Campaign title is required');
      return;
    }
    if (!startDate) {
      toast.error('Start date is required');
      return;
    }

    const payload = {
      code: isEdit ? undefined : code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || null,
      type,
      discountValue: Number(discountValue),
      maxDiscountAmount: maxDiscountAmount !== null ? Number(maxDiscountAmount) : null,
      minCartSubtotal: Number(minCartSubtotal),
      usageLimit: usageLimit !== null ? Number(usageLimit) : null,
      perUserLimit: Number(perUserLimit),
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : null,
      isActive,
      isStackable,
      isExclusive,
      eligibleCategories,
      eligibleCollections,
      eligibleProducts,
    };

    try {
      if (isEdit && id) {
        await updateCoupon({ id, data: payload });
      } else {
        await createCoupon(payload);
      }
      navigate('/admin/coupons');
    } catch (err) {
      // toast.error is handled inside mutation onError hook
    }
  };

  if (isEdit && isLoadingDetail) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border border-neutral-200" />
          <div className="absolute inset-0 rounded-full border border-transparent border-t-[#A34A38] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <div className="flex items-center gap-2">
        <Link to="/admin/coupons" className="text-zinc-500 hover:text-zinc-950 transition-colors p-1" title="Back to coupons">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Back to Promotions</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-950">
          {isEdit ? `Edit Coupon: ${code}` : 'Create Promotion Coupon'}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Configure pricing policies, parameters, constraints, and targeting tags.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#A34A38]" />
                Campaign Identity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    disabled={isEdit}
                    placeholder="e.g. ARTISAN50"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full border border-zinc-200 p-2.5 text-xs font-mono uppercase tracking-wider focus:border-zinc-950 focus:outline-none bg-white disabled:bg-zinc-50 disabled:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Artisan Festival"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-zinc-200 p-2.5 text-xs font-medium focus:border-zinc-950 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Description / T&C (Optional)</label>
                <textarea
                  placeholder="Provide Terms, conditions or descriptions displayed to customers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full border border-zinc-200 p-2.5 text-xs focus:border-zinc-950 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Discount Mechanics & Logic */}
            <div className="border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                Discount Mechanics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Promotion Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-zinc-200 p-2.5 text-xs focus:border-zinc-950 focus:outline-none bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                    <option value="FIRST_ORDER">First Order Discount</option>
                    <option value="VIP">VIP Tier Discount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Discount Value</label>
                  <input
                    type="number"
                    disabled={type === 'FREE_SHIPPING'}
                    placeholder="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full border border-zinc-200 p-2.5 text-xs font-mono focus:border-zinc-950 focus:outline-none bg-white disabled:bg-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Max Cap (Optional)</label>
                  <input
                    type="number"
                    placeholder="No Limit"
                    value={maxDiscountAmount || ''}
                    onChange={(e) => setMaxDiscountAmount(e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-zinc-200 p-2.5 text-xs font-mono focus:border-zinc-950 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Min Subtotal Threshold</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minCartSubtotal}
                    onChange={(e) => setMinCartSubtotal(Number(e.target.value))}
                    className="w-full border border-zinc-200 p-2.5 text-xs font-mono focus:border-zinc-950 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Global Limit</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={usageLimit || ''}
                    onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-zinc-200 p-2.5 text-xs font-mono focus:border-zinc-950 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Per User Limit</label>
                  <input
                    type="number"
                    value={perUserLimit}
                    onChange={(e) => setPerUserLimit(Number(e.target.value))}
                    className="w-full border border-zinc-200 p-2.5 text-xs font-mono focus:border-zinc-950 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Target Criteria / Rule Builder */}
            <div className="border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                Eligible Target Criteria
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono">Select specific targets. Leave empty for storewide application.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Eligible Categories</label>
                  <Select
                    isMulti
                    options={categoryOptions}
                    value={categoryOptions.filter((o: any) => eligibleCategories.includes(o.value))}
                    onChange={(selected) => setEligibleCategories(selected.map((s: any) => s.value))}
                    placeholder="Select categories..."
                    className="text-xs"
                    styles={{ control: (base) => ({ ...base, borderColor: '#e4e4e7', padding: '2px', borderRadius: 0 }) }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Eligible Collections</label>
                  <Select
                    isMulti
                    options={collectionOptions}
                    value={collectionOptions.filter((o: any) => eligibleCollections.includes(o.value))}
                    onChange={(selected) => setEligibleCollections(selected.map((s: any) => s.value))}
                    placeholder="Select collections..."
                    className="text-xs"
                    styles={{ control: (base) => ({ ...base, borderColor: '#e4e4e7', padding: '2px', borderRadius: 0 }) }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Eligible Products</label>
                  <Select
                    isMulti
                    options={productOptions}
                    value={productOptions.filter((o: any) => eligibleProducts.includes(o.value))}
                    onChange={(selected) => setEligibleProducts(selected.map((s: any) => s.value))}
                    placeholder="Select specific products..."
                    className="text-xs"
                    styles={{ control: (base) => ({ ...base, borderColor: '#e4e4e7', padding: '2px', borderRadius: 0 }) }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Status & Settings */}
            <div className="border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                Configurations
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                  <span className="text-xs font-medium text-zinc-800">Status Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isStackable}
                    onChange={(e) => setIsStackable(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                  <span className="text-xs font-medium text-zinc-800">Stackable with others</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExclusive}
                    onChange={(e) => setIsExclusive(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                  <span className="text-xs font-medium text-zinc-800">Exclusive campaign</span>
                </label>
              </div>
            </div>

            {/* Campaign Timeline */}
            <div className="border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-600" />
                Schedule Timeline
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Start Date *</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-zinc-200 p-2 text-xs font-mono focus:border-zinc-950 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">End Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-zinc-200 p-2 text-xs font-mono focus:border-zinc-950 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full bg-zinc-950 text-white text-[11px] uppercase tracking-widest font-mono font-semibold py-3 hover:bg-zinc-800 transition-colors"
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save Coupon Campaign'}
              </button>
              <Link
                to="/admin/coupons"
                className="block w-full border border-zinc-300 text-zinc-700 text-[11px] uppercase tracking-widest font-mono font-semibold py-3 hover:bg-zinc-100 transition-colors text-center bg-white"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
