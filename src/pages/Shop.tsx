import React from 'react';
import PageContainer from '../components/layout/PageContainer';

const Shop: React.FC = () => {
  return (
    <PageContainer>
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
          Shop
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-light text-primary-container mb-6 text-center">
          Our Collection
        </h1>
        <p className="font-sans text-sm text-[#5a4a3f] max-w-lg text-center leading-loose">
          Our online shop is currently being curated. We're meticulously gathering the finest materials and crafting new patterns for you.
        </p>
      </div>
    </PageContainer>
  );
};

export default Shop;
