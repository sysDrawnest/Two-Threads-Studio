/**
 * Hero Template 3 — The Floating Gallery (Artisan Exhibition)
 * 
 * Inspired by a curated museum gallery of handcrafted textile memories.
 * Replaces standard grid/split layouts with floating asymmetrical artworks,
 * generous negative space, flowing typography, and calm tactile motion.
 * 
 * Desktop: Floating museum wall with organic text placement.
 * Mobile: Vertical scrolling story with overlapping full-width imagery.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

// Fine art gallery image imports
import imgPortrait from '../../assets/portrait_of_personalized_portraits_for_a_luxur.png';
import imgWedding from '../../assets/portrait_of_wedding_keepsakes_for_a_luxury_em.png';
import imgHeritage from '../../assets/portrait_of_a_heritage_collection_for_a_luxury.png';
import imgBotanical from '../../assets/portrait_of_a_botanical_collection_for_a_luxur.png';

interface ExhibitItem {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  aspect: string;
  desktopPosition: string; // Tailored absolute or grid placement
  caption: string;
}

const EXHIBITS: ExhibitItem[] = [
  {
    id: '01',
    title: 'Custom Portraits',
    category: 'Portrait',
    image: imgPortrait,
    link: '/custom-creations',
    aspect: 'aspect-[3/4]',
    desktopPosition: 'top-[8%] left-[6%] w-[22vw] max-w-[280px]',
    caption: 'Fine needlework derived from heirloom photographs',
  },
  {
    id: '02',
    title: 'Wedding Keepsakes',
    category: 'Wedding',
    image: imgWedding,
    link: '/collections',
    aspect: 'aspect-[4/5]',
    desktopPosition: 'top-[14%] right-[8%] w-[25vw] max-w-[320px]',
    caption: 'Sacred vows & floral motifs captured in gold thread',
  },
  {
    id: '03',
    title: 'Heritage Threads',
    category: 'Handmade',
    image: imgHeritage,
    link: '/artisans',
    aspect: 'aspect-[3/4]',
    desktopPosition: 'bottom-[10%] left-[12%] w-[20vw] max-w-[260px]',
    caption: 'Traditional techniques handed down across generations',
  },
  {
    id: '04',
    title: 'Botanical Echoes',
    category: 'Pet & Flora',
    image: imgBotanical,
    link: '/shop',
    aspect: 'aspect-[4/5]',
    desktopPosition: 'bottom-[8%] right-[14%] w-[21vw] max-w-[270px]',
    caption: 'Organic dye palettes and botanical embroidery',
  },
];

export default function HeroTemplate3() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredExhibit, setHoveredExhibit] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-65px)] md:h-[calc(100vh-70px)] md:min-h-[720px] w-full overflow-hidden bg-[#16120e] text-[#f4ebd9]"
      aria-label="Hero: The Floating Gallery"
    >
      {/* Subtle ambient museum glow & grain texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(#f4ebd9 1px, transparent 1px), radial-gradient(#ab5a46 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(171,90,70,0.18) 0%, rgba(22,18,14,0.85) 65%, #16120e 100%)',
          }}
        />
      </div>

      {/* 
        ════════════════════════════════════════
        DESKTOP EXPERIENCE: Museum Floating Wall
        ════════════════════════════════════════
      */}
      <div className="hidden md:block relative z-10 w-full h-full">
        {/* Floating Headline & Curator Note — Natural Center Flow */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 pointer-events-none">
          <div
            className="max-w-xl transition-all duration-1000 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            {/* Gallery Exhibition Tag */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-[#ab5a46]/10 border border-[#ab5a46]/30">
              <Sparkles className="w-3 h-3 text-[#ab5a46]" />
              <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#e6cdc3] font-medium">
                The Floating Exhibition
              </span>
            </div>

            {/* Asymmetrical natural headline */}
            <h1 className="font-serif text-[#f4ebd9] font-normal leading-[0.95] tracking-tight mb-6">
              <span className="block text-[clamp(44px,5.5vw,78px)]">
                Handcrafted
              </span>
              <span className="block text-[clamp(52px,6.5vw,92px)] italic text-[#ab5a46] -mt-2">
                Memories
              </span>
            </h1>

            <p className="font-sans text-xs lg:text-sm text-[#d2c4bc]/75 leading-relaxed tracking-wide mb-8 max-w-md mx-auto pointer-events-auto">
              An exhibition of fine needlework, indigo-dyed textiles, and immortalized moments.
              Crafted slowly by master artisans.
            </p>

            {/* Gallery CTAs */}
            <div className="flex items-center justify-center gap-5 pointer-events-auto">
              <Link
                to="/custom-creations"
                className="group relative inline-flex items-center gap-3 bg-[#ab5a46] text-[#f4ebd9] font-sans text-[11px] tracking-[0.2em] uppercase font-medium px-8 py-3.5 hover:bg-[#c46b56] transition-all duration-300 shadow-xl"
              >
                <span>Begin Commission</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[#f4ebd9]/70 hover:text-[#f4ebd9] font-sans text-[11px] tracking-[0.2em] uppercase font-medium px-6 py-3.5 border border-[#f4ebd9]/20 hover:border-[#f4ebd9]/50 transition-all duration-300"
              >
                <span>Explore Store</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Artworks (Pinned on Museum Wall) */}
        {EXHIBITS.map((exhibit, idx) => {
          const isHovered = hoveredExhibit === exhibit.id;
          return (
            <Link
              key={exhibit.id}
              to={exhibit.link}
              onMouseEnter={() => setHoveredExhibit(exhibit.id)}
              onMouseLeave={() => setHoveredExhibit(null)}
              className={`absolute ${exhibit.desktopPosition} group transition-all duration-700 ease-out z-10`}
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded
                  ? isHovered
                    ? 'scale(1.04) translateY(-6px)'
                    : 'scale(1) translateY(0)'
                  : 'translateY(30px)',
                transitionDelay: `${idx * 150}ms`,
              }}
            >
              <div className="relative p-2 bg-[#221b16]/80 border border-[#f4ebd9]/10 shadow-2xl backdrop-blur-xs">
                {/* Artwork Canvas */}
                <div className={`relative w-full ${exhibit.aspect} overflow-hidden bg-[#16120e]`}>
                  <img
                    src={exhibit.image}
                    alt={exhibit.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16120e]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Museum Exhibition Tag */}
                <div className="mt-2.5 px-1 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#ab5a46]">
                      [{exhibit.id}]
                    </span>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-[#f4ebd9]/90 font-medium">
                      {exhibit.category}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#f4ebd9]/40 group-hover:text-[#ab5a46] transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}

        {/* Bottom subtle aesthetic note */}
        <div className="absolute bottom-6 left-8 z-20 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-[#ab5a46]" />
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#f4ebd9]/40">
            Curated Artisan Collection &bull; Studio Edition
          </span>
        </div>
      </div>

      {/* 
        ════════════════════════════════════════
        MOBILE EXPERIENCE: Vertical Editorial Story
        ════════════════════════════════════════
      */}
      <div className="block md:hidden relative z-10 w-full px-6 py-12 space-y-16">
        {/* Editorial Title Block */}
        <div className="text-left pt-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ab5a46]/10 border border-[#ab5a46]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#ab5a46]" />
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#e6cdc3] font-medium">
              Artisan Exhibition
            </span>
          </div>

          <h1 className="font-serif text-[#f4ebd9] text-[42px] leading-[0.98] font-normal tracking-tight">
            Handcrafted <br />
            <span className="italic text-[#ab5a46]">Memories</span>
          </h1>

          <p className="font-sans text-xs text-[#d2c4bc]/75 leading-relaxed tracking-wide pt-1">
            Walk through our gallery of bespoke textile portraits, wedding keepsakes, and heirloom craft.
          </p>
        </div>

        {/* Vertical Gallery Items with Overlapping Rhythm */}
        <div className="space-y-16">
          {EXHIBITS.map((exhibit, i) => (
            <div key={exhibit.id} className="relative space-y-4">
              {/* Exhibit Number & Label */}
              <div className="flex items-center justify-between border-b border-[#f4ebd9]/10 pb-2">
                <span className="font-sans text-xs font-mono tracking-widest text-[#ab5a46]">
                  EXHIBIT {exhibit.id}
                </span>
                <span className="font-serif text-sm italic text-[#f4ebd9]/80">
                  {exhibit.category}
                </span>
              </div>

              {/* Full Width Frame */}
              <Link to={exhibit.link} className="block group relative">
                <div className="p-2 bg-[#221b16] border border-[#f4ebd9]/10 shadow-2xl">
                  <div className={`relative w-full ${exhibit.aspect} overflow-hidden bg-[#16120e]`}>
                    <img
                      src={exhibit.image}
                      alt={exhibit.title}
                      className="w-full h-full object-cover filter brightness-95"
                    />
                  </div>
                </div>

                {/* Overlapping Text Label */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-[#f4ebd9] font-normal">
                      {exhibit.title}
                    </h3>
                    <p className="font-sans text-[10px] text-[#d2c4bc]/60 tracking-wider">
                      {exhibit.caption}
                    </p>
                  </div>
                  <div className="p-2 rounded-full border border-[#f4ebd9]/20 text-[#ab5a46]">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Tactile CTAs */}
        <div className="pt-8 border-t border-[#f4ebd9]/10 flex flex-col gap-4 text-center">
          <Link
            to="/custom-creations"
            className="w-full inline-flex items-center justify-center gap-3 bg-[#ab5a46] text-[#f4ebd9] font-sans text-xs tracking-[0.2em] uppercase font-medium py-4 shadow-xl"
          >
            <span>Begin Commission</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className="w-full inline-flex items-center justify-center gap-2 text-[#f4ebd9]/80 font-sans text-xs tracking-[0.2em] uppercase font-medium py-3.5 border border-[#f4ebd9]/20"
          >
            <span>Explore Entire Collection</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
