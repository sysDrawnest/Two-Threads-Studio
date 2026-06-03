import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { mockInstructors } from '../data/tutorials';
import { Link } from 'react-router-dom';

const Artisans: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-16 text-center bg-background">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
            The Guild
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-primary-container mb-6">
            Meet the Artisans.
          </h1>
          <p className="font-sans text-sm text-[#5a4a3f] leading-loose max-w-2xl mx-auto">
            Our patterns and kits are designed in collaboration with independent textile artists from around the world. These makers bring their unique heritage, techniques, and artistic vision to the TwoThreads community.
          </p>
        </div>
      </section>

      {/* Artisan Showcase Grid */}
      <section className="py-16 px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {mockInstructors.map((artisan, i) => (
              <div key={artisan.id} className="bg-white group cursor-default shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container">
                  <img 
                    src={artisan.avatar} 
                    alt={artisan.name} 
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-primary-container text-inverse-on-surface font-sans text-[10px] tracking-widest px-3 py-1 uppercase">
                    {artisan.specialty}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-3xl font-light text-primary-container mb-4">{artisan.name}</h3>
                  <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-6">
                    {artisan.bio}
                  </p>
                  <Link 
                    to={`/instructor/${artisan.id}`} 
                    className="font-sans text-xs tracking-[0.15em] uppercase text-on-secondary-container hover:text-primary-container transition-colors no-underline font-semibold"
                  >
                    View Courses →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join the Guild CTA */}
      <section className="py-24 px-6 md:px-16 bg-primary-container text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-inverse-on-surface mb-6">
          Are you a textile artist?
        </h2>
        <p className="font-sans text-sm text-inverse-on-surface/75 leading-loose max-w-2xl mx-auto mb-10">
          We are always looking to collaborate with passionate makers to design new kits and teach masterclasses. 
        </p>
        <Link 
          to="/contact"
          className="inline-block bg-on-secondary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-white hover:text-primary-container transition-colors no-underline"
        >
          Submit Portfolio
        </Link>
      </section>
    </PageContainer>
  );
};

export default Artisans;
