import React from 'react';
import { Link } from 'react-router-dom';
import { useHeroConfig } from '../../hooks/useCms';
import heroStudioBg from '../../assets/hero_textile_studio.jpg';

export default function HeroTemplate3() {
  const { data } = useHeroConfig();
  const config = data?.data;

  // Use CMS configuration if provided, otherwise default to reference design
  const sectionTitle = config?.subtitle || 'EXPLORE THE OTHER COLLECTION';
  const mainTitle = config?.title || 'WOMENSWEAR';
  const description = config?.description || 'Made to be remembered. Contemporary heirloom pieces woven with grace.';
  const ctaText = config?.ctaText || 'EXPLORE WOMENSWEAR';
  const ctaLink = config?.ctaLink || '/collection/womenswear';
  const bgImage = config?.backgroundImageUrl || heroStudioBg;

  return (
    <section className="relative w-full h-[100dvh] min-h-[680px] bg-[#FCFCF0] overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* ── 1. Full-Bleed Background Image ── */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <img
          src={bgImage}
          alt="Artisan Textile Studio"
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
          loading="eager"
        />
        {/* Subtle Darkening Overlay for Depth */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Spacer pushing content to bottom */}
      <div className="flex-1 pointer-events-none" />

      {/* ── 2. Off-White Text Container with Asymmetrical SVG Shape Divider ── */}
      <div className="relative z-10 w-full bg-[#FCFCF0] text-center pt-2 sm:pt-4 pb-8 sm:pb-10 px-6 mt-auto">
        
        {/* ── Asymmetrical Organic Sweeping Wave SVG Divider (Top Boundary) ── */}
        <div className="absolute left-0 right-0 top-0 -translate-y-[99%] overflow-hidden leading-none pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-[18vw] min-h-[120px] max-h-[300px] block"
            preserveAspectRatio="none"
          >
            {/* Asymmetrical wave: peaking slightly to left-center (x: 580), gently sloping down to the right */}
            <path
              d="M 0,220 C 300,40 560,0 720,28 C 960,60 1240,150 1440,220 L 1440,320 L 0,320 Z"
              fill="#FCFCF0"
            />
          </svg>
        </div>

        {/* ── 3. Centered Content Inside Off-White Area ── */}
        <div className="relative z-20 max-w-xl mx-auto flex flex-col items-center">
          
          {/* Section Subtitle / Tag */}
          <p className="font-serif italic text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase text-[#4A4A4A] mb-2 sm:mb-3">
            {sectionTitle}
          </p>

          {/* Main Title Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold text-[#2D2520] tracking-tight leading-[1.05] mb-3 sm:mb-4">
            {mainTitle}
          </h1>

          {/* Description */}
          <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8">
            {description}
          </p>

          {/* Pill-Shaped CTA Button */}
          <Link
            to={ctaLink}
            className="inline-flex items-center gap-2 bg-[#A65A38] hover:bg-[#8C5A42] text-white font-sans text-xs sm:text-sm tracking-wider uppercase font-semibold py-3.5 px-9 rounded-full shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mb-6 sm:mb-8"
          >
            <span>{ctaText}</span>
            <span className="text-sm font-bold">→</span>
          </Link>

          {/* Footer Navigation */}
          <nav className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-3">
            <Link to="/about" className="font-sans text-[11px] sm:text-xs tracking-[0.08em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors font-medium">
              About
            </Link>
            <Link to="/journal" className="font-sans text-[11px] sm:text-xs tracking-[0.08em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors font-medium">
              Journal
            </Link>
            <Link to="/sustainability" className="font-sans text-[11px] sm:text-xs tracking-[0.08em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors font-medium">
              Ethics
            </Link>
            <Link to="/contact" className="font-sans text-[11px] sm:text-xs tracking-[0.08em] uppercase text-[#4A4A4A] hover:text-[#A65A38] transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Handles & Copyright */}
          <p className="font-sans text-[10px] text-[#777777] tracking-wider mb-0.5">
            @twothreadsstudio
          </p>
          <p className="font-sans text-[9px] text-[#888888] tracking-widest uppercase">
            &copy; TWO THREADS STUDIO 2026
          </p>

        </div>
      </div>
    </section>
  );
}
