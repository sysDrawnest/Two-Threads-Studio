/**
 * HeroTemplate4 — "Unveiling the Soul of Handmade" (Pixel-Perfect Reference Reconstruction)
 *
 * Reconstructs the hero template to match the visual reference precisely:
 * - Proportions: Wide editorial banner layout with a height of exactly 540px on desktop (preventing vertical stretching).
 * - Background split: Soft wave divider SVG creating the organic ivory/tan transition.
 * - Typography: Compact typography with custom swashes matching the reference swashes.
 * - Headline layout: Breaks precisely as "UNVEILING the" (row 1) / "SOUL of HANDMADE" (row 2).
 * - Overlapping Collage: 4-image cluster placed exactly as shown in the reference.
 * - Decorative detail: Top-left gold monogram logo, upper-right monogram/needle/tassel SVG,
 *   and bottom-left Lippan mirror-work star.
 * - CTA Button: Compact terracotta pill with brushed gold gradient border and separate long-line arrow.
 * - Scroll indicator: Absolute-centered at the bottom of the entire screen width.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import heroEmbroideryImg from '../../assets/hero_embroidery.jpg';
import heroMacrameImg from '../../assets/hero_macrame.jpg';
import heroCrochetImg from '../../assets/hero_crochet.jpg';
import heroLippanImg from '../../assets/hero_lippan.jpg';

export default function HeroTemplate4() {
  return (
    <section className="relative w-full h-[520px] lg:h-[580px] xl:h-[600px] bg-[#FAF7F2] text-[#1E1812] overflow-hidden select-none">
      
      {/* ─── DESKTOP VIEW (Two-Column Layout) ─── */}
      <div className="hidden lg:flex w-full h-full items-stretch relative">
        
        {/* Left Column: Typography, Swashes, CTA & Corner Mandala (58% width) */}
        <div className="w-[58%] bg-[#FAF7F2] flex flex-col justify-between pl-16 xl:pl-24 pr-8 py-10 relative z-10">
          
          {/* Top-Left Monogram Logo (Asset 10) */}
          <div className="w-10 h-10 mt-1">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#8B6F5C]">
              {/* Elegant script monogram shape */}
              <path
                d="M32 30 C38 18, 48 14, 58 20 C68 26, 62 40, 50 46 C38 52, 32 68, 44 74 C56 80, 68 74, 72 62"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M50 20 C50 10, 32 10, 32 20 C32 30, 68 30, 68 40 C68 50, 50 50, 50 40"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Centered Headline Content */}
          <div className="my-auto relative py-6">
            
            {/* Elegant SVG Swashes (Asset 8) */}
            <div className="absolute left-[-20px] top-[10px] w-[500px] h-[160px] pointer-events-none -z-10 opacity-80">
              <svg viewBox="0 0 500 160" fill="none" className="w-full h-full text-[#8B6F5C]/45">
                {/* Under-swash curving behind SOUL */}
                <path d="M12 75 C 90 105, 140 100, 190 75 C 240 50, 275 80, 260 105 C 240 130, 180 110, 160 85" strokeWidth="1" />
                {/* Swash wrapping the word 'the' */}
                <path d="M210 25 C 265 15, 345 35, 385 20 C 405 10, 395 -5, 375 5" strokeWidth="1.2" />
                {/* Left side flourish under UNVEILING */}
                <path d="M5 42 C 45 42, 85 58, 125 58" strokeWidth="0.8" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-[#1E1812] tracking-tight leading-[1.06] font-light">
              <span className="block text-4xl xl:text-5xl uppercase tracking-[0.03em]">
                <span className="text-[#8B6F5C] font-normal">UNVEILING </span>
                <span className="font-serif italic font-light lowercase text-[#8B6F5C] tracking-wide relative inline-block ml-1">
                  the
                </span>
              </span>
              <span className="block text-4xl xl:text-5xl mt-1">
                <span className="uppercase font-normal text-[#2D2520] tracking-[0.04em]">SOUL </span>
                <span className="font-serif italic font-light lowercase text-[#8B6F5C] tracking-wide mx-2">of</span>
                <span className="uppercase font-normal text-[#2D2520] tracking-[0.04em]">HANDMADE</span>
              </span>
            </h1>

            {/* Subtext Description (Matches wrapping exactly) */}
            <p className="font-sans text-[11px] xl:text-xs tracking-[0.14em] text-[#2D2520]/80 uppercase mt-6 leading-relaxed max-w-xl">
              Contemporary Embroidery <span className="text-[#8B6F5C]/50 mx-1.5">|</span> Crochet{' '}
              <span className="text-[#8B6F5C]/50 mx-1.5">|</span> Macramé <span className="text-[#8B6F5C]/50 mx-1.5">|</span> Lippan Art.
              <br />
              <span className="text-[#8B6F5C] font-semibold">Crafted for the Discerning.</span>
            </p>

            {/* Compact CTA & Arrow */}
            <div className="flex items-center gap-5 mt-8">
              {/* Premium Brushed Gold Metallic Border Wrapper */}
              <div className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] p-[1.5px] rounded-full shadow-md transition-all duration-300 hover:shadow-lg">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center bg-[#8C5A3E] hover:bg-[#764930] text-white px-7 py-2.5 rounded-full font-serif text-xs tracking-[0.15em] transition-colors duration-300 uppercase font-semibold"
                >
                  EXPLORE <span className="font-serif italic font-light lowercase mx-1 text-[#EDE6DE]">the</span> COLLECTION
                </Link>
              </div>

              {/* Hand-drawn elegant line arrow (Asset 13) */}
              <svg className="w-10 h-5 text-[#8B6F5C] transform translate-y-0.5" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10 L38 10" />
                <path d="M30 4 L38 10 L30 16" />
              </svg>
            </div>

          </div>

          {/* Empty spacer to align content properly */}
          <div className="h-6" />

          {/* Bottom-Left Multi-pointed Lippan Star Corner Graphic (Asset 11) */}
          <div className="absolute -bottom-8 -left-8 w-40 h-40 opacity-70 pointer-events-none select-none -z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#8B6F5C]/35 fill-current">
              <circle cx="50" cy="50" r="44" stroke="#8B6F5C" strokeWidth="0.6" strokeDasharray="2 2" fill="none" />
              <path d="M50 5 L54 34 L82 28 L58 44 L78 72 L50 53 L22 72 L42 44 L18 28 L46 34 Z" stroke="#8B6F5C" strokeWidth="0.8" fill="#EDE6DE"/ >
              {/* Mirrors */}
              <polygon points="50,14 52,24 48,24" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
              <polygon points="73,24 65,28 68,31" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
              <polygon points="82,48 73,46 73,50" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
              <polygon points="68,66 65,68 73,73" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
              <polygon points="50,82 51,73 49,73" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
              <polygon points="32,66 35,68 27,73" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
              <polygon points="18,48 27,46 27,50" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
              <polygon points="27,24 35,28 32,31" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.4" />
            </svg>
          </div>

        </div>

        {/* Right Column: Tan panel separated by wave curve with Image Cluster (42% width) */}
        <div className="w-[42%] bg-[#EDE6DE] relative flex items-center justify-center p-6 xl:p-10">
          
          {/* Smooth organic wave divider separating ivory and tan panels */}
          <svg
            className="absolute top-0 bottom-0 -left-[47px] h-full w-12 text-[#EDE6DE] fill-current pointer-events-none z-20"
            viewBox="0 0 50 800"
            preserveAspectRatio="none"
          >
            <path d="M50 0 C 35 150, 10 250, 20 400 C 30 550, 45 650, 50 800 Z" />
          </svg>

          {/* Upper-right Monogram Logo with Needle & Hanging Tassel (Asset 12) */}
          <div className="absolute top-6 right-6 w-24 h-48 opacity-50 pointer-events-none select-none z-10 flex flex-col items-center">
            <svg viewBox="0 0 100 160" fill="none" className="w-full h-full text-[#8B6F5C]">
              {/* Intersecting wireframe lines */}
              <path d="M30 15 L30 90" stroke="currentColor" strokeWidth="1.2" />
              <path d="M70 15 L70 90" stroke="currentColor" strokeWidth="1.2" />
              <path d="M30 50 L70 50" stroke="currentColor" strokeWidth="1.2" />
              <path d="M35 25 C 55 15, 75 35, 50 50 C 25 65, 45 85, 65 75" stroke="currentColor" strokeWidth="1" />
              {/* Needle passing through */}
              <line x1="82" x2="20" y1="8" y2="100" stroke="#A34A38" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="78" cy="14" rx="0.8" ry="2.5" fill="#EDE6DE" transform="rotate(-45 78 14)" />
              {/* Hanging Tassel */}
              <path d="M50 90 L50 110" stroke="currentColor" strokeWidth="1.2" />
              <path d="M44 110 L56 110 L50 124 Z" fill="currentColor" />
              <path d="M46 124 L42 145" stroke="currentColor" strokeWidth="0.8" />
              <path d="M50 124 L50 145" stroke="currentColor" strokeWidth="1" />
              <path d="M54 124 L58 145" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>

          {/* Overlapping Image Cluster (Precisely sized and overlapping as in reference) */}
          <div className="relative w-[340px] h-[340px] xl:w-[380px] xl:h-[380px] z-10 flex items-center justify-center">
            
            {/* Asset 1: Gold Thread Embroidery (Top-Left of cluster) */}
            <div className="absolute left-[20px] top-[10px] w-[130px] h-[130px] xl:w-[150px] xl:h-[150px] rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(45,37,32,0.12)] border border-[#FAF7F2]/10 transition-transform duration-500 hover:scale-[1.03]">
              <img
                src={heroEmbroideryImg}
                alt="Intricate Gold Thread Embroidery with Mirrors"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Asset 3: Crochet Lace (Right side of cluster) */}
            <div className="absolute right-0 top-[40px] w-[130px] h-[130px] xl:w-[155px] xl:h-[155px] rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(45,37,32,0.12)] border border-[#FAF7F2]/10 transition-transform duration-500 hover:scale-[1.03]">
              <img
                src={heroCrochetImg}
                alt="Delicate Crochet Lace Details"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Asset 2: Macrame Knotting (Bottom-Left of cluster) */}
            <div className="absolute left-[5px] bottom-[25px] w-[130px] h-[130px] xl:w-[150px] xl:h-[150px] rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(45,37,32,0.12)] border border-[#FAF7F2]/10 transition-transform duration-500 hover:scale-[1.03]">
              <img
                src={heroMacrameImg}
                alt="Detailed Patterned Macramé Knotting"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Asset 4: Circular Lippan Art Piece (Center-Front Highlight) */}
            <div className="absolute w-[160px] h-[160px] xl:w-[190px] xl:h-[190px] rounded-full overflow-hidden border-[5px] border-[#FAF7F2] shadow-[0_15px_35px_rgba(45,37,32,0.22)] z-30 transition-transform duration-500 hover:scale-[1.03]">
              <img
                src={heroLippanImg}
                alt="Circular Lippan Art Mandala Disc"
                className="w-full h-full object-cover"
              />
            </div>

          </div>

          {/* Tiny accent diamond element at the very bottom right (Asset 9) */}
          <div className="absolute bottom-6 right-6 w-3 h-3 text-[#8B6F5C] opacity-40">
            <svg viewBox="0 0 10 10" fill="currentColor" className="w-full h-full">
              <polygon points="5,0 10,5 5,10 0,5" />
            </svg>
          </div>

        </div>

      </div>

      {/* ─── MOBILE VIEW (Compact Stacked Layout) ─── */}
      <div className="lg:hidden w-full h-full flex flex-col justify-between px-6 py-6 overflow-y-auto">
        
        {/* Brand Header */}
        <div className="w-full flex justify-start items-center">
          <svg viewBox="0 0 100 100" fill="none" className="w-9 h-9 text-[#8B6F5C]">
            <path
              d="M30 35 C35 25, 45 20, 55 25 C65 30, 60 45, 50 50 C40 55, 35 70, 45 75 C55 80, 65 75, 70 65"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Scaled Image Cluster for Mobile */}
        <div className="relative w-full max-w-[280px] aspect-square mx-auto my-3 flex items-center justify-center">
          <div className="absolute left-0 top-0 w-[42%] aspect-square rounded-xl overflow-hidden shadow-md">
            <img src={heroEmbroideryImg} alt="Embroidery" className="w-full h-full object-cover" />
          </div>
          <div className="absolute right-0 top-[10%] w-[40%] aspect-square rounded-xl overflow-hidden shadow-md">
            <img src={heroCrochetImg} alt="Crochet" className="w-full h-full object-cover" />
          </div>
          <div className="absolute left-[8%] bottom-0 w-[40%] aspect-square rounded-xl overflow-hidden shadow-md">
            <img src={heroMacrameImg} alt="Macrame" className="w-full h-full object-cover" />
          </div>
          <div className="absolute w-[50%] aspect-square rounded-full overflow-hidden border-[4px] border-[#FAF7F2] shadow-xl z-20">
            <img src={heroLippanImg} alt="Lippan" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col text-center items-center max-w-sm mx-auto pb-4">
          <h1 className="font-serif text-[#1E1812] tracking-tight leading-[1.1] font-light text-2xl sm:text-3xl">
            <span className="block uppercase tracking-[0.03em]"><span className="text-[#8B6F5C]">UNVEILING</span> the</span>
            <span className="block mt-0.5 uppercase font-normal tracking-[0.04em]">SOUL of HANDMADE</span>
          </h1>

          <p className="font-sans text-[10px] tracking-[0.1em] text-[#2D2520]/80 uppercase mt-4 leading-relaxed">
            Contemporary Embroidery | Crochet | Macramé | Lippan Art.
          </p>

          {/* CTA wrapper */}
          <div className="mt-5 bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] p-[1.5px] rounded-full shadow-md w-full max-w-[240px]">
            <Link
              to="/shop"
              className="flex items-center justify-center bg-[#8C5A3E] text-white py-2 rounded-full font-serif text-xs tracking-[0.12em] uppercase font-semibold w-full"
            >
              EXPLORE the COLLECTION
            </Link>
          </div>
        </div>

      </div>

      {/* ─── Scroll to Discover (Absolute-centered relative to the ENTIRE Hero screen width) ─── */}
      <div className="hidden lg:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1">
        <div className="w-4 h-7 border border-[#2D2520]/45 rounded-full flex justify-center p-0.5">
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-0.5 h-1 bg-[#8B6F5C] rounded-full"
          />
        </div>
        <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#2D2520]/65">
          Scroll to Discover
        </span>
      </div>

    </section>
  );
}
