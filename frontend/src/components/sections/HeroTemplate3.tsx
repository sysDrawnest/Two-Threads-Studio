import React from 'react';
import portraitCutout from '../../assets/Woman_wearing_crochet_jacket_2K_202608051414-Recovered.png';

export default function HeroTemplate3() {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black font-hn text-cream select-none">
      {/* ── Webfont & CSS Animations ── */}
      <style>{`
        @import url('https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME');

        @keyframes animFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes animRiseIn {
          from {
            opacity: 0;
            transform: translateY(4vh) scale(1.03);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes animFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes animLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .anim-fade-in {
          animation: animFadeIn 1.2s ease-out both;
        }

        .anim-rise-in {
          animation: animRiseIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) 300ms both;
        }

        .anim-fade-up {
          animation: animFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .anim-line {
          animation: animLine 1.1s cubic-bezier(0.76, 0, 0.24, 1) 1200ms both;
        }

        .marquee-track {
          animation: marqueeScroll 30s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-in,
          .anim-rise-in,
          .anim-fade-up,
          .anim-line,
          .marquee-track {
            animation-duration: 0.01ms !important;
            animation-delay: 0s !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* ── 1. Background Image (z-0 / default) ── */}
      <img
        src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85"
        alt=""
        className="absolute inset-0 h-full w-full object-cover anim-fade-in"
      />

      {/* ── 2. Marquee Name (z-10) ── */}
      <div
        className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden pointer-events-none anim-fade-up"
        style={{ animationDelay: '500ms' }}
      >
        <div className="marquee-track flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[24vh] leading-none text-cream tracking-tight">
          <span className="pr-[6vw]">
            Two Threads &mdash; Studio
          </span>
          <span className="pr-[6vw]">
            Two Threads &mdash; Studio
          </span>
        </div>
      </div>

      {/* ── 3. Horizontal Cream Rule (z-10) ── */}
      <div
        className="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream origin-left anim-line"
      />

      {/* ── 4. Desktop Footer Copy (z-30 on mobile, sm:z-10 on desktop) ── */}
      <footer className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream z-30 sm:z-10">
        {/* Footer Left (3 lines) */}
        <div className="anim-fade-up" style={{ animationDelay: '1400ms' }}>
          <p>Handcrafted Indigo</p>
          <p>Mindful Slow Fashion</p>
          <p>Artisanal Heritage</p>
        </div>

        {/* Footer Right (right-aligned, 2 lines) */}
        <div className="text-right anim-fade-up" style={{ animationDelay: '1550ms' }}>
          <p>Crafted with Care</p>
          <p>Two Threads Studio</p>
        </div>
      </footer>

      {/* ── 5. Front Portrait Cutout (z-20) ── */}
      <img
        src={portraitCutout}
        alt="Two Threads Artisanal Portrait"
        className="absolute inset-0 h-full w-full object-cover sm:object-contain sm:object-bottom pointer-events-none z-20 anim-rise-in"
      />
    </section>
  );
}



