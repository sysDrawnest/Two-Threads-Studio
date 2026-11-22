/**
 * HeroTemplate4 — "Crafting Mindful Heirlooms" (Pure Video Edition)
 *
 * Clean, unobstructed full-bleed cinematic video hero section:
 * - Desktop View: High-definition PC video (hero_template4_pc.mp4)
 * - Mobile View: Tailored vertical Mobile video (hero_template4_mobile.mp4)
 * - Layout: Completely unobstructed video showcase with zero text overlays
 * - CTA: A single clean "EXPLORE THE STUDIO" button anchored at the bottom
 * - Video Playback: Pure muted background loop, no sound controls
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroPcVideo from '../../assets/hero_template4_pc.mp4';
import heroMobileVideo from '../../assets/hero_template4_mobile.mp4';

export default function HeroTemplate4() {
  return (
    <section className="relative w-full h-[90vh] min-h-[560px] max-h-[960px] lg:h-[calc(100vh-70px)] bg-[#171310] overflow-hidden flex flex-col justify-end items-center">
      {/* ─── DESKTOP VIDEO (PC Version) ─── */}
      <div className="hidden lg:block absolute inset-0 w-full h-full overflow-hidden">
        <video
          src={heroPcVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ─── MOBILE & TABLET VIDEO (Mobile Version) ─── */}
      <div className="lg:hidden absolute inset-0 w-full h-full overflow-hidden">
        <video
          src={heroMobileVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ─── GENTLE BOTTOM SHADOW FOR BUTTON READABILITY ─── */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* ─── CLEAN BOTTOM CTA BUTTON (UNOBSTRUCTED VIDEO) ─── */}
      <div className="relative z-10 pb-10 sm:pb-14 md:pb-16 px-6 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center justify-center bg-[#AD5B43] hover:bg-[#964a34] active:bg-[#823e2b] text-white font-sans text-xs sm:text-sm tracking-[0.2em] uppercase px-8 sm:px-11 py-3.5 sm:py-4 font-semibold transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_rgba(173,91,67,0.45)] hover:-translate-y-0.5 rounded-[2px]"
        >
          EXPLORE THE STUDIO
        </Link>
      </div>
    </section>
  );
}
