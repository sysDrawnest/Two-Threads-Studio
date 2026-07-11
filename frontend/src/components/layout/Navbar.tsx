import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Shield } from 'lucide-react';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { items, isCartOpen, setCartOpen } = useCartStore();
  const cartItemCount = items.length;
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const links = [
    { name: "Shop", path: "/shop" },
    { name: "Gallery", path: "/gallery" },
    { name: "Our Story", path: "/our-story" },
    { name: "Journal", path: "/journal" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-12 lg:px-16 ${
          scrolled ? "bg-white/80 backdrop-blur-md border-b border-neutral-200/50 py-4 shadow-sm" : "bg-transparent py-6"
        }`}
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between max-w-[1400px] mx-auto w-full">
          
          {/* Left: Logo */}
          <div className="w-1/3 flex justify-start">
            <Link 
              to="/" 
              className="font-serif text-[26px] tracking-wide text-neutral-800 hover:text-neutral-500"
            >
              TwoThreads Studio
            </Link>
          </div>

          {/* Center: Links */}
          <div className="w-1/3 flex justify-center gap-10 items-center">
            {links.map(l => (
              <Link 
                key={l.name} 
                to={l.path} 
                className="font-sans text-xs tracking-[0.2em] text-neutral-600 uppercase hover:text-neutral-900 py-1"
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Right: Icons */}
          <div className="w-1/3 flex justify-end gap-7 items-center">
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-neutral-600 hover:text-[#A34A38]"
                aria-label="Admin Dashboard"
              >
                <Shield strokeWidth={1.5} size={20} />
              </Link>
            )}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-neutral-600 hover:text-neutral-900"
              aria-label="Search"
            >
              <Search strokeWidth={1.25} size={20} />
            </button>
            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="text-neutral-600 hover:text-[#A34A38]"
                aria-label="Account Profile"
              >
                <User strokeWidth={1.5} size={20} />
              </Link>
            ) : (
              <Link 
                to="/auth/login?redirect=/account" 
                className="text-neutral-600 hover:text-neutral-900"
                aria-label="Login"
              >
                <User strokeWidth={1.25} size={20} />
              </Link>
            )}
            <button 
              onClick={() => setCartOpen(true)}
              className="text-neutral-600 hover:text-neutral-900 relative"
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.25} size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-neutral-800 text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left: Hamburger */}
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => setMenuOpen(true)}
              className="text-neutral-800 p-1 -ml-1 hover:text-neutral-500"
              aria-label="Open Menu"
            >
              <Menu strokeWidth={1.25} size={24} />
            </button>
          </div>
          
          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link 
              to="/" 
              className="font-serif text-[22px] tracking-wide text-neutral-800"
            >
              TwoThreads
            </Link>
          </div>

          {/* Right: Cart */}
          <div className="flex-1 flex justify-end items-center">
            <button 
              onClick={() => setCartOpen(true)}
              className="text-neutral-800 relative p-1 -mr-1 hover:text-neutral-500"
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.25} size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-800 text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-[#faf9f7] flex flex-col ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col h-full w-full px-5 py-6 max-w-md mx-auto">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-16">
            <Link to="/" className="font-serif text-[22px] tracking-wide text-neutral-800">
              TwoThreads Studio
            </Link>
            <button 
              onClick={() => setMenuOpen(false)}
              className="text-neutral-800 p-1 -mr-1 hover:text-neutral-500"
              aria-label="Close Menu"
            >
              <X strokeWidth={1.25} size={28} />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col gap-8 items-start flex-1">
            {links.map((l) => (
              <Link 
                key={l.name} 
                to={l.path} 
                className="font-serif text-[36px] leading-tight tracking-wide text-neutral-800 hover:text-neutral-600"
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Footer */}
          <div className="flex flex-col gap-6 border-t border-neutral-200 pt-8 pb-8">
            <button 
              onClick={() => {
                setMenuOpen(false);
                setTimeout(() => setIsSearchOpen(true), 10);
              }}
              className="font-sans text-[11px] tracking-[0.2em] text-neutral-600 uppercase flex items-center gap-3 w-fit hover:text-neutral-900"
            >
              <Search size={18} strokeWidth={1.25} /> Search Collection
            </button>
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="font-sans text-[11px] tracking-[0.2em] text-[#A34A38] uppercase flex items-center gap-3 w-fit hover:text-[#1C1C1B]"
              >
                <Shield size={18} strokeWidth={1.5} /> Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="font-sans text-[11px] tracking-[0.2em] text-[#A34A38] uppercase flex items-center gap-3 w-fit hover:text-[#1C1C1B]"
              >
                <User size={18} strokeWidth={1.5} /> My Profile
              </Link>
            ) : (
              <Link 
                to="/auth/login?redirect=/account" 
                className="font-sans text-[11px] tracking-[0.2em] text-neutral-600 uppercase flex items-center gap-3 w-fit hover:text-neutral-900"
              >
                <User size={18} strokeWidth={1.25} /> Log In
              </Link>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
