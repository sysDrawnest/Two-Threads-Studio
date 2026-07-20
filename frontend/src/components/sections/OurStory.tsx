import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';

const stats = [
  { value: '500+', label: 'Happy Makers' },
  { value: '100%', label: 'Handmade' },
  { value: '4.9★', label: 'Avg. Rating' },
];

export default function OurStory() {
  return (
    <section id="our-story" className="py-16 md:py-24 px-6 md:px-16 bg-primary-container">
      <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <ScrollReveal direction="left" className="relative -mx-6 md:mx-0">
          <img
            src="https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our Story - artisan at work"
            className="w-full h-[400px] md:h-[600px] object-cover object-center"
            loading="lazy"
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
            <h2 className="font-serif text-3xl md:text-5xl font-light text-inverse-on-surface leading-tight mb-6">
              TwoThreads celebrates <br className="hidden md:block" />the art of making.
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.42}>
            <p className="font-sans text-sm leading-loose text-inverse-on-surface/75 mb-8">
              We partner with women artisans across India to bring heritage craft into modern homes — 
              one slow, intentional stitch at a time.
            </p>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="right" delay={0.54}>
            <div className="flex flex-wrap gap-6 md:gap-8 mb-8 border-t border-b border-white/10 py-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl md:text-3xl font-light text-inverse-on-surface">
                    {stat.value}
                  </p>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-on-secondary-container mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.65}>
            <Link
              to="/our-story"
              className="inline-flex items-center gap-2 font-sans text-sm tracking-[0.15em] uppercase text-inverse-on-surface/80 hover:text-inverse-on-surface transition-colors no-underline border-b border-white/30 hover:border-white/60 pb-0.5"
            >
              Read Our Full Story →
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
