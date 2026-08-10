import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import bgImage from '../../assets/Embroidery_collection_flat_lay_2K_202607141328.webp';

export default function HeroTemplate3() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full bg-[#FCFCF0] overflow-hidden select-none flex flex-col justify-end">
      {/* ── 1. Top Background Photo with Darkening Overlay ── */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <img
          src={bgImage}
          alt="Two Threads Studio Artisan Campaign"
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
        />
        {/* Darkening gradient overlay for rich contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* ── 2. Light Cream Overlay Canvas with Decorative Wavy Edge ── */}
      <div
        className="relative z-10 w-full bg-[#FCFCF0] flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-14 px-6 text-center shadow-2xl mt-[25vh] sm:mt-[20vh]"
        style={{
          clipPath:
            'polygon(0% 12%, 15% 6%, 30% 0%, 45% 6%, 60% 12%, 75% 6%, 90% 0%, 100% 6%, 100% 100%, 0% 100%)',
        }}
      >
        {/* Text Content Area */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          {/* Section Sub-Title / Tag */}
          <span className="font-sans text-xs sm:text-sm tracking-[0.25em] uppercase text-[#4A4A4A] font-medium mb-3 sm:mb-4">
            EXPLORE THE OTHER COLLECTION
          </span>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold text-[#333333] tracking-tight leading-[1.08] mb-3 sm:mb-4">
            WOMENSWEAR
          </h1>

          {/* Description */}
          <p className="font-serif italic text-base sm:text-xl md:text-2xl text-[#555555] max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal">
            Made to be remembered. Contemporary heirloom pieces woven with grace.
          </p>

          {/* Primary CTA Button */}
          <Link
            to="/collection/womenswear"
            className="inline-flex items-center gap-3 bg-[#A66A4F] hover:bg-[#8C5A42] text-white uppercase text-xs sm:text-sm tracking-[0.1em] font-medium px-8 sm:px-10 py-3.5 sm:py-4 rounded-[5px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mb-8 sm:mb-10"
          >
            <span>EXPLORE WOMENSWEAR</span>
            <ArrowRight size={16} />
          </Link>

          {/* Footer Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mb-6 font-sans text-xs sm:text-sm tracking-[0.08em] uppercase text-[#4A4A4A]">
            <Link to="/about" className="hover:text-[#A66A4F] transition-colors">
              About
            </Link>
            <Link to="/journal" className="hover:text-[#A66A4F] transition-colors">
              Journal
            </Link>
            <Link to="/sustainability" className="hover:text-[#A66A4F] transition-colors">
              Ethics
            </Link>
            <Link to="/contact" className="hover:text-[#A66A4F] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Copyright & Branding Footer */}
          <div className="space-y-1 font-sans text-[11px] tracking-[0.08em] text-[#777777]">
            <p>@twothreadsstudio</p>
            <p>&copy; TWO THREADS STUDIO 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
