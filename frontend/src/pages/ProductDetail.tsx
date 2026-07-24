import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Product } from '../data/products';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useAddToCart } from '../hooks/useCommerce';
import { Check, Info, ShieldCheck, Truck, ChevronRight } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

        productService.getProducts({ limit: 20 })
          .then(res => {
            const matches = res.products.filter(p => p.id !== data.id && (p.category === data.category || p.collection === data.collection));
            setRelatedProducts(matches.slice(0, 4));
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
        <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[#e8e3dc]" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#8c6b3e] animate-spin" />
          </div>
          <p className="font-serif text-sm tracking-[0.2em] text-[#5c4a3e] uppercase animate-pulse">
            Curating details...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-32 px-6 text-center bg-[#faf8f5]">
          <h1 className="font-serif text-4xl text-[#1f1610] mb-6">Masterpiece Not Found</h1>
          <p className="text-[#5c4a3e] mb-8 max-w-md">The piece you are looking for is no longer available or the link is incorrect.</p>
          <Link to="/shop" className="px-8 py-3 bg-[#1f1610] text-white font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#3d2e24] transition-colors duration-300">
            Return to Gallery
          </Link>
        </div>
      </PageContainer>
    );
  }

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
    <PageContainer>
      {/* Product Hero Section */}
      <section className="bg-[#faf8f5] pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex text-[10px] sm:text-xs tracking-[0.1em] text-[#8c7a6b] uppercase mb-8 sm:mb-12">
            <Link to="/" className="hover:text-[#1f1610] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-[#1f1610] transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1f1610] truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Image Gallery - Mobile: Stacked/Swipable, PC: Sticky side */}
            <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-24 self-start">
              <div className="w-full relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-[#f0ebe1] overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
                />
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-[#1f1610] shadow-sm">
                    Featured Edition
                  </div>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 snap-start rounded-lg overflow-hidden transition-all duration-300 ${
                        activeImage === i 
                          ? 'ring-2 ring-[#1f1610] ring-offset-2 ring-offset-[#faf8f5] opacity-100' 
                          : 'opacity-60 hover:opacity-100 bg-[#f0ebe1]'
                      }`}
                    >
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Controls */}
            <div className="lg:col-span-5 flex flex-col pt-2 sm:pt-4">
              <div className="mb-8">
                <p className="font-sans text-[10px] sm:text-xs tracking-[0.25em] text-[#8c6b3e] uppercase mb-3 font-semibold">
                  {product.collection} Collection
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1f1610] mb-4 leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                <p className="font-sans text-xl sm:text-2xl font-medium text-[#1f1610]">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>

              <p className="text-[#5c4a3e] text-sm sm:text-base leading-relaxed mb-8">
                {product.description || product.shortDescription || "A beautiful piece crafted with exceptional attention to detail. Designed to elevate your everyday rituals."}
              </p>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 border-y border-[#e8e3dc] py-5 mb-8">
                <div>
                  <span className="block font-sans text-[10px] uppercase tracking-[0.1em] text-[#8c7a6b] mb-1">Difficulty</span>
                  <span className={`inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-2.5 py-1 rounded-sm ${
                    product.difficulty === 'Beginner' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                    product.difficulty === 'Intermediate' ? 'bg-[#fff8e1] text-[#f57f17]' :
                    'bg-[#fbe9e7] text-[#c62828]'
                  }`}>
                    <Check className="w-3 h-3" />
                    {product.difficulty || 'All Levels'}
                  </span>
                </div>
                {product.estimatedTime && product.estimatedTime !== 'N/A' && (
                  <div>
                    <span className="block font-sans text-[10px] uppercase tracking-[0.1em] text-[#8c7a6b] mb-1">Est. Time</span>
                    <span className="font-sans text-sm font-medium text-[#1f1610]">{product.estimatedTime}</span>
                  </div>
                )}
              </div>

              {/* Customization Options Panel */}
              <div className="bg-white rounded-xl border border-[#e8e3dc] p-5 sm:p-7 shadow-sm mb-8 flex flex-col gap-6">
                <h3 className="font-serif text-lg text-[#1f1610] flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-[#8c6b3e]"></span>
                  Bespoke Options
                </h3>

                {/* Wood Finish Selector */}
                <div>
                  <label className="block font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#5c4a3e] mb-3 font-medium">Select Hoop Finish</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setHoopFinish('bamboo')}
                      className={`relative py-3 sm:py-4 px-4 font-sans text-[10px] sm:text-xs tracking-wider uppercase rounded-lg border transition-all duration-300 flex flex-col items-start gap-1 overflow-hidden ${
                        hoopFinish === 'bamboo'
                          ? 'border-[#1f1610] bg-[#1f1610] text-white shadow-md'
                          : 'border-[#e8e3dc] text-[#5c4a3e] bg-white hover:border-[#b8a698] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <span className="font-bold">Bamboo</span>
                      <span className={hoopFinish === 'bamboo' ? 'text-white/70' : 'text-[#8c7a6b]'}>Included</span>
                      {hoopFinish === 'bamboo' && <div className="absolute right-0 top-0 w-0 h-0 border-t-[20px] border-l-[20px] border-t-[#8c6b3e] border-l-transparent"></div>}
                    </button>
                    <button
                      onClick={() => setHoopFinish('walnut')}
                      className={`relative py-3 sm:py-4 px-4 font-sans text-[10px] sm:text-xs tracking-wider uppercase rounded-lg border transition-all duration-300 flex flex-col items-start gap-1 overflow-hidden ${
                        hoopFinish === 'walnut'
                          ? 'border-[#1f1610] bg-[#1f1610] text-white shadow-md'
                          : 'border-[#e8e3dc] text-[#5c4a3e] bg-white hover:border-[#b8a698] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <span className="font-bold">Walnut Stain</span>
                      <span className={hoopFinish === 'walnut' ? 'text-[#e5cdac]' : 'text-[#8c6b3e]'}>+ ₹500</span>
                      {hoopFinish === 'walnut' && <div className="absolute right-0 top-0 w-0 h-0 border-t-[20px] border-l-[20px] border-t-[#8c6b3e] border-l-transparent"></div>}
                    </button>
                  </div>
                </div>

                {/* Custom Brass Plate Engraving */}
                <div className="pt-2">
                  <label className="flex items-start sm:items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5 sm:mt-0">
                      <input
                        type="checkbox"
                        checked={hasEngraving}
                        onChange={(e) => setHasEngraving(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-[#c8b5aa] rounded-sm checked:bg-[#1f1610] checked:border-[#1f1610] transition-colors cursor-pointer"
                      />
                      <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-[#1f1610] font-semibold group-hover:text-[#8c6b3e] transition-colors">Add Hand-Engraved Brass Plate</span>
                      <span className="font-sans text-[10px] text-[#8c6b3e]">+ ₹500</span>
                    </div>
                  </label>

                  {hasEngraving && (
                    <div className="mt-4 p-4 sm:p-5 bg-[#faf8f5] border border-[#e8e3dc] rounded-lg flex flex-col gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                      <div>
                        <label className="block font-sans text-[10px] tracking-wider uppercase text-[#5c4a3e] mb-1.5 font-medium">Engraving text (max 25 chars)</label>
                        <input
                          type="text"
                          maxLength={25}
                          value={engravingText}
                          onChange={(e) => setEngravingText(e.target.value)}
                          placeholder="e.g. J.H. 2026"
                          className="w-full px-4 py-2.5 bg-white border border-[#c8b5aa] rounded-md text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#8c6b3e] focus:border-[#8c6b3e] transition-shadow placeholder:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-wider uppercase text-[#5c4a3e] mb-1.5 font-medium">Typography Font</label>
                        <select
                          value={engravingFont}
                          onChange={(e) => setEngravingFont(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-white border border-[#c8b5aa] rounded-md text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#8c6b3e] focus:border-[#8c6b3e] transition-shadow appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23c8b5aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.6rem_auto]"
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
                <div className="pt-2 border-t border-[#e8e3dc]">
                  <label className="flex items-start sm:items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5 sm:mt-0">
                      <input
                        type="checkbox"
                        checked={hasGiftWrap}
                        onChange={(e) => setHasGiftWrap(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-[#c8b5aa] rounded-sm checked:bg-[#1f1610] checked:border-[#1f1610] transition-colors cursor-pointer"
                      />
                      <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-[#1f1610] font-semibold group-hover:text-[#8c6b3e] transition-colors">Add Luxury Gift Packaging</span>
                      <span className="font-sans text-[10px] text-[#8c6b3e]">+ ₹300</span>
                    </div>
                  </label>

                  {hasGiftWrap && (
                    <div className="mt-4 p-4 sm:p-5 bg-[#faf8f5] border border-[#e8e3dc] rounded-lg animate-in slide-in-from-top-2 fade-in duration-300">
                      <label className="block font-sans text-[10px] tracking-wider uppercase text-[#5c4a3e] mb-1.5 font-medium">Handwritten Gift Message</label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Write your note to be written on fine linen cardstock..."
                        className="w-full px-4 py-3 bg-white border border-[#c8b5aa] rounded-md text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#8c6b3e] focus:border-[#8c6b3e] transition-shadow resize-none placeholder:text-neutral-300"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Price Summary & Add to Bag */}
              <div className="bg-[#1f1610] rounded-xl p-1 relative overflow-hidden shadow-2xl mb-6 group">
                {/* Subtle gradient effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                
                <div className="bg-white rounded-lg p-5">
                  <div className="flex flex-col gap-2.5 text-xs text-[#5c4a3e] font-medium mb-4">
                    <div className="flex justify-between items-center">
                      <span>Base Piece</span>
                      <span>₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    {hoopFinish === 'walnut' && (
                      <div className="flex justify-between items-center text-[#8c6b3e]">
                        <span>Walnut Stain</span>
                        <span>+ ₹500</span>
                      </div>
                    )}
                    {hasEngraving && (
                      <div className="flex justify-between items-center text-[#8c6b3e]">
                        <span>Brass Engraving</span>
                        <span>+ ₹500</span>
                      </div>
                    )}
                    {hasGiftWrap && (
                      <div className="flex justify-between items-center text-[#8c6b3e]">
                        <span>Gift Packaging</span>
                        <span>+ ₹300</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 mt-1 border-t border-[#e8e3dc] text-[#1f1610] font-bold text-base sm:text-lg">
                      <span>Total Value</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAddToBag}
                    className="w-full bg-[#1f1610] text-white py-4 px-6 rounded-md font-sans text-xs sm:text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#3d2e24] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Add to Bag</span>
                    <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 py-4 text-[#8c7a6b]">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="w-[1px] h-4 bg-[#e8e3dc]"></div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Story Section */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#faf8f5] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#fdfaf6] rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-8">
            <span className="w-12 h-[1px] bg-[#8c6b3e]"></span>
            <span className="px-4 font-sans text-[10px] tracking-[0.3em] uppercase text-[#8c6b3e] font-semibold">The Story</span>
            <span className="w-12 h-[1px] bg-[#8c6b3e]"></span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl leading-[1.6] text-[#1f1610] font-light">
            "{product.story || product.description}"
          </p>
        </div>
      </section>

      {/* Materials & Details Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#faf8f5] border-y border-[#e8e3dc]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#e8e3dc]/50">
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1f1610] mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#f0ebe1] flex items-center justify-center text-[#8c6b3e]">
                  <Info className="w-4 h-4" />
                </span>
                What's Included
              </h3>
              <ul className="space-y-5">
                {(product.materialsIncluded?.length ? product.materialsIncluded : [
                  'Premium organic linen fabric',
                  'DMC Egyptian cotton embroidery threads',
                  'Finely polished embroidery hoop',
                  'Stainless steel embroidery needles',
                  'Detailed stitch guide and instructions'
                ]).map((mat, i) => (
                  <li key={i} className="flex gap-4 items-start font-sans text-sm sm:text-base text-[#5c4a3e]">
                    <div className="w-6 h-6 rounded-full bg-[#faf8f5] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#8c6b3e]" />
                    </div>
                    <span className="leading-relaxed">{mat}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col justify-center">
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1f1610] mb-8">
                Craftsmanship & Care
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#5c4a3e] leading-loose mb-6">
                Every element of this kit is thoughtfully sourced to ensure the highest quality experience. Our materials are sustainable, and our packaging is completely plastic-free, reflecting our commitment to the environment.
              </p>
              <div className="space-y-6 pt-6 border-t border-[#e8e3dc]">
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-[#1f1610] mb-2">Shipping Details</h4>
                  <p className="text-sm text-[#5c4a3e]">Orders are typically processed and shipped within 2-3 business days. Delivery times vary by location.</p>
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-[#1f1610] mb-2">Returns Policy</h4>
                  <p className="text-sm text-[#5c4a3e]">We gladly accept returns on unopened physical kits within 30 days of receipt. Digital patterns are final sale.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products - Gallery Style */}
      {relatedProducts.length > 0 && (
        <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
              <div>
                <span className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#8c6b3e] font-semibold mb-2">Continue Exploring</span>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#1f1610]">
                  Related Pieces
                </h3>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#1f1610] font-bold hover:text-[#8c6b3e] transition-colors group">
                View Gallery <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/shop/${p.id}`}
                  className="group flex flex-col gap-4"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe1] rounded-xl">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8c7a6b] font-semibold">{p.collection}</span>
                    <h4 className="font-serif text-base sm:text-lg text-[#1f1610] group-hover:text-[#8c6b3e] transition-colors truncate">{p.name}</h4>
                    <span className="font-sans text-sm font-medium text-[#1f1610]">₹{p.price.toLocaleString('en-IN')}</span>
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

