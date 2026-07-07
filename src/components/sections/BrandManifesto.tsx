import React from 'react';
import { StaggeredTextReveal } from '../ui/LuxuryAnimations';

export const BrandManifesto: React.FC = () => {
  return (
    <section className="w-full bg-[#F9F5EE] py-32 md:py-48 px-6 md:px-12 flex justify-center items-center">
      <div className="max-w-4xl text-center">
        <StaggeredTextReveal 
          text="Objects crafted not to fill spaces, but to hold history. TwoThreads is an interrogation of time, texture, and the luxury of the human hand."
          className="font-serif font-light text-3xl md:text-5xl leading-tight text-primary-container justify-center"
        />
      </div>
    </section>
  );
};
