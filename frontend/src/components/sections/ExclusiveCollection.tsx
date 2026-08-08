/**
 * ExclusiveCollection — VideoBanner
 *
 * PERFORMANCE FIX (Phase 6):
 * - The 2.78 MB video is NOT downloaded on initial page load.
 * - An IntersectionObserver watches the section; when it scrolls
 *   into the viewport the src is set on the <source> element and
 *   the video begins loading + playing automatically.
 * - preload="none" is the safety net if JS is slow.
 * - A warm linen colour placeholder fills the space before the
 *   video loads \u2014 matches the existing gradient treatment.
 *
 * DESIGN: No visual change. Same dimensions, overlay gradient,
 * positioning, controls, typography, and section height as before.
 */
import React, { useEffect, useRef } from 'react';
import promoVideo from '../../assets/An_artisanal_campaign_of_this.mp4';

export default function VideoBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const sourceRef = useRef<HTMLSourceElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video   = videoRef.current;
    const source  = sourceRef.current;
    if (!section || !video || !source) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Inject the src only when the section enters the viewport
          if (!source.src) {
            source.src = promoVideo;
            video.load();    // tell the browser to start loading
            video.play().catch(() => {/* autoplay blocked — muted so this rarely fails */});
          }
          observer.disconnect(); // only needed once
        }
      },
      { rootMargin: '200px' } // start loading 200px before it enters view
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full h-[55vh] md:h-[65vh] lg:h-[75vh] relative overflow-hidden bg-primary-container flex items-center justify-center"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* src is injected by IntersectionObserver above */}
        <source ref={sourceRef} type="video/mp4" />
      </video>
      {/* Bottom gradient transition to Dark Cocoa (#1e1812) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] md:h-[180px] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, #1e1812 0%, rgba(30, 24, 18, 0) 100%)'
        }}
      />
    </section>
  );
}