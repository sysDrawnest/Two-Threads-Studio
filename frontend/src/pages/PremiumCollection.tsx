import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import { Product } from '../data/products';
import { productService } from '../services/productService';
import { useAddToCart } from '../hooks/useCommerce';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Diamond,
  Clock,
  Shield,
  Truck,
  MoveRight,
  Eye
} from 'lucide-react';

import imgCrochetTop from '../assets/Woman_wearing_crochet_jacket_2K_202608051414-Recovered.webp';
import imgHandbag from '../assets/Woman_carrying_wool_handbag_2K_202607141446.webp';
import imgHandbag2 from '../assets/Woman_holding_wool_handbag_2K_202607141448.webp';
import imgMenswearHero from '../assets/Man_wearing_linen_shirt_in_202608100224.jpeg';
import imgWomenswearHero from '../assets/Woman02608100225.jpeg';

// ─── CONFIGURATIONS ───
interface CollectionConfig {
  id: string;
  tag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  introTitle: string;
  introBody: string;
  heroImage: string;
  quote: string;
  quoteAuthor: string;
  heroPiece: {
    title: string;
    price: number;
    mrp?: number;
    fabric: string;
    description: string;
    image: string;
    id: string;
    craftsmanship: string[];
    details: string[];
  };
  fallbackProducts: Product[];
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    dark: string;
    gold: string;
  };
}

const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  menswear: {
    id: 'menswear',
    tag: 'MENSWEAR',
    heroTitle: 'The Art of Masculine Elegance',
    heroSubtitle: 'Where Heritage Meets Modernity',
    heroDescription: 'A curated collection of handcrafted garments that define the modern gentleman. Each piece tells a story of patience, precision, and timeless style.',
    introTitle: 'Crafted for the Discerning',
    introBody: 'In a world of mass production, we champion the art of slow craftsmanship. Every stitch, every weave, every finish is a testament to the artisans who dedicate their lives to perfection.',
    heroImage: imgMenswearHero,
    quote: '"True luxury is not about what you own, but how you feel wearing it."',
    quoteAuthor: '— Master Artisan, Two Threads Studio',
    heroPiece: {
      id: 'mens-hero-piece',
      title: 'The Heritage Indigo Linen Shirt',
      price: 3499,
      mrp: 4499,
      fabric: '100% Organic Handloom Linen',
      description: 'A masterclass in understated elegance. Handwoven by fifth-generation weavers, this shirt embodies the soul of Indian craftsmanship.',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop',
      craftsmanship: [
        'Hand-spun organic linen',
        'Natural indigo fermentation dye',
        'Hand-embroidered botanical motif',
        'Mother-of-pearl buttons'
      ],
      details: [
        'Relaxed contemporary fit',
        'Hand-rolled collar',
        'Artisan-stitched hem',
        'Reinforced seams'
      ]
    },
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
    ],
    colorPalette: {
      primary: '#1A1A1A',
      secondary: '#2C2C2C',
      accent: '#8B6B4D',
      light: '#F5F0EB',
      dark: '#0D0D0D',
      gold: '#C9A96E'
    }
  },
  womenswear: {
    id: 'womenswear',
    tag: 'WOMENSWEAR',
    heroTitle: 'Poetry in Thread & Form',
    heroSubtitle: 'Where Craft Meets Couture',
    heroDescription: 'An ethereal collection that celebrates the feminine spirit through the language of textiles. Each garment is a love letter to the hands that created it.',
    introTitle: 'The Language of Luxury',
    introBody: 'In an era of fleeting trends, we create pieces that transcend seasons. Our womenswear is a dialogue between tradition and modernity, crafted for women who value authenticity.',
    heroImage: imgWomenswearHero,
    quote: '"Adorn yourself in stories, not just fabrics."',
    quoteAuthor: '— Creative Director, Two Threads Studio',
    heroPiece: {
      id: 'womens-hero-piece',
      title: 'The Ethereal Crochet Jacket',
      price: 4299,
      mrp: 5499,
      fabric: '100% Mercerized Organic Cotton',
      description: 'An open-knit masterpiece that dances between transparency and texture. Hand-knotted with the precision of centuries-old techniques.',
      image: imgCrochetTop,
      craftsmanship: [
        'Hand-knotted open weave',
        'Mercerized organic cotton',
        'Artisan scalloped hem',
        'Hand-tied silk closures'
      ],
      details: [
        'Flowing silhouette',
        'Adjustable tie-front',
        'Intricate lattice pattern',
        'Fringe detailing'
      ]
    },
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
        reviewCount: 15,
        stock: 'In Stock',
        isHandmade: true,
        isSustainable: true
      }
    ],
    colorPalette: {
      primary: '#1C1814',
      secondary: '#2A241F',
      accent: '#A67B5B',
      light: '#F8F4F0',
      dark: '#0A0807',
      gold: '#D4AF37'
    }
  }
};

