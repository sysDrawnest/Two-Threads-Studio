import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <div className="flex flex-col items-center text-center gap-6 py-8">
          <div className="w-16 h-16 bg-surface-container flex items-center justify-center">
            <svg width="32" height="32" fill="none" stroke="#2d2520" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="font-serif text-2xl text-primary-container">Check your inbox.</h2>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            We sent a password reset link to <strong className="text-primary-container">{email}</strong>. 
            It may take a few minutes to arrive.
          </p>
          <Link to="/auth/login" className="font-sans text-sm text-on-secondary-container hover:text-primary-container transition-colors no-underline underline">
            ← Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent font-sans text-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary-container text-inverse-on-surface py-4 font-sans text-sm tracking-[0.15em] uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors disabled:opacity-60 flex items-center justify-center gap-3 mt-2">
            {isLoading ? <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending...</> : 'Send Reset Link'}
          </button>
          <Link to="/auth/login" className="font-sans text-sm text-on-surface-variant text-center hover:text-primary-container no-underline underline transition-colors">
            ← Back to Sign In
          </Link>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
