import React from 'react';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';

export default function BestSellers() {
  const products = [
    { name: "Meadow Hoop Kit", price: "$42", tag: "Best Seller" },
    { name: "Garden Botanicals", price: "$56", tag: "New" },
    { name: "Linen Starter Set", price: "$35", tag: "" },
    { name: "Forest Creatures", price: "$48", tag: "Best Seller" },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Best Sellers</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-primary-container">
            Most Loved Designs
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((p, i) => (
            <ScrollReveal key={i} direction="up" distance={20}>
              <div className="bg-white cursor-pointer shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                <div 
                  className="h-48 sm:h-56 md:h-64 relative" 
                  style={{ backgroundColor: `hsl(${30 + i * 15}, 20%, ${85 - i * 3}%)` }}
                >
                  {p.tag && (
                    <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-primary-container text-inverse-on-surface text-[8px] sm:text-[10px] tracking-[0.15em] px-2 py-0.5 sm:py-1 uppercase font-sans">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4 pb-4 sm:pb-5">
                  <p className="font-sans text-xs sm:text-sm text-primary-container leading-tight">{p.name}</p>
                  <p className="font-sans text-xs sm:text-sm text-on-secondary-container mt-1">{p.price}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}