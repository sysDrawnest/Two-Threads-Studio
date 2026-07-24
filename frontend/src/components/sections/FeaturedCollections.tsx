import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import { featuredCollections } from '../../data/featuredCollections';
import { mockProducts } from '../../data/products';

// Helper to compute dynamic product counts
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.75));
      setActiveIndex(Math.min(index, featuredCollections.length - 1));
    }
  };

  return (
    <section id="featured-collections" className="py-16 md:py-24 bg-[#fef8f3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
        
        {/* Section Header - Styled after luxury high-fashion editorial reference */}
        <ScrollReveal direction="up" className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B] tracking-[0.12em] uppercase leading-tight">
            Featured <br className="sm:hidden" /> Collections
          </h2>
          <div className="w-12 h-[1px] bg-[#A34A38]/40 mx-auto mt-4 mb-3" />
          <p className="font-sans text-xs md:text-sm text-[#5a4a3f] tracking-widest uppercase max-w-md mx-auto">
            Signature Handcrafted Edit
          </p>
        </ScrollReveal>

        {/* Mobile & Tablet Horizontal Scroll Carousel / Desktop 3-Col Grid */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 pb-4 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
        >
          {featuredCollections.map((collection, index) => {
            const count = getProductCount(collection.slug);

            return (
              <ScrollReveal 
                key={collection.id} 
                direction="up" 
                delay={index * 0.06}
                className="w-[82vw] sm:w-[340px] md:w-auto flex-shrink-0 snap-center group"
              >
                <Link 
                  to={`/shop?collection=${collection.slug}`}
                  className="no-underline block relative overflow-hidden aspect-[9/14] sm:aspect-[3/4] md:aspect-[3/4.5] shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  {/* Background Image */}
                  <img 
                    src={collection.image} 
                    alt={collection.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Bottom Dark Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end items-center p-5 md:p-6 text-center z-10">
                    
                    {/* Badge / Tag if available */}
                    {collection.badge && (
                      <span className="bg-white/90 text-[#1C1C1B] font-sans text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium mb-3 shadow-sm">
                        {collection.badge}
                      </span>
                    )}

                    {/* Small Description Text on top of button */}
                    <p className="font-sans text-xs text-white/95 leading-relaxed mb-3 line-clamp-2 max-w-[95%] drop-shadow-md">
                      {collection.description}
                    </p>

                    {/* Clean White Button with Collection Title */}
                    <div className="w-full bg-white text-[#1C1C1B] py-3.5 px-4 font-serif text-xs md:text-sm tracking-[0.16em] uppercase font-semibold text-center shadow-lg transition-all duration-300 transform group-hover:bg-[#fcfaf7] group-hover:scale-[1.01]">
                      {collection.title}
                    </div>
                  </div>

                  {/* Product Count Tag (Top Right) */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-[#1C1C1B]/80 text-white/90 font-sans text-[9px] tracking-widest uppercase px-2.5 py-1 backdrop-blur-sm">
                      {count} {count === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Mobile Scroll Indicator Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-6 md:hidden">
          {featuredCollections.map((_, i) => (
            <div 
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-6 bg-[#1C1C1B]' : 'w-1.5 bg-[#1C1C1B]/20'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
