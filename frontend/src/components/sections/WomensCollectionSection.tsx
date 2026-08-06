import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';

import imgCrochetTop from '../../assets/Woman_wearing_crochet_jacket_2K_202608051414-Recovered.png';
import imgHandbag    from '../../assets/Woman_carrying_wool_handbag_2K_202607141446.jpeg';
import imgHandbag2   from '../../assets/Woman_holding_wool_handbag_2K_202607141448.jpeg';

const products = [
  {
    id: 'crochet-handbags',
    name: 'Crochet Handbags',
    craft: 'Hand-knotted · Artisan Cotton',
    image: imgHandbag,
    gridRole: 'featured',
  },
  {
    id: 'crochet-tops',
    name: 'Crochet Tops',
    craft: 'Open Weave · Breathable Craft',
    image: imgCrochetTop,
    gridRole: 'thumb',
  },
  {
    id: 'crochet-dresses',
    name: 'Crochet One-Piece Dresses',
    craft: 'Resort Wear · Full-length',
    image: imgHandbag2,
    gridRole: 'thumb',
  },
  {
    id: 'crochet-bikinis',
    name: 'Luxury Crochet Bikinis',
    craft: 'Beach Luxe · Studio Edition',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
    gridRole: 'list-only',
  },
];

const ArrowIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={`transition-transform duration-300 group-hover:translate-x-1 ${className}`}
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function WomensCollectionSection() {
  const featured = products[0];
  const gridThumbs = products.slice(1, 3);

  return (
    <section
      id="womens-collection"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#EDE8DF]"
    >
      <div className="max-w-7xl mx-auto">
        {/* DESKTOP LAYOUT (lg and above) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 lg:items-stretch">
          {/* Left: Asymmetric Image Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 grid-rows-2 gap-4 h-[640px]">
            {/* Featured */}
            <ScrollReveal direction="up" className="row-span-2 overflow-hidden group">
              <div className="relative h-full bg-[#d4cec5] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[#1C1C1B]/0 group-hover:bg-[#1C1C1B]/8 transition-all duration-400 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#1C1C1B]/65 to-transparent">
                  <p className="font-sans text-[8px] tracking-[0.28em] uppercase text-white/60 mb-1.5">
                    Signature Piece
                  </p>
                  <p className="font-serif text-white text-xl font-light leading-tight">
                    {featured.name}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Thumbnails */}
            {gridThumbs.map((item, i) => (
              <ScrollReveal
                key={item.id}
                direction="up"
                delay={0.1 + 0.1 * i}
                className="overflow-hidden group"
              >
                <div className="relative h-full bg-[#d4cec5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[#1C1C1B]/0 group-hover:bg-[#1C1C1B]/8 transition-all duration-400 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1C1C1B]/60 to-transparent">
                    <p className="font-serif text-white text-sm font-light leading-tight">
                      {item.name}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Right: Editorial Text Panel */}
          <ScrollReveal
            direction="left"
            className="lg:col-span-5 flex flex-col justify-between"
          >
            {/* Header meta row */}
            <div className="flex items-start justify-between mb-8">
              <p className="font-sans text-[10px] tracking-[0.32em] uppercase text-[#A34A38] font-semibold">
                Women's Collection
              </p>
              <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#1C1C1B]/30">
                Collection No. 02
              </span>
            </div>

            {/* Collection title */}
            <div className="mb-6">
              <h2 className="font-serif text-4xl lg:text-[48px] font-light text-[#1C1C1B] leading-[1.12] tracking-tight">
                Premium<br />
                Womenswear<br />
                <span className="text-amber-600 tracking-wider text-2xl lg:text-3xl font-sans inline-block mt-2">
                  ★★★★★
                </span>
              </h2>
            </div>

            {/* Thin ornament divider */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px bg-[#1C1C1B]/12" />
              <span className="font-sans text-[7px] tracking-[0.5em] text-[#1C1C1B]/25">◆ ◆</span>
              <div className="flex-1 h-px bg-[#1C1C1B]/12" />
            </div>

            {/* Description */}
            <p className="font-sans text-[13px] text-[#5a4a3f] leading-[1.75] mb-8">
              For the woman who lives between sun-drenched coastlines and intimate boutique
              galleries. Each piece is hand-crocheted by our studio weavers — a slow-fashion
              philosophy that values the hand that makes it as much as the woman who wears it.
            </p>

            {/* Product list */}
            <ul className="space-y-0 mb-8 border-t border-[#1C1C1B]/10">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3.5 border-b border-[#1C1C1B]/10 group/item cursor-default"
                >
                  <div>
                    <p className="font-serif text-[15px] font-light text-[#1C1C1B] leading-snug group-hover/item:text-[#A34A38] transition-colors duration-200">
                      {p.name}
                    </p>
                    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-neutral-400 mt-1">
                      {p.craft}
                    </p>
                  </div>
                  <ArrowIcon className="text-[#A34A38] opacity-0 group-hover/item:opacity-100 flex-shrink-0 ml-4" />
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              to="/shop?collection=womenswear"
              className="group inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.22em] uppercase text-[#1C1C1B] font-medium self-start"
            >
              <span className="relative py-1">
                Explore the Collection
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1C1C1B] transition-all duration-400 group-hover:w-full" />
              </span>
              <ArrowIcon />
            </Link>
          </ScrollReveal>
        </div>

        {/* MOBILE / TABLET LAYOUT */}
        <div className="lg:hidden">
          <ScrollReveal direction="up" className="mb-8">
            <p className="font-sans text-[10px] tracking-[0.32em] uppercase text-[#A34A38] font-semibold mb-2">
              Women's Collection · Collection No. 02
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1C1C1B] leading-tight mb-2">
              Premium Womenswear <span className="text-amber-600 text-xl font-sans inline-block">★★★★★</span>
            </h2>
            <div className="h-px bg-[#1C1C1B]/12 mb-4" />
            <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
              Hand-crocheted premium womenswear for the woman who values the art of slow
              fashion — from coastlines to cobblestone streets.
            </p>
          </ScrollReveal>

          {/* Featured hero image */}
          <ScrollReveal direction="up" className="mb-4">
            <div className="relative aspect-[3/4] overflow-hidden group bg-[#d4cec5]">
              <img
                src={featured.image}
                alt={featured.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B]/55 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4">
                <p className="font-sans text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1">
                  Signature Piece
                </p>
                <p className="font-serif text-white text-xl font-light">{featured.name}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Thumbnail 2-col grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {products.slice(1).map((item, i) => (
              <ScrollReveal key={item.id} direction="up" delay={0.07 * i}>
                <div className="relative aspect-square overflow-hidden group bg-[#d4cec5]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[#1C1C1B]/0 group-hover:bg-[#1C1C1B]/8 transition-all duration-400 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-serif text-white text-xs sm:text-sm font-light leading-tight">
                      {item.name}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile CTA */}
          <ScrollReveal direction="up">
            <Link
              to="/shop?collection=womenswear"
              className="group inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.22em] uppercase text-[#A34A38] no-underline border-b border-[#A34A38]/40 pb-0.5"
            >
              Explore the Collection
              <ArrowIcon />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
