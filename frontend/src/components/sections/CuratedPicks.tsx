import React from 'react';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';
import { mockProducts } from '../../data/products';

export default function CuratedPicks() {
  const items = mockProducts.slice(0, 5);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-on-secondary-container mb-2">
            Just For You
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-primary-container">
            Curated Picks
          </h2>
        </ScrollReveal>
        
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          {items.map((item, i) => {
            // Responsive grid classes
            let classNames = "";
            
            if (i === 0) {
              // First item - full width on all screens
              classNames = "col-span-1 sm:col-span-2 lg:col-span-8 h-[280px] sm:h-[300px] md:h-[340px]";
            } else if (i === 1) {
              // Second item - full width on mobile, half on tablet, 4 cols on desktop
              classNames = "col-span-1 sm:col-span-1 lg:col-span-4 h-[240px] sm:h-[280px] md:h-[340px]";
            } else if (i === 2) {
              // Third item - full width on mobile, half on tablet, 4 cols on desktop
              classNames = "col-span-1 sm:col-span-1 lg:col-span-4 h-[200px] sm:h-[220px] md:h-[260px]";
            } else if (i === 3) {
              // Fourth item - full width on mobile, half on tablet, 4 cols on desktop
              classNames = "col-span-1 sm:col-span-1 lg:col-span-4 h-[200px] sm:h-[220px] md:h-[260px]";
            } else if (i === 4) {
              // Fifth item - full width on mobile and tablet, 4 cols on desktop
              classNames = "col-span-1 sm:col-span-2 lg:col-span-4 h-[200px] sm:h-[220px] md:h-[260px]";
            }
            
            return (
              <ScrollReveal key={item.id || i} direction="up" className={classNames}>
                <div 
                  className="relative group cursor-pointer overflow-hidden h-full w-full transition-transform duration-300 hover:scale-[1.02] bg-[#f4ebd9]" 
                >
                  {item.images && item.images.length > 0 && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 w-full h-full bg-[#1C1C1B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  
                  {/* Content label */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-[#FAF9F7]/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 z-20 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md border border-neutral-200/40">
                    <p className="font-sans text-xs sm:text-sm text-[#1C1C1B] font-medium truncate max-w-[140px] sm:max-w-[180px] md:max-w-none">
                      {item.name}
                    </p>
                    <p className="font-sans text-[10px] sm:text-xs text-[#735947] mt-0.5">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}