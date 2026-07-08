import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
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
    { name: "Our Story", path: "/about" },
    { name: "Journal", path: "/journal" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-5 md:px-12 lg:px-16 ${
          scrolled ? "bg-[#fcfaf8]/90 backdrop-blur-md border-b border-[#e5e0d8] py-4" : "bg-transparent py-6"
        }`}
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between max-w-[1400px] mx-auto w-full">
          
          {/* Left: Logo */}
          <div className="w-1/3 flex justify-start">
            <Link 
              to="/" 
              className={`font-serif text-[26px] tracking-wide hover:opacity-80 transition-colors duration-500 ${
                scrolled ? "text-[#2c2826]" : "text-[#f4ebd9]"
              }`}
            >
              TwoThreads Studio
            </Link>
          </div>

          {/* Center: Links */}
          <div className="w-1/3 flex justify-center gap-8 lg:gap-12">
            {links.map(l => (
              <Link 
                key={l.name} 
                to={l.path} 
                className={`relative font-sans text-[11px] lg:text-xs tracking-[0.2em] uppercase transition-colors duration-500 py-1
                           after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] hover:after:w-full after:transition-all after:duration-300
                           ${
                             scrolled 
                               ? "text-[#4a4542] hover:text-[#1a1817] after:bg-[#4a4542]" 
                               : "text-[#f4ebd9]/90 hover:text-white after:bg-white"
                           }`}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Right: Icons */}
          <div className="w-1/3 flex justify-end gap-6 items-center">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`transition-colors duration-500 ${
                scrolled ? "text-[#4a4542] hover:text-[#1a1817]" : "text-[#f4ebd9]/90 hover:text-white"
              }`}
              aria-label="Search"
            >
              <Search strokeWidth={1.25} size={20} />
            </button>
            <Link 
              to="/account" 
              className={`transition-colors duration-500 ${
                scrolled ? "text-[#4a4542] hover:text-[#1a1817]" : "text-[#f4ebd9]/90 hover:text-white"
              }`}
              aria-label="Account"
            >
              <User strokeWidth={1.25} size={20} />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative transition-colors duration-500 ${
                scrolled ? "text-[#4a4542] hover:text-[#1a1817]" : "text-[#f4ebd9]/90 hover:text-white"
              }`}
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.25} size={20} />
              {cartItemCount > 0 && (
                <span className={`absolute -top-1.5 -right-2 text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full shadow-sm transition-colors duration-500 ${
                  scrolled ? "bg-[#ab5a46] text-[#f4ebd9]" : "bg-[#f4ebd9] text-[#ab5a46]"
                }`}>
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
              className={`p-1 -ml-1 transition-colors duration-500 ${
                scrolled ? "text-[#2c2826]" : "text-[#f4ebd9]"
              }`}
              aria-label="Open Menu"
            >
              <Menu strokeWidth={1.25} size={24} />
            </button>
          </div>
          
          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link 
              to="/" 
              className={`font-serif text-[22px] tracking-wide transition-colors duration-500 ${
                scrolled ? "text-[#2c2826]" : "text-[#f4ebd9]"
              }`}
            >
              TwoThreads
            </Link>
          </div>

          {/* Right: Cart */}
          <div className="flex-1 flex justify-end items-center">
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-1 -mr-1 transition-colors duration-500 ${
                scrolled ? "text-[#2c2826]" : "text-[#f4ebd9]"
              }`}
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.25} size={22} />
              {cartItemCount > 0 && (
                <span className={`absolute -top-0.5 -right-1 text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full shadow-sm transition-colors duration-500 ${
                  scrolled ? "bg-[#ab5a46] text-[#f4ebd9]" : "bg-[#f4ebd9] text-[#ab5a46]"
                }`}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-[#fcfaf8] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          menuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <div className="flex flex-col h-full w-full px-5 py-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-16">
            <Link to="/" className="font-serif text-[22px] tracking-wide text-[#2c2826]">
              TwoThreads Studio
            </Link>
            <button 
              onClick={() => setMenuOpen(false)}
              className="text-[#2c2826] p-1 -mr-1 hover:rotate-90 transition-transform duration-500"
              aria-label="Close Menu"
            >
              <X strokeWidth={1.25} size={28} />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col gap-8 items-start flex-1">
            {links.map((l, i) => (
              <Link 
                key={l.name} 
                to={l.path} 
                className={`font-serif text-[32px] tracking-wide text-[#2c2826] transition-all duration-500 ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 75 + 100}ms` }}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Footer */}
          <div className={`flex flex-col gap-6 border-t border-[#e5e0d8] pt-8 pb-4 transition-all duration-700 delay-500 ${
            menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}>
            <button 
              onClick={() => {
                setMenuOpen(false);
                setTimeout(() => setIsSearchOpen(true), 300);
              }}
              className="font-sans text-[11px] tracking-[0.2em] text-[#4a4542] uppercase flex items-center gap-3 w-fit"
            >
              <Search size={18} strokeWidth={1.25} /> Search Collection
            </button>
            <Link 
              to="/account" 
              className="font-sans text-[11px] tracking-[0.2em] text-[#4a4542] uppercase flex items-center gap-3 w-fit"
            >
              <User size={18} strokeWidth={1.25} /> My Account
            </Link>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
