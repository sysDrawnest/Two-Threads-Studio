import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Product } from '../data/products';
import { productService } from '../services/productService';
import { useAddToCart } from '../hooks/useCommerce';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ArrowRight, Heart, ShoppingBag, Check, Sparkles, SlidersHorizontal, ChevronRight } from 'lucide-react';

import imgCrochetTop from '../assets/Woman_wearing_crochet_jacket_2K_202608051414-Recovered.png';
import imgHandbag from '../assets/Woman_carrying_wool_handbag_2K_202607141446.jpeg';
import imgHandbag2 from '../assets/Woman_holding_wool_handbag_2K_202607141448.jpeg';

// Collection Configurations
interface CollectionConfig {
  id: string;
  title: string;
  subtitle: string;
  season: string;
  description: string;
  heroImage: string;
  craftHighlights: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    fabric: string;
    craftTime: string;
  }[];
  fallbackProducts: Product[];
}

const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  menswear: {
    id: 'menswear',
    title: "The Artisan Menswear Collection",
    subtitle: "REFINED TAILORING · ORGANIC FABRICS · EMBROIDERED ACCENTS",
    season: "AUTUMN / WINTER 2026",
    description: "Designed for the modern connoisseur. Each piece in our Menswear capsule bridges traditional Indian hand-loom craftsmanship with contemporary, relaxed silhouettes. Hand-stitched in limited studio batches.",
    heroImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=1600&auto=format&fit=crop',
    craftHighlights: [
      {
        title: "The Threaded Indigo Jacket",
        subtitle: "Hand-embroidered Motif Detail",
        description: "Crafted from 14oz raw selvedge denim, featuring intricate resham thread embroidery across the back yolk. Over 32 hours of manual artisan needlework.",
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
        fabric: "Raw Organic Selvedge Denim",
        craftTime: "32 Hours Needlework",
      },
      {
        title: "Artisan Linen Kurta Shirt",
        subtitle: "Handloom Organic Linen",
        description: "Woven in Bhagalpur using hand-spun organic linen yarn. Breathable, relaxed tailored cut with hand-carved wooden buttons.",
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
        fabric: "100% Handloom Linen",
        craftTime: "18 Hours Handloom",
      },
      {
        title: "Studio Cut Embroidered Cap",
        subtitle: "Botanical Crest Stitching",
        description: "Structured cotton twill cap featuring hand-guided botanical embroidery accents. Designed to complement our denim and outerwear capsule.",
        image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&auto=format&fit=crop',
        fabric: "Heavyweight Cotton Twill",
        craftTime: "8 Hours Stitching",
      }
    ],
    fallbackProducts: [
      {
        id: 'mens-prod-1',
        name: 'Hand-Embroidered Studio Shirt in Natural Indigo',
        price: 3499,
        mrp: 4499,
        category: 'Kit' as any,
        productCategory: 'Home Decor' as any,
        collection: 'Linen',
        difficulty: 'Advanced',
        badge: 'Best Seller',
        images: ['https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=800&auto=format&fit=crop'],
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
    title: "The Artisan Womenswear Collection",
    subtitle: "CROCHET LUXE · SILK EMBROIDERIES · RESORT & ARTISAN APPAREL",
    season: "SPRING / SUMMER 2026",
    description: "An ode to feminine grace and tactile artistry. Featuring intricate open-weave crochet tops, handmade luxury wool & cotton handbags, and ethereal embroidered heirloom garments.",
    heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
    craftHighlights: [
      {
        title: "The Hand-Knotted Crochet Top",
        subtitle: "Signature Open-Weave Silhouette",
        description: "Intricately hand-crocheted using 100% mercerized organic cotton yarn. Designed for breathable resort luxury with custom scalloped hems.",
        image: imgCrochetTop,
        fabric: "Mercerized Organic Cotton",
        craftTime: "28 Hours Hand Crochet",
      },
      {
        title: "Artisan Wool & Leather Tote",
        subtitle: "Hand-Knitted Wool Exterior",
        description: "Handcrafted structured handbag combining hand-loomed wool tapestry weave with veg-tanned genuine leather handles.",
        image: imgHandbag,
        fabric: "Pure Wool & Genuine Leather",
        craftTime: "22 Hours Artisan Looming",
      },
      {
        title: "Heirloom One-Piece Crochet Dress",
        subtitle: "Full-Length Resort Silhouette",
        description: "Floor-length open knit dress woven with metallic shimmer threads and pure organic cotton. Includes a matching slip dress.",
        image: imgHandbag2,
        fabric: "Cotton & Metallic Filament",
        craftTime: "40 Hours Master Crochet",
      }
    ],
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
  
  // Default to menswear or womenswear config
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
        // Filter products matching collection category
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

  const handleQuickAdd = async (product: Product, e: React.MouseEvent) => {
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
    <PageContainer>
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. CINEMATIC HERO SECTION
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center bg-[#1C1C1B] text-[#FAF9F7] overflow-hidden">
        {/* Background Image with Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage}
            alt={config.title}
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B] via-[#1C1C1B]/40 to-[#1C1C1B]/70" />
        </div>

        {/* Hero Text Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
          <ScrollReveal direction="up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#FAF9F7]/25 bg-white/5 backdrop-blur-md text-[10px] font-sans tracking-[0.3em] uppercase text-[#A34A38] font-semibold mb-6">
              <Sparkles size={12} />
              {config.season}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-light leading-[1.08] tracking-tight mb-6 text-white">
              {config.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-sans text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#FAF9F7]/70 font-medium mb-8 max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto mb-10">
              {config.description}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <a
              href="#shoppable-catalog"
              className="inline-flex items-center gap-3 bg-[#A34A38] text-white px-8 py-3.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#8B3E2E] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Shop Collection Below
              <ArrowRight size={15} />
            </a>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 text-[9px] font-sans tracking-[0.3em] uppercase flex flex-col items-center gap-2">
          <span>Scroll to Discover</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. CRAFTSMANSHIP & EDITORIAL LOOKBOOK HIGHLIGHTS
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-14 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold">
              Atelier Highlights
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1C1C1B] mt-2 mb-4">
              Mastery in Every Stitch
            </h2>
            <div className="w-12 h-0.5 bg-[#A34A38] mx-auto opacity-40" />
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {config.craftHighlights.map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={idx * 0.15}>
                <div className="group bg-white rounded-sm border border-[#E8E4DF] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F5EFE7]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-[#1C1C1B]/90 backdrop-blur-md text-white text-[9px] font-sans tracking-[0.2em] uppercase px-3 py-1 rounded-sm">
                      {item.craftTime}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#A34A38] font-medium mb-1">
                        {item.subtitle}
                      </p>
                      <h3 className="font-serif text-xl font-normal text-[#1C1C1B] mb-3">
                        {item.title}
                      </h3>
                      <p className="font-sans text-xs text-neutral-600 leading-relaxed font-light mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-sans text-neutral-500">
                      <span className="font-medium text-[#1C1C1B]">{item.fabric}</span>
                      <span className="text-[#A34A38] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-[10px] tracking-widest uppercase">
                        Explore <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. SHOPPABLE CATALOG GRID
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="shoppable-catalog" className="py-16 md:py-24 px-6 md:px-14 bg-[#F5EFE7]">
        <div className="max-w-7xl mx-auto">
          {/* Header & Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-[#1C1C1B]/15 gap-6">
            <div>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold">
                Curated Catalog
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1C1C1B] mt-1">
                Shop the {collectionKey === 'menswear' ? 'Menswear' : 'Womenswear'} Pieces
              </h2>
            </div>

            {/* Sort & Counter Controls */}
            <div className="flex items-center justify-between md:justify-end gap-6">
              <span className="font-sans text-xs text-neutral-600 font-medium">
                Showing <strong className="text-[#1C1C1B]">{sortedProducts.length}</strong> creations
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-sans text-xs text-[#1C1C1B] font-medium uppercase tracking-wider focus:outline-none border-b border-[#1C1C1B]/30 pb-0.5 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#A34A38] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-serif text-sm text-neutral-600 tracking-widest uppercase">
                Loading Studio Collection...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedProducts.map((product, idx) => (
                <ScrollReveal key={product.id} direction="up" delay={idx * 0.08}>
                  <div className="group relative bg-white rounded-sm border border-[#E8E4DF] overflow-hidden flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300">
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10 bg-[#1C1C1B] text-white text-[9px] font-sans tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm shadow-sm font-semibold">
                        {product.badge}
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-[#A34A38] hover:bg-white transition-all shadow-sm"
                      aria-label="Add to Wishlist"
                    >
                      <Heart size={15} />
                    </button>

                    {/* Image Container */}
                    <Link to={`/shop/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-[#FAF9F7]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    {/* Details Container */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between mb-1.5 text-[10px] font-sans tracking-widest uppercase text-neutral-400">
                          <span>{product.collection || 'Artisan'} Collection</span>
                          {product.rating && (
                            <span className="text-amber-700 font-medium">★ {product.rating}</span>
                          )}
                        </div>

                        <Link to={`/shop/${product.id}`}>
                          <h3 className="font-serif text-lg font-normal text-[#1C1C1B] hover:text-[#A34A38] transition-colors leading-snug mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-3">
                        <div>
                          <span className="font-sans text-base font-semibold text-[#1C1C1B]">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="font-sans text-xs text-neutral-400 line-through ml-2">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          )}
                        </div>

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
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. CROSS-COLLECTION EDITORIAL PROMPT BANNER
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-14 bg-[#1C1C1B] text-[#FAF9F7] relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold">
              Explore Next
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white mt-2 mb-4 leading-tight">
              {otherConfig.title}
            </h2>
            <p className="font-sans text-sm text-neutral-300 font-light leading-relaxed mb-8">
              {otherConfig.description}
            </p>
            <Link
              to={`/collection/${otherCollectionKey}`}
              className="inline-flex items-center gap-3 bg-[#FAF9F7] text-[#1C1C1B] px-7 py-3 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#A34A38] hover:text-white transition-all shadow-md"
            >
              Discover {otherCollectionKey === 'menswear' ? 'Menswear' : 'Womenswear'}
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={otherConfig.heroImage}
              alt={otherConfig.title}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1B]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#A34A38] font-semibold">
                {otherConfig.season}
              </span>
              <p className="font-serif text-lg font-light">{otherConfig.subtitle}</p>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
