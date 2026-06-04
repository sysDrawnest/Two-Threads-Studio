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
    <>
      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="md:hidden bg-[#fef8f3] text-[#1d1b19] font-sans overflow-x-hidden">
        <main className="min-h-screen flex flex-col items-center">
          {/* Banner Image */}
          <section className="w-full h-48 relative overflow-hidden">
            <img alt="Detailed textile embroidery macro shot showing artisanal gray threading on warm linen." className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlg4PrBPPW6Yq1kmFVAZTbXfQOAuu1uPikYMXlSNzKUHMYq6UkqHbEeXSdBbquqxrAi54RtZZ7IVOvIPBtT6LpQXyg8Jc-iw7J-ewYkWuqpvk9FMdGmxg9KuYk9CveRpSiKq9Zm_-BG5Zo1n6SitUwb5qcuNLmiOs14X_noihfUCDz4cWbNQSWrbJU-VrI_KlbW0G9a59LzviutkjMA-d7BlMTonTFcKAK8qoMHN2u77Uit2Ea8wFGsx8qr9xW0RNOQVaNe3G9rVFh" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fef8f3] via-transparent to-transparent opacity-60"></div>
          </section>

          {/* Identity & Header */}
          <header className="w-full pt-8 pb-4 px-[20px] text-center animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ animationDelay: '0.1s' }}>
            <h1 className="font-sans text-[12px] font-medium tracking-[0.25em] uppercase text-[#17110c]">TWOTHREADS STUDIO</h1>
            <div className="mt-6 border-b border-dotted border-[#d2c4bc] w-1/4 mx-auto"></div>
          </header>

          {/* Form Container */}
          <section className="w-full max-w-md px-[20px] mt-12 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <h2 className="font-serif text-[30px] font-normal leading-[1.2] text-[#2d2520] mb-10 text-center">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
              {error && (
                <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] p-4 font-sans text-[14px]">
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div className="flex flex-col space-y-2 group">
                <label className="font-sans text-[11px] font-medium tracking-[0.15em] text-[#4e4540] uppercase" htmlFor="mobile-username">
                  Username
                </label>
                <div className="border-b border-[#d2c4bc] focus-within:border-[#735947] focus-within:border-b-2 transition-all duration-300">
                  <input 
                    className="w-full bg-transparent border-none p-0 pb-2 focus:ring-0 text-[#17110c] font-sans text-[16px] placeholder:text-[#d1c4bd]" 
                    id="mobile-username" 
                    name="username" 
                    placeholder="Artisan ID or Email" 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-2 group">
                <div className="flex justify-between items-baseline">
                  <label className="font-sans text-[11px] font-medium tracking-[0.15em] text-[#4e4540] uppercase" htmlFor="mobile-password">
                    Password
                  </label>
                </div>
                <div className="border-b border-[#d2c4bc] focus-within:border-[#735947] focus-within:border-b-2 transition-all duration-300 relative flex items-center">
                  <input 
                    className="w-full bg-transparent border-none p-0 pb-2 focus:ring-0 text-[#17110c] font-sans text-[16px] placeholder:text-[#d1c4bd]" 
                    id="mobile-password" 
                    name="password" 
                    placeholder="••••••••" 
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-0 bottom-2 bg-transparent border-none cursor-pointer text-[#4e4540]"
                  >
                    {showPw ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" /><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" /></svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between font-sans text-[11px] font-medium tracking-wider">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    className="h-4 w-4 border-[#d1c4bd] text-[#735947] rounded-none focus:ring-offset-[#fef8f3] focus:ring-[#735947] transition-colors bg-transparent" 
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span className="text-[#4e4540] group-hover:text-[#17110c] transition-colors">REMEMBER ME</span>
                </label>
                <Link to="/auth/forgot-password" className="text-[#735947] hover:text-[#17110c] transition-colors border-b border-transparent hover:border-[#735947] no-underline">FORGOT PASSWORD?</Link>
              </div>

              {/* CTA */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2d2520] text-[#fef8f3] py-5 font-sans text-[14px] font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#735947] active:scale-[0.98] disabled:opacity-60 flex justify-center items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    SIGNING IN...
                  </>
                ) : 'SIGN IN'}
              </button>

              <div className="mt-4 text-center">
                <Link to="/auth/signup" className="font-sans text-[11px] font-medium tracking-[0.15em] uppercase text-[#735947] hover:text-[#17110c] border-b border-transparent hover:border-[#735947] no-underline transition-colors">
                  CREATE AN ACCOUNT
                </Link>
              </div>
            </form>
          </section>
        </main>
      </div>

      {/* ---------------- DESKTOP VIEW ---------------- */}
      <div className="hidden md:block">
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
      </div>
    </>
  );
};

export default Login;
