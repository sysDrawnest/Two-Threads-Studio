import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { mockCategories } from '../../data/products';
import { ArrowRight } from 'lucide-react';

export default function ShopByCategory() {
  const [featured, ...rest] = mockCategories;
  const topRow = rest.slice(0, 3);
  const bottomRow = rest.slice(3, 6);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <ScrollReveal direction="up" className="text-center mb-10 md:mb-14">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-2 font-medium">
            Find Your Craft
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B]">
            Shop by Category
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 mt-3 max-w-lg mx-auto">
            From embroidery kits to macramé — every craft, thoughtfully curated.
          </p>
        </ScrollReveal>

        {/* Desktop Editorial Grid */}
        <div className="hidden md:grid grid-cols-12 gap-4 h-[640px]">
          {/* Featured — large left card */}
          <ScrollReveal direction="right" className="col-span-5 row-span-2">
            <CategoryCard category={featured} large />
          </ScrollReveal>

          {/* Top row — 3 smaller cards */}
          {topRow.map((cat, i) => (
            <ScrollReveal
              key={cat.id}
              direction="up"
              delay={0.1 * i}
              className="col-span-7 md:col-span-4 lg:col-span-3 xl:col-span-3 flex flex-col"
              style={{ gridColumn: `span 3` }}
            >
              <CategoryCard category={cat} className="h-full" />
            </ScrollReveal>
          ))}

          {/* Bottom row — 4 cards */}
          {bottomRow.map((cat, i) => (
            <ScrollReveal
              key={cat.id}
              direction="up"
              delay={0.1 + 0.1 * i}
              className="col-span-3"
            >
              <CategoryCard category={cat} className="h-full" />
            </ScrollReveal>
          ))}
          {/* Last category fills remaining space */}
          <ScrollReveal direction="up" delay={0.4} className="col-span-3">
            <CategoryCard category={mockCategories[7]} className="h-full" />
          </ScrollReveal>
        </div>

        {/* Mobile — 2-column grid */}
        <div className="grid md:hidden grid-cols-2 gap-3">
          {mockCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
              className={i === 0 ? 'col-span-2' : ''}
            >
              <CategoryCard category={cat} large={i === 0} />
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <ScrollReveal direction="up" className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#A34A38] hover:gap-3 transition-all duration-300 no-underline border-b border-[#A34A38]/40 pb-0.5"
          >
            View All Categories
            <ArrowRight size={13} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: (typeof mockCategories)[0];
  large?: boolean;
  className?: string;
}

function CategoryCard({ category, large = false, className = '' }: CategoryCardProps) {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className={`group relative block overflow-hidden bg-[#e8e1d9] no-underline ${
        large ? 'h-[380px] md:h-full' : 'h-[180px] md:h-full'
      } ${className}`}
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B]/75 via-[#1C1C1B]/10 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#d2c4bc] mb-1">
          {category.count} Products
        </p>
        <h3 className={`font-serif font-light text-white leading-tight ${large ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
          {category.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#d2c4bc]">
            Shop now
          </span>
          <ArrowRight size={10} className="text-[#d2c4bc]" />
        </div>
      </div>
    </Link>
  );
}
