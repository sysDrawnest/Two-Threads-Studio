import React from 'react';
import PageContainer from '../components/layout/PageContainer';

const Gallery: React.FC = () => {
  const images = [
    "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620783770629-122b7f187703?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <PageContainer>
      {/* Header */}
      <section className="pt-24 pb-16 px-6 md:px-16 text-center bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
            Community Gallery
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-primary-container mb-6">
            Made by You.
          </h1>
          <p className="font-sans text-sm text-[#5a4a3f] leading-loose max-w-2xl mx-auto mb-10">
            A showcase of finished pieces, works-in-progress, and creative spaces from the TwoThreads community. Tag us on Instagram with #TwoThreadsStudio to be featured.
          </p>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-block bg-transparent text-primary-container border border-primary-container px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors no-underline"
          >
            Follow our Instagram
          </a>
        </div>
      </section>

      {/* Masonry-Style Gallery */}
      <section className="py-16 px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Grid */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {images.map((src, i) => (
              <div key={i} className={`flex flex-col gap-2 ${i % 2 !== 0 ? 'pt-8' : i > 1 ? '-mt-6' : ''}`}>
                <div className={`group relative cursor-pointer overflow-hidden bg-surface-container ${i % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[1/1]'}`}>
                  <img src={src} alt={`Community creation ${i + 1}`} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary-container/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f0eb" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Masonry */}
          <div className="hidden md:block columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((src, i) => (
              <div key={i} className="break-inside-avoid group relative cursor-pointer overflow-hidden bg-surface-container">
                <img 
                  src={src} 
                  alt={`Community creation ${i + 1}`} 
                  className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Aesthetic Hover Overlay */}
                <div className="absolute inset-0 bg-primary-container/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f5f0eb" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Gallery;
