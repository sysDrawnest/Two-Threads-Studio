/**
 * Hero Template 2 — Full-Screen Editorial Slideshow
 * Four-panel auto-advancing luxury editorial layout.
 * Uses existing Two Threads Studio design language: terracotta (#ab5a46),
 * warm cream (#f4ebd9), and Cormorant Garamond / Lato typefaces.
 * No external assets required — uses CSS gradients and patterns.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  label: string;
  headline: string;
  subheadline: string;
  caption: string;
  cta: string;
  bg: string;
  accent: string;
  pattern: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    label: 'New Collection',
    headline: 'Indigo\nEmbroidery',
    subheadline: 'Kits',
    caption: 'Hand-dyed threads · Limited batches · Mindful craft',
    cta: 'Explore Collection',
    bg: 'from-[#2a1a14] via-[#3d2317] to-[#1a0f0a]',
    accent: '#ab5a46',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(171,90,70,0.15) 0%, transparent 50%)',
  },
  {
    id: 2,
    label: 'Artisan Craft',
    headline: 'Sacred\nTraditions',
    subheadline: 'Collection',
    caption: 'Woven stories · Heritage patterns · Sustainable materials',
    cta: 'Shop Now',
    bg: 'from-[#1e2a1a] via-[#2d3d28] to-[#141c10]',
    accent: '#7a9b5e',
    pattern: 'radial-gradient(circle at 20% 80%, rgba(122,155,94,0.12) 0%, transparent 50%)',
  },
  {
    id: 3,
    label: 'Workshop',
    headline: 'Learn &\nCreate',
    subheadline: 'Studio',
    caption: 'Expert-led workshops · Community · Your creative journey',
    cta: 'Join a Workshop',
    bg: 'from-[#1a1a2e] via-[#2d2d4a] to-[#0f0f1e]',
    accent: '#8b7ab8',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(139,122,184,0.12) 0%, transparent 60%)',
  },
  {
    id: 4,
    label: 'Gift Sets',
    headline: 'Curated\nGift',
    subheadline: 'Hampers',
    caption: 'Beautifully packaged · Perfect for every occasion',
    cta: 'Find a Gift',
    bg: 'from-[#2a1a1a] via-[#3d2626] to-[#1a1010]',
    accent: '#c4776a',
    pattern: 'radial-gradient(circle at 30% 60%, rgba(196,119,106,0.12) 0%, transparent 50%)',
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function HeroTemplate2() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  // Autoplay with progress bar
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const rafId = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100));
      if (elapsed < AUTOPLAY_INTERVAL) {
        requestAnimationFrame(tick);
      }
    });
    const timer = setTimeout(next, AUTOPLAY_INTERVAL);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [current, next]);

  const slide = SLIDES[current];

  return (
    <section
      id="hero"
      className="relative h-[calc(100vh-65px)] md:h-[calc(100vh-70px)] min-h-[520px] w-full overflow-hidden"
      aria-label="Hero slideshow"
    >
      {/* Background layers */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-br ${s.bg} transition-opacity duration-700`}
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div className="absolute inset-0" style={{ background: s.pattern }} />
          {/* Decorative grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>
      ))}

      {/* Four-quadrant photo grid overlay */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] opacity-20 pointer-events-none">
        {[
          { gradient: 'from-[#ab5a46]/40 to-transparent', delay: '0s' },
          { gradient: 'from-[#d2c4bc]/20 to-transparent', delay: '0.2s' },
          { gradient: 'from-[#786455]/30 to-transparent', delay: '0.4s' },
          { gradient: 'from-[#ab5a46]/20 to-transparent', delay: '0.6s' },
        ].map((q, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${q.gradient} rounded-sm`}
            style={{ animationDelay: q.delay }}
          />
        ))}
      </div>

      {/* Slide number indicator — top left */}
      <div className="absolute top-8 left-8 md:top-12 md:left-14 z-20">
        <span
          className="font-serif text-[#f4ebd9]/40 select-none"
          style={{ fontSize: 'clamp(48px, 10vw, 120px)', lineHeight: 1 }}
        >
          0{current + 1}
        </span>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-24 px-8 md:px-16 lg:px-24 z-10">
        {/* Collection label */}
        <div
          className="mb-4 md:mb-6"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <span
            className="font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-medium"
            style={{ color: slide.accent }}
          >
            {slide.label}
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
            transition: 'opacity 0.55s ease 0.05s, transform 0.55s ease 0.05s',
          }}
        >
          <h1
            className="font-serif text-[#f4ebd9] font-normal leading-none mb-1"
            style={{ fontSize: 'clamp(52px, 9vw, 130px)' }}
          >
            {slide.headline.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <h2
            className="font-serif font-normal italic"
            style={{
              fontSize: 'clamp(28px, 5vw, 72px)',
              color: slide.accent,
              lineHeight: 1,
            }}
          >
            {slide.subheadline}
          </h2>
        </div>

        {/* Caption + CTA */}
        <div
          className="mt-6 md:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(16px)' : 'translateY(0)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          <p className="font-sans text-[10px] md:text-xs tracking-[0.2em] text-[#d2c4bc]/70 uppercase max-w-xs">
            {slide.caption}
          </p>
          <button
            className="shrink-0 font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium px-8 py-3.5 border transition-all duration-300"
            style={{
              borderColor: slide.accent,
              color: slide.accent,
              background: 'transparent',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = slide.accent;
              (e.currentTarget as HTMLButtonElement).style.color = '#f4ebd9';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = slide.accent;
            }}
          >
            {slide.cta}
          </button>
        </div>
      </div>

      {/* Right side: navigation + slide list */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-5">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="w-9 h-9 rounded-full border border-[#f4ebd9]/20 flex items-center justify-center text-[#f4ebd9]/60 hover:border-[#f4ebd9]/60 hover:text-[#f4ebd9] transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? '2px' : '2px',
              height: i === current ? '32px' : '12px',
              background: i === current ? slide.accent : 'rgba(244,235,217,0.3)',
              borderRadius: '2px',
            }}
          />
        ))}

        <button
          onClick={next}
          aria-label="Next slide"
          className="w-9 h-9 rounded-full border border-[#f4ebd9]/20 flex items-center justify-center text-[#f4ebd9]/60 hover:border-[#f4ebd9]/60 hover:text-[#f4ebd9] transition-all duration-300"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f4ebd9]/10 z-20">
        <div
          className="h-full transition-none"
          style={{
            width: `${progress}%`,
            background: slide.accent,
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Slide total — bottom right */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-14 z-20">
        <span className="font-sans text-[9px] tracking-[0.25em] text-[#f4ebd9]/30 uppercase">
          / 0{SLIDES.length}
        </span>
      </div>
    </section>
  );
}
