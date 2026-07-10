import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link } from 'react-router-dom';

const Membership: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero */}
      <section className="bg-primary-container text-inverse-on-surface pt-24 pb-32 px-6 md:px-16 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
            The Artisan Guild
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light mb-6 text-white">
            Join the inner circle of makers.
          </h1>
          <p className="font-sans text-sm text-white/80 leading-loose max-w-2xl mx-auto">
            Unlock exclusive patterns, early access to limited edition kits, and unlimited access to the entire TwoThreads Learning Hub.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-6 md:px-16 bg-background -mt-20 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Artisan Tier */}
          <div className="bg-white border border-outline-variant p-8 md:p-12 flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-500">
            <h2 className="font-serif text-3xl text-primary-container mb-2">Artisan Tier</h2>
            <div className="flex items-end gap-2 mb-8 border-b border-outline-variant pb-8">
              <span className="font-serif text-5xl text-primary-container">$12</span>
              <span className="font-sans text-sm text-on-surface-variant mb-2">/ month</span>
            </div>
            
            <ul className="flex-1 flex flex-col gap-6 mb-12">
              {[
                "Unlimited access to Beginner & Intermediate courses",
                "1 new digital pattern download per month",
                "10% off all physical kits in the shop",
                "Access to the private community forum"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-4">
                  <svg className="flex-shrink-0 mt-1" width="16" height="16" fill="none" stroke="#2d2520" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
                  <span className="font-sans text-sm text-[#5a4a3f] leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-transparent text-primary-container border border-primary-container px-6 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors">
              Subscribe to Artisan
            </button>
          </div>

          {/* Master Tier */}
          <div className="bg-primary-container border border-primary-container p-8 md:p-12 flex flex-col shadow-lg transform md:-translate-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-serif text-3xl text-inverse-on-surface">Master Tier</h2>
              <span className="bg-on-secondary-container text-inverse-on-surface font-sans text-[10px] tracking-widest px-3 py-1 uppercase">Most Popular</span>
            </div>
            <div className="flex items-end gap-2 mb-8 border-b border-white/20 pb-8">
              <span className="font-serif text-5xl text-inverse-on-surface">$28</span>
              <span className="font-sans text-sm text-white/70 mb-2">/ month</span>
            </div>
            
            <ul className="flex-1 flex flex-col gap-6 mb-12">
              {[
                "Unlimited access to ALL courses, including Advanced Masterclasses",
                "3 new digital pattern downloads per month",
                "20% off all physical kits and supplies",
                "Free expedited shipping on all orders",
                "Monthly live Q&A sessions with featured artists"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-4">
                  <svg className="flex-shrink-0 mt-1" width="16" height="16" fill="none" stroke="#f5f0eb" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
                  <span className="font-sans text-sm text-white/90 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-white text-primary-container px-6 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-surface-variant transition-colors border-none">
              Subscribe to Master
            </button>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container mb-6">
            Membership FAQ
          </h2>
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="font-serif text-xl text-primary-container mb-3">Can I cancel anytime?</h4>
            <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">Yes, you can cancel your subscription at any time from your account dashboard. You will retain access until the end of your billing cycle.</p>
          </div>
          <div>
            <h4 className="font-serif text-xl text-primary-container mb-3">How do I access courses?</h4>
            <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">Once subscribed, all eligible courses in the Learning Hub will be automatically unlocked when you are logged into your account.</p>
          </div>
          <div>
            <h4 className="font-serif text-xl text-primary-container mb-3">Are physical kits included?</h4>
            <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">Memberships cover digital courses and pattern downloads. However, members receive significant discounts and free shipping on physical kits.</p>
          </div>
          <div>
            <h4 className="font-serif text-xl text-primary-container mb-3">Can I upgrade my tier later?</h4>
            <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">Absolutely. You can upgrade from Artisan to Master at any time, and your first month will be prorated.</p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Membership;
