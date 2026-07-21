import React, { useEffect, useRef, useState } from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import heroMobile from '../../assets/hero section mobile.png';
import heroPc from '../../assets/hero section pc.png';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation for text
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Scroll zoom effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top / window.innerHeight);
      
      // Clamp the progress between 0 and 1
      const progress = Math.min(Math.max(scrollProgress, 0), 1);
      
      // Zoom effect: scale from 1 to 1.15
      const scale = 1 + (progress * 0.15);
      imageRef.current.style.transform = `scale(${scale})`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative h-[calc(100vh-65px)] md:h-[calc(100vh-70px)] min-h-[520px] w-full overflow-hidden bg-[#ab5a46]"
    >
      {/* Huge Background Text with Entrance Animation */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-2 md:pt-3 pointer-events-none select-none z-0 overflow-hidden">
        <h1 className="font-serif text-[#f4ebd9] font-normal text-center w-full" style={{ lineHeight: '0.85' }}>
          <span 
            className="hidden md:block text-[17vw] tracking-tighter"
            style={{
              transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1), opacity 1s ease'
            }}
          >
            TWO THREAD
          </span>
          <span 
            className="hidden md:block text-[17vw] tracking-tighter"
            style={{
              transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1) 0.15s, opacity 1s ease 0.15s'
            }}
          >
            STUDIO
          </span>
          
          <span 
            className="block md:hidden text-[22vw] tracking-tighter"
            style={{
              transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1), opacity 1s ease'
            }}
          >
            TWO THREAD
          </span>
          <span 
            className="block md:hidden text-[22vw] tracking-tighter"
            style={{
              transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1) 0.15s, opacity 1s ease 0.15s'
            }}
          >
            STUDIO
          </span>
        </h1>
      </div>

      {/* Foreground Content - The Rock & Overlay Text */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 pointer-events-none">
        <div className="relative w-full max-w-[1200px] flex justify-center pointer-events-auto">
           
           <img 
             ref={imageRef}
             src={heroMobile} 
             alt="Artisanal Creations" 
             className="w-full max-w-[480px] h-[62vh] object-contain object-bottom block md:hidden drop-shadow-2xl transition-transform duration-100 will-change-transform" 
             style={{ transform: 'scale(1)' }}
           />
           <img 
             ref={imageRef}
             src={heroPc} 
             alt="Two Thread Studio Kits" 
             className="w-full max-w-[900px] h-[68vh] md:h-[70vh] object-contain object-bottom hidden md:block drop-shadow-2xl transition-transform duration-100 will-change-transform" 
             style={{ transform: 'scale(1)' }}
           />

           {/* Text and Button Overlaying the Rock */}
           <div className="absolute bottom-[5%] md:bottom-[6%] left-1/2 transform -translate-x-1/2 w-full text-center flex flex-col items-center z-20 px-4">
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