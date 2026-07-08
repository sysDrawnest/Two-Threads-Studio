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
    </section>
  );
}