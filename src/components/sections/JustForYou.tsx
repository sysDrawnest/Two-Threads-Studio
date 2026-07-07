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
    <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Just For You</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            Curated Picks
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {items.map((item, i) => {
            const classNames = [
              "md:col-span-12 lg:col-span-8 h-[340px]",
              "md:col-span-6 lg:col-span-4 h-[340px]",
              "md:col-span-6 lg:col-span-4 h-[260px]",
              "md:col-span-6 lg:col-span-4 h-[260px]",
              "md:col-span-12 lg:col-span-4 h-[260px]"
            ];
            
            return (
              <ScrollReveal key={i} direction="up" className={classNames[i]}>
                <div className="relative group cursor-pointer overflow-hidden h-full w-full" style={{ backgroundColor: `hsl(${28 + i * 15}, 22%, ${78 - i * 3}%)` }}>
                  <div className="absolute inset-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <div className="absolute bottom-4 left-4 bg-inverse-on-surface/90 px-4 py-2.5 z-20 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                    <p className="font-sans text-sm text-primary-container font-medium">{item.name}</p>
                    <p className="font-sans text-xs text-on-secondary-container mt-0.5">{item.price}</p>
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
