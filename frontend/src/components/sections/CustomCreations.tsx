import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

// Assets
import mainImg from '../../assets/portrait_of_wedding_keepsakes_for_a_luxury_em.png';
import portraitImg from '../../assets/portrait_of_personalized_portraits_for_a_luxur.png';
import heritageImg from '../../assets/portrait_of_a_heritage_collection_for_a_luxury.png';

const examples = [
  { title: 'Portrait', image: portraitImg },
  { title: 'Wedding', image: mainImg },
  { title: 'Pet', image: heritageImg },
];

export default function CustomCreations() {
  return (
    <section className="bg-[#FAF9F7] py-16 md:py-32 overflow-hidden border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        {/* Desktop Layout: Asymmetrical Editorial Split */}
        <div className="hidden md:grid md:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left: Large Editorial Photo */}
          <div className="md:col-span-7">
            <ScrollReveal direction="up" duration={1.2}>
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img 
                  src={mainImg} 
                  alt="Custom embroidery commission" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Narrative Text (Pushed down for whitespace) */}
          <div className="md:col-span-5 pt-32 lg:pt-48 flex flex-col justify-center">
            <ScrollReveal direction="up" delay={0.2} duration={1}>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold mb-6">
                Custom Commissions
              </p>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-[#1C1C1B] leading-[1.15] mb-8">
                Your Story,<br />
                Hand Stitched
              </h2>
              
              <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-12 max-w-sm">
                We believe the most beautiful art is personal. From the quiet companionship of a beloved pet to the fleeting joy of a wedding day, our artisans carefully translate your cherished photographs into timeless heirloom textiles.
              </p>
              
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

        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col">
          
          {/* 1. Full width image */}
          <div className="-mx-6 mb-12">
            <img 
              src={mainImg} 
              alt="Custom embroidery commission" 
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
            />
          </div>

          {/* 2. CUSTOM label */}
          <ScrollReveal direction="up">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold mb-4 text-center">
              Custom Commissions
            </p>
          </ScrollReveal>

          {/* 3. Heading */}
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="font-serif text-4xl font-light text-[#1C1C1B] leading-[1.1] mb-6 text-center">
              Your Story,<br />
              Hand Stitched
            </h2>
          </ScrollReveal>

          {/* 4. Paragraph */}
          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-10 text-center px-2">
              We believe the most beautiful art is personal. From the quiet companionship of a beloved pet to the fleeting joy of a wedding day, our artisans carefully translate your cherished photographs into timeless heirloom textiles.
            </p>
          </ScrollReveal>

          {/* 5. Begin -> */}
          <ScrollReveal direction="up" delay={0.3} className="flex justify-center mb-16">
            <Link 
              to="/shop?type=custom"
              className="group inline-flex items-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-[#1C1C1B]"
            >
              <span className="border-b border-[#1C1C1B]/30 pb-1">
                Begin Your Commission
              </span>
              <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          {/* 6. Horizontal gallery */}
          <div className="-mx-6 px-6 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 pr-6">
              {examples.map((ex, i) => (
                <div key={ex.title} className="w-[70vw] flex-shrink-0 snap-center">
                  <img 
                    src={ex.image} 
                    alt={ex.title} 
                    className="w-full aspect-square object-cover mb-4 grayscale-[20%]"
                    loading="lazy"
                  />
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-[#1C1C1B]/80 text-center">
                    {ex.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
