import React, { Suspense, lazy } from 'react';
import PageContainer from '../components/layout/PageContainer';
import {
  Hero,
  TrustBar,
  BestSellers,
} from '../components/sections';

// Lazy load below-fold sections for optimal initial page load performance
const VideoBanner = lazy(() => import('../components/sections/ExclusiveCollection'));
const ShopByCategory = lazy(() => import('../components/sections/ShopByCategory'));
const NewArrivalsSection = lazy(() => import('../components/sections/NewArrivalsSection'));
const WomensCollectionSection = lazy(() => import('../components/sections/WomensCollectionSection'));
const MensCollectionSection   = lazy(() => import('../components/sections/MensCollectionSection'));
const FeaturedCollections = lazy(() => import('../components/sections/FeaturedCollections'));
const SacredTraditionsCollection = lazy(() => import('../components/sections/SacredTraditionsCollection'));
const ShopByOccasion = lazy(() => import('../components/sections/ShopByOccasion'));
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
         HOMEPAGE SECTION ORDER (FINAL)
        ════════════════════════════════════════
        1.  Hero                     (Eagerly Loaded)
        2.  TrustBar                 (Eagerly Loaded)
        3.  BestSellers              (Eagerly Loaded)
        4.  VideoBanner              (Lazy Loaded)
        5.  ShopByCategory           (Lazy Loaded — Updated Categories)
        6.  NewArrivalsSection       (Lazy Loaded — New Arrivals)
        7.  WomensCollectionSection  (Lazy Loaded — Premium Womenswear Collection)
        8.  MensCollectionSection    (Lazy Loaded — Premium Menswear Collection)
        9.  FeaturedCollections      (Lazy Loaded)
        10. SacredTraditionsCollection (Lazy Loaded)
        11. ShopByOccasion           (Lazy Loaded — Moved below Sacred Traditions)
        12. SustainabilitySection    (Lazy Loaded)
        13. CustomCreations          (Lazy Loaded)
        14. OurStory                 (Lazy Loaded)
        15. CraftingProcess          (Lazy Loaded)
        16. Reviews                  (Lazy Loaded)
        17. CommunityGallery         (Lazy Loaded)
        18. Learning                 (Lazy Loaded)
        19. CorporateBulkOrders      (Lazy Loaded)
      */}

      {/* ─── Above fold — eagerly loaded ─── */}
      <Hero />
      <TrustBar />
      <BestSellers />

      {/* ─── Below fold — lazily loaded ─── */}
      <Suspense fallback={<SectionFallback />}>
        <VideoBanner />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ShopByCategory />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <NewArrivalsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <WomensCollectionSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <MensCollectionSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FeaturedCollections />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <SacredTraditionsCollection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ShopByOccasion />
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
