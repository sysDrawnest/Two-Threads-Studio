import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <PageContainer>
      {/* Mission Statement Hero */}
      <section className="bg-primary-container text-inverse-on-surface pt-32 pb-24 px-6 md:px-16 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-8">
            Our Mission
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light leading-tight mb-10 text-white">
            We believe in the beauty of the handmade, and the peace found in the process.
          </h1>
          <p className="font-sans text-sm text-white/70 leading-loose max-w-2xl mx-auto">
            At TwoThreads Studio, we source the finest natural materials and partner with master artisans to create embroidery kits that act as a bridge between traditional craft and modern mindfulness.
          </p>
        </div>
      </section>

      {/* Craftsmanship Process */}
      <section className="py-24 px-6 md:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container mb-4">
              The Craftsmanship Process
            </h2>
            <p className="font-sans text-sm text-[#5a4a3f]">How a TwoThreads kit comes to life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: "01", title: "Sourcing", img: "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=600&auto=format&fit=crop", text: "We start with the fabric. Our unbleached linen is woven in a zero-waste facility in Belgium, ensuring perfect tension and a natural, earthy texture." },
              { num: "02", title: "Design", img: "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=600&auto=format&fit=crop", text: "Every pattern is hand-drawn by our global network of textile artists. We digitize these drawings carefully to retain the organic feel of the original sketch." },
              { num: "03", title: "Curation", img: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=600&auto=format&fit=crop", text: "Threads are color-matched by eye, not by computer. We pack every box by hand in our studio, wrapping components in recycled paper." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col group cursor-default">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container mb-6">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 font-serif text-xl text-primary-container">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-primary-container mb-3">{step.title}</h3>
                <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Testimonials */}
      <section className="py-24 px-6 md:px-16 bg-[#ede6de]">
        <div className="max-w-6xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container text-center mb-16">
            Words from the Press & Makers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 shadow-sm flex flex-col justify-center text-center hover:-translate-y-1 transition-transform">
              <p className="font-serif text-xl md:text-2xl leading-relaxed text-primary-container italic mb-8">
                "TwoThreads isn't just selling embroidery kits; they are selling an antidote to screen fatigue. The materials are stunningly premium."
              </p>
              <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">— The Modern Crafter Magazine</p>
            </div>
            <div className="bg-white p-10 shadow-sm flex flex-col justify-center text-center hover:-translate-y-1 transition-transform">
              <p className="font-serif text-xl md:text-2xl leading-relaxed text-primary-container italic mb-8">
                "I bought a kit on a whim and it changed my evenings. It's so satisfying to watch an image appear thread by thread."
              </p>
              <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">— Julia H., Customer</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Navigation Link */}
      <section className="py-16 px-6 bg-inverse-on-surface border-t border-outline-variant text-center">
         <Link to="/our-story" className="font-sans text-sm uppercase tracking-[0.15em] text-primary-container hover:text-on-secondary-container transition-colors no-underline">
           Read the Founder's Story →
         </Link>
      </section>
    </PageContainer>
  );
};

export default About;
