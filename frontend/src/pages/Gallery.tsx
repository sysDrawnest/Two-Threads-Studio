import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import galleryImg1 from '../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';
import galleryImg2 from '../assets/stitch/a_close_up_shot_of_a_cozy_organized_creative_workspace_for_embroidery_featuring.png';
import galleryImg3 from '../assets/stitch/a_detail_shot_of_embroidered_wildflowers_on_unbleached_linen_soft_pastels_and.png';
import galleryImg4 from '../assets/stitch/a_high_end_editorial_photo_of_a_finished_hand_embroidery_piece_on_unbleached.png';
import galleryImg5 from '../assets/stitch/an_artistic_flat_lay_of_embroidery_materials_linen_fabric_sharp_vintage.png';
import galleryImg6 from '../assets/stitch/close_up_of_a_person_s_hands_delicately_working_on_a_hoop_embroidery_project.png';
import galleryImg7 from '../assets/stitch/close_up_of_warm_toned_natural_flax_linen_fabric_and_embroidery_thread_soft.png';
import galleryImg8 from '../assets/stitch/community_gallery_twothreads_studio.png';

interface GalleryItem {
  src: string;
  productId: string | null;
  title: string;
  zoomScale: string;
  origin: string;
}

const Gallery: React.FC = () => {
  const galleryItems: GalleryItem[] = [
    { src: galleryImg3, productId: 'p7', title: "Wildflower Sanctuary Finished Hoop", zoomScale: "group-hover:scale-[2.5]", origin: "50% 50%" },
    { src: galleryImg1, productId: 'p1', title: "Meadow Floral Hoop Kit", zoomScale: "group-hover:scale-[2.2]", origin: "50% 30%" },
    { src: galleryImg4, productId: 'p8', title: "Midnight Forest Finished Hoop", zoomScale: "group-hover:scale-[2.4]", origin: "50% 60%" },
    { src: galleryImg2, productId: 'p3', title: "Cottage Garden Bundle", zoomScale: "group-hover:scale-[1.8]", origin: "50% 50%" },
    { src: galleryImg5, productId: null, title: "Artisan Materials Shelf", zoomScale: "group-hover:scale-[1.5]", origin: "50% 50%" },
    { src: galleryImg6, productId: 'p1', title: "Hands in Slow Motion", zoomScale: "group-hover:scale-[2.0]", origin: "40% 40%" },
    { src: galleryImg7, productId: 'p4', title: "Belgian Flax Linen", zoomScale: "group-hover:scale-[1.8]", origin: "50% 50%" },
    { src: galleryImg8, productId: null, title: "Guild Exhibit", zoomScale: "group-hover:scale-[1.5]", origin: "50% 50%" }
  ];

  return (
    <PageContainer>
      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="md:hidden pt-24 px-[20px] bg-[#fef8f3] text-[#1d1b19] min-h-screen pb-24">
        {/* Header Section */}
        <section className="mb-12">
          <span className="font-sans text-[12px] font-medium leading-none tracking-[0.2em] uppercase text-[#4e4540] block mb-4">COMMUNITY GALLERY</span>
          <h2 className="font-serif text-[32px] font-normal leading-[1.2] text-[#17110c] mb-6">Made by You.</h2>
          <p className="font-sans text-[16px] font-normal leading-[1.6] text-[#4e4540] mb-8 max-w-[90%]">
            Hover or tap to reveal the intricate macro stitch details and view the corresponding kits.
          </p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-full bg-[#17110c] py-4 px-6 transition-colors duration-300 active:bg-[#735947] flex justify-center items-center no-underline">
            <span className="font-sans text-[14px] font-medium leading-none tracking-[0.15em] text-[#ffffff] uppercase">FOLLOW OUR INSTAGRAM</span>
          </a>
        </section>

        {/* Divider */}
        <div className="w-full border-t border-dotted border-[#d1c4bd] mb-12"></div>

        {/* Editorial Gallery Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-[24px] items-start">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2 group">
              <div className="aspect-[4/5] overflow-hidden bg-[#f3ede8] relative">
                <img 
                  alt={item.title} 
                  className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${item.zoomScale}`} 
                  style={{ transformOrigin: item.origin }}
                  src={item.src} 
                />
                
                {/* Overlay with CTA */}
                <div className="absolute inset-0 bg-[#A34A38]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 backdrop-blur-[1px]">
                  <p className="font-serif text-white text-lg mb-3 leading-snug">{item.title}</p>
                  {item.productId ? (
                    <Link 
                      to={`/shop/${item.productId}`}
                      className="bg-white text-[#A34A38] text-center py-2.5 px-4 font-sans text-xs tracking-widest uppercase font-semibold no-underline hover:bg-neutral-100 transition-colors"
                    >
                      View Corresponding Kit
                    </Link>
                  ) : (
                    <span className="text-white/80 font-sans text-[10px] tracking-widest uppercase">Inspirational Piece</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Aesthetic Footer Text */}
        <section className="py-24 text-center">
          <p className="font-serif text-[28px] font-normal leading-[1.3] text-[#17110c] italic opacity-50">Slowly crafted.</p>
        </section>
      </div>

      {/* ---------------- DESKTOP VIEW ---------------- */}
      <div className="hidden md:block">
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
              A showcase of slow textile art. Hover over any piece to zoom in on the macro stitch textures and find its matching DIY layout.
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
            <div className="columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {galleryItems.map((item, idx) => (
                <div key={idx} className="break-inside-avoid group relative cursor-pointer overflow-hidden bg-surface-container border border-neutral-100 shadow-sm rounded-sm">
                  <div className="overflow-hidden relative w-full h-auto">
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className={`w-full h-auto object-cover transform transition-transform duration-[1200ms] ease-in-out ${item.zoomScale}`}
                      style={{ transformOrigin: item.origin }}
                    />
                  </div>
                  
                  {/* Aesthetic Hover Overlay */}
                  <div className="absolute inset-0 bg-[#A34A38]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                    <h3 className="font-serif text-white text-lg mb-2 leading-snug">{item.title}</h3>
                    <p className="font-sans text-white/80 text-[10px] tracking-widest uppercase mb-4">Slow Stitch Detail</p>
                    
                    {item.productId ? (
                      <Link 
                        to={`/shop/${item.productId}`}
                        className="bg-white text-[#A34A38] text-center py-3 font-sans text-[10px] tracking-widest uppercase font-semibold no-underline hover:bg-neutral-100 transition-colors shadow-md rounded-[1px]"
                      >
                        View Corresponding Kit
                      </Link>
                    ) : (
                      <div className="text-white/60 font-sans text-[10px] tracking-widest uppercase italic">Artisan Archive</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default Gallery;
