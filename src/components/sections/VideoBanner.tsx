import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function VideoBanner() {
  return (
    <section className="w-full h-[35vh] md:h-[40vh] relative overflow-hidden bg-primary-container flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        poster="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      >
        {/* Placeholder for actual video source */}
        {/* <source src="/path-to-your-video.mp4" type="video/mp4" /> */}
      </video>
      <div className="absolute inset-0 bg-[#a85a46]/20 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/10" />
      
      <ScrollReveal direction="up" className="relative z-10 text-center px-6">
        <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-3">
          Artistry in Motion
        </h2>
        <p className="font-sans text-[10px] md:text-xs tracking-[0.25em] text-white/90 uppercase">
          Watch our process
        </p>
        <button className="mt-6 w-12 h-12 rounded-full border border-white/50 flex items-center justify-center mx-auto hover:bg-white hover:text-[#a85a46] text-white transition-colors cursor-pointer group">
          <svg className="w-4 h-4 ml-1 translate-x-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </button>
      </ScrollReveal>
    </section>
  );
}
