import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

const NotFound: React.FC = () => {
  return (
    <PageContainer>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-background">
        <h1 className="font-serif text-8xl md:text-9xl text-primary-container/20 font-light mb-4">
          404
        </h1>
        <h2 className="font-serif text-3xl md:text-4xl text-primary-container mb-6">
          Page Not Found
        </h2>
        <p className="font-sans text-sm text-[#5a4a3f] leading-loose max-w-md mx-auto mb-10">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to the studio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/shop"
            className="bg-primary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors no-underline"
          >
            Return to Shop
          </Link>
          <Link 
            to="/"
            className="bg-transparent text-primary-container border border-primary-container px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-surface-variant transition-colors no-underline"
          >
            Go Home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
