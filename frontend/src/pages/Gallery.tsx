import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Eye, Compass } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { Decoration } from '../components/ui/Decoration';

import galleryImg1 from '../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';
import galleryImg2 from '../assets/stitch/a_close_up_shot_of_a_cozy_organized_creative_workspace_for_embroidery_featuring.png';
import galleryImg3 from '../assets/stitch/a_detail_shot_of_embroidered_wildflowers_on_unbleached_linen_soft_pastels_and.png';
import galleryImg4 from '../assets/stitch/a_high_end_editorial_photo_of_a_finished_hand_embroidery_piece_on_unbleached.png';
import galleryImg5 from '../assets/stitch/an_artistic_flat_lay_of_embroidery_materials_linen_fabric_sharp_vintage.png';
import galleryImg6 from '../assets/stitch/close_up_of_a_person_s_hands_delicately_working_on_a_hoop_embroidery_project.png';
import galleryImg7 from '../assets/stitch/close_up_of_warm_toned_natural_flax_linen_fabric_and_embroidery_thread_soft.png';
import galleryImg8 from '../assets/stitch/community_gallery_twothreads_studio.png';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface GalleryItem {
  src: string;
  productId: string | null;
  title: string;
  category: string;
  zoomScale: string;
  origin: string;
  featured?: boolean;
}

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'kits' | 'archive'>('all');

  const galleryItems: GalleryItem[] = [
    { src: galleryImg3, productId: 'p7', title: "Wildflower Sanctuary Hoop", category: "Finished Piece", zoomScale: "group-hover:scale-110", origin: "50% 50%", featured: true },
    { src: galleryImg1, productId: 'p1', title: "Meadow Floral Hoop Kit", category: "DIY Kit", zoomScale: "group-hover:scale-110", origin: "50% 30%" },
    { src: galleryImg4, productId: 'p8', title: "Midnight Forest Hoop", category: "Finished Piece", zoomScale: "group-hover:scale-110", origin: "50% 60%" },
    { src: galleryImg2, productId: 'p3', title: "Cottage Garden Bundle", category: "Workshop & Kit", zoomScale: "group-hover:scale-110", origin: "50% 50%" },
    { src: galleryImg5, productId: null, title: "Artisan Materials Shelf", category: "Studio Process", zoomScale: "group-hover:scale-105", origin: "50% 50%" },
    { src: galleryImg6, productId: 'p1', title: "Hands in Slow Motion", category: "Craftsmanship", zoomScale: "group-hover:scale-110", origin: "40% 40%" },
    { src: galleryImg7, productId: 'p4', title: "Belgian Flax Linen Texture", category: "Materials", zoomScale: "group-hover:scale-105", origin: "50% 50%" },
    { src: galleryImg8, productId: null, title: "Guild Exhibit Archive", category: "Community", zoomScale: "group-hover:scale-105", origin: "50% 50%" }
  ];

  const filteredItems = galleryItems.filter(item => {
    if (filter === 'kits') return item.productId !== null;
    if (filter === 'archive') return item.productId === null;
    return true;
  });

  return (
    <PageContainer>
      <div className="bg-[#FAF9F7] text-[#1C1C1B] min-h-screen relative overflow-hidden">
        
        {/* Decorative Background Thread Accents */}
        <Decoration 
          variant="wave-long" 
          colorTheme="light-sand" 
          strokeWidth={2.5} 
          opacity={0.35} 
          position="absolute" 
          className="top-10 -left-20 w-[600px] h-[300px] pointer-events-none" 
        />
        <Decoration 
          variant="vine-thread" 
          colorTheme="warm-linen" 
          strokeWidth={1.5} 
          opacity={0.4} 
          position="absolute" 
          className="top-96 -right-10 w-48 h-96 pointer-events-none hidden lg:block" 
        />

        {/* ---------------- EDITORIAL HERO HEADER ---------------- */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-16 border-b border-[#1C1C1B]/10">
          <Decoration 
            variant="frame-top" 
            colorTheme="soft-gold" 
            strokeWidth={1.2} 
            opacity={0.5} 
            position="relative"
            className="w-full max-w-4xl mx-auto h-8 mb-4 pointer-events-none hidden sm:block" 
          />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <ScrollReveal direction="up">
              <div className="inline-flex items-center gap-3 mb-4">
                <Decoration variant="embroidery-knot" colorTheme="deep-bronze" strokeWidth={1.5} opacity={0.8} position="inline" className="w-6 h-6" />
                <span className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] font-semibold">
                  COMMUNITY EXHIBITION
                </span>
                <Decoration variant="embroidery-knot" colorTheme="deep-bronze" strokeWidth={1.5} opacity={0.8} position="inline" rotate={180} className="w-6 h-6" />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#1C1C1B] leading-[1.1] mb-6">
                Made by You.
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#5a4a3f] leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
                A curated archive of slow textile art created by our maker community. Hover or tap each piece to inspect macro stitch textures and discover corresponding DIY embroidery kits.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-[#1C1C1B] hover:text-[#A34A38] transition-colors py-2 border-b border-[#1C1C1B]/30 hover:border-[#A34A38]"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#A34A38]" />
                  <span>Share via #TwoThreadsStudio</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="max-w-xs mx-auto mt-12 relative h-4">
            <Decoration variant="divider-stitch" colorTheme="deep-bronze" strokeWidth={1.5} opacity={0.6} position="relative" className="w-full h-full" />
          </div>
        </section>

        {/* ---------------- FILTER & EXHIBITION BAR ---------------- */}
        <section className="py-8 px-6 md:px-16 border-b border-[#1C1C1B]/5 bg-[#FAF8F5]/60">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-sans text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#5a4a3f]">
              <Compass size={14} className="text-[#A34A38]" />
              <span>Curated Selection ({filteredItems.length} Artifacts)</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              {[
                { id: 'all', label: 'All Artifacts' },
                { id: 'kits', label: 'Matching Kits' },
                { id: 'archive', label: 'Inspirational Archive' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`font-sans text-[10px] sm:text-xs tracking-[0.15em] uppercase py-1 px-3 transition-colors border ${
                    filter === tab.id
                      ? 'border-[#1C1C1B] text-[#1C1C1B] bg-white shadow-xs'
                      : 'border-transparent text-[#5a4a3f]/70 hover:text-[#1C1C1B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- GALLERY GRID SECTION ---------------- */}
        <section className="py-16 md:py-24 px-6 md:px-16 relative">
          
          {/* Subtle Background Accent */}
          <Decoration 
            variant="leaf-thread" 
            colorTheme="warm-linen" 
            strokeWidth={1.8} 
            opacity={0.35} 
            position="absolute" 
            className="bottom-20 -left-12 w-64 h-64 pointer-events-none hidden md:block" 
          />

          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={filter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start"
              >
                {filteredItems.map((item, idx) => (
                  <ScrollReveal key={item.title} direction="up" delay={idx * 0.05}>
                    <div className="group relative bg-white border border-[#1C1C1B]/10 shadow-xs hover:shadow-md transition-shadow duration-500 overflow-hidden">
                      
                      {/* Image Frame Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF9F7]">
                        <img 
                          src={item.src} 
                          alt={item.title} 
                          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${item.zoomScale}`}
                          style={{ transformOrigin: item.origin }}
                          loading="lazy"
                        />
                        
                        {/* Soft Editorial Hover Overlay */}
                        <div className="absolute inset-0 bg-[#1C1C1B]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8 backdrop-blur-[2px]">
                          <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/70 mb-2 font-medium">
                            {item.category}
                          </span>
                          
                          <h3 className="font-serif text-xl sm:text-2xl text-white font-light mb-4 leading-snug">
                            {item.title}
                          </h3>

                          {item.productId ? (
                            <Link 
                              to={`/shop/${item.productId}`}
                              className="inline-flex items-center justify-between bg-white text-[#1C1C1B] px-4 py-3 font-sans text-[10px] tracking-[0.2em] uppercase font-semibold no-underline hover:bg-[#FAF9F7] transition-colors border border-white"
                            >
                              <span>View Corresponding Kit</span>
                              <ArrowRight size={14} className="text-[#A34A38]" />
                            </Link>
                          ) : (
                            <div className="inline-flex items-center gap-2 text-white/80 font-sans text-[10px] tracking-[0.2em] uppercase border-t border-white/20 pt-3">
                              <Sparkles size={12} className="text-[#C8A97E]" />
                              <span>Inspirational Archive Piece</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Detail */}
                      <div className="p-4 sm:p-5 flex items-center justify-between border-t border-[#1C1C1B]/5 bg-[#FAF9F7]">
                        <div>
                          <p className="font-serif text-sm text-[#1C1C1B] font-light">{item.title}</p>
                          <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-[#5a4a3f]/70 mt-0.5">{item.category}</p>
                        </div>
                        {item.productId ? (
                          <Link 
                            to={`/shop/${item.productId}`}
                            className="text-[#A34A38] hover:text-[#1C1C1B] transition-colors p-1"
                            title="Inspect Kit"
                          >
                            <Eye size={16} />
                          </Link>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]/60" />
                        )}
                      </div>

                      {/* Accent Stitched Corner for Featured Items */}
                      {item.featured && (
                        <Decoration 
                          variant="stitched-arrow" 
                          colorTheme="soft-gold" 
                          strokeWidth={1.2} 
                          opacity={0.5} 
                          position="top-right" 
                          className="w-12 h-12 top-2 right-2 pointer-events-none" 
                        />
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ---------------- INTERSTITIAL PHILOSOPHY BANNER ---------------- */}
        <section className="py-20 md:py-32 px-6 md:px-16 border-t border-b border-[#1C1C1B]/10 bg-[#FAF8F5] relative text-center">
          
          <Decoration 
            variant="cross-stitch-border" 
            colorTheme="warm-linen" 
            strokeWidth={1.5} 
            opacity={0.5} 
            position="absolute" 
            className="top-0 left-0 right-0 h-4 w-full pointer-events-none" 
          />

          <div className="max-w-2xl mx-auto relative z-10">
            <Decoration 
              variant="embroidery-knot" 
              colorTheme="deep-bronze" 
              strokeWidth={1.5} 
              opacity={0.7} 
              position="relative"
              className="w-10 h-10 mx-auto mb-6 pointer-events-none" 
            />

            <ScrollReveal direction="up">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B] italic leading-tight mb-6">
                "Every stitch is a moment of pause. Handcrafted, thread by thread."
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#5a4a3f] font-medium">
                The Two Threads Studio Philosophy
              </p>
            </ScrollReveal>
          </div>

          <Decoration 
            variant="cross-stitch-border" 
            colorTheme="warm-linen" 
            strokeWidth={1.5} 
            opacity={0.5} 
            position="absolute" 
            className="bottom-0 left-0 right-0 h-4 w-full pointer-events-none transform rotate-180" 
          />
        </section>

        {/* ---------------- COMMUNITY INVITATION FOOTER ---------------- */}
        <section className="py-20 md:py-28 px-6 md:px-16 text-center relative bg-[#FAF9F7]">
          <div className="max-w-xl mx-auto">
            <ScrollReveal direction="up">
              <div className="w-12 h-12 mx-auto mb-6 relative">
                <Decoration variant="needle" colorTheme="deep-bronze" strokeWidth={1.5} opacity={0.8} position="relative" className="w-full h-full" />
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1C1C1B] mb-4">
                Have You Finished a Creation?
              </h3>
              
              <p className="font-sans text-xs sm:text-sm text-[#5a4a3f] leading-relaxed mb-8">
                Tag your creations on Instagram with <span className="text-[#A34A38] font-medium">#TwoThreadsStudio</span> or send us a high-resolution photo to be featured in our official community exhibition archive.
              </p>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-[#1C1C1B] border border-[#1C1C1B]/30 px-8 py-3.5 hover:bg-[#1C1C1B] hover:text-white transition-all no-underline"
              >
                <span>Submit Your Creation</span>
                <ArrowRight size={14} />
              </a>
            </ScrollReveal>
          </div>
        </section>

      </div>
    </PageContainer>
  );
};

export default Gallery;

