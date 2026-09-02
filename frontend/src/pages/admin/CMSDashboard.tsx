/**
 * CMS Dashboard — Phase 9 (Full Storefront Merchandising Engine)
 * Admin page for managing live storefront content without code edits.
 * Modules:
 *  1. Hero Section Template Selector
 *  2. Best Sellers Merchandising (Auto catalog or Manual product picker)
 *  3. New Arrivals Module (Auto catalog or Manual product picker)
 *  4. Premium Menswear Section
 *  5. Premium Womenswear Section
 *  6. Shop By Category Management
 */

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Layout,
  Eye,
  Save,
  CheckCircle2,
  Image,
  Sparkles,
  ShoppingBag,
  Grid,
  Shirt,
  Scissors,
  Check,
} from 'lucide-react';
import portraitCutout from '../../assets/1F78D49-EC80-4B90-A90F-D848BECFD893.webp';
import heroLippanImg from '../../assets/hero_lippan_ref.webp';
import heroMacrameImg from '../../assets/hero_macrame_ref.webp';
import {
  useAdminHeroConfig,
  useUpdateHeroConfig,
  useAdminHomepageConfig,
  useUpdateHomepageConfig,
} from '../../hooks/useCms';
import { AdminSkeleton } from '../../components/admin/ui';
import { productService } from '../../services/productService';
import type { Product } from '../../data/products';

// ─── Hero Template Metadata ───────────────────────────────────────────────────

