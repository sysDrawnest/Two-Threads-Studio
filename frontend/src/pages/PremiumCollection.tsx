import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Product } from '../data/products';
import { productService } from '../services/productService';
import { useAddToCart } from '../hooks/useCommerce';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ArrowRight, Heart, ShoppingBag, Check, ArrowDown, ChevronRight } from 'lucide-react';

import imgCrochetTop from '../assets/Woman_wearing_crochet_jacket_2K_202608051414-Recovered.webp';
import imgHandbag from '../assets/Woman_carrying_wool_handbag_2K_202607141446.webp';
import imgHandbag2 from '../assets/Woman_holding_wool_handbag_2K_202607141448.webp';
import imgMenswearHero from '../assets/Man_wearing_linen_shirt_in_202608100224.jpeg';
import imgWomenswearHero from '../assets/Woman02608100225.jpeg';

// Collection Configurations
interface CollectionConfig {
  id: string;
  tag: string;
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  heroImage: string;
  quote: string;
  heroPiece: {
    title: string;
    price: number;
    mrp?: number;
    fabric: string;
    description: string;
    image: string;
    id: string;
  };
  fallbackProducts: Product[];
}

const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  menswear: {
    id: 'menswear',
    tag: 'MENSWEAR',
    heroTitle: 'MENSWEAR COLLECTION',
    heroSubtitle: 'Crafted for those who appreciate the uncommon.',
    introTitle: 'Crafted with intention.',
    introBody: 'A considered collection of handmade pieces, where traditional textile techniques meet contemporary everyday dressing.',
    heroImage: imgMenswearHero,
    quote: '"Made slowly. Worn for years."',
    heroPiece: {
      id: 'mens-hero-piece',
      title: 'Handwoven Indigo Linen Shirt',
      price: 3499,
      mrp: 4499,
      fabric: '100% Organic Handloom Linen',
      description: 'Relaxed fit shirt featuring hand-threaded botanical motif embroidery on chest pocket.',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop',
    },
    fallbackProducts: [
      {
        id: 'mens-prod-1',
        name: 'Handwoven Indigo Linen Shirt',
        price: 3499,
        mrp: 4499,
        category: 'Kit' as any,
        productCategory: 'Home Decor' as any,
        collection: 'Linen',
        difficulty: 'Advanced',
        badge: 'Best Seller',
        images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop'],
        description: 'Relaxed fit shirt featuring hand-threaded botanical motif embroidery on chest pocket.',
        story: 'Woven by master weavers in Bengal and finished by our in-house embroidery artisans.',
        materialsIncluded: ['100% Organic Linen', 'Resham Silk Threads'],
        estimatedTime: 'Handmade in 24 hrs',
        reviews: [],
        rating: 4.9,
        reviewCount: 28,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      },
      {
        id: 'mens-prod-2',
        name: 'Heritage Indigo Denim Jacket with Embroidery',
        price: 5999,
        mrp: 7499,
        category: 'Kit' as any,
        collection: 'Botanical',
        difficulty: 'Advanced',
        badge: 'Editor\'s Choice',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'],
        description: 'Heavyweight raw denim jacket with custom hand-stitched floral motif backpanel.',
        story: 'Inspired by traditional Kantha stitch techniques reinterpreted for contemporary menswear.',
        materialsIncluded: ['14oz Selvedge Denim', 'Cotton Threads'],
        estimatedTime: 'Handmade in 36 hrs',
        reviews: [],
        rating: 5.0,
        reviewCount: 14,
        stock: 'Low Stock',
        isHandmade: true,
        isSustainable: true
      },
      {
        id: 'mens-prod-3',
        name: 'Artisan Relaxed Trousers in Sand Beige',
        price: 3999,
        mrp: 4999,
        category: 'Kit' as any,
        collection: 'Linen',
        difficulty: 'Intermediate',
        badge: 'New',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop'],
        description: 'Tailored relaxed trousers with subtle pick-stitch side seam detailing.',
        story: 'Spun from sustainably harvested hemp and organic cotton blend.',
        materialsIncluded: ['Hemp-Cotton Blend'],
        estimatedTime: 'Handmade in 16 hrs',
        reviews: [],
        rating: 4.8,
        reviewCount: 19,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      },
      {
        id: 'mens-prod-4',
        name: 'Embroidered Botanical Crest Baseball Cap',
        price: 1499,
        mrp: 1899,
        category: 'Kit' as any,
        collection: 'Botanical',
        difficulty: 'Beginner',
        badge: 'Trending',
        images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&auto=format&fit=crop'],
        description: 'Classic 6-panel cap with dense multi-color botanical embroidery crest.',
        story: 'Precision hand-guided embroidery on heavy cotton twill.',
        materialsIncluded: ['Cotton Twill', 'Brass Clasp'],
        estimatedTime: 'Handmade in 6 hrs',
        reviews: [],
        rating: 4.7,
        reviewCount: 32,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      }
    ]
  },
  womenswear: {
    id: 'womenswear',
    tag: 'WOMENSWEAR',
    heroTitle: 'WOMENSWEAR COLLECTION',
    heroSubtitle: 'Handcrafted pieces for quiet expression.',
    introTitle: 'Tactile elegance & slow craft.',
    introBody: 'An ethereal collection of open-weave crochet tops, handmade wool totes, and resort apparel woven by master women artisans.',
    heroImage: imgWomenswearHero,
    quote: '"Woven by hand, made to cherish."',
    heroPiece: {
      id: 'womens-hero-piece',
      title: 'Hand-Knotted Open Weave Crochet Top',
      price: 4299,
      mrp: 5499,
      fabric: '100% Mercerized Organic Cotton',
      description: 'Ethereal open-knit crochet jacket top with scalloped hem and tie-front closure.',
      image: imgCrochetTop,
    },
    fallbackProducts: [
      {
        id: 'womens-prod-1',
        name: 'Hand-Knotted Open Weave Crochet Top',
        price: 4299,
        mrp: 5499,
        category: 'Crochet' as any,
        productCategory: 'Crochet' as any,
        collection: 'Botanical',
        difficulty: 'Advanced',
        badge: 'Best Seller',
        images: [imgCrochetTop],
        description: 'Ethereal open-knit crochet jacket top with scalloped hem and tie-front closure.',
        story: 'Handmade by women artisan collectives in Uttar Pradesh using heirloom crochet techniques.',
        materialsIncluded: ['100% Mercerized Cotton'],
        estimatedTime: 'Handmade in 28 hrs',
        reviews: [],
        rating: 5.0,
        reviewCount: 42,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      },
      {
        id: 'womens-prod-2',
        name: 'Handcrafted Tapestry Wool & Leather Handbag',
        price: 4999,
        mrp: 6499,
        category: 'Handbag' as any,
        productCategory: 'Handbags' as any,
        collection: 'Cottage',
        difficulty: 'Intermediate',
        badge: 'Editor\'s Choice',
        images: [imgHandbag],
        description: 'Structured shoulder bag with hand-knitted wool front panel and brass hardware.',
        story: 'Combines traditional Himachal wool weave with modern leathercrafting.',
        materialsIncluded: ['Pure Wool', 'Grain Leather', 'Brass Clasp'],
        estimatedTime: 'Handmade in 22 hrs',
        reviews: [],
        rating: 4.9,
        reviewCount: 31,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      },
      {
        id: 'womens-prod-3',
        name: 'Heirloom Crochet One-Piece Resort Dress',
        price: 6999,
        mrp: 8999,
        category: 'Crochet' as any,
        productCategory: 'Crochet' as any,
        collection: 'Linen',
        difficulty: 'Advanced',
        badge: 'Limited',
        images: [imgHandbag2],
        description: 'Floor-length luxury resort dress with delicate floral motif crochet lattice.',
        story: 'Each dress is crafted by a single master artisan to preserve pattern continuity.',
        materialsIncluded: ['Organic Cotton Yarn'],
        estimatedTime: 'Handmade in 40 hrs',
        reviews: [],
        rating: 5.0,
        reviewCount: 18,
        stock: 'Low Stock',
        isHandmade: true,
        isSustainable: true
      },
      {
        id: 'womens-prod-4',
        name: 'Luxury Artisan Crochet Bikini & Cover-Up Set',
        price: 3799,
        mrp: 4799,
        category: 'Crochet' as any,
        productCategory: 'Crochet' as any,
        collection: 'Seasonal',
        difficulty: 'Intermediate',
        badge: 'New',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop'],
        description: 'Hand-crocheted luxury swimwear set with adjustable beaded side ties.',
        story: 'Water-friendly treated cotton yarn designed for resort lifestyle.',
        materialsIncluded: ['Water-Resistant Cotton Yarn', 'Wood Beads'],
        estimatedTime: 'Handmade in 18 hrs',
        reviews: [],
        rating: 4.8,
        reviewCount: 15,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      }
    ]
  }
};

