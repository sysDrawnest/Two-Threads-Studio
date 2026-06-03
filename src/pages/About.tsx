import React from 'react';
import PageContainer from '../components/layout/PageContainer';

const About: React.FC = () => {
  return (
    <PageContainer>
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 bg-primary-container">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
          Our Story
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-light text-inverse-on-surface mb-6 text-center">
          About TwoThreads
        </h1>
        <p className="font-sans text-sm text-inverse-on-surface/75 max-w-lg text-center leading-loose">
          Our story is rooted in the art of making. Read more about our mission to bring sustainable, handcrafted textiles to modern homes soon.
        </p>
      </div>
    </PageContainer>
  );
};

export default About;
