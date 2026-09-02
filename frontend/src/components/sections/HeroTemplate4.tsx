/**
 * HeroTemplate4 — "Crafting Mindful Heirlooms"
 *
 * Pixel-perfect implementation of the user's approved quiet luxury artisan hero design:
 * - Layout: Split-screen desktop (Warm linen textured left column + Artisan flatlay right column)
 * - Typography: Bold serif uppercase headline ("CRAFTING MINDFUL HEIRLOOMS") & delicate italic subtitle
 * - Palette: Warm Linen (#F2EFEA), Espresso Charcoal (#422E23), Terracotta Clay (#B35C41 / #865C4C)
 * - CTA: Sleek rectangular terracotta button ("EXPLORE THE STUDIO")
 * - Imagery: High-resolution artisan flatlay featuring botanical embroidery, macramé, DIY kit box, and textiles
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroCraftImg from '../../assets/hero_heirloom_craft_2x.webp';
import heroCraftFallback from '../../assets/hero_heirloom_craft.webp';
import linenTexture from '../../assets/linen_seamless.webp';

export default function HeroTemplate4() {
  return (
    <section className="relative w-full bg-[#F2EFEA] overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row items-stretch min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] 2xl:min-h-[640px]">
        
        {/* ─── LEFT COLUMN: TYPOGRAPHY & CTA (Warm Textured Linen) ─── */}
        <div
          className="w-full lg:w-[38%] xl:w-[36%] flex flex-col justify-center px-6 sm:px-12 md:px-14 lg:px-10 xl:px-16 py-12 sm:py-16 lg:py-16 relative z-10 bg-[#F2EFEA]"
          style={{
            backgroundImage: `url(${linenTexture})`,
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="max-w-md mx-auto lg:mx-0 w-full flex flex-col items-start">
            
            {/* Main Headline */}
            <h1 className="font-serif text-[#422E23] tracking-[0.035em] uppercase leading-[1.08] select-none text-left">
              <span className="block text-4xl sm:text-5xl lg:text-[44px] xl:text-[54px] 2xl:text-[60px] font-normal">
                CRAFTING
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-[44px] xl:text-[54px] 2xl:text-[60px] font-normal mt-0.5 sm:mt-1">
                MINDFUL
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-[44px] xl:text-[54px] 2xl:text-[60px] font-normal mt-0.5 sm:mt-1">
                HEIRLOOMS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-serif italic text-base sm:text-lg lg:text-[18px] xl:text-[20px] 2xl:text-[21px] text-[#865C4C] leading-[1.38] font-normal mt-5 sm:mt-6 lg:mt-7 max-w-sm text-left">
              Explore our quiet luxury collections of artisan embroidery, textiles, and slow-living DIY kits.
            </p>

            {/* CTA Button */}
            <div className="mt-7 sm:mt-8 lg:mt-9">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-[#B35C41] hover:bg-[#9B4A31] active:bg-[#863D27] text-white px-7 sm:px-8 py-3.5 rounded-[1px] font-sans text-xs tracking-[0.16em] uppercase font-medium shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                EXPLORE THE STUDIO
              </Link>
            </div>

          </div>
        </div>

        {/* ─── RIGHT COLUMN: ARTISAN CRAFT PHOTOGRAPHY ─── */}
        <div className="w-full lg:w-[62%] xl:w-[64%] relative bg-[#EDE6DE] flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-full overflow-hidden">
          <picture className="w-full h-full block">
            <source srcSet={heroCraftImg} type="image/webp" />
            <img
              src={heroCraftFallback}
              alt="Crafting Mindful Heirlooms - Artisan botanical embroidery, macramé, and slow-living craft kits"
              className="w-full h-full object-cover object-center filter contrast-[1.01]"
              // @ts-ignore
              fetchpriority="high"
            />
          </picture>
        </div>

      </div>
    </section>
  );
}