// ─── LUXURY COMPONENTS ───

const LuxuryBadge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C9A96E]/30 bg-[#C9A96E]/5 rounded-full">
    <Diamond className="w-3 h-3 text-[#C9A96E]" />
    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#C9A96E] font-medium">
      {text}
    </span>
  </div>
);

const DividerLine = () => (
  <div className="flex items-center justify-center gap-4 py-4">
    <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C9A96E]/30" />
    <Diamond className="w-3 h-3 text-[#C9A96E]/40" />
    <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C9A96E]/30" />
  </div>
);

// ─── MAIN COMPONENT ───

export default function PremiumCollection() {
  const { id } = useParams<{ id: string }>();
  const collectionKey = (id || 'womenswear').toLowerCase();
  const config = COLLECTION_CONFIGS[collectionKey] || COLLECTION_CONFIGS['womenswear'];
  const { colorPalette } = config;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState<Record<string, boolean>>({});

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

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
      .catch(() => {
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
      setTimeout(() => setAddedProductId(null), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to bag.');
    }
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
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
      {/* ═══════════════════════════════════════════════════════════════════
          01 — CINEMATIC HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          <img
            src={config.heroImage}
            alt={config.heroTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0807]/60 via-[#0A0807]/30 to-[#0A0807]" />
        </motion.div>

        {/* Heritage Watermark */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <span className="font-serif text-[20vw] font-bold tracking-widest text-white whitespace-nowrap">
            {config.tag}
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#C9A96E]/40" />
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] font-medium">
                {config.tag}
              </span>
              <div className="w-12 h-px bg-[#C9A96E]/40" />
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-white leading-[1.05] tracking-tight mb-6">
              {config.heroTitle}
            </h1>

            <p className="font-serif text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
              {config.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#collection-intro"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 bg-[#C9A96E] text-[#0A0807] px-10 py-4 rounded-full font-sans text-xs tracking-[0.25em] uppercase font-semibold hover:bg-white transition-all shadow-2xl shadow-[#C9A96E]/20"
              >
                <span>Discover the Collection</span>
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                href="#featured-look"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 rounded-full font-sans text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/10 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>View Masterpiece</span>
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <ChevronDown className="w-6 h-6 text-white/30 animate-bounce" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          02 — INTRODUCTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="collection-intro" className="py-24 px-6 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal direction="left">
                <div className="space-y-6">
                  <LuxuryBadge text="Atelier Philosophy" />

                  <h2 className="font-serif text-4xl lg:text-5xl font-light text-[#1A1A1A] leading-[1.1]">
                    {config.introTitle}
                  </h2>

                  <p className="font-sans text-base text-[#4A4A4A] leading-relaxed">
                    {config.introBody}
                  </p>

                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-[#C9A96E]/30 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#C9A96E]" />
                      </div>
                      <div>
                        <p className="font-sans text-xs font-semibold text-[#1A1A1A]">Slow Craft</p>
                        <p className="font-sans text-[10px] text-[#4A4A4A]">Handmade with patience</p>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-[#1A1A1A]/10" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-[#C9A96E]/30 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[#C9A96E]" />
                      </div>
                      <div>
                        <p className="font-sans text-xs font-semibold text-[#1A1A1A]">Heirloom Quality</p>
                        <p className="font-sans text-[10px] text-[#4A4A4A]">Made to last generations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7">
              <ScrollReveal direction="right">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#C9A96E]/5 rounded-sm" />
                  <div className="relative bg-white p-4 rounded-sm shadow-sm">
                    <img
                      src={config.heroPiece.image}
                      alt="Craftsmanship Detail"
                      className="w-full h-[400px] object-cover rounded-sm"
                    />
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#C9A96E] font-semibold">
                            Signature Piece
                          </p>
                          <p className="font-serif text-lg text-[#1A1A1A]">
                            {config.heroPiece.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm font-semibold text-[#C9A96E]">
                            ₹{config.heroPiece.price.toLocaleString()}
                          </span>
                          {config.heroPiece.mrp && (
                            <span className="font-sans text-xs text-[#4A4A4A] line-through">
                              ₹{config.heroPiece.mrp.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          03 — FEATURED MASTERPIECE
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="featured-look" className="py-24 px-6 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Gallery */}
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-sm overflow-hidden bg-[#2C2C2C]">
                  <img
                    src={config.heroPiece.image}
                    alt={config.heroPiece.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Navigation */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === idx
                          ? 'w-8 bg-[#C9A96E]'
                          : 'bg-white/40 hover:bg-white/60'
                        }`}
                    />
                  ))}
                </div>

                {/* Luxury Badge */}
                <div className="absolute top-6 left-6">
                  <div className="bg-[#0A0807]/80 backdrop-blur-sm border border-[#C9A96E]/30 px-4 py-2 rounded-full">
                    <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#C9A96E] font-medium">
                      Masterpiece Collection
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Product Details */}
            <ScrollReveal direction="right">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#C9A96E] font-medium">
                      {config.tag} • Signature
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="w-3 h-3 text-[#C9A96E] fill-[#C9A96E]/20" />
                      ))}
                    </div>
                  </div>

                  <h2 className="font-serif text-4xl lg:text-5xl font-light text-white leading-[1.1] mb-4">
                    {config.heroPiece.title}
                  </h2>

                  <p className="font-sans text-base text-white/60 leading-relaxed mb-6">
                    {config.heroPiece.description}
                  </p>

                  <div className="flex items-center gap-4 mb-8">
                    <span className="font-sans text-2xl font-light text-[#C9A96E]">
                      ₹{config.heroPiece.price.toLocaleString()}
                    </span>
                    {config.heroPiece.mrp && (
                      <span className="font-sans text-sm text-white/30 line-through">
                        ₹{config.heroPiece.mrp.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[10px] font-sans text-white/40 tracking-wider uppercase border border-white/10 px-3 py-1 rounded-full">
                      Tax included
                    </span>
                  </div>
                </div>

                {/* Craftsmanship Details */}
                <div className="grid grid-cols-2 gap-4 p-6 border border-white/10 rounded-sm bg-white/5">
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2">
                      Craftsmanship
                    </p>
                    <ul className="space-y-1.5">
                      {config.heroPiece.craftsmanship.map((item, idx) => (
                        <li key={idx} className="font-sans text-xs text-white/70 flex items-start gap-2">
                          <span className="text-[#C9A96E] mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2">
                      Details
                    </p>
                    <ul className="space-y-1.5">
                      {config.heroPiece.details.map((item, idx) => (
                        <li key={idx} className="font-sans text-xs text-white/70 flex items-start gap-2">
                          <span className="text-[#C9A96E] mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    onClick={(e) => handleQuickAdd({ id: config.heroPiece.id, name: config.heroPiece.title, price: config.heroPiece.price }, e)}
                    disabled={addedProductId === config.heroPiece.id}
                    className={`flex-1 min-w-[180px] px-8 py-4 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-3 transition-all ${addedProductId === config.heroPiece.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#C9A96E] text-[#0A0807] hover:bg-white'
                      }`}
                  >
                    {addedProductId === config.heroPiece.id ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Bag
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => toggleWishlist(config.heroPiece.id, e)}
                    className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors group"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isWishlisted[config.heroPiece.id]
                        ? 'fill-red-500 text-red-500'
                        : 'text-white/40 group-hover:text-white'
                      }`} />
                  </button>
                </div>

                <DividerLine />

                <div className="flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C9A96E]" />
                    <span>Complimentary shipping</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C9A96E]" />
                    <span>Handmade in 24-48 hrs</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          04 — QUOTE BREAK
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 bg-[#0A0807] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #C9A96E 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-[#C9A96E]/30" />
              <Diamond className="w-4 h-4 text-[#C9A96E]/40" />
              <div className="w-16 h-px bg-[#C9A96E]/30" />
            </div>

            <p className="font-serif text-3xl md:text-5xl font-light italic text-white/90 leading-relaxed">
              "{config.quote}"
            </p>

            <p className="font-sans text-sm text-white/40 tracking-wider mt-6">
              {config.quoteAuthor}
            </p>

            <DividerLine />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          05 — COMPLETE COLLECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-12 border-b border-[#1A1A1A]/10 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C9A96E] font-medium">
                  Full Catalog
                </span>
                <div className="w-8 h-px bg-[#C9A96E]/30" />
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-light text-[#1A1A1A]">
                The Complete Collection
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-sans text-xs text-[#4A4A4A] font-medium">
                {sortedProducts.length} pieces
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-sans text-xs text-[#1A1A1A] font-semibold uppercase tracking-wider focus:outline-none border-b border-[#1A1A1A]/20 pb-1 pr-6 cursor-pointer appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#1A1A1A]/40 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, idx) => (
              <ScrollReveal key={product.id} direction="up" delay={idx * 0.05}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-sm border border-[#E8E4DF] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <Link to={`/shop/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] bg-[#FAF9F7] overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[9px] font-sans tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm">
                          {product.badge}
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isWishlisted[product.id]
                            ? 'fill-red-500 text-red-500'
                            : 'text-[#1A1A1A]/40 group-hover:text-[#1A1A1A]'
                          }`} />
                      </button>

                      {/* Quick View */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <button className="w-full py-3 bg-white text-[#1A1A1A] font-sans text-[10px] tracking-[0.2em] uppercase font-semibold rounded-sm hover:bg-[#C9A96E] hover:text-white transition-colors">
                          Quick View
                        </button>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#4A4A4A] mb-1">
                      {product.collection || 'Artisan'}
                    </p>
                    <Link to={`/shop/${product.id}`}>
                      <h3 className="font-serif text-lg font-light text-[#1A1A1A] hover:text-[#C9A96E] transition-colors leading-snug mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DF]">
                      <div>
                        <span className="font-sans text-base font-semibold text-[#1A1A1A]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.mrp && (
                          <span className="font-sans text-xs text-[#4A4A4A] line-through ml-2">
                            ₹{product.mrp.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={addedProductId === product.id}
                        className={`px-4 py-2.5 rounded-full font-sans text-[9px] tracking-[0.15em] uppercase font-semibold transition-all ${addedProductId === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1A1A1A] text-white hover:bg-[#C9A96E]'
                          }`}
                      >
                        {addedProductId === product.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          'Add'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          06 — CROSS-COLLECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 bg-[#0A0807] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #C9A96E 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up">
            <LuxuryBadge text="Cross Collection" />

            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mt-6 mb-4">
              Discover {otherConfig.tag}
            </h2>

            <p className="font-sans text-base text-white/50 max-w-md mx-auto mb-8">
              {otherConfig.heroSubtitle}
            </p>

            <Link
              to={`/collection/${otherCollectionKey}`}
              className="group inline-flex items-center gap-3 bg-[#C9A96E] text-[#0A0807] px-10 py-4 rounded-full font-sans text-xs tracking-[0.25em] uppercase font-semibold hover:bg-white transition-all shadow-2xl shadow-[#C9A96E]/20"
            >
              <span>Explore {otherConfig.tag}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </PageContainer>
  );
}