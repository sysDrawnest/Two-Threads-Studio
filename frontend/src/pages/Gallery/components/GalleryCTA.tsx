import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';
import { Decoration } from '../../../components/ui/Decoration';

export default function GalleryCTA() {
  return (
    <section className="py-32 md:py-48 bg-[#FAF9F7] px-6 text-center relative flex flex-col items-center">
      <ScrollReveal direction="up" className="relative z-10 flex flex-col items-center">
        
        <div className="w-12 h-12 mb-8">
          <Decoration variant="needle" colorTheme="deep-bronze" opacity={0.6} className="w-full h-full" />
        </div>

        <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1C1C1B] mb-12">
          Have a story worth stitching?
        </h2>
        
        <Link 
          to="/shop" 
          className="group relative inline-flex items-center gap-4 font-sans text-[11px] tracking-[0.2em] uppercase text-[#1C1C1B] pb-2 hover:text-[#A34A38] transition-colors"
        >
          Begin your custom commission
          <span className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
          <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-[#1C1C1B]/20 group-hover:bg-[#A34A38] transition-colors"></span>
        </Link>
      </ScrollReveal>
    </section>
  );
}
