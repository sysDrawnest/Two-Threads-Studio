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
const FeaturedCollections = lazy(() => import('../components/sections/FeaturedCollections'));
const VideoBanner = lazy(() => import('../components/sections/ExclusiveCollection'));
const SacredTraditionsCollection = lazy(() => import('../components/sections/SacredTraditionsCollection'));
const MensCollectionSection   = lazy(() => import('../components/sections/MensCollectionSection'));
const WomensCollectionSection = lazy(() => import('../components/sections/WomensCollectionSection'));
const NewArrivals             = lazy(() => import('../components/sections/NewArrivals'));
const CustomCreations = lazy(() => import('../components/sections/CustomCreations'));
const OurStory = lazy(() => import('../components/sections/OurStory'));
const CraftingProcess = lazy(() => import('../components/sections/CraftingProcess'));
const SustainabilitySection = lazy(() => import('../components/sections/SustainabilitySection'));
const Reviews = lazy(() => import('../components/sections/Reviews'));
const CommunityGallery = lazy(() => import('../components/sections/CommunityGallery'));
const Learning = lazy(() => import('../components/sections/Learning'));
const CorporateBulkOrders = lazy(() => import('../components/sections/CorporateOrders'));

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
        1.  Hero                    (KEEP)
        2.  TrustBar                (NEW)
        3.  BestSellers             (ENHANCED)
        4.  VideoBanner             (KEEP)
        5.  ShopByCategory          (NEW)
        6.  ShopByOccasion          (NEW)
        7.  FeaturedCollections     (NEW)
        8.  SacredTraditionsCollection (KEEP)
        9.  MensCollectionSection   (NEW — Men's Collection)
        10. WomensCollectionSection (NEW — Women's Collection)
        11. SustainabilitySection   (KEEP)
        12. CustomCreations         (NEW)
        13. OurStory/BrandStory     (REDUCED)
        14. CraftingProcess         (NEW)
        15. Reviews                 (ENHANCED)
        16. CommunityGallery        (NEW)
        17. Learning                (KEEP)
        18. CorporateBulkOrders     (NEW)
      */}

      {/* ─── Above fold — eagerly loaded ─── */}
      <Hero />
      <TrustBar />
      <BestSellers />

      <Suspense fallback={<SectionFallback />}>
        <VideoBanner />
      </Suspense>

      {/* ─── Below fold — lazily loaded ─── */}
      <Suspense fallback={<SectionFallback />}>
        <ShopByCategory />
      </Suspense>

      {/* Premium Clothing Collections */}
      <Suspense fallback={<SectionFallback />}>
        <WomensCollectionSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <MensCollectionSection />
      </Suspense>

      {/* Occasion Shopping moved below premium clothing sections */}
      <Suspense fallback={<SectionFallback />}>
        <ShopByOccasion />
      </Suspense>

      {/* New Arrivals — UI Reference Design Section */}
      <Suspense fallback={<SectionFallback />}>
        <NewArrivals />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <SustainabilitySection />
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
    </PageContainer>
  );
};

export default Home;
