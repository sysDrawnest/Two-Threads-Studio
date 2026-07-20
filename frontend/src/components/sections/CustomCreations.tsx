import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Decoration } from '../ui/Decoration';

// Assets representing the physical objects on the desk
import imgPhoto from '../../assets/portrait_of_personalized_portraits_for_a_luxur.png';
import imgSketch from '../../assets/stitch/hand_drawn_embroidery_patterns_and_sketches_on_paper_charcoal_pencil_artistic.png';
import imgThread from '../../assets/stitch/an_artistic_flat_lay_of_embroidery_materials_linen_fabric_sharp_vintage.png';
import imgHeirloom from '../../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';

const Annotation = ({ step, title, desc, className = '' }: { step: string, title: string, desc: string, className?: string }) => (

  <div className={`max-w-[200px] flex flex-col ${className}`}>
    <div className="w-8 h-px bg-[#1C1C1B]/30 mb-3" />
    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#A34A38] font-semibold mb-1">
      {step}
    </p>
    <h3 className="font-serif text-lg text-[#1C1C1B] mb-2">
      {title}
    </h3>
    <p className="font-sans text-xs text-[#5a4a3f] leading-relaxed">
      {desc}
    </p>
  </div>
);

export default function CustomCreations() {
  return (
    <section className="bg-[#FAF9F7] py-16 md:py-0 border-t border-outline-variant/10 overflow-hidden">
      
      {/* Mobile Layout: Vertical Overlapping Stack */}
      <div className="md:hidden flex flex-col items-center px-6 pb-24">
        
        {/* Header (Stamped) */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="font-serif italic text-2xl text-[#1C1C1B]/80 mb-2">Custom Commissions</p>
          <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#1C1C1B]/50">Memory to Heirloom</p>
        </ScrollReveal>

        {/* The Reference */}
        <div className="relative w-[80%] max-w-[300px] z-10 -rotate-3 self-start ml-4">
          <ScrollReveal direction="up">
            <div className="bg-white p-3 pb-8 shadow-md border border-[#1C1C1B]/5">
              <img src={imgPhoto} alt="Reference photo" className="w-full aspect-[3/4] object-cover grayscale-[30%]" loading="lazy" />
            </div>
            <Annotation step="01" title="The Reference" desc="Your cherished photograph, the foundation of the piece." className="mt-6 ml-4" />
          </ScrollReveal>
        </div>

        {/* The Pattern */}
        <div className="relative w-[85%] max-w-[320px] z-20 rotate-2 -mt-12 self-end mr-2">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="bg-[#f4ebd9]/80 p-2 shadow-sm border border-[#1C1C1B]/5">
              <img src={imgSketch} alt="Hand sketch" className="w-full aspect-square object-cover opacity-90 mix-blend-multiply" loading="lazy" />
            </div>
            <Annotation step="02" title="The Pattern" desc="Delicately traced onto paper to capture the essence." className="mt-4 mr-4 items-end text-right [&>div]:self-end" />
          </ScrollReveal>
        </div>

        {/* The Palette */}
        <div className="relative w-[75%] max-w-[280px] z-30 -rotate-2 -mt-8 self-start ml-2">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="shadow-lg border border-[#1C1C1B]/10">
              <img src={imgThread} alt="Thread selection" className="w-full aspect-[4/5] object-cover" loading="lazy" />
            </div>
            <Annotation step="03" title="The Palette" desc="Organic cotton threads curated to match your story." className="mt-4 ml-2" />
          </ScrollReveal>
        </div>

        {/* The Heirloom */}
        <div className="relative w-[90%] max-w-[340px] z-40 rotate-3 -mt-16 self-center">
          <ScrollReveal direction="up" delay={0.3}>
            <div className="shadow-2xl border border-white/40">
              <img src={imgHeirloom} alt="Finished heirloom" className="w-full aspect-square object-cover" loading="lazy" />
            </div>
            <Annotation step="04" title="The Heirloom" desc="A tactile piece of art, framed and ready for your home." className="mt-6 items-center text-center [&>div]:self-center mx-auto" />
          </ScrollReveal>
        </div>

        {/* Stamped CTA */}
        <ScrollReveal direction="up" delay={0.4} className="mt-20">
          <Link 
            to="/shop?type=custom"
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#1C1C1B] border border-[#1C1C1B]/20 px-8 py-3 rounded-full hover:bg-[#1C1C1B]/5 transition-colors"
          >
            Commission Yours
          </Link>
        </ScrollReveal>

      </div>

      {/* Desktop Layout: Artisan's Desk (Absolute Scattered) */}
      <div className="hidden md:block relative w-full h-[850px] lg:h-[950px] max-w-[1400px] mx-auto">
        
        {/* Decorative background threads */}
        <Decoration variant="wave-long" colorTheme="light-sand" strokeWidth={3} opacity={0.4} position="absolute" className="-top-32 -left-32 w-full h-full pointer-events-none" />

        {/* Header (Stamped) */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-50">
          <p className="font-serif italic text-3xl lg:text-4xl text-[#1C1C1B]/80 mb-2">Custom Commissions</p>
          <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#1C1C1B]/50 mb-4">Memory to Heirloom</p>
          <div className="relative w-48 h-6 mx-auto">
             <Decoration variant="divider-stitch" colorTheme="deep-bronze" strokeWidth={1.5} opacity={0.4} className="w-full h-full" />
          </div>
        </div>

        {/* 1. The Reference */}
        <div className="absolute top-[18%] left-[8%] lg:left-[12%] w-[22%] max-w-[300px] z-10 group">
          <ScrollReveal direction="up" duration={1}>
            <div className="bg-white p-3 lg:p-4 pb-12 lg:pb-16 shadow-md border border-[#1C1C1B]/5 -rotate-6 hover:-rotate-3 transition-transform duration-500 cursor-default">
              <img src={imgPhoto} alt="Reference photo" className="w-full aspect-[3/4] object-cover grayscale-[20%]" loading="lazy" />
            </div>
            <div className="absolute -bottom-4 lg:-bottom-8 -right-16 lg:-right-24">
               <Annotation step="01" title="The Reference" desc="Your cherished photograph, the foundation of the piece." />
            </div>
          </ScrollReveal>
        </div>

        {/* 2. The Pattern */}
        <div className="absolute top-[12%] right-[25%] lg:right-[30%] w-[28%] max-w-[380px] z-20 group">
          <ScrollReveal direction="up" delay={0.1} duration={1}>
            <div className="bg-[#f4ebd9]/60 p-2 lg:p-4 shadow-sm border border-[#1C1C1B]/5 rotate-3 hover:rotate-1 transition-transform duration-500 cursor-default">
              <img src={imgSketch} alt="Hand sketch" className="w-full aspect-square object-cover mix-blend-multiply opacity-85" loading="lazy" />
            </div>
            <div className="absolute -bottom-16 -left-16 lg:-left-20">
               <Annotation step="02" title="The Pattern" desc="Delicately traced onto paper to capture the essence." />
            </div>
          </ScrollReveal>
        </div>

        {/* 3. The Palette */}
        <div className="absolute bottom-[20%] left-[28%] lg:left-[35%] w-[25%] max-w-[350px] z-30 group">
          <ScrollReveal direction="up" delay={0.2} duration={1}>
            <div className="shadow-lg border border-[#1C1C1B]/10 -rotate-2 hover:rotate-0 transition-transform duration-500 cursor-default">
              <img src={imgThread} alt="Thread selection" className="w-full aspect-[4/5] object-cover" loading="lazy" />
            </div>
            <div className="absolute top-8 -left-32 lg:-left-40">
               <Annotation step="03" title="The Palette" desc="Organic cotton threads curated to match your story." className="items-end text-right [&>div]:self-end" />
            </div>
          </ScrollReveal>
        </div>

        {/* 4. The Heirloom */}
        <div className="absolute bottom-[10%] right-[8%] lg:right-[12%] w-[32%] max-w-[450px] z-40 group">
          <ScrollReveal direction="up" delay={0.3} duration={1}>
            <div className="shadow-2xl border border-white/50 rotate-4 hover:rotate-2 transition-transform duration-500 cursor-default">
              <img src={imgHeirloom} alt="Finished heirloom" className="w-full aspect-square object-cover" loading="lazy" />
            </div>
            <div className="absolute bottom-12 -left-20 lg:-left-28">
               <Annotation step="04" title="The Heirloom" desc="A tactile piece of art, framed and ready for your home." />
            </div>
          </ScrollReveal>
        </div>

        {/* Stamped CTA */}
        <div className="absolute bottom-16 left-12 lg:left-16 z-50">
          <ScrollReveal direction="up" delay={0.4}>
            <Link 
              to="/shop?type=custom"
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-[#1C1C1B]/20 flex items-center justify-center group-hover:bg-[#A34A38] group-hover:border-[#A34A38] transition-colors duration-300">
                <span className="font-serif italic text-xs text-[#1C1C1B]/60 group-hover:text-white transition-colors duration-300">RSVP</span>
              </div>
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#1C1C1B]/80 group-hover:text-[#A34A38] transition-colors">
                Begin Yours
              </span>
            </Link>
          </ScrollReveal>
        </div>

      </div>

    </section>
  );
}
