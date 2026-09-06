/**
 * HeroTemplate3 — "Meditative Craft. Silent Luxury."
 *
 * Exact replication of the user-provided reference design:
 * - 3-Panel Triptych Layout (Split by crisp vertical hairline borders):
 *   - Left Panel: Portrait of artisan woman in botanical embroidered linen dress.
 *   - Center Panel: Artisan woman walking forward in sunlit loom & weaving studio.
 *   - Right Panel: Full portrait in crochet fringed top beside spun yarn skeins and macramé tapestry.
 * - Center Overlay:
 *   - Headline: "MEDITATIVE CRAFT.\nSILENT LUXURY." in elegant white high-contrast serif (Cormorant Garamond)
 *   - Subtitle: "Embrace the slow life with handcrafted textile art and curated DIY kits, where timeless heritage meets mindful creativity." in light clean white sans-serif
 *   - CTA Button: Crisp bordered "EXPLORE THE STUDIO" in antique olive/khaki gold (#807248) with white uppercase typography
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroTriptychLeft from '../../assets/hero_triptych_left.jpg';
import heroTriptychCenter from '../../assets/hero_triptych_center.jpg';
import heroTriptychRight from '../../assets/hero_triptych_right.jpg';
import heroTriptychFull from '../../assets/hero_triptych_full.png';

export default function HeroTemplate3() {
  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#171310] overflow-hidden flex items-center justify-center select-none">
      {/* ─── DESKTOP VIEW (3-Panel Split Triptych with Hairline Dividers) ─── */}
      <div className="hidden md:grid md:grid-cols-3 w-full h-full min-h-[calc(100vh-70px)] max-h-[900px] relative">
        {/* Left Panel: Embroidered Dress */}
        <div className="relative h-full overflow-hidden border-r border-white/30 bg-[#2b241d]">
          <img
            src={heroTriptychLeft}
            alt="Artisan in botanical hand-embroidered linen dress"
            className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
            // @ts-ignore
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* Center Panel: Studio Loom & Walking Silhouette */}
        <div className="relative h-full overflow-hidden border-r border-white/30 bg-[#2b241d]">
          <img
            src={heroTriptychCenter}
            alt="Artisan walking inside sunlit textile loom studio"
            className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
            // @ts-ignore
            fetchpriority="high"
          />
          {/* Subtle soft gradient scrim to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/15 pointer-events-none" />
        </div>

        {/* Right Panel: Crochet Top & Macramé Hanging */}
        <div className="relative h-full overflow-hidden bg-[#2b241d]">
          <img
            src={heroTriptychRight}
            alt="Handcrafted crochet fringed top and macramé textile art"
            className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
            // @ts-ignore
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* ─── Center Typography & CTA Overlay (Positioned precisely over the center panel) ─── */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20 px-4">
          <div className="max-w-xl text-center pointer-events-auto flex flex-col items-center">
            {/* Main Headline */}
            <h1
              className="font-serif uppercase text-white font-normal tracking-[0.05em] leading-[1.12] text-3xl sm:text-4xl md:text-[38px] lg:text-[44px] xl:text-[50px]"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}
            >
              <span className="block">MEDITATIVE CRAFT.</span>
              <span className="block">SILENT LUXURY.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="font-sans text-white/95 text-xs sm:text-sm md:text-[14px] lg:text-[15px] font-normal leading-relaxed mt-4 md:mt-5 max-w-md"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
            >
              Embrace the slow life with handcrafted textile art and curated DIY kits, where timeless heritage meets mindful creativity.
            </p>

            {/* Antique Olive/Khaki CTA Button */}
            <div className="mt-6 md:mt-8">
              <Link
                to="/shop"
                className="inline-block bg-[#807248]/95 hover:bg-[#6D603A] active:bg-[#5C502E] text-white font-sans text-xs tracking-[0.16em] uppercase px-7 py-3 md:px-8 md:py-3.5 border border-[#DFD8BA]/90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-center font-medium"
              >
                EXPLORE THE STUDIO
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE VIEW (Seamless Triptych with Unified Center Focus) ─── */}
      <div className="md:hidden w-full relative min-h-[calc(100vh-65px)] flex flex-col justify-between">
        {/* Background 3-Panel Split Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={heroTriptychFull}
            alt="Two Threads Studio - Meditative Craft & Silent Luxury"
            className="w-full h-full object-cover object-center"
            // @ts-ignore
            fetchpriority="high"
          />
          {/* Subtle contrast overlay for mobile text clarity */}
          <div className="absolute inset-0 bg-black/30 backdrop-brightness-[0.92]" />
        </div>

        {/* Top Spacer */}
        <div className="h-12" />

        {/* Center Mobile Overlay */}
        <div className="relative z-10 px-6 py-8 text-center flex flex-col items-center">
          <h1
            className="font-serif uppercase text-white font-normal tracking-[0.04em] leading-[1.15] text-2xl sm:text-3xl"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}
          >
            <span className="block">MEDITATIVE CRAFT.</span>
            <span className="block">SILENT LUXURY.</span>
          </h1>

          <p
            className="font-sans text-white/95 text-xs sm:text-sm font-normal leading-relaxed mt-3.5 max-w-xs"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            Embrace the slow life with handcrafted textile art and curated DIY kits, where timeless heritage meets mindful creativity.
          </p>

          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-block bg-[#807248] hover:bg-[#6D603A] text-white font-sans text-xs tracking-[0.16em] uppercase px-7 py-3 border border-[#DFD8BA] shadow-md text-center font-medium"
            >
              EXPLORE THE STUDIO
            </Link>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12" />
      </div>
    </section>
  );
}



