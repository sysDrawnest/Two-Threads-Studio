import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import bgPc from '../../assets/Authentication page pc .jpeg';
import bgMobile from '../../assets/Authentication page mobile.jpeg';

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

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 md:p-8 overflow-hidden font-sans">
      
      {/* Top Right Home Link */}
      <div className="absolute top-6 right-6 z-30">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#5c4a3e] hover:text-[#1d1b19] font-serif text-xs font-semibold tracking-wider uppercase backdrop-blur-md border border-[#d2c4bc]/60 shadow-md transition-all hover:shadow-lg hover:-translate-y-[1px]"
        >
          <span>Home</span>
          <Home className="w-3.5 h-3.5 text-[#8b6f5c]" />
        </Link>
      </div>

      {/* Responsive Background — Mobile */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ 
          backgroundImage: `url(${bgMobile})`,
        }}
      >
        <div className="absolute inset-0 bg-[#fef8f3]/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef8f3]/30 to-[#1d1b19]/20"></div>
      </div>

      {/* Responsive Background — PC / Desktop */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ 
          backgroundImage: `url(${bgPc})`,
        }}
      >
        <div className="absolute inset-0 bg-[#fef8f3]/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef8f3]/30 to-[#1d1b19]/20"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center max-w-4xl w-full mx-auto">
        
        {/* Luxury Brand Welcome Banner (Desktop Left Card — Square Layout) */}
        <div className="hidden lg:flex flex-col justify-center items-center w-[250px] h-[250px] bg-[#FAF8F5]/95 border border-[#d2c4bc] rounded-xl p-6 shadow-xl relative z-20 -mr-6 my-auto flex-shrink-0">
          <div className="space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[#f4ece4] border border-[#d2c4bc] flex items-center justify-center text-[#8b6f5c] mx-auto shadow-inner">
              ✨
            </div>
            <h3 className="font-serif text-[20px] leading-snug text-[#5c4a3e] font-semibold italic">
              "Every stitch<br />has a story."
            </h3>
          </div>
        </div>

        {/* Glassmorphism Signup Modal */}
        <div className="relative w-[92%] sm:w-full max-w-[480px] bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl rounded-xl py-6 px-5 sm:p-8 md:p-12 z-10 overflow-hidden">
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

          {/* Graphic: Needle and Thread */}
          <div className="relative h-10 sm:h-16 w-full mb-1 sm:mb-4 pointer-events-none flex items-center justify-center">
             <svg width="100%" height="100%" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 top-[-20px]">
               <path 
                 d="M30 70 C 60 10, 140 10, 160 50 C 180 90, 260 90, 270 30" 
                 stroke="#d4af37" 
                 strokeWidth="1.5" 
                 fill="none" 
                 className="animate-pulse"
                 style={{ filter: 'drop-shadow(0px 2px 4px rgba(212,175,55,0.3))' }}
               />
               <g className="animate-oscillate" style={{ transformOrigin: '35px 65px' }}>
                 <path d="M25 80 L 45 35 L 47 36 L 27 81 Z" fill="#7f756f" />
                 <path d="M45 35 L 55 15 C 57 11, 52 10, 50 14 L 47 36 Z" fill="#a3968e" />
                 <ellipse cx="51" cy="20" rx="1" ry="4" fill="#f5f0eb" transform="rotate(-25 51 20)" />
               </g>
             </svg>
          </div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 relative z-10">
            <h2 className="font-serif text-[22px] sm:text-[28px] leading-tight text-[#8b6f5c] font-medium drop-shadow-sm mb-2">
              Create your<br/>Studio Account
            </h2>
            <p className="font-sans text-xs text-[#78675c] italic">
              "Every stitch has a story."
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 relative z-10">
            {error && (
              <p className="text-[#a83232] text-xs text-center bg-[#fdf0f0] border border-[#f5c6c6] py-2 px-3 rounded-md font-sans shadow-sm">
                {error}
              </p>
            )}
            
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1 sm:gap-1.5 relative group">
                <label htmlFor="name" className="font-serif text-[13px] sm:text-[14px] text-[#5c544d] ml-1">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="animate-glow-pulse w-full bg-[#FAF8F5] border border-[#d2c4bc] rounded-none px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-sm text-[#1d1b19] placeholder:text-[#a3968e] transition-all shadow-inner"
                  placeholder="Full Name"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1 sm:gap-1.5 relative group">
                <label htmlFor="email" className="font-serif text-[13px] sm:text-[14px] text-[#5c544d] ml-1">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="animate-glow-pulse w-full bg-[#FAF8F5] border border-[#d2c4bc] rounded-none px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-sm text-[#1d1b19] placeholder:text-[#a3968e] transition-all shadow-inner"
                  placeholder="Email Address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Password */}
                <div className="flex flex-col gap-1 sm:gap-1.5 relative group">
                  <label htmlFor="password" className="font-serif text-[13px] sm:text-[14px] text-[#5c544d] ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPw ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="animate-glow-pulse w-full bg-[#FAF8F5] border border-[#d2c4bc] rounded-none px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-sm text-[#1d1b19] placeholder:text-[#a3968e] transition-all shadow-inner pr-10"
                      placeholder="Password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPw(!showPw)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3968e] hover:text-[#8b6f5c] transition-colors p-1"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1 sm:gap-1.5 relative group">
                  <label htmlFor="confirmPassword" className="font-serif text-[13px] sm:text-[14px] text-[#5c544d] ml-1">Confirm</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPw ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="animate-glow-pulse w-full bg-[#FAF8F5] border border-[#d2c4bc] rounded-none px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-sm text-[#1d1b19] placeholder:text-[#a3968e] transition-all shadow-inner pr-10"
                      placeholder="Confirm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPw(!showConfirmPw)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3968e] hover:text-[#8b6f5c] transition-colors p-1"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-1 sm:mt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-[#fef8f3] py-3 sm:py-4 rounded-none font-sans text-[13px] tracking-widest uppercase shadow-md transition-all border-none ${
                  isLoading 
                    ? 'animate-shimmer cursor-wait' 
                    : 'bg-[#3b3a38] hover:bg-[#2a2927] hover:shadow-lg hover:-translate-y-[1px]'
                }`}
                style={isLoading ? {
                  background: 'linear-gradient(to right, #3b3a38 20%, #5c544d 50%, #3b3a38 80%)',
                  backgroundSize: '200% auto'
                } : {}}
              >
                Join the Guild
              </button>
              
              <div className="text-center mt-3 sm:mt-5">
                <p className="font-sans text-[13px] text-[#5c544d]">
                  Already have an account? <Link to={`/auth/login?redirect=${encodeURIComponent(redirectPath)}`} className="hover:underline text-[#8b6f5c] font-semibold transition-colors">Log In</Link>
                </p>
              </div>
            </div>
          </form>
        </div>


      </div>

    </div>
  );
};

export default Signup;