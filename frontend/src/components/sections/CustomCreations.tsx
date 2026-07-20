import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

// Assets representing the transformation journey
import imgPhoto from '../../assets/portrait_of_personalized_portraits_for_a_luxur.png';
import imgSketch from '../../assets/stitch/hand_drawn_embroidery_patterns_and_sketches_on_paper_charcoal_pencil_artistic.png';
import imgThread from '../../assets/stitch/an_artistic_flat_lay_of_embroidery_materials_linen_fabric_sharp_vintage.png';
import imgProgress from '../../assets/stitch/close_up_of_a_person_s_hands_delicately_working_on_a_hoop_embroidery_project.png';
import imgHeirloom from '../../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';

const stages = [
  {
    step: '01',
    title: 'Your Photograph',
    desc: 'You share a cherished moment—a portrait, a wedding, or a memory you wish to preserve forever.',
    image: imgPhoto,
    aspect: 'aspect-[3/4]',
  },
  {
    step: '02',
    title: 'The Hand Sketch',
    desc: 'Our artisans delicately trace the essence of your photograph into a physical paper pattern.',
    image: imgSketch,
    aspect: 'aspect-square',
  },
  {
    step: '03',
    title: 'Thread Selection',
    desc: 'We curate a bespoke palette of natural, organic cotton threads to match your story.',
    image: imgThread,
    aspect: 'aspect-[4/5]',
  },
  {
    step: '04',
    title: 'In Progress',
    desc: 'Weeks of slow, intentional stitching bring the design to life on unbleached European linen.',
    image: imgProgress,
    aspect: 'aspect-square',
  },
  {
    step: '05',
    title: 'Finished Heirloom',
    desc: 'A timeless, tactile piece of art, framed in beechwood and ready for your home.',
    image: imgHeirloom,
    aspect: 'aspect-[3/4]',
  },
];

const StageText = ({ step, title, desc, align = 'left' }: { step: string, title: string, desc: string, align?: 'left' | 'right' }) => (
  <ScrollReveal direction="up" className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
    <div className="flex items-center gap-3 mb-4">
      {align === 'left' && <div className="w-6 h-[1px] bg-[#A34A38]/30" />}
      <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold">
        Phase {step}
      </p>
      {align === 'right' && <div className="w-6 h-[1px] bg-[#A34A38]/30" />}
    </div>
    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1B] mb-5">
      {title}
    </h3>
    <p className="font-sans text-sm text-[#5a4a3f] leading-loose max-w-xs">
      {desc}
    </p>
  </ScrollReveal>
);

export default function CustomCreations() {
  return (
    <section className="bg-[#FAF9F7] py-20 md:py-32 overflow-hidden border-t border-outline-variant/10">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center px-6 mb-16 md:mb-32">
        <ScrollReveal direction="up">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold mb-6">
            Custom Commissions
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1C1B] leading-[1.1]">
            From Memory <br className="hidden sm:block" />to Heirloom
          </h2>
        </ScrollReveal>
      </div>

      {/* Desktop Layout: Vertical Museum Journey */}
      <div className="hidden md:block max-w-7xl mx-auto px-16 relative">
        {/* The central "thread" motif */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-[#1C1C1B]/20 -translate-x-1/2" />
        
        {stages.map((stage, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={stage.step} className="grid grid-cols-12 gap-16 items-center mb-32 relative z-10">
              
              {/* Center Node on the thread */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FAF9F7] border border-[#1C1C1B]/40" />

              {isEven ? (
                <>
                  <div className="col-span-5 col-start-1">
                    <ScrollReveal direction="right" duration={1}>
                      <img src={stage.image} alt={stage.title} className={`w-full ${stage.aspect} object-cover shadow-sm`} loading="lazy" />
                    </ScrollReveal>
                  </div>
                  <div className="col-span-4 col-start-8">
                    <StageText step={stage.step} title={stage.title} desc={stage.desc} align="left" />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-4 col-start-2">
                    <StageText step={stage.step} title={stage.title} desc={stage.desc} align="right" />
                  </div>
                  <div className="col-span-5 col-start-8">
                    <ScrollReveal direction="left" duration={1}>
                      <img src={stage.image} alt={stage.title} className={`w-full ${stage.aspect} object-cover shadow-sm`} loading="lazy" />
                    </ScrollReveal>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Layout: Horizontal Gallery */}
      <div className="md:hidden relative pb-12">
        {/* The horizontal "thread" motif */}
        <div className="absolute top-[40%] left-0 right-0 h-px border-t border-dashed border-[#1C1C1B]/20" />
        
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 gap-8 relative z-10">
          {stages.map((stage) => (
            <div key={stage.step} className="w-[85vw] flex-shrink-0 snap-center pt-8">
              <ScrollReveal direction="up">
                <img src={stage.image} alt={stage.title} className={`w-full ${stage.aspect} object-cover shadow-sm mb-10`} loading="lazy" />
                <StageText step={stage.step} title={stage.title} desc={stage.desc} align="left" />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-xl mx-auto text-center px-6 mt-16 md:mt-24">
        <ScrollReveal direction="up">
          <Link 
            to="/shop?type=custom"
            className="group inline-flex items-center gap-4 font-sans text-xs tracking-[0.2em] uppercase text-[#1C1C1B] hover:text-[#A34A38] transition-colors"
          >
            <span className="border-b border-[#1C1C1B]/30 group-hover:border-[#A34A38] pb-1 transition-colors">
              Begin Your Commission
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </div>

    </section>
  );
}
