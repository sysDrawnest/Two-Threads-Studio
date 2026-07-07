import React from 'react';
import { MagneticCTA } from '../ui/LuxuryAnimations';

export const TheAtelierStory: React.FC = () => {
  return (
    <section className="w-full bg-[#1C1612] text-inverse-on-surface py-32 md:py-48 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-inverse-on-surface/60 mb-8 block">
          Our Heritage
        </span>
        <h2 className="font-serif font-light text-4xl md:text-6xl mb-12 leading-tight text-[#F9F5EE]">
          A devotion to the raw fiber and the slow hand.
        </h2>
        <p className="font-sans font-light text-sm md:text-base tracking-wide text-inverse-on-surface/80 leading-relaxed mb-16 max-w-2xl mx-auto">
          Founded on the principle that true luxury cannot be rushed, TwoThreads Studio sources only the finest unbleached linens and mercerized cottons. We reject the velocity of modern manufacturing in favor of the quiet, deliberate rhythm of traditional needlework.
        </p>
        <MagneticCTA href="/our-story" className="text-[#F9F5EE]">
          <span className="text-white group-hover:text-primary-container transition-colors duration-500">Discover the Atelier</span>
        </MagneticCTA>
      </div>
      
      {/* Abstract Background Element for Luxury Feel */}
      <div className="absolute -top-[20%] -right-[10%] w-[50%] aspect-square rounded-full border border-inverse-on-surface/5 opacity-20 pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] aspect-square rounded-full border border-inverse-on-surface/5 opacity-20 pointer-events-none" />
    </section>
  );
};
