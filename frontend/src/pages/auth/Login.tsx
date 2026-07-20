import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bgImage from '../../assets/login,signup.png';

const Login: React.FC = () => {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    console.log('--- FRONTEND LOGIN PAYLOAD ---');
    console.log({ email, password, length: password.length });
    console.log('------------------------------');

    const result = await login(email, password);
    if (result.success) {
      if (email === 'admin@twothreads.com') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleGuest = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 md:p-8 overflow-hidden font-sans">
      
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat animate-bg-drift"
        style={{ 
          // High-resolution placeholder for macro embroidery/fabric texture
          backgroundImage: `url(${bgImage})`,
          filter: 'contrast(1.1) brightness(0.9) saturate(1.2)'
        }}
      >
        {/* Subtle overlay to ensure text readability while keeping the gold/cream vibe */}
        <div className="absolute inset-0 bg-[#fef8f3]/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef8f3]/30 to-[#1d1b19]/20"></div>
      </div>

      {/* Main Container for Tag + Modal to manage positioning */}
      <div className="relative z-10 flex items-center justify-center max-w-4xl w-full mx-auto">
        
        {/* Floating Guest Access Pass Tag (Positioned absolutely relative to the flex container or modal) */}
        <div className="absolute left-4 md:left-[10%] lg:left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center select-none group">
          {/* Connecting String SVG */}
          <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-[85px] left-[55%] -translate-x-1/2 -z-10 opacity-70">
            <path d="M50 0 C 40 40, 10 60, 20 100" stroke="#a3968e" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          </svg>
          
          {/* Tag Body */}
          <div 
            onClick={handleGuest}
            className="guest-tag-ripple w-[160px] bg-[#FAF8F5] border border-[#d2c4bc] rounded-b-md rounded-t-sm shadow-lg flex flex-col items-center pt-3 pb-6 px-4 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative before:absolute before:content-[''] before:w-full before:h-full before:top-0 before:left-0 before:bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] before:opacity-40 before:pointer-events-none"
            style={{ transform: 'rotate(-4deg)' }}
          >
            {/* Tag Hole */}
            <div className="w-3 h-3 rounded-full bg-[#e8ded6] border border-[#bfae9f] shadow-inner mb-4 relative z-10"></div>
            
            {/* Tag Content */}
            <h3 className="font-serif text-[#b8860b] text-center text-[19px] leading-[1.1] font-semibold mb-3 tracking-wide drop-shadow-sm">
              GUEST<br/>ACCESS<br/>PASS
            </h3>
            
            <p className="font-sans text-[#5c544d] text-center text-[11px] uppercase tracking-widest leading-tight">
              explore the<br/>collections
            </p>
          </div>
        </div>

        {/* Glassmorphism Login Modal */}
        <div className="relative w-[92%] sm:w-full max-w-[480px] bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl rounded-none py-6 px-5 sm:p-8 md:p-12 md:ml-[80px] z-10 overflow-hidden">
          
          {/* Subtle inner noise texture for realism */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

          {/* Graphic: Needle and Thread */}
          <div className="relative h-12 sm:h-24 w-full mb-1 sm:mb-2 pointer-events-none flex items-center justify-center">
             <svg width="100%" height="100%" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
               {/* Thread Path */}
               <path 
                 d="M30 70 C 60 10, 140 10, 160 50 C 180 90, 260 90, 270 30" 
                 stroke="#d4af37" 
                 strokeWidth="1.5" 
                 fill="none" 
                 className="animate-pulse"
                 style={{ filter: 'drop-shadow(0px 2px 4px rgba(212,175,55,0.3))' }}
               />
               {/* Oscillating Needle */}
               <g className="animate-oscillate" style={{ transformOrigin: '35px 65px' }}>
                 <path d="M25 80 L 45 35 L 47 36 L 27 81 Z" fill="#7f756f" />
                 <path d="M45 35 L 55 15 C 57 11, 52 10, 50 14 L 47 36 Z" fill="#a3968e" />
                 <ellipse cx="51" cy="20" rx="1" ry="4" fill="#f5f0eb" transform="rotate(-25 51 20)" />
               </g>
             </svg>
          </div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-8 relative z-10">
            <h2 className="font-serif text-[22px] sm:text-[28px] md:text-[32px] leading-tight text-[#8b6f5c] font-medium drop-shadow-sm">
              Log In to<br/>Artisanal Creations
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 relative z-10">
            {error && (
              <p className="text-[#a83232] text-xs text-center bg-[#fdf0f0] border border-[#f5c6c6] py-2 px-3 rounded-md font-sans shadow-sm">
                {error}
              </p>
            )}
            
            <div className="flex flex-col gap-3.5 sm:gap-5">
              {/* Email Address */}
              <div className="flex flex-col gap-1 sm:gap-1.5 relative group">
                <label htmlFor="email" className="font-serif text-[13px] sm:text-[14px] text-[#5c544d] ml-1">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="animate-glow-pulse w-full bg-[#FAF8F5] border border-[#d2c4bc] rounded-none px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-sm text-[#1d1b19] placeholder:text-[#a3968e] transition-all shadow-inner"
                  placeholder="Email Address"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1 sm:gap-1.5 relative group">
                <label htmlFor="password" className="font-serif text-[13px] sm:text-[14px] text-[#5c544d] ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPw ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="animate-glow-pulse w-full bg-[#FAF8F5] border border-[#d2c4bc] rounded-none px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-sm text-[#1d1b19] placeholder:text-[#a3968e] transition-all shadow-inner pr-12"
                    placeholder="Password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3968e] hover:text-[#8b6f5c] transition-colors p-1"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end -mt-2">
              <Link to="/auth/forgot-password" className="text-[12px] text-[#5c544d] hover:text-[#1d1b19] font-sans transition-colors">
                Forgot Password?
              </Link>
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
                access your account
              </button>
              
              <div className="text-center mt-4 sm:mt-6">
                <p className="font-sans text-[13px] text-[#5c544d]">
                  Don't have an account? <Link to={`/auth/signup?redirect=${encodeURIComponent(redirectPath)}`} className="hover:underline text-[#8b6f5c] font-semibold transition-colors">Sign Up</Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Mobile Guest Link (Visible only on small screens where tag is hidden) */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:hidden text-center w-full z-10">
           <button 
             onClick={handleGuest}
             className="font-serif italic text-[15px] text-[#fef8f3] drop-shadow-md underline decoration-[#d4af37]/50 underline-offset-4 hover:text-[#d4af37] transition-colors bg-transparent border-none"
           >
             Continue as a Guest
           </button>
        </div>
      </div>
      
      {/* Subtle Footer Links */}
      <div className="absolute bottom-6 left-6 z-10 flex gap-3 text-[11px] font-serif text-[#fef8f3]/80 drop-shadow-md hidden sm:flex">
        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
        <span className="opacity-50">|</span>
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        <span className="opacity-50">|</span>
        <Link to="/help" className="hover:text-white transition-colors">Need Help?</Link>
      </div>

    </div>
  );
};

export default Login;