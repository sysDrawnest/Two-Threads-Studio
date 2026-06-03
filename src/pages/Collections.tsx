import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { collectionsData } from '../data/products';

const Collections: React.FC = () => {
  return (
    <PageContainer>
      <div className="bg-background">
        <div className="py-20 px-6 md:px-16 text-center max-w-4xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
            Curations
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-primary-container mb-6">
            The Collections
          </h1>
          <p className="font-sans text-sm text-[#5a4a3f] leading-loose">
            Explore our curated collections of embroidery patterns and kits. From the lush warmth of botanical motifs to the cozy charm of cottage living, find the perfect piece to tell your story.
          </p>
        </div>

        <div className="flex flex-col">
          {collectionsData.map((collection, index) => (
            <div 
              key={collection.id}
              className={`flex flex-col md:flex-row min-h-[60vh] ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full">
                <img 
                  src={collection.image} 
                  alt={collection.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-24 px-8 md:px-16 lg:px-24 bg-inverse-on-surface text-center">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-primary-container mb-6">
                  {collection.name}
                </h2>
                <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-10">
                  {collection.description}
                </p>
                <Link 
                  to={`/shop`} 
                  className="bg-transparent text-primary-container border border-primary-container px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors no-underline"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Collections;
