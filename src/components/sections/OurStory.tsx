import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function OurStory() {
  return (
    <section id="our-story" className="py-24 px-6 md:px-16 bg-primary-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <ScrollReveal direction="left" className="relative">
          <img
            src="https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our Story - artisan at work"
            className="w-full h-[400px] md:h-[600px] object-cover object-center"
          />
          <div className="absolute -top-5 -left-5 w-full h-full border border-white/10 pointer-events-none" />
        </ScrollReveal>
        <div>
          <ScrollReveal direction="right" delay={0.15}>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
              Our Story
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.3}>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-inverse-on-surface leading-tight mb-7">
              TwoThreads celebrates the art of making.
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.45}>
            <p className="font-sans text-sm leading-loose text-inverse-on-surface/75 mb-5">
              We partner with makers across the world to bring you golden gut home settings, embroidery kits, and the best in precision crafting. Each piece is carefully woven with love, coming together in the details that matter to us.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.6}>
            <p className="font-sans text-sm leading-loose text-inverse-on-surface/75 mb-8">
              We are solely committed to the crafts that mean it all. These materials are biodegradable and gentle on the earth.
            </p>
            <button className="bg-on-secondary-container text-inverse-on-surface border-none px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-on-secondary-container outline-none">
              Learn More
            </button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
