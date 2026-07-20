import React, { useState, useMemo } from 'react';
import PageContainer from '../components/layout/PageContainer';

import galleryImg1 from '../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';
import galleryImg2 from '../assets/stitch/a_close_up_shot_of_a_cozy_organized_creative_workspace_for_embroidery_featuring.png';
import galleryImg3 from '../assets/stitch/a_detail_shot_of_embroidered_wildflowers_on_unbleached_linen_soft_pastels_and.png';
import galleryImg4 from '../assets/stitch/a_high_end_editorial_photo_of_a_finished_hand_embroidery_piece_on_unbleached.png';
import galleryImg5 from '../assets/stitch/an_artistic_flat_lay_of_embroidery_materials_linen_fabric_sharp_vintage.png';
import galleryImg6 from '../assets/stitch/close_up_of_a_person_s_hands_delicately_working_on_a_hoop_embroidery_project.png';
import galleryImg7 from '../assets/stitch/close_up_of_warm_toned_natural_flax_linen_fabric_and_embroidery_thread_soft.png';
import galleryImg8 from '../assets/stitch/community_gallery_twothreads_studio.png';

import GalleryHero from './Gallery/components/GalleryHero';
import GalleryFilters from './Gallery/components/GalleryFilters';
import FeaturedMasterpiece from './Gallery/components/FeaturedMasterpiece';
import EditorialMasonry, { EditorialItem } from './Gallery/components/EditorialMasonry';
import StoryQuote from './Gallery/components/StoryQuote';
import ProcessExhibition from './Gallery/components/ProcessExhibition';
import GalleryCTA from './Gallery/components/GalleryCTA';

const ALL_ITEMS: EditorialItem[] = [
  { id: '1', src: galleryImg3, title: "Wildflower Sanctuary", collection: "Botanical", medium: "Cotton & Linen", hours: 45, productId: 'p7' },
  { id: '2', src: galleryImg1, title: "Meadow Floral Hoop", collection: "Botanical", medium: "Mixed Thread", hours: 30, productId: 'p1' },
  { id: '3', src: galleryImg4, title: "Midnight Forest", collection: "Nature", medium: "Silk & Cotton", hours: 80, productId: 'p8' },
  { id: '4', src: galleryImg2, title: "Cottage Garden", collection: "Home", medium: "Linen Base", hours: 25, productId: 'p3' },
  { id: '5', src: galleryImg5, title: "Artisan Materials", collection: "Miniatures", medium: "Raw Materials", hours: 10, productId: null },
  { id: '6', src: galleryImg6, title: "Hands in Slow Motion", collection: "Portraits", medium: "Photography", hours: 5, productId: 'p1' },
  { id: '7', src: galleryImg7, title: "Belgian Flax", collection: "Home", medium: "Raw Textile", hours: 12, productId: 'p4' },
  { id: '8', src: galleryImg8, title: "Guild Exhibit", collection: "Wedding", medium: "Event Archival", hours: 150, productId: null }
];

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return ALL_ITEMS;
    return ALL_ITEMS.filter(item => item.collection === activeCategory);
  }, [activeCategory]);

  return (
    <PageContainer>
      <div className="bg-[#FAF9F7] text-[#1C1C1B] min-h-screen">
        
        {/* 1. Full-bleed editorial hero */}
        <GalleryHero />

        {/* 2. Featured Masterpiece (museum exhibit style) */}
        <FeaturedMasterpiece />

        {/* 3. Minimal text-based filters */}
        <GalleryFilters activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* 4. Natural Rhythm Masonry Gallery */}
        <EditorialMasonry items={filteredItems} />

        {/* 5. Editorial Story Break */}
        <StoryQuote />

        {/* 6. Process Exhibition (4 stages) */}
        <ProcessExhibition />

        {/* 7. Minimal CTA Footer */}
        <GalleryCTA />

      </div>
    </PageContainer>
  );
};

export default Gallery;
