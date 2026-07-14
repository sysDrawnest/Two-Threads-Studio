import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function SacredTraditionsCollection() {
  return (
    <section className="relative h-[480px] md:h-[540px] flex items-center justify-start overflow-hidden bg-[#ECE8E1]">
      {/* Background Image of spools of natural yarns and threads */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558271881-3e527a036d0b?q=80&w=1600&auto=format&fit=crop"
          alt="Artisanal thread spools"
          className="w-full h-full object-cover object-center grayscale-[10%] brightness-[92%]"
          loading="lazy"
        />
        {/* Soft overlay to enrich contrast */}
        <div className="absolute inset-0 bg-[#1C1C1B]/10 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Floating Content Card */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal direction="right" className="max-w-md bg-[#FAF9F7]/95 backdrop-blur-md p-8 md:p-12 shadow-xl border border-neutral-200/40 rounded-sm">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.25em] text-[#A34A38] uppercase font-semibold mb-3">
            Inspired by Timeless India
          </p>
          <h2 className="font-serif text-2xl md:text-4xl font-light text-[#1C1C1B] leading-tight mb-4">
            Sacred Traditions Collection
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-500 leading-relaxed mb-8">
            Inspired by India's living heritage—from temple carvings and sacred symbols to ancient embroidery traditions—this collection celebrates craftsmanship, culture, and stories passed through generations.
          </p>
          <button 
            onClick={() => window.location.href = '/shop?collection=cultural'}
            className="bg-[#1C1C1B] text-[#FAF9F7] border border-[#1C1C1B] px-8 py-3.5 font-sans text-xs tracking-widest uppercase cursor-pointer hover:bg-[#A34A38] hover:border-[#A34A38] transition-colors duration-300 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1C1C1B]"
          >
            Explore Collection
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
