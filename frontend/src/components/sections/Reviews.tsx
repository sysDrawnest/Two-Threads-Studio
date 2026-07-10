import React from 'react';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';

export default function Reviews() {
  const reviews = [
    { name: "Akemi T.", review: "The quality of TwoThreads kits is unlike anything I've found elsewhere. The thread colors are so rich and the instructions are beautifully clear.", stars: 5 },
    { name: "Sarah M.", review: "I gifted the Botanical Set to my sister and she was moved to tears. Such thoughtful packaging and the design itself is stunning.", stars: 5 },
    { name: "Priya R.", review: "As a beginner I was nervous but the beginner bundle made it so accessible. Now I'm completely hooked on embroidery!", stars: 5 },
  ];

  return (
    <section id="patterns" className="py-24 px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Patterns & Reviews</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            What Our Makers Say
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <ScrollReveal key={i} direction="up">
              <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-outline-variant/30 h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {Array(r.stars).fill(0).map((_, j) => (
                      <span key={j} className="text-on-secondary-container text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-sans text-sm leading-loose text-[#5a4a3f] italic mb-5">
                    "{r.review}"
                  </p>
                </div>
                <p className="font-sans text-xs tracking-wider text-on-secondary-container uppercase">— {r.name}</p>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
