/**
 * DynamicHero — CMS Phase 1 Hero Orchestrator
 *
 * Fetches the active hero template ID from the CMS API and renders
 * the corresponding template. Falls back to Template 1 (original) on
 * any loading or error state so the storefront is never blank.
 *
 * Template registry:
 *   1 → HeroTemplate1 — Original hero (unchanged)
 *   2 → HeroTemplate2 — Full-screen editorial slideshow
 *   3 → HeroTemplate3 — Split editorial / product spotlight
 *
 * This component is the ONLY file in the hero chain that is aware of the CMS.
 * The individual templates are completely standalone components.
 */
import React, { lazy, Suspense } from 'react';
import { useHeroConfig } from '../../hooks/useCms';

// Each template is lazy-loaded so only the active one's JS is parsed
const HeroTemplate1 = lazy(() => import('./HeroTemplate1'));
const HeroTemplate2 = lazy(() => import('./HeroTemplate2'));
const HeroTemplate3 = lazy(() => import('./HeroTemplate3'));

// Matches the hero height to avoid layout shift while loading
const HeroSkeleton: React.FC = () => (
  <div
    className="w-full bg-[#ab5a46] animate-pulse"
    style={{ height: 'calc(100vh - 65px)', minHeight: '520px' }}
    aria-hidden="true"
  />
);

const TEMPLATE_MAP: Record<number, React.LazyExoticComponent<() => React.JSX.Element>> = {
  1: HeroTemplate1,
  2: HeroTemplate2,
  3: HeroTemplate3,
};

export default function Hero() {
  const { data, isLoading, isError } = useHeroConfig();

  // Resolve active template — default to 1 if loading, errored, or out-of-range
  const activeTemplate = data?.data?.activeTemplate ?? 1;
  const ActiveTemplate = TEMPLATE_MAP[activeTemplate] ?? HeroTemplate1;

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (isError) {
    // Graceful degradation: show the original hero even if CMS is unreachable
    return (
      <Suspense fallback={<HeroSkeleton />}>
        <HeroTemplate1 />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<HeroSkeleton />}>
      <ActiveTemplate />
    </Suspense>
  );
}