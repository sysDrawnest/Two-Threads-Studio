/**
 * DynamicHero — CMS Phase 1 Hero Orchestrator
 *
 * Fetches the active hero template ID from the CMS API and renders
 * the corresponding template.
 *
 * PERFORMANCE FIX: Hero NEVER blocks on the CMS request.
 * - Template 1 is rendered immediately (no skeleton, no blank page).
 * - When the CMS query resolves, React swaps to the configured template
 *   seamlessly inside the existing Suspense boundary.
 * - On CMS error the default Template 1 stays visible.
 *
 * Template registry:
 *   1 → HeroTemplate1 — Original hero
 *   2 → HeroTemplate2 — Immersive Portrait
 *   3 → HeroTemplate3 — Editorial Cutout
 *   4 → HeroTemplate4 — The Editorial Window
 *
 * This component is the ONLY file in the hero chain that is aware of the CMS.
 * The individual templates are completely standalone components.
 */
import React, { lazy, Suspense } from 'react';
import { useHeroConfig } from '../../hooks/useCms';

// Each template is lazy-loaded so only the active one's JS is parsed.
// HeroTemplate1 is also pre-imported eagerly (not lazy) so it is ready
// instantly for the default render — no Suspense wait on first paint.
import HeroTemplate1Default from './HeroTemplate1';
const HeroTemplate2 = lazy(() => import('./HeroTemplate2'));
const HeroTemplate3 = lazy(() => import('./HeroTemplate3'));
const HeroTemplate4 = lazy(() => import('./HeroTemplate4'));

// Minimal inline skeleton only used as Suspense fallback while a
// *non-default* lazy template chunk is being downloaded.
const HeroSkeleton: React.FC = () => (
  <div
    className="w-full bg-[#ab5a46]"
    style={{ height: 'calc(100vh - 65px)', minHeight: '520px' }}
    aria-hidden="true"
  />
);

const LAZY_TEMPLATE_MAP: Record<number, React.LazyExoticComponent<() => React.JSX.Element>> = {
  2: HeroTemplate2,
  3: HeroTemplate3,
  4: HeroTemplate4,
};

export default function Hero() {
  const { data, isError } = useHeroConfig();

  // While loading or on error, always show Template 1 immediately —
  // no blank page, no skeleton, no waiting for the backend.
  const activeTemplate = (!isError && data?.data?.activeTemplate) ? data.data.activeTemplate : 1;

  // Template 1 is the default — render it eagerly (no Suspense needed).
  if (activeTemplate === 1) {
    return <HeroTemplate1Default />;
  }

  // Non-default templates are lazy-loaded; use Suspense with a plain
  // colour block that matches the hero background so there is no flash.
  const LazyTemplate = LAZY_TEMPLATE_MAP[activeTemplate] ?? null;
  if (!LazyTemplate) {
    // Safety net: unknown template ID → fall back to default
    return <HeroTemplate1Default />;
  }

  return (
    <Suspense fallback={<HeroSkeleton />}>
      <LazyTemplate />
    </Suspense>
  );
}