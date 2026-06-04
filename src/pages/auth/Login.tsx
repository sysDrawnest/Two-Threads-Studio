import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const result = await login(email, password);
    if (result.success) {
      // Route to admin if admin user
      if (email === 'admin@twothreads.com') {
        navigate('/admin');
      } else {
        const redirectPath = searchParams.get('redirect') || '/account';
        navigate(redirectPath);
      }
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to your TwoThreads account."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {error && (
          <div className="bg-error-container border border-error/30 text-error p-4 font-sans text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Email Address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent font-sans text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent font-sans text-sm pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-on-surface-variant"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" /><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" /></svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 accent-primary-container"
            />
            <span className="font-sans text-xs text-on-surface-variant">Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="font-sans text-xs text-on-secondary-container hover:text-primary-container transition-colors no-underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-container text-inverse-on-surface py-4 font-sans text-sm tracking-[0.15em] uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : 'Sign In'}
        </button>

        <p className="font-sans text-sm text-on-surface-variant text-center mt-4">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-on-secondary-container hover:text-primary-container transition-colors no-underline underline">
            Create one
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-4 p-4 bg-surface-container border border-outline-variant font-sans text-xs text-on-surface-variant space-y-1">
          <p className="font-semibold text-primary-container mb-1">Demo Credentials:</p>
          <p>Customer: julia@example.com / password123</p>
          <p>Admin: admin@twothreads.com / admin123</p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
