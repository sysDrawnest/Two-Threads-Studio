/**
 * HeroTemplate2 — Pixel-Perfect Reference Implementation
 *
 * Exact reproduction of the approved reference design:
 * - Top Artwork: High-resolution woven macramé & embroidered textile flat lay
 * - Bottom Card: Warm Linen background (#F5F0EB / #FAF7F2) with centered Cormorant Garamond typography
 * - Heading: "Two Threads Studio"
 * - Subtitle: "Contemporary Embroidery, Crochet, Macramé, Lippan Art & Handcrafted Textile Décor"
 * - CTA Button: Deep Charcoal rectangular pill button with soft elevation and white uppercase letter-spacing
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/hero_template2_video.mp4';

export default function HeroTemplate2() {
  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#F5F0EB] text-[#2D2520] flex flex-col justify-between overflow-hidden">
      
      {/* ─── TOP SECTION: Full-Width High-Res Textile Video ─── */}
      <div className="w-full relative h-[42vh] sm:h-[48vh] md:h-[52vh] max-h-[560px] min-h-[260px] overflow-hidden bg-[#EDE6DE]">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
        />
      </div>

      {/* ─── BOTTOM SECTION: Centered Editorial Typography & CTA ─── */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-6 py-10 sm:py-14 md:py-16 bg-[#F5F0EB] text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          
          {/* Main Brand Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#2D2520] tracking-tight leading-[1.15] mb-3 md:mb-4">
            Two Threads Studio
          </h1>

          {/* Subtitle Statement */}
          <p className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-[#786455] dark:text-[#6B5647] font-normal leading-relaxed max-w-xl mx-auto mb-7 md:mb-9">
            Contemporary Embroidery, Crochet, Macramé,<br className="hidden sm:inline" />
            {' '}Lippan Art &amp; Handcrafted Textile Décor
          </p>

          {/* Primary Action Button */}
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-7 py-3.5 sm:px-9 sm:py-4 bg-[#2D2520] text-[#F5F0EB] hover:bg-[#1E1812] transition-all duration-300 ease-out rounded-[2px] shadow-[0_8px_20px_rgba(45,37,32,0.22)] hover:shadow-[0_12px_28px_rgba(45,37,32,0.32)] hover:-translate-y-0.5 font-sans text-xs sm:text-sm tracking-[0.22em] uppercase font-medium"
          >
            EXPLORE THE STUDIO
          </Link>
        </div>
      </div>
    </section>
  );
}
