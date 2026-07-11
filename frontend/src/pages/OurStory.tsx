import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer } from '../components/ui/ScrollReveal';

// Assets
import aboutImg1 from '../assets/stitch/close_up_of_high_quality_unbleached_linen_fabric_texture_natural_beige_tones.png';
import aboutImg2 from '../assets/stitch/hand_drawn_embroidery_patterns_and_sketches_on_paper_charcoal_pencil_artistic.png';
import aboutImg3 from '../assets/stitch/close_up_of_hands_carefully_packing_an_embroidery_kit_with_recycled_paper_and.png';

const OurStory: React.FC = () => {
  return (
    <PageContainer>
      {/* Mission Statement Hero (from About.tsx) */}
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

      {/* Craftsmanship Process (from About.tsx) */}
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

      {/* Founder's Story (from OurStory.tsx) */}
      <section className="bg-inverse-on-surface py-24 px-6 md:px-16 border-t border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <ScrollReveal direction="left" className="w-full lg:w-5/12 order-2 lg:order-1">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
              The Founder's Story
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-primary-container mb-8 leading-tight">
              A return to the slow craft.
            </h2>
            <p className="font-sans text-base text-[#5a4a3f] leading-loose mb-6">
              TwoThreads was born out of a quiet frustration with the speed of modern life. Our founder, Elara Vance, spent years working in fast-paced design houses before realizing that the art of true creation was being lost to mass production.
            </p>
            <p className="font-sans text-base text-[#5a4a3f] leading-loose mb-10">
              "I wanted to build something that forced you to sit down, take a breath, and make something beautiful with your own two hands," she says. What started as a small collection of hand-drawn patterns in a sketchbook has evolved into a global community of makers dedicated to the art of embroidery.
            </p>
            <div className="flex items-center gap-6 pt-6 border-t border-outline-variant">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" alt="Elara Vance Signature" className="h-12 w-12 rounded-full object-cover grayscale" />
              <div>
                <p className="font-serif text-xl text-primary-container">Elara Vance</p>
                <p className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">Founder & Creative Director</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" className="w-full lg:w-7/12 order-1 lg:order-2 relative">
            <div className="aspect-[3/4] md:aspect-square lg:aspect-[3/4] overflow-hidden bg-surface-container">
              <img 
                src="https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=1200&auto=format&fit=crop" 
                alt="Elara Vance in studio" 
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 border border-primary-container/20 hidden md:block pointer-events-none" />
          </ScrollReveal>
        </div>
      </section>

      {/* Brand Journey Timeline (from OurStory.tsx) */}
      <section className="py-24 px-6 md:px-16 bg-background">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <ScrollReveal direction="up">
            <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-6">
              Our Journey
            </h2>
            <p className="font-sans text-sm text-[#5a4a3f] leading-loose max-w-2xl mx-auto">
              From a tiny studio apartment to a global platform, here is how the thread unravelled.
            </p>
          </ScrollReveal>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-outline-variant md:-translate-x-1/2" />

          <StaggerContainer className="flex flex-col gap-16">
            {[
              { year: "2019", title: "The First Stitch", text: "Elara creates the first 'Botanical Meadow' pattern, sharing it on a small blog." },
              { year: "2020", title: "Sourcing Quality", text: "Partnered with a multi-generational mill in Belgium to secure the finest, sustainable unbleached linen." },
              { year: "2022", title: "The Artisan Guild", text: "Launched our first collaborative kits, featuring designs from textile artists around the globe." },
              { year: "2024", title: "Learning Hub Launch", text: "Introduced digital courses, allowing anyone to master advanced thread painting techniques from home." },
              { year: "Today", title: "A Global Community", text: "Over 50,000 makers worldwide, united by a love for slow crafting and sustainable art." }
            ].map((milestone, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"} className={`flex flex-col md:flex-row relative z-10 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-[24px] md:left-1/2 w-2 h-2 bg-primary-container rounded-full mt-2 md:-translate-x-1/2" />
                <div className={`pl-16 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                  <span className="font-sans text-xs tracking-widest text-on-secondary-container uppercase mb-2 block">
                    {milestone.year}
                  </span>
                  <h3 className="font-serif text-2xl text-primary-container mb-3">{milestone.title}</h3>
                  <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                    {milestone.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Press & Maker Testimonials (from About.tsx) */}
      <section className="py-24 px-6 md:px-16 bg-[#ede6de]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#7f756f]">
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

      {/* Parent Company Section */}
      <section className="py-20 px-6 md:px-16 bg-inverse-on-surface border-t border-outline-variant/20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal direction="up">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/60 block mb-4">
              Corporate Parent
            </span>
            <h2 className="font-serif text-2xl font-light text-primary-container mb-6">
              About SYS Pvt. Ltd.
            </h2>
            <p className="font-sans text-xs text-[#5a4a3f]/80 leading-relaxed max-w-2xl mx-auto mb-8">
              Two Threads Studio operates as a proud member of the SYS Pvt. Ltd. family. SYS Pvt. Ltd. is a creator of digital-first consumer brands focused on craftsmanship, technology, design, and building meaningful products. Under this umbrella, we leverage advanced operational platforms while ensuring our master artisans retain full creative independence and traditional design heritage.
            </p>
            <div className="w-12 h-px bg-outline-variant/40 mx-auto" />
          </ScrollReveal>
        </div>
      </section>

      {/* Outro CTA (from OurStory.tsx) */}
      <section className="py-24 px-6 md:px-16 text-center bg-background border-t border-outline-variant/20">
        <ScrollReveal direction="up">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container mb-6">
            Ready to start your own story?
          </h2>
          <Link 
            to="/shop"
            className="inline-block bg-primary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors no-underline mt-4 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container"
          >
            Explore Kits
          </Link>
        </ScrollReveal>
      </section>
    </PageContainer>
  );
};

export default OurStory;
