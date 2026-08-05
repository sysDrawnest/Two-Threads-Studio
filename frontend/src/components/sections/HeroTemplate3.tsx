import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Our Story', href: '/about' },
  { label: 'Learning', href: '/learning' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'YouTube', href: '#' },
];

export default function HeroTemplate3() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Set document title & lock body scroll on drawer open
  useEffect(() => {
    document.title = 'Two Threads Studio';
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

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
        src="https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png"
        alt="Artisanal Portrait"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-20 anim-rise-in"
      />

      {/* ── 6. Header Chrome (z-30) ── */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="font-hn text-lg tracking-wide text-cream hover:opacity-80 transition-opacity duration-300 anim-fade-up"
          style={{ animationDelay: '800ms' }}
        >
          Two Threads
        </Link>

        {/* Desktop Navigation Cluster */}
        <div className="hidden sm:flex items-start gap-16 lg:gap-24">
          {/* Year */}
          <span
            className="text-sm text-cream font-hn anim-fade-up"
            style={{ animationDelay: '900ms' }}
          >
            Est. 2026
          </span>

          {/* Nav Column */}
          <nav className="flex flex-col gap-0.5 text-sm font-hn" aria-label="Main Navigation">
            {NAV_LINKS.map((item, i) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-cream hover:opacity-60 transition-opacity duration-300 anim-fade-up"
                style={{ animationDelay: `${1000 + i * 80}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social Column */}
          <div className="flex flex-col gap-0.5 text-sm font-hn" aria-label="Social Links">
            {SOCIAL_LINKS.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="text-cream hover:opacity-60 transition-opacity duration-300 anim-fade-up"
                style={{ animationDelay: `${1150 + i * 80}ms` }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Hamburger Button (z-50) */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label={isDrawerOpen ? 'Close Menu' : 'Open Menu'}
          className="sm:hidden z-50 h-10 w-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none cursor-pointer anim-fade-up"
          style={{ animationDelay: '900ms' }}
        >
          <span
            className={`h-0.5 w-6 bg-cream transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isDrawerOpen ? 'translate-y-[8px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-cream transition-all duration-300 ${
              isDrawerOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-cream transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isDrawerOpen ? '-translate-y-[8px] -rotate-45' : ''
            }`}
          />
        </button>
      </header>

      {/* ── 7. Mobile Drawer Overlay & Panel (z-40) ── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`sm:hidden fixed right-0 top-0 bottom-0 z-40 w-[80%] max-w-sm bg-[#141414] px-8 py-10 flex flex-col justify-between transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Close Icon (Lucide X) */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close Mobile Menu"
          className={`absolute right-6 top-6 text-cream transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isDrawerOpen ? 'rotate-0 opacity-100 delay-300' : 'rotate-90 opacity-0'
          }`}
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        {/* Top Section: Site Index Links */}
        <div className="mt-12">
          {/* Label */}
          <h2
            className={`uppercase tracking-[0.2em] text-cream/50 text-xs font-hn mb-6 transition-all duration-500 ${
              isDrawerOpen
                ? 'translate-y-0 opacity-100 delay-250'
                : 'translate-y-4 opacity-0'
            }`}
          >
            Site Index
          </h2>

          {/* Links Stack */}
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((item, i) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className={`text-4xl font-hn text-cream hover:opacity-60 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{
                  transitionDelay: isDrawerOpen ? `${300 + i * 80}ms` : '0ms',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Find Me Links */}
        <div>
          {/* Label */}
          <h2
            className={`uppercase tracking-[0.2em] text-cream/50 text-xs font-hn mb-4 transition-all duration-500 ${
              isDrawerOpen
                ? 'translate-y-0 opacity-100 delay-500'
                : 'translate-y-4 opacity-0'
            }`}
          >
            Find Me
          </h2>

          {/* Socials Row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-hn text-cream">
            {SOCIAL_LINKS.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className={`hover:opacity-60 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{
                  transitionDelay: isDrawerOpen ? `${550 + i * 60}ms` : '0ms',
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}


