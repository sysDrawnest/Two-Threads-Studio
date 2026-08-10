import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Product } from '../data/products';
import { productService } from '../services/productService';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../hooks/useCommerce';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ArrowRight, Heart, ArrowDown, SlidersHorizontal, X } from 'lucide-react';

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
  statementTitle: string;
  statementHeadline: string;
  statementBody: string;
  heroImage: string;
  fallbackProducts: Product[];
}

const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  menswear: {
    id: 'menswear',
    tag: 'MENSWEAR',
    heroTitle: 'MENSWEAR COLLECTION',
    heroSubtitle: 'Crafted for those who appreciate the uncommon.',
    statementTitle: 'MENSWEAR',
    statementHeadline: 'Crafted for presence.',
    statementBody: 'A considered collection of handwoven garments, where traditional Indian handloom and embroidery techniques meet contemporary silhouette and quiet authority.',
    heroImage: imgMenswearHero,
    fallbackProducts: [
      {
        id: 'mens-prod-1',
        name: 'The Heritage Indigo Linen Shirt',
        price: 3499,
        mrp: 4499,
        category: 'Kit' as any,
        productCategory: 'Home Decor' as any,
        collection: 'Heritage' as any,
        difficulty: 'Advanced',
        badge: 'Masterpiece' as any,
        images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop'],
        description: 'A masterclass in understated elegance. Handwoven by fifth-generation weavers.',
        story: 'Each shirt carries the fingerprint of its maker, ensuring no two are exactly alike.',
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
        name: 'The Artisan Selvedge Denim Jacket',
        price: 5999,
        mrp: 7499,
        category: 'Kit' as any,
        collection: 'Heritage' as any,
        difficulty: 'Advanced',
        badge: 'Limited' as any,
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
        name: 'The Modernist Relaxed Trousers',
        price: 3999,
        mrp: 4999,
        category: 'Kit' as any,
        collection: 'Cottage' as any,
        difficulty: 'Intermediate',
        badge: 'New' as any,
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
        name: 'The Botanical Crest Cap',
        price: 1499,
        mrp: 1899,
        category: 'Kit' as any,
        collection: 'Botanical' as any,
        difficulty: 'Beginner',
        badge: 'Trending' as any,
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
    heroSubtitle: 'Contemporary heirloom pieces woven with grace.',
    statementTitle: 'WOMENSWEAR',
    statementHeadline: 'Made to be remembered.',
    statementBody: 'An editorial collection of hand-embroidered, crochet, and heirloom pieces designed to command the room with timeless grace.',
    heroImage: imgWomenswearHero,
    fallbackProducts: [
      {
        id: 'womens-prod-1',
        name: 'The Ethereal Crochet Jacket',
        price: 4299,
        mrp: 5499,
        category: 'Crochet' as any,
        productCategory: 'Crochet' as any,
        collection: 'Cottage' as any,
        difficulty: 'Advanced',
        badge: 'Limited' as any,
        images: [imgCrochetTop],
        description: 'An open-knit masterpiece that dances between transparency and texture.',
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
        name: 'The Tapestry Leather Handbag',
        price: 4999,
        mrp: 6499,
        category: 'Handbag' as any,
        productCategory: 'Handbags' as any,
        collection: 'Linen' as any,
        difficulty: 'Intermediate',
        badge: 'Trending' as any,
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
        name: 'The Heirloom Resort Dress',
        price: 6999,
        mrp: 8999,
        category: 'Crochet' as any,
        productCategory: 'Crochet' as any,
        collection: 'Seasonal' as any,
        difficulty: 'Advanced',
        badge: 'Limited' as any,
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
        name: 'The Artisan Crochet Bikini Set',
        price: 3799,
        mrp: 4799,
        category: 'Crochet' as any,
        productCategory: 'Crochet' as any,
        collection: 'Wellness' as any,
        difficulty: 'Intermediate',
        badge: 'New' as any,
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop'],
        description: 'Hand-crocheted luxury swimwear set with adjustable beaded side ties.',
        story: 'Water-friendly treated cotton yarn designed for resort lifestyle.',
        materialsIncluded: ['Water-Resistant Cotton Yarn', 'Wood Beads'],
        estimatedTime: 'Handmade in 18 hrs',
        reviews: [],
        rating: 4.8,
        reviewCount: 29,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      }
    ]
  }
};

// ─── Fashion Product Card (Quiet Luxury Design) ───
interface FashionProductCardProps {
  product: Product;
  aspectRatio?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
}

const FashionProductCard: React.FC<FashionProductCardProps> = ({
  product,
  aspectRatio = 'aspect-[3/4]',
  isWishlisted = false,
  onToggleWishlist,
}) => {
  return (
    <Link to={`/shop/${product.id}`} className="group block text-left font-sans cursor-pointer">
      <div className={`relative w-full ${aspectRatio} bg-[#F5EFE7] overflow-hidden mb-3 md:mb-4`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {onToggleWishlist && (
          <button
            onClick={onToggleWishlist}
            aria-label="Toggle Wishlist"
            className="absolute top-3 right-3 z-10 p-2 text-[#1C1C1B]/60 hover:text-[#A34A38] transition-colors"
          >
            <Heart
              size={18}
              className={isWishlisted ? 'fill-[#A34A38] text-[#A34A38]' : 'stroke-[1.5]'}
            />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
          {product.collection || product.productCategory || 'Artisan'}
        </p>
        <h3 className="font-serif text-lg md:text-xl font-normal text-[#1C1C1B] leading-snug group-hover:text-[#A34A38] transition-colors">
          {product.name}
        </h3>
        {product.materialsIncluded?.[0] && (
          <p className="font-sans text-xs text-neutral-500 font-light">
            {product.materialsIncluded[0]}
          </p>
        )}
        <p className="font-sans text-sm md:text-base font-normal text-[#1C1C1B] pt-0.5">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default function PremiumCollection() {
  const location = useLocation();
  const params = useParams<{ id?: string; category?: string }>();
  const rawParam = params.id || params.category || location.pathname;
  const collectionKey = rawParam.toLowerCase().includes('women') ? 'womenswear' : 'menswear';
  const config = COLLECTION_CONFIGS[collectionKey];

  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Wishlist integration
  const { data: wishlistItems } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted = (productId: string) => {
    return wishlistItems?.some((item: any) => item.productId === productId);
  };

  const handleToggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted(productId)) {
      const item = wishlistItems?.find((i: any) => i.productId === productId);
      if (item) {
        removeFromWishlist.mutate(item.id);
      }
    } else {
      addToWishlist.mutate(productId);
    }
  };

  // Fetch catalog products or fallback
  useEffect(() => {
    let isMounted = true;
    productService.getProducts({ limit: 30 })
      .then((res) => {
        if (!isMounted) return;
        if (res.products && res.products.length > 0) {
          const matching = res.products.filter((p) => {
            const str = (p.name + ' ' + (p.collection || '') + ' ' + (p.productCategory || '') + ' ' + (p.category || '')).toLowerCase();
            if (collectionKey === 'menswear') {
              return str.includes('men') || str.includes('shirt') || str.includes('jacket') || str.includes('trouser') || str.includes('cap');
            }
            return str.includes('women') || str.includes('dress') || str.includes('crochet') || str.includes('handbag') || str.includes('top') || str.includes('bikini');
          });
          setProducts(matching.length > 0 ? matching : config.fallbackProducts);
        } else {
          setProducts(config.fallbackProducts);
        }
      })
      .catch(() => {
        if (isMounted) setProducts(config.fallbackProducts);
      });

    return () => {
      isMounted = false;
    };
  }, [collectionKey, config.fallbackProducts]);

  const activeProducts = products.length > 0 ? products : config.fallbackProducts;

  // Filter & Sort
  const filteredProducts = activeProducts
    .filter((p) => {
      if (selectedCategory === 'ALL') return true;
      const cat = p.productCategory || p.category;
      return String(cat).toLowerCase().includes(selectedCategory.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.id.localeCompare(a.id);
    });

  // Top 4 products for "THE EDIT"
  const editProducts = activeProducts.slice(0, 4);

  const otherCollectionKey = collectionKey === 'menswear' ? 'womenswear' : 'menswear';
  const otherConfig = COLLECTION_CONFIGS[otherCollectionKey];

  const categories = ['ALL', 'Crochet', 'Embroidery', 'Linen', 'Home Decor'];

  return (
    <PageContainer disablePadding={true}>
      {/* ─────────────────────────────────────────────────────────────────────────────
          UNTOUCHED CINEMATIC HERO BANNER (Preserved 100% as approved)
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

        {/* Hero Content */}
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
              href="#collection-statement"
              className="inline-flex items-center gap-2 bg-[#FAF9F7] text-[#1C1C1B] px-8 py-3.5 rounded-full font-sans text-xs tracking-[0.22em] uppercase font-semibold hover:bg-[#A34A38] hover:text-white transition-all shadow-lg"
            >
              DISCOVER
              <ArrowDown size={14} />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          01 — COLLECTION STATEMENT (Quiet Editorial Introduction)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="collection-statement" className="py-20 md:py-28 px-6 bg-[#FAF9F7] text-left md:text-center">
        <div className="max-w-xl mx-auto">
          <ScrollReveal direction="up">
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#A34A38] font-bold block mb-3">
              {config.statementTitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B] tracking-tight leading-tight mb-4">
              {config.statementHeadline}
            </h2>
            <p className="font-serif text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
              {config.statementBody}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          02 — THE EDIT (Primary Visual Showcase, 4 Top Pieces)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-14 bg-[#FAF9F7] border-t border-[#E8E4DF]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <ScrollReveal direction="up">
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#A34A38] font-bold block mb-1">
                CURATED HIGHLIGHTS
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1C1C1B]">
                THE EDIT
              </h2>
            </ScrollReveal>
          </div>

          {/* Clean Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-24">
            {editProducts.map((product, idx) => (
              <ScrollReveal key={product.id} direction="up" delay={idx * 0.1}>
                <FashionProductCard
                  product={product}
                  aspectRatio="aspect-[4/5]"
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={(e) => handleToggleWishlist(product.id, e)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          03 — FULL COLLECTION (Restrained Boutique Grid)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-14 bg-[#F5EFE7]">
        <div className="max-w-7xl mx-auto">
          {/* Header & Controls */}
          <div className="flex flex-row items-end justify-between pb-6 mb-10 md:mb-14 border-b border-[#1C1C1B]/15 gap-4">
            <div>
              <h2 className="font-serif text-2xl md:text-4xl font-light text-[#1C1C1B]">
                THE COLLECTION
              </h2>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium mt-1 block">
                {filteredProducts.length} PIECES
              </span>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-sans text-xs tracking-[0.15em] uppercase pb-0.5 transition-all ${
                      selectedCategory === cat
                        ? 'text-[#1C1C1B] font-semibold border-b border-[#1C1C1B]'
                        : 'text-neutral-400 hover:text-[#1C1C1B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="bg-transparent font-sans text-xs text-[#1C1C1B] font-semibold uppercase tracking-wider focus:outline-none border-b border-[#1C1C1B]/30 pb-0.5 cursor-pointer ml-4"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 font-sans text-xs tracking-[0.18em] uppercase text-[#1C1C1B] font-medium border border-[#1C1C1B]/30 px-3.5 py-2 rounded-none"
            >
              <SlidersHorizontal size={14} />
              <span>FILTER / SORT</span>
            </button>
          </div>

          {/* Product Grid: 3-column desktop, 2-column mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-10 md:gap-y-16">
            {filteredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} direction="up" delay={(idx % 3) * 0.05}>
                <FashionProductCard
                  product={product}
                  aspectRatio="aspect-[3/4]"
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={(e) => handleToggleWishlist(product.id, e)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          04 — COLLECTION DISCOVERY (Understated Fashion House Ending with Footer Breathing Room)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-32 md:pt-28 md:pb-44 px-6 md:px-14 bg-[#FAF9F7] border-t border-[#E8E4DF]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Editorial Image Side with Softened Rounded Edges & Breathing Room */}
            <div className="md:col-span-6 aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-[#F5EFE7] rounded-2xl shadow-sm border border-[#E8E4DF]/80">
              <img
                src={otherConfig.heroImage}
                alt={otherConfig.tag}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Editorial Text Side */}
            <div className="md:col-span-6 md:pl-8 flex flex-col items-start justify-center">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] font-bold mb-2">
                EXPLORE THE OTHER COLLECTION
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1C1C1B] mb-3">
                {otherConfig.tag}
              </h2>
              <p className="font-serif text-base text-neutral-600 font-normal leading-relaxed mb-6 max-w-md">
                {otherConfig.statementHeadline} {otherConfig.heroSubtitle}
              </p>
              <Link
                to={`/collection/${otherCollectionKey}`}
                className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.22em] uppercase font-semibold text-[#1C1C1B] border-b border-[#1C1C1B] pb-1 hover:text-[#A34A38] hover:border-[#A34A38] transition-colors"
              >
                <span>Explore {otherConfig.tag}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Mobile Filter/Sort Drawer ── */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FAF9F7] h-full shadow-2xl z-10 flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DF] mb-6">
                <h3 className="font-serif text-xl font-light text-[#1C1C1B]">Filter &amp; Sort</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-neutral-500 hover:text-black p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#A34A38] font-bold mb-3">
                  Category
                </h4>
                <div className="flex flex-col gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                      }}
                      className={`text-left font-sans text-xs tracking-wider uppercase py-1 ${
                        selectedCategory === cat ? 'text-[#1C1C1B] font-bold' : 'text-neutral-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#A34A38] font-bold mb-3">
                  Sort By
                </h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Newest', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value as any);
                      }}
                      className={`text-left font-sans text-xs tracking-wider uppercase py-1 ${
                        sortBy === opt.value ? 'text-[#1C1C1B] font-bold' : 'text-neutral-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-[#1C1C1B] text-white font-sans text-xs tracking-[0.2em] uppercase py-3.5 font-semibold hover:bg-[#A34A38] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
