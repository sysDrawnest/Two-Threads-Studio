import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import { useCartStore } from '../../store/cartStore';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const cartItemCount = useCartStore(state => state.items.length);

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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-in-out px-4 md:px-16 ${
          scrolled || menuOpen ? "bg-background shadow-sm" : "bg-transparent"
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
            {/* Search */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="bg-transparent border-none cursor-pointer p-1"
              aria-label="Search"
            >
              <svg width="20" height="20" fill="none" stroke="#2d2520" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            {/* Account */}
            <Link to="/account" className="bg-transparent border-none cursor-pointer p-1 text-[#2d2520] hover:opacity-70 transition-opacity" aria-label="Account">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </Link>
            {/* Wishlist */}
            <Link to="/wishlist" className="bg-transparent border-none cursor-pointer p-1 text-[#2d2520] hover:opacity-70 transition-opacity" aria-label="Wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </Link>
            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-transparent border-none cursor-pointer p-1 relative text-[#2d2520] hover:opacity-70 transition-opacity"
              aria-label="Cart"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4 bg-primary-container text-white text-[8px] font-sans w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            {/* Hamburger */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden bg-transparent border-none cursor-pointer p-1 flex flex-col gap-1 ml-2"
              aria-label="Menu"
            >
              <span className={`block w-6 h-0.5 bg-primary-container transition-all duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`block w-6 h-0.5 bg-primary-container transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-primary-container transition-all duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out bg-background ${
            menuOpen ? "max-h-[400px] border-t border-outline-variant/30" : "max-h-0"
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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
