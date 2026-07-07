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
    <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Best Sellers</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            Most Loved Designs
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <ScrollReveal key={i} direction="up" distance={20}>
              <div className="bg-white cursor-pointer shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                <div className="h-64 relative" style={{ backgroundColor: `hsl(${30 + i * 15}, 20%, ${85 - i * 3}%)` }}>
                  {p.tag && (
                    <span className="absolute top-3 left-3 bg-primary-container text-inverse-on-surface text-[10px] tracking-[0.15em] px-2.5 py-1 uppercase font-sans">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-4 pb-5">
                  <p className="font-sans text-sm text-primary-container">{p.name}</p>
                  <p className="font-sans text-sm text-on-secondary-container mt-1">{p.price}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
