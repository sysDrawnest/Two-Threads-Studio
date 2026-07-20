import React, { useState } from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Zap, BookOpen, Layers } from 'lucide-react';

const benefits = [
  { icon: <Zap size={12} />, label: 'Early Access' },
  { icon: <BookOpen size={12} />, label: 'Workshop Invites' },
  { icon: <Layers size={12} />, label: 'Exclusive Collections' },
];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 px-6 md:px-16 bg-primary-container text-center">
      <ScrollReveal direction="up">
        {/* Benefit pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {benefits.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-inverse-on-surface font-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5"
            >
              <span className="text-[#c4973a]">{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>

        <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
          Stay Connected
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-inverse-on-surface mb-4">
          Join 5,000+ Makers & Collectors
        </h2>
        <p className="font-sans text-sm text-inverse-on-surface/65 mb-10 max-w-lg mx-auto leading-loose">
          Get early access to new collections, invitations to live workshops, and exclusive member discounts — delivered with care.
        </p>

        {submitted ? (
          <div className="max-w-md mx-auto">
            <p className="font-serif text-xl text-inverse-on-surface mb-2">
              Welcome to the community ✦
            </p>
            <p className="font-sans text-xs text-inverse-on-surface/60">
              You'll receive your first letter soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row max-w-md mx-auto justify-center gap-3 md:gap-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
              required
              className="w-full md:flex-1 min-w-[200px] px-5 py-4 md:py-3.5 bg-inverse-on-surface/10 border border-inverse-on-surface/20 text-inverse-on-surface font-sans text-sm outline-none md:border-r-0 focus:border-on-secondary-container placeholder:text-inverse-on-surface/40"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-on-secondary-container text-inverse-on-surface border border-on-secondary-container px-8 py-4 md:py-3.5 font-sans text-sm tracking-wider uppercase cursor-pointer hover:opacity-90 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-on-secondary-container flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </ScrollReveal>
    </section>
  );
}
