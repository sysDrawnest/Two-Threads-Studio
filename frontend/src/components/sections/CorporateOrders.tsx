import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';
import { ArrowRight, Building2, Palette, Heart, Briefcase, Coffee, ShoppingBag } from 'lucide-react';

const clientTypes = [
  {
    icon: <Building2 size={22} strokeWidth={1.5} />,
    title: 'Hotels & Resorts',
    desc: 'Unique handcrafted decor for lobbies, suites, and wellness spaces.',
  },
  {
    icon: <Palette size={22} strokeWidth={1.5} />,
    title: 'Interior Designers',
    desc: 'Custom artisan pieces that elevate any residential or commercial project.',
  },
  {
    icon: <Heart size={22} strokeWidth={1.5} />,
    title: 'Wedding Planners',
    desc: 'Bespoke favors, centrepieces, and gifting for unforgettable celebrations.',
  },
  {
    icon: <Briefcase size={22} strokeWidth={1.5} />,
    title: 'Corporate Gifting',
    desc: 'Thoughtful branded or curated handmade gifts for every occasion.',
  },
  {
    icon: <Coffee size={22} strokeWidth={1.5} />,
    title: 'Cafés & Boutiques',
    desc: 'Artisan wall art and decor that creates a distinctive visual identity.',
  },
  {
    icon: <ShoppingBag size={22} strokeWidth={1.5} />,
    title: 'Retail & Boutiques',
    desc: 'Wholesale access to our full collection for curated retail environments.',
  },
];

export default function CorporateBulkOrders() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#2d2520]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <ScrollReveal direction="up" className="mb-10 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#c4973a] mb-2 font-medium">
                Crafted at Scale
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight">
                For Every Vision,<br className="hidden md:block" /> Every Occasion
              </h2>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#f4ebd9] text-[#1C1C1B] px-8 py-3.5 font-sans text-[10px] tracking-[0.18em] uppercase font-medium hover:bg-white transition-colors duration-200 no-underline"
              >
                Get a Custom Quote
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Client type grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {clientTypes.map((type, i) => (
            <ScrollReveal key={i} direction="up" delay={0.08 * i}>
              <div className="group border border-white/10 p-6 md:p-8 hover:border-[#c4973a]/50 hover:bg-white/5 transition-all duration-300 cursor-default">
                <div className="text-[#c4973a] mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                  {type.icon}
                </div>
                <h3 className="font-serif text-xl font-light text-white mb-2 leading-snug">
                  {type.title}
                </h3>
                <p className="font-sans text-xs text-white/55 leading-relaxed">
                  {type.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>

        {/* Bottom CTA strip */}
        <ScrollReveal direction="up" className="mt-10 md:mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-sm text-white/60 text-center sm:text-left">
              Minimum order from 10 pieces · Custom packaging available · Pan-India delivery
            </p>
            <Link
              to="/contact"
              className="flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase text-[#c4973a] hover:gap-3 transition-all duration-300 no-underline border-b border-[#c4973a]/40 pb-0.5 flex-shrink-0"
            >
              Learn More <ArrowRight size={12} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
