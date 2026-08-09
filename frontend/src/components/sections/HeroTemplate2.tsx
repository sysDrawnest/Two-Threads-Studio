/**
 * HeroTemplate2 — The Immersive Portrait (Quiet Luxury & Tactile Artistry)
 *
 * Design Architecture:
 * - Radically minimal, immersive single visual statement celebrating textile artistry.
 * - Palette: Warm linen #F5F0EB, Stone #EDE6DE, Dark Espresso #2D2520, Rich Umber #1E1812, Warm Bronze #8B6F5C.
 * - Typography: Cormorant Garamond for grand editorial statements, DM Sans for refined subtle accents.
 * - Composition: One dominant visual statement with generous negative space, gentle ambient motion, and intuitive micro-interactions.
 * - Zero split cards, floating badges, or traditional e-commerce clutter.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// High-resolution tactile editorial photography showcasing raw linen, hand threadwork & architectural quiet luxury
const HERO_VISUAL_ASSET = "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=2400&q=90";

export default function HeroTemplate2() {
  return (
    <section className="relative w-full h-[calc(100vh-65px)] md:h-[calc(100vh-70px)] min-h-[620px] bg-[#1E1812] text-[#F5F0EB] overflow-hidden flex flex-col justify-end md:justify-center">
      
      {/* Dominant Immersive Background Asset */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.07, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          src={HERO_VISUAL_ASSET}
          alt="Two Threads Studio Tactile Textile Artistry"
          className="w-full h-full object-cover object-center md:object-[68%_40%] filter brightness-[0.78] contrast-[1.08] saturate-[0.92]"
        />
        
        {/* Soft Multi-stage Vignette & Atmospheric Radial Gradient overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(30, 24, 18, 0.75) 0%, rgba(30, 24, 18, 0.35) 50%, rgba(30, 24, 18, 0.6) 100%),
              linear-gradient(to top, #1E1812 0%, rgba(30, 24, 18, 0.4) 40%, rgba(30, 24, 18, 0.25) 100%)
            `
          }}
        />
      </div>

      {/* Hero Content — Strong Negative Space & Pure Typography Focus */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-0">
        <div className="max-w-2xl">
          
          {/* Subtle Studio Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-4 sm:mb-6"
          >
            <span className="h-[1px] w-8 bg-[#8B6F5C]/80" />
            <span className="font-sans text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#8B6F5C] font-medium">
              Two Threads Studio — Contemporary Craft
            </span>
          </motion.div>

          {/* Dominant Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight text-[#F5F0EB] mb-6 sm:mb-8"
          >
            Tactile Luxury, <br />
            <span className="italic font-extralight text-[#EDE6DE]/90">
              Quietly Woven.
            </span>
          </motion.h1>

          {/* Minimalist Subtext Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-xs sm:text-sm md:text-base text-[#EDE6DE]/80 font-light leading-relaxed max-w-lg mb-8 sm:mb-10"
          >
            Artisanal embroidery, heirloom crochet, macramé and Lippan art. Designed for modern living, crafted with poetic restraint.
          </motion.p>

          {/* Primary Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-8"
          >
            <Link
              to="/shop"
              className="group relative inline-flex items-center gap-4 px-7 py-3.5 bg-[#EDE6DE] text-[#2D2520] hover:bg-[#F5F0EB] transition-all duration-500 ease-out rounded-none shadow-sm hover:shadow-md"
            >
              <span className="font-sans text-xs tracking-[0.25em] uppercase font-medium">
                Explore The Atelier
              </span>
              <ArrowRight className="w-5 h-5 text-[#2D2520] transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Decorative Bottom Tactile Indicator (Quiet Elegance) */}
      <div className="absolute bottom-6 right-8 md:right-16 z-20 hidden md:flex items-center gap-4 text-[#EDE6DE]/40">
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase">
          01 / Atelier Edition
        </span>
      </div>

    </section>
  );
}
