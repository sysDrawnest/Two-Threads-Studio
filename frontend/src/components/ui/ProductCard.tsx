import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../data/products';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const badgeConfig: Record<string, { bg: string; text: string; label: string }> = {
  'Best Seller': { bg: 'bg-[#A34A38]', text: 'text-white', label: 'Best Seller' },
  'New': { bg: 'bg-[#2d5a27]', text: 'text-white', label: 'New' },
  'Limited': { bg: 'bg-[#2d2520]', text: 'text-[#f4ebd9]', label: 'Limited' },
  "Editor's Choice": { bg: 'bg-[#735947]', text: 'text-white', label: "Editor's Choice" },
  'Trending': { bg: 'bg-[#8a6a3b]', text: 'text-white', label: 'Trending' },
};

const stockConfig = {
  'In Stock': { dot: 'bg-emerald-500', label: 'In Stock' },
  'Low Stock': { dot: 'bg-amber-500', label: 'Low Stock' },
  'Out of Stock': { dot: 'bg-red-400', label: 'Out of Stock' },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPct = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const stock = product.stock ?? 'In Stock';
  const stockCfg = stockConfig[stock];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted((prev) => !prev);
  };

  return (
    <Link
      to={`/shop/${product.id}`}
      className={`group block bg-white cursor-pointer no-underline ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-[4/5] relative overflow-hidden bg-[#f4f2ee]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200 z-20"
        >
          <Heart
            size={14}
            className={`transition-colors duration-200 ${
              wishlisted ? 'fill-[#A34A38] text-[#A34A38]' : 'text-neutral-500'
            }`}
          />
        </button>

        {/* Badges — top left stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
          {product.badge && badgeConfig[product.badge] && (
            <span
              className={`${badgeConfig[product.badge].bg} ${badgeConfig[product.badge].text} text-[8px] tracking-[0.12em] px-2 py-0.5 uppercase font-sans font-medium`}
            >
              {badgeConfig[product.badge].label}
            </span>
          )}
          {product.isPersonalizable && (
            <span className="bg-[#e8f0fe] text-[#1a56db] text-[8px] tracking-[0.12em] px-2 py-0.5 uppercase font-sans font-medium">
              Personalizable
            </span>
          )}
          {product.isHandmade && !product.badge && (
            <span className="bg-[#f4ebd9] text-[#A34A38] text-[8px] tracking-[0.12em] px-2 py-0.5 uppercase font-sans font-medium">
              Handmade
            </span>
          )}
          {discountPct >= 10 && (
            <span className="bg-[#A34A38] text-white text-[8px] tracking-[0.12em] px-2 py-0.5 uppercase font-sans font-medium">
              {discountPct}% off
            </span>
          )}
        </div>

        {/* Hover action bar */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 z-20 flex"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Quick View — future modal hook
                }}
                aria-label="Quick view"
                className="flex-none w-11 flex items-center justify-center bg-white/95 border-r border-neutral-100 hover:bg-[#f4ebd9] transition-colors duration-150 py-3"
              >
                <Eye size={14} className="text-[#2d2520]" />
              </button>
              <button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className="flex-1 flex items-center justify-center gap-2 bg-[#2d2520] hover:bg-[#A34A38] transition-colors duration-200 py-3"
              >
                <ShoppingBag size={12} className="text-[#f4ebd9]" />
                <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#f4ebd9] font-medium">
                  {addedToCart ? 'Added ✓' : 'Add to Cart'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-black/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Card Info */}
      <div className="p-4 sm:p-5 border border-neutral-100 border-t-0">
        {/* Rating & Stock row */}
        <div className="flex items-center justify-between mb-2">
          {product.rating !== undefined ? (
            <div className="flex items-center gap-1">
              <Star size={10} className="fill-[#c4973a] text-[#c4973a]" />
              <span className="font-sans text-[10px] text-neutral-500">
                {product.rating.toFixed(1)}
                {product.reviewCount !== undefined && (
                  <span className="ml-0.5 text-neutral-400">({product.reviewCount})</span>
                )}
              </span>
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${stockCfg.dot}`} />
            <span className="font-sans text-[9px] text-neutral-400 tracking-wide">
              {stockCfg.label}
            </span>
          </div>
        </div>

        {/* Product name */}
        <p className="font-serif text-sm sm:text-[15px] text-[#1C1C1B] leading-snug group-hover:text-[#A34A38] transition-colors duration-200 mb-2">
          {product.name}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-sm sm:text-[15px] font-semibold text-[#1C1C1B]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className="font-sans text-[11px] text-neutral-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Trait pills */}
        {(product.isHandmade || product.isSustainable) && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.isHandmade && (
              <span className="font-sans text-[8px] tracking-wide text-[#735947] border border-[#d2c4bc] px-1.5 py-0.5 uppercase">
                Handmade
              </span>
            )}
            {product.isSustainable && (
              <span className="font-sans text-[8px] tracking-wide text-[#3a6b3a] border border-[#c6d9c6] px-1.5 py-0.5 uppercase">
                Sustainable
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
