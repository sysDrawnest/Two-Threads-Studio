import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    navigate('/auth/login');
  };

  const inputCls = "w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent font-sans text-sm";
  const labelCls = "block font-sans text-xs uppercase tracking-widest text-primary-container mb-2";

  return (
    <AuthLayout title="Set a new password." subtitle="Enter your new password below to regain access.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <div className="bg-error-container border border-error/30 text-error p-4 font-sans text-sm">{error}</div>}

        <div>
          <label htmlFor="password" className={labelCls}>New Password</label>
          <div className="relative">
            <input id="password" type={showPw ? 'text' : 'password'} value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className={`${inputCls} pr-12`} placeholder="Min. 8 characters" required
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-on-surface-variant" aria-label="Toggle password">
              {showPw ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirm" className={labelCls}>Confirm New Password</label>
          <input id="confirm" type="password" value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            className={inputCls} placeholder="••••••••" required
          />
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-primary-container text-inverse-on-surface py-4 font-sans text-sm tracking-[0.15em] uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors disabled:opacity-60 flex items-center justify-center gap-3 mt-2">
          {isLoading ? <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Resetting...</> : 'Reset Password'}
        </button>
        <Link to="/auth/login" className="font-sans text-sm text-on-surface-variant text-center hover:text-primary-container no-underline underline transition-colors">← Back to Sign In</Link>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
