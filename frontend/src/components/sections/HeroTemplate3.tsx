import React from 'react';
import { Link } from 'react-router-dom';
import { useHeroConfig } from '../../hooks/useCms';
import heroStudioBg from '../../assets/hero_textile_studio.jpg';

export default function HeroTemplate3() {
  const { data } = useHeroConfig();
  const config = data?.data;

  // Use CMS configuration if provided, otherwise default to the exact reference image design
  const sectionTitle = config?.subtitle || 'EXPLORE THE OTHER COLLECTION';
  const mainTitle = config?.title || 'WOMENSWEAR';
  const description = config?.description || 'Made to be remembered. Contemporary heirloom pieces woven with grace.';
  const ctaText = config?.ctaText || 'EXPLORE WOMENSWEAR';
  const ctaLink = config?.ctaLink || '/collection/womenswear';
  const bgImage = config?.backgroundImageUrl || heroStudioBg;

  return (
    <section className="relative w-full h-[100dvh] min-h-[640px] bg-[#1E1812] overflow-hidden select-none font-sans">
      {/* ── 1. Background Image with Darkening Overlay ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Textile Studio Background"
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
          loading="eager"
        />
        {/* Darkening Overlay */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* ── 2. Parabolic Cream Overlay Arch & Content Container ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 w-full flex flex-col items-center justify-end">
        <div className="relative w-full max-w-[1600px] mx-auto">
          
          {/* Smooth Parabolic Cream Arch Shape (SVG Vector) */}
          <svg
            viewBox="0 0 1440 600"
            className="w-full h-[64vh] sm:h-[68vh] md:h-[72vh] min-h-[440px] max-h-[700px] block"
            preserveAspectRatio="none"
          >
            <path
              d="M -50,600 L -50,440 C 320,10 1120,10 1490,440 L 1490,600 Z"
              fill="#FAF7F2"
            />
          </svg>

          {/* ── 3. Text & Interactive Elements Inside the Arch ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 sm:pb-7 md:pb-9 px-6 text-center z-20">
            <div className="max-w-xl mx-auto flex flex-col items-center">
              
              {/* Section Subtitle / Tag */}
              <p className="font-serif italic text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase text-[#4A4A4A] mb-2 sm:mb-3">
                {sectionTitle}
              </p>

              {/* Main Title */}
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal text-[#1E1812] tracking-tight leading-[1.05] mb-3 sm:mb-4">
                {mainTitle}
              </h1>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8">
                {description}
              </p>

              {/* CTA Button */}
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2.5 bg-[#A65A38] hover:bg-[#8C5A42] text-white font-sans text-xs sm:text-sm tracking-[0.12em] uppercase font-medium py-3 sm:py-3.5 px-8 sm:px-10 rounded-full shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mb-6 sm:mb-8"
              >
                <span>{ctaText}</span>
                <span className="text-sm font-bold">→</span>
              </Link>

              {/* Footer Nav */}
              <nav className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-3">
                <Link to="/about" className="font-sans text-[11px] sm:text-xs tracking-[0.1em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors">
                  About
                </Link>
                <Link to="/journal" className="font-sans text-[11px] sm:text-xs tracking-[0.1em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors">
                  Journal
                </Link>
                <Link to="/sustainability" className="font-sans text-[11px] sm:text-xs tracking-[0.1em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors">
                  Ethics
                </Link>
                <Link to="/contact" className="font-sans text-[11px] sm:text-xs tracking-[0.1em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors">
                  Contact
                </Link>
              </nav>

              {/* Copyright & Handle */}
              <p className="font-sans text-[10px] text-[#777777] tracking-wider mb-0.5">
                @twothreadsstudio
              </p>
              <p className="font-sans text-[9px] text-[#888888] tracking-widest uppercase">
                &copy; TWO THREADS STUDIO 2026
              </p>

            </div>
          </div>

          {/* Decorative Sparkle Icon on Bottom Right */}
          <div className="absolute right-[8%] bottom-[12%] text-[#1E1812]/20 hidden sm:block pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
