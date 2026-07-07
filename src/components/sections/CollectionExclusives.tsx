import React from 'react';
import { ParallaxImage, MagneticCTA } from '../ui/LuxuryAnimations';

export const CollectionExclusives: React.FC = () => {
  return (
    <section className="w-full bg-background py-24 md:py-32 px-4 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 lg:gap-32 items-center">
        
        {/* Left Side: Parallax Artwork */}
        <div className="w-full aspect-[3/4] md:aspect-[4/5] relative">
          <ParallaxImage 
            src="/assets/Group%20198.png" 
            alt="The Miniature Atelier Series - Exclusive Commission" 
          />
        </div>

        {/* Right Side: Negative Space & Typography */}
        <div className="flex flex-col justify-center max-w-md">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-6 block">
            The Miniature Atelier Series
          </span>
          <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-primary-container leading-[1.1] mb-8">
            The Provenance of Thread
          </h2>
          <div className="w-12 h-[1px] bg-outline-variant mb-8" />
          <p className="font-sans font-light text-sm text-on-surface-variant mb-12 leading-relaxed">
            Strictly limited-edition commissions. Each piece requires over 40 hours of master-level artisanship, weaving together our heritage fibers into a singular moment of stillness. 
          </p>
          <div className="flex flex-col items-start gap-8">
            <span className="font-serif text-2xl text-primary-container">
              $1,250 <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant ml-2">USD</span>
            </span>
            <MagneticCTA href="/commission">
              Inquire about Commission
            </MagneticCTA>
          </div>
        </div>

      </div>
    </section>
  );
};
