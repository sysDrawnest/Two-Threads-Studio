/**
 * HeroTemplate4 — "Unveiling the Soul of Handmade" (Pixel-Perfect Reference Implementation)
 *
 * Reproduces the approved reference design with maximum visual fidelity:
 * - Palette: Warm Off-White (#F5F0EB / #FAF7F2), Sand Torn Paper (#EDE6DE), Dark Charcoal (#2D2520), Artisan Clay (#8C5A3E)
 * - Typography: Cormorant Garamond / Georgia display serif with mixed uppercase & flowing italic accent connectors
 * - CTA: Double-ring pill container with terracotta fill + hand-drawn line arrow
 * - Imagery: High-res woven macramé tapestry (mobile top) & handcrafted Lippan art mandala disc (desktop torn-paper section)
 * - Vector Line Art: Yarn ball flourishes, trailing thread lines, and mobile embroidery needles
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroMacrameImg from '../../assets/hero_macrame_ref.webp';
import heroLippanImg from '../../assets/hero_lippan_ref.webp';

export default function HeroTemplate4() {
  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#FAF7F2] text-[#2D2520] flex flex-col justify-between overflow-hidden">
      
      {/* ─── MOBILE VIEW (Block Order: Top Artwork Image -> Content Section) ─── */}
      <div className="lg:hidden w-full flex flex-col">
        {/* Top Woven Tapestry / Macramé Header Image */}
        <div className="w-full relative aspect-[4/3.2] max-h-[380px] overflow-hidden bg-[#EDE6DE]">
          <img
            src={heroMacrameImg}
            alt="Handcrafted Macramé and Textile Wall Art"
            className="w-full h-full object-cover object-center"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>

        {/* Mobile Content Container */}
        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col justify-center">
          
          {/* Mobile Right Needle Line Art Illustration */}
          <div className="absolute right-3 top-8 pointer-events-none opacity-85 select-none">
            <svg className="w-16 h-36 text-[#8C5A3E]" viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <path d="M52 18 L28 145" />
              <ellipse cx="50" cy="26" rx="1.5" ry="5.5" transform="rotate(-15 50 26)" />
              <path d="M68 32 L44 158" />
              <ellipse cx="66" cy="40" rx="1.5" ry="5.5" transform="rotate(-15 66 40)" />
              <path d="M50 26 C 30 6, 8 28, 22 48 C 38 68, 72 58, 66 40 C 58 22, 42 38, 20 58 C 0 78, 18 112, 46 132" />
            </svg>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[#2D2520] tracking-tight leading-[1.1] font-normal z-10 max-w-sm">
            <span className="block text-3xl sm:text-4xl uppercase font-normal tracking-[0.03em]">
              UNVEILING
            </span>
            <span className="block text-3xl sm:text-4xl mt-0.5">
              <span className="font-serif italic font-normal lowercase text-[#2D2520]">the </span>
              <span className="uppercase font-normal text-[#8C5A3E] tracking-[0.03em]">SOUL</span>
            </span>
            <span className="block text-3xl sm:text-4xl mt-0.5">
              <span className="font-serif italic font-normal lowercase text-[#2D2520]">of </span>
              <span className="uppercase font-normal tracking-[0.03em]">HANDMADE</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif text-base sm:text-lg text-[#2D2520]/90 leading-snug font-normal max-w-xs mt-4 z-10">
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </p>

          {/* Double-Ring CTA Button & Arrow */}
          <div className="flex items-center gap-3 mt-6 z-10">
            <div className="p-[3px] rounded-full border-[1.5px] border-[#8C5A3E]">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-[#8C5A3E] hover:bg-[#764930] active:bg-[#653d27] text-white px-6 py-2.5 rounded-full font-serif text-xs tracking-[0.12em] transition-all duration-300 shadow-sm"
              >
                <span className="uppercase">EXPLORE </span>
                <span className="font-serif italic lowercase mx-1">the</span>
                <span className="uppercase"> COLLECTION</span>
              </Link>
            </div>
            {/* Hand-drawn left arrow */}
            <svg className="w-8 h-5 text-[#8C5A3E]" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M36 12C28 10 20 14 8 13M8 13L14 7M8 13L13 18" />
            </svg>
          </div>

        </div>
      </div>

      {/* ─── DESKTOP VIEW (Pixel-Perfect Dual Panel with Torn-Paper Right Section) ─── */}
      <div className="hidden lg:flex w-full min-h-[calc(100vh-70px)] items-stretch relative overflow-hidden">
        
        {/* Top-Right Yarn Line Art Illustration */}
        <div className="absolute top-2 right-4 pointer-events-none z-20 opacity-80 select-none">
          <svg className="w-40 h-40 text-[#5A3D2B]" viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
            <circle cx="100" cy="60" r="38" />
            <path d="M68 42 C 82 52, 110 50, 134 44" />
            <path d="M64 60 C 88 68, 116 64, 138 56" />
            <path d="M70 78 C 92 86, 120 78, 136 70" />
            <path d="M82 26 C 86 46, 94 74, 90 96" />
            <path d="M102 22 C 106 46, 110 74, 112 96" />
            <path d="M100 98 C 90 116, 60 108, 40 128 C 20 148, 40 158, 60 152" />
          </svg>
        </div>

        {/* Bottom-Left Trailing Thread & Yarn Line Art Illustration */}
        <div className="absolute -bottom-4 -left-4 pointer-events-none z-10 opacity-75 select-none">
          <svg className="w-80 h-48 text-[#5A3D2B]" viewBox="0 0 320 180" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
            <circle cx="45" cy="135" r="36" />
            <path d="M12 120 C 32 125, 60 120, 80 114" />
            <path d="M10 135 C 34 144, 64 140, 82 132" />
            <path d="M16 150 C 38 156, 65 150, 80 142" />
            <path d="M28 102 C 34 120, 40 148, 38 168" />
            <path d="M46 100 C 50 120, 54 148, 56 168" />
            <path d="M81 135 C 115 130, 135 160, 185 148 C 235 136, 275 165, 320 152" />
          </svg>
        </div>

        {/* Left Column: Typography & CTA */}
        <div className="w-[58%] xl:w-[60%] flex flex-col justify-center px-12 xl:px-20 py-16 relative z-10">
          
          {/* Main Headline */}
          <h1 className="font-serif text-[#2D2520] tracking-tight leading-[1.08] font-normal max-w-2xl">
            <span className="text-5xl xl:text-[68px] uppercase font-normal tracking-[0.03em]">
              UNVEILING{' '}
            </span>
            <span className="font-serif italic font-normal text-5xl xl:text-[68px] lowercase tracking-normal text-[#2D2520]">
              the
            </span>
            <br />
            <span className="text-5xl xl:text-[68px] uppercase font-normal text-[#8C5A3E] tracking-[0.03em]">
              SOUL{' '}
            </span>
            <span className="font-serif italic font-normal text-5xl xl:text-[68px] lowercase tracking-normal text-[#2D2520]">
              of{' '}
            </span>
            <span className="text-5xl xl:text-[68px] uppercase font-normal tracking-[0.03em]">
              HANDMADE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif text-lg xl:text-xl text-[#2D2520]/90 leading-relaxed font-normal max-w-lg mt-6 xl:mt-8">
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </p>

          {/* Double-Ring CTA Button & Arrow */}
          <div className="flex items-center gap-4 mt-8 xl:mt-10">
            <div className="p-[3px] rounded-full border-[1.5px] border-[#8C5A3E] hover:border-[#764930] transition-colors duration-300">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-[#8C5A3E] hover:bg-[#764930] active:bg-[#653d27] text-white px-8 py-3 rounded-full font-serif text-sm tracking-[0.14em] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <span className="uppercase">EXPLORE </span>
                <span className="font-serif italic lowercase mx-1">the</span>
                <span className="uppercase"> COLLECTION</span>
              </Link>
            </div>

            {/* Hand-Drawn Arrow */}
            <svg className="w-10 h-6 text-[#8C5A3E] transform translate-y-0.5" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M36 12C28 10 20 14 8 13M8 13L14 7M8 13L13 18" />
            </svg>
          </div>

        </div>

        {/* Right Column: Torn-Paper Section & Lippan Art Image Card */}
        <div className="w-[42%] xl:w-[40%] bg-[#EDE6DE] relative flex items-center justify-center p-8 xl:p-12">
          
          {/* Vertical Torn Paper Edge Mask / Path running down the left side */}
          <svg
            className="absolute top-0 bottom-0 -left-[23px] h-full w-6 text-[#EDE6DE] fill-current pointer-events-none z-10"
            viewBox="0 0 30 800"
            preserveAspectRatio="none"
          >
            <path d="M30 0 L14 25 L26 50 L10 75 L28 105 L12 135 L26 160 L14 190 L29 220 L10 250 L27 280 L15 310 L28 340 L12 370 L26 400 L10 430 L29 460 L14 490 L27 520 L12 550 L28 580 L15 610 L26 640 L10 670 L28 700 L14 735 L27 765 L30 800 Z" />
          </svg>

          {/* Lippan Mandala Disc Photo Frame */}
          <div className="relative z-20 w-full max-w-sm aspect-[4/3] rounded-sm overflow-hidden shadow-md border border-[#2D2520]/10 bg-white">
            <img
              src={heroLippanImg}
              alt="Handcrafted Lippan Art Mandala Disc"
              className="w-full h-full object-cover object-center filter contrast-[1.03]"
              // @ts-ignore
              fetchpriority="high"
            />
          </div>

        </div>

      </div>

    </section>
  );
}
