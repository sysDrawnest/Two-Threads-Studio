import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { mockOccasions } from '../../data/products';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ShopByOccasion() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? amount : -amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#ede6de]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
        {/* Heading */}
        <ScrollReveal direction="up" className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-12 gap-4">
          <div>
            <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-2 font-medium">
              Find the Perfect Gift
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B]">
              Shop by Occasion
            </h2>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-9 h-9 border border-[#2d2520] flex items-center justify-center hover:bg-[#2d2520] hover:text-white transition-colors duration-200 text-[#2d2520]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-9 h-9 border border-[#2d2520] flex items-center justify-center hover:bg-[#2d2520] hover:text-white transition-colors duration-200 text-[#2d2520]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </ScrollReveal>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 px-4 sm:px-6 md:px-16 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mockOccasions.map((occ, i) => (
          <motion.div
            key={occ.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 snap-start w-[260px] sm:w-[300px]"
          >
            <Link
              to={`/shop?occasion=${occ.slug}`}
              className="group block no-underline"
            >
              {/* Image */}
              <div className="relative h-[300px] sm:h-[360px] overflow-hidden bg-[#d9d0c6]">
                <img
                  src={occ.image}
                  alt={occ.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B]/60 via-transparent to-transparent" />

                {/* Emoji icon */}
                <div className="absolute top-4 left-4 text-2xl">{occ.icon}</div>
              </div>

              {/* Content */}
              <div className="bg-white px-5 py-4 border border-neutral-100 border-t-0">
                <h3 className="font-serif text-xl font-light text-[#1C1C1B] mb-1 group-hover:text-[#A34A38] transition-colors duration-200">
                  {occ.name}
                </h3>
                <p className="font-sans text-xs text-neutral-500 leading-relaxed mb-3">
                  {occ.description}
                </p>
                <span className="inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.18em] uppercase text-[#A34A38] group-hover:gap-2.5 transition-all duration-200">
                  Shop Gifts <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
