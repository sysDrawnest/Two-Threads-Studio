import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { mockProducts } from '../data/products';

const Wishlist: React.FC = () => {
  // Using mock data to simulate a populated wishlist for demonstration
  const wishlistItems = mockProducts.slice(0, 2);

  return (
    <PageContainer>
      <div className="bg-inverse-on-surface py-16 px-6 md:px-16 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 border-b border-outline-variant pb-8">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
              Saved Items
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-primary-container">
              Your Wishlist
            </h1>
          </div>
          <p className="font-sans text-sm text-on-surface-variant mt-4 md:mt-0">
            {wishlistItems.length} items
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
                <Link to={`/shop/${item.id}`} className="w-full md:w-48 h-48 flex-shrink-0 bg-surface-container overflow-hidden">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </Link>
                <div className="flex-1 flex flex-col justify-between h-full w-full">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/shop/${item.id}`} className="font-serif text-2xl font-normal text-primary-container no-underline hover:text-on-secondary-container transition-colors">
                        {item.name}
                      </Link>
                      <span className="font-serif text-xl text-on-secondary-container">${item.price}</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant uppercase tracking-wider mb-6">
                      {item.category} • {item.difficulty}
                    </p>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed line-clamp-2 max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button className="bg-primary-container text-inverse-on-surface border border-primary-container px-8 py-3 font-sans text-xs tracking-[0.15em] uppercase cursor-pointer hover:bg-transparent hover:text-primary-container transition-colors flex-1 md:flex-none">
                      Move to Cart
                    </button>
                    <button className="bg-transparent text-primary-container border border-primary-container px-8 py-3 font-sans text-xs tracking-[0.15em] uppercase cursor-pointer hover:bg-surface-container transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-sans text-lg text-on-surface-variant italic mb-6">Your wishlist is currently empty.</p>
            <Link 
              to="/shop"
              className="bg-primary-container text-inverse-on-surface border border-primary-container px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-transparent hover:text-primary-container transition-colors no-underline inline-block"
            >
              Explore Shop
            </Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Wishlist;
