import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      navigate('/account');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        .signup-container {
          min-height: 100vh;
          background-color: #fef8f3;
          background-image: radial-gradient(circle at 25% 40%, rgba(210, 188, 172, 0.03) 2%, transparent 2.5%),
                            radial-gradient(circle at 75% 85%, rgba(115, 89, 71, 0.02) 1.5%, transparent 2%);
          background-size: 40px 40px, 60px 60px;
        }
        
        @keyframes slideUpFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-field-animate {
          animation: slideUpFadeIn 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
          opacity: 0;
        }
        
        .form-field-animate:nth-child(1) { animation-delay: 0.05s; }
        .form-field-animate:nth-child(2) { animation-delay: 0.10s; }
        .form-field-animate:nth-child(3) { animation-delay: 0.15s; }
        .form-field-animate:nth-child(4) { animation-delay: 0.20s; }
        .form-field-animate:nth-child(5) { animation-delay: 0.25s; }
        .form-field-animate:nth-child(6) { animation-delay: 0.30s; }
        
        @keyframes gentleScale {
          0% { transform: scale(1); }
          50% { transform: scale(0.99); }
          100% { transform: scale(1); }
        }
        
        .btn-tap-effect:active {
          transform: scale(0.99);
          background-color: #4a3020 !important;
        }
        
        @media (max-width: 768px) {
          .signup-container {
            background-attachment: fixed;
          }
        }
      `}</style>

      {/* Editorial Image Banner */}
      <div className="relative w-full h-[180px] md:hidden overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1610632380989-680f4087ce5c?w=800&h=400&fit=crop')`,
            backgroundPosition: 'center 35%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fef8f3]/20 via-[#fef8f3]/40 to-[#fef8f3]/90" />

        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #735947 0px, #735947 2px, transparent 2px, transparent 8px)`
        }} />
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-8 md:py-12">
        {/* Brand Header */}
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="font-['Inter',sans-serif] text-[11px] tracking-[0.25em] uppercase text-[#735947] mb-4 font-light">
            TwoThreads Studio
          </h1>

          <div className="border-t border-dotted border-[#d2c4bc] w-16 mx-auto mb-6" style={{ borderTopWidth: '2px' }} />

          <h2 className="font-['Cormorant_Garamond',serif] text-[30px] font-light text-[#2d2520] tracking-wide mb-2">
            Begin your journey.
          </h2>
          <p className="font-['Inter',sans-serif] text-[13px] text-[#735947] font-light tracking-wide">
            Join the TwoThreads artisan community.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          {error && (
            <div className="bg-[#fde8e8] border border-[#b53a2e]/30 text-[#b53a2e] p-4 font-['Inter',sans-serif] text-sm rounded-sm form-field-animate">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="form-field-animate">
            <label htmlFor="name" className="block font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#735947] mb-2 font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pb-3 pt-1 border-b border-[#d2c4bc] focus:border-b-2 focus:border-[#735947] focus:outline-none bg-transparent font-['Inter',sans-serif] text-[15px] text-[#2d2520] transition-all duration-300 placeholder:text-[#d2c4bc]"
              placeholder="Your name"
            />
          </div>

          {/* Email Field */}
          <div className="form-field-animate">
            <label htmlFor="email" className="block font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#735947] mb-2 font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pb-3 pt-1 border-b border-[#d2c4bc] focus:border-b-2 focus:border-[#735947] focus:outline-none bg-transparent font-['Inter',sans-serif] text-[15px] text-[#2d2520] transition-all duration-300 placeholder:text-[#d2c4bc]"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="form-field-animate">
            <label htmlFor="password" className="block font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#735947] mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pb-3 pt-1 border-b border-[#d2c4bc] focus:border-b-2 focus:border-[#735947] focus:outline-none bg-transparent font-['Inter',sans-serif] text-[15px] text-[#2d2520] transition-all duration-300 pr-10 placeholder:text-[#d2c4bc]"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-0 bottom-3 bg-transparent border-none cursor-pointer text-[#735947] hover:text-[#2d2520] transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-field-animate">
            <label htmlFor="confirmPassword" className="block font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#735947] mb-2 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pb-3 pt-1 border-b border-[#d2c4bc] focus:border-b-2 focus:border-[#735947] focus:outline-none bg-transparent font-['Inter',sans-serif] text-[15px] text-[#2d2520] transition-all duration-300 pr-10 placeholder:text-[#d2c4bc]"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(v => !v)}
                className="absolute right-0 bottom-3 bg-transparent border-none cursor-pointer text-[#735947] hover:text-[#2d2520] transition-colors"
                aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
              >
                {showConfirmPw ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-tap-effect w-full bg-[#2d2520] text-white py-4 font-['Inter',sans-serif] text-[12px] tracking-[0.2em] uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2 font-medium rounded-none"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : 'Create Account'}
          </button>

          {/* Login Link */}
          <p className="font-['Inter',sans-serif] text-[13px] text-[#735947] text-center mt-2 tracking-wide form-field-animate">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[#2d2520] hover:text-[#8b6f5c] transition-colors no-underline border-b border-[#2d2520] hover:border-[#8b6f5c] pb-[1px]">
              Sign in
            </Link>
          </p>

          {/* Accordion Demo Credentials */}
          <div className="form-field-animate mt-2">
            <button
              type="button"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full flex items-center justify-center gap-2 pt-4 border-t border-dotted border-[#d2c4bc] font-['Inter',sans-serif] text-[11px] tracking-[0.15em] uppercase text-[#8b6f5c] hover:text-[#735947] transition-colors"
            >
              <span>{isAccordionOpen ? '−' : '+'}</span>
              <span>Need test credentials?</span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAccordionOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="p-4 bg-[#f5f0eb] border border-[#e0d6ce] rounded-sm">
                <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-[#735947] mb-2 tracking-wide">Demo Signup:</p>
                <div className="space-y-1.5">
                  <p className="font-['Inter',sans-serif] text-[11px] text-[#5a3d2b] leading-relaxed">
                    Use any email and a password (min. 6 characters)
                  </p>
                  <p className="font-['Inter',sans-serif] text-[11px] text-[#5a3d2b] leading-relaxed">
                    Or try: <span className="font-medium">crafts@example.com</span> / craft123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;