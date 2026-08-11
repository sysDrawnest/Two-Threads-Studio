/**
 * HeroTemplate4 — "Unveiling the Soul of Handmade" (Enhanced Premium Design)
 *
 * Implements the approved premium reference design with:
 * - Micro-Linen Background on the left and Hand-Spun Paper Background on the right.
 * - Elegant Scallop Border separating the columns with parallel running dotted stitch line.
 * - Refined serif & script mixed typography with a flowing copper-red thread SVG line.
 * - Realistic SVG-based yarn bundle, wooden crochet hooks, and golden needle details.
 * - Stitched Leather Tag style CTA button with gold foil text.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroMacrameImg from '../../assets/hero_macrame_ref.webp';
import heroLippanImg from '../../assets/hero_lippan_ref.webp';

export default function HeroTemplate4() {
  // Helper to generate the premium scalloped edge path
  const generateScallopPath = () => {
    let path = 'M 24 0 ';
    const scallopHeight = 24; // Height of each scallop wave
    const totalScallops = 55; // Covers full height dynamically
    for (let i = 0; i < totalScallops; i++) {
      const startY = i * scallopHeight;
      const endY = startY + scallopHeight;
      path += `C 10 ${startY + 4}, 10 ${endY - 4}, 24 ${endY} `;
    }
    path += 'H 24 V 0 Z';
    return path;
  };

  // Helper to generate parallel stitch line path
  const generateStitchPath = () => {
    let path = 'M 21 0 ';
    const scallopHeight = 24;
    const totalScallops = 55;
    for (let i = 0; i < totalScallops; i++) {
      const startY = i * scallopHeight;
      const endY = startY + scallopHeight;
      path += `C 7 ${startY + 4}, 7 ${endY - 4}, 21 ${endY} `;
    }
    return path;
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#FAF7F2] text-[#2D2520] flex flex-col justify-between overflow-hidden">
      
      {/* ─── INLINE SVG NOISE FILTER FOR HANDMADE PAPER GRAIN ─── */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="paper-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>

      {/* ─── MOBILE VIEW (Linen Background & Enhanced Typography) ─── */}
      <div className="lg:hidden w-full flex flex-col">
        {/* Top Tapestry Header Image */}
        <div className="w-full relative aspect-[4/3.2] max-h-[380px] overflow-hidden bg-[#EDE6DE] border-b border-[#2D2520]/10">
          <img
            src={heroMacrameImg}
            alt="Handcrafted Macramé Tapestry"
            className="w-full h-full object-cover object-center"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>

        {/* Content Section with Micro-Linen Texture */}
        <div 
          className="relative px-6 py-10 sm:px-10 flex flex-col justify-center bg-[#FAF9F6] border-t border-[#FAF7F2]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(45, 37, 32, 0.02) 1px, transparent 1px),
              linear-gradient(0deg, rgba(45, 37, 32, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px'
          }}
        >
          {/* Thread Line Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
              <path
                d="M -20 220 C 100 220, 120 80, 200 120 C 260 150, 310 60, 420 100"
                stroke="#A34A38"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[#2D2520] tracking-tight leading-[1.1] font-normal z-10 max-w-sm">
            <span className="block text-3xl sm:text-4xl uppercase font-normal tracking-[0.03em] text-[#2D2520]">
              UNVEILING
            </span>
            <span className="block text-3xl sm:text-4xl mt-1 text-[#2D2520]">
              <span className="font-serif italic font-normal lowercase mr-2 text-[#8B6F5C]">the</span>
              <span className="uppercase font-normal tracking-[0.03em]">SOUL</span>
              <span className="font-serif italic font-normal lowercase mx-2 text-[#8B6F5C]">of</span>
            </span>
            <span className="block text-3xl sm:text-4xl mt-1 uppercase font-normal tracking-[0.03em] text-[#2D2520]">
              HANDMADE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif text-sm sm:text-base text-[#2D2520]/80 leading-relaxed font-normal max-w-xs mt-4 z-10">
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </p>

          {/* Stitched Leather Tag CTA Button */}
          <div className="flex items-center gap-3 mt-8 z-10">
            <Link
              to="/shop"
              className="relative px-6 py-3 bg-[#5A3D2B] rounded-xs shadow-[0_3px_8px_rgba(45,37,32,0.25)] hover:shadow-[0_5px_12px_rgba(45,37,32,0.35)] transition-all duration-300 border border-[#8B6F5C]/20 group"
            >
              {/* Inner Stitched Border */}
              <div className="absolute inset-1 border border-dashed border-[#FAF7F2]/30 rounded-xs pointer-events-none" />
              
              <span className="font-serif text-xs tracking-[0.15em] text-[#EDE6DE] font-semibold uppercase block">
                EXPLORE <span className="italic lowercase font-light text-[#FAF7F2]/80">the</span> COLLECTION
              </span>
            </Link>

            {/* Left Hand-Drawn Arrow */}
            <span className="text-[#8B6F5C] text-xl font-light select-none transform translate-y-[-1px]">
              &larr;
            </span>
          </div>

        </div>
      </div>

      {/* ─── DESKTOP VIEW (Dual Panel Premium Textures & Artisanal Assets) ─── */}
      <div className="hidden lg:flex w-full min-h-[calc(100vh-70px)] items-stretch relative overflow-hidden">
        
        {/* Flowing Copper-Red Thread Line Art */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-15 select-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <path
              d="M -20 620 C 180 620, 140 280, 280 280 C 350 280, 360 170, 480 200 C 600 230, 620 370, 800 320 C 920 290, 960 480, 1000 620"
              stroke="#A34A38"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Left Column: Typography, Micro-Linen Texture, CTA */}
        <div 
          className="w-[58%] xl:w-[60%] flex flex-col justify-center px-12 xl:px-20 py-16 relative z-10"
          style={{
            backgroundColor: '#FBFBFA',
            backgroundImage: `
              linear-gradient(90deg, rgba(45, 37, 32, 0.025) 1px, transparent 1px),
              linear-gradient(0deg, rgba(45, 37, 32, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 37, 32, 0.015) 1px, transparent 1px),
              linear-gradient(0deg, rgba(45, 37, 32, 0.015) 1px, transparent 1px)
            `,
            backgroundSize: '6px 6px, 6px 6px, 16px 16px, 16px 16px'
          }}
        >
          {/* Bottom-Left Skitched Globe Mandala Illustration */}
          <div className="absolute -bottom-10 -left-10 pointer-events-none opacity-40 select-none">
            <svg className="w-56 h-56 text-[#8B6F5C]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
              <circle cx="60" cy="140" r="45" />
              <circle cx="60" cy="140" r="34" strokeDasharray="2 2" />
              <circle cx="60" cy="140" r="22" />
              <circle cx="60" cy="140" r="10" />
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const x2 = 60 + 45 * Math.cos(rad);
                const y2 = 140 + 45 * Math.sin(rad);
                return <line key={i} x1="60" y1="140" x2={x2} y2={y2} />;
              })}
              <path d="M 60 140 C 110 140, 130 170, 170 160 C 200 150, 220 180, 240 170" />
              <path d="M 60 140 C 80 110, 130 120, 170 100 C 200 80, 220 110, 240 90" />
            </svg>
          </div>

          {/* Main Headline with Custom Serif & script styles */}
          <h1 className="font-serif text-[#2D2520] tracking-tight leading-[1.08] font-normal max-w-2xl">
            <span className="text-5xl xl:text-[68px] uppercase font-normal tracking-[0.03em] block">
              UNVEILING
            </span>
            <span className="text-5xl xl:text-[68px] font-normal block mt-1">
              <span className="font-serif italic font-light lowercase text-[#8B6F5C] mr-4">the</span>
              <span className="uppercase font-normal text-[#2D2520] tracking-[0.03em]">SOUL</span>
              <span className="font-serif italic font-light lowercase text-[#8B6F5C] mx-4">of</span>
            </span>
            <span className="text-5xl xl:text-[68px] uppercase font-normal tracking-[0.03em] block mt-1">
              HANDMADE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif text-base xl:text-lg text-[#2D2520]/80 leading-relaxed font-normal max-w-md mt-6 xl:mt-8">
            Contemporary Embroidery, Crochet, Macramé &amp; Lippan Art. Crafted for the Discerning.
          </p>

          {/* Stitched Leather Tag CTA Button */}
          <div className="flex items-center gap-4 mt-8 xl:mt-10">
            <Link
              to="/shop"
              className="relative px-8 py-3 bg-[#5A3D2B] rounded-xs shadow-[0_4px_10px_rgba(45,37,32,0.28)] hover:shadow-[0_6px_15px_rgba(45,37,32,0.38)] transition-all duration-300 border border-[#8B6F5C]/20 group"
            >
              {/* Inner Stitched Border */}
              <div className="absolute inset-1 border border-dashed border-[#FAF7F2]/30 rounded-xs pointer-events-none" />
              
              <span className="font-serif text-sm tracking-[0.15em] text-[#EDE6DE] font-semibold uppercase block select-none">
                EXPLORE <span className="italic lowercase font-light text-[#FAF7F2]/80">the</span> COLLECTION
              </span>
            </Link>

            {/* Left Hand-Drawn Arrow */}
            <span className="text-[#8B6F5C] text-2xl font-light select-none transform translate-y-[-1px]">
              &larr;
            </span>
          </div>

        </div>

        {/* Right Column: Hand-Spun Paper Background & Scallop Ribbon */}
        <div 
          className="w-[42%] xl:w-[40%] bg-[#EDE6DE] relative flex items-center justify-center p-8 xl:p-12 border-l border-[#2D2520]/5"
          style={{
            backgroundColor: '#FAF6F0',
            backgroundImage: 'radial-gradient(rgba(139, 111, 92, 0.12) 0.75px, transparent 0.75px)',
            backgroundSize: '20px 20px',
            filter: 'url(#paper-grain)'
          }}
        >
          
          {/* Vertical Scallop Border Divider with stitched line */}
          <svg
            className="absolute top-0 bottom-0 -left-[23px] h-full w-6 text-[#FAF6F0] drop-shadow-[-4px_0_6px_rgba(45,37,32,0.08)] pointer-events-none z-10"
            viewBox="0 0 24 1260"
            preserveAspectRatio="none"
          >
            <path d={generateScallopPath()} fill="currentColor" />
            <path d={generateStitchPath()} fill="none" stroke="#8B6F5C" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
          </svg>

          {/* ─── ARTISANAL STORYTELLING ASSETS ─── */}
          
          {/* Top-Right: Colorful Yarn Ball */}
          <div className="absolute top-6 right-8 pointer-events-none z-20 select-none animate-[float_6s_ease-in-out_infinite]">
            <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[2px_6px_8px_rgba(45,37,32,0.22)]">
              <circle cx="50" cy="50" r="43" fill="#DDBB99" opacity="0.1" />
              <g strokeWidth="2.2" strokeLinecap="round">
                {/* Green Strands */}
                <path d="M 20 50 C 20 20, 80 20, 80 50" stroke="#6B705C" fill="none" />
                <path d="M 23 47 C 23 23, 77 23, 77 47" stroke="#6B705C" fill="none" />
                <path d="M 26 44 C 26 26, 74 26, 74 44" stroke="#6B705C" fill="none" />

                {/* Ochre Gold Strands */}
                <path d="M 50 20 C 20 20, 20 80, 50 80" stroke="#B58A4C" fill="none" />
                <path d="M 47 23 C 23 23, 23 77, 47 77" stroke="#B58A4C" fill="none" />
                <path d="M 44 26 C 26 26, 26 74, 44 74" stroke="#B58A4C" fill="none" />

                {/* Terracotta Red Strands */}
                <path d="M 50 20 C 80 20, 80 80, 50 80" stroke="#A34A38" fill="none" />
                <path d="M 53 23 C 77 23, 77 77, 53 77" stroke="#A34A38" fill="none" />
                <path d="M 56 26 C 74 26, 74 74, 56 74" stroke="#A34A38" fill="none" />

                {/* Accent highlights */}
                <path d="M 25 25 C 45 45, 55 55, 75 75" stroke="#FAF7F2" fill="none" strokeWidth="1.5" />
                <path d="M 28 22 C 48 42, 58 52, 78 72" stroke="#6B705C" fill="none" />
                <path d="M 22 28 C 42 48, 52 58, 72 78" stroke="#A34A38" fill="none" />
              </g>
              <path d="M 80 40 C 90 25, 95 30, 92 15 C 88 5, 82 18, 86 35" stroke="#6B705C" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Under-Yarn: Diagonally placed Wooden Crochet Hook */}
          <div className="absolute top-16 right-20 pointer-events-none z-15 select-none transform rotate-[25deg]">
            <svg viewBox="0 0 160 40" className="w-48 h-12 drop-shadow-[2px_4px_6px_rgba(45,37,32,0.18)]">
              <defs>
                <linearGradient id="wood-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C68B59" />
                  <stop offset="50%" stopColor="#A05C2C" />
                  <stop offset="100%" stopColor="#7E431B" />
                </linearGradient>
              </defs>
              <g fill="url(#wood-gradient-1)">
                <rect x="30" y="18" width="120" height="4.5" rx="2" />
                <path d="M 85 16 C 90 16, 95 15, 100 18 L 105 18 C 110 15, 115 16, 120 18 H 125 V 22 H 120 C 115 24, 110 25, 105 22 L 100 22 C 95 25, 90 24, 85 22 Z" opacity="0.9" />
                <path d="M 30 20.2 L 15 20.2 C 10 20.2, 8 16.2, 12 13.2 C 14 11.2, 17 11.2, 15 14.2 L 18 16.2 C 22 16.2, 26 19.2, 30 20.2 Z" />
              </g>
            </svg>
          </div>

          {/* Lippan Mandala Disc Photo Frame resting on Jute Mat */}
          <div className="relative z-20 w-full max-w-sm aspect-[4/3] rounded-xs overflow-hidden shadow-[0_12px_32px_rgba(45,37,32,0.22)] border border-[#2D2520]/10 bg-white">
            <img
              src={heroLippanImg}
              alt="Handcrafted Lippan Art Mandala Disc on Jute Mat"
              className="w-full h-full object-cover object-center filter contrast-[1.03]"
              // @ts-ignore
              fetchpriority="high"
            />
          </div>

          {/* Bottom: Hand-carved Dark Wooden Needle & Brass Needle with Looping Thread */}
          <div className="absolute -bottom-6 right-16 pointer-events-none z-25 select-none flex flex-col items-center">
            {/* Dark Wood Crochet Needle */}
            <div className="transform rotate-[-12deg] translate-y-2">
              <svg viewBox="0 0 180 40" className="w-56 h-12 drop-shadow-[3px_6px_8px_rgba(45,37,32,0.28)]">
                <defs>
                  <linearGradient id="dark-wood-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5A3D2B" />
                    <stop offset="50%" stopColor="#3E271B" />
                    <stop offset="100%" stopColor="#25160E" />
                  </linearGradient>
                </defs>
                <g fill="url(#dark-wood-1)">
                  <path d="M 175 20 L 160 17 C 158 17, 155 18, 153 20 C 155 22, 158 23, 160 23 Z" />
                  <rect x="30" y="17.5" width="130" height="5" rx="2.5" />
                  <circle cx="45" cy="20" r="4.5" />
                  <circle cx="58" cy="20" r="5" />
                  <circle cx="71" cy="20" r="4.5" />
                  <path d="M 30 20 C 30 16, 22 16, 22 20 C 22 24, 30 24, 30 20 Z" />
                </g>
              </svg>
            </div>

            {/* Fine Golden Brass Needle */}
            <div className="transform rotate-[35deg] translate-x-[-40px] translate-y-[-14px]">
              <svg viewBox="0 0 80 10" className="w-24 h-4 drop-shadow-[1px_2px_3px_rgba(45,37,32,0.18)]">
                <path d="M 5 5 L 70 4.5 C 74 4.5, 78 4.8, 80 5 C 78 5.2, 74 5.5, 70 5.5 Z" fill="#D4AF37" />
                <ellipse cx="73" cy="5" rx="1.8" ry="0.6" fill="#FAF6F0" />
              </svg>
            </div>
            
            {/* Fine thread looping output */}
            <div className="absolute top-2 left-6 opacity-85">
              <svg className="w-28 h-20 text-[#8B6F5C]" viewBox="0 0 110 80" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path d="M 10 30 C 20 60, 50 70, 70 45 C 90 20, 80 10, 65 30 C 50 50, 45 40, 55 20 C 65 0, 95 30, 105 70" />
              </svg>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
