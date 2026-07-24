import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Product } from '../data/products';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useAddToCart } from '../hooks/useCommerce';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // This represents the product slug
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

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService.getProductBySlug(id)
      .then(data => {
        setProduct(data);
        setActiveImage(0);

        // Fetch related products (e.g. from the same category)
        productService.getProducts({ limit: 20 })
          .then(res => {
            // Filter by matching category or collection, excluding current product
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

  // Calculate pricing
  const finishPrice = hoopFinish === 'walnut' ? 500 : 0;
  const engravingPrice = hasEngraving ? 500 : 0;
  const giftPrice = hasGiftWrap ? 300 : 0;
  const totalPrice = product.price + finishPrice + engravingPrice + giftPrice;

  const handleAddToBag = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
        giftWrap: hasGiftWrap,
        engravingText: hasEngraving ? engravingText : null,
        customization: {
          hoopFinish,
          engravingFont: hasEngraving ? engravingFont : undefined,
          giftMessage: hasGiftWrap ? giftMessage : undefined,
        },
      });
      setCartOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to bag.');
    }
  };

  return (
    <PageContainer disablePadding>
      {/* Product Hero Section */}
      <section className="bg-inverse-on-surface pt-4 md:pt-6 pb-12 md:pb-20 px-4 sm:px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">

          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square md:aspect-[4/5] max-h-[70vh] md:max-h-none bg-surface-container overflow-hidden rounded-sm shadow-sm">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 flex-shrink-0 bg-surface-container overflow-hidden border-2 transition-colors rounded-sm ${activeImage === i ? 'border-[#A34A38]' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Bespoke Controls */}
          <div className="flex flex-col pt-4">
            <p className="font-sans text-xs tracking-[0.25em] text-[#A34A38] uppercase mb-2 font-medium">
              {product.collection} Collection
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#1C1C1B] mb-3 leading-tight">
              {product.name}
            </h1>
            <p className="font-sans text-xl md:text-2xl font-semibold text-[#1C1C1B] mb-6">
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            <div className="flex flex-col gap-4 border-y border-neutral-200 py-6 mb-6">
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

            {/* Customization Options Panel */}
            <div className="bg-[#FAF9F7] p-5 md:p-6 border border-neutral-200/60 rounded-sm mb-6 flex flex-col gap-5">
              <h3 className="font-serif text-lg text-[#1C1C1B] border-b border-neutral-200 pb-2">Bespoke Customizations</h3>

              {/* Wood Finish Selector */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-neutral-500 mb-2">Hoop Finish Selection</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setHoopFinish('bamboo')}
                    className={`py-2.5 px-4 font-sans text-xs tracking-wider uppercase border transition-all ${hoopFinish === 'bamboo'
                      ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white'
                      : 'border-neutral-200 text-neutral-600 bg-white hover:border-neutral-400'
                      }`}
                  >
                    Bamboo Hoop (Included)
                  </button>
                  <button
                    onClick={() => setHoopFinish('walnut')}
                    className={`py-2.5 px-4 font-sans text-xs tracking-wider uppercase border transition-all ${hoopFinish === 'walnut'
                      ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white'
                      : 'border-neutral-200 text-neutral-600 bg-white hover:border-neutral-400'
                      }`}
                  >
                    Walnut Hoop (+ ₹500)
                  </button>
                </div>
              </div>

              {/* Custom Brass Plate Engraving */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasEngraving}
                    onChange={(e) => setHasEngraving(e.target.checked)}
                    className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38]"
                  />
                  <span className="font-sans text-xs uppercase tracking-wider text-neutral-600 font-medium">Add Hand-Engraved Brass Plate (+ ₹500)</span>
                </label>

                {hasEngraving && (
                  <div className="mt-4 p-4 bg-white border border-neutral-200/50 rounded-sm flex flex-col gap-3">
                    <div>
                      <label className="block font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1">Engraving text (max 25 characters)</label>
                      <input
                        type="text"
                        maxLength={25}
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder="e.g. J.H. 2026"
                        className="w-full px-3 py-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38]"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1">Typography Font</label>
                      <select
                        value={engravingFont}
                        onChange={(e) => setEngravingFont(e.target.value as any)}
                        className="w-full px-3 py-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38]"
                      >
                        <option value="serif">EB Garamond (Elegant Serif)</option>
                        <option value="sans">Work Sans (Modern Minimalist)</option>
                        <option value="script">Source Serif (Artisanal Script)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Luxury Gift Packaging */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGiftWrap}
                    onChange={(e) => setHasGiftWrap(e.target.checked)}
                    className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38]"
                  />
                  <span className="font-sans text-xs uppercase tracking-wider text-neutral-600 font-medium">Add Luxury Gift Packaging (+ ₹300)</span>
                </label>

                {hasGiftWrap && (
                  <div className="mt-4 p-4 bg-white border border-neutral-200/50 rounded-sm">
                    <label className="block font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1">Handwritten Gift Message</label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Write your note to be written on fine linen cardstock..."
                      className="w-full px-3 py-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38]"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Dynamic Price Summary */}
              <div className="border-t border-neutral-200 pt-3 flex flex-col gap-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                {hoopFinish === 'walnut' && (
                  <div className="flex justify-between">
                    <span>Premium Walnut Stain Hoop</span>
                    <span>+ ₹500</span>
                  </div>
                )}
                {hasEngraving && (
                  <div className="flex justify-between">
                    <span>Engraved Brass Plate</span>
                    <span>+ ₹500</span>
                  </div>
                )}
                {hasGiftWrap && (
                  <div className="flex justify-between">
                    <span>Luxury Gift Wrap & Message Card</span>
                    <span>+ ₹300</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold text-sm text-[#1C1C1B]">
                  <span>Total Dynamic Price</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToBag}
              className="bg-[#1C1C1B] text-[#FAF9F7] border border-[#1C1C1B] py-4 font-sans text-xs tracking-[0.2em] uppercase cursor-pointer hover:bg-neutral-800 transition-colors w-full mb-4 shadow-sm"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Story Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-[#ede6de]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
            The Story
          </p>
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-primary-container italic font-light">
            "{product.story}"
          </p>
        </div>
      </section>

      {/* Materials & Details */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-inverse-on-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="font-serif text-3xl font-light text-[#1C1C1B] mb-8 border-b border-neutral-200 pb-4">
              What's Included
            </h3>
            <ul className="list-none p-0 flex flex-col gap-4">
              {product.materialsIncluded.map((mat, i) => (
                <li key={i} className="flex gap-4 items-start font-sans text-sm text-[#5a4a3f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{mat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-3xl font-light text-[#1C1C1B] mb-8 border-b border-neutral-200 pb-4">
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

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-[#f8f3ee]">
          <div className="max-w-5xl mx-auto">
            <h3 className="font-serif text-3xl font-light text-[#1C1C1B] mb-12 text-center">
              Notes from our Makers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.reviews.map(review => (
                <div key={review.id} className="bg-white p-8 shadow-sm rounded-sm">
                  <div className="flex gap-1 mb-4">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <span key={i} className="text-[#A34A38] text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-serif text-lg leading-relaxed text-[#1C1C1B] mb-6 italic">
                    "{review.text}"
                  </p>
                  <div className="flex justify-between items-center font-sans text-xs tracking-wider uppercase text-neutral-400">
                    <span>{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-inverse-on-surface border-t border-neutral-200">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-serif text-3xl font-light text-[#1C1C1B] mb-12 text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/shop/${p.id}`}
                  className="group no-underline bg-white cursor-pointer shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 flex flex-col h-full rounded-sm"
                >
                  <div className="relative h-72 overflow-hidden bg-[#FAF9F7] rounded-t-sm">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-lg font-normal text-[#1C1C1B] group-hover:text-[#A34A38] transition-colors">{p.name}</h4>
                      <span className="font-sans text-sm font-semibold text-[#1C1C1B]">₹{p.price.toLocaleString('en-IN')}</span>
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
