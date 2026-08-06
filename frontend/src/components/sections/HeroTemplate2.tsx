/**
 * Hero Template 2 — The Immersive Portrait (Quiet Luxury)
 *
 * Single full-height editorial photograph with zero visual noise.
 * Negative space typography and a single CTA button.
 * Desktop: Full-bleed photograph with typography placed in negative space.
 * Mobile: Image fills 65-70vh with soft gradient text overlay at the bottom.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroTemplate2() {
  return (
    <section className="relative w-full h-[calc(100vh-65px)] md:h-[calc(100vh-70px)] min-h-[560px] bg-[#17110c] overflow-hidden flex flex-col justify-end md:justify-center text-[#fef8f3]">
      {/* Editorial Background Photograph */}
      <div className="absolute inset-0 w-full h-[68vh] md:h-full z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1920&q=85"
          alt="Handcrafted Artisanal Linen"
          className="w-full h-full object-cover object-center md:object-[65%_35%] filter brightness-[0.88] contrast-[1.05]"
        />
        {/* Soft subtle gradient overlay for seamless readability on mobile & desktop negative space */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#17110c] via-[#17110c]/30 to-transparent md:bg-gradient-to-r md:from-[#17110c]/90 md:via-[#17110c]/40 md:to-transparent" />
      </div>

      {/* Typography & Single CTA Container (Positioned in Negative Space) */}
      <div className="relative z-10 px-6 sm:px-12 md:px-16 lg:px-24 pb-12 md:pb-0 max-w-2xl">
        <span className="block font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#d2c4bc]/80 mb-3 md:mb-4 font-medium">
          Two Threads Studio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] text-[#fef8f3] tracking-tight mb-6 md:mb-8">
          Handcrafted, <br />
          One Stitch <br />
          <span className="italic font-light text-[#efe0d8]">at a Time.</span>
        </h1>

        <div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 text-xs md:text-sm font-sans tracking-[0.2em] uppercase text-[#fef8f3] border-b border-[#fef8f3]/60 pb-1 hover:border-[#fef8f3] hover:text-white transition-all duration-300"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
