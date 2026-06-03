import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { mockProducts, Product } from '../data/products';

const Shop: React.FC = () => {
  const [filter, setFilter] = useState({
    difficulty: 'All',
    category: 'All',
    collection: 'All'
  });

  const filteredProducts = mockProducts.filter(p => {
    if (filter.difficulty !== 'All' && p.difficulty !== filter.difficulty) return false;
    if (filter.category !== 'All' && p.category !== filter.category) return false;
    if (filter.collection !== 'All' && p.collection !== filter.collection) return false;
    return true;
  });

  return (
    <PageContainer>
      <div className="bg-inverse-on-surface py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 border-b border-outline-variant pb-8">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
              Shop
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-primary-container">
              All Products
            </h1>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 mt-8 md:mt-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {(['difficulty', 'category', 'collection'] as const).map((filterType) => (
              <select 
                key={filterType}
                className="bg-transparent border border-outline-variant text-primary-container font-sans text-xs uppercase tracking-wider py-2 px-4 outline-none cursor-pointer"
                value={filter[filterType]}
                onChange={(e) => setFilter({...filter, [filterType]: e.target.value})}
              >
                <option value="All">{filterType}</option>
                {Array.from(new Set(mockProducts.map(p => p[filterType]))).map(val => (
                  <option key={val as string} value={val as string}>{val}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link 
              key={product.id} 
              to={`/shop/${product.id}`}
              className="group no-underline bg-white cursor-pointer shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative h-80 overflow-hidden bg-surface-container">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-primary-container text-inverse-on-surface text-[10px] tracking-[0.15em] px-3 py-1.5 uppercase font-sans z-10">
                    {product.badge}
                  </span>
                )}
                {/* Overlay on hover for quick action placeholder */}
                <div className="absolute inset-0 bg-primary-container/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl font-normal text-primary-container">{product.name}</h3>
                  <span className="font-sans text-sm text-on-secondary-container">${product.price}</span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant uppercase tracking-wider mb-4">
                  {product.category} • {product.difficulty}
                </p>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed line-clamp-2 mt-auto">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-sans text-lg text-on-surface-variant italic">No products found matching these filters.</p>
            <button 
              onClick={() => setFilter({difficulty: 'All', category: 'All', collection: 'All'})}
              className="mt-6 bg-transparent text-primary-container border border-primary-container px-6 py-2 font-sans text-xs tracking-widest uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Shop;
