import React, { useState, useEffect } from 'react';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';
import { productService } from '../../services/productService';
import type { Product } from '../../data/products';
import { Link } from 'react-router-dom';

export default function CuratedPicks() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getFeaturedProducts()
      .then(data => {
        setItems(data.slice(0, 5));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching curated picks:', err);
        setLoading(false);
      });
  }, []);

  // Helper for responsive grid heights and mobile carousel width
  const getGridClasses = (index: number) => {
    const base = "w-[75vw] flex-shrink-0 snap-center md:w-auto";
    switch (index) {
      case 0:
        return `${base} col-span-1 sm:col-span-2 lg:col-span-8 h-[280px] sm:h-[300px] md:h-[340px]`;
      case 1:
        return `${base} col-span-1 sm:col-span-1 lg:col-span-4 h-[240px] sm:h-[280px] md:h-[340px]`;
      case 2:
        return `${base} col-span-1 sm:col-span-1 lg:col-span-4 h-[200px] sm:h-[220px] md:h-[260px]`;
      case 3:
        return `${base} col-span-1 sm:col-span-1 lg:col-span-4 h-[200px] sm:h-[220px] md:h-[260px]`;
      case 4:
      default:
        return `${base} col-span-1 sm:col-span-2 lg:col-span-4 h-[200px] sm:h-[220px] md:h-[260px]`;
    }
  };

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
        
        <StaggerContainer className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 pb-4 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`animate-pulse bg-neutral-200 ${getGridClasses(i)}`} />
            ))
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-400">
              No curated products found.
            </div>
          ) : (
            items.map((item, i) => {
              const classNames = getGridClasses(i);
              
              return (
                <ScrollReveal key={item.id || i} direction="up" className={classNames}>
                  <Link 
                    to={`/shop/${item.id}`}
                    className="relative group cursor-pointer overflow-hidden h-full w-full block transition-transform duration-300 hover:scale-[1.02] bg-[#f4ebd9]" 
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
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })
          )}
        </StaggerContainer>
      </div>
    </section>
  );
}