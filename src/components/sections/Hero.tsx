import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import heroMobile from '../../assets/hero section mobile.png';
import heroPc from '../../assets/hero section pc.png';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#a85a46]">
      {/* Huge Background Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 mt-16 md:mt-0">
        <h1 className="font-serif text-[#f6ebe0] font-normal leading-[0.85] text-center w-full">
          <span className="hidden md:block text-[14vw] tracking-tight">TWO THREAD</span>
          <span className="hidden md:block text-[14vw] tracking-tight">STUDIO</span>
          
          <span className="block md:hidden text-[16vw] tracking-tight mt-10">ARTISANAL</span>
          <span className="block md:hidden text-[16vw] tracking-tight">CREATIONS</span>
        </h1>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-6 pt-32 pb-12 flex-1 justify-end md:justify-center">
        
        {/* Central Product Image Container */}
        <div className="w-full max-w-sm md:max-w-3xl mx-auto relative mb-12 flex items-end justify-center">
           <img src={heroMobile} alt="Artisanal Creations" className="w-full h-auto object-contain block md:hidden drop-shadow-2xl" />
           <img src={heroPc} alt="Two Thread Studio Kits" className="w-full h-auto object-contain hidden md:block drop-shadow-2xl" />
        </div>

        {/* Bottom Text and CTA */}
        <div className="text-center w-full mt-auto md:mt-4 z-20">
          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-sans text-[9px] md:text-xs tracking-[0.25em] text-[#f6ebe0] uppercase mb-6 md:mb-8">
              Indigo Embroidery Kits &bull; Limited Batches &bull; Mindful Craft
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.4}>
            <button className="bg-[#f6ebe0] text-[#a85a46] border-none px-8 py-3.5 md:px-10 md:py-4 font-sans text-[10px] md:text-xs tracking-[0.15em] font-semibold uppercase cursor-pointer hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              Shop Collection
            </button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
