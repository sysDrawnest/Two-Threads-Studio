import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Star, BadgeCheck } from 'lucide-react';

const reviews = [
  {
    name: 'Akemi T.',
    initials: 'AT',
    review:
      "The quality of TwoThreads kits is unlike anything I've found elsewhere. The thread colors are so rich and the instructions are beautifully clear.",
    stars: 5,
    product: 'Meadow Floral Hoop Kit',
    verified: true,
    photo: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Sarah M.',
    initials: 'SM',
    review:
      'I gifted the Botanical Set to my sister and she was moved to tears. Such thoughtful packaging and the design itself is stunning.',
    stars: 5,
    product: 'Cottage Garden Bundle',
    verified: true,
    photo: 'https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Priya R.',
    initials: 'PR',
    review:
      "As a beginner I was nervous but the beginner bundle made it so accessible. Now I'm completely hooked on embroidery!",
    stars: 5,
    product: 'Pure Linen Starter Fabric',
    verified: true,
    photo: null,
  },
];

export default function Reviews() {
  return (
    <section id="patterns" className="py-16 md:py-24 px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">
            Community Love
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            What Our Makers Say
          </h2>
        </ScrollReveal>

        {/* Auto-scrolling Marquee */}
        <div className="relative overflow-hidden w-full -mx-6 md:mx-0 py-2">
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 0.75rem)); }
            }
            .animate-marquee {
              animation: scroll 25s linear infinite;
              /* On mobile, we might want to make it slightly faster */
            }
            @media (max-width: 768px) {
              .animate-marquee {
                animation-duration: 20s;
              }
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
            .animate-marquee:active {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="flex w-max animate-marquee gap-4 md:gap-6 pl-4 md:pl-0">
            {[...reviews, ...reviews].map((r, i) => (
              <div 
                key={i} 
                className="bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-outline-variant/30 flex flex-col justify-between w-[80vw] sm:w-[340px] md:w-[380px] flex-shrink-0"
              >
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array(r.stars).fill(0).map((_, j) => (
                      <Star key={j} size={13} className="fill-[#c4973a] text-[#c4973a]" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="font-sans text-sm leading-loose text-[#5a4a3f] italic mb-5">
                    "{r.review}"
                  </p>

                  {/* Customer photo */}
                  {r.photo && (
                    <div className="mb-4 overflow-hidden rounded-sm">
                      <img
                        src={r.photo}
                        alt={`Review by ${r.name}`}
                        loading="lazy"
                        className="w-full h-[140px] object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Author + Product + Verified */}
                <div className="border-t border-outline-variant/20 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Initials avatar */}
                      <div className="w-8 h-8 rounded-full bg-[#f4ebd9] flex items-center justify-center flex-shrink-0">
                        <span className="font-sans text-[10px] font-semibold text-[#A34A38]">
                          {r.initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-semibold text-[#1C1C1B]">{r.name}</p>
                        <p className="font-sans text-[10px] text-neutral-400">{r.product}</p>
                      </div>
                    </div>
                    {r.verified && (
                      <div className="flex items-center gap-1 text-[#2d5a27]">
                        <BadgeCheck size={13} />
                        <span className="font-sans text-[9px] tracking-wider uppercase">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
