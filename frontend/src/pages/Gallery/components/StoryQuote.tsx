import React from 'react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';
import { Decoration } from '../../../components/ui/Decoration';

export default function StoryQuote() {
  return (
    <section className="py-32 md:py-48 bg-[#FAF9F7] px-6 text-center relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background ambient thread */}
      <Decoration variant="wave-02" colorTheme="warm-linen" opacity={0.8} strokeWidth={4} position="absolute" className="w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal direction="up">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1B] leading-[1.4] md:leading-[1.4]">
            "Our work isn't produced.<br />
            <span className="italic text-[#A34A38]">It is patiently stitched.</span><br />
            Every thread carries someone's story."
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="flex justify-center mt-12 relative h-12 w-32 mx-auto">
            <Decoration variant="embroidery-knot" colorTheme="deep-bronze" opacity={0.5} strokeWidth={1.5} className="w-full h-full" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
