import React from 'react';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';

export default function JustForYou() {
  const items = [
    { name: "Botanical Wreath Kit", price: "$44", size: "tall" },
    { name: "Modern Grid Set", price: "$38", size: "small" },
    { name: "Forest Walk Pattern", price: "$29", size: "small" },
    { name: "Sage Linen Bundle", price: "$55", size: "medium" },
    { name: "Thread Palette Box", price: "$22", size: "medium" },
  ];

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
              <ScrollReveal key={i} direction="up" className={classNames}>
                <div 
                  className="relative group cursor-pointer overflow-hidden h-full w-full transition-transform duration-300 hover:scale-[1.02]" 
                  style={{ backgroundColor: `hsl(${28 + i * 15}, 22%, ${78 - i * 3}%)` }}
                >
                  {/* Decorative pattern/placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-primary-container/30" />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  
                  {/* Content label */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-inverse-on-surface/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 z-20 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                    <p className="font-sans text-xs sm:text-sm text-primary-container font-medium truncate max-w-[140px] sm:max-w-[180px] md:max-w-none">
                      {item.name}
                    </p>
                    <p className="font-sans text-[10px] sm:text-xs text-on-secondary-container mt-0.5">
                      {item.price}
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