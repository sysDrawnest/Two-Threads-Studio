import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export interface EditorialItem {
  id: string;
  src: string;
  title: string;
  collection: string;
  medium: string;
  hours: number;
  productId: string | null;
}

export default function EditorialMasonry({ items }: { items: EditorialItem[] }) {
  return (
    <section className="py-24 bg-[#FAF9F7] px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {items.map((item, idx) => {
            // Create a natural rhythm by slightly varying padding and margins randomly, or just let masonry handle it.
            // We'll let masonry handle the flow, but ensure different image aspect ratios in the parent data.
            return (
              <ScrollReveal key={item.id} direction="up" delay={(idx % 4) * 0.1}>
                <div className="break-inside-avoid group relative cursor-pointer overflow-hidden bg-[#FAF9F7]">
                  <div className="relative w-full overflow-hidden">
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-auto object-cover transform transition-transform duration-[1500ms] ease-in-out group-hover:scale-[1.03] grayscale-[5%]"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Aesthetic Hover Overlay */}
                  <div className="absolute inset-0 bg-[#1C1C1B]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-between p-8 backdrop-blur-[2px]">
                    
                    {/* Top Right: Hours */}
                    <div className="flex justify-end">
                      <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/80 border border-white/20 px-3 py-1 rounded-full">
                        {item.hours} Hrs
                      </span>
                    </div>

                    {/* Bottom: Details */}
                    <div>
                      <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#C8A97E] mb-2">{item.collection}</p>
                      <h3 className="font-serif text-white text-2xl lg:text-3xl mb-4 font-light leading-snug">{item.title}</h3>
                      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/60 mb-6">{item.medium}</p>
                      
                      {item.productId ? (
                        <Link 
                          to={`/shop/${item.productId}`}
                          className="inline-block relative font-sans text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C8A97E] transition-colors pb-1 group/link"
                        >
                          View Collection Piece
                          <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-[#C8A97E] scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left duration-300"></span>
                        </Link>
                      ) : (
                        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 italic">Private Archive</span>
                      )}
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
