/**
 * Hero Template 4 — Pixel-Perfect Reference Implementation
 *
 * Recreates the exact Hero Section design from the reference image for Two Threads Studio.
 * - Single Source of Truth: Provided reference mockup.
 * - Colors: Warm Linen #F6EFE9, Warm Sand #E8DFD5, Charcoal #2D2520, Earthy Clay #876653 / #9C6644.
 * - Typography: Cormorant Garamond / EB Garamond display serif, DM Sans subhead.
 * - Elements:
 *    1. Left organic cropped macramé / woven wall hanging artwork.
 *    2. Right rectangular Lippan clay mirror plaque with torn paper background layer.
 *    3. Hand-drawn line art: yarn balls (top-right & bottom-left), continuous thread swooshes, embroidery needles.
 *    4. Headline: "UNVEILING the SOUL of HANDMADE" with exact font styles & color accents.
 *    5. Pill CTA Button: "EXPLORE the COLLECTION" + hand-drawn left arrow.
 * - Mobile & Desktop responsive adaptation matching the reference structure.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroMacrame from '../../assets/hero_macrame_clean.webp';
import heroLippan from '../../assets/hero_lippan_clean.webp';

export default function HeroTemplate4() {
  return (
    <section className="relative w-full bg-[#F6EFE9] text-[#2D2520] overflow-hidden min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] flex flex-col justify-center">
      
      {/* 1. RIGHT SIDE TORN PAPER BACKGROUND LAYER */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-1/3 md:w-[38%] bg-[#E8DFD5]/70 pointer-events-none z-0 hidden sm:block"
        style={{
          clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 8% 80%, 3% 60%, 12% 40%, 5% 20%)'
        }}
      />

      {/* 2. TOP RIGHT DECORATIVE YARN BALL LINE ART */}
      <svg
        className="absolute top-6 right-6 md:top-12 md:right-16 w-24 h-24 md:w-36 md:h-36 text-[#876653]/40 pointer-events-none z-10 hidden sm:block"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="70" cy="50" r="32" strokeWidth="1.2" strokeDasharray="3 2" />
        <ellipse cx="68" cy="48" rx="28" ry="18" strokeWidth="1.2" transform="rotate(-25 68 48)" />
        <ellipse cx="72" cy="52" rx="28" ry="18" strokeWidth="1.2" transform="rotate(35 72 52)" />
        <path d="M42 62 C30 75 20 65 10 80 C4 90 12 105 25 110" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M80 22 C95 10 110 18 115 30" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {/* 3. BOTTOM LEFT DECORATIVE YARN BALL & THREAD LINE ART */}
      <svg
        className="absolute bottom-4 left-4 sm:left-12 w-28 h-28 md:w-40 md:h-40 text-[#876653]/35 pointer-events-none z-10"
        viewBox="0 0 140 140"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="45" cy="95" r="30" strokeWidth="1.2" />
        <ellipse cx="45" cy="95" rx="26" ry="16" strokeWidth="1.1" transform="rotate(-30 45 95)" />
        <ellipse cx="45" cy="95" rx="26" ry="16" strokeWidth="1.1" transform="rotate(40 45 95)" />
        <path d="M20 110 C-5 130 30 145 60 135 C100 125 130 140 180 130" strokeWidth="1.3" strokeLinecap="round" />
      </svg>

      {/* 4. CONTINUOUS ORGANIC SWEEPOUT THREAD LINE */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-32 text-[#876653]/25 pointer-events-none z-10 hidden md:block"
        viewBox="0 0 1200 120"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M0 90 Q 250 130 450 80 T 850 100 Q 1050 60 1200 110"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* MAIN CONTAINER */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between">
        
        {/* MOBILE VIEW TOP MACRAMÉ BANNER (<= 768px) */}
        <div className="w-full md:hidden mb-6 rounded-2xl overflow-hidden shadow-sm border border-[#2D2520]/10">
          <img
            src={heroMacrame}
            alt="Handcrafted Macramé & Textile Art"
            className="w-full h-56 object-cover object-top"
          />
        </div>

        {/* LEFT DESKTOP MACRAMÉ ARTWORK SLICE (MD & UP) */}
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[220px] lg:w-[280px] xl:w-[320px] h-[78%] max-h-[580px] z-20">
          <div 
            className="w-full h-full shadow-xl overflow-hidden border-r border-t border-b border-[#2D2520]/15"
            style={{
              borderRadius: '0 160px 160px 0'
            }}
          >
            <img
              src={heroMacrame}
              alt="Handcrafted Macramé & Woven Textile Art"
              className="w-full h-full object-cover object-left-top"
            />
          </div>
        </div>

        {/* CENTRAL CONTENT COLUMN */}
        <div className="w-full md:pl-[240px] lg:pl-[300px] xl:pl-[340px] md:pr-[280px] lg:pr-[360px] flex flex-col justify-center items-start text-left">
          
          {/* MAIN HEADLINE */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] leading-[1.08] text-[#2D2520] tracking-tight font-normal mb-4 sm:mb-6">
            UNVEILING <span className="font-serif italic font-light text-[#2D2520]">the</span>
            <br />
            <span className="font-serif font-normal text-[#876653]">SOUL</span>{' '}
            <span className="font-serif italic font-light text-[#2D2520]">of</span>{' '}
            HANDMADE
          </h1>

          {/* SUBHEADLINE */}
          <p className="font-sans text-xs sm:text-sm md:text-base lg:text-lg text-[#362C26] font-light leading-relaxed max-w-md mb-6 sm:mb-8">
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </p>

          {/* CTA BUTTON & HAND-DRAWN ARROW */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#876653] hover:bg-[#745543] text-[#F6EFE9] transition-all duration-300 rounded-full font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>EXPLORE</span>
              <span className="font-serif italic font-normal text-xs sm:text-sm lowercase text-[#F6EFE9] px-0.5">the</span>
              <span>COLLECTION</span>
            </Link>

            {/* Hand-drawn Left-pointing Arrow */}
            <svg 
              className="w-8 h-5 sm:w-10 sm:h-6 text-[#876653] flex-shrink-0" 
              viewBox="0 0 42 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path 
                d="M40 12 C28 11.5 16 13 4 12 M4 12 L12 5 M4 12 L11 19" 
                strokeWidth="1.6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

        </div>

        {/* RIGHT LIPPAN ARTWORK CARD (DESKTOP & TABLET) */}
        <div className="hidden md:block absolute right-6 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 w-[240px] lg:w-[320px] xl:w-[360px] aspect-[4/3] z-20">
          <div className="relative w-full h-full p-2 bg-[#F6EFE9] border border-[#2D2520]/10 shadow-2xl rounded-sm">
            {/* Torn paper texture backdrop accent */}
            <div className="absolute -inset-2 bg-[#E8DFD5] -z-10 rounded-sm transform rotate-1 shadow-sm" />
            <img
              src={heroLippan}
              alt="Handcrafted Clay Lippan Art Plaque"
              className="w-full h-full object-cover rounded-xs"
            />
          </div>
        </div>

        {/* EMBROIDERY NEEDLES LINE ART (DESKTOP & MOBILE RIGHT MARGIN) */}
        <div className="absolute right-4 bottom-8 md:right-8 md:bottom-12 pointer-events-none z-10 opacity-70">
          <svg className="w-12 h-24 md:w-16 md:h-32 text-[#876653]/60" viewBox="0 0 60 120" fill="none" stroke="currentColor">
            {/* Needle 1 */}
            <path d="M25 10 L25 110 M25 10 A 1.5 1.5 0 0 1 25 14" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="25" cy="18" rx="1.2" ry="4" fill="currentColor" />
            {/* Needle 2 */}
            <path d="M40 25 L35 115" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="39" cy="33" rx="1.2" ry="4" fill="currentColor" transform="rotate(-5 39 33)" />
            {/* Thread loop through needles */}
            <path d="M25 18 C10 15 5 35 25 45 C45 55 50 25 39 33 C25 40 15 65 30 85 C40 100 20 115 10 120" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>

      </div>

    </section>
  );
}
