import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    // On registration victory, route smoothly back to marketplace root or onboarding
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Visual Editorial Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1572451479139-6a308211d8be?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-luminosity scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent z-10" />
        <div className="relative z-20 max-w-md text-white">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium block mb-4">TwoThreads Studio</span>
          <h2 className="text-4xl font-serif font-light leading-snug mb-4">Begin Your Creative Journey</h2>
          <p className="text-stone-300 font-light text-sm leading-relaxed">Join a community centered on slow-made craft. Save custom setups, track premium orders, and discover bespoke drops before anyone else.</p>
        </div>
      </div>

      {/* Form Content Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-800 font-light mb-2">Create an Account</h1>
            <p className="text-sm text-stone-500 font-light">Join us to start personalizing your slow-made kits and art pieces.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <AuthInput 
              label="Full Name" 
              type="text" 
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: ''})); }}
              error={errors.name}
              placeholder="Arjun Sharma"
            />

            <AuthInput 
              label="Email Address" 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
              error={errors.email}
              placeholder="arjun@example.com"
            />

            <div className="relative">
              <AuthInput 
                label="Password" 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                error={errors.password}
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-xs font-medium tracking-wider text-stone-400 hover:text-stone-700 transition-colors uppercase"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-xs text-stone-400 font-light leading-relaxed">
              By continuing, you agree to our <a href="#terms" className="underline hover:text-stone-600">Terms of Service</a> and <a href="#privacy" className="underline hover:text-stone-600">Privacy Policy</a>.
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-3.5 tracking-widest text-xs uppercase font-medium hover:bg-stone-800 transition-colors duration-300 shadow-sm"
            >
              Register Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500 font-light">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-stone-800 underline underline-offset-4 hover:text-stone-600 transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;