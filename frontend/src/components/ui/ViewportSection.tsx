import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface ViewportSectionProps {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string | number;
  className?: string;
  fallback?: ReactNode;
}

/**
 * ViewportSection
 *
 * Viewport-based lazy mounting wrapper using browser IntersectionObserver.
 * Defers rendering of below-the-fold components and their underlying JavaScript bundle downloads
 * until the section approaches the viewport (default: 600px rootMargin).
 *
 * Key guarantees:
 *  1. Once activated, remains mounted permanently (never unmounts on scroll away).
 *  2. Disconnects observer immediately after activation.
 *  3. Preserves container geometry to prevent Cumulative Layout Shift (CLS).
 */
export const ViewportSection: React.FC<ViewportSectionProps> = ({
  children,
  rootMargin = '600px 0px',
  minHeight,
  className = '',
  fallback = null,
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already activated, no need to observe
    if (isActivated) return;

    // Fallback for SSR or environments without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsActivated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsActivated(true);
          observer.disconnect();
        }
      },
      {
        root: null, // Viewport
        rootMargin,
        threshold: 0,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [isActivated, rootMargin]);

  const style: React.CSSProperties = minHeight
    ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }
    : {};

  return (
    <div ref={containerRef} className={className} style={style}>
      {isActivated ? children : fallback}
    </div>
  );
};

export default ViewportSection;
