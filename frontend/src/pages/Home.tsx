import React, { Suspense, lazy } from 'react';
import PageContainer from '../components/layout/PageContainer';
import {
  Hero,
  TrustBar,
  BestSellers,
} from '../components/sections';

// Lazy load all below-fold sections for performance
const ShopByCategory = lazy(() => import('../components/sections/ShopByCategory'));
const ShopByOccasion = lazy(() => import('../components/sections/ShopByOccasion'));
const ExploreByRoom = lazy(() => import('../components/sections/ExploreByRoom'));
const VideoBanner = lazy(() => import('../components/sections/VideoBanner'));
const Banner = lazy(() => import('../components/sections/Banner'));
const JustForYou = lazy(() => import('../components/sections/JustForYou'));
const CustomCreations = lazy(() => import('../components/sections/CustomCreations'));
const OurStory = lazy(() => import('../components/sections/OurStory'));
const CraftingProcess = lazy(() => import('../components/sections/CraftingProcess'));
const Reviews = lazy(() => import('../components/sections/Reviews'));
const CommunityGallery = lazy(() => import('../components/sections/CommunityGallery'));
const Learning = lazy(() => import('../components/sections/Learning'));
const CorporateBulkOrders = lazy(() => import('../components/sections/CorporateBulkOrders'));
const Newsletter = lazy(() => import('../components/sections/Newsletter'));

// Lightweight fallback skeleton for lazy-loaded sections
const SectionFallback = () => (
  <div className="w-full py-24 flex items-center justify-center bg-[#fef8f3]">
    <div className="flex gap-2">
      <span className="w-2 h-2 rounded-full bg-[#d2c4bc] animate-pulse" />
      <span className="w-2 h-2 rounded-full bg-[#d2c4bc] animate-pulse" style={{ animationDelay: '0.2s' }} />
      <span className="w-2 h-2 rounded-full bg-[#d2c4bc] animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  </div>
);

const Home: React.FC = () => {
  return (
    <PageContainer disablePadding={true}>
      {/*
        ════════════════════════════════════════
         HOMEPAGE SECTION ORDER — 17 Sections
        ════════════════════════════════════════
        1.  Hero                   (KEEP)
        2.  TrustBar               (NEW)
        3.  ShopByCategory         (NEW)
        4.  BestSellers            (ENHANCED)
        5.  ShopByOccasion         (NEW)
        6.  ExploreByRoom          (EXPANDED)
        7.  VideoBanner            (KEEP)
        8.  Banner/ArtisanGuild    (RENAMED)
        9.  JustForYou             (KEEP)
        10. CustomCreations        (NEW)
        11. OurStory/BrandStory    (REDUCED)
        12. CraftingProcess        (NEW)
        13. Reviews                (ENHANCED)
        14. CommunityGallery       (NEW)
        15. Learning               (KEEP)
        16. CorporateBulkOrders    (NEW)
        17. Newsletter             (ENHANCED)
      */}

      {/* ─── Above fold — eagerly loaded ─── */}
      <Hero />
      <TrustBar />
      <BestSellers />

      {/* ─── Below fold — lazily loaded ─── */}
      <Suspense fallback={<SectionFallback />}>
        <ShopByCategory />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ShopByOccasion />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ExploreByRoom />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <VideoBanner />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Banner />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <JustForYou />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CustomCreations />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <OurStory />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CraftingProcess />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Reviews />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CommunityGallery />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Learning />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CorporateBulkOrders />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Newsletter />
      </Suspense>
    </PageContainer>
  );
};

export default Home;
