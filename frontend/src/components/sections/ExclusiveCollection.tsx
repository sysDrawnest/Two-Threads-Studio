import React from 'react';
import promoVideo from '../../assets/An_artisanal_campaign_of_this.mp4';

export default function VideoBanner() {
  return (
    <section className="w-full h-[55vh] md:h-[65vh] lg:h-[75vh] relative overflow-hidden bg-primary-container flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={promoVideo} type="video/mp4" />
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