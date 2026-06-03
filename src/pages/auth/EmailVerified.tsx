import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';

const EmailVerified: React.FC = () => (
  <AuthLayout title="You're verified!" subtitle="Your email has been successfully confirmed.">
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div className="w-20 h-20 bg-[#e8f4e8] flex items-center justify-center">
        <svg width="40" height="40" fill="none" stroke="#3a6b3a" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
      </div>
      <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-xs">
        Welcome to TwoThreads Studio. Your account is now active and you can start exploring our kits and tutorials.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
        <Link to="/auth/login" className="flex-1 text-center bg-primary-container text-inverse-on-surface py-4 font-sans text-sm tracking-[0.15em] uppercase hover:bg-[#5a3d2b] transition-colors no-underline">
          Sign In
        </Link>
        <Link to="/shop" className="flex-1 text-center bg-transparent text-primary-container border border-primary-container py-4 font-sans text-sm tracking-[0.15em] uppercase hover:bg-surface-variant transition-colors no-underline">
          Explore Shop
        </Link>
      </div>
    </div>
  </AuthLayout>
);

export default EmailVerified;
