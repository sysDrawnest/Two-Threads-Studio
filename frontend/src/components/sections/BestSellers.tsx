import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';
import { mockProducts } from '../../data/products';

export default function BestSellers() {
  const [selectedRoom, setSelectedRoom] = useState<'All' | 'Living Room' | 'Bedrooms' | 'Bathrooms'>('All');

  // Map products to rooms
  const productRooms: { [key: string]: 'Living Room' | 'Bedrooms' | 'Bathrooms' } = {
    p1: 'Living Room',
    p2: 'Bedrooms',
    p3: 'Bedrooms',
    p4: 'Bathrooms',
    p5: 'Living Room',
    p6: 'Bathrooms',
    p7: 'Living Room',
    p8: 'Bathrooms'
  };

  const rooms = ['All', 'Living Room', 'Bedrooms', 'Bathrooms'] as const;

  // Filter products by room
  const filteredProducts = mockProducts.filter(p => {
    if (selectedRoom === 'All') return p.badge === 'Best Seller' || p.badge === 'Limited';
    return productRooms[p.id] === selectedRoom;
  });

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-2 font-medium">Curated Spaces</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B]">
            Most Loved Designs
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 mt-2">
            Explore premium hand-stitch kits and heirlooms by room
          </p>

          {/* Room Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`font-sans text-[10px] sm:text-xs tracking-wider uppercase px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                  selectedRoom === room
                    ? 'bg-[#1C1C1B] text-[#FAF9F7] border-[#1C1C1B]'
                    : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {room === 'All' ? 'All Bestsellers' : room}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filteredProducts.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" distance={20} delay={0.1 * i}>
              <Link 
                to={`/shop/${p.id}`}
                className="group block bg-white cursor-pointer shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 no-underline"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-[#f4f2ee]">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" 
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-[#A34A38] text-white text-[8px] sm:text-[9px] tracking-[0.15em] px-2 py-0.5 sm:py-1 uppercase font-sans">
                      {p.badge}
                    </span>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 sm:p-5">
                  <p className="font-serif text-sm sm:text-base text-[#1C1C1B] leading-tight group-hover:text-[#A34A38] transition-colors">{p.name}</p>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="font-sans text-[9px] text-neutral-400 tracking-wider uppercase">{productRooms[p.id]}</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-[#1C1C1B]">₹{p.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}