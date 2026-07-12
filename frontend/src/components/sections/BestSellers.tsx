import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ProductCard } from '../ui/ProductCard';
import { productService } from '../../services/productService';
import type { Product } from '../../data/products';
import { ArrowRight } from 'lucide-react';

type FilterKey = 'All' | 'Embroidery' | 'Crochet' | 'Macramé' | 'Lippan Art' | 'Candles' | 'Gift Sets';

const filters: FilterKey[] = ['All', 'Embroidery', 'Crochet', 'Macramé', 'Lippan Art', 'Candles', 'Gift Sets'];

export default function BestSellers() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getBestSellers()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching best sellers:', err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'All') {
      return true;
    }
    return p.productCategory === activeFilter;
  }).slice(0, 8);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-2 font-medium">
            Most Loved
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B]">
            Best Sellers
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 mt-2">
            The pieces our community keeps coming back for
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-sans text-[10px] sm:text-xs tracking-wider uppercase px-4 py-2 border transition-all duration-300 cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#1C1C1B] text-[#FAF9F7] border-[#1C1C1B]'
                    : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {filter === 'All' ? 'All Bestsellers' : filter}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-neutral-100 p-4">
                <div className="aspect-[4/5] bg-neutral-200 mb-4" />
                <div className="h-4 bg-neutral-200 w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 w-1/2" />
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-400">
              No best sellers found in this category.
            </div>
          ) : (
            filteredProducts.map((product, i) => (
              <ScrollReveal key={product.id} direction="up" distance={20} delay={0.07 * i}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))
          )}
        </div>

        {/* View All */}
        <ScrollReveal direction="up" className="text-center mt-10 md:mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#A34A38] hover:gap-3 transition-all duration-300 no-underline border-b border-[#A34A38]/40 pb-0.5"
          >
            View All Bestsellers
            <ArrowRight size={13} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}