import React, { useState } from 'react';
import { useAddresses, useCreateAddress, Address } from '../../hooks/useCommerce';
import { Check, Plus, MapPin, Building, Home } from 'lucide-react';

interface AddressSelectorProps {
  selectedId?: string;
  onSelect: (address: Address) => void;
  type?: 'shipping' | 'billing';
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedId,
  onSelect,
  type = 'shipping',
}) => {
  const { data: addresses, isLoading, error } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Automatically expand address creation form when user has no saved addresses
  React.useEffect(() => {
    if (!isLoading && addresses && addresses.length === 0) {
      setShowAddForm(true);
    }
  }, [addresses, isLoading]);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    company: '',
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    country: 'IN',
    postalCode: '',
    landmark: '',
    addressType: 'HOME' as 'HOME' | 'WORK' | 'STUDIO' | 'PARENTS' | 'OTHER',
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    
    const phone = formData.phone.trim();
    if (!phone) {
      errors.phone = 'Contact number is required';
    } else if (formData.country === 'IN' && !/^[6789]\d{9}$/.test(phone)) {
      errors.phone = '10-digit Indian phone number required';
    }

    if (!formData.line1.trim()) errors.line1 = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    
    const postal = formData.postalCode.trim();
    if (!postal) {
      errors.postalCode = 'PIN code is required';
    } else if (formData.country === 'IN' && !/^[1-9][0-9]{5}$/.test(postal)) {
      errors.postalCode = 'Valid 6-digit Indian PIN code required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const response: any = await createAddressMutation.mutateAsync({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || null,
        line1: formData.line1.trim(),
        line2: formData.line2.trim() || null,
        city: formData.city.trim(),
        district: formData.district.trim() || null,
        state: formData.state.trim(),
        country: formData.country,
        postalCode: formData.postalCode.trim(),
        landmark: formData.landmark.trim() || null,
        type: formData.addressType,
        isDefaultShipping: type === 'shipping',
        isDefaultBilling: type === 'billing',
      } as any);

      // Support both unwrapped object and { success: true, address: {...} } backend format
      const createdAddress = response?.address || response?.data?.address || response?.data || response;

      if (createdAddress && createdAddress.id) {
        onSelect(createdAddress);
        setShowAddForm(false);
        setFormData({
          fullName: '',
          phone: '',
          company: '',
          line1: '',
          line2: '',
          city: '',
          district: '',
          state: '',
          country: 'IN',
          postalCode: '',
          landmark: '',
          addressType: 'HOME',
        });
      } else {
        setServerError('Failed to save address. Please try again.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Failed to create address.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-28 bg-[#FAF8F5] border border-[#EBE5DF] rounded-xl" />
        <div className="h-28 bg-[#FAF8F5] border border-[#EBE5DF] rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#FDF2F0] border border-[#F5C6CB] text-[#9A2C1D] text-xs font-mono rounded-xl flex items-center gap-2">
        <span>Failed to fetch saved addresses. Please refresh or add a new address.</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {addresses.map((address: Address) => {
            const isSelected =
              selectedId === address.id ||
              (!selectedId && (type === 'shipping' ? address.isDefaultShipping : address.isDefaultBilling));

            // Auto-propagate selection if this is default and no selection is explicitly set yet
            if (isSelected && !selectedId) {
              setTimeout(() => onSelect(address), 0);
            }

            return (
              <div
                key={address.id}
                onClick={() => onSelect(address)}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(address)}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border text-left outline-none ${
                  isSelected
                    ? 'border-[#1C1C1B] bg-white ring-1 ring-[#1C1C1B] shadow-[0_4px_20px_rgba(28,28,27,0.06)]'
                    : 'border-[#EBE5DF] bg-[#FAF8F5] hover:border-[#C4B9AD] hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full font-semibold ${
                        isSelected
                          ? 'bg-[#1C1C1B] text-[#FBFBFA]'
                          : 'bg-[#EAE4DC] text-[#6E665E]'
                      }`}
                    >
                      {address.type === 'WORK' ? <Building className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                      {address.type}
                    </span>
                    {address.isDefaultShipping && type === 'shipping' && (
                      <span className="text-[9px] font-mono tracking-wider uppercase text-[#A34A38] bg-[#F9ECE9] px-2 py-0.5 rounded-full font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white'
                        : 'border-[#D1C7BD] bg-transparent group-hover:border-[#9A8D80]'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <p className="text-xs font-semibold text-[#1C1C1B] tracking-tight">{address.fullName}</p>
                  <p className="text-xs text-[#5C544D] leading-relaxed font-normal">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-xs text-[#7A7067]">
                    {address.city}, {address.state} — <span className="font-mono text-[#1C1C1B] font-medium">{address.postalCode}</span>
                  </p>
                  <p className="text-[11px] text-[#8C827A] font-mono pt-1 flex items-center gap-1">
                    <span>Phone:</span>
                    <span className="text-[#3A3530]">{address.phone}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 bg-[#FAF8F5] border border-dashed border-[#D6CCC2] rounded-xl text-center">
          <p className="text-xs text-[#7A7067]">No saved delivery addresses found. Please add a destination below.</p>
        </div>
      )}

      {/* Add New Address Toggle / Drawer */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full py-3.5 px-4 border border-dashed border-[#C8BEB3] hover:border-[#1C1C1B] bg-[#FAF8F5] hover:bg-white rounded-xl text-xs font-mono uppercase tracking-widest text-[#1C1C1B] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add New Delivery Address</span>
        </button>
      ) : (
        <div className="border border-[#E2DBD1] bg-white rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgba(28,28,27,0.04)] space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#EBE5DF] pb-3.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A34A38]" />
              <h3 className="font-serif text-base text-[#1C1C1B]">New Delivery Destination</h3>
            </div>
            {addresses && addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[11px] font-mono tracking-wider text-[#7A7067] hover:text-[#1C1C1B] underline uppercase bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          {serverError && (
            <div className="p-3 bg-[#FDF2F0] border border-[#F5C6CB] text-[#9A2C1D] text-xs font-mono rounded-lg">
              {serverError}
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4">
            {/* Address Tag Selector */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067] mb-2 font-medium">Address Tag</label>
              <div className="flex flex-wrap gap-2">
                {(['HOME', 'WORK', 'STUDIO', 'PARENTS', 'OTHER'] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFormData({ ...formData, addressType: tag })}
                    className={`px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase rounded-lg border transition-all ${
                      formData.addressType === tag
                        ? 'bg-[#1C1C1B] text-white border-[#1C1C1B] font-semibold'
                        : 'bg-[#FAF8F5] text-[#5C544D] border-[#E2DBD1] hover:border-[#A69B8F]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">Recipient Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Shreyasi Sahoo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1B] bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none transition-all ${
                    validationErrors.fullName ? 'border-red-400' : 'border-[#E2DBD1]'
                  }`}
                />
                {validationErrors.fullName && <p className="text-red-500 text-[10px] font-mono">{validationErrors.fullName}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">Contact Phone Number *</label>
                <input
                  type="text"
                  placeholder="10-digit Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1B] bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none font-mono transition-all ${
                    validationErrors.phone ? 'border-red-400' : 'border-[#E2DBD1]'
                  }`}
                />
                {validationErrors.phone && <p className="text-red-500 text-[10px] font-mono">{validationErrors.phone}</p>}
              </div>

              {/* Line 1 */}
              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">Flat, House No., Building, Apartment *</label>
                <input
                  type="text"
                  placeholder="House/Flat No, Street Name, Area"
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1B] bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none transition-all ${
                    validationErrors.line1 ? 'border-red-400' : 'border-[#E2DBD1]'
                  }`}
                />
                {validationErrors.line1 && <p className="text-red-500 text-[10px] font-mono">{validationErrors.line1}</p>}
              </div>

              {/* Line 2 */}
              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">Landmark / Suite / Sector (Optional)</label>
                <input
                  type="text"
                  placeholder="Near Park, Opposite Metro, etc."
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  className="w-full border border-[#E2DBD1] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1B] bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none transition-all"
                />
              </div>

              {/* PIN Code */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">Postal / PIN Code *</label>
                <input
                  type="text"
                  placeholder="6-digit PIN"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1B] bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none font-mono transition-all ${
                    validationErrors.postalCode ? 'border-red-400' : 'border-[#E2DBD1]'
                  }`}
                />
                {validationErrors.postalCode && <p className="text-red-500 text-[10px] font-mono">{validationErrors.postalCode}</p>}
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1B] bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none transition-all ${
                    validationErrors.city ? 'border-red-400' : 'border-[#E2DBD1]'
                  }`}
                />
                {validationErrors.city && <p className="text-red-500 text-[10px] font-mono">{validationErrors.city}</p>}
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">State *</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra, Karnataka"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1B] bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none transition-all ${
                    validationErrors.state ? 'border-red-400' : 'border-[#E2DBD1]'
                  }`}
                />
                {validationErrors.state && <p className="text-red-500 text-[10px] font-mono">{validationErrors.state}</p>}
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#7A7067]">Country</label>
                <input
                  type="text"
                  disabled
                  value="India (IN)"
                  className="w-full border border-[#E2DBD1] rounded-xl px-3.5 py-2.5 text-xs text-[#7A7067] bg-[#EAE4DC]/40 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              {addresses && addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E2DBD1] text-[#5C544D] text-xs font-mono uppercase tracking-widest hover:bg-[#FAF8F5] transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={createAddressMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-[#1C1C1B] text-[#FBFBFA] text-xs font-mono uppercase tracking-widest hover:bg-[#333331] transition-all cursor-pointer font-semibold shadow-sm flex items-center gap-2"
              >
                {createAddressMutation.isPending ? 'Saving...' : 'Save & Select Address'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
