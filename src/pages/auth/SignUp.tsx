import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = 'Full name is required.';
    if (!email) newErrors.email = 'Email address is required.';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fef8f3] flex flex-col relative overflow-hidden">
      
      {/* Floating Embroidery Badge (The Visual Twist) */}
      <div className="hidden lg:block absolute top-1/3 right-32 w-32 h-32 rounded-full overflow-hidden shadow-2xl animate-[bounce_5s_ease-in-out_infinite] opacity-90 hover:opacity-100 transition-opacity duration-500 z-10 border border-stone-200" style={{ animationDelay: '0.5s' }}>
        <img 
          src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=400" 
          alt="Artisanal Stitching"
          className="w-full h-full object-cover grayscale-[20%] sepia-[15%]"
        />
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-20 lg:py-24 flex flex-col justify-center relative z-20">
        
        {/* Editorial Heading */}
        <div className="mb-16 lg:mb-20">
          <span className="block text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400 mb-6 border-b border-stone-200 inline-block pb-2">TwoThreads Studio</span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light text-stone-900 leading-[1.1] tracking-tight">
            Begin your <br className="hidden lg:block"/> collection.
          </h1>
        </div>

        {/* Minimalist Form */}
        <form onSubmit={handleSignUp} className="space-y-12 lg:space-y-14 max-w-2xl">
          <AuthInput 
            label="Full Name" 
            type="text" 
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: ''})); }}
            error={errors.name}
          />

          <AuthInput 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
            error={errors.email}
          />
          
          <AuthInput 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
            error={errors.password}
          />

          <div className="pt-2 lg:pt-8">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-light mb-8">
              By joining, you agree to our <a href="#terms" className="text-stone-800 hover:text-stone-500 transition-colors border-b border-stone-300 pb-0.5">Terms</a> & <a href="#privacy" className="text-stone-800 hover:text-stone-500 transition-colors border-b border-stone-300 pb-0.5">Privacy</a>.
            </p>
            <button
              type="submit"
              className="w-full bg-stone-900 text-[#fef8f3] py-6 font-sans text-xs uppercase tracking-[0.3em] hover:bg-stone-800 transition-all duration-500 hover:tracking-[0.4em]"
            >
              create account
            </button>
          </div>
        </form>

        <p className="mt-16 font-sans text-xs tracking-widest uppercase text-stone-400 font-light">
          Already a member?{' '}
          <Link to="/auth/login" className="text-stone-800 font-medium hover:text-stone-500 transition-colors ml-2 border-b border-stone-800 pb-1">
            return to the studio
          </Link>
        </p>
      </div>

      {/* Minimalist Demo Credentials */}
      <div className="mt-auto py-8 text-center text-[10px] font-sans text-stone-400 tracking-wider flex flex-col md:flex-row justify-center items-center gap-4 border-t border-stone-200/50">
        <span>GUEST ACCESS (NEW): anyvalid@email.com / craft123</span>
      </div>

    </div>
  );
};

export default SignUp;