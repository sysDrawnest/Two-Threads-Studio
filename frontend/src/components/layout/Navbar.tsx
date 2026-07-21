import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Shield, Heart, ChevronDown, Truck } from 'lucide-react';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCommerce';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const location = useLocation();
  const { isCartOpen, setCartOpen } = useCartStore();
  const { data: cartData } = useCart();
  const cartItemCount = cartData?.totals?.totalItems ?? 0;
  const cartSubtotal = cartData?.totals?.subtotal ? `₹${cartData.totals.subtotal.toLocaleString()}` : '';
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

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

  const shopCategories = [
    { name: 'All Products', path: '/shop' },
    { name: 'Embroidery Kits', path: '/shop?category=kit' },
    { name: 'Home & Wall Decor', path: '/shop?category=decor' },
    { name: 'DIY Craft Sets', path: '/shop?category=diy' },
    { name: 'Best Sellers', path: '/shop?sort=best_sellers' },
    { name: 'New Arrivals', path: '/shop?sort=newest' },
  ];

  const collectionsList = [
    { name: 'All Collections', path: '/collections' },
    { name: 'Botanical Series', path: '/collections?name=Botanical' },
    { name: 'Heritage Collection', path: '/collections?name=Heritage' },
    { name: 'Artisan Studio', path: '/collections?name=Artisan' },
    { name: 'Miniature Embroidery', path: '/collections?name=Miniature' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 px-5 md:px-10 lg:px-14 ${
          scrolled 
            ? 'bg-[#FAF9F7]/90 backdrop-blur-md border-b border-[#E8E4DF]/70 py-3 shadow-sm' 
            : 'bg-[#FAF9F7] border-b border-[#E8E4DF]/40 py-4'
        }`}
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between max-w-[1400px] mx-auto w-full">
          
          {/* Left: Brand Logo */}
          <div className="w-1/4 flex justify-start">
            <Link 
              to="/" 
              className="font-serif text-[22px] lg:text-[24px] tracking-wide text-[#1C1C1B] hover:text-[#A34A38] transition-colors"
            >
              TwoThreads Studio
            </Link>
          </div>

          {/* Center: Commerce-Focused Links */}
          <div className="w-2/4 flex justify-center gap-7 lg:gap-9 items-center">
            
            {/* Shop Dropdown */}
            <div 
              className="relative group py-1.5"
              onMouseEnter={() => setActiveDropdown('shop')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to="/shop" 
                className="font-sans text-[11px] tracking-[0.2em] text-[#1C1C1B] uppercase hover:text-[#A34A38] py-1 flex items-center gap-1 transition-colors font-medium"
              >
                Shop
                <ChevronDown size={11} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
              </Link>
              
              {activeDropdown === 'shop' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-60 bg-[#FAF9F7] border border-[#E8E4DF] shadow-xl py-4 px-5 rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-neutral-400 mb-2.5 border-b border-[#E8E4DF] pb-1.5 font-semibold">
                    Shop Categories
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        className="font-sans text-xs text-neutral-700 hover:text-[#A34A38] hover:translate-x-1 transition-all py-0.5"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Collections Dropdown */}
            <div 
              className="relative group py-1.5"
              onMouseEnter={() => setActiveDropdown('collections')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to="/collections" 
                className="font-sans text-[11px] tracking-[0.2em] text-[#1C1C1B] uppercase hover:text-[#A34A38] py-1 flex items-center gap-1 transition-colors font-medium"
              >
                Collections
                <ChevronDown size={11} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
              </Link>
              
              {activeDropdown === 'collections' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-60 bg-[#FAF9F7] border border-[#E8E4DF] shadow-xl py-4 px-5 rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-neutral-400 mb-2.5 border-b border-[#E8E4DF] pb-1.5 font-semibold">
                    Curated Collections
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {collectionsList.map((col) => (
                      <Link
                        key={col.name}
                        to={col.path}
                        className="font-sans text-xs text-neutral-700 hover:text-[#A34A38] hover:translate-x-1 transition-all py-0.5"
                      >
                        {col.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Commissions */}
            <Link 
              to="/our-story#custom-creations" 
              className="font-sans text-[11px] tracking-[0.2em] text-[#1C1C1B] uppercase hover:text-[#A34A38] py-1 transition-colors font-medium flex items-center gap-1.5"
            >
              Custom
              <span className="w-1.5 h-1.5 rounded-full bg-[#A34A38] animate-pulse" />
            </Link>

            {/* Our Story */}
            <Link 
              to="/our-story" 
              className="font-sans text-[11px] tracking-[0.2em] text-[#1C1C1B] uppercase hover:text-[#A34A38] py-1 transition-colors font-medium"
            >
              About
            </Link>

          </div>

          {/* Right: Icons */}
          <div className="w-1/4 flex justify-end gap-5 items-center">
            
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-neutral-700 hover:text-[#A34A38] transition-colors"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <Shield strokeWidth={1.5} size={18} />
              </Link>
            )}

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 text-neutral-700 hover:text-[#A34A38] transition-colors font-sans text-[10px] tracking-[0.15em] uppercase"
              aria-label="Search Collection"
            >
              <Search strokeWidth={1.3} size={18} />
              <span className="hidden lg:inline text-[10px]">Search</span>
            </button>

            <Link 
              to="/wishlist" 
              className="text-neutral-700 hover:text-[#A34A38] transition-colors"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart strokeWidth={1.3} size={18} />
            </Link>

            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="text-neutral-700 hover:text-[#A34A38] transition-colors"
                aria-label="Account Profile"
                title="My Account"
              >
                <User strokeWidth={1.4} size={18} />
              </Link>
            ) : (
              <Link 
                to="/auth/login?redirect=/account" 
                className="text-neutral-700 hover:text-[#A34A38] transition-colors"
                aria-label="Login"
                title="Log In"
              >
                <User strokeWidth={1.3} size={18} />
              </Link>
            )}

            <button 
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-1.5 text-[#1C1C1B] hover:text-[#A34A38] transition-colors relative"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingBag strokeWidth={1.3} size={19} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#1C1C1B] text-[#FAF9F7] text-[8px] font-semibold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-[#FAF9F7]">
                    {cartItemCount}
                  </span>
                )}
              </div>
              {cartSubtotal && (
                <span className="hidden xl:inline text-[10px] font-sans tracking-wide font-medium text-neutral-800">
                  {cartSubtotal}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full py-0.5">
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => setMenuOpen(true)}
              className="text-[#1C1C1B] p-0.5 -ml-1 hover:text-[#A34A38]"
              aria-label="Open Menu"
            >
              <Menu strokeWidth={1.3} size={23} />
            </button>
          </div>
          
          <div className="flex-1 flex justify-center">
            <Link 
              to="/" 
              className="font-serif text-xl tracking-wide text-[#1C1C1B]"
            >
              TwoThreads
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2.5">
            <Link to="/wishlist" className="text-[#1C1C1B] hover:text-[#A34A38]">
              <Heart strokeWidth={1.3} size={19} />
            </Link>
            <button 
              onClick={() => setCartOpen(true)}
              className="text-[#1C1C1B] relative hover:text-[#A34A38]"
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.3} size={21} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1C1C1B] text-[#FAF9F7] text-[8px] font-semibold w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-[#FAF9F7]">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Unchanged */}
      <div 
        className={`fixed inset-0 z-[60] bg-[#FAF9F7] flex flex-col transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full w-full px-6 py-6 max-w-lg mx-auto overflow-y-auto">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E4DF]">
            <Link to="/" className="font-serif text-2xl tracking-wide text-[#1C1C1B]">
              TwoThreads Studio
            </Link>
            <button 
              onClick={() => setMenuOpen(false)}
              className="text-[#1C1C1B] p-1.5 rounded-full hover:bg-neutral-200/50 transition-colors"
              aria-label="Close Menu"
            >
              <X strokeWidth={1.3} size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-5 items-start my-auto">
            <Link 
              to="/shop" 
              className="font-serif text-3xl leading-tight tracking-wide text-[#1C1C1B] hover:text-[#A34A38] transition-colors"
            >
              Shop
            </Link>
            <Link 
              to="/collections" 
              className="font-serif text-3xl leading-tight tracking-wide text-[#1C1C1B] hover:text-[#A34A38] transition-colors"
            >
              Collections
            </Link>
            <Link 
              to="/our-story#custom-creations" 
              className="font-serif text-3xl leading-tight tracking-wide text-[#1C1C1B] hover:text-[#A34A38] transition-colors flex items-center gap-3"
            >
              Custom Orders
              <span className="text-xs font-sans tracking-widest uppercase bg-[#A34A38] text-[#FAF9F7] px-2 py-0.5 rounded-full">Artisan</span>
            </Link>
            <Link 
              to="/our-story" 
              className="font-serif text-3xl leading-tight tracking-wide text-[#1C1C1B] hover:text-[#A34A38] transition-colors"
            >
              Our Story
            </Link>
            <Link 
              to="/account?tab=orders" 
              className="font-serif text-3xl leading-tight tracking-wide text-[#1C1C1B] hover:text-[#A34A38] transition-colors flex items-center gap-3"
            >
              <Truck size={22} className="text-[#A34A38]" /> Track Order
            </Link>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E8E4DF] pt-6 mt-8 pb-4">
            <button 
              onClick={() => {
                setMenuOpen(false);
                setTimeout(() => setIsSearchOpen(true), 50);
              }}
              className="font-sans text-[10px] tracking-[0.2em] text-[#1C1C1B] uppercase flex items-center gap-3 hover:text-[#A34A38] transition-colors"
            >
              <Search size={16} strokeWidth={1.3} /> Search Collection
            </button>

            <Link 
              to="/wishlist" 
              className="font-sans text-[10px] tracking-[0.2em] text-[#1C1C1B] uppercase flex items-center gap-3 hover:text-[#A34A38] transition-colors"
            >
              <Heart size={16} strokeWidth={1.3} /> Wishlist
            </Link>

            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="font-sans text-[10px] tracking-[0.2em] text-[#A34A38] uppercase flex items-center gap-3 font-medium hover:text-[#1C1C1B] transition-colors"
              >
                <User size={16} strokeWidth={1.4} /> My Profile
              </Link>
            ) : (
              <Link 
                to="/auth/login?redirect=/account" 
                className="font-sans text-[10px] tracking-[0.2em] text-[#1C1C1B] uppercase flex items-center gap-3 hover:text-[#A34A38] transition-colors"
              >
                <User size={16} strokeWidth={1.3} /> Log In
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="font-sans text-[10px] tracking-[0.2em] text-[#A34A38] uppercase flex items-center gap-3 font-semibold hover:text-[#1C1C1B] transition-colors"
              >
                <Shield size={16} strokeWidth={1.5} /> Admin Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#E8E4DF] pt-4 text-[9px] font-sans tracking-[0.2em] uppercase text-neutral-500">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#1C1C1B]">Instagram</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#1C1C1B]">Pinterest</a>
            <Link to="/contact" className="hover:text-[#1C1C1B]">Contact Atelier</Link>
          </div>

        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;