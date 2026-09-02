/**
 * HeroTemplate4 — "Crafting Mindful Heirlooms"
 *
 * Exact replication of the user-provided reference design:
 * - Left Panel (approx 37% width):
 *   - Background: Soft natural cream linen texture (#F7F5F0 / #FAF7F2)
 *   - Main Headline: "CRAFTING MINDFUL HEIRLOOMS" in elegant high-contrast serif (Cormorant Garamond), deep bronze espresso (#473429)
 *   - Subtitle: "Explore our quiet luxury collections of artisan embroidery, textiles, and slow-living DIY kits." in Cormorant Garamond italic, terracotta earth tone (#A15742)
 *   - CTA Button: Crisp rectangular "EXPLORE THE STUDIO" in rich terracotta (#AD5B43) with white uppercase typography
 * - Right Panel (approx 63% width):
 *   - High-resolution photograph of the botanical wildflower embroidery hoop, macramé tassel, embroidered linen handkerchief, open kraft craft kit box with wooden hoops, brass pouch, thread skeins, scissors, and terracotta tiles bathed in warm sunlight.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import heroPhotoImg from '../../assets/hero_crafting_heirlooms_photo.jpg';

export default function HeroTemplate4() {
  return (
    <section className="relative w-full bg-[#FAF7F2] text-[#473429] flex flex-col justify-center overflow-hidden">
      {/* ─── DESKTOP VIEW (Pixel-Perfect Dual Panel: Text Left + Photo Right) ─── */}
      <div className="hidden lg:flex w-full min-h-[calc(100vh-70px)] max-h-[840px] items-stretch relative overflow-hidden">
        
        {/* Left Column: Pure Clean Solid Linen (#FAF7F2), Typography & CTA Button */}
        <div className="w-[38%] xl:w-[36.8%] flex flex-col justify-center px-8 sm:px-12 lg:px-12 xl:px-16 2xl:px-20 py-12 lg:py-16 z-10 relative bg-[#FAF7F2] border-r border-[#E8E2D8]/70">
          <div className="relative z-10 max-w-[420px]">
            {/* Main Headline */}
            <h1 className="font-serif uppercase font-semibold text-[#473429] tracking-[0.04em] leading-[1.08] text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px] 2xl:text-[54px]">
              <span className="block">CRAFTING</span>
              <span className="block">MINDFUL</span>
              <span className="block">HEIRLOOMS</span>
            </h1>

            {/* Subtitle */}
            <p className="font-serif italic text-[#A15742] text-base sm:text-lg lg:text-[18px] xl:text-[21px] leading-snug mt-4 lg:mt-6 font-normal">
              Explore our quiet luxury collections of artisan embroidery, textiles, and slow-living DIY kits.
            </p>

            {/* Crisp Rectangular CTA Button */}
            <div className="mt-7 lg:mt-8">
              <Link
                to="/shop"
                className="inline-block bg-[#AD5B43] hover:bg-[#964a34] active:bg-[#823e2b] text-white font-sans text-xs tracking-[0.16em] uppercase px-7 py-3.5 font-semibold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer text-center"
              >
                EXPLORE THE STUDIO
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Artisan Flatlay Photograph */}
        <div className="w-[62%] xl:w-[63.2%] relative min-h-full overflow-hidden bg-[#E7DFC6]">
          <img
            src={heroPhotoImg}
            alt="Handcrafted botanical embroidery hoop, slow-living DIY craft kit, and embroidered textiles"
            className="w-full h-full object-cover object-left-center"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>
      </div>

      {/* ─── MOBILE & TABLET VIEW (Responsive Stacked Layout) ─── */}
      <div className="lg:hidden w-full flex flex-col">
        {/* Top: Flatlay Photography */}
        <div className="w-full relative aspect-[16/11] sm:aspect-[16/10] max-h-[460px] overflow-hidden bg-[#E7DFC6]">
          <img
            src={heroPhotoImg}
            alt="Handcrafted botanical embroidery hoop, slow-living DIY craft kit, and embroidered textiles"
            className="w-full h-full object-cover object-center"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>

        {/* Bottom: Typography & CTA Button */}
        <div className="relative px-6 py-10 sm:px-10 sm:py-12 flex flex-col justify-center bg-[#FAF7F2] border-t border-[#E8E2D8]/70">
          <div className="relative z-10 max-w-md">
            {/* Main Headline */}
            <h1 className="font-serif uppercase font-semibold text-[#473429] tracking-[0.04em] leading-[1.1] text-3xl sm:text-4xl">
              <span className="block">CRAFTING</span>
              <span className="block">MINDFUL</span>
              <span className="block">HEIRLOOMS</span>
            </h1>

            {/* Subtitle */}
            <p className="font-serif italic text-[#A15742] text-base sm:text-lg leading-snug mt-3.5 font-normal">
              Explore our quiet luxury collections of artisan embroidery, textiles, and slow-living DIY kits.
            </p>

            {/* CTA Button */}
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-block bg-[#AD5B43] hover:bg-[#964a34] active:bg-[#823e2b] text-white font-sans text-xs tracking-[0.16em] uppercase px-7 py-3.5 font-semibold transition-all duration-300 shadow-sm text-center"
              >
                EXPLORE THE STUDIO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
