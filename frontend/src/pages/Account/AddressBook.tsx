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
      <div className="py-24 text-center">
        <p className="text-neutral-500 text-sm font-sans">Failed to retrieve saved addresses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 relative">
        <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">
          Locations
        </span>
        <h2 className="font-serif text-3xl font-light text-[#1C1C1B]">
          Address Book
        </h2>
        
        {!isEditing && (
          <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 mt-6 md:mt-0">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 border-b border-[#1C1C1B] text-[#1C1C1B] text-[10px] uppercase tracking-widest font-sans pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Address
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-12">
          <div className="text-center border-b border-neutral-100 pb-4">
            <h3 className="font-serif text-xl text-[#1C1C1B]">
              {editingAddress ? 'Edit Address' : 'New Delivery Address'}
            </h3>
          </div>

          {serverError && (
            <div className="p-4 text-xs font-sans text-center text-rose-700 bg-rose-50/50">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Full Name */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
              {validationErrors.fullName && <p className="text-red-500 text-xs font-sans mt-2">{validationErrors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder={formData.country === 'IN' ? '10-digit number' : 'Include country code'}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
              {validationErrors.phone && <p className="text-red-500 text-xs font-sans mt-2">{validationErrors.phone}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Company (Optional)</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Address Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors appearance-none"
              >
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Line 1 */}
            <div className="md:col-span-2">
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
              {validationErrors.line1 && <p className="text-red-500 text-xs font-sans mt-2">{validationErrors.line1}</p>}
            </div>

            {/* Line 2 */}
            <div className="md:col-span-2">
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Apartment, Suite (Optional)</label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors appearance-none"
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="AE">United Arab Emirates</option>
              </select>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
              {validationErrors.postalCode && <p className="text-red-500 text-xs font-sans mt-2">{validationErrors.postalCode}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
              {validationErrors.city && <p className="text-red-500 text-xs font-sans mt-2">{validationErrors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">State / Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
              {validationErrors.state && <p className="text-red-500 text-xs font-sans mt-2">{validationErrors.state}</p>}
            </div>
            
            {/* Landmark */}
            <div className="md:col-span-2">
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Default switches */}
          <div className="space-y-6 pt-8">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isDefaultShipping}
                onChange={(e) => setFormData({ ...formData, isDefaultShipping: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-5 h-5 mt-0.5 flex items-center justify-center border transition-colors ${
                formData.isDefaultShipping 
                  ? 'bg-[#1C1C1B] border-[#1C1C1B] text-white' 
                  : 'border-neutral-300 bg-transparent group-hover:border-[#1C1C1B]'
              }`}>
                {formData.isDefaultShipping && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="font-sans text-sm text-neutral-600 leading-relaxed pt-0.5">Set as default shipping address</span>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isDefaultBilling}
                onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-5 h-5 mt-0.5 flex items-center justify-center border transition-colors ${
                formData.isDefaultBilling 
                  ? 'bg-[#1C1C1B] border-[#1C1C1B] text-white' 
                  : 'border-neutral-300 bg-transparent group-hover:border-[#1C1C1B]'
              }`}>
                {formData.isDefaultBilling && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="font-sans text-sm text-neutral-600 leading-relaxed pt-0.5">Set as default billing address</span>
            </label>
          </div>

          <div className="flex justify-center gap-6 pt-12">
            <button
              type="submit"
              disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
              className="px-8 py-3 bg-[#1C1C1B] border border-[#1C1C1B] text-[10px] font-sans uppercase tracking-widest text-white hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50"
            >
              {createAddressMutation.isPending || updateAddressMutation.isPending ? 'Saving...' : 'Save Location'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-3 border border-neutral-300 text-[10px] font-sans uppercase tracking-widest text-[#1C1C1B] hover:border-[#1C1C1B] transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {addresses.map((address: Address) => (
            <div
              key={address.id}
              className="bg-neutral-50/50 p-8 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-500">
                    {address.type}
                  </span>
                  
                  <div className="flex flex-col items-end gap-2">
                    {address.isDefaultShipping && (
                      <span className="text-[9px] uppercase tracking-widest font-sans text-[#1C1C1B]">
                        Default Shipping
                      </span>
                    )}
                    {address.isDefaultBilling && (
                      <span className="text-[9px] uppercase tracking-widest font-sans text-neutral-500">
                        Default Billing
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-xl text-[#1C1C1B]">{address.fullName}</h4>
                  {address.company && <p className="font-sans text-xs text-neutral-500">{address.company}</p>}
                  
                  <div className="font-sans text-sm text-neutral-600 leading-relaxed pt-2">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}
                      {address.district && `, ${address.district}`}
                      {`, ${address.state}`}
                    </p>
                    <p className="mt-1 text-neutral-400">
                      {address.postalCode}, {address.country}
                    </p>
                  </div>

                  {address.landmark && (
                    <p className="font-sans text-[11px] text-neutral-400 italic pt-2">Near {address.landmark}</p>
                  )}
                  <p className="font-sans text-xs text-neutral-500 pt-2">T: {address.phone}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-8">
                {/* Actions */}
                <div className="flex gap-6">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="border-b border-transparent hover:border-[#1C1C1B] text-[10px] font-sans uppercase tracking-widest text-neutral-500 hover:text-[#1C1C1B] transition-colors pb-0.5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address.id)}
                    className="border-b border-transparent hover:border-red-600 text-[10px] font-sans uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors pb-0.5"
                  >
                    Remove
                  </button>
                </div>

                {/* Default actions */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {!address.isDefaultShipping && (
                    <button
                      onClick={() => handleSetDefault(address.id, 'shipping')}
                      className="border-b border-neutral-300 hover:border-[#1C1C1B] text-[9px] font-sans uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors pb-0.5"
                    >
                      Make Shipping Default
                    </button>
                  )}
                  {!address.isDefaultBilling && (
                    <button
                      onClick={() => handleSetDefault(address.id, 'billing')}
                      className="border-b border-neutral-300 hover:border-[#1C1C1B] text-[9px] font-sans uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors pb-0.5"
                    >
                      Make Billing Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 space-y-6">
          <p className="font-serif text-xl italic text-neutral-400">You haven't added any addresses yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-block border-b border-[#1C1C1B] text-[#1C1C1B] text-[10px] uppercase tracking-widest font-sans pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
          >
            Add a New Location
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
