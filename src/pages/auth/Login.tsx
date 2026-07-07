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

    // Dev/Demo Mock Logic: Divert based on email format
    if (email.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Visual Editorial Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-luminosity scale-105 transition-transform duration-10000 hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent z-10" />
        <div className="relative z-20 max-w-md text-white">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium block mb-4">TwoThreads Studio</span>
          <h2 className="text-4xl font-serif font-light leading-snug mb-4">Pieces born of patience, crafted for lifetimes.</h2>
          <p className="text-stone-300 font-light text-sm leading-relaxed">Log in to view your collection, manage custom heirloom commissions, and trace the path of your orders.</p>
        </div>
      </div>

      {/* Interactive Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-800 font-light mb-2">Welcome Back</h1>
            <p className="text-sm text-stone-500 font-light">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <AuthInput 
              label="Email Address" 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
              error={errors.email}
              placeholder="name@example.com"
            />
            
            <div>
              <AuthInput 
                label="Password" 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                error={errors.password}
                placeholder="••••••••"
              />
              <div className="text-right -mt-2">
                <a href="#forgot" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">Forgot password?</a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-none accent-stone-800 border-stone-300 text-stone-800 focus:ring-0"
                />
                <span className="text-xs text-stone-500 font-light">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-3.5 tracking-widest text-xs uppercase font-medium hover:bg-stone-800 transition-colors duration-300 shadow-sm"
            >
              Sign In
            </button>
          </form>

          {/* Context Switching Accordion for Quick Dev Evaluation */}
          <div className="mt-8 border border-stone-100 bg-stone-50/50 p-4">
            <details className="group">
              <summary className="text-xs font-medium uppercase tracking-wider text-stone-400 cursor-pointer list-none flex justify-between items-center">
                <span>Demo Sandbox Credentials</span>
                <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-3 text-xs text-stone-500 font-light space-y-1.5 border-t border-stone-100 pt-3">
                <p><strong>Customer:</strong> customer@twothreads.com / <span className="font-mono">pass123</span></p>
                <p><strong>Admin Portal:</strong> admin@twothreads.com / <span className="font-mono">admin123</span></p>
              </div>
            </details>
          </div>

          <p className="mt-8 text-center text-sm text-stone-500 font-light">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-stone-800 underline underline-offset-4 hover:text-stone-600 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
