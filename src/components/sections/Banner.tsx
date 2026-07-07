import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function Banner() {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#8b6f5c] to-[#5a3d2b]" />
      <ScrollReveal direction="up" className="relative z-10 text-center p-8">
        <p className="font-sans text-xs tracking-[0.3em] text-white/70 uppercase mb-4">
          An Exclusive Collection
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-white leading-tight mb-6">
          Our Artisan Guild Sale
        </h2>
        <p className="font-sans text-sm text-white/80 italic mb-8">
          Premium embroidery patterns, crafted for Modern Home Weavers
        </p>
        <button className="bg-inverse-on-surface text-primary-container border-none px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container outline-none">
          Explore Sale
        </button>
      </ScrollReveal>
    </section>
  );
}
