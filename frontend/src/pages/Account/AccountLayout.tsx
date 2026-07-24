import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import Security from './Security';
import ErrorBoundary from './ErrorBoundary';
import AddressBook from './AddressBook';
import WishlistTab from './WishlistTab';
import OrdersTab from './OrdersTab';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export const AccountLayout: React.FC = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('orders');

  const navItems = [
    { id: 'orders', label: 'My Studio' },
    { id: 'wishlist', label: 'Saved Inspirations' },
    { id: 'learning', label: 'Learning Guild' },
    { id: 'profile', label: 'Profile' },
    { id: 'addresses', label: 'Addresses' },
  ];

  // Handle intersection observer to highlight active tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FAF9F7] min-h-screen font-sans">
      
      {/* Sticky Horizontal Navigation */}
      <div className="sticky top-0 z-40 bg-[#FAF9F7]/90 backdrop-blur-sm border-b border-neutral-200/50 pt-4">
        <div className="max-w-5xl mx-auto px-6 md:px-16 flex justify-between items-end">
          <div className="flex overflow-x-auto scrollbar-none gap-6 md:gap-12 pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`whitespace-nowrap font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors pb-1 border-b ${
                  activeSection === item.id
                    ? 'border-[#1C1C1B] text-[#1C1C1B] font-semibold'
                    : 'border-transparent text-neutral-400 hover:text-[#1C1C1B]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button 
            onClick={logout}
            className="hidden md:flex items-center gap-2 pb-4 text-xs font-sans tracking-widest uppercase text-neutral-400 hover:text-[#A34A38] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 md:px-16 py-16 md:py-24 space-y-32">
        {/* Editorial Hero */}
        <div className="max-w-2xl text-center mx-auto space-y-6 pt-12 md:pt-24 pb-8 md:pb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-neutral-500">
            Personal Studio
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-light text-[#1C1C1B] leading-tight italic">
            Where every handmade memory lives.
          </h1>
        </div>

        <ErrorBoundary>
          <div id="orders" className="scroll-mt-32">
            <OrdersTab />
          </div>

          <div id="wishlist" className="scroll-mt-32 pt-16 border-t border-neutral-200/50">
            <WishlistTab />
          </div>

          <div id="learning" className="scroll-mt-32 pt-16 border-t border-neutral-200/50">
            <div className="space-y-12">
              <div className="text-center">
                <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
                  Learning Guild
                </span>
                <h3 className="font-serif text-3xl font-light text-[#1C1C1B]">
                  Your Journey
                </h3>
              </div>
              <div className="flex justify-center">
                <div className="border border-neutral-200/50 p-8 max-w-sm w-full text-center bg-white space-y-4 shadow-sm">
                  <p className="font-sans text-sm text-neutral-600">Continue Learning</p>
                  <p className="font-serif text-2xl text-[#1C1C1B] italic">French Knots</p>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">12 min remaining</p>
                  <button className="mt-4 px-6 py-2 border border-[#1C1C1B] text-xs font-sans uppercase tracking-widest hover:bg-[#1C1C1B] hover:text-white transition-colors">
                    Resume Module
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="profile" className="scroll-mt-32 pt-16 border-t border-neutral-200/50">
            <div className="space-y-24">
              <Profile />
              <Security />
            </div>
          </div>

          <div id="addresses" className="scroll-mt-32 pt-16 border-t border-neutral-200/50">
            <AddressBook />
          </div>
          
          {/* Mobile Sign out */}
          <div className="pt-24 flex justify-center md:hidden">
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-neutral-400 hover:text-[#A34A38] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default AccountLayout;
