/**
 * Hero Template 3 — Split Editorial / Product Spotlight
 * Asymmetric luxury layout: large serif typography left, product showcase right.
 * Mobile: stacked single column.
 * Uses Two Threads Studio design language (terracotta, cream, Cormorant Garamond).
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const ROTATING_WORDS = ['Crafted', 'Woven', 'Handmade', 'Curated'];

// Decorative SVG thread pattern
const ThreadSvg: React.FC<{ color?: string }> = ({ color = '#ab5a46' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    className="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M20 100 Q60 20 100 100 Q140 180 180 100"
      stroke={color}
      strokeWidth="1.5"
      strokeOpacity="0.25"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M20 120 Q60 40 100 120 Q140 200 180 120"
      stroke={color}
      strokeWidth="1"
      strokeOpacity="0.15"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M20 80 Q60 0 100 80 Q140 160 180 80"
      stroke={color}
      strokeWidth="1"
      strokeOpacity="0.15"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="100" cy="100" r="60" stroke={color} strokeWidth="0.5" strokeOpacity="0.1" />
    <circle cx="100" cy="100" r="40" stroke={color} strokeWidth="0.5" strokeOpacity="0.08" />
  </svg>
);

// Product showcase card
const SpotlightCard: React.FC<{ delay: number; index: number }> = ({ delay, index }) => {
  const cards = [
    {
      name: 'Indigo Monsoon Kit',
      type: 'Embroidery Kit',
      price: '₹1,299',
      tag: 'Best Seller',
      bg: 'from-[#3d2317] to-[#2a1a14]',
      accent: '#ab5a46',
      dot: '#f4ebd9',
    },
    {
      name: 'Kashmiri Garden',
      type: 'Digital Pattern',
      price: '₹349',
      tag: 'New Arrival',
      bg: 'from-[#1e2a1a] to-[#141c10]',
      accent: '#7a9b5e',
      dot: '#e8f4e0',
    },
    {
      name: 'Heritage Hoop Set',
      type: 'Finished Piece',
      price: '₹2,499',
      tag: 'Limited',
      bg: 'from-[#2a1a2a] to-[#1a101a]',
      accent: '#8b7ab8',
      dot: '#f0ecf8',
    },
  ];

  const c = cards[index % cards.length];

  return (
    <Link
      to="/shop"
      className={`relative rounded-sm overflow-hidden bg-gradient-to-br ${c.bg} p-5 flex flex-col justify-between group hover:opacity-95 transition-opacity cursor-pointer block`}
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        animation: `slideUp 0.7s ease ${delay}s both`,
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Pattern background */}
      <div className="absolute inset-0 opacity-20">
        <ThreadSvg color={c.accent} />
      </div>

      <div className="relative z-10">
        <span
          className="font-sans text-[9px] tracking-[0.3em] uppercase font-semibold px-2 py-1 rounded-full"
          style={{ background: `${c.accent}22`, color: c.accent }}
        >
          {c.tag}
        </span>
      </div>

      {/* Center dot decoration */}
      <div className="relative z-10 py-4 flex justify-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: `${c.accent}18`, border: `1px solid ${c.accent}30` }}
        >
          <Sparkles className="w-5 h-5" style={{ color: c.dot }} />
        </div>
      </div>

      <div className="relative z-10">
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#d2c4bc]/50 mb-1">{c.type}</p>
        <h3 className="font-serif text-[#f4ebd9] text-base font-normal leading-tight mb-2">{c.name}</h3>
        <p className="font-sans font-semibold text-sm" style={{ color: c.accent }}>{c.price}</p>
      </div>
    </Link>
  );
};

