import React, { Suspense, lazy } from 'react';
import PageContainer from '../components/layout/PageContainer';
import {
  Hero,
  BestSellers,
} from '../components/sections';

// Lazy load all below-fold sections for performance
const ShopByCategory = lazy(() => import('../components/sections/ShopByCategory'));
const VideoBanner = lazy(() => import('../components/sections/ExclusiveCollection'));
const CustomCreations = lazy(() => import('../components/sections/CustomCreations'));
const Reviews = lazy(() => import('../components/sections/Reviews'));
const Newsletter = lazy(() => import('../components/sections/Newsletter'));

// Lightweight fallback skeleton for lazy-loaded sections
const SectionFallback = () => (
  <div className="w-full py-24 flex items-center justify-center bg-[#FAF9F7]">
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

      {/* ─── Below fold — lazily loaded ─── */}
      <Suspense fallback={<SectionFallback />}>
        <ShopByCategory />
      </Suspense>

      <BestSellers />

      <Suspense fallback={<SectionFallback />}>
        <VideoBanner />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CustomCreations />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Reviews />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Newsletter />
      </Suspense>
    </PageContainer>
  );
};

export default Home;
