import React from 'react';
import { MagneticCTA } from '../ui/LuxuryAnimations';

export const AtelierJournal: React.FC = () => {
  const articles = [
    {
      id: 1,
      tag: "Volume I: The Provenance of Silk",
      title: "Tracing the Silk Road",
      image: "/assets/Rectangle%201028.png",
      href: "/journal/silk-road"
    },
    {
      id: 2,
      tag: "Volume II: Structural Integrity",
      title: "The Architecture of the Stitch",
      image: "/assets/Rectangle%201029.png",
      href: "/journal/stitch-architecture"
    },
    {
      id: 3,
      tag: "Volume III: Color Theory",
      title: "Dyeing with Natural Botanicals",
      image: "/assets/Rectangle%201030.png",
      href: "/journal/natural-botanicals"
    }
  ];

  return (
    <section className="w-full bg-[#F9F5EE] py-24 md:py-32 px-4 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-4 block">
              Editorial
            </span>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-primary-container">
              The Atelier Journal
            </h2>
          </div>
          <MagneticCTA href="/journal">
            View All Volumes
          </MagneticCTA>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {articles.map((article) => (
            <a href={article.href} key={article.id} className="group block cursor-pointer no-underline">
              <div className="w-full aspect-[4/5] overflow-hidden mb-6 relative bg-surface-container">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <span className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-3">
                {article.tag}
              </span>
              <h3 className="font-serif text-2xl text-primary-container leading-snug">
                {article.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
