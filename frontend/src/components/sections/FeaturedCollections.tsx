import React, { useState, useRef } from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { featuredCollections } from '../../data/featuredCollections';
import { mockProducts } from '../../data/products';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper to compute dynamic product counts from the mock catalog database
const getProductCount = (slug: string): number => {
  switch (slug) {
    case 'botanical':
      return mockProducts.filter(p => p.collection === 'Botanical').length;
    case 'heritage':
      return mockProducts.filter(p => p.collection === 'Cottage').length;
    case 'modern-minimal':
      return mockProducts.filter(p => p.collection === 'Linen').length;
    case 'handbags':
      return mockProducts.filter(p => p.category === 'Handbag' || p.productCategory === 'Handbags').length;
    case 'wedding-keepsakes':
      return mockProducts.filter(p => p.occasion?.includes('Wedding') || p.occasion?.includes('Anniversary')).length;
    case 'seasonal-editions':
      return mockProducts.filter(p => p.collection === 'Seasonal' || p.occasion?.includes('Festive')).length;
    default:
      return 0;
  }
};

export default function FeaturedCollections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = featuredCollections.length;

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section id="featured-collections" className="py-12 md:py-20 px-4 sm:px-6 md:px-16 bg-[#ede6de] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center mb-8 md:mb-12">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] font-medium mb-2">
            Signature Collections
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1C1C1B] mb-3 md:mb-4">
            Featured Collections
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5a4a3f] leading-relaxed max-w-xl mx-auto">
            Discover our signature collections, each thoughtfully curated around a unique story, crafted for modern makers and collectors.
          </p>
        </ScrollReveal>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* MOBILE (< md): STAGGERED 3D CAROUSEL WITH DEPTH OF FIELD & BLUR    */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="md:hidden relative py-6">
          <div
            className="relative h-[530px] flex items-center justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {featuredCollections.map((collection, index) => {
              const count = getProductCount(collection.slug);

              // Calculate shortest cyclic distance
              let rawOffset = index - activeIndex;
              if (rawOffset > total / 2) rawOffset -= total;
              if (rawOffset < -total / 2) rawOffset += total;

              const isCenter = rawOffset === 0;
              const absOffset = Math.abs(rawOffset);

              // Don't render cards that are far away in the stack
              if (absOffset > 2) return null;

              // Compute 3D transformation properties
              let translateX = 0;
              let scale = 1;
              let opacity = 1;
              let blur = '0px';
              let zIndex = 30;

              if (rawOffset === 1) {
                translateX = 62; // % shift right
                scale = 0.84;
                opacity = 0.65;
                blur = '2px';
                zIndex = 20;
              } else if (rawOffset === -1) {
                translateX = -62; // % shift left
                scale = 0.84;
                opacity = 0.65;
                blur = '2px';
                zIndex = 20;
              } else if (rawOffset >= 2) {
                translateX = 100;
                scale = 0.72;
                opacity = 0.3;
                blur = '5px';
                zIndex = 10;
              } else if (rawOffset <= -2) {
                translateX = -100;
                scale = 0.72;
                opacity = 0.3;
                blur = '5px';
                zIndex = 10;
              }

              return (
                <div
                  key={collection.id}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    transform: `translateX(${translateX}%) scale(${scale})`,
                    opacity,
                    filter: `blur(${blur})`,
                    zIndex,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className={`
                    absolute w-[82vw] max-w-[340px] cursor-pointer select-none
                    border border-[#c0b4a4]/50 bg-white/60 backdrop-blur-md p-4 rounded-3xl
                    shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]
                  `}
                >
                  <a
                    href={`/shop?collection=${collection.slug}`}
                    onClick={(e) => {
                      if (!isCenter) e.preventDefault();
                    }}
                    className="no-underline block"
                  >
                    {/* Image Container (3:4 Uniform Aspect Ratio) */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-[#e8e1d9]">
                      {/* Floating Badge (Top Left) */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-[#1C1C1B]/95 text-white font-sans text-[8px] tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-md font-medium">
                          {collection.badge || 'FEATURED'}
                        </span>
                      </div>

                      {/* Product Counter (Top Right) */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-white/80 backdrop-blur-sm text-[#1C1C1B] font-mono text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#c0b4a4]/40 font-medium">
                          {count} PRODUCTS
                        </span>
                      </div>

                      <img
                        src={collection.image}
                        alt={collection.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Collection Metadata */}
                    <div className="text-center px-1">
                      <h3 className="font-serif text-xl font-light text-[#1C1C1B] mb-1.5 leading-tight">
                        {collection.title}
                      </h3>
                      <p className="font-sans text-xs text-[#5a4a3f] leading-relaxed line-clamp-2 mb-3">
                        {collection.description}
                      </p>

                      {/* CTA */}
                      <div className="inline-flex items-center justify-center gap-1.5 font-sans text-[10px] tracking-[0.2em] uppercase text-[#A34A38] font-medium border-b border-[#A34A38]/40 pb-0.5">
                        <span>VIEW COLLECTION</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls & Pagination Indicators */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={handlePrev}
              aria-label="Previous collection"
              className="w-9 h-9 rounded-full bg-white/80 border border-[#c0b4a4]/40 flex items-center justify-center text-[#1C1C1B] active:scale-95 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {featuredCollections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-[#A34A38]' : 'w-1.5 bg-[#c0b4a4]/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              aria-label="Next collection"
              className="w-9 h-9 rounded-full bg-white/80 border border-[#c0b4a4]/40 flex items-center justify-center text-[#1C1C1B] active:scale-95 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* DESKTOP (>= md): APPROVED ASYMMETRICAL EDITORIAL GRID                */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {featuredCollections.map((collection, index) => {
            const count = getProductCount(collection.slug);
            
            const isWide = index === 0 || index === 3 || index === 4;
            const gridSpanClass = isWide 
              ? "col-span-1 md:col-span-2 lg:col-span-2" 
              : "col-span-1 md:col-span-1 lg:col-span-1";
            
            const imageAspectClass = isWide
              ? "aspect-[3/2] lg:aspect-[16/10]"
              : "aspect-[4/5]";

            return (
              <ScrollReveal 
                key={collection.id} 
                direction="up" 
                delay={index * 0.05}
                className={`group flex flex-col justify-between border border-[#c0b4a4]/40 bg-white/50 p-6 md:p-8 rounded-none transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 ${gridSpanClass}`}
              >
                <a 
                  href={`/shop?collection=${collection.slug}`}
                  className="no-underline flex flex-col h-full justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className={`relative overflow-hidden mb-6 ${imageAspectClass}`}>
                      {collection.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-[#1C1C1B]/95 text-white font-sans text-[8px] tracking-[0.2em] uppercase px-3 py-1.5">
                            {collection.badge}
                          </span>
                        </div>
                      )}
                      
                      <img 
                        src={collection.image} 
                        alt={collection.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Metadata Header */}
                    <div className="flex justify-between items-baseline mb-3">
                      <h3 className="font-serif text-2xl font-light text-primary-container transition-colors duration-300 group-hover:text-[#A34A38]">
                        {collection.title}
                      </h3>
                      <span className="font-sans text-[10px] tracking-wider text-neutral-500 uppercase whitespace-nowrap">
                        {count} {count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>

                    <hr className="border-t border-neutral-300/40 my-3" />

                    <p className="font-sans text-sm leading-relaxed text-[#5a4a3f] mb-4">
                      {collection.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="inline-flex items-center font-sans text-xs tracking-[0.2em] uppercase text-primary-container font-medium mt-auto pt-2">
                    <span className="relative py-1">
                      View Collection
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary-container transition-all duration-300 group-hover:w-full" />
                    </span>
                    <svg 
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
