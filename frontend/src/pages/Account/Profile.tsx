import React, { useState, useEffect } from 'react';
import { useProfile, useUpdateProfile } from '../../hooks/useProfile';
import LoadingSkeleton from './LoadingSkeleton';
import { Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    preferredLanguage: 'en',
    newsletterSubscribed: false,
    marketingConsent: false,
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        preferredLanguage: profile.preferredLanguage || 'en',
        newsletterSubscribed: profile.newsletterSubscribed || false,
        marketingConsent: profile.marketingConsent || false,
      });
    }
  }, [profile]);

  if (isLoading) return <LoadingSkeleton />;

  if (error || !profile) {
    return (
      <div className="py-24 text-center">
        <p className="text-neutral-500 text-sm font-sans">Failed to retrieve profile details.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      await updateProfileMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        preferredLanguage: formData.preferredLanguage,
        newsletterSubscribed: formData.newsletterSubscribed,
        marketingConsent: formData.marketingConsent,
      });
      setFeedback({ type: 'success', message: 'Your profile changes have been saved.' });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">
          Personal Profile
        </span>
        <h2 className="font-serif text-3xl font-light text-[#1C1C1B]">
          Identity
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-12">
        {feedback && (
          <div className={`p-4 text-xs font-sans text-center ${
            feedback.type === 'success' 
              ? 'text-emerald-700 bg-emerald-50/50' 
              : 'text-rose-700 bg-rose-50/50'
          }`}>
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Email (Read-Only) */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">Email (Managed)</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-neutral-400 outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91"
              className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dateOfBirth" className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors"
            />
          </div>

          {/* Preferred Language */}
          <div className="flex flex-col gap-2">
            <label htmlFor="preferredLanguage" className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">Language</label>
            <select
              id="preferredLanguage"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-neutral-200 py-2 font-serif text-lg text-[#1C1C1B] focus:border-[#1C1C1B] outline-none transition-colors appearance-none"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        {/* Checkbox toggles */}
        <div className="space-y-6 pt-8">
          <label className="flex items-start gap-4 cursor-pointer group">
            <input
              type="checkbox"
              name="newsletterSubscribed"
              checked={formData.newsletterSubscribed}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-5 h-5 mt-1 flex items-center justify-center border transition-colors ${
              formData.newsletterSubscribed 
                ? 'bg-[#1C1C1B] border-[#1C1C1B] text-white' 
                : 'border-neutral-300 bg-transparent group-hover:border-[#1C1C1B]'
            }`}>
              {formData.newsletterSubscribed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="font-sans text-sm text-neutral-500 leading-relaxed">
              <span className="font-serif text-lg text-[#1C1C1B] block mb-1">Journal Newsletter</span>
              Receive weekly journals on craftsmanship, new collections, and workshop schedules.
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-12 text-center">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-8 py-3 border border-[#1C1C1B] text-[10px] font-sans uppercase tracking-widest text-[#1C1C1B] hover:bg-[#1C1C1B] hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Update Identity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
