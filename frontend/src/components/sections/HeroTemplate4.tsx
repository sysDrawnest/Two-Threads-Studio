/**
 * Hero Template 4 — The Soul of Handmade (Pixel-Perfect Reference Reconstruction)
 *
 * Exact implementation of the reference hero composition for Two Threads Studio.
 * - Primary Palette: Warm Organic Linen #F5F0EB, Torn Paper #EDE6DE, Dark Charcoal #2D2520, Terracotta Brown #8B624C.
 * - Typography: Cormorant Garamond (Serif) & DM Sans / Lato.
 * - Features:
 *   1. Left-aligned Macramé / Textile Wall Hanging visual statement.
 *   2. Bottom-right Lippan Art / Mandala Clay Tile photo over torn paper texture backdrop.
 *   3. Editorial Headline: "UNVEILING the SOUL of HANDMADE".
 *   4. Subtext: "Contemporary Embroidery, Crochet, Macramé & Lippan Art. Crafted for the Discerning."
 *   5. Capsule Pill CTA Button: "EXPLORE the COLLECTION" + hand-drawn curved arrow.
 *   6. Artistic SVG line illustrations (Yarn balls, thread swirls, needles, botanical line art).
 *   7. Tailored mobile adaptation directly reproducing the mobile mockup in the reference design.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Project Assets
import macrameImg from '../../assets/1F78D49-EC80-4B90-A90F-D848BECFD893.webp';
import lippanImg from '../../assets/Temple_relief_with_floral_mandalas_202607141319.webp';

// ─── SVG VECTOR ILLUSTRATION COMPONENTS ───

// Hand-sketched yarn ball line art
const YarnBallSVG = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" stroke="#7A685B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="60" cy="60" rx="34" ry="34" strokeDasharray="3 2" />
    <path d="M 30,55 C 45,30 75,30 90,55 C 75,80 45,80 30,55 Z" />
    <path d="M 35,40 C 50,58 70,58 85,40" />
    <path d="M 35,70 C 50,52 70,52 85,70" />
    <path d="M 60,26 C 42,45 42,75 60,94" />
    <path d="M 60,26 C 78,45 78,75 60,94" />
    {/* Flowing thread tail */}
    <path d="M 84,74 C 96,88 112,84 106,104 C 100,118 68,108 48,114 C 28,120 10,105 5,90" strokeWidth="1.1" />
  </svg>
);

// Pair of fine embroidery needles with trailing thread
const NeedlesSVG = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 140" fill="none" stroke="#7A685B" strokeWidth="1.3" strokeLinecap="round">
    <path d="M 32,8 L 46,110 L 48,130 L 50,110 L 42,8 Z" />
    <ellipse cx="37" cy="18" rx="1.2" ry="3.5" fill="#7A685B" />
    <path d="M 48,14 L 56,105 L 58,125 L 60,105 L 54,14 Z" />
    <ellipse cx="51" cy="22" rx="1.2" ry="3.5" fill="#7A685B" />
    <path d="M 37,18 C 26,4 12,28 22,58 C 32,88 64,78 68,102 C 72,126 52,132 42,118" strokeWidth="1" />
  </svg>
);

// Hand-drawn curved arrow pointing to CTA
const CurvedArrowSVG = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 65 30" fill="none" stroke="#8B624C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 58,8 C 42,26 20,22 8,14" />
    <path d="M 8,14 L 15,9" />
    <path d="M 8,14 L 13,21" />
  </svg>
);

// Botanical leaf branch drawing
const BotanicalBranchSVG = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 200" fill="none" stroke="#7A685B" strokeWidth="1.2" strokeLinecap="round">
    <path d="M 50,190 C 46,140 54,80 58,10" />
    <path d="M 53,150 C 38,140 24,145 18,135 C 28,130 42,135 51,144" />
    <path d="M 55,110 C 73,100 83,105 88,95 C 78,90 63,95 54,105" />
    <path d="M 56,70 C 40,60 28,65 20,55 C 30,50 46,55 55,65" />
    <path d="M 58,30 C 70,20 78,25 83,15 C 73,12 63,18 57,27" />
  </svg>
);

// Organic torn paper background shape
const TornPaperShape = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 600 450" fill="#EDE6DE" preserveAspectRatio="none">
    <path d="M 25,0 
             C 75,10 135,2 185,16 
             C 235,6 305,20 365,8 
             C 425,22 495,4 565,18 
             L 600,22 L 600,450 L 0,450 L 0,30 
             C 10,12 18,18 25,0 Z" />
  </svg>
);

