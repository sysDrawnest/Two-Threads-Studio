import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
    <div className="w-24 h-24 bg-error-container flex items-center justify-center mb-8">
      <svg width="40" height="40" fill="none" stroke="#ba1a1a" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round"/><circle cx="12" cy="16" r="0.5" fill="#ba1a1a"/></svg>
    </div>
    <h1 className="font-serif text-4xl md:text-5xl text-primary-container mb-4">Access Denied</h1>
    <p className="font-sans text-sm text-on-surface-variant leading-loose max-w-md mb-10">
      You don't have permission to view this page. If you believe this is an error, please contact the studio team.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Link to="/" className="bg-primary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase hover:bg-[#5a3d2b] transition-colors no-underline">
        Return Home
      </Link>
      <Link to="/auth/login" className="bg-transparent text-primary-container border border-primary-container px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase hover:bg-surface-variant transition-colors no-underline">
        Sign In
      </Link>
    </div>
  </div>
);

export default AccessDenied;
