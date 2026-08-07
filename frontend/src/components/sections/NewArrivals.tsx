import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { productService } from '../../services/productService';
import type { Product } from '../../data/products';
import { ArrowRight, Sparkles, Calendar, MapPin, Clock } from 'lucide-react';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts({ limit: 6 })
      .then((data) => {
        if (data && data.products) {
          // Filter products tagged as 'New' or recent additions
          const newItems = data.products.filter(
            (p) => p.badge === 'New' || p.badge === 'Trending' || p.category === 'mens-clothing' || p.category === 'womens-clothing'
          );
          setProducts(newItems.length > 0 ? newItems.slice(0, 3) : data.products.slice(0, 3));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching new arrivals:', err);
        setLoading(false);
      });
  }, []);

  // Custom fallback items matching the UI reference card layout if API yields fewer items
  const displayItems = products.length >= 3 ? products : [
    {
      id: 'na-1',
      name: 'Palette Play: Handcrafted Kurta',
      slug: 'palette-play-handcrafted-kurta',
      price: 4999,
      badge: 'New',
      images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'],
      subtitle: 'Pure Organic Linen',
      location: 'Bengaluru Atelier',
      launchDate: 'FEB 16 MON',
      timeSlot: '11:00 AM IST',
      accentColor: 'from-[#1e3a40]/95 via-[#004d61]/70 to-transparent',
    },
    {
      id: 'na-2',
      name: 'Brush & Bliss: Silk Dupatta',
      slug: 'brush-and-bliss-silk-dupatta',
      price: 5499,
      badge: 'New',
      images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'],
      subtitle: 'Hand-Painted Silk',
      location: 'Heritage Studio',
      launchDate: 'MAR 02 TUE',
      timeSlot: '02:30 PM IST',
      accentColor: 'from-[#0d47a1]/95 via-[#1565c0]/70 to-transparent',
    },
    {
      id: 'na-3',
      name: 'Creations: Color & Linen Shirt',
      slug: 'creations-color-linen-shirt',
      price: 4299,
      badge: 'New',
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'],
      subtitle: 'Artisan Embroidered',
      location: 'South Studio',
      launchDate: 'MAR 14 SUN',
      timeSlot: '05:30 PM IST',
      accentColor: 'from-[#e65100]/95 via-[#f57c00]/70 to-transparent',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A34A38]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9ECE9] text-[#A34A38] text-[10px] font-mono tracking-widest uppercase mb-3">
            <Sparkles size={12} />
            <span>Fresh Drop • 2026 Collection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B]">
            New Arrivals
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#6E665E] max-w-lg mx-auto mt-3">
            Explore our latest hand-crafted drops — designed with modern aesthetics and centuries-old artisan traditions.
          </p>
        </ScrollReveal>

        {/* UI Reference Design Cards Fan / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center justify-center">
          {displayItems.map((item: any, index: number) => {
            // Card rotation effect to match the fan UI reference
            const rotationClass =
              index === 0
                ? 'md:-rotate-3 hover:rotate-0'
                : index === 2
                ? 'md:rotate-3 hover:rotate-0'
                : 'md:translate-y-[-12px]';

            const imageUrl = item.images?.[0]?.url || item.images?.[0] || item.primaryImage || '/placeholder.png';
            const price = typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price;
            const title = item.name;

            return (
              <ScrollReveal key={item.id || index} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative h-[460px] sm:h-[520px] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_16px_40px_rgba(28,28,27,0.12)] border border-[#E3DACF]/60 transition-transform duration-500 cursor-pointer ${rotationClass}`}
                >
                  <Link to={`/product/${item.slug || item.id}`} className="block h-full w-full no-underline">
                    {/* Background Image */}
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay for Typography Visibility matching UI Reference */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b1e]/95 via-[#0d1b1e]/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Top Status Tag */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-[#1C1C1B]/80 backdrop-blur-md text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20 font-semibold shadow-sm">
                        {item.badge || 'NEW'}
                      </span>
                    </div>

                    {/* Bottom Card Overlay Container (Matching UI Reference layout) */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 space-y-4">
                      {/* Title directly over image */}
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight tracking-tight drop-shadow-md">
                        {title}
                      </h3>

                      {/* Translucent Glassmorphic Info Bar matching Reference Pill */}
                      <div className="bg-[#005f73]/85 backdrop-blur-lg border border-white/20 rounded-2xl p-3 sm:p-4 text-white flex items-center justify-between shadow-lg">
                        {/* Left: Date Box */}
                        <div className="flex items-center gap-2.5">
                          <div className="bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-center flex flex-col justify-center min-w-[54px] border border-white/30">
                            <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-white leading-none">
                              {item.launchDate || 'FEB 16'}
                            </span>
                            <span className="text-[8px] font-mono tracking-widest text-white/80 uppercase mt-0.5 leading-none">
                              MON
                            </span>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-white tracking-tight leading-tight">
                              {item.subtitle || 'Artisan Series'}
                            </p>
                            <p className="text-[9px] text-white/80 font-mono flex items-center gap-1 mt-0.5">
                              <MapPin size={9} />
                              <span>{item.location || 'Bengaluru Studio'}</span>
                            </p>
                          </div>
                        </div>

                        {/* Right: Price / Time Tag */}
                        <div className="text-right pl-2 border-l border-white/20">
                          <p className="text-xs font-mono font-bold text-white tracking-tight">{price}</p>
                          <p className="text-[8px] font-mono text-white/80 uppercase tracking-widest flex items-center justify-end gap-0.5 mt-0.5">
                            <Clock size={8} />
                            <span>{item.timeSlot || 'LIMITED'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View Collection Footer Link */}
        <ScrollReveal direction="up" className="text-center mt-12 sm:mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.25em] uppercase text-[#A34A38] hover:gap-3 transition-all duration-300 no-underline border-b border-[#A34A38]/40 pb-1 font-semibold"
          >
            Explore All New Drops
            <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
