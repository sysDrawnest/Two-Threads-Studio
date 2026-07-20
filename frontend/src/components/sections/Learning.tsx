import React from 'react';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';

export default function Learning() {
  const tutorials = [
    { title: "French Knots for Beginners", duration: "12 min", level: "Beginner", thumbnail: "#c4b5a8", instructor: "Maya Chen" },
    { title: "Satin Stitch Petals", duration: "18 min", level: "Beginner", thumbnail: "#b5a898", instructor: "Lena Park" },
    { title: "Geometric Grid Patterns", duration: "25 min", level: "Intermediate", thumbnail: "#a89888", instructor: "Rosa Kim" },
  ];

  return (
    <section id="learning" className="py-16 md:py-24 px-6 md:px-16 bg-[#ede6de]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-4">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Learning Studio</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            Embroidery Design Tutorials
          </h2>
          <p className="font-sans text-sm text-[#5a4a3f] max-w-2xl mx-auto leading-loose mt-4">
            Learn at your own pace with our curated video tutorials — from first stitches to advanced techniques.
          </p>
        </ScrollReveal>

        <StaggerContainer className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-14 pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
          {tutorials.map((t, i) => (
            <ScrollReveal key={i} direction="up">
              <div className="bg-white cursor-pointer shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 w-[85vw] flex-shrink-0 snap-center md:w-auto">
                <div className="h-48 relative overflow-hidden" style={{ backgroundColor: t.thumbnail }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-inverse-on-surface/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#2d2520"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-primary-container/85 text-inverse-on-surface font-sans text-[10px] px-2 py-1">
                    {t.duration}
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-3">
                    <span className="bg-[#e8f4e8] text-[#3a6b3a] text-[10px] tracking-wider px-2 py-1 uppercase font-sans">
                      {t.level}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-normal text-primary-container mb-1 leading-snug">
                    {t.title}
                  </h3>
                  <p className="font-sans text-xs text-on-secondary-container">with {t.instructor}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
