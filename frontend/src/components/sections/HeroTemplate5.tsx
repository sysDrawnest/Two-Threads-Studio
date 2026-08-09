/**
 * HeroTemplate5 — "The Artisan Monogram & Heritage Lineage" (Video Enhanced)
 *
 * Exact reproduction of the approved reference design, enhanced with high-res ambient video:
 * - Background Video: Craftsmanship embroidery video looping subtly in the background
 * - Palette: Warm Linen Paper (#FAF7F2 / #F7F4EF), Deep Charcoal (#2D2520), Artisan Clay (#8C5A3E / #85634B), Muted Thread Line (#C8B8AA)
 * - Monogram: Giant italic serif "T" watermark with trailing thread line
 * - Typography: Bold Cormorant Garamond / Georgia display serif for "TWO THREADS STUDIO"
 * - Subtitle: "Artisan Luxury. Handcrafted Textile Décor & Kits. Est. 2023"
 * - CTA: Clay brown rectangular button with white dashed inner stitch border & uppercase letter-spaced text
 * - Side Vector Art: Delicate line-art SVGs of embroidery hoops, macramé wall hangings, Lippan mirrors, and crochet hooks
 * - Bottom Bar: Organic wavy thread connecting 4 line-art category items (Embroidery, Crochet, Macramé, Lippan Art)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/Craftsmanship_embroidery_in_heri…_202607141530.mp4';

export default function HeroTemplate5() {
  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-70px)] bg-[#FAF7F2] text-[#2D2520] flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── BACKGROUND AMBIENT CRAFTSMANSHIP VIDEO ─── */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 md:opacity-30 filter brightness-[0.95] contrast-[1.05] saturate-[0.85]"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Soft Linen Tint Overlay for High Text Readability & Contrast */}
        <div className="absolute inset-0 bg-[#FAF7F2]/65 backdrop-blur-[0.5px]" />
      </div>

      {/* ─── BACKGROUND VECTOR LINE ART: LEFT SIDE ─── */}
      <div className="absolute left-0 top-0 bottom-0 w-48 sm:w-64 md:w-80 pointer-events-none opacity-40 md:opacity-65 z-10 flex flex-col justify-between p-4 sm:p-6">
        {/* Top Left: Embroidery Hoop & Needle Line Art */}
        <div className="w-36 h-36 sm:w-48 sm:h-48">
          <svg viewBox="0 0 160 160" fill="none" stroke="#8C6F5A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            {/* Outer & Inner Hoop */}
            <circle cx="70" cy="70" r="55" />
            <circle cx="70" cy="70" r="49" strokeDasharray="3 3" />
            {/* Top Screw Mechanism */}
            <rect x="63" y="8" width="14" height="7" rx="1" />
            <line x1="70" y1="2" x2="70" y2="8" />
            {/* Fabric Guide Lines */}
            <path d="M40 50 Q70 80 100 50" strokeWidth="0.8" opacity="0.7" />
            <path d="M30 75 Q70 105 110 75" strokeWidth="0.8" opacity="0.7" />
            {/* Needle & Thread */}
            <path d="M110 30 L135 10" strokeWidth="1.5" />
            <path d="M135 10 Q145 25 125 40 Q105 55 120 70" strokeWidth="0.9" strokeDasharray="4 2" />
          </svg>
        </div>

        {/* Bottom Left: Macramé Wall Hanging & Lippan Mirror Line Art */}
        <div className="w-40 h-64 sm:w-56 sm:h-80 -ml-2 mb-10">
          <svg viewBox="0 0 200 300" fill="none" stroke="#8C6F5A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            {/* Macramé Hanging */}
            <line x1="20" y1="20" x2="140" y2="20" strokeWidth="2" />
            <polygon points="80,20 30,50 130,50" strokeWidth="1" />
            <path d="M30 50 L80 120 L130 50" />
            <path d="M50 50 L80 90 L110 50" />
            <line x1="40" y1="120" x2="40" y2="160" />
            <line x1="60" y1="120" x2="60" y2="170" />
            <line x1="80" y1="120" x2="80" y2="180" />
            <line x1="100" y1="120" x2="100" y2="170" />
            <line x1="120" y1="120" x2="120" y2="160" />
            
            {/* Lippan Mandala Mirror below */}
            <circle cx="80" cy="230" r="45" />
            <circle cx="80" cy="230" r="30" />
            <circle cx="80" cy="230" r="18" strokeDasharray="2 2" />
            {/* Petal/Ray Rays */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <line
                key={i}
                x1={80 + 30 * Math.cos((angle * Math.PI) / 180)}
                y1={230 + 30 * Math.sin((angle * Math.PI) / 180)}
                x2={80 + 44 * Math.cos((angle * Math.PI) / 180)}
                y2={230 + 44 * Math.sin((angle * Math.PI) / 180)}
                strokeWidth="0.9"
              />
            ))}
            {/* Mirror Reflection Strokes */}
            <line x1="72" y1="222" x2="84" y2="234" strokeWidth="1" />
            <line x1="77" y1="222" x2="86" y2="231" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* ─── BACKGROUND VECTOR LINE ART: RIGHT SIDE ─── */}
      <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64 md:w-80 pointer-events-none opacity-40 md:opacity-65 z-10 flex flex-col justify-between items-end p-4 sm:p-6">
        {/* Top Right: Macramé Tapestry */}
        <div className="w-40 h-48 sm:w-56 sm:h-64 -mr-2">
          <svg viewBox="0 0 200 240" fill="none" stroke="#8C6F5A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <line x1="60" y1="20" x2="180" y2="20" strokeWidth="2" />
            <path d="M120 20 L180 80 L60 80 Z" />
            <path d="M80 80 L120 130 L160 80" />
            <path d="M100 80 L120 110 L140 80" />
            <line x1="75" y1="130" x2="75" y2="190" />
            <line x1="95" y1="130" x2="95" y2="200" />
            <line x1="120" y1="130" x2="120" y2="210" />
            <line x1="145" y1="130" x2="145" y2="200" />
            <line x1="165" y1="130" x2="165" y2="190" />
            <circle cx="120" cy="10" r="3" />
            <line x1="60" y1="20" x2="120" y2="10" />
            <line x1="180" y1="20" x2="120" y2="10" />
          </svg>
        </div>

        {/* Bottom Right: Lippan Mirror & Crochet Hook Line Art */}
        <div className="w-44 h-64 sm:w-60 sm:h-80 -mr-4 mb-8">
          <svg viewBox="0 0 220 300" fill="none" stroke="#8C6F5A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            {/* Lippan Mandala */}
            <circle cx="130" cy="110" r="50" />
            <circle cx="130" cy="110" r="35" strokeDasharray="3 3" />
            <circle cx="130" cy="110" r="22" />
            {/* Mirror Reflection */}
            <line x1="120" y1="100" x2="136" y2="116" strokeWidth="1.2" />
            <line x1="126" y1="100" x2="138" y2="112" strokeWidth="1.2" />
            
            {/* Outer Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={i}
                cx={130 + 43 * Math.cos((angle * Math.PI) / 180)}
                cy={110 + 43 * Math.sin((angle * Math.PI) / 180)}
                r="6"
                strokeWidth="0.8"
              />
            ))}

            {/* Crochet Hook Tool */}
            <path d="M40 280 L150 170" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M150 170 Q156 164 153 158 Q147 154 143 160" strokeWidth="1.8" />
            {/* Trailing Yarn Loop */}
            <path d="M143 160 Q120 140 100 170 T60 210" strokeWidth="0.9" strokeDasharray="4 2" />
          </svg>
        </div>
      </div>

      {/* ─── CENTER HERO COMPOSITION ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto my-auto">
        
        {/* Giant Monogram 'T' Watermark Background with Thread Line */}
        <div className="relative flex items-center justify-center w-full">
          
          {/* Giant 'T' Monogram Graphic */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 sm:opacity-40 select-none">
            <span className="font-serif italic text-[180px] sm:text-[280px] md:text-[380px] text-[#8C6F5A] font-normal leading-none transform -translate-y-4">
              T
            </span>
            {/* Thread Line Winding Through Monogram */}
            <svg className="absolute w-[240px] sm:w-[360px] md:w-[480px] h-[180px] sm:h-[260px] pointer-events-none" viewBox="0 0 400 200" fill="none">
              <path
                d="M 60 140 C 120 40, 200 160, 280 60 C 320 20, 360 80, 340 120 C 320 160, 240 180, 180 120"
                stroke="#8C6F5A"
                strokeWidth="1.5"
                strokeDasharray="5 3"
                opacity="0.75"
              />
            </svg>
          </div>

          {/* Foreground Title Text Superimposed over Monogram */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Sub-Brand Title */}
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2520] tracking-[0.25em] uppercase mb-1 sm:mb-2">
              TWO THREADS
            </h2>

            {/* Giant Main Brand Name */}
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[112px] font-bold text-[#2D2520] tracking-[0.16em] uppercase leading-[0.95] mb-5 sm:mb-7">
              STUDIO
            </h1>

            {/* Subtitle Statement */}
            <p className="font-serif text-xs sm:text-base md:text-lg text-[#5A4A3F] font-normal tracking-wide max-w-xl mx-auto mb-7 sm:mb-9">
              Artisan Luxury. Handcrafted Textile Décor &amp; Kits. Est. 2023
            </p>

            {/* Stitched CTA Button */}
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center p-1 bg-[#85634B] hover:bg-[#73533D] transition-all duration-300 rounded-[2px] shadow-[0_6px_20px_rgba(133,99,75,0.25)] hover:shadow-[0_10px_25px_rgba(133,99,75,0.35)] hover:-translate-y-0.5"
            >
              <div className="px-6 py-2.5 sm:px-8 sm:py-3 border border-dashed border-white/70 rounded-[1px] flex items-center justify-center">
                <span className="font-sans text-xs sm:text-sm tracking-[0.25em] uppercase font-medium text-[#FAF7F2]">
                  EXPLORE THE COLLECTION
                </span>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* ─── BOTTOM CATEGORY BAR WITH ORGANIC WAVY THREAD ─── */}
      <div className="relative z-10 w-full pt-4 pb-6 sm:pb-8 px-4 sm:px-8 border-t border-[#8C6F5A]/15 bg-[#FAF7F2]/90 backdrop-blur-[2px]">
        
        {/* Wavy Thread Connecting SVG Line */}
        <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none overflow-hidden -translate-y-1/2">
          <svg className="w-full h-full" viewBox="0 0 1200 40" preserveAspectRatio="none" fill="none">
            <path
              d="M0 20 Q150 5, 300 20 T600 20 T900 20 T1200 20"
              stroke="#8C6F5A"
              strokeWidth="1.2"
              opacity="0.45"
            />
          </svg>
        </div>

        {/* 4 Category Quick Links */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
          {[
            {
              name: 'Embroidery',
              path: '/shop?category=embroidery',
              icon: (
                <svg className="w-7 h-7 stroke-[#8C6F5A]" viewBox="0 0 32 32" fill="none" strokeWidth="1.4">
                  <path d="M16 4 C22 10, 22 22, 16 28 C10 22, 10 10, 16 4 Z" />
                  <path d="M4 16 C10 22, 22 22, 28 16 C22 10, 10 10, 4 16 Z" />
                  <circle cx="16" cy="16" r="3" />
                </svg>
              ),
            },
            {
              name: 'Crochet',
              path: '/shop?category=crochet',
              icon: (
                <svg className="w-7 h-7 stroke-[#8C6F5A]" viewBox="0 0 32 32" fill="none" strokeWidth="1.4">
                  <circle cx="16" cy="18" r="9" strokeDasharray="3 2" />
                  <path d="M8 8 L24 24" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M24 24 Q27 21 25 18" strokeWidth="1.5" />
                </svg>
              ),
            },
            {
              name: 'Macramé',
              path: '/shop?category=macrame',
              icon: (
                <svg className="w-7 h-7 stroke-[#8C6F5A]" viewBox="0 0 32 32" fill="none" strokeWidth="1.4">
                  <line x1="6" y1="6" x2="26" y2="6" strokeWidth="2" />
                  <path d="M10 6 L16 16 L22 6" />
                  <line x1="12" y1="16" x2="12" y2="26" />
                  <line x1="16" y1="16" x2="16" y2="28" />
                  <line x1="20" y1="16" x2="20" y2="26" />
                </svg>
              ),
            },
            {
              name: 'Lippan Art',
              path: '/shop?category=lippan-art',
              icon: (
                <svg className="w-7 h-7 stroke-[#8C6F5A]" viewBox="0 0 32 32" fill="none" strokeWidth="1.4">
                  <circle cx="16" cy="16" r="11" />
                  <circle cx="16" cy="16" r="6" />
                  <line x1="13" y1="13" x2="19" y2="19" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                    <circle
                      key={i}
                      cx={16 + 9 * Math.cos((a * Math.PI) / 180)}
                      cy={16 + 9 * Math.sin((a * Math.PI) / 180)}
                      r="1"
                    />
                  ))}
                </svg>
              ),
            },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group flex flex-col items-center justify-center p-2 rounded hover:bg-[#8C6F5A]/5 transition-all duration-300"
            >
              <div className="mb-1.5 transform group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <span className="font-serif text-xs sm:text-sm text-[#2D2520] group-hover:text-[#8C6F5A] transition-colors font-medium tracking-wide">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
