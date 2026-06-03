import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { name: "Shop", path: "/shop" },
    { name: "Learning", path: "/learning" },
    { name: "About", path: "/about" },
    { name: "Artisans", path: "/artisans" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-in-out px-4 md:px-16 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-serif text-xl tracking-widest text-primary-container no-underline font-medium"
        >
          TwoThreads Studio
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map(l => (
            <Link 
              key={l.name} 
              to={l.path} 
              className="font-sans text-xs tracking-widest text-primary-container uppercase opacity-80 hover:opacity-100 transition-opacity"
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* Icons & Hamburger */}
        <div className="flex gap-4 items-center">
          <button className="bg-transparent border-none cursor-pointer p-1">
            <svg width="20" height="20" fill="none" stroke="#2d2520" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </button>
          <Link to="/wishlist" className="bg-transparent border-none cursor-pointer p-1 text-[#2d2520] hover:opacity-70 transition-opacity">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </Link>
          {/* Hamburger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden bg-transparent border-none cursor-pointer p-1 flex flex-col gap-1"
          >
            <span className={`block w-6 h-0.5 bg-primary-container transition-all duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary-container transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary-container transition-all duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out bg-background/98 ${
          menuOpen ? "max-h-[400px] border-t border-surface-variant" : "max-h-0"
        }`}
      >
        <div className="px-4 py-6 flex flex-col gap-6">
          {links.map(l => (
            <Link 
              key={l.name} 
              to={l.path} 
              className="font-serif text-lg tracking-wider text-primary-container no-underline"
            >
              {l.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