export default function HeroTemplate4() {
  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] lg:min-h-[820px] bg-[#F5F0EB] text-[#2D2520] overflow-hidden flex flex-col justify-between select-none">
      
      {/* ─── DESKTOP TOP INLINE HEADER (Matching Reference Navbar Style) ─── */}
      <div className="hidden lg:flex items-center justify-between px-12 xl:px-16 pt-8 pb-4 z-20 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-normal tracking-wide text-[#2D2520]">
            Two Threads Studio
          </span>
          <span className="text-[#8B624C] font-mono text-sm ml-0.5">╳</span>
        </div>

        <nav className="flex items-center gap-8 font-sans text-xs tracking-[0.15em] uppercase text-[#554D47]/90 font-medium">
          <Link to="/shop" className="hover:text-[#8B624C] transition-colors">Collections</Link>
          <Link to="/about" className="hover:text-[#8B624C] transition-colors">Our Craft</Link>
          <Link to="/about" className="hover:text-[#8B624C] transition-colors">The Studio</Link>
          <Link to="/learning" className="hover:text-[#8B624C] transition-colors">Journal</Link>
        </nav>
      </div>

      {/* ─── MAIN HERO CANVAS (DESKTOP & TABLET VIEW) ─── */}
      <div className="hidden md:flex relative w-full max-w-7xl mx-auto px-8 lg:px-16 py-6 lg:py-10 flex-1 flex-col justify-center z-10">
        
        {/* Left Macramé / Textile Wall Hanging Visual Statement */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
        >
          <div className="relative w-[180px] lg:w-[240px] xl:w-[280px] h-[480px] lg:h-[580px] overflow-hidden shadow-2xl rounded-r-3xl border-r border-t border-b border-[#2D2520]/10">
            <img
              src={macrameImg}
              alt="Handcrafted Macramé Textile Hanging"
              className="w-full h-full object-cover object-left filter brightness-[0.95] contrast-[1.05]"
              // @ts-ignore
              fetchpriority="high"
            />
            {/* Soft subtle gradient edge fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#F5F0EB]/30" />
          </div>
        </motion.div>

        {/* Decorative Top-Right Yarn Ball & Swirling Thread Lines */}
        <div className="absolute top-4 right-20 lg:right-40 z-0 pointer-events-none opacity-80">
          <YarnBallSVG className="w-28 h-28 lg:w-36 lg:h-36 text-[#8B7E74]" />
        </div>

        {/* Long Swirling Thread Vector Path across background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" viewBox="0 0 1200 700" fill="none" stroke="#7A685B" strokeWidth="1">
          <path d="M 850,80 C 700,160 550,50 350,180 C 150,310 200,550 400,620 C 600,690 900,520 1150,600" strokeDasharray="4 3" />
        </svg>

        {/* Core Center Content Grid */}
        <div className="relative z-20 pl-40 lg:pl-56 pr-4 lg:pr-8 py-4 max-w-4xl">
          
          {/* Main Headline — Exact Reference Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] tracking-tight leading-[1.04] text-[#2D2520]">
              UNVEILING <span className="font-serif italic font-light text-[#2D2520] ml-1 sm:ml-2">the</span>
              <br />
              <span className="text-[#8B5E43] font-medium tracking-[0.04em]">SOUL</span>{" "}
              <span className="font-serif italic font-light text-[#2D2520] mx-1 sm:mx-2">of</span>{" "}
              <span className="tracking-[0.04em] font-normal">HANDMADE</span>
            </h1>
          </motion.div>

          {/* Subtext Statement */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-base sm:text-lg lg:text-xl text-[#554D47] font-normal leading-relaxed max-w-md mt-6 lg:mt-8"
          >
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </motion.p>

          {/* CTA Capsule Button + Hand-Drawn Arrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mt-8 lg:mt-10"
          >
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-9 sm:py-4 bg-[#8B624C] hover:bg-[#77523C] text-[#F5F0EB] rounded-full transition-all duration-300 shadow-md border border-[#9A6B52]/40 cursor-pointer group"
            >
              <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-[#F5F0EB]">EXPLORE</span>
              <span className="font-serif italic text-sm font-normal text-[#F5F0EB]">the</span>
              <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-[#F5F0EB]">COLLECTION</span>
            </Link>

            {/* Hand-drawn Arrow pointing to CTA button */}
            <CurvedArrowSVG className="w-12 h-6 text-[#8B624C] opacity-90 transition-transform duration-300 hover:translate-x-1" />
          </motion.div>

        </div>

        {/* Bottom Right Torn Paper & Lippan Art Mosaic Photo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-4 lg:right-12 bottom-4 lg:bottom-8 z-10 hidden md:block"
        >
          <div className="relative w-[320px] lg:w-[420px] xl:w-[460px]">
            {/* Torn Paper Backdrop Shape */}
            <div className="absolute -inset-4 z-0 pointer-events-none">
              <TornPaperShape className="w-full h-full drop-shadow-sm opacity-90" />
            </div>

            {/* Lippan Art Tile Photo */}
            <div className="relative z-10 p-2 bg-[#F5F0EB] shadow-xl border border-[#2D2520]/10 rounded-sm overflow-hidden">
              <img
                src={lippanImg}
                alt="Handcrafted Lippan Art Mirror Tile"
                className="w-full h-[210px] lg:h-[260px] object-cover object-center filter contrast-[1.04]"
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom Left Yarn Ball Line Art */}
        <div className="absolute left-6 bottom-4 z-0 pointer-events-none opacity-70">
          <YarnBallSVG className="w-24 h-24 text-[#8B7E74]" />
        </div>

        {/* Right Corner Botanical Line Art */}
        <div className="absolute right-0 bottom-12 z-0 pointer-events-none opacity-40">
          <BotanicalBranchSVG className="w-28 h-48 text-[#7A685B]" />
        </div>

      </div>

      {/* ─── MOBILE ADAPTATION (Exact Reproduction of Reference Mobile Mockup) ─── */}
      <div className="flex md:hidden flex-col w-full bg-[#F5F0EB] text-[#2D2520] overflow-hidden pb-12">
        
        {/* Mobile Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2520]/10 bg-[#F5F0EB] z-20">
          <button aria-label="Menu" className="text-[#2D2520] p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <span className="font-serif text-lg font-normal tracking-wide text-[#2D2520]">
            Two Threads Studio
          </span>

          <div className="w-6" /> {/* Balance spacer */}
        </div>

        {/* Mobile Top Hero Visual — Macramé Wall Hanging Feature Image */}
        <div className="relative w-full h-[260px] sm:h-[320px] overflow-hidden shadow-md">
          <img
            src={macrameImg}
            alt="Handcrafted Macramé Textile Art"
            className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.03]"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>

        {/* Mobile Main Content */}
        <div className="relative px-6 pt-8 pb-4 flex flex-col items-start z-10">
          
          {/* Mobile Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-[1.08] text-[#2D2520]">
            UNVEILING
            <br />
            <span className="font-serif italic font-light text-[#2D2520]">the</span>{" "}
            <span className="text-[#8B5E43] font-medium tracking-[0.04em]">SOUL</span>
            <br />
            <span className="font-serif italic font-light text-[#2D2520]">of</span>{" "}
            <span className="tracking-[0.04em] font-normal">HANDMADE</span>
          </h1>

          {/* Mobile Subtext */}
          <p className="font-serif text-sm sm:text-base text-[#554D47] font-normal leading-relaxed mt-4 max-w-xs">
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </p>

          {/* Mobile CTA Button + Arrow */}
          <div className="flex items-center gap-3 mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-[#8B624C] hover:bg-[#77523C] text-[#F5F0EB] rounded-full shadow-sm text-xs border border-[#9A6B52]/40"
            >
              <span className="font-sans tracking-[0.18em] uppercase font-semibold text-[#F5F0EB]">EXPLORE</span>
              <span className="font-serif italic text-xs font-normal text-[#F5F0EB]">the</span>
              <span className="font-sans tracking-[0.18em] uppercase font-semibold text-[#F5F0EB]">COLLECTION</span>
            </Link>

            <CurvedArrowSVG className="w-10 h-5 text-[#8B624C]" />
          </div>

          {/* Mobile Needle Illustration on Right Margin */}
          <div className="absolute right-4 bottom-2 pointer-events-none opacity-80">
            <NeedlesSVG className="w-16 h-28 text-[#7A685B]" />
          </div>

          {/* Mobile Right Corner Botanical Accent */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-40">
            <BotanicalBranchSVG className="w-20 h-36 text-[#7A685B]" />
          </div>

        </div>

      </div>

    </section>
  );
}
