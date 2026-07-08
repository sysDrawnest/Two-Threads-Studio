import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
          <div className="hidden lg:block relative w-32 h-32 flex-shrink-0 mt-2">
            <div className="absolute inset-0 bg-[#b75b42] rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transform -rotate-12 border-4 border-[#9c4630]">
              <div className="absolute -top-6 left-1/2 w-1 h-12 bg-[#ded9cd] rotate-45 -z-10 shadow-sm" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)'}}></div>
              <div className="absolute -bottom-8 left-1/3 w-1 h-16 bg-[#ded9cd] -rotate-12 -z-10 shadow-sm" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)'}}></div>
              
              <div className="w-24 h-24 rounded-full border border-[#d3775f] flex flex-col items-center justify-center text-[#fbd7cd] font-serif p-2">
                <span className="text-[7px] uppercase tracking-[0.2em] mt-1">Artisanal</span>
                <span className="text-3xl font-light leading-none my-0.5">AS</span>
                <span className="text-[7px] uppercase tracking-[0.2em]">Studio</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[340px] flex flex-col relative z-20">
            {/* Mobile Wax Seal */}
            <div className="lg:hidden absolute -top-32 -right-8 w-24 h-24 transform rotate-12 scale-90">
               <div className="absolute inset-0 bg-[#b75b42] rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.4),0_8px_15px_rgba(0,0,0,0.15)] flex items-center justify-center border-4 border-[#9c4630]">
                 <div className="w-16 h-16 rounded-full border border-[#d3775f] flex flex-col items-center justify-center text-[#fbd7cd] font-serif p-1">
                   <span className="text-[5px] uppercase tracking-[0.2em]">Artisanal</span>
                   <span className="text-xl font-light leading-none my-0.5">AS</span>
                   <span className="text-[5px] uppercase tracking-[0.2em]">Studio</span>
                 </div>
               </div>
            </div>

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
          <div className="hidden lg:flex flex-col p-8 w-[300px] relative bg-[#f9f8f4] shadow-[2px_4px_15px_rgba(0,0,0,0.05)] transform rotate-1 border-l-4 border-[#eae5dc] mt-4">
            <div className="absolute -left-1 top-0 bottom-0 w-2 bg-gradient-to-r from-transparent to-[#f9f8f4] -z-10 mix-blend-overlay"></div>
            <h3 className="font-serif text-xl mb-3 text-[#111]">GUEST ACCESS</h3>
            <p className="font-sans text-sm text-[#555] leading-relaxed mb-6">Browse current collections and archives with a guest pass.</p>
            <Link to="/" className="font-sans text-xs underline underline-offset-4 text-[#111] hover:text-[#555]">[Continue as Guest]</Link>
          </div>

          {/* Mobile Guest Access */}
          <div className="lg:hidden flex flex-col p-6 w-full max-w-[340px] relative bg-[#f9f8f4] shadow-sm transform -rotate-1 border-l-4 border-[#eae5dc] mt-12">
            <h3 className="font-serif text-lg mb-2 text-[#111]">GUEST ACCESS PASS</h3>
            <p className="font-sans text-xs text-[#555] leading-relaxed mb-4">If you wish to browse our collections without an account, please continue as a guest.</p>
            <Link to="/" className="font-sans text-[11px] underline underline-offset-4 text-[#111] hover:text-[#555]">Enter as Guest →</Link>
          </div>

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
