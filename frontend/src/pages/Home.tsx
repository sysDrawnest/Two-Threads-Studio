import React, { Suspense, lazy } from 'react';
import PageContainer from '../components/layout/PageContainer';
import ViewportSection from '../components/ui/ViewportSection';
import {
  Hero,
  TrustBar,
  BestSellers,
} from '../components/sections';

// Tier 2 Priority Sections (Loaded immediately with Home)
const VideoBanner = lazy(() => import('../components/sections/ExclusiveCollection'));
const ShopByCategory = lazy(() => import('../components/sections/ShopByCategory'));

// Tier 3 & 4 Below-Fold Sections (Loaded viewport-lazily upon scroll approach)
const NewArrivalsSection = lazy(() => import('../components/sections/NewArrivalsSection'));
const FashionSplitEntrance = lazy(() => import('../components/sections/FashionSplitEntrance'));
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
        ════════════════════════════════════════════════════════════════════════
         HOMEPAGE LOADING ARCHITECTURE (TIERED PERFORMANCE MOUNTING)
        ════════════════════════════════════════════════════════════════════════
        TIER 1 (Immediate Above-Fold):
          1. Hero
          2. TrustBar

        TIER 2 (Priority Content - Immediate Render):
          3. BestSellers
          4. VideoBanner / ExclusiveCollection
          5. ShopByCategory

        TIER 3 & TIER 4 (Below-the-Fold - Viewport Proximity Deferred):
          6. NewArrivalsSection
          7. FashionSplitEntrance
          8. FeaturedCollections
          9. SacredTraditionsCollection
          10. ShopByOccasion
          11. SustainabilitySection
          12. CustomCreations
          13. OurStory
          14. CraftingProcess
          15. Reviews
          16. CommunityGallery
          17. Learning
          18. CorporateBulkOrders
        ════════════════════════════════════════════════════════════════════════
      */}

      {/* ─── TIER 1: Above Fold — Immediate Eager Rendering ─── */}
      <Hero />
      <TrustBar />

      {/* ─── TIER 2: Priority Homepage Content — Immediate Render ─── */}
      <BestSellers />

      <Suspense fallback={<SectionFallback />}>
        <VideoBanner />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ShopByCategory />
      </Suspense>

      {/* ─── TIER 3 & 4: Below-the-Fold Content — Viewport Deferred (600px rootMargin) ─── */}
      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <NewArrivalsSection />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={500} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <FashionSplitEntrance />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={500} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <FeaturedCollections />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <SacredTraditionsCollection />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <ShopByOccasion />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <SustainabilitySection />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <CustomCreations />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <OurStory />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <CraftingProcess />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <Reviews />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <CommunityGallery />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <Learning />
        </Suspense>
      </ViewportSection>

      <ViewportSection rootMargin="600px 0px" minHeight={400} fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <CorporateBulkOrders />
        </Suspense>
      </ViewportSection>
    </PageContainer>
  );
};

export default Home;
