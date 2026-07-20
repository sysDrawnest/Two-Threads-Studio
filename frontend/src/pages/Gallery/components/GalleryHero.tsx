import React from 'react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';
import { Decoration } from '../../../components/ui/Decoration';
import heroImg from '../../../assets/stitch/a_high_end_editorial_photo_of_a_minimalist_living_room_featuring_framed_hand.png';

export default function GalleryHero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden bg-[#FAF9F7]">
      <Decoration variant="wave-long" colorTheme="soft-gold" opacity={0.1} strokeWidth={2} position="absolute" className="-top-10 -left-20 w-[120%] h-[120%] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        <ScrollReveal direction="up">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold mb-6">
            The Archive
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-[#1C1C1B] tracking-tight mb-8">
            Exhibition
          </h1>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-6 mb-8">
              <Decoration variant="divider-stitch" colorTheme="deep-bronze" opacity={0.4} />
            </div>
            <p className="font-sans text-sm md:text-base text-[#5a4a3f] leading-loose max-w-xl mx-auto mb-16 px-4">
              Our work isn't simply produced; it is patiently stitched. Each piece in this gallery represents weeks of quiet dedication, capturing fleeting memories in timeless linen and thread.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2} duration={1.2} className="w-full">
          <div className="w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-[#E6D8C5]/20">
            <img 
              src={heroImg} 
              alt="Gallery Exhibition" 
              className="w-full h-full object-cover scale-[1.02] hover:scale-100 transition-transform duration-[2000ms] ease-out grayscale-[15%]"
              loading="lazy"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
