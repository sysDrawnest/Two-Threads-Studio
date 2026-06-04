import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import galleryImg1 from '../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';
import galleryImg2 from '../assets/stitch/a_close_up_shot_of_a_cozy_organized_creative_workspace_for_embroidery_featuring.png';
import galleryImg3 from '../assets/stitch/a_detail_shot_of_embroidered_wildflowers_on_unbleached_linen_soft_pastels_and.png';
import galleryImg4 from '../assets/stitch/a_high_end_editorial_photo_of_a_finished_hand_embroidery_piece_on_unbleached.png';
import galleryImg5 from '../assets/stitch/an_artistic_flat_lay_of_embroidery_materials_linen_fabric_sharp_vintage.png';
import galleryImg6 from '../assets/stitch/close_up_of_a_person_s_hands_delicately_working_on_a_hoop_embroidery_project.png';
import galleryImg7 from '../assets/stitch/close_up_of_warm_toned_natural_flax_linen_fabric_and_embroidery_thread_soft.png';
import galleryImg8 from '../assets/stitch/community_gallery_twothreads_studio.png';

const Gallery: React.FC = () => {
  const images = [
    galleryImg1,
    galleryImg2,
    galleryImg3,
    galleryImg4,
    galleryImg5,
    galleryImg6,
    galleryImg7,
    galleryImg8
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
