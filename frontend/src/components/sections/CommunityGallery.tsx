import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Inline Instagram icon (not available in lucide-react v1.23)
const InstagramIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Using local stitch assets + lifestyle images for the UGC grid
const galleryItems = [
  {
    id: 'g1',
    image: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=600&auto=format&fit=crop',
    user: '@priya.stitches',
    product: 'Meadow Floral Kit',
    tall: true,
  },
  {
    id: 'g2',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
    user: '@craft.with.neha',
    product: 'Boho Macramé Hanging',
    tall: false,
  },
  {
    id: 'g3',
    image: 'https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=600&auto=format&fit=crop',
    user: '@threads.and.tea',
    product: 'Cottage Garden Bundle',
    tall: false,
  },
  {
    id: 'g4',
    image: 'https://images.unsplash.com/photo-1617896848219-aab8a02eed8c?q=80&w=600&auto=format&fit=crop',
    user: '@handmade.meera',
    product: 'Crochet Flower Bunch',
    tall: true,
  },
  {
    id: 'g5',
    image: 'https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=600&auto=format&fit=crop',
    user: '@slowcraft.life',
    product: 'Wildflower Hoop',
    tall: false,
  },
  {
    id: 'g6',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
    user: '@gifted.by.aanya',
    product: 'Festival Gift Box',
    tall: false,
  },
];

export default function CommunityGallery() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <ScrollReveal direction="up" className="text-center mb-10 md:mb-14">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-2 font-medium">
            Our Community
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B] mb-3">
            Styled by You
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-4">
            Tag your creations with{' '}
            <span className="text-[#A34A38] font-medium">#TwoThreadsStudio</span> to be featured here.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em] uppercase text-[#735947] hover:text-[#A34A38] transition-colors no-underline"
          >
            <InstagramIcon size={13} />
            @TwoThreadsStudio
          </a>
        </ScrollReveal>

        {/* Desktop masonry-style grid */}
        <div className="hidden sm:grid grid-cols-3 gap-3 md:gap-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className={item.tall ? 'row-span-2' : ''}
            >
              <GalleryTile item={item} tall={item.tall} />
            </motion.div>
          ))}
        </div>

        {/* Mobile 2-col grid */}
        <div className="grid sm:hidden grid-cols-2 gap-2.5">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.06 * i }}
            >
              <GalleryTile item={item} tall={false} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal direction="up" className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#A34A38] hover:gap-3 transition-all duration-300 no-underline border-b border-[#A34A38]/40 pb-0.5"
          >
            View Instagram Feed
            <ArrowRight size={13} />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

function GalleryTile({ item, tall }: { item: (typeof galleryItems)[0]; tall: boolean }) {
  return (
    <div
      className={`group relative overflow-hidden bg-[#e8e1d9] ${tall ? 'h-[480px] md:h-[600px]' : 'h-[220px] md:h-[280px]'}`}
    >
      <img
        src={item.image}
        alt={`Community creation by ${item.user}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#1C1C1B]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#d2c4bc]">
          {item.user}
        </span>
        <p className="font-serif text-sm text-white leading-tight">{item.product}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 font-sans text-[9px] tracking-[0.18em] uppercase text-white border border-white/40 px-3 py-1.5 hover:bg-white/10 transition-colors cursor-pointer">
          Shop this look <ArrowRight size={9} />
        </span>
      </div>

      {/* Instagram icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <InstagramIcon size={14} className="text-white drop-shadow-md" />
      </div>
    </div>
  );
}
