import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface FooterProps {
  topBgClass?: string;
}

const Footer: React.FC<FooterProps> = ({ topBgClass }) => {
  const location = useLocation();

  // Determine top background class dynamically based on prop or route
  const getTopBgClass = () => {
    if (topBgClass) return topBgClass;
    if (location.pathname === '/') return 'bg-[#2d2520]'; // Homepage bottom section color
    return 'bg-background'; // Default page background color (#fef8f3)
  };

  const resolvedTopBg = getTopBgClass();

  const cols = [
    { 
      title: "Shop", 
      links: [
        { name: "New Arrivals", path: "/shop" },
        { name: "Kits & Bundles", path: "/shop" },
        { name: "Patterns", path: "/shop" },
        { name: "Threads & Fabric", path: "/shop" },
        { name: "Gift Cards", path: "/shop" }
      ] 
    },
    { 
      title: "Learn", 
      links: [
        { name: "Video Tutorials", path: "/learning" },
        { name: "Beginner Guide", path: "/learning" },
        { name: "Stitch Library", path: "/learning" },
        { name: "Pattern Downloads", path: "/shop" },
        { name: "Community", path: "/gallery" }
      ] 
    },
    { 
      title: "Studio", 
      links: [
        { name: "Our Story", path: "/about" },
        { name: "Sustainability", path: "/sustainability" },
        { name: "Collaborations", path: "#" },
        { name: "Press", path: "#" },
        { name: "Careers", path: "/careers" }
      ] 
    },
    { 
      title: "Support", 
      links: [
        { name: "FAQ", path: "/contact" },
        { name: "Shipping Info", path: "/legal?tab=shipping" },
        { name: "Returns", path: "/legal?tab=returns" },
        { name: "Track Order", path: "/account?tab=orders" },
        { name: "Contact Us", path: "/contact" }
      ] 
    },
  ];

  const [openCol, setOpenCol] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleCol = (i: number) => {
    setOpenCol(openCol === i ? null : i);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <>
      <div className={`w-full overflow-hidden leading-none ${resolvedTopBg}`}>
        <svg 
          className="w-full h-[60px] md:h-[100px] lg:h-[140px] block" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#1e1812" 
            d="M0,120 L1440,120 L1440,40 C1100,140 800,0 400,80 C200,120 100,60 0,40 Z"
          />
        </svg>
      </div>
      <footer className="bg-[#1e1812] pt-8 md:pt-12 px-6 md:px-16 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
            <div className="lg:col-span-1">
              <h3 className="font-serif text-2xl text-inverse-on-surface font-light mb-4">
                TwoThreads Studio
              </h3>
              <p className="font-sans text-sm text-inverse-on-surface/50 leading-relaxed mb-6">
                Handmade embroidery kits and patterns, crafted with love.
              </p>
              <div className="flex gap-4">
                {["Instagram", "Pinterest", "YouTube"].map(s => (
                  <a key={s} href="#" className="font-sans text-xs text-on-secondary-container tracking-widest no-underline">
                    {s}
                  </a>
                ))}
              </div>
            </div>
            
            {cols.map((col, i) => (
              <div key={i} className="border-b border-inverse-on-surface/10 md:border-none pb-4 md:pb-0">
                <button 
                  type="button"
                  onClick={() => toggleCol(i)}
                  className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none"
                >
                  <h4 className="font-sans text-xs tracking-widest uppercase text-inverse-on-surface/60 md:mb-5">
                    {col.title}
                  </h4>
                  <ChevronDown size={14} className={`text-inverse-on-surface/60 md:hidden transition-transform ${openCol === i ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 md:!max-h-none ${openCol === i ? 'max-h-64 mt-4 md:mt-0' : 'max-h-0'}`}>
                  {col.links.map(l => (
                    <Link 
                      key={l.name} 
                      to={l.path} 
                      className="block font-sans text-sm text-inverse-on-surface/45 no-underline mb-3 leading-relaxed hover:text-inverse-on-surface/70 transition-colors"
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Newsletter Column */}
            <div className="md:col-span-2 lg:col-span-1 border-t border-inverse-on-surface/10 pt-6 md:border-none md:pt-0">
              <h4 className="font-sans text-xs tracking-widest uppercase text-inverse-on-surface/60 mb-5">
                Newsletter
              </h4>
              <p className="font-sans text-xs text-inverse-on-surface/50 leading-relaxed mb-4">
                Subscribe for early access, tutorials, and studio updates.
              </p>
              {submitted ? (
                <p className="font-serif text-sm text-on-secondary-container/90 mt-2">
                  Welcome to the community ✦
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="flex-1 min-w-0 px-3 py-2 bg-inverse-on-surface/5 border border-inverse-on-surface/15 text-inverse-on-surface font-sans text-xs outline-none focus:border-on-secondary-container/60 placeholder:text-inverse-on-surface/30"
                  />
                  <button
                    type="submit"
                    className="bg-on-secondary-container text-[#1e1812] px-3.5 py-2 font-sans text-[10px] tracking-widest uppercase font-semibold hover:opacity-90 transition-opacity outline-none"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-inverse-on-surface/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1.5 text-center md:text-left">
              <p className="font-sans text-xs text-inverse-on-surface/30">
                © 2026 TwoThreads Studio. A brand by SYS Pvt. Ltd. All rights reserved.
              </p>
              <p className="font-sans text-[10px] text-inverse-on-surface/20 tracking-wider">
                Crafted by TwoThreads Studio • A SYS Pvt. Ltd. Company
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/legal?tab=privacy" className="font-sans text-xs text-inverse-on-surface/30 hover:text-inverse-on-surface/50 no-underline transition-colors">
                Privacy Policy
              </Link>
              <span className="text-inverse-on-surface/20 text-xs">·</span>
              <Link to="/legal?tab=terms" className="font-sans text-xs text-inverse-on-surface/30 hover:text-inverse-on-surface/50 no-underline transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;