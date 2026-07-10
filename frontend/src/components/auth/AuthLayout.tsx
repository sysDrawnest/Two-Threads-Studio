import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Panel – Brand Imagery */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative flex-col justify-between bg-primary-container overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=1200&auto=format&fit=crop"
          alt="Artisan embroidery"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-12 lg:p-16 flex flex-col h-full justify-between">
          <Link to="/" className="font-serif text-2xl tracking-widest text-white no-underline">
            TwoThreads Studio
          </Link>
          <div>
            <blockquote className="font-serif text-3xl lg:text-4xl font-light text-white leading-tight mb-6">
              "Every stitch is a breath.<br />Every pattern, a story."
            </blockquote>
            <p className="font-sans text-sm text-white/60 uppercase tracking-widest">
              — The Artisan's Oath
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=100&auto=format&fit=crop"
              alt="Embroidery"
              className="w-16 h-16 object-cover opacity-60"
            />
            <p className="font-sans text-xs text-white/50 uppercase tracking-widest">
              Premium Artisan Embroidery<br />Est. 2019 • Portland, OR
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="md:hidden font-serif text-xl tracking-widest text-primary-container no-underline block text-center mb-10">
            TwoThreads Studio
          </Link>

          <h1 className="font-serif text-3xl md:text-4xl font-light text-primary-container mb-2">{title}</h1>
          {subtitle && (
            <p className="font-sans text-sm text-on-surface-variant mb-8">{subtitle}</p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