export default function PremiumCollection() {
  const { id } = useParams<{ id: string }>();
  const collectionKey = (id || 'womenswear').toLowerCase();
  
  const config = COLLECTION_CONFIGS[collectionKey] || COLLECTION_CONFIGS['womenswear'];
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const addToCartMutation = useAddToCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [collectionKey]);

  useEffect(() => {
    setLoading(true);
    productService.getProducts({ limit: 100 })
      .then((res) => {
        const matches = res.products.filter(p => {
          const catStr = (p.category + ' ' + (p.productCategory || '') + ' ' + p.name + ' ' + (p.description || '')).toLowerCase();
          if (collectionKey === 'menswear') {
            return catStr.includes('men') || catStr.includes('shirt') || catStr.includes('denim') || catStr.includes('cap');
          } else {
            return catStr.includes('women') || catStr.includes('crochet') || catStr.includes('handbag') || catStr.includes('dress') || catStr.includes('top');
          }
        });

        if (matches.length > 0) {
          setProducts(matches);
        } else {
          setProducts(config.fallbackProducts);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching collection products:', err);
        setProducts(config.fallbackProducts);
        setLoading(false);
      });
  }, [collectionKey, config.fallbackProducts]);

  const handleQuickAdd = async (product: { id: string; name: string; price: number }, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
      });

      setAddedProductId(product.id);
      setTimeout(() => {
        setAddedProductId(null);
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to bag.');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return b.id.localeCompare(a.id);
  });

  const otherCollectionKey = collectionKey === 'menswear' ? 'womenswear' : 'menswear';
  const otherConfig = COLLECTION_CONFIGS[otherCollectionKey];

  return (
    <PageContainer disablePadding={true}>
      {/* ─────────────────────────────────────────────────────────────────────────────
          01 — CINEMATIC COLLECTION HERO (Full Viewport Height)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-[#1C1C1B] text-[#FAF9F7] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage}
            alt={config.heroTitle}
            className="w-full h-full object-cover object-center opacity-50 scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B] via-[#1C1C1B]/30 to-transparent" />
        </div>

        {/* Hero Content — Minimal & Spacious */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20">
          <ScrollReveal direction="up">
            <span className="inline-block font-sans text-[10px] tracking-[0.35em] uppercase text-[#A34A38] font-bold mb-4">
              {config.tag}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-light leading-[1.05] tracking-tight mb-6 text-white">
              {config.heroTitle}
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-neutral-300 font-light mb-10 max-w-xl mx-auto">
              {config.heroSubtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <a
              href="#collection-intro"
              className="inline-flex items-center gap-2 bg-[#FAF9F7] text-[#1C1C1B] px-8 py-3.5 rounded-full font-sans text-xs tracking-[0.22em] uppercase font-semibold hover:bg-[#A34A38] hover:text-white transition-all shadow-lg"
            >
              DISCOVER
              <ArrowDown size={14} />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          02 — SMALL COLLECTION INTRODUCTION (10-15% Viewport)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="collection-intro" className="py-16 md:py-20 px-6 bg-[#FAF9F7] text-center border-b border-[#E8E4DF]">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold">
              {config.tag}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1C1C1B] mt-2 mb-4">
              {config.introTitle}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-6">
              {config.introBody}
            </p>
            <a
              href="#featured-look"
              className="inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.2em] uppercase text-[#1C1C1B] font-medium border-b border-[#1C1C1B]/40 pb-0.5 hover:text-[#A34A38] hover:border-[#A34A38] transition-colors"
            >
              Explore the Edit <ChevronRight size={13} />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          03 — FEATURED LOOK / HERO PIECE (60/40 Asymmetric Split)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="featured-look" className="py-16 md:py-24 px-6 md:px-14 bg-[#F5EFE7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* 60% Large Editorial Image */}
            <div className="lg:col-span-7 aspect-[4/5] rounded-sm overflow-hidden bg-[#FAF9F7] relative shadow-md">
              <img
                src={config.heroPiece.image}
                alt={config.heroPiece.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-[#1C1C1B] text-white text-[9px] font-sans tracking-[0.2em] uppercase px-3 py-1 rounded-sm">
                THE HERO PIECE
              </div>
            </div>

            {/* 40% Featured Product Card */}
            <div className="lg:col-span-5 flex flex-col justify-center p-6 lg:p-8 bg-white border border-[#E8E4DF] rounded-sm shadow-sm">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#A34A38] font-bold mb-2">
                Signature Creation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1C1B] mb-3">
                {config.heroPiece.title}
              </h3>
              <p className="font-sans text-xs text-neutral-500 mb-4">
                Fabric: <strong className="text-[#1C1C1B]">{config.heroPiece.fabric}</strong>
              </p>
              <p className="font-sans text-xs text-neutral-600 font-light leading-relaxed mb-6">
                {config.heroPiece.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                <div>
                  <span className="font-sans text-xl font-semibold text-[#1C1C1B]">
                    ₹{config.heroPiece.price.toLocaleString()}
                  </span>
                  {config.heroPiece.mrp && (
                    <span className="font-sans text-xs text-neutral-400 line-through ml-2">
                      ₹{config.heroPiece.mrp.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleQuickAdd({ id: config.heroPiece.id, name: config.heroPiece.title, price: config.heroPiece.price }, e)}
                  disabled={addedProductId === config.heroPiece.id}
                  className={`px-5 py-2.5 rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center gap-2 transition-all ${
                    addedProductId === config.heroPiece.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#1C1C1B] text-white hover:bg-[#A34A38]'
                  }`}
                >
                  {addedProductId === config.heroPiece.id ? (
                    <>
                      <Check size={14} /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} /> View Piece
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          04 — CONTROLLED ASYMMETRIC PRODUCT SHOWCASE
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-14 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold">
              Controlled Edit
            </span>
            <h2 className="font-serif text-3xl font-light text-[#1C1C1B] mt-1">
              Curated Statements
            </h2>
          </div>

          {/* Staggered 3-Product Rhythm */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {sortedProducts.slice(0, 3).map((product, idx) => {
              // Asymmetric column span per item index
              const colSpan = idx === 0 ? 'md:col-span-5' : idx === 1 ? 'md:col-span-7' : 'md:col-span-12';
              const aspect = idx === 0 ? 'aspect-[3/4]' : idx === 1 ? 'aspect-[4/3]' : 'aspect-[16/9] md:aspect-[21/9]';

              return (
                <ScrollReveal key={product.id} direction="up" delay={idx * 0.1} className={colSpan}>
                  <div className="group relative bg-white border border-[#E8E4DF] rounded-sm overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
                    <Link to={`/shop/${product.id}`} className={`block relative ${aspect} overflow-hidden bg-[#F5EFE7]`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-[#1C1C1B] text-white text-[9px] font-sans tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm">
                          {product.badge}
                        </div>
                      )}
                    </Link>

                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#A34A38] font-medium mb-1">
                          {product.collection || 'Studio'} Collection
                        </p>
                        <Link to={`/shop/${product.id}`}>
                          <h3 className="font-serif text-xl font-normal text-[#1C1C1B] hover:text-[#A34A38] transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="text-right">
                        <span className="font-sans text-base font-semibold text-[#1C1C1B] block">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <Link
                          to={`/shop/${product.id}`}
                          className="inline-flex items-center gap-1 font-sans text-[10px] tracking-[0.15em] uppercase text-[#A34A38] font-semibold mt-1"
                        >
                          View Piece <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          05 — SECOND EDITORIAL MOMENT (Quote Break)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 bg-[#1C1C1B] text-[#FAF9F7] overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage}
            alt="Editorial Quote Background"
            className="w-full h-full object-cover object-center opacity-25"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#A34A38] font-bold block mb-4">
              ATELIER PHILOSOPHY
            </span>
            <p className="font-serif text-3xl sm:text-5xl font-light italic leading-snug text-white mb-6">
              {config.quote}
            </p>
            <div className="w-10 h-0.5 bg-[#A34A38] mx-auto opacity-50" />
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          06 — THE COMPLETE COLLECTION (Clean Shopping Grid)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-14 bg-[#F5EFE7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-12 border-b border-[#1C1C1B]/15 gap-4">
            <div>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold">
                FULL CATALOG
              </span>
              <h2 className="font-serif text-3xl font-light text-[#1C1C1B] mt-1">
                The Complete {collectionKey === 'menswear' ? 'Menswear' : 'Womenswear'} Collection
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-sans text-xs text-neutral-500 font-medium">
                {sortedProducts.length} Pieces
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-sans text-xs text-[#1C1C1B] font-semibold uppercase tracking-wider focus:outline-none border-b border-[#1C1C1B]/30 pb-0.5 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product, idx) => (
              <ScrollReveal key={product.id} direction="up" delay={idx * 0.05}>
                <div className="group bg-white rounded-sm border border-[#E8E4DF] overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-[3/4] bg-[#FAF9F7] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-[#A34A38] hover:bg-white transition-all shadow-sm"
                      aria-label="Add to Wishlist"
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">
                        {product.collection || 'Artisan'}
                      </p>
                      <Link to={`/shop/${product.id}`}>
                        <h3 className="font-serif text-lg font-normal text-[#1C1C1B] hover:text-[#A34A38] transition-colors leading-snug mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-3">
                      <span className="font-sans text-base font-semibold text-[#1C1C1B]">
                        ₹{product.price.toLocaleString()}
                      </span>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={addedProductId === product.id}
                        className={`px-3.5 py-2 rounded-sm font-sans text-[10px] tracking-[0.15em] uppercase font-semibold flex items-center gap-1.5 transition-all ${
                          addedProductId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#1C1C1B] text-white hover:bg-[#A34A38]'
                        }`}
                      >
                        {addedProductId === product.id ? (
                          <>
                            <Check size={13} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          CROSS-COLLECTION PROMPT
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#1C1C1B] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold block mb-2">
            CROSS COLLECTION
          </span>
          <h2 className="font-serif text-3xl font-light mb-4">
            Discover {otherConfig.tag}
          </h2>
          <p className="font-sans text-xs text-neutral-400 mb-6">
            {otherConfig.heroSubtitle}
          </p>
          <Link
            to={`/collection/${otherCollectionKey}`}
            className="inline-flex items-center gap-2 bg-[#FAF9F7] text-[#1C1C1B] px-7 py-3 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#A34A38] hover:text-white transition-all"
          >
            Explore {otherConfig.tag} <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
