import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { mockInstructors } from '../data/tutorials';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer } from '../components/ui/ScrollReveal';

const Artisans: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-16 text-center bg-background">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up" delay={0.15}>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
              The Guild
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-primary-container mb-6">
              Meet the Artisans.
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.45}>
            <p className="font-sans text-sm text-[#5a4a3f] leading-loose max-w-2xl mx-auto">
              Our patterns and kits are designed in collaboration with independent textile artists from around the world. These makers bring their unique heritage, techniques, and artistic vision to the TwoThreads community.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Artisan Showcase Grid */}
      <section className="py-16 px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {mockInstructors.map((artisan, i) => (
              <ScrollReveal key={artisan.id} direction="up">
                <div className="bg-white group cursor-default shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-outline-variant/30 h-full flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-container">
                      <img 
                        src={artisan.avatar} 
                        alt={artisan.name} 
                        className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-primary-container text-inverse-on-surface font-sans text-[10px] tracking-widest px-3 py-1 uppercase z-10 shadow-sm">
                        {artisan.specialty}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-serif text-3xl font-light text-primary-container mb-4">{artisan.name}</h3>
                      <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-6">
                        {artisan.bio}
                      </p>
                    </div>
                  </div>
                  <div className="px-8 pb-8">
                    <Link 
                      to={`/instructor/${artisan.id}`} 
                      className="font-sans text-xs tracking-[0.15em] uppercase text-on-secondary-container hover:text-primary-container transition-colors no-underline font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-on-secondary-container"
                    >
                      View Courses →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </StaggerContainer>
        </div>
      </section>
      
      {/* Join the Guild CTA */}
      <section className="py-24 px-6 md:px-16 bg-primary-container text-center">
        <ScrollReveal direction="up">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-inverse-on-surface mb-6">
            Are you a textile artist?
          </h2>
          <p className="font-sans text-sm text-inverse-on-surface/75 leading-loose max-w-2xl mx-auto mb-10">
            We are always looking to collaborate with passionate makers to design new kits and teach masterclasses. 
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-on-secondary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-white hover:text-primary-container transition-colors no-underline outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-on-secondary-container"
          >
            Submit Portfolio
          </Link>
        </ScrollReveal>
      </section>
    </PageContainer>
  );
};

export default Artisans;
