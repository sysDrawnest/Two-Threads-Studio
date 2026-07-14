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
    <section id="featured-collections" className="py-24 px-6 md:px-16 bg-[#ede6de]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-neutral-500 mb-2">
            Signature Collections
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-4">
            Featured Collections
          </h2>
          <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed max-w-xl mx-auto">
            Discover our signature collections, each thoughtfully curated around a unique story, crafted for modern makers and collectors.
          </p>
          <div className="md:hidden border-t border-dotted border-outline-variant max-w-[80px] mx-auto mt-6" />
        </ScrollReveal>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {featuredCollections.map((collection, index) => {
            const count = getProductCount(collection.slug);
            
            // Asymmetric grid column spans:
            // Index 0: 2 cols on desktop/tablet
            // Index 1: 1 col
            // Index 2: 1 col
            // Index 3: 2 cols on desktop/tablet
            // Index 4: 2 cols on desktop/tablet
            // Index 5: 1 col
            const isWide = index === 0 || index === 3 || index === 4;
            const gridSpanClass = isWide 
              ? "col-span-1 md:col-span-2 lg:col-span-2" 
              : "col-span-1 md:col-span-1 lg:col-span-1";
            
            // Wide vs Tall aspect ratios for editorial feel
            const imageAspectClass = isWide
              ? "aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/10]"
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
                    <div className={`relative overflow-hidden mb-6 rounded-none ${imageAspectClass}`}>
                      {/* Optional Badge */}
                      {collection.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-[#1C1C1B]/95 text-white font-sans text-[8px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-none">
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

                    {/* Divider */}
                    <hr className="border-t border-neutral-300/40 my-3" />

                    {/* Description */}
                    <p className="font-sans text-sm leading-relaxed text-[#5a4a3f] mb-4">
                      {collection.description}
                    </p>
                    
                    {/* Curated Products List */}
                    <p className="font-sans text-[11px] tracking-wider text-[#A34A38]/80 italic mb-6">
                      Featuring: {collection.productsSummary}
                    </p>
                  </div>

                  {/* Luxury CTA */}
                  <div className="inline-flex items-center font-sans text-xs tracking-[0.2em] uppercase text-primary-container font-medium mt-auto">
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
