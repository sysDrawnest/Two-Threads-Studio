import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ProductCard } from '../ui/ProductCard';
import { productService } from '../../services/productService';
import type { Product } from '../../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useHomepageConfig } from '../../hooks/useCms';

export default function NewArrivalsSection() {
  const { data: cmsData } = useHomepageConfig();
  const cmsConfig = cmsData?.data?.newArrivalsConfig;
  const isEnabled = cmsConfig?.enabled ?? true;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts({ limit: cmsConfig?.limit || 8, sort: 'newest' })
      .then(res => {
        setProducts(res.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching new arrivals:', err);
        setLoading(false);
      });
  }, [cmsConfig?.limit]);

  if (!isEnabled) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#FAF8F5] border-t border-[#EBE5DF]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A34A38]/10 text-[#A34A38] text-[10px] sm:text-xs tracking-[0.25em] uppercase font-mono font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Just Arrived
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B]">
            New Arrivals
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 mt-2">
            Fresh handcrafted releases directly from our studio looms & ateliers
          </p>
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
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-400">
              No new arrivals available at the moment.
            </div>
          ) : (
            products.slice(0, cmsConfig?.limit || 8).map((product, i) => (
              <ScrollReveal key={product.id} direction="up" distance={20} delay={0.07 * i}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))
          )}
        </div>

        {/* View All */}
        <ScrollReveal direction="up" className="text-center mt-10 md:mt-12">
          <Link
            to="/shop?sort=newest"
            className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#A34A38] hover:gap-3 transition-all duration-300 no-underline border-b border-[#A34A38]/40 pb-0.5"
          >
            Explore All New Releases
            <ArrowRight size={13} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
