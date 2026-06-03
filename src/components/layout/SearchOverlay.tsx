import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockProducts } from '../../data/products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const suggestedTerms = ["Botanical Kits", "Beginner Embroidery", "Linen Fabric", "Floral Patterns", "Advanced Masterclasses"];
  const popularProducts = mockProducts.slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
        >
          {/* Header & Input */}
          <div className="w-full border-b border-outline-variant pt-8 pb-6 px-6 md:px-16 flex items-center gap-6">
            <svg width="24" height="24" fill="none" stroke="#2d2520" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search for kits, patterns, or tutorials..." 
              className="flex-1 bg-transparent border-none outline-none font-serif text-2xl md:text-4xl text-primary-container placeholder:text-on-surface-variant/50"
            />
            <button 
              onClick={onClose}
              className="bg-transparent border border-outline-variant text-on-surface-variant px-6 py-3 font-sans text-xs tracking-widest uppercase cursor-pointer hover:bg-surface-variant transition-colors rounded-full flex-shrink-0"
            >
              Close
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-6 md:px-16 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
              
              {/* Suggested Terms */}
              <div className="col-span-1">
                <h3 className="font-sans text-xs uppercase tracking-[0.3em] text-on-secondary-container mb-6">Suggested Searches</h3>
                <ul className="list-none p-0 flex flex-col gap-4">
                  {suggestedTerms.map((term, i) => (
                    <li key={i}>
                      <button className="bg-transparent border-none cursor-pointer font-serif text-xl text-primary-container hover:text-on-secondary-container transition-colors text-left">
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Products */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-sans text-xs uppercase tracking-[0.3em] text-on-secondary-container mb-6">Popular Right Now</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {popularProducts.map(product => (
                    <Link 
                      key={product.id} 
                      to={`/shop/${product.id}`}
                      onClick={onClose}
                      className="group no-underline block"
                    >
                      <div className="aspect-[4/5] bg-surface-container overflow-hidden mb-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-serif text-lg text-primary-container mb-1 group-hover:text-on-secondary-container transition-colors line-clamp-1">{product.name}</h4>
                      <p className="font-sans text-sm text-[#5a4a3f]">${product.price}</p>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
