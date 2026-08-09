/**
 * Hero Template 4 — Unveiling the Soul of Handmade (Pixel-Perfect Reconstruction)
 * 
 * Primary Source of Truth: Reference Image specification.
 * - Architecture: Contemporary artisan studio composition with layered tactile torn paper texture,
 *   hand-drawn thread/yarn line art, macramé wall hanging bleed, Lippan art mandala tile card,
 *   and Cormorant Garamond display typography.
 * - Colors: #F5F0EB (Linen Off-White), #EDE6DE (Warm Sand/Torn Paper), #2D2520 (Dark Charcoal),
 *   #8B5E43 / #8B6F5C (Artisan Clay Brown).
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroMacrameImg from '../../assets/hero_macrame_ref.webp';
import heroLippanImg from '../../assets/hero_lippan_ref.webp';

export default function HeroTemplate4() {
  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#F5F0EB] text-[#2D2520] flex flex-col justify-center overflow-hidden py-8 md:py-12 select-none">
      
      {/* ========================================================================= */}
      {/* BACKGROUND LAYERS & TORN PAPER EFFECT                                     */}
      {/* ========================================================================= */}
      
      {/* Subtly textured background base */}
      <div className="absolute inset-0 bg-[#F5F0EB] pointer-events-none z-0" />

      {/* Torn Paper Organic Layer (Right Side Background) */}
      <div 
        className="absolute top-0 right-0 w-full md:w-[55%] h-full bg-[#EAE2D7]/70 pointer-events-none z-0 hidden md:block"
        style={{
          clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%, 8% 85%, 2% 70%, 14% 55%, 4% 40%, 10% 25%, 3% 10%)'
        }}
      />

      {/* Hand-Drawn Continuous Thread Line (Flowing across background) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40 text-[#2D2520]" 
        viewBox="0 0 1440 800" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.2"
      >
        <path 
          d="M -50 720 C 150 780, 250 680, 220 580 C 190 480, 380 420, 520 560 C 660 700, 550 820, 480 750 C 410 680, 500 480, 680 440 C 860 400, 950 580, 1100 680 C 1250 780, 1400 650, 1500 600" 
          strokeDasharray="4 2"
        />
      </svg>

      {/* Top-Right Decorative Yarn Ball Doodle (Desktop) */}
      <div className="absolute top-6 right-12 md:right-24 pointer-events-none z-10 hidden md:block opacity-35 text-[#2D2520]">
        <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="40" r="28" strokeDasharray="3 2" />
          <path d="M 30 25 C 40 18, 65 18, 75 30 C 85 42, 75 60, 60 62 C 40 64, 30 45, 35 20 Z" />
          <path d="M 35 15 C 20 28, 25 50, 45 58 C 65 65, 75 45, 65 28" />
          <path d="M 25 40 C 15 55, 30 75, 55 60" />
          <path d="M 50 68 C 35 78, 20 82, 10 90 C 2 98, 18 100, 35 92 C 50 84, 70 92, 90 95" />
        </svg>
      </div>

      {/* Bottom-Left Decorative Yarn Ball Doodle */}
      <div className="absolute bottom-6 left-4 md:left-24 pointer-events-none z-10 opacity-30 text-[#2D2520]">
        <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="50" r="26" strokeDasharray="3 2" />
          <path d="M 32 32 C 45 22, 70 25, 72 45 C 75 65, 55 72, 35 62 C 22 52, 28 35, 48 30 Z" />
          <path d="M 28 55 C 18 68, 8 72, 2 82 C -4 92, 12 95, 28 88" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER — DESKTOP & MOBILE LAYOUTS                                */}
      {/* ========================================================================= */}
      
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between min-h-[500px]">
        
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT MACRAMÉ ARTWORK (Desktop: Bleeding off left edge)                  */}
        {/* ----------------------------------------------------------------------- */}
        <div className="hidden md:block absolute -left-12 lg:-left-16 bottom-0 top-1/2 -translate-y-1/2 w-48 lg:w-64 h-[85%] z-20 pointer-events-none select-none">
          <img
            src={heroMacrameImg}
            alt="Handcrafted Macramé & Textile Wall Hanging"
            className="w-full h-full object-contain object-left filter drop-shadow-xl"
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CENTER CONTENT: HEADLINE, SUBTEXT & CTA BUTTON                          */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full md:w-[60%] lg:w-[58%] md:ml-36 lg:ml-48 flex flex-col items-start text-left z-30 pt-4 md:pt-0">
          
          {/* Main Headline — UNVEILING the SOUL of HANDMADE */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#2D2520] mb-5 sm:mb-6">
            UNVEILING{' '}
            <span className="italic font-light text-[#2D2520]">the</span>
            <br />
            <span className="font-normal text-[#8B5E43] uppercase">SOUL</span>
            <span className="italic font-light text-[#2D2520]"> of </span>
            <span className="font-normal text-[#2D2520] uppercase">HANDMADE</span>
          </h1>

          {/* Subheadline Text */}
          <p className="font-serif text-sm sm:text-base md:text-lg text-[#2D2520]/85 font-normal leading-relaxed max-w-md mb-8 sm:mb-10 tracking-wide">
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </p>

          {/* CTA Pill Button & Curved Pointer Arrow */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#8B5E43] hover:bg-[#794F36] text-[#F5F0EB] transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <span className="font-serif text-xs sm:text-sm tracking-[0.18em] uppercase font-normal">
                EXPLORE <span className="italic lowercase font-light">the</span> COLLECTION
              </span>
            </Link>

            {/* Hand-Drawn Curved Pointer Arrow */}
            <div className="flex items-center gap-1 text-[#8B5E43] opacity-85">
              <svg className="w-10 sm:w-12 h-6" viewBox="0 0 50 25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M 45 6 C 32 2, 18 8, 8 16 C 5 18, 3 20, 2 22" />
                <path d="M 8 14 L 2 22 L 10 22" />
              </svg>
            </div>
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT LIPPAN ART PHOTO CARD (Desktop)                                  */}
        {/* ----------------------------------------------------------------------- */}
        <div className="hidden md:block w-full md:w-[36%] lg:w-[35%] z-20 self-end mb-4">
          <div className="relative bg-white/40 p-2 sm:p-3 rounded-sm shadow-xl border border-white/60 backdrop-blur-xs transition-transform duration-500 hover:scale-[1.01]">
            <img
              src={heroLippanImg}
              alt="Handcrafted Lippan Art Mirror Mandala Tile"
              className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xs shadow-inner"
              loading="eager"
            />
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* MOBILE RESPONSIVE ADAPTATION (Single Column Layout matching Reference)    */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full md:hidden flex flex-col items-center text-center mt-4">
          
          {/* Top Mobile Macramé Artwork Card */}
          <div className="w-full max-w-xs mb-6 rounded-lg overflow-hidden shadow-lg border border-[#EDE6DE] bg-white p-2">
            <img
              src={heroMacrameImg}
              alt="Handcrafted Macramé Wall Art"
              className="w-full h-64 object-cover rounded-md"
            />
          </div>

          {/* Decorative Needles Line Art (Mobile right-flank element) */}
          <div className="my-2 opacity-50 text-[#8B5E43]">
            <svg className="w-12 h-10 mx-auto" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="10" y1="35" x2="45" y2="5" />
              <line x1="18" y1="38" x2="52" y2="8" />
              <path d="M 45 5 C 55 -5, 60 15, 45 25 C 30 35, 10 20, 20 10" />
            </svg>
          </div>

        </div>

      </div>

      {/* Decorative Bottom Botanical Stem (Right Edge) */}
      <div className="absolute bottom-2 right-2 sm:right-6 pointer-events-none z-10 opacity-25 text-[#2D2520]">
        <svg className="w-16 h-24 sm:w-20 sm:h-32" viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M 40 110 Q 30 70 40 10" />
          <path d="M 38 90 C 20 85, 15 70, 35 75" />
          <path d="M 39 70 C 58 65, 62 50, 42 55" />
          <path d="M 37 50 C 22 45, 18 30, 36 35" />
          <path d="M 39 30 C 55 25, 58 10, 40 18" />
        </svg>
      </div>

    </section>
  );
}
