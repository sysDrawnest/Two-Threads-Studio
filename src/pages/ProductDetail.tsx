import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { mockProducts } from '../data/products';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <PageContainer>
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
          <h1 className="font-serif text-3xl text-primary-container mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-on-secondary-container underline">Return to Shop</Link>
        </div>
      </PageContainer>
    );
  }

  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <PageContainer>
      {/* Product Hero Section */}
      <section className="bg-inverse-on-surface py-8 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-surface-container overflow-hidden">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 flex-shrink-0 bg-surface-container overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-primary-container' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-8">
            <p className="font-sans text-xs tracking-[0.2em] text-on-secondary-container uppercase mb-3">
              {product.collection} Collection
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-primary-container mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="font-serif text-2xl text-on-secondary-container mb-8">
              ${product.price}
            </p>

            <div className="flex flex-col gap-6 border-y border-outline-variant py-8 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm uppercase tracking-wider text-on-surface-variant">Difficulty</span>
                <span className={`font-sans text-xs uppercase tracking-[0.15em] px-3 py-1 ${
                  product.difficulty === 'Beginner' ? 'bg-[#e8f4e8] text-[#3a6b3a]' : 
                  product.difficulty === 'Intermediate' ? 'bg-[#fef3e8] text-[#8b5a00]' : 
                  'bg-[#fde8e8] text-[#8b0000]'
                }`}>
                  {product.difficulty}
                </span>
              </div>
              {product.estimatedTime !== 'N/A' && (
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm uppercase tracking-wider text-on-surface-variant">Est. Time</span>
                  <span className="font-sans text-sm text-primary-container">{product.estimatedTime}</span>
                </div>
              )}
            </div>

            <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-10">
              {product.description}
            </p>

            <button className="bg-primary-container text-inverse-on-surface border border-primary-container px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-transparent hover:text-primary-container transition-colors w-full mb-4">
              Add to Wishlist
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Story Section */}
      <section className="py-24 px-6 md:px-16 bg-[#ede6de]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
            The Story
          </p>
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-primary-container italic font-light">
            "{product.story}"
          </p>
        </div>
      </section>

      {/* Materials & Details */}
      <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-serif text-3xl font-light text-primary-container mb-8 border-b border-outline-variant pb-4">
              What's Included
            </h3>
            <ul className="list-none p-0 flex flex-col gap-4">
              {product.materialsIncluded.map((mat, i) => (
                <li key={i} className="flex gap-4 items-start font-sans text-sm text-[#5a4a3f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{mat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-3xl font-light text-primary-container mb-8 border-b border-outline-variant pb-4">
              Shipping & Returns
            </h3>
            <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-4">
              All our materials are sustainably sourced and packaged without plastic. Orders are typically processed within 2-3 business days.
            </p>
            <p className="font-sans text-sm text-[#5a4a3f] leading-loose">
              We accept returns on unopened kits within 30 days of receipt. Digital patterns are non-refundable.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <section className="py-24 px-6 md:px-16 bg-[#f8f3ee]">
          <div className="max-w-5xl mx-auto">
            <h3 className="font-serif text-3xl font-light text-primary-container mb-12 text-center">
              Notes from our Makers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.reviews.map(review => (
                <div key={review.id} className="bg-white p-8 shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <span key={i} className="text-on-secondary-container text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-serif text-lg leading-relaxed text-primary-container mb-6 italic">
                    "{review.text}"
                  </p>
                  <div className="flex justify-between items-center font-sans text-xs tracking-wider uppercase text-on-surface-variant">
                    <span>{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 px-6 md:px-16 bg-inverse-on-surface border-t border-outline-variant">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-serif text-3xl font-light text-primary-container mb-12 text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {relatedProducts.map((p) => (
                <Link 
                  key={p.id} 
                  to={`/shop/${p.id}`}
                  className="group no-underline bg-white cursor-pointer shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative h-72 overflow-hidden bg-surface-container">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-lg font-normal text-primary-container">{p.name}</h4>
                      <span className="font-sans text-sm text-on-secondary-container">${p.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageContainer>
  );
};

export default ProductDetail;
