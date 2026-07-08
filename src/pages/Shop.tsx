import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { mockProducts, Product } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ChevronDown, SlidersHorizontal, X, RotateCcw, ShoppingBag, Check } from 'lucide-react';

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'DIY Kits' | 'Finished Hoops' | 'Digital Patterns'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [collectionFilter, setCollectionFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [activeDropdown, setActiveDropdown] = useState<'difficulty' | 'collection' | 'sort' | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  // Close dropdowns on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0]
    });

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  const resetFilters = () => {
    setActiveCategory('All');
    setDifficultyFilter('All');
    setCollectionFilter('All');
    setSortBy('newest');
  };

  // Filter products based on active filters
  const filteredProducts = mockProducts.filter((product) => {
    // Category mapping
    if (activeCategory === 'DIY Kits' && product.category !== 'Kit' && product.category !== 'Bundle') return false;
    if (activeCategory === 'Finished Hoops' && product.category !== 'Finished Hoop') return false;
    if (activeCategory === 'Digital Patterns' && product.category !== 'Pattern') return false;

    // Difficulty filter
    if (difficultyFilter !== 'All' && product.difficulty !== difficultyFilter) return false;

    // Collection filter
    if (collectionFilter !== 'All' && product.collection !== collectionFilter) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // newest uses ID order descending
    return b.id.localeCompare(a.id);
  });

  const categories: Array<'All' | 'DIY Kits' | 'Finished Hoops' | 'Digital Patterns'> = [
    'All',
    'DIY Kits',
    'Finished Hoops',
    'Digital Patterns',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const collections = ['All', 'Botanical', 'Cottage', 'Linen', 'Seasonal'];

  const getSortLabel = () => {
    if (sortBy === 'price-asc') return 'Price: Low to High';
    if (sortBy === 'price-desc') return 'Price: High to Low';
    return 'Newest';
  };

  return (
    <PageContainer>
      <div className="bg-[#FAF9F7] min-h-screen text-[#1C1C1B] pb-24">
        
        {/* Curated Storytelling Hero Banner */}
        <section className="px-6 md:px-12 lg:px-16 pt-10 pb-16 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Column: Brand Typography */}
            <div>
              <p className="font-sans text-[10px] md:text-xs tracking-[0.25em] text-neutral-500 uppercase">
                Shop / The Collections
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1C1B] mt-3 mb-6 leading-tight">
                Crafted to Endure.
              </h1>
              <p className="font-sans text-sm md:text-base text-neutral-600 leading-relaxed max-w-lg">
                Every kit, pattern, and canvas represents hours of meticulous, quiet hand-stitch work, honoring the age-old heritage of slow craft. Designed to build mindfulness and elevate your living space.
              </p>
            </div>

            {/* Right Column: Mini-Vignette */}
            <div className="overflow-hidden rounded-sm shadow-sm h-48 md:h-64 relative bg-[#f2ede4]">
              <img 
                src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=1200&auto=format&fit=crop" 
                alt="Tactile threads close up" 
                className="w-full h-full object-cover object-center grayscale-[10%] opacity-90"
              />
              <div className="absolute inset-0 bg-[#A34A38]/5 mix-blend-multiply pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Sticky Filter & Perspective Bar */}
        <div className="sticky top-[72px] z-40 bg-[#FAF9F7]/90 backdrop-blur-md border-y border-neutral-200/50 py-4 px-6 md:px-12 lg:px-16">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            
            {/* Categories (Desktop tabs) */}
            <div className="hidden md:flex items-center gap-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`font-sans text-xs tracking-[0.18em] uppercase transition-colors relative py-2 ${
                    activeCategory === category 
                      ? 'text-[#1C1C1B] font-medium' 
                      : 'text-neutral-500 hover:text-[#1C1C1B]'
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#A34A38] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Categories (Mobile scrolling track) */}
            <div className="flex md:hidden overflow-x-auto gap-4 pb-1 -mb-1 w-full max-w-[calc(100%-80px)] scrollbar-none pr-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`font-sans text-[10px] tracking-wider uppercase whitespace-nowrap px-3 py-1.5 rounded-full border transition-all ${
                    activeCategory === category 
                      ? 'bg-[#1C1C1B] text-[#FAF9F7] border-[#1C1C1B]' 
                      : 'bg-transparent text-neutral-500 border-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Filters (Desktop dropdown triggers) */}
            <div className="hidden md:flex items-center gap-6 relative">
              
              {/* Difficulty Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'difficulty' ? null : 'difficulty')}
                  className="font-sans text-[11px] tracking-[0.15em] uppercase text-neutral-600 hover:text-[#1C1C1B] flex items-center gap-1.5 py-1"
                >
                  Difficulty: <span className="text-[#1C1C1B] font-medium">{difficultyFilter}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'difficulty' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'difficulty' && (
                  <div className="absolute right-0 mt-3 bg-white border border-neutral-200/70 p-2 w-48 shadow-lg z-50 flex flex-col gap-1 rounded-sm animate-fade-in">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => {
                          setDifficultyFilter(difficulty);
                          setActiveDropdown(null);
                        }}
                        className={`text-left px-3 py-2 font-sans text-xs tracking-wider uppercase hover:bg-neutral-50 hover:text-[#A34A38] transition-colors rounded-sm ${
                          difficultyFilter === difficulty ? 'text-[#A34A38] font-medium' : 'text-neutral-600'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'collection' ? null : 'collection')}
                  className="font-sans text-[11px] tracking-[0.15em] uppercase text-neutral-600 hover:text-[#1C1C1B] flex items-center gap-1.5 py-1"
                >
                  Collection: <span className="text-[#1C1C1B] font-medium">{collectionFilter}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'collection' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'collection' && (
                  <div className="absolute right-0 mt-3 bg-white border border-neutral-200/70 p-2 w-48 shadow-lg z-50 flex flex-col gap-1 rounded-sm">
                    {collections.map((coll) => (
                      <button
                        key={coll}
                        onClick={() => {
                          setCollectionFilter(coll);
                          setActiveDropdown(null);
                        }}
                        className={`text-left px-3 py-2 font-sans text-xs tracking-wider uppercase hover:bg-neutral-50 hover:text-[#A34A38] transition-colors rounded-sm ${
                          collectionFilter === coll ? 'text-[#A34A38] font-medium' : 'text-neutral-600'
                        }`}
                      >
                        {coll}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                  className="font-sans text-[11px] tracking-[0.15em] uppercase text-neutral-600 hover:text-[#1C1C1B] flex items-center gap-1.5 py-1"
                >
                  Sort: <span className="text-[#1C1C1B] font-medium">{getSortLabel()}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'sort' && (
                  <div className="absolute right-0 mt-3 bg-white border border-neutral-200/70 p-2 w-48 shadow-lg z-50 flex flex-col gap-1 rounded-sm">
                    <button
                      onClick={() => { setSortBy('newest'); setActiveDropdown(null); }}
                      className={`text-left px-3 py-2 font-sans text-xs tracking-wider uppercase hover:bg-neutral-50 hover:text-[#A34A38] transition-colors rounded-sm ${sortBy === 'newest' ? 'text-[#A34A38] font-medium' : 'text-neutral-600'}`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => { setSortBy('price-asc'); setActiveDropdown(null); }}
                      className={`text-left px-3 py-2 font-sans text-xs tracking-wider uppercase hover:bg-neutral-50 hover:text-[#A34A38] transition-colors rounded-sm ${sortBy === 'price-asc' ? 'text-[#A34A38] font-medium' : 'text-neutral-600'}`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => { setSortBy('price-desc'); setActiveDropdown(null); }}
                      className={`text-left px-3 py-2 font-sans text-xs tracking-wider uppercase hover:bg-neutral-50 hover:text-[#A34A38] transition-colors rounded-sm ${sortBy === 'price-desc' ? 'text-[#A34A38] font-medium' : 'text-neutral-600'}`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                )}
              </div>

              {/* Reset Quick Button if filters active */}
              {(difficultyFilter !== 'All' || collectionFilter !== 'All' || sortBy !== 'newest') && (
                <button
                  onClick={resetFilters}
                  className="p-1.5 text-neutral-400 hover:text-[#A34A38] transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>

            {/* Click-away backdrop overlay for desktop dropdowns */}
            {activeDropdown && (
              <div 
                className="fixed inset-0 z-10 cursor-default bg-transparent" 
                onClick={() => setActiveDropdown(null)} 
              />
            )}

            {/* Mobile Filter Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 border border-neutral-200 rounded-full text-neutral-700 bg-white shadow-sm flex items-center justify-center"
                aria-label="Open Filters"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>

          </div>
        </div>

        {/* Product Grid & Layout */}
        <section className="px-4 md:px-12 lg:px-16 pt-12 max-w-[1400px] mx-auto w-full pb-20">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16 lg:pb-12">
              {sortedProducts.map((product, idx) => {
                // Apply subtle vertical offset to alternate columns on large screens to create asymmetrical flow
                const isShifted = idx % 2 === 1;
                
                return (
                  <ScrollReveal 
                    key={product.id}
                    direction="up" 
                    delay={0.1 * (idx % 3)}
                    className={`flex flex-col h-full transition-transform duration-700 ease-out ${
                      isShifted ? 'lg:translate-y-8' : ''
                    }`}
                  >
                    <Link 
                      to={`/shop/${product.id}`}
                      className="group no-underline flex flex-col h-full"
                    >
                      {/* Image Container with 4:5 Aspect Ratio */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f2ee] rounded-sm group">
                        
                        {/* Default Image */}
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                        />
                        
                        {/* Hover Cross-fade (Dual-Thread Reveal) */}
                        {product.images[1] && (
                          <img 
                            src={product.images[1]} 
                            alt={`${product.name} Detail`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
                          />
                        )}

                        {/* Tier-Responsive Badge */}
                        {product.category === 'Finished Hoop' ? (
                          <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 z-10">
                            <span className="bg-[#FAF9F7] text-[#A34A38] border border-[#A34A38]/30 font-serif text-[8px] sm:text-[10px] tracking-wide px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
                              Artisan Edition
                            </span>
                          </div>
                        ) : product.badge ? (
                          <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 z-10">
                            <span className="bg-neutral-900/80 backdrop-blur-[2px] text-[#FAF9F7] font-sans text-[8px] sm:text-[9px] tracking-widest uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[1px]">
                              {product.badge}
                            </span>
                          </div>
                        ) : null}

                        {/* Quick-Add Drawer Trigger */}
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="absolute bottom-0 left-0 right-0 bg-[#1C1C1B] text-[#FAF9F7] py-2 sm:py-3.5 text-center font-sans text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center justify-center gap-2 hover:bg-neutral-900 shadow-md cursor-pointer pointer-events-auto"
                        >
                          {addedProductId === product.id ? (
                            <>
                              <Check size={10} className="text-green-400" /> Added!
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={10} /> + Quick Add to Hoop
                            </>
                          )}
                        </button>
                      </div>

                      {/* Typography Block */}
                      <div className="flex flex-col mt-2.5 sm:mt-4">
                        <h3 className="font-serif text-sm sm:text-base md:text-lg font-normal text-[#1C1C1B] leading-tight sm:leading-snug group-hover:text-[#A34A38] transition-colors duration-300">
                          {product.name}
                        </h3>
                        
                        <p className="font-sans text-[8px] sm:text-[10px] text-neutral-400 tracking-[0.12em] sm:tracking-[0.18em] uppercase mt-0.5 sm:mt-1 mb-1 sm:mb-2">
                          {product.category === 'Kit' ? 'DIY Kit' : product.category === 'Finished Hoop' ? 'Finished Hoop' : product.category === 'Pattern' ? 'Digital Pattern' : product.category} &bull; {product.difficulty}
                        </p>
                        
                        <p className="font-sans text-xs sm:text-sm font-semibold text-[#1C1C1B] mt-auto">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            /* Whimsical Empty State */
            <ScrollReveal direction="up" className="text-center py-20 max-w-md mx-auto">
              <svg className="w-24 h-24 text-neutral-300 mx-auto stroke-current mb-8" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="37" strokeWidth="1" strokeDasharray="3,3" />
                <rect x="44" y="2" width="12" height="6" rx="1" strokeWidth="1.5" />
                <path d="M50 8v6M46 11h8" strokeWidth="1" />
              </svg>
              <h2 className="font-serif text-2xl font-light text-[#1C1C1B] mb-3">
                A blank canvas.
              </h2>
              <p className="font-sans text-sm text-neutral-500 leading-relaxed mb-8">
                We couldn't find any artisanal goods matching your specific filter combinations.
              </p>
              <button 
                onClick={resetFilters}
                className="bg-[#1C1C1B] text-[#FAF9F7] border border-[#1C1C1B] px-8 py-3.5 font-sans text-xs tracking-widest uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Reset Filters & Begin Again
              </button>
            </ScrollReveal>
          )}
        </section>
      </div>

      {/* Mobile Slide-Up Filter Sheet Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Sheet Container */}
          <div className="relative bg-white w-full max-h-[85vh] rounded-t-2xl z-10 flex flex-col shadow-2xl p-6 overflow-hidden animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <h2 className="font-serif text-xl font-normal text-[#1C1C1B]">Filter & Refine</h2>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-neutral-500 hover:text-[#1C1C1B]"
                aria-label="Close Filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto pb-24">
              
              {/* Category selector in drawer */}
              <div className="mb-6">
                <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-400 mb-2.5">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`text-center py-2 px-3 font-sans text-xs tracking-wider uppercase border rounded-sm transition-colors ${
                        activeCategory === category 
                          ? 'border-[#1C1C1B] bg-[#1C1C1B] text-[#FAF9F7]' 
                          : 'border-neutral-200 text-neutral-600 bg-transparent'
                      }`}
                    >
                      {category === 'DIY Kits' ? 'DIY Kits' : category === 'Finished Hoops' ? 'Finished Hoops' : category === 'Digital Patterns' ? 'Patterns' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty selector */}
              <div className="mb-6">
                <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-400 mb-2.5">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficultyFilter(diff)}
                      className={`py-2 px-4 font-sans text-xs tracking-wider uppercase border rounded-sm transition-colors ${
                        difficultyFilter === diff 
                          ? 'border-[#1C1C1B] bg-[#1C1C1B] text-[#FAF9F7]' 
                          : 'border-neutral-200 text-neutral-600 bg-transparent'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collection selector */}
              <div className="mb-6">
                <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-400 mb-2.5">Collection</label>
                <div className="flex flex-wrap gap-2">
                  {collections.map((coll) => (
                    <button
                      key={coll}
                      type="button"
                      onClick={() => setCollectionFilter(coll)}
                      className={`py-2 px-4 font-sans text-xs tracking-wider uppercase border rounded-sm transition-colors ${
                        collectionFilter === coll 
                          ? 'border-[#1C1C1B] bg-[#1C1C1B] text-[#FAF9F7]' 
                          : 'border-neutral-200 text-neutral-600 bg-transparent'
                      }`}
                    >
                      {coll}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-400 mb-2.5">Sort By</label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setSortBy('newest')}
                    className={`text-left py-2.5 px-4 font-sans text-xs tracking-wider uppercase border rounded-sm transition-colors ${
                      sortBy === 'newest' 
                        ? 'border-[#1C1C1B] bg-[#1C1C1B] text-[#FAF9F7]' 
                        : 'border-neutral-100 text-neutral-600 bg-neutral-50'
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('price-asc')}
                    className={`text-left py-2.5 px-4 font-sans text-xs tracking-wider uppercase border rounded-sm transition-colors ${
                      sortBy === 'price-asc' 
                        ? 'border-[#1C1C1B] bg-[#1C1C1B] text-[#FAF9F7]' 
                        : 'border-neutral-100 text-neutral-600 bg-neutral-50'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('price-desc')}
                    className={`text-left py-2.5 px-4 font-sans text-xs tracking-wider uppercase border rounded-sm transition-colors ${
                      sortBy === 'price-desc' 
                        ? 'border-[#1C1C1B] bg-[#1C1C1B] text-[#FAF9F7]' 
                        : 'border-neutral-100 text-neutral-600 bg-neutral-50'
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Actions inside drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-6 flex gap-4">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-3.5 border border-neutral-200 text-[#1C1C1B] font-sans text-xs tracking-widest uppercase rounded-sm hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3.5 bg-[#1C1C1B] text-[#FAF9F7] border border-[#1C1C1B] font-sans text-xs tracking-widest uppercase rounded-sm hover:bg-neutral-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
