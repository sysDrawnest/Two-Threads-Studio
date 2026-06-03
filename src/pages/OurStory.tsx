import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link } from 'react-router-dom';

const OurStory: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero / Founder Story */}
      <section className="bg-background pt-12 pb-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-5/12 order-2 lg:order-1">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
              The Founder's Story
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-primary-container mb-8 leading-tight">
              A return to the slow craft.
            </h1>
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
          </div>
          <div className="w-full lg:w-7/12 order-1 lg:order-2 relative">
            <div className="aspect-[3/4] md:aspect-square lg:aspect-[3/4] overflow-hidden bg-surface-container">
              <img 
                src="https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=1200&auto=format&fit=crop" 
                alt="Elara Vance in studio" 
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 border border-primary-container/20 hidden md:block pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Brand Timeline */}
      <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-6">
            Our Journey
          </h2>
          <p className="font-sans text-sm text-[#5a4a3f] leading-loose max-w-2xl mx-auto">
            From a tiny studio apartment to a global platform, here is how the thread unravelled.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-outline-variant md:-translate-x-1/2" />

          <div className="flex flex-col gap-16">
            {[
              { year: "2019", title: "The First Stitch", text: "Elara creates the first 'Botanical Meadow' pattern, sharing it on a small blog." },
              { year: "2020", title: "Sourcing Quality", text: "Partnered with a multi-generational mill in Belgium to secure the finest, sustainable unbleached linen." },
              { year: "2022", title: "The Artisan Guild", text: "Launched our first collaborative kits, featuring designs from textile artists around the globe." },
              { year: "2024", title: "Learning Hub Launch", text: "Introduced digital courses, allowing anyone to master advanced thread painting techniques from home." },
              { year: "Today", title: "A Global Community", text: "Over 50,000 makers worldwide, united by a love for slow crafting and sustainable art." }
            ].map((milestone, i) => (
              <div key={i} className={`flex flex-col md:flex-row relative z-10 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
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
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Outro CTA */}
      <section className="py-24 px-6 md:px-16 text-center bg-background">
        <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container mb-6">
          Ready to start your own story?
        </h2>
        <Link 
          to="/shop"
          className="inline-block bg-primary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors no-underline mt-4"
        >
          Explore Kits
        </Link>
      </section>
    </PageContainer>
  );
};

export default OurStory;
