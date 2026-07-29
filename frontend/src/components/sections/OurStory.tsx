import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import ourStoryImg from '../../assets/our_story_section.png';

export default function OurStory() {
  return (
    <section id="our-story" className="bg-white py-16 md:py-32 overflow-hidden border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        {/* Large Editorial Photo */}
        <ScrollReveal direction="up" duration={1.2}>
          <div className="w-full h-[50vh] md:h-[70vh] mb-16 md:mb-24 overflow-hidden">
            <img
              src={ourStoryImg}
              alt="Artisan craftsmanship"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </ScrollReveal>

        {/* Editorial Text Block */}
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal direction="up">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-semibold mb-6">
              Our Philosophy
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1B] leading-[1.15] mb-8">
              The Art of Intentional Making
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="font-sans text-sm text-[#5a4a3f] leading-loose space-y-6 mb-12">
              <p>
                TwoThreads Studio began with a simple belief: the most meaningful things are made slowly.
              </p>
              <p>
                Every piece begins with an idea, is crafted patiently by hand, and finished with the same care we'd give something made for our own home. We don't chase volume or trends—we focus on creating thoughtful pieces that are meant to be kept, gifted, and remembered.
              </p>
              <p>
                Each collection reflects a commitment to craftsmanship, timeless design, and the beauty of making something well.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <Link
              to="/our-story"
              className="group inline-flex items-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-[#1C1C1B] hover:text-[#A34A38] transition-colors"
            >
              <span className="border-b border-[#1C1C1B]/30 group-hover:border-[#A34A38] pb-1 transition-colors font-semibold">
                Discover Our Story
              </span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
