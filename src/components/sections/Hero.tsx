import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import heroMobile from '../../assets/hero section mobile.png';
import heroPc from '../../assets/hero section pc.png';

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-[#ab5a46]">
      {/* Huge Background Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[12vh] md:pt-[12vh] pointer-events-none select-none z-0">
        <h1 className="font-serif text-[#f4ebd9] font-normal text-center w-full" style={{ lineHeight: '0.85' }}>
          <span className="hidden md:block text-[17vw] tracking-tighter">TWO THREAD</span>
          <span className="hidden md:block text-[17vw] tracking-tighter">STUDIO</span>
          
          <span className="block md:hidden text-[22vw] tracking-tighter">TWO THREAD</span>
          <span className="block md:hidden text-[22vw] tracking-tighter">STUDIO</span>
        </h1>
      </div>

      {/* Foreground Content - The Rock & Overlay Text */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 pointer-events-none">
        <div className="relative w-full max-w-[1200px] flex justify-center pointer-events-auto">
           
           <img 
             src={heroMobile} 
             alt="Artisanal Creations" 
             className="w-full max-w-[500px] h-[70vh] md:h-auto object-contain object-bottom block md:hidden drop-shadow-2xl" 
           />
           <img 
             src={heroPc} 
             alt="Two Thread Studio Kits" 
             className="w-full max-w-[1000px] h-[80vh] object-contain object-bottom hidden md:block drop-shadow-2xl" 
           />

           {/* Text and Button Overlaying the Rock */}
           <div className="absolute bottom-[8%] md:bottom-[10%] left-1/2 transform -translate-x-1/2 w-full text-center flex flex-col items-center z-20 px-4">
             <ScrollReveal direction="up" delay={0.2}>
               <p className="font-sans text-[8px] md:text-[10px] lg:text-xs tracking-[0.2em] md:tracking-[0.25em] text-[#e3d5c8] uppercase mb-4 md:mb-5 whitespace-nowrap">
                 Indigo Embroidery Kits &bull; Limited Batches &bull; Mindful Craft
               </p>
             </ScrollReveal>
             
             <ScrollReveal direction="up" delay={0.4}>
               <button className="bg-[#f4ebd9] text-[#ab5a46] border-none px-8 py-3 md:px-10 md:py-3.5 font-sans text-[10px] md:text-[11px] tracking-[0.15em] font-medium uppercase cursor-pointer hover:bg-white hover:shadow-lg transition-all duration-300 pointer-events-auto">
                 Shop Collection
               </button>
             </ScrollReveal>
           </div>
        </div>
      </div>
    </section>
  );
}
