import React from 'react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';
import { Decoration } from '../../../components/ui/Decoration';
import { DecorationVariant } from '../../../components/ui/DecorationPaths';

export default function ProcessExhibition() {
  const steps: { title: string; desc: string; decoration: DecorationVariant }[] = [
    { 
      title: "The Hand Sketch", 
      desc: "Translating memories into graphite contours on drafting paper, establishing the foundation of the composition.", 
      decoration: "needle" 
    },
    { 
      title: "Thread Selection", 
      desc: "Curating a bespoke palette from hundreds of organic cotton hues to capture the exact mood and lighting.", 
      decoration: "embroidery-knot" 
    },
    { 
      title: "Slow Embroidery", 
      desc: "Hundreds of hours of meticulous needlework, patiently layering textures and colors into unbleached linen.", 
      decoration: "cross-stitch-border" 
    },
    { 
      title: "Finished Heirloom", 
      desc: "A timeless, tactile artifact, carefully framed in its wooden hoop and prepared for its forever home.", 
      decoration: "leaf-thread" 
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FAF9F7] px-6 border-t border-[#1C1C1B]/5">
      <div className="max-w-7xl mx-auto">
        
        <ScrollReveal direction="up" className="text-center mb-24">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold mb-4">The Artisan's Process</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1C1C1B]">From Memory to Linen</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          
          {/* Subtle connecting thread for desktop */}
          <div className="hidden lg:block absolute top-12 left-16 right-16 h-8 -z-10">
            <Decoration variant="wave-01" colorTheme="light-sand" opacity={0.6} className="w-full h-full" />
          </div>

          {steps.map((step, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.15}>
              <div className="flex flex-col items-center text-center">
                
                {/* Icon Container with Decoration */}
                <div className="w-24 h-24 rounded-full border border-[#C8A97E]/30 bg-white shadow-sm flex items-center justify-center mb-8 relative p-6">
                  <Decoration variant={step.decoration} colorTheme="soft-gold" strokeWidth={1} position="relative" className="w-full h-full" />
                  
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-2 bg-[#FAF9F7] text-[#A34A38] font-serif text-lg italic px-2">
                    0{idx + 1}
                  </div>
                </div>

                <h3 className="font-serif text-xl text-[#1C1C1B] mb-4">{step.title}</h3>
                <p className="font-sans text-[12px] leading-[1.8] text-[#5a4a3f] px-4">
                  {step.desc}
                </p>

                {/* Stitched Arrow for Mobile (except last item) */}
                {idx < steps.length - 1 && (
                  <div className="lg:hidden mt-8 h-12 w-12">
                     <Decoration variant="stitched-arrow" colorTheme="deep-bronze" opacity={0.3} className="w-full h-full rotate-90" />
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
