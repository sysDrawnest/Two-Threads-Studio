import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

import stampDesktop from '../../assets/stamp.png';
import stampMobile from '../../assets/stamp mobile.png';
import paperCutoffDesktop from '../../assets/paper cutoff.png';
import paperCutoffMobile from '../../assets/paper cutoff mobile.png';

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
          Join the studio.
        </h1>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-16 lg:gap-24 w-full relative">
          
          {/* Desktop Guest Access (Left side for variation like the second reference image) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative flex-col justify-center items-start p-10 w-[320px] mt-2 z-20"
          >
            <img src={paperCutoffDesktop} alt="" className="absolute inset-0 w-full h-full object-fill -z-10 drop-shadow-[2px_4px_15px_rgba(0,0,0,0.08)] transform -scale-x-100" />
            <div className="relative z-10 px-2">
              <h3 className="font-serif text-xl mb-3 text-[#111]">GUEST ACCESS PASS</h3>
              <p className="font-sans text-sm text-[#555] leading-relaxed mb-6">If you wish to browse our collections without an account, please continue as a guest.</p>
              <Link to="/" className="font-sans text-xs underline underline-offset-4 text-[#111] hover:text-[#555]">Enter as Guest →</Link>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[340px] flex flex-col relative z-30">
            {/* Desktop Wax Seal (Positioned slightly off the form for balance) */}
            <motion.div 
               initial={{ opacity: 0, rotate: 15, scale: 0.9 }}
               animate={{ opacity: 1, rotate: 0, scale: 1 }}
               transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="hidden lg:block absolute -top-24 -right-16 w-40 h-40 flex-shrink-0 z-0"
            >
              <img src={stampDesktop} alt="Artisanal Studio Wax Seal" className="w-full h-full object-contain drop-shadow-2xl" />
            </motion.div>

            {/* Mobile Wax Seal */}
            <motion.div 
               initial={{ opacity: 0, rotate: -15, scale: 0.9 }}
               animate={{ opacity: 1, rotate: 0, scale: 1 }}
               transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="lg:hidden absolute -top-32 -left-6 w-32 h-32 z-0"
            >
              <img src={stampMobile} alt="Artisanal Studio Wax Seal" className="w-full h-full object-contain drop-shadow-xl transform -scale-x-100" />
            </motion.div>

            {error && (
              <p className="text-[#A34A38] text-xs text-center bg-rose-50 border border-rose-100 py-2 mb-6 font-sans">
                {error}
              </p>
            )}

            <div className="mb-6 flex flex-col">
              <label className="text-[9px] uppercase tracking-widest mb-3 text-[#333] font-medium">Full Name</label>
              <input 
                type="text" 
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Julia Hampton" 
                className="bg-transparent border-0 border-b-2 border-[#111] p-0 pb-3 text-[17px] font-serif text-[#111] focus:ring-0 focus:border-black placeholder:text-[#999] rounded-none w-full outline-none"
              />
            </div>

            <div className="mb-6 flex flex-col">
              <label className="text-[9px] uppercase tracking-widest mb-3 text-[#333] font-medium">Email Address</label>
              <input 
                type="email" 
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.studio" 
                className="bg-transparent border-0 border-b-2 border-[#111] p-0 pb-3 text-[17px] font-serif text-[#111] focus:ring-0 focus:border-black placeholder:text-[#999] rounded-none w-full outline-none"
              />
            </div>

            <div className="mb-6 flex flex-col">
              <label className="text-[9px] uppercase tracking-widest mb-3 text-[#333] font-medium">Password</label>
              <input 
                type="password" 
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="bg-transparent border-0 border-b-2 border-[#111] p-0 pb-3 text-[17px] font-sans tracking-[0.2em] text-[#111] focus:ring-0 focus:border-black placeholder:text-[#999] rounded-none w-full outline-none"
              />
            </div>

            <div className="mb-10 flex flex-col">
              <label className="text-[9px] uppercase tracking-widest mb-3 text-[#333] font-medium">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••" 
                className="bg-transparent border-0 border-b-2 border-[#111] p-0 pb-3 text-[17px] font-sans tracking-[0.2em] text-[#111] focus:ring-0 focus:border-black placeholder:text-[#999] rounded-none w-full outline-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#111] text-[#F6F4F0] font-serif text-2xl py-4 px-8 w-full hover:bg-black transition-colors mb-6 cursor-pointer border-none"
            >
              {isLoading ? 'loading...' : 'sign up'}
            </button>

            <div className="flex justify-center gap-6 text-[11px] underline underline-offset-4 text-[#333] mt-2 font-medium">
              <Link to="/auth/login" className="hover:text-black">Already have an account?</Link>
            </div>
          </form>

          {/* Mobile Guest Access (Shown below form) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden relative flex flex-col justify-center p-8 w-full max-w-[340px] mt-12"
          >
            <img src={paperCutoffMobile} alt="" className="absolute inset-0 w-full h-full object-fill -z-10 drop-shadow-md transform -scale-x-100" />
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

export default Signup;