import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { featuredCollections } from '../../data/featuredCollections';
import { mockProducts } from '../../data/products';

// Helper to compute dynamic product counts from the mock catalog database
const getProductCount = (slug: string): number => {
  switch (slug) {
    case 'botanical':
      return mockProducts.filter(p => p.collection === 'Botanical').length;
    case 'heritage':
      // Heritage maps to "Cottage" collection in our product database
      return mockProducts.filter(p => p.collection === 'Cottage').length;
    case 'modern-minimal':
      // Modern Minimal maps to "Linen" collection in our product database
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
  return (
    <section id="featured-collections" className="py-8 sm:py-12 md:py-20 px-4 sm:px-6 md:px-16 bg-[#ede6de]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center mb-6 md:mb-12">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500 mb-2">
            Signature Collections
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-3 md:mb-4">
            Featured Collections
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5a4a3f] leading-relaxed max-w-xl mx-auto">
            Discover our signature collections, each thoughtfully curated around a unique story, crafted for modern makers and collectors.
          </p>
          <div className="md:hidden border-t border-dotted border-outline-variant max-w-[80px] mx-auto mt-4" />
        </ScrollReveal>

        {/* Asymmetrical Editorial Grid / Mobile Swipe Gallery */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {featuredCollections.map((collection, index) => {
            const count = getProductCount(collection.slug);
            
            // Asymmetric grid column spans:
            const isWide = index === 0 || index === 3 || index === 4;
            const gridSpanClass = isWide 
              ? "col-span-1 md:col-span-2 lg:col-span-2" 
              : "col-span-1 md:col-span-1 lg:col-span-1";
            
            // On mobile (< md), force 3:4 aspect ratio. On desktop (>= md), wide items use 3:2/16:10 while narrow items use 4:5
            const imageAspectClass = isWide
              ? "aspect-[3/4] md:aspect-[3/2] lg:aspect-[16/10]"
              : "aspect-[3/4] md:aspect-[4/5]";

            return (
              <ScrollReveal 
                key={collection.id} 
                direction="up" 
                delay={index * 0.05}
                className={`group flex flex-col justify-between border border-[#c0b4a4]/40 bg-white/50 p-4 md:p-8 rounded-none transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 w-[85vw] flex-shrink-0 snap-center md:w-auto ${gridSpanClass}`}
              >
                <a 
                  href={`/shop?collection=${collection.slug}`}
                  className="no-underline flex flex-col h-full justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className={`relative overflow-hidden mb-4 md:mb-6 rounded-none ${imageAspectClass}`}>
                      {/* Optional Badge */}
                      {collection.badge && (
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
                          <span className="bg-[#1C1C1B]/95 text-white font-sans text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 md:px-3 md:py-1.5 rounded-none">
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
                    <div className="flex justify-between items-baseline mb-2 md:mb-3">
                      <h3 className="font-serif text-xl md:text-2xl font-light text-primary-container transition-colors duration-300 group-hover:text-[#A34A38]">
                        {collection.title}
                      </h3>
                      <span className="font-sans text-[10px] tracking-wider text-neutral-500 uppercase whitespace-nowrap">
                        {count} {count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>

                    {/* Divider */}
                    <hr className="border-t border-neutral-300/40 my-2 md:my-3" />

                    {/* Description */}
                    <p className="font-sans text-xs md:text-sm leading-relaxed text-[#5a4a3f] mb-4">
                      {collection.description}
                    </p>
                  </div>

                  {/* Luxury CTA */}
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
