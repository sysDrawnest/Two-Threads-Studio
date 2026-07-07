import React from 'react';
import { StaggeredTextReveal } from '../ui/LuxuryAnimations';

export const HeroVideo: React.FC = () => {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-primary">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source src="/assets/Moti%20-%20A%20visual%20journey%20of%20two%20threads%20(1).mp4" type="video/mp4" />
        {/* Fallback image if video doesn't load */}
      </video>
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Typography */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto z-10 w-full">
        <StaggeredTextReveal 
          text="TWO THREADS STUDIO" 
          className="font-serif font-light text-5xl md:text-8xl tracking-[0.2em] md:tracking-[0.3em] uppercase text-inverse-on-surface mb-4 leading-tight"
        />
        <div className="overflow-hidden">
          <p className="font-sans font-light text-sm md:text-base tracking-[0.25em] uppercase text-inverse-on-surface/80 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
            A visual journey of time and texture
          </p>
        </div>
      </div>
    </section>
  );
};
