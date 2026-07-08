import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
  const { signup, isLoading, isAuthenticated } = useAuth();
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

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
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
      navigate('/account');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  const handleGuest = () => {
    navigate('/'); 
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: '#052345',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E"), repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 6px)`
      }}
    >
      <div className="relative w-full max-w-[380px] z-10 flex flex-col md:flex-row items-center justify-center">
        
        {/* Main Card */}
        <div className="bg-[#fcfaf7] shadow-2xl p-8 md:p-10 relative z-10 w-full flex flex-col">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2c2c2c" strokeWidth="1.2" className="mb-2">
              {/* Abstract loom/thread logo */}
              <rect x="5" y="4" width="14" height="16" strokeLinecap="square" />
              <path d="M5 8h14M5 12h14M5 16h14" />
              <path d="M8 2v20M12 2v20M16 2v20" stroke="#903432" strokeWidth="0.8" strokeDasharray="2 2" />
            </svg>
            <h1 className="font-serif text-[18px] tracking-[0.1em] text-[#2c2c2c] uppercase text-center font-medium leading-tight">
              TwoThreads<br/>Studio
            </h1>
            <p className="font-serif text-[22px] text-[#2c2c2c] mt-4 tracking-wide font-normal">Create an Account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-8">
            {error && <p className="text-[#903432] text-sm text-center bg-[#903432]/10 py-2">{error}</p>}
            
            <div className="flex flex-col gap-5">
              <div className="relative group">
                <label className="font-serif text-[14px] text-[#9a6345] mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-[#903432] py-1 text-[#2c2c2c] focus:ring-0 focus:border-b-2 outline-none font-sans text-lg"
                  placeholder="Your Name"
                />
              </div>

              <div className="relative group">
                <label className="font-serif text-[14px] text-[#9a6345] mb-1 block">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-[#903432] py-1 text-[#2c2c2c] focus:ring-0 focus:border-b-2 outline-none font-sans text-lg"
                  placeholder="user@example.com"
                />
              </div>

              <div className="relative group">
                <label className="font-serif text-[14px] text-[#9a6345] mb-1 block">Password</label>
                <div className="relative">
                  <input 
                    type={showPw ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b border-[#903432] py-1 text-[#2c2c2c] focus:ring-0 focus:border-b-2 outline-none font-sans text-lg pr-8 tracking-widest"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 bottom-2 text-[#903432]">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
              </div>

              <div className="relative group">
                <label className="font-serif text-[14px] text-[#9a6345] mb-1 block">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPw ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b border-[#903432] py-1 text-[#2c2c2c] focus:ring-0 focus:border-b-2 outline-none font-sans text-lg pr-8 tracking-widest"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-0 bottom-2 text-[#903432]">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#903432] text-white py-3.5 font-serif text-[18px] tracking-wide hover:bg-[#7a2b29] transition-colors border-none"
              >
                {isLoading ? 'signing up...' : 'sign up for the studio'}
              </button>
              <div className="text-center mt-5">
                <p className="font-sans text-[13px] text-[#2c2c2c]">
                  Already have an account? <Link to="/auth/login" className="hover:underline text-[#2c2c2c] font-medium">Log In</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
        
        {/* Guest Tag (Desktop) */}
        <div 
          onClick={handleGuest}
          className="hidden md:flex absolute -right-32 top-[55%] -translate-y-1/2 w-32 flex-col items-center rotate-[8deg] drop-shadow-xl z-0 hover:rotate-[12deg] transition-all cursor-pointer group origin-top-left"
        >
          {/* String */}
          <svg className="absolute -top-16 -left-10 w-24 h-24 pointer-events-none" viewBox="0 0 100 100">
            <path d="M 0,10 Q 40,20 50,80" fill="none" stroke="#e0c7a5" strokeWidth="2.5" strokeDasharray="3 1" />
            <path d="M 5,15 Q 45,25 55,80" fill="none" stroke="#c09a72" strokeWidth="1.5" />
          </svg>
          
          <div 
            className="w-full bg-[#c8a47e] shadow-lg p-4 flex flex-col items-center text-[#3b2513] group-hover:bg-[#d0b08d] transition-colors"
            style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)' }}
          >
            <div className="w-4 h-4 rounded-full bg-[#052345] shadow-inner mt-1 mb-3 ring-2 ring-[#e6c19a]/40 border border-[#a67c52]"></div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-center border-b border-[#3b2513]/20 w-full pb-2 mb-2">Guest Access Pass</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b2513" strokeWidth="1" strokeLinecap="square" className="mb-2 opacity-60">
              <rect x="5" y="4" width="14" height="16" />
              <path d="M5 8h14M5 12h14M5 16h14" />
            </svg>
            <span className="text-[9px] font-sans font-medium text-center leading-tight mb-3 text-[#3b2513]/80 uppercase tracking-widest">Browse the collection<br/>as a guest.</span>
            <button className="bg-[#903432] text-white text-[9px] font-sans uppercase tracking-widest py-1.5 px-3 w-full border-none">Enter as Guest</button>
          </div>
        </div>

        {/* Mobile Guest Tag text */}
        <div className="md:hidden mt-8 text-center text-white/80 font-serif text-lg tracking-wide z-10 w-full">
           <Link to="/" className="underline decoration-white/50 underline-offset-4 hover:text-white transition-colors">Continue as Guest</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;