export default function HeroTemplate3() {
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  // Rotating word animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length);
        setWordVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[calc(100vh-65px)] md:h-[calc(100vh-70px)] min-h-[520px] w-full overflow-hidden bg-[#120a05]"
      aria-label="Hero: product spotlight"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #f4ebd9 25%, transparent 25%), linear-gradient(-45deg, #f4ebd9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4ebd9 75%), linear-gradient(-45deg, transparent 75%, #f4ebd9 75%)',
          backgroundSize: '4px 4px',
          backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 25% 50%, rgba(171,90,70,0.12) 0%, transparent 55%)',
        }}
      />

      {/* Main grid */}
      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-[55%_45%]">

        {/* ─── Left: Typography ─── */}
        <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-8 md:pt-0">

          {/* Studio badge */}
          <div
            className="flex items-center gap-2 mb-6 md:mb-8"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(-12px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="w-8 h-[1px] bg-[#ab5a46]" />
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#ab5a46] font-medium">
              Two Threads Studio
            </span>
          </div>

          {/* Giant rotating headline */}
          <div
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.9s cubic-bezier(0.76, 0, 0.24, 1), transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                lineHeight: 0.88,
              }}
            >
              <span
                className="block font-serif text-[#f4ebd9] font-normal"
                style={{ fontSize: 'clamp(48px, 8.5vw, 116px)' }}
              >
                Artisanally
              </span>
              {/* Rotating word */}
              <span
                className="block font-serif font-normal italic"
                style={{
                  fontSize: 'clamp(48px, 8.5vw, 116px)',
                  color: '#ab5a46',
                  opacity: wordVisible ? 1 : 0,
                  transform: wordVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                  display: 'block',
                }}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
              <span
                className="block font-serif text-[#f4ebd9] font-normal"
                style={{ fontSize: 'clamp(48px, 8.5vw, 116px)' }}
              >
                For You
              </span>
            </div>
          </div>

          {/* Description */}
          <div
            className="mt-6 md:mt-8 max-w-sm"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
            }}
          >
            <p className="font-sans text-xs md:text-sm text-[#d2c4bc]/60 leading-relaxed tracking-wide">
              Each kit is lovingly assembled by our artisans in India.
              <br />
              Slow craft. Sustainable materials. Made to last.
            </p>
          </div>

          {/* CTA buttons */}
          <div
            className="mt-8 md:mt-10 flex flex-wrap gap-4"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s',
            }}
          >
            <Link to="/shop" className="group inline-flex items-center gap-3 bg-[#ab5a46] text-[#f4ebd9] font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium px-8 py-4 hover:bg-[#c46b56] transition-all duration-300">
              Shop Collection
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/our-story" className="inline-flex items-center gap-3 border border-[#f4ebd9]/20 text-[#f4ebd9]/70 font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium px-8 py-4 hover:border-[#f4ebd9]/50 hover:text-[#f4ebd9] transition-all duration-300">
              Our Story
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="mt-10 md:mt-12 grid grid-cols-3 gap-6 border-t border-[#f4ebd9]/10 pt-8"
            style={{
              opacity: textVisible ? 1 : 0,
              transition: 'opacity 0.9s ease 0.5s',
            }}
          >
            {[
              { value: '2000+', label: 'Artisan Hours' },
              { value: '100%', label: 'Sustainable' },
              { value: '15k+', label: 'Happy Crafters' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-serif text-[#ab5a46] font-normal" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)' }}>
                  {stat.value}
                </p>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#d2c4bc]/40 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Right: Product Spotlight Grid ─── */}
        <div className="hidden md:flex flex-col justify-center px-6 lg:px-10 gap-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#d2c4bc]/40">
              Featured Products
            </span>
            <Link to="/shop" className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#ab5a46] hover:text-[#c46b56] transition-colors">
              View All →
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-rows-3 gap-3 flex-1">
            {[0, 1, 2].map(i => (
              <SpotlightCard key={i} index={i} delay={0.2 + i * 0.15} />
            ))}
          </div>

          {/* Bottom tag */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-[#f4ebd9]/8" />
            <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#d2c4bc]/25">
              Handcrafted with love
            </span>
            <div className="flex-1 h-[1px] bg-[#f4ebd9]/8" />
          </div>
        </div>
      </div>

      {/* Vertical studio text — decorative */}
      <div className="absolute bottom-12 left-4 z-10 hidden lg:block">
        <span
          className="font-sans text-[8px] tracking-[0.4em] uppercase text-[#f4ebd9]/15 select-none"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Two Threads Studio — Est. 2020
        </span>
      </div>
    </section>
  );
}
