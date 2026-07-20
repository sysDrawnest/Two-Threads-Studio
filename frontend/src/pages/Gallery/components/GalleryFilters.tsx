import React from 'react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

const categories = ['All', 'Portraits', 'Wedding', 'Botanical', 'Home', 'Miniatures'];

interface GalleryFiltersProps {
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export default function GalleryFilters({ activeCategory, onSelect }: GalleryFiltersProps) {
  return (
    <section className="py-12 bg-[#FAF9F7] px-6 border-b border-[#1C1C1B]/5">
      <ScrollReveal direction="up">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="relative group font-sans text-[10px] tracking-[0.2em] uppercase text-[#1C1C1B]/80 hover:text-[#A34A38] transition-colors pb-2"
            >
              {cat}
              <span 
                className={`absolute left-0 right-0 bottom-0 h-[1px] bg-[#A34A38] transition-transform duration-500 origin-left ${
                  activeCategory === cat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
