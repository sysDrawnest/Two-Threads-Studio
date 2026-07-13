import React, { useState } from 'react';
import { useAddresses, useCreateAddress, Address } from '../../hooks/useCommerce';
import { Check, Plus, MapPin } from 'lucide-react';

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
    addressType: 'HOME' as 'HOME' | 'WORK' | 'OTHER',
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Required';
    
    const phone = formData.phone.trim();
    if (!phone) {
      errors.phone = 'Required';
    } else if (formData.country === 'IN' && !/^[6789]\d{9}$/.test(phone)) {
      errors.phone = 'Enter valid 10-digit Indian number';
    }

    if (!formData.line1.trim()) errors.line1 = 'Required';
    if (!formData.city.trim()) errors.city = 'Required';
    if (!formData.state.trim()) errors.state = 'Required';
    
    const postal = formData.postalCode.trim();
    if (!postal) {
      errors.postalCode = 'Required';
    } else if (formData.country === 'IN' && !/^[1-9][0-9]{5}$/.test(postal)) {
      errors.postalCode = 'Enter valid 6-digit PIN';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      const newAddress = await createAddressMutation.mutateAsync({
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

      onSelect(newAddress as any);
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
    } catch (err: any) {
      setServerError(err.message || 'Failed to create address.');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-24 bg-zinc-100"></div></div>;
  }

  if (error) {
    return <p className="text-red-500 text-xs font-mono">Failed to fetch addresses.</p>;
  }

  return (
    <div className="space-y-4">
      {addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address: Address) => {
            const isSelected = selectedId === address.id || (!selectedId && (type === 'shipping' ? address.isDefaultShipping : address.isDefaultBilling));
            
            // Auto-propagate selection if this is default and no selection is explicitly set yet
            if (isSelected && !selectedId) {
              setTimeout(() => onSelect(address), 0);
            }

            return (
              <div
                key={address.id}
                onClick={() => onSelect(address)}
                className={`border p-4 cursor-pointer relative transition-all ${
                  isSelected ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-zinc-950 text-white p-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <span className="text-[10px] font-mono tracking-wider uppercase bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded-sm">
                  {address.type}
                </span>

                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-zinc-900">{address.fullName}</p>
                  <p className="text-xs text-zinc-600">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {address.city}, {address.state} - <span className="font-mono">{address.postalCode}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono">Phone: {address.phone}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-zinc-500 text-xs">No saved addresses found.</p>
      )}

      {showAddForm ? (
        <form onSubmit={handleAddSubmit} className="border border-zinc-200 p-4 bg-zinc-50 space-y-4">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-700">Add New Address</p>
          
          {serverError && <p className="text-red-500 text-xs font-mono">{serverError}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white"
              />
              {validationErrors.fullName && <p className="text-red-500 text-[10px] font-mono mt-0.5">{validationErrors.fullName}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Phone *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white font-mono"
              />
              {validationErrors.phone && <p className="text-red-500 text-[10px] font-mono mt-0.5">{validationErrors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Street Address Line 1 *"
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white"
              />
              {validationErrors.line1 && <p className="text-red-500 text-[10px] font-mono mt-0.5">{validationErrors.line1}</p>}
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Apartment, suite, unit etc. (Optional)"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Postal / ZIP Code *"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white font-mono"
              />
              {validationErrors.postalCode && <p className="text-red-500 text-[10px] font-mono mt-0.5">{validationErrors.postalCode}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white"
              />
              {validationErrors.city && <p className="text-red-500 text-[10px] font-mono mt-0.5">{validationErrors.city}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="State / Province *"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white"
              />
              {validationErrors.state && <p className="text-red-500 text-[10px] font-mono mt-0.5">{validationErrors.state}</p>}
            </div>

            <div>
              <select
                value={formData.addressType}
                onChange={(e) => setFormData({ ...formData, addressType: e.target.value as any })}
                className="w-full border border-zinc-200 p-2 text-xs focus:border-black focus:outline-none bg-white"
              >
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createAddressMutation.isPending}
              className="bg-zinc-950 text-white text-[11px] px-4 py-2 hover:bg-zinc-800 transition-colors uppercase tracking-widest font-mono"
            >
              {createAddressMutation.isPending ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="border border-zinc-300 text-zinc-700 text-[11px] px-4 py-2 hover:bg-zinc-100 transition-colors uppercase tracking-widest font-mono"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 border border-dashed border-zinc-300 hover:border-zinc-950 p-4 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-black w-full justify-center transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Delivery Address
        </button>
      )}
    </div>
  );
};

export default AddressSelector;
