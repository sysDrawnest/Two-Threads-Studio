/**
 * HeroTemplate3 — "Meditative Craft. Silent Luxury."
 *
 * Exact replication of reference design:
 * - Desktop View: 3-Panel Split Triptych with hairline dividers.
 * - Mobile View: Elegant auto-playing & touch-swipeable slideshow cycling through the 3 hero images.
 *
 * IMAGE ASSETS (Replace these files in frontend/src/assets/ with your own images):
 * 1. hero_template3_slide1.jpg  (Left Panel / Slide 1)
 * 2. hero_template3_slide2.jpg  (Center Panel / Slide 2)
 * 3. hero_template3_slide3.jpg  (Right Panel / Slide 3)
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// 3 Core Template Images — Can be replaced in src/assets/
import slide1Img from '../../assets/hero_template3_slide1.jpg';
import slide2Img from '../../assets/hero_template3_slide2.jpg';
import slide3Img from '../../assets/hero_template3_slide3.jpg';

const SLIDES = [
  {
    id: 1,
    image: slide1Img,
    alt: 'Artisan in botanical hand-embroidered linen dress',
    title: 'Botanical Linen',
  },
  {
    id: 2,
    image: slide2Img,
    alt: 'Artisan walking inside sunlit textile loom studio',
    title: 'Heritage Loom',
  },
  {
    id: 3,
    image: slide3Img,
    alt: 'Handcrafted crochet fringed top and macramé textile art',
    title: 'Macramé & Crochet',
  },
];

export default function HeroTemplate3() {
  // ── Mobile Slideshow State ──
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slideshow every 4.5 seconds on mobile
  useEffect(() => {
    const startTimer = () => {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, 4500);
    };

    startTimer();

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [currentSlide]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#171310] overflow-hidden flex items-center justify-center select-none">
      {/* ─── DESKTOP VIEW (3-Panel Split Triptych with Hairline Dividers) ─── */}
      <div className="hidden md:grid md:grid-cols-3 w-full h-full min-h-[calc(100vh-70px)] max-h-[900px] relative">
        {/* Left Panel: Slide 1 */}
        <div className="relative h-full overflow-hidden border-r border-white/30 bg-[#2b241d]">
          <img
            src={slide1Img}
            alt={SLIDES[0].alt}
            className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
            // @ts-ignore
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* Center Panel: Slide 2 */}
        <div className="relative h-full overflow-hidden border-r border-white/30 bg-[#2b241d]">
          <img
            src={slide2Img}
            alt={SLIDES[1].alt}
            className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
            // @ts-ignore
            fetchpriority="high"
          />
          {/* Soft gradient scrim for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/15 pointer-events-none" />
        </div>

        {/* Right Panel: Slide 3 */}
        <div className="relative h-full overflow-hidden bg-[#2b241d]">
          <img
            src={slide3Img}
            alt={SLIDES[2].alt}
            className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
            // @ts-ignore
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* ─── Center Typography & CTA Overlay ─── */}
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

      {/* ─── MOBILE VIEW (Auto-Playing & Touch-Swipeable 3-Image Slideshow) ─── */}
      <div
        className="md:hidden w-full relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated Background Slides with Cross-Fade */}
        <div className="absolute inset-0 w-full h-full">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center transform scale-[1.01] transition-transform duration-[6000ms] ease-out"
                // @ts-ignore
                fetchpriority={index === 0 ? 'high' : 'auto'}
              />
            </div>
          ))}
          {/* Contrast scrim layer for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/25 z-10 pointer-events-none" />
        </div>

        {/* Top Spacer */}
        <div className="h-10 z-20" />

        {/* Center Mobile Overlay Typography & Button */}
        <div className="relative z-20 px-6 py-8 text-center flex flex-col items-center">
          <h1
            className="font-serif uppercase text-white font-normal tracking-[0.04em] leading-[1.15] text-2xl sm:text-3xl"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.65)' }}
          >
            <span className="block">MEDITATIVE CRAFT.</span>
            <span className="block">SILENT LUXURY.</span>
          </h1>

          <p
            className="font-sans text-white/95 text-xs sm:text-sm font-normal leading-relaxed mt-3.5 max-w-xs"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}
          >
            Embrace the slow life with handcrafted textile art and curated DIY kits, where timeless heritage meets mindful creativity.
          </p>

          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-block bg-[#807248] hover:bg-[#6D603A] text-white font-sans text-xs tracking-[0.16em] uppercase px-7 py-3 border border-[#DFD8BA] shadow-md text-center font-medium active:scale-95 transition-transform"
            >
              EXPLORE THE STUDIO
            </Link>
          </div>
        </div>

        {/* Bottom Pagination Indicators (Dots / Pills) */}
        <div className="relative z-20 pb-8 flex items-center justify-center gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? 'w-7 bg-white shadow-sm'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



