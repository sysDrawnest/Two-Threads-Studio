import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Product } from '../data/products';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCartStore } from '../store/cartStore';
import { useAddToCart } from '../hooks/useCommerce';
import { ThumbsUp, ThumbsDown, CheckCircle, Star, Image, MessageSquare, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const addToCartMutation = useAddToCart();
  const setCartOpen = useCartStore(state => state.setCartOpen);

  // Customization States
  const [hoopFinish, setHoopFinish] = useState<'bamboo' | 'walnut'>('bamboo');
  const [hasEngraving, setHasEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingFont, setEngravingFont] = useState<'serif' | 'sans' | 'script'>('serif');
  const [hasGiftWrap, setHasGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Reviews state
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsSort, setReviewsSort] = useState('helpful');
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [filterHasMedia, setFilterHasMedia] = useState(false);

  const fetchReviews = async (pId: string, pageNum = 1, sortBy = 'helpful', hasMedia = false) => {
    try {
      setReviewsLoading(true);
      const res: any = await reviewService.getProductReviews(pId, { page: pageNum, sort: sortBy, hasMedia, limit: 6 });
      if (res.success) {
        setReviewsData(res.reviews ? res : res.data || res);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService.getProductBySlug(id)
      .then(data => {
        setProduct(data);
        setActiveImage(0);

        // Fetch reviews
        fetchReviews(data.id, 1, 'helpful', false);

        productService.getProducts({ limit: 20 })
          .then(res => {
            const matches = res.products.filter(p => p.id !== data.id && (p.category === data.category || p.collection === data.collection));
            setRelatedProducts(matches.slice(0, 3));
          })
          .catch(err => console.error('Error fetching related products:', err));

        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading product details:', err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id, reviewsPage, reviewsSort, filterHasMedia);
    }
  }, [reviewsPage, reviewsSort, filterHasMedia, product?.id]);

  const handleVoteHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      const res = await reviewService.voteHelpful(reviewId, isHelpful);
      if (res.success && product) {
        toast.success('Thank you for your feedback!');
        fetchReviews(product.id, reviewsPage, reviewsSort, filterHasMedia);
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication required to vote on reviews');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col items-center justify-center p-6">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 rounded-full border border-neutral-200" />
            <div className="absolute inset-0 rounded-full border border-transparent border-t-[#A34A38] animate-spin" />
          </div>
          <p className="font-serif text-sm tracking-widest text-[#2d2520] uppercase animate-pulse">
            Loading Artistry...
          </p>
        </div>
      </PageContainer>
    );
  }

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

  const isHoopProduct = Boolean(
    product.hasHoop ||
    product.studioType === 'FINISHED_HOOP' ||
    (product.isCustomizable && product.studioType === 'EMBROIDERY_KIT') ||
    (product.isCustomizable && /hoop/i.test(`${product.name} ${product.category || ''} ${(product.materialsIncluded || []).join(' ')}`)) ||
    (/hoop/i.test(`${product.name}`) && !/handkerchief|fabric|cloth|apparel|accessory|tote|bag|pattern/i.test(`${product.name} ${product.category || ''}`))
  );

  const allowGiftWrap = product.allowGiftWrap !== false;
  const hasPersonalization = Boolean(product.isPersonalizable ?? true);
  const hasAnyCustomization = isHoopProduct || hasPersonalization || allowGiftWrap;

  const finishPrice = isHoopProduct && hoopFinish === 'walnut' ? 500 : 0;
  const engravingPrice = hasPersonalization && hasEngraving ? 500 : 0;
  const giftPrice = allowGiftWrap && hasGiftWrap ? 300 : 0;
  const totalPrice = product.price + finishPrice + engravingPrice + giftPrice;

  const handleAddToBag = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
        giftWrap: allowGiftWrap ? hasGiftWrap : false,
        engravingText: hasPersonalization && hasEngraving ? engravingText : null,
        customization: {
          ...(isHoopProduct && hoopFinish ? { hoopFinish } : {}),
          engravingFont: (hasPersonalization && hasEngraving) ? engravingFont : undefined,
          giftMessage: (allowGiftWrap && hasGiftWrap) ? giftMessage : undefined,
        },
      });
      setCartOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to bag.');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
        giftWrap: allowGiftWrap ? hasGiftWrap : false,
        engravingText: hasPersonalization && hasEngraving ? engravingText : null,
        customization: {
          ...(isHoopProduct && hoopFinish ? { hoopFinish } : {}),
          engravingFont: (hasPersonalization && hasEngraving) ? engravingFont : undefined,
          giftMessage: (allowGiftWrap && hasGiftWrap) ? giftMessage : undefined,
        },
      });
      navigate('/checkout');
    } catch (err: any) {
      alert(err.message || 'Failed to process Buy Now.');
    }
  };

  return (
    <PageContainer disablePadding>
      {/* Product Section */}
      <section className="bg-inverse-on-surface pt-4 md:pt-6 pb-8 md:pb-12 px-4 sm:px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-20">

          {/* Image Gallery - Mobile First */}
          <div className="flex flex-col gap-3 md:gap-4 order-1">
            {/* Main Image Container */}
            <div className="w-full aspect-[4/5] bg-surface-container overflow-hidden rounded-sm shadow-sm relative">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Mobile Swipe Indicator */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${activeImage === i ? 'bg-[#A34A38]' : 'bg-white/60'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery - Horizontal Scroll with touch support */}
            {product.images.length > 1 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent snap-x snap-mandatory">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 bg-surface-container overflow-hidden border-2 transition-colors rounded-sm snap-start ${activeImage === i ? 'border-[#A34A38]' : 'border-transparent'
                      }`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Mobile First */}
          <div className="flex flex-col order-2 lg:order-1">
            {/* Collection Badge - Only rendered when collection is assigned */}
            {product.collection && (
              <p className="font-sans text-xs tracking-[0.25em] text-[#A34A38] uppercase mb-1.5 md:mb-2 font-medium">
                {product.collection} Collection
              </p>
            )}

            {/* Product Name */}
            <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light text-[#1C1C1B] mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Price - Mobile Optimized with Compare Price / MRP Display */}
            <div className="flex items-baseline gap-3 mb-4 md:mb-6">
              <p className="font-sans text-2xl md:text-3xl font-semibold text-[#1C1C1B]">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="font-sans text-base md:text-lg text-neutral-400 line-through font-normal">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="font-sans text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A34A38]/10 text-[#A34A38] uppercase tracking-wider">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Product Meta Info - Mobile Friendly Grid */}
            <div className="flex flex-col gap-3 border-y border-neutral-200 py-4 md:py-6 mb-4 md:mb-6">
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs uppercase tracking-wider text-neutral-500">Difficulty</span>
                <span className={`font-sans text-[10px] tracking-[0.15em] uppercase px-3 py-1 font-semibold ${product.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                  product.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                  {product.difficulty}
                </span>
              </div>
              {product.estimatedTime !== 'N/A' && (
                <div className="flex justify-between items-center">
                  <span className="font-sans text-xs uppercase tracking-wider text-neutral-500">Est. Time</span>
                  <span className="font-sans text-sm text-[#1C1C1B]">{product.estimatedTime}</span>
                </div>
              )}
            </div>

            {/* Customization Options Panel - Mobile Optimized */}
            {hasAnyCustomization && (
              <div className="bg-[#FAF9F7] p-4 md:p-5 lg:p-6 border border-neutral-200/60 rounded-sm mb-4 md:mb-6 flex flex-col gap-4 md:gap-5">
                <h3 className="font-serif text-lg md:text-xl text-[#1C1C1B] border-b border-neutral-200 pb-2">
                  {isHoopProduct ? 'Bespoke Customizations' : allowGiftWrap ? 'Bespoke Add-ons & Gifting' : 'Bespoke Personalization'}
                </h3>

                {/* Wood Finish Selector - Only for Hoop Products */}
                {isHoopProduct && (
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Hoop Finish Selection
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <button
                        type="button"
                        onClick={() => setHoopFinish('bamboo')}
                        className={`py-2.5 px-3 md:px-4 font-sans text-xs tracking-wider uppercase border transition-all cursor-pointer ${hoopFinish === 'bamboo'
                          ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white'
                          : 'border-neutral-200 text-neutral-600 bg-white hover:border-neutral-400'
                          }`}
                      >
                        Bamboo Hoop
                      </button>
                      <button
                        type="button"
                        onClick={() => setHoopFinish('walnut')}
                        className={`py-2.5 px-3 md:px-4 font-sans text-xs tracking-wider uppercase border transition-all cursor-pointer ${hoopFinish === 'walnut'
                          ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white'
                          : 'border-neutral-200 text-neutral-600 bg-white hover:border-neutral-400'
                          }`}
                      >
                        Walnut Hoop +₹500
                      </button>
                    </div>
                  </div>
                )}

                {/* Engraving - Mobile Optimized */}
                {hasPersonalization && (
                  <div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasEngraving}
                        onChange={(e) => setHasEngraving(e.target.checked)}
                        className="mt-1 rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38] focus:ring-1"
                      />
                      <span className="font-sans text-xs uppercase tracking-wider text-neutral-600 font-medium leading-tight">
                        Add Engraved Brass Plate <span className="block text-[10px] text-neutral-400 font-normal">+ ₹500</span>
                      </span>
                    </label>

                    {hasEngraving && (
                      <div className="mt-3 p-3 md:p-4 bg-white border border-neutral-200/50 rounded-sm flex flex-col gap-3">
                        <div>
                          <label className="block font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1">
                            Engraving text (max 25 chars)
                          </label>
                          <input
                            type="text"
                            maxLength={25}
                            value={engravingText}
                            onChange={(e) => setEngravingText(e.target.value)}
                            placeholder="e.g. J.H. 2026"
                            className="w-full px-3 py-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] rounded-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1">
                            Typography Font
                          </label>
                          <select
                            value={engravingFont}
                            onChange={(e) => setEngravingFont(e.target.value as any)}
                            className="w-full px-3 py-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] rounded-sm bg-white"
                          >
                            <option value="serif">Elegant Serif</option>
                            <option value="sans">Modern Minimalist</option>
                            <option value="script">Artisanal Script</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Gift Packaging - Mobile Optimized (Only shown when allowGiftWrap is true) */}
                {allowGiftWrap && (
                  <div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasGiftWrap}
                        onChange={(e) => setHasGiftWrap(e.target.checked)}
                        className="mt-1 rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38] focus:ring-1"
                      />
                      <span className="font-sans text-xs uppercase tracking-wider text-neutral-600 font-medium leading-tight">
                        Luxury Gift Packaging <span className="block text-[10px] text-neutral-400 font-normal">+ ₹300</span>
                      </span>
                    </label>

                    {hasGiftWrap && (
                      <div className="mt-3 p-3 md:p-4 bg-white border border-neutral-200/50 rounded-sm">
                        <label className="block font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1">
                          Gift Message
                        </label>
                        <textarea
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          placeholder="Write your note..."
                          className="w-full px-3 py-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] rounded-sm"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Price Summary - Mobile Optimized */}
                <div className="border-t border-neutral-200 pt-3 flex flex-col gap-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  {isHoopProduct && hoopFinish === 'walnut' && (
                    <div className="flex justify-between">
                      <span>Walnut Hoop</span>
                      <span>+ ₹500</span>
                    </div>
                  )}
                  {hasPersonalization && hasEngraving && (
                    <div className="flex justify-between">
                      <span>Engraved Plate</span>
                      <span>+ ₹500</span>
                    </div>
                  )}
                  {allowGiftWrap && hasGiftWrap && (
                    <div className="flex justify-between">
                      <span>Gift Packaging</span>
                      <span>+ ₹300</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold text-sm text-[#1C1C1B]">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart & Buy Now Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToBag}
                className="flex-1 bg-white text-[#1C1C1B] border border-[#1C1C1B] py-4 md:py-4.5 font-sans text-xs tracking-[0.2em] uppercase cursor-pointer hover:bg-neutral-100 transition-all font-semibold shadow-sm text-center"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-[#1C1C1B] text-[#FAF9F7] border border-[#1C1C1B] py-4 md:py-4.5 font-sans text-xs tracking-[0.2em] uppercase cursor-pointer hover:bg-neutral-800 transition-all font-semibold shadow-md text-center"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Story Section - Mobile Optimized */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-16 bg-[#ede6de]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4 md:mb-6">
            The Story
          </p>
          <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed text-primary-container italic font-light">
            "{product.story}"
          </p>
        </div>
      </section>

      {/* Materials & Details - Mobile Optimized */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-[#1C1C1B] mb-6 md:mb-8 border-b border-neutral-200 pb-3 md:pb-4">
              What's Included
            </h3>
            <ul className="list-none p-0 flex flex-col gap-3 md:gap-4">
              {product.materialsIncluded.map((mat, i) => (
                <li key={i} className="flex gap-3 md:gap-4 items-start font-sans text-sm text-[#5a4a3f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{mat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-[#1C1C1B] mb-6 md:mb-8 border-b border-neutral-200 pb-3 md:pb-4">
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

      {/* Reviews Section - Hermès/Aesop premium styling */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-16 bg-[#f8f3ee] border-t border-neutral-200">
        <div className="max-w-5xl mx-auto">
          <h3 className="font-serif text-3xl font-light text-[#1C1C1B] mb-12 text-center tracking-wide">
            Notes from the Studio
          </h3>

          {reviewsLoading && !reviewsData ? (
            <div className="flex justify-center py-12">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border border-neutral-200" />
                <div className="absolute inset-0 rounded-full border border-transparent border-t-[#A34A38] animate-spin" />
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Summary Stats Grid */}
              {reviewsData?.summary && reviewsData.summary.totalReviews > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-neutral-200 pb-10">
                  {/* Rating Score */}
                  <div className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-lg shadow-sm border border-neutral-100">
                    <span className="text-5xl font-serif font-light text-[#1C1C1B]">
                      {reviewsData.summary.averageRating}
                    </span>
                    <div className="flex gap-0.5 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.round(reviewsData.summary.averageRating) ? 'fill-[#A34A38] text-[#A34A38]' : 'text-neutral-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                      Based on {reviewsData.summary.totalReviews} Maker Reviews
                    </span>
                    {reviewsData.summary.recommendPercentage > 0 && (
                      <span className="mt-3 text-xs bg-[#e8f5e9] text-[#0f9d58] px-2.5 py-1 rounded-full font-semibold">
                        {reviewsData.summary.recommendPercentage}% Recommend this Kit
                      </span>
                    )}
                  </div>

                  {/* Rating Distribution Bars */}
                  <div className="flex flex-col justify-center space-y-2 bg-white p-6 rounded-lg shadow-sm border border-neutral-100">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1">Rating Breakdown</h4>
                    {reviewsData.summary.ratingDistribution.map((dist: any) => (
                      <div key={dist.stars} className="flex items-center text-xs text-neutral-600 gap-2">
                        <span className="w-12 font-medium">{dist.stars} Star</span>
                        <div className="flex-1 bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#A34A38] h-full rounded-full" style={{ width: `${dist.percentage}%` }} />
                        </div>
                        <span className="w-8 text-right text-neutral-400 font-mono">{dist.percentage}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Attribute Averages */}
                  <div className="flex flex-col justify-center space-y-3 bg-white p-6 rounded-lg shadow-sm border border-neutral-100">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1">Craft Attributes</h4>
                    {Object.entries(reviewsData.summary.attributes).map(([key, val]: [string, any]) => {
                      if (!val) return null;
                      const labelMap: Record<string, string> = {
                        quality: 'Material Quality',
                        packaging: 'Packaging Care',
                        value: 'Value for Money',
                        easeOfUse: 'Ease of Learning',
                      };
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1">
                            <span>{labelMap[key]}</span>
                            <span className="font-bold">{val}/5</span>
                          </div>
                          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#A34A38] h-full rounded-full" style={{ width: `${(val / 5) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Photos Gallery */}
              {reviewsData?.mediaGallery && reviewsData.mediaGallery.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1">
                    <Image className="h-4 w-4" /> Photos & Videos from Makers
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {reviewsData.mediaGallery.map((med: any) => (
                      <div key={med.id} className="relative h-20 w-20 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity group">
                        {med.type === 'IMAGE' ? (
                          <img src={med.url} alt="Maker upload" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-black/80 flex items-center justify-center">
                            <Play className="h-5 w-5 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbar: Filter & Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600 cursor-pointer font-sans">
                    <input 
                      type="checkbox" 
                      checked={filterHasMedia} 
                      onChange={(e) => {
                        setFilterHasMedia(e.target.checked);
                        setReviewsPage(1);
                      }}
                      className="accent-[#A34A38] h-4 w-4" 
                    />
                    Only show reviews with photos / videos
                  </label>
                </div>
                <div className="flex items-center gap-2 font-sans">
                  <span className="text-xs text-neutral-400 font-medium font-sans">Sort by</span>
                  <select
                    value={reviewsSort}
                    onChange={(e) => {
                      setReviewsSort(e.target.value);
                      setReviewsPage(1);
                    }}
                    className="bg-transparent text-xs font-semibold text-[#1C1C1B] border-b border-[#1C1C1B] pb-0.5 focus:outline-none cursor-pointer"
                  >
                    <option value="helpful">Most Helpful</option>
                    <option value="newest">Newest</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {reviewsData.reviews.map((review: any) => (
                    <div key={review.id} className="bg-white p-6 md:p-8 shadow-sm rounded-lg border border-neutral-100 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-neutral-100 rounded-full flex items-center justify-center text-sm font-medium text-neutral-600 border border-neutral-200">
                              {review.user?.firstName?.charAt(0)}{review.user?.lastName?.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm text-neutral-800">
                                  {review.user?.firstName} {review.user?.lastName}
                                </span>
                                {review.isVerified && (
                                  <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                                    ✓ Verified Purchase
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-400 font-sans block mt-0.5">
                                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-[#A34A38]' : 'text-neutral-200'}`}>★</span>
                            ))}
                          </div>
                        </div>

                        {/* Title & Comment */}
                        {review.title && <h4 className="font-serif font-bold text-neutral-900 mt-4">"{review.title}"</h4>}
                        <p className="font-sans text-sm leading-relaxed text-[#5a4a3f] mt-2 italic">
                          "{review.comment}"
                        </p>

                        {/* Attribute Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-dashed border-neutral-100">
                          {review.qualityRating && (
                            <span className="text-[9px] bg-neutral-50 border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-sans">
                              Quality: {review.qualityRating}/5
                            </span>
                          )}
                          {review.packagingRating && (
                            <span className="text-[9px] bg-neutral-50 border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-sans">
                              Packaging: {review.packagingRating}/5
                            </span>
                          )}
                          {review.valueRating && (
                            <span className="text-[9px] bg-neutral-50 border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-sans">
                              Value: {review.valueRating}/5
                            </span>
                          )}
                          {review.easeOfUseRating && (
                            <span className="text-[9px] bg-neutral-50 border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-sans">
                              Easy: {review.easeOfUseRating}/5
                            </span>
                          )}
                          {review.wouldRecommend !== null && (
                            <span className={`text-[9px] border px-1.5 py-0.5 rounded font-sans ${
                              review.wouldRecommend 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                              {review.wouldRecommend ? '✔ Recommend' : '✘ No'}
                            </span>
                          )}
                        </div>

                        {/* Maker Photos/Videos */}
                        {review.media && review.media.length > 0 && (
                          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                            {review.media.map((med: any) => (
                              <div key={med.id} className="relative h-16 w-16 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 cursor-pointer">
                                {med.type === 'IMAGE' ? (
                                  <img src={med.url} alt="Maker review photo" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full bg-black/80 flex items-center justify-center">
                                    <Play className="h-4 w-4 text-white fill-white" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Vote helpful row */}
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-400 font-sans">
                        <span>Was this review helpful?</span>
                        <div className="flex gap-2.5">
                          <button
                            onClick={() => handleVoteHelpful(review.id, true)}
                            className="flex items-center gap-1 hover:text-[#A34A38] transition-colors font-semibold"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>({review.helpfulCount || 0})</span>
                          </button>
                          <button
                            onClick={() => handleVoteHelpful(review.id, false)}
                            className="flex items-center gap-1 hover:text-[#A34A38] transition-colors font-semibold"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                            <span>({review.unhelpfulCount || 0})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-neutral-100 shadow-sm">
                  <MessageSquare className="mx-auto h-8 w-8 text-neutral-300 mb-3" />
                  <p className="text-sm font-medium text-neutral-500">No maker reviews yet.</p>
                  <p className="text-xs text-neutral-400 mt-1">Be the first to share your crafting experience after placing an order!</p>
                </div>
              )}

              {/* Pagination Controls */}
              {reviewsData?.pagination && reviewsData.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6 font-sans">
                  <button
                    disabled={reviewsPage === 1}
                    onClick={() => setReviewsPage(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 border border-neutral-200 rounded-md text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-neutral-500">
                    Page {reviewsPage} of {reviewsData.pagination.totalPages}
                  </span>
                  <button
                    disabled={reviewsPage === reviewsData.pagination.totalPages}
                    onClick={() => setReviewsPage(prev => prev + 1)}
                    className="px-3 py-1.5 border border-neutral-200 rounded-md text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related Products - Mobile Optimized */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-16 bg-inverse-on-surface border-t border-neutral-200">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-serif text-2xl md:text-3xl font-light text-[#1C1C1B] mb-8 md:mb-12 text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/shop/${p.slug || p.id}`}
                  className="group no-underline bg-white cursor-pointer shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 flex flex-col h-full rounded-sm"
                >
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-[#FAF9F7] rounded-t-sm">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                      <h4 className="font-serif text-base md:text-lg font-normal text-[#1C1C1B] group-hover:text-[#A34A38] transition-colors">
                        {p.name}
                      </h4>
                      <span className="font-sans text-sm font-semibold text-[#1C1C1B]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
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