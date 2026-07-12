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
      <div className="border border-zinc-200 p-8 text-center bg-zinc-50">
        <p className="text-zinc-600 text-sm">Failed to retrieve profile details.</p>
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
    <div className="space-y-12 py-4">
      {/* Editorial Header */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          Personal Profile
        </span>
        <h2 className="font-serif text-3xl font-normal text-zinc-900">
          Account Details
        </h2>
        <p className="text-sm text-zinc-500 max-w-xl font-light leading-relaxed">
          Maintain your contact details, select language preferences, and manage your newsletter subscriptions below.
        </p>
      </div>

      <hr className="border-zinc-200" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {feedback && (
          <div className={`p-4 text-xs font-mono border ${
            feedback.type === 'success' 
              ? 'bg-zinc-50 border-zinc-800 text-zinc-800' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="font-serif text-sm text-zinc-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="font-serif text-sm text-zinc-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email (Read-Only) */}
          <div className="flex flex-col gap-2">
            <label className="font-serif text-sm text-zinc-400">Email Address (Managed by Identity)</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-zinc-50 border border-zinc-100 px-4 py-3 font-sans text-sm text-zinc-400 cursor-not-allowed outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-serif text-sm text-zinc-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dateOfBirth" className="font-serif text-sm text-zinc-700">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
            />
          </div>

          {/* Preferred Language */}
          <div className="flex flex-col gap-2">
            <label htmlFor="preferredLanguage" className="font-serif text-sm text-zinc-700">Preferred Language</label>
            <select
              id="preferredLanguage"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        {/* Checkbox toggles */}
        <div className="space-y-4 pt-4 border-t border-zinc-100">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="newsletterSubscribed"
              checked={formData.newsletterSubscribed}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${
              formData.newsletterSubscribed 
                ? 'bg-zinc-900 border-zinc-900 text-white' 
                : 'border-zinc-350 bg-white group-hover:border-zinc-800'
            }`}>
              {formData.newsletterSubscribed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="text-sm font-light text-zinc-650 select-none">
              <span className="font-serif text-zinc-800 block font-medium">Subscribe to journal newsletters</span>
              Receive weekly journals on craftsmanship, new collections, and workshop schedules.
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${
              formData.marketingConsent 
                ? 'bg-zinc-900 border-zinc-900 text-white' 
                : 'border-zinc-350 bg-white group-hover:border-zinc-800'
            }`}>
              {formData.marketingConsent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="text-sm font-light text-zinc-650 select-none">
              <span className="font-serif text-zinc-800 block font-medium">Marketing consent</span>
              I agree to receive personalized updates, recommendations, and curated studio announcements.
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-6 py-4 border border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfileMutation.isPending ? 'Saving details...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
