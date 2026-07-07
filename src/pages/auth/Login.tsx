import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#fef8f3] flex flex-col relative overflow-hidden">
      
      {/* Floating Embroidery Badge (The Visual Twist) */}
      <div className="hidden lg:block absolute top-1/4 right-32 w-32 h-32 rounded-full overflow-hidden shadow-2xl animate-[bounce_4s_ease-in-out_infinite] opacity-90 hover:opacity-100 transition-opacity duration-500 z-10 border border-stone-200">
        <img 
          src="https://images.unsplash.com/photo-1572451479139-6a308211d8be?auto=format&fit=crop&q=80&w=400" 
          alt="Embroidery Craft"
          className="w-full h-full object-cover grayscale-[30%] sepia-[20%]"
        />
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-20 lg:py-32 flex flex-col justify-center relative z-20">
        
        {/* Editorial Heading */}
        <div className="mb-16 lg:mb-24">
          <span className="block text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400 mb-6 border-b border-stone-200 inline-block pb-2">TwoThreads Studio</span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light text-stone-900 leading-[1.1] tracking-tight">
            Welcome back <br className="hidden lg:block"/> to the studio.
          </h1>
        </div>

        {/* Minimalist Form */}
        <form onSubmit={handleLogin} className="space-y-12 lg:space-y-16 max-w-2xl">
          <AuthInput 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
            error={errors.email}
          />
          
          <div className="relative">
            <AuthInput 
              label="Password" 
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
              error={errors.password}
            />
            <div className="absolute right-0 -bottom-8">
              <a href="#forgot" className="font-sans text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors">Recover Password</a>
            </div>
          </div>

          <div className="pt-8 lg:pt-12">
            <button
              type="submit"
              className="w-full bg-stone-900 text-[#fef8f3] py-6 font-sans text-xs uppercase tracking-[0.3em] hover:bg-stone-800 transition-all duration-500 hover:tracking-[0.4em]"
            >
              sign in
            </button>
          </div>
        </form>

        <p className="mt-16 font-sans text-xs tracking-widest uppercase text-stone-400 font-light">
          New to the studio?{' '}
          <Link to="/auth/signup" className="text-stone-800 font-medium hover:text-stone-500 transition-colors ml-2 border-b border-stone-800 pb-1">
            begin your collection
          </Link>
        </p>
      </div>

      {/* Minimalist Demo Credentials */}
      <div className="mt-auto py-8 text-center text-[10px] font-sans text-stone-400 tracking-wider flex flex-col md:flex-row justify-center items-center gap-4 border-t border-stone-200/50">
        <span>GUEST ACCESS (CUSTOMER): customer@twothreads.com / pass123</span>
        <span className="hidden md:inline text-stone-300">|</span>
        <span>GUEST ACCESS (ADMIN): admin@twothreads.com / admin123</span>
      </div>

    </div>
  );
};

export default Login;
