/**
 * HeroTemplate4 — "Crafting Mindful Heirlooms" (Cinematic Video Edition)
 *
 * Full-bleed cinematic video hero section:
 * - Desktop View: High-definition PC video (hero_template4_pc.mp4)
 * - Mobile View: Tailored vertical Mobile video (hero_template4_mobile.mp4)
 * - Typography: Centered quiet luxury typography in Cormorant Garamond
 * - Headline: "CRAFTING MINDFUL HEIRLOOMS"
 * - Subtitle: "Explore our quiet luxury collections of artisan embroidery, textiles, and slow-living DIY kits."
 * - CTA Button: Crisp rectangular terracotta "EXPLORE THE STUDIO" linking to /shop
 * - Features: Autoplay, loop, muted, playsinline with optional audio toggle
 */
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import heroPcVideo from '../../assets/hero_template4_pc.mp4';
import heroMobileVideo from '../../assets/hero_template4_mobile.mp4';

export default function HeroTemplate4() {
  const pcVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (pcVideoRef.current) pcVideoRef.current.muted = nextMuted;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = nextMuted;
  };

  // Ensure autoplay starts reliably across browsers
  useEffect(() => {
    const startPlay = async (video: HTMLVideoElement | null) => {
      if (!video) return;
      try {
        video.muted = true;
        await video.play();
      } catch (e) {
        // Autoplay policy fallback
      }
    };
    startPlay(pcVideoRef.current);
    startPlay(mobileVideoRef.current);
  }, []);

  return (
    <section className="relative w-full h-[90vh] min-h-[580px] max-h-[920px] lg:h-[calc(100vh-70px)] bg-[#171310] text-[#FAF7F2] overflow-hidden flex items-center justify-center">
      {/* ─── DESKTOP VIDEO (PC Version) ─── */}
      <div className="hidden lg:block absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={pcVideoRef}
          src={heroPcVideo}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.04]"
        />
      </div>

      {/* ─── MOBILE & TABLET VIDEO (Mobile Version) ─── */}
      <div className="lg:hidden absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={mobileVideoRef}
          src={heroMobileVideo}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.04]"
        />
      </div>

      {/* ─── LUXURY CINEMATIC OVERLAYS ─── */}
      {/* Vignette Scrim for typography readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/35 pointer-events-none" />

      {/* ─── HERO CONTENT OVERLAY ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center justify-center py-12">
        {/* Studio Kicker Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#EBDBC8] font-sans text-[10px] sm:text-xs tracking-[0.28em] uppercase mb-4 sm:mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#AD5B43] animate-pulse" />
          <span>Two Threads Studio</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif uppercase font-normal text-white tracking-[0.04em] leading-[1.08] text-4xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          <span className="block">CRAFTING MINDFUL</span>
          <span className="block mt-1 sm:mt-2 text-[#F5EDE3]">HEIRLOOMS</span>
        </h1>

        {/* Subtitle Statement */}
        <p className="font-serif italic text-[#F0DFD1] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mt-4 sm:mt-6 max-w-2xl font-light drop-shadow-md">
          Explore our quiet luxury collections of artisan embroidery, textiles, and slow-living DIY kits.
        </p>

        {/* Primary Action Button */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-[#AD5B43] hover:bg-[#964a34] active:bg-[#823e2b] text-white font-sans text-xs sm:text-sm tracking-[0.18em] uppercase px-8 sm:px-10 py-3.5 sm:py-4 font-semibold transition-all duration-300 shadow-[0_8px_24px_rgba(173,91,67,0.35)] hover:shadow-[0_12px_32px_rgba(173,91,67,0.5)] hover:-translate-y-0.5 rounded-[2px]"
          >
            EXPLORE THE STUDIO
          </Link>
        </div>
      </div>

      {/* ─── SOUND TOGGLE (Bottom Right) ─── */}
      <button
        onClick={toggleSound}
        type="button"
        title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-5 right-5 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white/90 hover:text-white transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-white/40 cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#EBDBC8]" />}
      </button>
    </section>
  );
}

