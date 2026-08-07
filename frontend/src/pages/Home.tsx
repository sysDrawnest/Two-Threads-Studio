import React, { Suspense, lazy } from 'react';
import PageContainer from '../components/layout/PageContainer';
import {
  Hero,
  TrustBar,
  BestSellers,
} from '../components/sections';

// Lazy load all below-fold sections for performance
const NewArrivals = lazy(() => import('../components/sections/NewArrivals'));
const ShopByCategory = lazy(() => import('../components/sections/ShopByCategory'));
const ShopByOccasion = lazy(() => import('../components/sections/ShopByOccasion'));
const FeaturedCollections = lazy(() => import('../components/sections/FeaturedCollections'));
const VideoBanner = lazy(() => import('../components/sections/ExclusiveCollection'));
const SacredTraditionsCollection = lazy(() => import('../components/sections/SacredTraditionsCollection'));
const MensCollectionSection   = lazy(() => import('../components/sections/MensCollectionSection'));
const WomensCollectionSection = lazy(() => import('../components/sections/WomensCollectionSection'));
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
      {/* ─── Above fold — eagerly loaded ─── */}
      <Hero />
      <TrustBar />
      <BestSellers />

      {/* ─── Below fold — lazily loaded in optimized order ─── */}
      {/* 1. New Arrivals */}
      <Suspense fallback={<SectionFallback />}>
        <NewArrivals />
      </Suspense>

      {/* 2. Premium Menswear Collection (Moved higher up) */}
      <Suspense fallback={<SectionFallback />}>
        <MensCollectionSection />
      </Suspense>

      {/* 3. Premium Womenswear Collection (Moved higher up) */}
      <Suspense fallback={<SectionFallback />}>
        <WomensCollectionSection />
      </Suspense>

      {/* 4. Video Showcase / Exclusive Collection */}
      <Suspense fallback={<SectionFallback />}>
        <VideoBanner />
      </Suspense>

      {/* 5. Sacred Traditions Collection */}
      <Suspense fallback={<SectionFallback />}>
        <SacredTraditionsCollection />
      </Suspense>

      {/* 6. Shop by Occasion (Moved below Sacred Traditions Collection) */}
      <Suspense fallback={<SectionFallback />}>
        <ShopByOccasion />
      </Suspense>

      {/* 7. Shop by Category (Featured Menswear & Womenswear) */}
      <Suspense fallback={<SectionFallback />}>
        <ShopByCategory />
      </Suspense>

      {/* 8. Featured Collections */}
      <Suspense fallback={<SectionFallback />}>
        <FeaturedCollections />
      </Suspense>

      {/* 9. Sustainability */}
      <Suspense fallback={<SectionFallback />}>
        <SustainabilitySection />
      </Suspense>

      {/* 10. Custom Bespoke Creations */}
      <Suspense fallback={<SectionFallback />}>
        <CustomCreations />
      </Suspense>

      {/* 11. Our Brand Story */}
      <Suspense fallback={<SectionFallback />}>
        <OurStory />
      </Suspense>

      {/* 12. Crafting Process */}
      <Suspense fallback={<SectionFallback />}>
        <CraftingProcess />
      </Suspense>

      {/* 13. Customer Reviews & Community */}
      <Suspense fallback={<SectionFallback />}>
        <Reviews />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CommunityGallery />
      </Suspense>

      {/* 14. Learning & Corporate Orders */}
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
