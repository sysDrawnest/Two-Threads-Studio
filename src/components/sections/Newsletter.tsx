import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function Newsletter() {
  return (
    <section className="py-20 px-6 md:px-16 bg-primary-container text-center">
      <ScrollReveal direction="up">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
          Stay Connected
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-inverse-on-surface mb-4">
          Join the TwoThreads Community
        </h2>
        <p className="font-sans text-sm text-inverse-on-surface/65 mb-10 max-w-lg mx-auto leading-loose">
          Get early access to new patterns, tutorial releases, and exclusive member discounts.
        </p>
        <div className="flex max-w-md mx-auto justify-center">
          <input 
            type="email" 
            placeholder="Your email address" 
            aria-label="Your email address"
            className="flex-1 min-w-[200px] px-5 py-3.5 bg-inverse-on-surface/10 border border-inverse-on-surface/20 text-inverse-on-surface font-sans text-sm outline-none border-r-0 focus:border-on-secondary-container"
          />
          <button className="bg-on-secondary-container text-inverse-on-surface border border-on-secondary-container px-8 py-3.5 font-sans text-sm tracking-wider uppercase cursor-pointer hover:opacity-90 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-on-secondary-container">
            Subscribe
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
