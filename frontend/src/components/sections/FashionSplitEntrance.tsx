import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';

const ArrowIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={`transition-transform duration-300 group-hover:translate-x-1.5 ${className}`}
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FashionSplitEntrance() {
  return (
    <section className="w-full bg-[#1C1C1B]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh] md:min-h-[85vh]">
        {/* ─── LEFT: MENSWEAR ─── */}
        <Link
          to="/collection/menswear"
          className="group relative flex flex-col justify-end p-8 sm:p-12 md:p-16 min-h-[480px] md:min-h-[85vh] overflow-hidden border-b md:border-b-0 md:border-r border-[#FAF9F7]/10"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=1400&auto=format&fit=crop"
              alt="Menswear Collection"
              className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out opacity-60 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B] via-[#1C1C1B]/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10">
            <ScrollReveal direction="up">
              <span className="inline-block font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold mb-3">
                Menswear
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-3">
                The Modern Artisan
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light max-w-md mb-8 leading-relaxed">
                Crafted for those who appreciate the uncommon. Heritage craftsmanship, relaxed silhouettes.
              </p>
              <div className="inline-flex items-center gap-3 text-white font-sans text-xs tracking-[0.2em] uppercase font-semibold">
                <span className="border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                  Explore Collection
                </span>
                <ArrowIcon className="text-[#A34A38]" />
              </div>
            </ScrollReveal>
          </div>
        </Link>

        {/* ─── RIGHT: WOMENSWEAR ─── */}
        <Link
          to="/collection/womenswear"
          className="group relative flex flex-col justify-end p-8 sm:p-12 md:p-16 min-h-[480px] md:min-h-[85vh] overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop"
              alt="Womenswear Collection"
              className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out opacity-60 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B] via-[#1C1C1B]/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <span className="inline-block font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold mb-3">
                Womenswear
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-3">
                The Artisan Muse
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light max-w-md mb-8 leading-relaxed">
                Handcrafted pieces for quiet expression. Ethereal open-knits, silk thread accents.
              </p>
              <div className="inline-flex items-center gap-3 text-white font-sans text-xs tracking-[0.2em] uppercase font-semibold">
                <span className="border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                  Explore Collection
                </span>
                <ArrowIcon className="text-[#A34A38]" />
              </div>
            </ScrollReveal>
          </div>
        </Link>
      </div>
    </section>
  );
}
