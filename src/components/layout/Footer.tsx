import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const cols = [
    { title: "Shop", links: ["New Arrivals", "Kits & Bundles", "Patterns", "Threads & Fabric", "Gift Cards"] },
    { title: "Learn", links: ["Video Tutorials", "Beginner Guide", "Stitch Library", "Pattern Downloads", "Community"] },
    { title: "Studio", links: ["Our Story", "Sustainability", "Collaborations", "Press", "Careers"] },
    { title: "Support", links: ["FAQ", "Shipping Info", "Returns", "Track Order", "Contact Us"] },
  ];

  return (
    <footer className="bg-[#1e1812] pt-20 px-6 md:px-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
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
            <div key={i}>
              <h4 className="font-sans text-xs tracking-widest uppercase text-inverse-on-surface/60 mb-5">
                {col.title}
              </h4>
              {col.links.map(l => (
                <Link 
                  key={l} 
                  to="#" 
                  className="block font-sans text-sm text-inverse-on-surface/45 no-underline mb-3 leading-relaxed hover:text-inverse-on-surface/70 transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>
          ))}
        </div>
        
        <div className="border-t border-inverse-on-surface/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-inverse-on-surface/30">
            © 2026 TwoThreads Studio. All rights reserved.
          </p>
          <p className="font-sans text-xs text-inverse-on-surface/30">
            Privacy Policy · Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