interface TemplateOption {
  id: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  tagColor: string;
  preview: React.ReactNode;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 1,
    name: 'Original Hero',
    description: 'Terracotta full-bleed image with animated serif typography and product showcase overlay.',
    icon: Image,
    tag: 'Default',
    tagColor: 'bg-[#ab5a46]/15 text-[#ab5a46]',
    preview: (
      <div className="w-full h-full bg-gradient-to-b from-[#ab5a46] to-[#7a3d30] relative overflow-hidden rounded-sm">
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-2 overflow-hidden">
          <span className="font-serif text-[#f4ebd9]/20 text-[36px] tracking-tighter leading-none select-none">TWO THREAD</span>
          <span className="font-serif text-[#f4ebd9]/20 text-[36px] tracking-tighter leading-none select-none">STUDIO</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[55%] flex items-end justify-center pb-3">
          <div className="w-16 h-16 rounded-full bg-[#f4ebd9]/10 border border-[#f4ebd9]/20" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    name: 'Artisan Textile Studio',
    description: 'Reference design — full-bleed macramé & embroidery artwork top header with warm linen typography card below.',
    icon: Eye,
    tag: 'Reference Hero',
    tagColor: 'bg-[#8B6F5C]/20 text-[#8B6F5C]',
    preview: (
      <div className="w-full h-full bg-[#F5F0EB] relative overflow-hidden rounded-sm flex flex-col justify-between">
        <div className="w-full h-[50%] overflow-hidden bg-[#EDE6DE]">
          <img
            src={heroMacrameImg}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-[50%] p-2 flex flex-col items-center justify-center text-center">
          <span className="block font-serif text-[10px] text-[#2D2520] font-normal leading-tight">Two Threads Studio</span>
          <span className="block text-[6px] text-[#786455] leading-tight mt-0.5 max-w-[120px] truncate">Handcrafted Textile Décor</span>
          <div className="mt-1 px-2 py-0.5 bg-[#2D2520] text-[#F5F0EB] text-[5px] font-sans tracking-widest uppercase rounded-[1px]">
            EXPLORE
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: 'Editorial Portfolio',
    description: 'Black & cream luxury editorial layout with scrolling marquee typography and center portrait cutout.',
    icon: Sparkles,
    tag: 'Portfolio',
    tagColor: 'bg-[#efeee9]/20 text-[#efeee9]',
    preview: (
      <div className="w-full h-full bg-black relative overflow-hidden rounded-sm flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <img
          src={portraitCutout}
          alt="Preview"
          className="absolute inset-0 h-full w-full object-contain object-bottom z-20"
        />
      </div>
    ),
  },
  {
    id: 4,
    name: 'Soul of Handmade',
    description: 'Contemporary quiet luxury editorial — torn paper artwork layer, serif typography & double-ring pill CTA.',
    icon: Layout,
    tag: 'Editorial Refined',
    tagColor: 'bg-[#8C5A3E]/15 text-[#8C5A3E]',
    preview: (
      <div className="w-full h-full bg-[#FAF7F2] relative overflow-hidden rounded-sm flex items-center justify-between p-2 text-[#2D2520]">
        <div className="space-y-0.5 max-w-[55%]">
          <span className="block text-[6px] font-serif uppercase tracking-tight">UNVEILING <span className="italic lowercase">the</span></span>
          <span className="block text-[6px] font-serif uppercase font-bold text-[#8C5A3E]">SOUL <span className="italic font-normal text-[#2D2520] lowercase">of</span> HANDMADE</span>
        </div>
        <div className="w-12 h-10 bg-[#EDE6DE] border border-[#2D2520]/10 rounded-sm overflow-hidden flex-shrink-0">
          <img
            src={heroLippanImg}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ),
  },
  {
    id: 5,
    name: 'Artisan Monogram Heritage',
    description: 'Heritage line-art design — giant watermark "T" monogram with superimposed serif typography & organic wavy category thread.',
    icon: Sparkles,
    tag: 'Monogram Heritage',
    tagColor: 'bg-[#8C6F5A]/20 text-[#8C6F5A]',
    preview: (
      <div className="w-full h-full bg-[#FAF7F2] relative overflow-hidden rounded-sm flex flex-col items-center justify-center p-2 text-[#2D2520] text-center">
        <span className="absolute font-serif italic text-[54px] text-[#8C6F5A]/25 select-none font-normal">T</span>
        <div className="relative z-10 space-y-0.5">
          <span className="block font-serif text-[7px] uppercase tracking-widest font-bold">TWO THREADS</span>
          <span className="block font-serif text-[12px] uppercase tracking-wider font-bold leading-none">STUDIO</span>
          <span className="block text-[5px] text-[#5A4A3F] font-serif">Artisan Luxury. Est. 2023</span>
          <div className="mt-1 mx-auto w-[65px] py-0.5 bg-[#85634B] text-[#FAF7F2] text-[4px] font-sans tracking-widest uppercase rounded-[1px]">
            EXPLORE
          </div>
        </div>
      </div>
    ),
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const CMSDashboard: React.FC = () => {
  const { data: heroData, isLoading: heroLoading } = useAdminHeroConfig();
  const { mutate: updateHero, isPending: isSavingHero } = useUpdateHeroConfig();

  const { data: cmsData, isLoading: cmsLoading } = useAdminHomepageConfig();
  const { mutate: updateConfig, isPending: isSavingConfig } = useUpdateHomepageConfig();

  const [activeTab, setActiveTab] = useState<'hero' | 'bestsellers' | 'newarrivals' | 'menswear' | 'womenswear' | 'categories'>('hero');

  // Local state for edits
  const [selectedTemplate, setSelectedTemplate] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Section config local states
  const [bestSellersConfig, setBestSellersConfig] = useState<{ enabled: boolean; limit: number; productIds: string[] }>({
    enabled: true,
    limit: 8,
    productIds: [],
  });

  const [newArrivalsConfig, setNewArrivalsConfig] = useState<{ enabled: boolean; limit: number; productIds: string[] }>({
    enabled: true,
    limit: 8,
    productIds: [],
  });

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Sync CMS config when data loads
  useEffect(() => {
    if (cmsData?.data) {
      if (cmsData.data.categoriesConfig) setCategories(cmsData.data.categoriesConfig);
      if (cmsData.data.bestSellersConfig) setBestSellersConfig({ enabled: true, limit: 8, productIds: [], ...cmsData.data.bestSellersConfig });
      if (cmsData.data.newArrivalsConfig) setNewArrivalsConfig({ enabled: true, limit: 4, productIds: [], ...cmsData.data.newArrivalsConfig });
    }
  }, [cmsData]);

  // Fetch catalog products for selection
  useEffect(() => {
    productService.getProducts({ limit: 50 })
      .then(res => setAvailableProducts(res.products || []))
      .catch(console.error);
  }, []);

  const serverTemplate = heroData?.data?.activeTemplate ?? 1;
  const activeSelection = selectedTemplate ?? serverTemplate;
  const isHeroDirty = selectedTemplate !== null && selectedTemplate !== serverTemplate;

  const handleSaveHero = () => {
    if (!isHeroDirty) return;
    updateHero(activeSelection as 1 | 2 | 3 | 4, {
      onSuccess: () => setSelectedTemplate(null),
    });
  };

  const handleSaveCategories = () => {
    updateConfig({ categoriesConfig: categories });
  };

  const handleSaveSectionConfig = (key: 'bestSellersConfig' | 'newArrivalsConfig', payload: any) => {
    updateConfig({ [key]: payload });
  };

  const handlePreview = () => {
    window.open('/', '_blank', 'noopener,noreferrer');
  };

  if (heroLoading || cmsLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <AdminSkeleton className="h-28 w-full" />
        <AdminSkeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* ── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ab5a46]/10 text-[#ab5a46]">
            <Layout className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1f1610] dark:text-white">
              CMS Storefront Merchandising
            </h1>
            <p className="text-sm text-[#786455] dark:text-[#ccb08a] mt-0.5">
              Live Control Center for Hero, Categories, Bestsellers & Artisan Fashion Sections
            </p>
          </div>
        </div>

        <button
          onClick={handlePreview}
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase px-4 py-2.5 rounded-xl border border-[#c8b5aa]/60 dark:border-[#3d332b] text-[#786455] dark:text-[#ccb08a] hover:bg-[#f2ede8] dark:hover:bg-[#2c231c] transition-colors self-start sm:self-auto"
        >
          <Eye className="h-4 w-4" />
          Preview Live Site
        </button>
      </div>

      {/* ── Navigation Tabs ─── */}
      <div className="flex flex-wrap gap-2 border-b border-[#c8b5aa]/40 dark:border-[#3d332b] pb-2">
        <TabButton
          active={activeTab === 'hero'}
          onClick={() => setActiveTab('hero')}
          icon={Image}
          label="Hero Section"
        />
        <TabButton
          active={activeTab === 'categories'}
          onClick={() => setActiveTab('categories')}
          icon={Grid}
          label="Shop By Category"
        />
        <TabButton
          active={activeTab === 'bestsellers'}
          onClick={() => setActiveTab('bestsellers')}
          icon={ShoppingBag}
          label="Best Sellers"
        />
        <TabButton
          active={activeTab === 'newarrivals'}
          onClick={() => setActiveTab('newarrivals')}
          icon={Sparkles}
          label="New Arrivals"
        />
        <TabButton
          active={activeTab === 'menswear'}
          onClick={() => setActiveTab('menswear')}
          icon={Shirt}
          label="Menswear Section"
        />
        <TabButton
          active={activeTab === 'womenswear'}
          onClick={() => setActiveTab('womenswear')}
          icon={Scissors}
          label="Womenswear Section"
        />
      </div>

      {/* ── TAB 1: HERO SECTION MODULE ─── */}
      {activeTab === 'hero' && (
        <div className="rounded-2xl border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1f1610] dark:text-white">Hero Layout Selector</h2>
              <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70 mt-1">
                Select the editorial hero template displayed at the top of the homepage.
              </p>
            </div>
            {isHeroDirty && (
              <button
                onClick={handleSaveHero}
                disabled={isSavingHero}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] transition-all"
              >
                <Save className="w-4 h-4" />
                {isSavingHero ? 'Publishing...' : 'Publish Hero'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map(template => {
              const isSelected = activeSelection === template.id;
              const isCurrentServer = serverTemplate === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    group relative text-left rounded-xl border-2 overflow-hidden transition-all duration-200 p-3
                    ${isSelected
                      ? 'border-[#ab5a46] bg-white dark:bg-[#251b14] ring-2 ring-[#ab5a46]/30 shadow-lg'
                      : 'border-[#c8b5aa]/40 dark:border-[#3d332b] bg-[#faf6f1] dark:bg-[#19110b] hover:border-[#ab5a46]/50'
                    }
                  `}
                >
                  <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                    {template.preview}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm font-semibold text-[#1f1610] dark:text-white">
                      {template.name}
                    </span>
                    {isCurrentServer && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#786455] dark:text-[#ccb08a]/70 leading-relaxed">
                    {template.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: SHOP BY CATEGORY MODULE ─── */}
      {activeTab === 'categories' && (
        <div className="rounded-2xl border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1f1610] dark:text-white">Shop By Category Management</h2>
              <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70 mt-1">
                Manage category titles, images, visibility, and sorting. Premium Menswear & Premium Womenswear are featured.
              </p>
            </div>
            <button
              onClick={handleSaveCategories}
              disabled={isSavingConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] transition-all"
            >
              <Save className="w-4 h-4" />
              {isSavingConfig ? 'Saving...' : 'Save Categories'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <div key={cat.id || idx} className="p-4 rounded-xl border border-[#c8b5aa]/40 dark:border-[#3d332b] bg-white dark:bg-[#251b14] flex gap-4 items-center">
                <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-serif text-sm font-semibold text-[#1f1610] dark:text-white truncate">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#786455] uppercase">
                      /{cat.slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#786455] dark:text-[#ccb08a]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cat.visible !== false}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[idx].visible = e.target.checked;
                          setCategories(updated);
                        }}
                        className="rounded border-[#c8b5aa] text-[#ab5a46] focus:ring-[#ab5a46]"
                      />
                      Visible
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => setEditingCategory({ index: idx, ...cat })}
                  className="px-3 py-1.5 rounded-lg border border-[#c8b5aa]/50 text-xs font-mono hover:bg-[#f2ede8] transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {/* Edit Modal for Category */}
          {editingCategory && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#1e1610] rounded-2xl border border-[#c8b5aa] p-6 max-w-md w-full space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1f1610] dark:text-white">Edit Category Card</h3>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[#786455] mb-1">Title</label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#c8b5aa] text-sm text-[#1f1610]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#786455] mb-1">Slug</label>
                    <input
                      type="text"
                      value={editingCategory.slug}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#c8b5aa] text-sm text-[#1f1610]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#786455] mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingCategory.image}
                      onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#c8b5aa] text-sm text-[#1f1610]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-xl border border-[#c8b5aa] text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const updated = [...categories];
                      updated[editingCategory.index] = {
                        ...updated[editingCategory.index],
                        name: editingCategory.name,
                        slug: editingCategory.slug,
                        image: editingCategory.image,
                      };
                      setCategories(updated);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#ab5a46] text-white text-xs font-mono"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: BEST SELLERS CONTROL ─── */}
      {activeTab === 'bestsellers' && (
        <div className="rounded-2xl border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1f1610] dark:text-white">Best Sellers Merchandising</h2>
              <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70 mt-1">
                Toggle section visibility, display limits, or manually pick specific products to feature.
              </p>
            </div>
            <button
              onClick={() => handleSaveSectionConfig('bestSellersConfig', bestSellersConfig)}
              disabled={isSavingConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] transition-all"
            >
              <Save className="w-4 h-4" />
              {isSavingConfig ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#1f1610] dark:text-white">Enable Section</span>
              <input
                type="checkbox"
                checked={bestSellersConfig.enabled}
                onChange={(e) => setBestSellersConfig({ ...bestSellersConfig, enabled: e.target.checked })}
                className="w-5 h-5 rounded text-[#ab5a46] focus:ring-[#ab5a46]"
              />
            </div>
            <div className="p-4 rounded-xl border border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#1f1610] dark:text-white">Display Limit</span>
              <select
                value={bestSellersConfig.limit}
                onChange={(e) => setBestSellersConfig({ ...bestSellersConfig, limit: Number(e.target.value) })}
                className="px-3 py-1.5 rounded-lg border border-[#c8b5aa] text-xs font-mono"
              >
                <option value={4}>4 Products</option>
                <option value={8}>8 Products</option>
                <option value={12}>12 Products</option>
              </select>
            </div>
          </div>

          {/* Product Manual Override Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase font-bold text-[#786455] dark:text-[#ccb08a]">
                Manual Product Override ({bestSellersConfig.productIds.length} Selected)
              </h3>
              {bestSellersConfig.productIds.length > 0 && (
                <button
                  onClick={() => setBestSellersConfig({ ...bestSellersConfig, productIds: [] })}
                  className="text-[11px] font-mono text-red-600 underline"
                >
                  Clear Selection (Reset to Auto System)
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#786455]/80">
              Check specific products below to override automatic system sorting. Leave empty for automatic catalog selection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto p-1">
              {availableProducts.map(product => {
                const isSelected = bestSellersConfig.productIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      const updated = isSelected
                        ? bestSellersConfig.productIds.filter(id => id !== product.id)
                        : [...bestSellersConfig.productIds, product.id];
                      setBestSellersConfig({ ...bestSellersConfig, productIds: updated });
                    }}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#ab5a46] bg-[#ab5a46]/10 text-[#ab5a46] font-bold'
                        : 'border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] text-[#1f1610] dark:text-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-[#ab5a46] border-[#ab5a46] text-white' : 'border-[#c8b5aa]'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{product.name}</p>
                      <p className="text-[10px] opacity-70">₹{product.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: NEW ARRIVALS CONTROL ─── */}
      {activeTab === 'newarrivals' && (
        <div className="rounded-2xl border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1f1610] dark:text-white">New Arrivals Control</h2>
              <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70 mt-1">
                Configure newest release limits or manually feature handpicked items.
              </p>
            </div>
            <button
              onClick={() => handleSaveSectionConfig('newArrivalsConfig', newArrivalsConfig)}
              disabled={isSavingConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] transition-all"
            >
              <Save className="w-4 h-4" />
              {isSavingConfig ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#1f1610] dark:text-white">Enable Section</span>
              <input
                type="checkbox"
                checked={newArrivalsConfig.enabled}
                onChange={(e) => setNewArrivalsConfig({ ...newArrivalsConfig, enabled: e.target.checked })}
                className="w-5 h-5 rounded text-[#ab5a46] focus:ring-[#ab5a46]"
              />
            </div>
            <div className="p-4 rounded-xl border border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#1f1610] dark:text-white">Display Limit</span>
              <select
                value={newArrivalsConfig.limit}
                onChange={(e) => setNewArrivalsConfig({ ...newArrivalsConfig, limit: Number(e.target.value) })}
                className="px-3 py-1.5 rounded-lg border border-[#c8b5aa] text-xs font-mono"
              >
                <option value={4}>4 Products</option>
                <option value={8}>8 Products</option>
                <option value={12}>12 Products</option>
              </select>
            </div>
          </div>

          {/* Product Manual Override Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase font-bold text-[#786455] dark:text-[#ccb08a]">
                Featured New Release Selection ({newArrivalsConfig.productIds.length} Selected)
              </h3>
              {newArrivalsConfig.productIds.length > 0 && (
                <button
                  onClick={() => setNewArrivalsConfig({ ...newArrivalsConfig, productIds: [] })}
                  className="text-[11px] font-mono text-red-600 underline"
                >
                  Clear Selection (Reset to Auto System)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto p-1">
              {availableProducts.map(product => {
                const isSelected = newArrivalsConfig.productIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      const updated = isSelected
                        ? newArrivalsConfig.productIds.filter(id => id !== product.id)
                        : [...newArrivalsConfig.productIds, product.id];
                      setNewArrivalsConfig({ ...newArrivalsConfig, productIds: updated });
                    }}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#ab5a46] bg-[#ab5a46]/10 text-[#ab5a46] font-bold'
                        : 'border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] text-[#1f1610] dark:text-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-[#ab5a46] border-[#ab5a46] text-white' : 'border-[#c8b5aa]'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{product.name}</p>
                      <p className="text-[10px] opacity-70">₹{product.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5 & 6: MENSWEAR & WOMENSWEAR SECTIONS ─── */}
      {(activeTab === 'menswear' || activeTab === 'womenswear') && (
        <div className="rounded-2xl border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1f1610] dark:text-white capitalize">
                {activeTab === 'menswear' ? "Premium Menswear" : "Premium Womenswear"} Collection Control
              </h2>
              <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70 mt-1">
                Manage section visibility and feature key fashion items.
              </p>
            </div>
            <button
              onClick={() => {
                const key = activeTab === 'menswear' ? 'menswearConfig' : 'womenswearConfig';
                updateConfig({ [key]: { enabled: true, title: activeTab === 'menswear' ? 'Premium Menswear Collection' : 'Premium Womenswear Collection' } });
              }}
              disabled={isSavingConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] transition-all"
            >
              <Save className="w-4 h-4" />
              {isSavingConfig ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1f1610] dark:text-white">Enable Section on Storefront</span>
              <span className="text-emerald-600 font-bold">Enabled ✓</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              This section displays artisan fashion pieces (Shirts, Denim, Crochet Tops, One Pieces, Bikinis) from your catalog.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all ${
        active
          ? 'bg-[#ab5a46] text-white font-semibold shadow-sm'
          : 'bg-[#faf6f1] dark:bg-[#1e1610] text-[#786455] dark:text-[#ccb08a] border border-[#c8b5aa]/40 hover:bg-[#f2ede8]'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export default CMSDashboard;
