import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer } from '../components/ui/ScrollReveal';
import aboutImg1 from '../assets/stitch/close_up_of_high_quality_unbleached_linen_fabric_texture_natural_beige_tones.png';
import aboutImg2 from '../assets/stitch/hand_drawn_embroidery_patterns_and_sketches_on_paper_charcoal_pencil_artistic.png';
import aboutImg3 from '../assets/stitch/close_up_of_hands_carefully_packing_an_embroidery_kit_with_recycled_paper_and.png';

const About: React.FC = () => {
  return (
    <PageContainer>
      {/* Mission Statement Hero */}
      <section className="bg-primary-container text-inverse-on-surface pt-32 pb-24 px-6 md:px-16 text-center">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0.15}>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-8">
              Our Mission
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light leading-tight mb-10 text-white">
              We believe in the beauty of the handmade, and the peace found in the process.
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.45}>
            <p className="font-sans text-sm text-white/70 leading-loose max-w-2xl mx-auto">
              At TwoThreads Studio, we source the finest natural materials and partner with master artisans to create embroidery kits that act as a bridge between traditional craft and modern mindfulness.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Craftsmanship Process */}
      <section className="py-24 px-6 md:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container mb-4">
              The Craftsmanship Process
            </h2>
            <p className="font-sans text-sm text-[#5a4a3f]">How a TwoThreads kit comes to life.</p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: "01", title: "Sourcing", img: aboutImg1, text: "We start with the fabric. Our unbleached linen is woven in a zero-waste facility in Belgium, ensuring perfect tension and a natural, earthy texture." },
              { num: "02", title: "Design", img: aboutImg2, text: "Every pattern is hand-drawn by our global network of textile artists. We digitize these drawings carefully to retain the organic feel of the original sketch." },
              { num: "03", title: "Curation", img: aboutImg3, text: "Threads are color-matched by eye, not by computer. We pack every box by hand in our studio, wrapping components in recycled paper." }
            ].map((step, i) => (
              <ScrollReveal key={i} direction="up" className="flex flex-col group cursor-default">
                <div className="relative aspect-[1/1] md:aspect-[4/5] overflow-hidden bg-surface-container mb-6">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                  <div className="hidden md:block absolute top-4 left-4 bg-white/90 px-3 py-1 font-serif text-xl text-primary-container z-10 shadow-sm">
                    {step.num}
                  </div>
                </div>
                {/* Mobile text layout */}
                <div className="flex md:hidden items-baseline gap-4">
                  <span className="font-sans text-xs tracking-[0.2em] font-medium text-[#7f756f]">{step.num}</span>
                  <div>
                    <h3 className="font-serif text-[28px] text-primary-container mb-3 leading-[1.3]">{step.title}</h3>
                    <p className="font-sans text-base text-[#4e4540] leading-[1.6]">
                      {step.text}
                    </p>
                  </div>
                </div>
                {/* PC text layout */}
                <div className="hidden md:block">
                  <h3 className="font-serif text-2xl text-primary-container mb-3">{step.title}</h3>
                  <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Brand Testimonials */}
      <section className="py-24 px-6 md:px-16 bg-[#ede6de]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container">
              Words from the Press & Makers
            </p>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <div className="bg-white p-10 shadow-sm flex flex-col justify-center text-center hover:shadow-md transition-shadow duration-300 border border-outline-variant/30 h-full">
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-primary-container italic mb-8">
                  "TwoThreads isn't just selling embroidery kits; they are selling an antidote to screen fatigue. The materials are stunningly premium."
                </p>
                <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">— The Modern Crafter Magazine</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="bg-white p-10 shadow-sm flex flex-col justify-center text-center hover:shadow-md transition-shadow duration-300 border border-outline-variant/30 h-full">
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-primary-container italic mb-8">
                  "I bought a kit on a whim and it changed my evenings. It's so satisfying to watch an image appear thread by thread."
                </p>
                <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">— Julia H., Customer</p>
              </div>
            </ScrollReveal>
          </StaggerContainer>
        </div>
      </section>
      
      {/* Footer Navigation Link */}
      <section className="py-16 px-6 bg-inverse-on-surface border-t border-outline-variant text-center">
         <ScrollReveal direction="up">
           <Link to="/our-story" className="font-sans text-sm uppercase tracking-[0.15em] text-primary-container hover:text-on-secondary-container transition-colors no-underline outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container p-2">
             Read the Founder's Story →
           </Link>
         </ScrollReveal>
      </section>
    </PageContainer>
  );
};

export default About;
