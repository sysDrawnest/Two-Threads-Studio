import React from 'react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';
import masterpieceImg from '../../../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';
import { Decoration } from '../../../components/ui/Decoration';

export default function FeaturedMasterpiece() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF9F7] px-6 border-b border-[#1C1C1B]/5 relative overflow-hidden">
      
      <Decoration variant="flower-thread" colorTheme="warm-linen" opacity={0.6} strokeWidth={1} position="absolute" className="top-10 right-10 w-64 h-64" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        
        {/* The Image (Left on Desktop) */}
        <div className="w-full lg:w-3/5 order-2 lg:order-1">
          <ScrollReveal direction="up" duration={1.2}>
            <div className="relative w-full aspect-[4/5] bg-white p-4 shadow-sm border border-[#1C1C1B]/5 -rotate-1">
              <img 
                src={masterpieceImg} 
                alt="Featured Masterpiece" 
                className="w-full h-full object-cover grayscale-[10%]"
                loading="lazy"
              />
              
              {/* Hand Stitched Badge */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-[#C8A97E] bg-[#FAF9F7] flex items-center justify-center p-2 shadow-sm rotate-12">
                <p className="font-sans text-[8px] tracking-[0.2em] uppercase text-center text-[#1C1C1B]/80 leading-tight">
                  Hand<br/>Stitched<br/>2026
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* The Narrative (Right on Desktop) */}
        <div className="w-full lg:w-2/5 order-1 lg:order-2 flex flex-col justify-center">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold">Featured Work</span>
              <div className="flex-1 h-px bg-[#1C1C1B]/10"></div>
            </div>
            
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-[#1C1C1B] leading-tight mb-8">
              The Meadow<br/>Flora Archive
            </h2>
            
            <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-10 border-l border-[#C8A97E]/30 pl-6 italic">
              "This piece was born from a slow morning walk through the French countryside. The challenge was capturing the untamed, chaotic beauty of wildflowers using nothing but organic cotton thread and unbleached linen."
            </p>

            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#1C1C1B]/50 mb-1">Artist</p>
                <p className="font-serif text-lg text-[#1C1C1B]">Elise Laurent</p>
              </div>
              <div>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#1C1C1B]/50 mb-1">Time Invested</p>
                <p className="font-serif text-lg text-[#1C1C1B]">120 Hours</p>
              </div>
              <div>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#1C1C1B]/50 mb-1">Collection</p>
                <p className="font-serif text-lg text-[#1C1C1B]">Botanical '26</p>
              </div>
              <div>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#1C1C1B]/50 mb-1">Medium</p>
                <p className="font-serif text-lg text-[#1C1C1B]">Linen & Cotton</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
