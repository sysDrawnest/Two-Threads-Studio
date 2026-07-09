import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

import stampDesktop from '../../assets/stamp.png';
import stampMobile from '../../assets/stamp mobile.png';
import paperCutoffDesktop from '../../assets/paper cutoff.png';
import paperCutoffMobile from '../../assets/paper cutoff mobile.png';

const Login: React.FC = () => {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4F0] font-sans relative overflow-hidden text-[#111]">
      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-start md:items-center p-6 md:p-8 z-20">
        <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-medium text-[#222]">
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <Link to="/journal" className="hover:text-black">Journal</Link>
          <Link to="/about" className="hover:text-black">About</Link>
          <Link to="/auth/login" className="hover:text-black">Login</Link>
        </nav>
        <Link to="/" className="font-serif text-2xl md:text-3xl text-[#111] md:absolute md:left-1/2 md:-translate-x-1/2 whitespace-nowrap">
          THE ARTISANAL STUDIO
        </Link>
        <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-medium text-[#222]">
          <Link to="/account" className="hover:text-black">Account</Link>
          <Link to="/cart" className="hover:text-black">Cart (0)</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-32 pb-24 w-full max-w-6xl mx-auto">
        
        <h1 className="font-serif text-6xl md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight text-center mb-16 md:mb-24 text-[#111]">
          Welcome back<br />to the studio.
        </h1>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-16 lg:gap-24 w-full relative">
          
          {/* Desktop Wax Seal (Left) */}
          <motion.div 
             initial={{ opacity: 0, rotate: -15, scale: 0.9 }}
             animate={{ opacity: 1, rotate: 0, scale: 1 }}
             transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
             className="hidden lg:block relative w-40 h-40 flex-shrink-0 mt-4"
          >
            <img src={stampDesktop} alt="Artisanal Studio Wax Seal" className="w-full h-full object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[340px] flex flex-col relative z-20">
            {/* Mobile Wax Seal */}
            <motion.div 
               initial={{ opacity: 0, rotate: 15, scale: 0.9 }}
               animate={{ opacity: 1, rotate: 0, scale: 1 }}
               transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="lg:hidden absolute -top-32 -right-6 w-32 h-32 z-0"
            >
              <img src={stampMobile} alt="Artisanal Studio Wax Seal" className="w-full h-full object-contain drop-shadow-xl" />
            </motion.div>

            {error && (
              <p className="text-[#A34A38] text-xs text-center bg-rose-50 border border-rose-100 py-2 mb-6 font-sans">
                {error}
              </p>
            )}

            <div className="mb-8 flex flex-col">
              <label className="text-[9px] uppercase tracking-widest mb-3 text-[#333] font-medium">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.studio" 
                className="bg-transparent border-0 border-b-2 border-[#111] p-0 pb-3 text-[17px] font-serif text-[#111] focus:ring-0 focus:border-black placeholder:text-[#999] rounded-none w-full outline-none"
              />
            </div>

            <div className="mb-10 flex flex-col relative">
              <label className="text-[9px] uppercase tracking-widest mb-3 text-[#333] font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-transparent border-0 border-b-2 border-[#111] p-0 pb-3 text-[17px] font-sans tracking-[0.2em] text-[#111] focus:ring-0 focus:border-black placeholder:text-[#999] rounded-none w-full outline-none"
              />
              <Link to="/auth/forgot-password" className="absolute right-0 bottom-4 text-[10px] text-[#333] hover:text-black underline underline-offset-4">Forgot?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#111] text-[#F6F4F0] font-serif text-2xl py-4 px-8 w-full hover:bg-black transition-colors mb-6 cursor-pointer border-none"
            >
              {isLoading ? 'loading...' : 'log in'}
            </button>

            <div className="flex justify-center gap-6 text-[11px] underline underline-offset-4 text-[#333] mt-2 font-medium">
              <Link to="/auth/forgot-password" className="hover:text-black">Forgot password?</Link>
              <Link to="/auth/signup" className="hover:text-black">Request Invitation</Link>
            </div>
          </form>

          {/* Desktop Guest Access (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative flex-col justify-center items-center p-10 w-[320px] mt-2"
          >
            <img src={paperCutoffDesktop} alt="" className="absolute inset-0 w-full h-full object-fill -z-10 drop-shadow-[2px_4px_15px_rgba(0,0,0,0.08)]" />
            <div className="relative z-10 flex flex-col items-start px-2">
              <h3 className="font-serif text-xl mb-3 text-[#111]">GUEST ACCESS</h3>
              <p className="font-sans text-sm text-[#555] leading-relaxed mb-6">Browse current collections and archives with a guest pass.</p>
              <Link to="/" className="font-sans text-xs underline underline-offset-4 text-[#111] hover:text-[#555]">[Continue as Guest]</Link>
            </div>
          </motion.div>

          {/* Mobile Guest Access */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden relative flex flex-col justify-center p-8 w-full max-w-[340px] mt-12"
          >
            <img src={paperCutoffMobile} alt="" className="absolute inset-0 w-full h-full object-fill -z-10 drop-shadow-md" />
            <div className="relative z-10 flex flex-col items-start px-2">
              <h3 className="font-serif text-lg mb-2 text-[#111]">GUEST ACCESS PASS</h3>
              <p className="font-sans text-xs text-[#555] leading-relaxed mb-4">If you wish to browse our collections without an account, please continue as a guest.</p>
              <Link to="/" className="font-sans text-[11px] underline underline-offset-4 text-[#111] hover:text-[#555]">Enter as Guest →</Link>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 w-full flex flex-col items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-[#555] z-20 font-medium pb-safe">
        <p>© 2026 THE ARTISANAL STUDIO</p>
        <div className="flex gap-4 underline underline-offset-4">
          <a href="#" className="hover:text-black">IG</a>
          <a href="#" className="hover:text-black">LN</a>
          <a href="#" className="hover:text-black">PIN</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
