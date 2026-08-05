/**
 * Hero Template 3 — The Open Sketchbook (Artisan Journal Edition)
 * 
 * Visual Concept:
 * An intimate, tactile glimpse into an artisan's working sketchbook.
 * Laid out like open pages with fabric swatches, pencil annotations, thread palettes,
 * and finished heirloom embroidery.
 * 
 * Desktop: Open sketchbook spread (Folio 01 Process & Swatches | Folio 02 Finished Artwork).
 * Mobile: Page-flipping pocket journal experience — one image, one thought, one action per page.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Feather, CircleDot, ChevronRight, Sparkles } from 'lucide-react';

// Thread Color Swatch Data
const THREAD_PALETTE = [
  { name: 'Natural Indigo', hex: '#2b3a4e', note: 'Organic Indigofera tinctoria' },
  { name: 'Terracotta Clay', hex: '#ab5a46', note: 'Mineral iron oxide dye' },
  { name: 'Golden Madder', hex: '#c88a4b', note: 'Wild Rubia cordifolia root' },
  { name: 'Raw Cotton', hex: '#e8e0d5', note: 'Unbleached handspun yarn' },
];

export default function HeroTemplate3() {
  const [activeSwatch, setActiveSwatch] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-65px)] md:h-[calc(100vh-70px)] md:min-h-[580px] w-full overflow-hidden bg-[#f4efe8] text-[#2c2724] select-none"
      aria-label="Artisan Open Sketchbook Hero"
    >
      {/* ── Background Paper & Linen Textures ── */}
      <div className="absolute inset-0 bg-[#f4efe8] pointer-events-none">
        {/* Subtle paper grain */}
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Soft warmth gradient */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#ebdccb]/30 to-[#ded2c3]/60" />
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
         DESKTOP EXPERIENCE — Open Sketchbook Spread (Facing Pages)
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex relative h-full w-full max-w-[1440px] mx-auto px-8 lg:px-16 items-center justify-center py-6">
        {/* Book Container with Drop Shadow & Leather Spine */}
        <div className="relative w-full h-[90%] max-h-[720px] min-h-[520px] bg-[#f9f6f0] rounded-lg border border-[#e0d6c8] shadow-[0_20px_50px_rgba(44,39,36,0.12)] flex overflow-hidden">
          
          {/* Central Journal Spine Crease */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[30px] -translate-x-1/2 z-30 pointer-events-none flex justify-center">
            <div className="w-[1px] h-full bg-[#d6caa4]/40" />
            <div className="w-[12px] h-full bg-gradient-to-r from-black/5 via-black/15 to-transparent" />
            <div className="w-[12px] h-full bg-gradient-to-l from-black/5 via-black/15 to-transparent" />
          </div>

          {/* Spine Binding Thread Stitches */}
          <div className="absolute left-1/2 top-6 bottom-6 -translate-x-1/2 z-40 pointer-events-none flex flex-col justify-between items-center opacity-60">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3 h-1 bg-[#ab5a46]/70 rounded-full shadow-xs transform -rotate-12" />
            ))}
          </div>

          {/* ──────────────────────────────────────────────────────────────────
             LEFT PAGE (FOLIO 01) — The Inspiration & Process
             ────────────────────────────────────────────────────────────────── */}
          <div className="w-1/2 h-full p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#faf7f2] via-[#f7f2ea] to-[#f2eae0]">
            {/* Page Header / Folio Number */}
            <div className="flex items-center justify-between border-b border-[#e2d6c5] pb-3 z-10">
              <div className="flex items-center gap-2">
                <Feather className="w-3.5 h-3.5 text-[#ab5a46]" />
                <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8c7a6b]">
                  Folio N° 01 &bull; Process & Materials
                </span>
              </div>
              <span className="font-serif italic text-xs text-[#a09081]">Two Threads Studio</span>
            </div>

            {/* Main Handwritten Note & Concept Intro */}
            <div className="my-auto space-y-5 z-10 max-w-lg">
              <div className="inline-block px-2.5 py-1 rounded bg-[#ab5a46]/10 text-[#ab5a46] font-sans text-[9px] tracking-[0.2em] uppercase font-bold">
                Artisan Notebook Entry &bull; Spring Batch
              </div>

              <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-normal leading-[1.12] text-[#2c2724]">
                Inspiration <span className="font-serif italic text-[#ab5a46] font-light">&rarr;</span> Craftsmanship <span className="font-serif italic text-[#ab5a46] font-light">&rarr;</span> Heirloom.
              </h1>

              <p className="font-sans text-xs lg:text-sm text-[#63564c] leading-relaxed tracking-wide font-normal">
                Every motif begins with a hand-penciled sketch on mulberry paper, carefully aligned with indigo thread counts before master artisans bring the needle to life.
              </p>

              {/* Hand Swatch Selection (Interactive) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#8c7a6b] font-bold flex items-center gap-1.5">
                    <CircleDot className="w-3 h-3 text-[#ab5a46]" /> Organic Thread Study
                  </span>
                  <span className="font-serif italic text-xs text-[#ab5a46]">
                    {THREAD_PALETTE[activeSwatch].name}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {THREAD_PALETTE.map((swatch, idx) => (
                    <button
                      key={swatch.name}
                      onClick={() => setActiveSwatch(idx)}
                      className={`group relative p-2.5 rounded-sm border transition-all duration-300 text-left flex flex-col justify-between ${
                        activeSwatch === idx
                          ? 'border-[#ab5a46] bg-[#fffdfa] shadow-sm'
                          : 'border-[#e5dacb] bg-[#f5ede2]/60 hover:border-[#ab5a46]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-inner"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-[8px] font-mono text-[#a09081]">#0{idx + 1}</span>
                      </div>
                      <span className="font-sans text-[9px] font-medium text-[#4a3f37] truncate">
                        {swatch.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tape Accent & Marginal Annotation */}
            <div className="relative z-10 pt-4 border-t border-[#e2d6c5]/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-3 bg-[#e8decb]/80 border-t border-b border-[#d8ccb8] transform -rotate-3 shadow-xs" />
                <span className="font-serif italic text-xs text-[#7c6c5f]">
                  &ldquo;Thread count 32/2 &bull; 100% Organic Khadi Cotton&rdquo;
                </span>
              </div>
              <Link
                to="/our-story"
                className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#ab5a46] font-semibold hover:text-[#2c2724] transition-colors flex items-center gap-1"
              >
                Read Journal &rarr;
              </Link>
            </div>

            {/* Background Hand-drawn Thread SVG Motif */}
            <svg
              className="absolute -right-8 bottom-4 w-64 h-64 opacity-10 pointer-events-none text-[#ab5a46]"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
            >
              <path d="M 10,100 C 40,10 65,190 100,100 C 135,10 160,190 190,100" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="80" strokeDasharray="3 3" strokeWidth="0.8" />
            </svg>
          </div>

          {/* ──────────────────────────────────────────────────────────────────
             RIGHT PAGE (FOLIO 02) — The Finished Heirloom & Direct Actions
             ────────────────────────────────────────────────────────────────── */}
          <div className="w-1/2 h-full p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-[#faf7f2]">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-[#e2d6c5] pb-3 z-10">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8c7a6b]">
                Folio N° 02 &bull; The Finished Masterpiece
              </span>
              <div className="flex items-center gap-1 text-[10px] tracking-widest uppercase font-mono text-[#ab5a46]">
                <Sparkles className="w-3 h-3" /> Artisan Certified
              </div>
            </div>

            {/* Central Artwork Showcase Card */}
            <div className="relative my-auto z-10 flex flex-col items-center">
              {/* Paper Corner Clips / Tape Accent */}
              <div className="absolute -top-3 left-6 z-20 w-12 h-4 bg-[#e5dacb]/90 border border-[#d2c4b2] transform -rotate-6 shadow-xs" />
              <div className="absolute -top-3 right-6 z-20 w-12 h-4 bg-[#e5dacb]/90 border border-[#d2c4b2] transform rotate-3 shadow-xs" />

              <div className="relative w-full max-w-[420px] bg-[#f4efe8] p-4 rounded-sm border border-[#e2d6c5] shadow-md group">
                {/* Simulated Artwork / Product Showcase Box */}
                <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#3d2317] via-[#2c180e] to-[#1a0c06] rounded-sm overflow-hidden flex flex-col justify-between p-5 border border-[#523324]/40 shadow-inner">
                  
                  {/* Decorative Embroidery Ring Overlay */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border border-dashed border-[#f4ebd9]" />
                    <div className="w-36 h-36 rounded-full border border-[#f4ebd9]/40" />
                  </div>

                  <div className="flex justify-between items-start z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ab5a46] text-[#f4ebd9] font-sans text-[8px] uppercase tracking-[0.2em] font-semibold">
                      Featured Heirloom
                    </span>
                    <span className="font-serif italic text-xs text-[#e5dacb]">
                      Kit N° 402
                    </span>
                  </div>

                  <div className="z-10 mt-auto">
                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#ab5a46] font-semibold block mb-1">
                      Pure Botanical Indigo
                    </span>
                    <h2 className="font-serif text-2xl lg:text-3xl text-[#f4ebd9] font-normal leading-tight">
                      Monsoon Botanical Kit
                    </h2>
                    <p className="font-sans text-[11px] text-[#e2d6c5]/80 mt-1">
                      Includes 100% silk threads, brass hoop, and hand-stenciled khadi linen.
                    </p>
                  </div>
                </div>

                {/* Caption below picture */}
                <div className="mt-3 flex items-center justify-between text-xs font-sans px-1">
                  <span className="text-[#63564c] font-medium">Handcrafted Batch &bull; Limited Edition</span>
                  <span className="font-serif text-[#ab5a46] text-base font-bold">₹1,299</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="relative z-10 pt-4 border-t border-[#e2d6c5]/80 flex items-center justify-between gap-4">
              <Link
                to="/shop"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#ab5a46] text-[#f4ebd9] font-sans text-[11px] uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-sm hover:bg-[#2c2724] transition-colors duration-300 shadow-sm"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/learning"
                className="inline-flex items-center justify-center gap-2 border border-[#ab5a46]/40 text-[#2c2724] hover:bg-[#ab5a46]/10 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-sm transition-colors duration-300"
              >
                Learn Craft
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
         MOBILE EXPERIENCE — Independent Page-Flipping Artisan Journal
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between p-6">
        
        {/* Journal Header Bar */}
        <div className="flex items-center justify-between border-b border-[#e2d6c5] pb-3 z-10">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#ab5a46]" />
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-[#8c7a6b]">
              Artisan Notebook &bull; Page {mobilePage + 1} of 3
            </span>
          </div>
          <span className="font-serif italic text-xs text-[#ab5a46]">Two Threads</span>
        </div>

        {/* ── Page Content Switcher (Single Thought, Single Focus per page) ── */}
        <div className="my-auto py-6 space-y-6 z-10">
          {mobilePage === 0 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="inline-block px-2 py-0.5 rounded bg-[#ab5a46]/10 text-[#ab5a46] font-sans text-[8px] uppercase tracking-[0.2em] font-bold">
                Folio 01 &bull; The Inspiration
              </div>
              <h1 className="font-serif text-3xl font-normal leading-tight text-[#2c2724]">
                Inspiration <br />
                <span className="font-serif italic text-[#ab5a46]">&rarr; Craftsmanship</span> <br />
                &rarr; Heirloom.
              </h1>
              <p className="font-sans text-xs text-[#63564c] leading-relaxed">
                Flip through the pages of our creative journey. Every motif is handcrafted with organic indigo yarn and slow heritage stitches.
              </p>
              
              <div className="p-4 bg-[#f8f3ec] rounded border border-[#e2d6c5]">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#8c7a6b] font-bold block mb-2">
                  Thread Study Palette
                </span>
                <div className="flex items-center justify-between">
                  {THREAD_PALETTE.map((swatch, idx) => (
                    <div key={swatch.name} className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: swatch.hex }} />
                      <span className="font-mono text-[8px] text-[#7c6c5f]">#0{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mobilePage === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="inline-block px-2 py-0.5 rounded bg-[#ab5a46]/10 text-[#ab5a46] font-sans text-[8px] uppercase tracking-[0.2em] font-bold">
                Folio 02 &bull; The Craft
              </div>
              <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#3d2317] to-[#1a0c06] rounded border border-[#e2d6c5] p-5 flex flex-col justify-between shadow-md">
                <span className="font-serif italic text-xs text-[#e5dacb]">Hand-stitched Detail</span>
                <div>
                  <h2 className="font-serif text-2xl text-[#f4ebd9]">Botanical Embroidery</h2>
                  <p className="font-sans text-[10px] text-[#e2d6c5]/80 mt-1">32-count organic khadi linen</p>
                </div>
              </div>
              <p className="font-sans text-xs text-[#63564c] italic border-l-2 border-[#ab5a46] pl-3 py-0.5">
                &ldquo;Mindful craft created in limited artisanal batches.&rdquo;
              </p>
            </div>
          )}

          {mobilePage === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="inline-block px-2 py-0.5 rounded bg-[#ab5a46]/10 text-[#ab5a46] font-sans text-[8px] uppercase tracking-[0.2em] font-bold">
                Folio 03 &bull; The Creation
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#2c2724]">
                Own a Piece of Heritage.
              </h2>
              <p className="font-sans text-xs text-[#63564c] leading-relaxed">
                Explore our full range of embroidery kits, digital patterns, and handcrafted home heirlooms.
              </p>
              
              <Link
                to="/shop"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#ab5a46] text-[#f4ebd9] font-sans text-[11px] uppercase tracking-[0.2em] font-bold py-3.5 rounded shadow-sm"
              >
                Shop Full Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Page Controls & Navigation Footer */}
        <div className="pt-4 border-t border-[#e2d6c5] z-10 flex items-center justify-between">
          {/* Page Indicators */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((p) => (
              <button
                key={p}
                onClick={() => setMobilePage(p)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  mobilePage === p ? 'w-6 bg-[#ab5a46]' : 'w-1.5 bg-[#d8ccb8]'
                }`}
                aria-label={`Go to page ${p + 1}`}
              />
            ))}
          </div>

          {/* Next Page / Action Button */}
          {mobilePage < 2 ? (
            <button
              onClick={() => setMobilePage((prev) => Math.min(prev + 1, 2))}
              className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#ab5a46] font-bold flex items-center gap-1"
            >
              Turn Page <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              to="/shop"
              className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#ab5a46] font-bold flex items-center gap-1"
            >
              Explore Shop &rarr;
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
