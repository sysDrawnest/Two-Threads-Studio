import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!email) newErrors.email = 'Email address is required.';
    if (!password) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (email.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-stone-900 flex items-center justify-center lg:block">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=2000')" }}
      />
      <div className="absolute inset-0 z-0 bg-stone-900/30 backdrop-blur-[2px]" />

      {/* Main Floating Container */}
      <div className="relative z-10 w-full max-w-md px-6 lg:px-0 lg:absolute lg:bottom-16 lg:right-24 xl:right-32 animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-md border-[0.5px] border-stone-200 p-8 sm:p-12 shadow-2xl relative">
          
          {/* Micro-Detail: Needle and Thread SVG */}
          <div className="absolute -top-4 -right-4 w-12 h-12 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 80L80 20" stroke="#d4af37" strokeWidth="1" strokeLinecap="round"/>
              <path d="M75 15L85 25" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="82" cy="18" r="1.5" fill="#a8a29e"/>
              <path d="M20 80C10 90 30 100 40 90C50 80 30 70 20 80Z" stroke="#d4af37" strokeWidth="0.5" fill="none"/>
            </svg>
          </div>

          <div className="mb-12">
            <h1 className="text-3xl font-serif text-stone-800 font-light mb-3">Welcome Back</h1>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Log in to view your collection, manage custom heirloom commissions, and trace the path of your orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <AuthInput 
              label="Email Address" 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
              error={errors.email}
            />
            
            <div className="relative pb-2">
              <AuthInput 
                label="Password" 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                error={errors.password}
              />
              <div className="absolute right-0 -bottom-4">
                <a href="#forgot" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors">Forgot?</a>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative w-4 h-4 border-[0.5px] border-stone-300 flex items-center justify-center group-hover:border-stone-500 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  {rememberMe && <div className="w-2 h-2 bg-stone-800" />}
                </div>
                <span className="text-xs text-stone-500 font-light tracking-wide group-hover:text-stone-800 transition-colors">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-4 text-sm font-serif lowercase tracking-[0.25em] hover:bg-stone-800 transition-colors duration-500 mt-4"
            >
              sign in
            </button>
          </form>

          <p className="mt-10 text-center text-xs tracking-wider text-stone-500 font-light">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-stone-800 font-medium hover:text-stone-500 transition-colors ml-1">
              create one
            </Link>
          </p>
        </div>

        {/* Swing-Tag Demo Credentials (Guest Access) */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:top-12 lg:-left-40 xl:-left-48 w-full max-w-xs lg:w-48 group perspective-1000">
          <div className="bg-stone-100/90 backdrop-blur-sm border-[0.5px] border-stone-300 p-5 shadow-lg transform transition-transform duration-700 lg:group-hover:rotate-y-12 lg:group-hover:-translate-x-2 relative origin-top-right">
            {/* Tag String / Hole */}
            <div className="hidden lg:block absolute top-4 -right-2 w-4 h-4 bg-stone-200 rounded-full border border-stone-300 shadow-inner" />
            <div className="hidden lg:block absolute top-6 -right-6 w-8 h-[1px] bg-stone-300 rotate-12" />

            <h3 className="text-[10px] uppercase tracking-widest text-stone-500 mb-3 border-b border-stone-200 pb-2">Guest Access Pass</h3>
            <div className="space-y-3 text-[11px] text-stone-600 font-light">
              <div>
                <span className="block font-medium text-stone-800 mb-0.5">Customer</span>
                <span className="font-mono text-[10px]">customer@twothreads.com</span><br/>
                <span className="font-mono text-[10px] text-stone-400">pass123</span>
              </div>
              <div>
                <span className="block font-medium text-stone-800 mb-0.5">Admin</span>
                <span className="font-mono text-[10px]">admin@twothreads.com</span><br/>
                <span className="font-mono text-[10px] text-stone-400">admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
