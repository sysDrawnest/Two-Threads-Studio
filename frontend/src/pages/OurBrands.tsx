import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { ScrollReveal, StaggerContainer } from '../components/ui/ScrollReveal';
import { ArrowLeft, Sparkles, Shirt } from 'lucide-react';

export default function OurBrands() {
  const brands = [
    {
      name: 'Two Threads Studio',
      subtitle: 'Premium DIY Embroidery & Textiles',
      description: 'A contemporary textile design brand specializing in premium, zero-waste Belgian linen embroidery kits, digital patterns, and mindful stitch courses. Designed to serve as a bridge between traditional artisan craftsmanship and modern mindfulness.',
      link: '/',
      linkLabel: 'Visit Storefront',
      icon: Sparkles,
      tag: 'Bespoke Decor'
    },
    {
      name: 'TANVO',
      subtitle: 'Premium Heritage Handloom Fashion',
      description: 'A luxury handloom clothing house dedicated to reviving and sustaining authentic Indian weaving techniques. Offering high-end editorial collections crafted from natural-dyed silks, hand-spun khadi, and traditional block-printed linen.',
      link: '#',
      linkLabel: 'Coming Soon',
      icon: Shirt,
      tag: 'Slow Fashion'
    }
  ];

  return (
    <PageContainer>
      <div className="min-h-screen bg-[#FBFBFA] pt-28 pb-24 px-6 md:px-16 font-sans text-[#1C1C1B]">
        <div className="max-w-5xl mx-auto">
          
          {/* Back button */}
          <div className="mb-10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors no-underline font-semibold"
            >
              <ArrowLeft size={14} /> Back to Two Threads
            </Link>
          </div>

          {/* Header */}
          <div className="max-w-3xl mb-20">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-400 block mb-4">
              Corporate Portfolio
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-primary-container leading-tight mb-8">
              SYS Pvt. Ltd.
            </h1>
            <p className="font-sans text-base text-[#5a4a3f] leading-loose max-w-2xl">
              Building meaningful consumer brands across commerce, creativity, and technology. Under a unified operational umbrella, our brands focus on heritage craftsmanship, design excellence, and sustainable scaling.
            </p>
          </div>

          <div className="border-t border-neutral-200 w-full mb-16"></div>

          {/* Brands grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brands.map((brand, i) => {
              const Icon = brand.icon;
              return (
                <ScrollReveal key={i} direction="up">
                  <div className="bg-white border border-neutral-200/60 p-8 md:p-10 rounded-sm shadow-sm flex flex-col justify-between h-[400px]">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="bg-neutral-100 text-neutral-500 font-sans text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-sm">
                          {brand.tag}
                        </span>
                        <Icon size={20} className="text-[#A34A38]" />
                      </div>
                      <h3 className="font-serif text-2xl text-primary-container mb-2">{brand.name}</h3>
                      <p className="font-sans text-xs text-[#A34A38] uppercase tracking-wider mb-4 font-medium">{brand.subtitle}</p>
                      <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                        {brand.description}
                      </p>
                    </div>

                    <div className="border-t border-neutral-100 pt-6 mt-6">
                      {brand.link === '/' ? (
                        <Link 
                          to={brand.link}
                          className="font-sans text-xs tracking-widest uppercase text-[#1C1C1B] font-semibold underline underline-offset-4 hover:text-[#A34A38] transition-colors"
                        >
                          {brand.linkLabel} →
                        </Link>
                      ) : (
                        <span className="font-sans text-xs tracking-widest uppercase text-neutral-400 italic">
                          {brand.linkLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </StaggerContainer>

        </div>
      </div>
    </PageContainer>
  );
}
