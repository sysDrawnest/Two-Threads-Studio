import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer } from '../components/ui/ScrollReveal';

const Sustainability: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero */}
      <section className="bg-[#5a4a3f] text-[#f5f0eb] pt-24 pb-32 px-6 md:px-16 text-center">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0.15}>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#d4c4b5] mb-6">
              Our Impact
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <h1 className="font-serif text-4xl md:text-6xl font-light mb-8">
              Earth-First Embroidery.
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.45}>
            <p className="font-sans text-base leading-loose max-w-2xl mx-auto opacity-80">
              We believe that crafting should leave a mark on your soul, not on the planet. From our fibers to our packaging, every decision is weighed against its environmental footprint.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Materials Focus */}
      <section className="py-24 px-6 md:px-16 bg-background -mt-16 mx-4 md:mx-16 relative z-10 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container">
              The Materials That Matter
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <h3 className="font-serif text-2xl text-primary-container mb-4">Unbleached Belgian Linen</h3>
              <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-6">
                Flax requires significantly less water and pesticides than cotton. We source our linen from a carbon-neutral mill in Belgium that has been weaving for five generations. We leave it unbleached to avoid introducing harsh chemicals into local watersheds.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="right" className="order-1 md:order-2 aspect-[4/3] bg-surface-container overflow-hidden">
              <img src="https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=800&auto=format&fit=crop" alt="Linen fabric" className="w-full h-full object-cover" />
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
            <ScrollReveal direction="left" className="aspect-[4/3] bg-surface-container overflow-hidden">
              <img src="https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800&auto=format&fit=crop" alt="Wooden hoops" className="w-full h-full object-cover" />
            </ScrollReveal>
            <ScrollReveal direction="right">
              <h3 className="font-serif text-2xl text-primary-container mb-4">FSC-Certified Beechwood</h3>
              <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-6">
                Our embroidery hoops are crafted from European beechwood sourced exclusively from sustainably managed forests. They are hand-sanded and free from synthetic varnishes, ensuring they are fully biodegradable at the end of their extremely long lifecycle.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <h3 className="font-serif text-2xl text-primary-container mb-4">Plastic-Free Packaging</h3>
              <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-6">
                Open a TwoThreads box, and you won't find a single piece of plastic. We use recycled kraft boxes, acid-free tissue paper, and vegetable-based inks. Even our thread cards are made from 100% post-consumer recycled paper.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="right" className="order-1 md:order-2 aspect-[4/3] bg-surface-container overflow-hidden">
              <img src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop" alt="Packaged kits" className="w-full h-full object-cover" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Sustainability Roadmap */}
      <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-6">
              Our Sustainability Goals
            </h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <ScrollReveal direction="up">
              <div className="bg-white p-8 text-center shadow-sm h-full border border-outline-variant/30 hover:shadow-md transition-shadow">
                <span className="font-sans text-xs tracking-widest uppercase text-on-secondary-container mb-3 block">2026 Goal</span>
                <h3 className="font-serif text-2xl text-primary-container mb-4">100% Recycled Floss</h3>
                <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                  Transitioning entirely to embroidery floss made from recycled polyester and organic cotton blends without sacrificing color vibrancy.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up">
              <div className="bg-white p-8 text-center shadow-sm h-full border border-outline-variant/30 hover:shadow-md transition-shadow">
                <span className="font-sans text-xs tracking-widest uppercase text-on-secondary-container mb-3 block">2027 Goal</span>
                <h3 className="font-serif text-2xl text-primary-container mb-4">Zero-Waste Studio</h3>
                <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                  Implementing a fabric scrap recycling program where all off-cuts from our pattern printing process are repurposed into new textiles.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up">
              <div className="bg-white p-8 text-center shadow-sm h-full border border-outline-variant/30 hover:shadow-md transition-shadow">
                <span className="font-sans text-xs tracking-widest uppercase text-on-secondary-container mb-3 block">2028 Goal</span>
                <h3 className="font-serif text-2xl text-primary-container mb-4">Carbon Negative</h3>
                <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                  Investing in certified reforestation projects to offset 150% of the carbon emissions generated by our supply chain and shipping.
                </p>
              </div>
            </ScrollReveal>
          </StaggerContainer>
        </div>
      </section>
      
      <section className="py-16 px-6 bg-[#ede6de] text-center">
        <ScrollReveal direction="up">
          <Link to="/about" className="font-sans text-sm uppercase tracking-[0.15em] text-primary-container hover:text-on-secondary-container transition-colors no-underline outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container p-2">
            ← Back to About Us
          </Link>
        </ScrollReveal>
      </section>
    </PageContainer>
  );
};

export default Sustainability;
