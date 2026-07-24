import React, { useState } from 'react';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  Address,
} from '../../hooks/useCommerce';
import LoadingSkeleton from './LoadingSkeleton';
import { Plus, Trash2, Edit2, Check, MapPin } from 'lucide-react';

export const AddressBook: React.FC = () => {
  const { data: addresses, isLoading, error } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
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
    type: 'HOME' as 'HOME' | 'WORK' | 'OTHER',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const resetForm = () => {
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
      type: 'HOME',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setIsEditing(false);
    setEditingAddress(null);
    setValidationErrors({});
    setServerError(null);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      company: address.company || '',
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      district: address.district || '',
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      landmark: address.landmark || '',
      type: address.type,
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling,
    });
    setIsEditing(true);
    setValidationErrors({});
    setServerError(null);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    
    // Phone validation
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      errors.phone = 'Phone number is required';
    } else if (formData.country === 'IN') {
      const pinRegex = /^[6789]\d{9}$/;
      if (!pinRegex.test(cleanPhone)) {
        errors.phone = 'Please enter a valid 10-digit Indian phone number';
      }
    } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      errors.phone = 'Invalid phone number length';
    }

    if (!formData.line1.trim()) errors.line1 = 'Street address line 1 is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State / Region is required';
    if (!formData.country.trim()) errors.country = 'Country is required';

    // Postal code validation
    const cleanPostal = formData.postalCode.trim();
    if (!cleanPostal) {
      errors.postalCode = 'Postal / ZIP code is required';
    } else if (formData.country === 'IN') {
      const pinRegex = /^[1-9][0-9]{5}$/;
      if (!pinRegex.test(cleanPostal)) {
        errors.postalCode = 'Please enter a valid 6-digit Indian PIN code';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || null,
        line1: formData.line1.trim(),
        line2: formData.line2.trim() || null,
        city: formData.city.trim(),
        district: formData.district.trim() || null,
        state: formData.state.trim(),
        country: formData.country.trim(),
        postalCode: formData.postalCode.trim(),
        landmark: formData.landmark.trim() || null,
        type: formData.type,
        isDefaultShipping: formData.isDefaultShipping,
        isDefaultBilling: formData.isDefaultBilling,
      };

      if (editingAddress) {
        await updateAddressMutation.mutateAsync({
          id: editingAddress.id,
          data: payload as any,
        });
      } else {
        await createAddressMutation.mutateAsync(payload as any);
      }

      resetForm();
    } catch (err: any) {
      setServerError(err.message || 'Failed to save address details.');
    }
  };

  const handleDeleteClick = async (addressId: string) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      try {
        await deleteAddressMutation.mutateAsync(addressId);
      } catch (err: any) {
        alert(err.message || 'Failed to delete address.');
      }
    }
  };

  const handleSetDefault = async (addressId: string, type: 'shipping' | 'billing' | 'both') => {
    try {
      await setDefaultAddressMutation.mutateAsync({ id: addressId, type });
    } catch (err: any) {
      alert(err.message || 'Failed to update default address configuration.');
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="border border-zinc-200 p-8 text-center bg-zinc-50">
        <p className="text-zinc-600 text-sm">Failed to retrieve saved addresses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-950 font-sans">Saved Addresses</h2>
          <p className="text-zinc-500 text-xs mt-1">Manage your default and secondary delivery addresses</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white text-xs px-4 py-2 hover:bg-zinc-800 transition-colors uppercase tracking-widest font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="border border-zinc-200 p-6 bg-zinc-50 space-y-6">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider font-mono">
            {editingAddress ? 'Edit Address' : 'New Address'}
          </h3>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
              {validationErrors.fullName && <p className="text-red-500 text-xs font-mono mt-1">{validationErrors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Phone Number *</label>
              <input
                type="text"
                placeholder={formData.country === 'IN' ? '10-digit number' : 'Include country code'}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none font-mono"
              />
              {validationErrors.phone && <p className="text-red-500 text-xs font-mono mt-1">{validationErrors.phone}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Company (Optional)</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Address Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              >
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Line 1 */}
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Street Address Line 1 *</label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
              {validationErrors.line1 && <p className="text-red-500 text-xs font-mono mt-1">{validationErrors.line1}</p>}
            </div>

            {/* Line 2 */}
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Apartment, Suite, Unit, etc. (Optional)</label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Country *</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="AE">United Arab Emirates</option>
              </select>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Postal / ZIP Code *</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none font-mono"
              />
              {validationErrors.postalCode && <p className="text-red-500 text-xs font-mono mt-1">{validationErrors.postalCode}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">City / Town *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
              {validationErrors.city && <p className="text-red-500 text-xs font-mono mt-1">{validationErrors.city}</p>}
            </div>

            {/* District */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">District (Optional)</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">State / Province *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
              {validationErrors.state && <p className="text-red-500 text-xs font-mono mt-1">{validationErrors.state}</p>}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full border border-zinc-200 p-2 text-sm bg-white focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Default switches */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefaultShipping}
                onChange={(e) => setFormData({ ...formData, isDefaultShipping: e.target.checked })}
                className="w-4 h-4 accent-black"
              />
              <span className="text-xs uppercase tracking-wider font-mono text-zinc-700">Set as default shipping address</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefaultBilling}
                onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })}
                className="w-4 h-4 accent-black"
              />
              <span className="text-xs uppercase tracking-wider font-mono text-zinc-700">Set as default billing address</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-zinc-200">
            <button
              type="submit"
              disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
              className="bg-zinc-950 text-white text-xs px-6 py-2.5 hover:bg-zinc-800 transition-colors uppercase tracking-widest font-mono"
            >
              {createAddressMutation.isPending || updateAddressMutation.isPending ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-zinc-300 text-zinc-700 text-xs px-6 py-2.5 hover:bg-zinc-100 transition-colors uppercase tracking-widest font-mono"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address: Address) => (
            <div
              key={address.id}
              className={`border p-6 flex flex-col justify-between ${
                address.isDefaultShipping || address.isDefaultBilling ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 bg-white'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono tracking-widest uppercase bg-zinc-200 text-zinc-700 px-2 py-0.5">
                      {address.type}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {address.isDefaultShipping && (
                      <span className="text-[10px] uppercase tracking-wider font-mono bg-zinc-950 text-white px-2 py-0.5">
                        Default Shipping
                      </span>
                    )}
                    {address.isDefaultBilling && (
                      <span className="text-[10px] uppercase tracking-wider font-mono border border-zinc-900 text-zinc-900 px-2 py-0.5">
                        Default Billing
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-zinc-900">{address.fullName}</h4>
                  {address.company && <p className="text-xs text-zinc-500">{address.company}</p>}
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                    {address.city}
                    {address.district && `, ${address.district}`}
                    {`, ${address.state}`}
                  </p>
                  <p className="text-xs text-zinc-600 font-mono">
                    {address.postalCode}, {address.country}
                  </p>
                  {address.landmark && (
                    <p className="text-[11px] text-zinc-400 italic">Landmark: {address.landmark}</p>
                  )}
                  <p className="text-xs text-zinc-500 font-mono mt-1">Phone: {address.phone}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-6 border-t border-zinc-100 mt-6">
                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="flex items-center gap-1.5 text-zinc-600 hover:text-black text-xs uppercase tracking-wider font-mono"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address.id)}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-red-600 text-xs uppercase tracking-wider font-mono"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>

                {/* Default actions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {!address.isDefaultShipping && (
                    <button
                      onClick={() => handleSetDefault(address.id, 'shipping')}
                      className="text-[10px] text-zinc-500 hover:text-black uppercase tracking-wider font-mono border border-zinc-200 px-2 py-1 hover:border-black transition-colors"
                    >
                      Set Shipping Default
                    </button>
                  )}
                  {!address.isDefaultBilling && (
                    <button
                      onClick={() => handleSetDefault(address.id, 'billing')}
                      className="text-[10px] text-zinc-500 hover:text-black uppercase tracking-wider font-mono border border-zinc-200 px-2 py-1 hover:border-black transition-colors"
                    >
                      Set Billing Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-zinc-200 p-12 text-center bg-zinc-50/50">
          <MapPin className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-600 text-sm">No saved addresses found.</p>
          <p className="text-zinc-400 text-xs mt-1">Add a new delivery address to expedite your checkout process.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 inline-flex items-center gap-2 bg-zinc-950 text-white text-xs px-4 py-2 hover:bg-zinc-800 transition-colors uppercase tracking-widest font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
