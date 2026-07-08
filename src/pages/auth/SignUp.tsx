import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
  const { signup, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = await signup(formData.email, formData.password, formData.name);
    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  const handleGuest = () => {
    navigate('/'); 
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#FBFBFA]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`
      }}
    >
      {/* Decorative background threads */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100 200 C 300 100, 400 600, 1200 400" fill="none" stroke="#A34A38" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M-50 250 C 350 150, 450 650, 1250 450" fill="none" stroke="#1C1C1B" strokeWidth="0.5" />
      </svg>

      <div className="relative w-full max-w-[420px] z-10 flex flex-col items-center">
        {/* Main Asymmetric Floating Frame Container */}
        <div className="relative w-full bg-white p-8 md:p-10 border border-[#1C1C1B] shadow-sm before:absolute before:inset-0 before:border before:border-[#A34A38] before:translate-x-1.5 before:translate-y-1.5 before:-z-10 rounded-sm">
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <Link to="/" className="font-serif text-[24px] tracking-wide text-[#1C1C1B] hover:text-neutral-500 mb-1">
              TwoThreads Studio
            </Link>
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-neutral-400">Honoring Slow Craft</span>
            <h2 className="font-serif text-2xl font-light text-[#1C1C1B] mt-6">Create an Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <p className="text-[#A34A38] text-xs text-center bg-rose-50 border border-rose-100 py-2.5 px-3 rounded-sm font-sans">
                {error}
              </p>
            )}
            
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#FBFBFA] border border-neutral-200 focus:border-[#A34A38] focus:ring-0 outline-none px-3.5 py-2.5 font-sans text-sm text-[#1C1C1B] transition-colors rounded-sm"
                  placeholder="Julia Hampton"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#FBFBFA] border border-neutral-200 focus:border-[#A34A38] focus:ring-0 outline-none px-3.5 py-2.5 font-sans text-sm text-[#1C1C1B] transition-colors rounded-sm"
                  placeholder="julia@example.com"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Password</label>
                <div className="relative">
                  <input 
                    type={showPw ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#FBFBFA] border border-neutral-200 focus:border-[#A34A38] focus:ring-0 outline-none px-3.5 py-2.5 font-sans text-sm text-[#1C1C1B] transition-colors rounded-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#A34A38] transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPw ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#FBFBFA] border border-neutral-200 focus:border-[#A34A38] focus:ring-0 outline-none px-3.5 py-2.5 font-sans text-sm text-[#1C1C1B] transition-colors rounded-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPw(!showConfirmPw)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#A34A38] transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1C1C1B] text-[#FAF9F7] py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors border-none rounded-sm shadow-sm font-semibold"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up for the Studio'}
              </button>
              
              <div className="text-center mt-5">
                <p className="font-sans text-xs text-neutral-500">
                  Already have an account? <Link to={`/auth/login?redirect=${encodeURIComponent(redirectPath)}`} className="hover:underline text-[#A34A38] font-medium">Log In</Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Back / Guest Access link */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="font-sans text-xs tracking-wider uppercase text-neutral-500 hover:text-[#1C1C1B] transition-colors underline underline-offset-4 decoration-neutral-300"
          >
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;