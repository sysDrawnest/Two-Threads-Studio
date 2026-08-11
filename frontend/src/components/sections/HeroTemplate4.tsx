/**
 * HeroTemplate4 — "Unveiling the Soul of Handmade" (Pixel-Perfect Reference Implementation)
 *
 * Implements a luxurious two-column grid layout with:
 * - Left column: Light cream background, custom inline SVG swashes, Cormorant Garamond typography,
 *   brushed-gold bordered CTA button, scrolling indicator, and Lippan mirror-work mandala corner graphic.
 * - Right column: Warm tan background separated by an organic wave curve, wirework monogram logo,
 *   and an overlapping cluster of four professional craft photos with soft shadows.
 * - Mobile support: Responsively stacks layout, scaling typography and the image cluster beautifully.
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
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#FAF7F2] text-[#1E1812] flex flex-col justify-between overflow-hidden">
      
      {/* ─── DESKTOP VIEW (Two-Column Layout) ─── */}
      <div className="hidden lg:flex w-full min-h-[calc(100vh-70px)] items-stretch relative">
        
        {/* Left Column: Brand Typography, Swashes, CTA & Corner Mandala */}
        <div className="w-[55%] xl:w-[58%] bg-[#FAF7F2] flex flex-col justify-between px-12 xl:px-20 py-12 relative z-10">
          
          {/* Logo / Monogram top-left */}
          <div className="w-12 h-12">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#8B6F5C]">
              {/* Elegant Calligraphic Logo "TTS" */}
              <path
                d="M30 35 C35 25, 45 20, 55 25 C65 30, 60 45, 50 50 C40 55, 35 70, 45 75 C55 80, 65 75, 70 65"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M50 25 C50 15, 30 15, 30 25 C30 35, 70 35, 70 45 C70 55, 50 55, 50 45"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Main Headline & Text Block */}
          <div className="my-auto relative max-w-2xl">
            {/* SVG Flourish/Swash Behind Text (Asset 8) */}
            <svg
              className="absolute -left-10 top-2 w-72 h-36 text-[#8B6F5C]/20 pointer-events-none -z-10"
              viewBox="0 0 300 150"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 90 C 80 120, 150 70, 200 110 C 250 150, 290 80, 260 50 C 230 20, 180 50, 160 80" />
              <path d="M50 30 C 120 10, 180 40, 240 20" strokeWidth="1" strokeDasharray="3 3" />
            </svg>

            {/* Headline with Serif and Calligraphic Italic details */}
            <h1 className="font-serif text-[#1E1812] tracking-tight leading-[1.05] font-light">
              <span className="block text-5xl xl:text-6xl tracking-[0.03em] uppercase">
                UNVEILING{' '}
                <span className="font-serif italic font-light lowercase text-[#8B6F5C] tracking-wide relative">
                  the
                  {/* Small script connector swash */}
                  <svg className="absolute -right-16 top-4 w-14 h-6 text-[#8B6F5C]/50" viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M5 10 C 25 5, 45 15, 55 10" />
                  </svg>
                </span>
              </span>
              <span className="block text-5xl xl:text-7xl mt-2">
                <span className="uppercase font-normal text-[#2D2520] tracking-[0.04em]">SOUL </span>
                <span className="font-serif italic font-light lowercase text-[#8B6F5C] tracking-wide pr-3">of</span>
                <span className="uppercase font-normal text-[#2D2520] tracking-[0.04em]">HANDMADE</span>
              </span>
            </h1>

            {/* Subtext Descriptors */}
            <p className="font-sans text-xs xl:text-sm tracking-[0.15em] text-[#2D2520]/80 uppercase font-medium mt-8 leading-relaxed max-w-lg">
              Contemporary Embroidery <span className="text-[#8B6F5C]/50 mx-1">|</span> Crochet{' '}
              <span className="text-[#8B6F5C]/50 mx-1">|</span> Macramé{' '}
              <span className="text-[#8B6F5C]/50 mx-1">|</span> Lippan Art.
              <br />
              <span className="text-[#8B6F5C] font-semibold">Crafted for the Discerning.</span>
            </p>

            {/* CTA Button Block */}
            <div className="flex items-center gap-6 mt-10">
              {/* Premium Brushed Gold Metallic Border Wrapper (Asset 17) */}
              <div className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] p-[2.5px] rounded-full shadow-[0_10px_25px_rgba(191,149,63,0.15)] hover:shadow-[0_15px_30px_rgba(191,149,63,0.25)] transition-all duration-300 transform hover:-translate-y-0.5">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center bg-[#8C5A3E] hover:bg-[#764930] text-white px-8 py-3.5 rounded-full font-serif text-xs sm:text-sm tracking-[0.18em] transition-colors duration-300 uppercase font-semibold"
                >
                  EXPLORE <span className="font-serif italic font-light lowercase mx-1.5 text-[#EDE6DE]">the</span> COLLECTION
                </Link>
              </div>

              {/* Hand-drawn elegant line arrow (Asset 13) */}
              <svg className="w-12 h-6 text-[#8B6F5C]" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12 L44 12" />
                <path d="M36 6 L44 12 L36 18" />
              </svg>
            </div>
          </div>

          {/* Bottom Row: Mirror-work Star Corner & Scroll Indicator */}
          <div className="flex items-end justify-between w-full mt-6">
            {/* Scroll to Discover (Asset 14) */}
            <div className="flex flex-col items-center gap-2 mx-auto lg:translate-x-12">
              <div className="w-5 h-8 border border-[#2D2520]/40 rounded-full flex justify-center p-1">
                <motion.span
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="w-1 h-1.5 bg-[#8B6F5C] rounded-full"
                />
              </div>
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#2D2520]/60">
                Scroll to Discover
              </span>
            </div>
          </div>

          {/* Bottom-Left Multi-pointed Lippan Star Corner Graphic (Asset 11) */}
          <div className="absolute -bottom-8 -left-8 w-44 h-44 opacity-80 pointer-events-none select-none -z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#8B6F5C]/30 fill-current">
              {/* Complex geometric mandala matching Lippan art pattern */}
              <circle cx="50" cy="50" r="45" stroke="#8B6F5C" strokeWidth="0.7" strokeDasharray="2 2" fill="none" />
              <path d="M50 5 L55 35 L85 30 L60 45 L80 75 L50 55 L20 75 L40 45 L15 30 L45 35 Z" stroke="#8B6F5C" strokeWidth="0.8" fill="#EDE6DE"/ >
              {/* Outer mirror polygons */}
              <polygon points="50,15 52,25 48,25" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
              <polygon points="75,25 67,30 70,33" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
              <polygon points="85,50 75,48 75,52" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
              <polygon points="70,68 67,70 75,75" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
              <polygon points="50,85 52,75 48,75" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
              <polygon points="30,68 33,70 25,75" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
              <polygon points="15,50 25,48 25,52" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
              <polygon points="25,25 33,30 30,33" fill="#FAF7F2" stroke="#8B6F5C" strokeWidth="0.5" />
            </svg>
          </div>

        </div>

        {/* Right Column: Tan background, Wave separator, Monogram logo, Image Cluster */}
        <div className="w-[45%] xl:w-[42%] bg-[#EDE6DE] relative flex items-center justify-center p-12">
          
          {/* Smooth organic wave divider path separating colors */}
          <svg
            className="absolute top-0 bottom-0 -left-[47px] h-full w-12 text-[#EDE6DE] fill-current pointer-events-none z-20"
            viewBox="0 0 50 800"
            preserveAspectRatio="none"
          >
            <path d="M50 0 C 32 180, 12 320, 25 480 C 38 640, 48 720, 50 800 Z" />
          </svg>

          {/* Large Stylized Monogram Logo & Tassel (Asset 12) */}
          <div className="absolute top-8 right-8 w-28 h-56 opacity-60 pointer-events-none select-none z-10 flex flex-col items-center">
            <svg viewBox="0 0 100 160" fill="none" className="w-full h-full text-[#8B6F5C]">
              {/* Intersecting H and S curves */}
              <path d="M30 20 L30 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M70 20 L70 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M30 60 L70 60" stroke="currentColor" strokeWidth="1.5" />
              {/* Stylized S curvature */}
              <path d="M40 30 C 60 20, 80 40, 50 60 C 20 80, 40 100, 60 90" stroke="currentColor" strokeWidth="1.2" />
              {/* Diagonal Needle */}
              <line x1="85" x2="20" y1="10" y2="110" stroke="#A34A38" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse cx="80" cy="18" rx="1" ry="3" fill="#EDE6DE" transform="rotate(-45 80 18)" />

              {/* Hanging Macramé Hanger & Tassel Cords */}
              <path d="M50 100 L50 120" stroke="currentColor" strokeWidth="1.5" />
              <path d="M42 120 L58 120 L50 135 Z" fill="currentColor" />
              {/* Cords */}
              <path d="M46 135 L40 160" stroke="currentColor" strokeWidth="1" />
              <path d="M50 135 L50 160" stroke="currentColor" strokeWidth="1.2" />
              <path d="M54 135 L60 160" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Overlapping Image Cluster Container (Asset 1, 2, 3, 4) */}
          <div className="relative w-[380px] h-[380px] xl:w-[420px] xl:h-[420px] z-10 flex items-center justify-center">
            
            {/* Asset 1: Gold Thread Embroidery (Top-Left) */}
            <div className="absolute left-0 top-0 w-[170px] h-[170px] xl:w-[190px] xl:h-[190px] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(45,37,32,0.12)] border border-[#FAF7F2]/10 transition-transform duration-500 hover:scale-105">
              <img
                src={heroEmbroideryImg}
                alt="Intricate Gold Thread Embroidery with Mirrors"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Asset 3: Crochet Lace (Top-Right) */}
            <div className="absolute right-0 top-[20px] w-[160px] h-[160px] xl:w-[180px] xl:h-[180px] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(45,37,32,0.12)] border border-[#FAF7F2]/10 transition-transform duration-500 hover:scale-105">
              <img
                src={heroCrochetImg}
                alt="Delicate Crochet Lace Details"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Asset 2: Macrame Knotting (Bottom-Left) */}
            <div className="absolute left-[10px] bottom-[10px] w-[165px] h-[165px] xl:w-[185px] xl:h-[185px] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(45,37,32,0.12)] border border-[#FAF7F2]/10 transition-transform duration-500 hover:scale-105">
              <img
                src={heroMacrameImg}
                alt="Detailed Patterned Macramé Knotting"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Asset 4: Circular Lippan Art Piece (Center-Front Overlay) */}
            <div className="absolute w-[200px] h-[200px] xl:w-[220px] xl:h-[220px] rounded-full overflow-hidden border-[6px] border-[#FAF7F2] shadow-[0_20px_45px_rgba(45,37,32,0.22)] z-30 transition-transform duration-500 hover:scale-105">
              <img
                src={heroLippanImg}
                alt="Circular Lippan Art Mandala Disc"
                className="w-full h-full object-cover"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ─── MOBILE VIEW (Stacked Layout for smaller screens) ─── */}
      <div className="lg:hidden w-full flex flex-col px-6 py-8 sm:px-10">
        
        {/* Monogram Top Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10 text-[#8B6F5C]">
            <path
              d="M30 35 C35 25, 45 20, 55 25 C65 30, 60 45, 50 50 C40 55, 35 70, 45 75 C55 80, 65 75, 70 65"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Overlapping Image Cluster (Compact for Mobile) */}
        <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto mb-10 flex items-center justify-center">
          
          {/* Embroidery Background Left */}
          <div className="absolute left-0 top-0 w-[42%] aspect-square rounded-xl overflow-hidden shadow-md">
            <img src={heroEmbroideryImg} alt="Embroidery" className="w-full h-full object-cover" />
          </div>

          {/* Crochet Background Right */}
          <div className="absolute right-0 top-[10%] w-[40%] aspect-square rounded-xl overflow-hidden shadow-md">
            <img src={heroCrochetImg} alt="Crochet" className="w-full h-full object-cover" />
          </div>

          {/* Macrame Bottom Left */}
          <div className="absolute left-[8%] bottom-0 w-[40%] aspect-square rounded-xl overflow-hidden shadow-md">
            <img src={heroMacrameImg} alt="Macrame" className="w-full h-full object-cover" />
          </div>

          {/* Lippan Center Overlay */}
          <div className="absolute w-[50%] aspect-square rounded-full overflow-hidden border-[4px] border-[#FAF7F2] shadow-xl z-20">
            <img src={heroLippanImg} alt="Lippan Art" className="w-full h-full object-cover" />
          </div>

        </div>

        {/* Content Section */}
        <div className="flex flex-col text-center items-center max-w-md mx-auto">
          {/* Headline */}
          <h1 className="font-serif text-[#1E1812] tracking-tight leading-[1.1] font-light text-3xl sm:text-4xl">
            <span className="block uppercase tracking-[0.03em]">UNVEILING</span>
            <span className="block mt-1 font-serif italic text-[#8B6F5C] lowercase">the</span>
            <span className="block mt-1 uppercase font-normal tracking-[0.04em]">SOUL of HANDMADE</span>
          </h1>

          {/* Subtext */}
          <p className="font-sans text-xs tracking-[0.12em] text-[#2D2520]/80 uppercase mt-5 leading-relaxed">
            Contemporary Embroidery <span className="text-[#8B6F5C]/40 mx-0.5">|</span> Crochet{' '}
            <span className="text-[#8B6F5C]/40 mx-0.5">|</span> Macramé{' '}
            <span className="text-[#8B6F5C]/40 mx-0.5">|</span> Lippan Art.
          </p>

          {/* CTA Button Wrapper */}
          <div className="mt-8 bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] p-[2px] rounded-full shadow-md w-full max-w-[280px]">
            <Link
              to="/shop"
              className="flex items-center justify-center bg-[#8C5A3E] text-white py-3 rounded-full font-serif text-xs tracking-[0.15em] uppercase font-semibold w-full"
            >
              EXPLORE <span className="font-serif italic lowercase mx-1 text-[#EDE6DE]">the</span> COLLECTION
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
}
