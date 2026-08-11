import React from 'react';

/**
 * MaintenancePage Component — Two Threads Studio
 *
 * Lightweight, quiet luxury maintenance screen matching brand identity.
 * Features subtle CSS needle & thread animation with prefers-reduced-motion support.
 * Responsive across 320px to 1440px+ viewports.
 */
export const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E1812] flex flex-col justify-between items-center px-6 py-12 md:py-16 selection:bg-[#8B6F5C]/20">
      {/* ── Top Brand Header ── */}
      <header className="w-full max-w-4xl text-center">
        <span className="font-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#8B6F5C] font-semibold block">
          ARTISAN CRAFT &amp; TEXTILE STUDIO
        </span>
      </header>

      {/* ── Main Content Container ── */}
      <main className="w-full max-w-xl mx-auto text-center my-auto py-8">
        {/* Needle & Thread Subtle SVG Illustration */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-8 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="w-full h-full text-[#8B6F5C]"
            aria-hidden="true"
          >
            {/* Soft background glow circle */}
            <circle cx="50" cy="50" r="44" className="stroke-[#EDE6DE]" strokeWidth="1" />

            {/* Needle */}
            <path
              d="M68 24L34 70C33 71.5 31 71.5 30 70C29 68.5 29 66.5 30.5 65L64 20C65.5 18.5 68 19 68.5 21C68.8 22 68.5 23.2 68 24Z"
              fill="#2D2520"
            />
            {/* Needle Eye */}
            <ellipse cx="64" cy="24" rx="1.5" ry="3" fill="#FBFBFA" transform="rotate(-45 64 24)" />

            {/* Flowing Thread Path */}
            <path
              d="M64 24C52 14 36 22 42 36C48 50 62 48 56 62C50 74 32 68 22 80"
              stroke="#A34A38"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="motion-reduce:animate-none animate-[dash_6s_ease-in-out_infinite]"
              strokeDasharray="160"
              strokeDashoffset="0"
            />
          </svg>
        </div>

        {/* Brand Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1E1812] tracking-tight leading-tight mb-4">
          We're tending to the studio.
        </h1>

        {/* Editorial Body Statement */}
        <p className="font-sans text-xs sm:text-sm md:text-base text-[#2D2520]/80 font-normal leading-relaxed max-w-md mx-auto mb-8">
          Two Threads Studio is temporarily offline while we make a few thoughtful improvements behind the scenes. We'll be back shortly.
        </p>

        {/* Status Pill Indicator */}
        <div className="inline-flex items-center gap-2 bg-[#F5F0EB] border border-[#EDE6DE] px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#8B6F5C] animate-pulse motion-reduce:animate-none" />
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#2D2520] font-medium">
            STUDIO MAINTENANCE IN PROGRESS
          </span>
        </div>
      </main>

      {/* ── Footer Courtesy ── */}
      <footer className="w-full max-w-4xl text-center">
        <p className="font-sans text-[11px] text-[#2D2520]/60 tracking-wider font-light">
          Thank you for your patience. &copy; {new Date().getFullYear()} Two Threads Studio.
        </p>
      </footer>
    </div>
  );
};

export default MaintenancePage;
