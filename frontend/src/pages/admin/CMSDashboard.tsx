/**
 * CMS Dashboard — Phase 9 (Full Storefront Merchandising Engine)
 * Admin page for managing live storefront content without code edits.
 * Modules:
 *  1. Hero Section Template Selector
 *  2. Best Sellers Merchandising
 *  3. New Arrivals Module
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
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
} from 'lucide-react';
import portraitCutout from '../../assets/1F78D49-EC80-4B90-A90F-D848BECFD893.png';
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
  id: 1 | 2 | 3 | 4;
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
    name: 'Immersive Portrait',
    description: 'Quiet luxury layout — single full-bleed editorial photograph with elegant negative space typography.',
    icon: Eye,
    tag: 'Quiet Luxury',
    tagColor: 'bg-[#ab5a46]/15 text-[#ab5a46]',
    preview: (
      <div className="w-full h-full bg-[#17110c] relative overflow-hidden rounded-sm flex items-center justify-start pl-3 pb-3">
        <img
          src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="relative z-10 text-[#fef8f3]">
          <span className="block text-[6px] tracking-widest uppercase opacity-70">Two Threads Studio</span>
          <span className="block font-serif text-xs leading-tight mt-1">Handcrafted Fashion</span>
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
    name: 'Editorial Window',
    description: 'Quiet luxury framed image surrounded by generous whitespace and simple typography.',
    icon: Layout,
    tag: 'Restraint',
    tagColor: 'bg-[#efe0d8]/30 text-[#ab5a46]',
    preview: (
      <div className="w-full h-full bg-[#fef8f3] relative overflow-hidden rounded-sm flex flex-col items-center justify-center p-2 text-[#17110c]">
        <span className="text-[7px] font-serif italic mb-1 text-[#ab5a46]">Handmade Fashion</span>
        <div className="w-12 h-14 bg-[#e6e2dd] border border-[#17110c]/10 rounded-sm overflow-hidden mb-1">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=150&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
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
  const [selectedTemplate, setSelectedTemplate] = useState<1 | 2 | 3 | 4 | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Sync CMS categories when data loads
  useEffect(() => {
    if (cmsData?.data?.categoriesConfig) {
      setCategories(cmsData.data.categoriesConfig);
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

      {/* ── TAB 3: BEST SELLERS & NEW ARRIVALS & FASHION SECTIONS ─── */}
      {(activeTab === 'bestsellers' || activeTab === 'newarrivals' || activeTab === 'menswear' || activeTab === 'womenswear') && (
        <div className="rounded-2xl border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1f1610] dark:text-white capitalize">
                {activeTab} Section Control
              </h2>
              <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70 mt-1">
                Configure curated products, section visibility, and display settings dynamically.
              </p>
            </div>
            <button
              onClick={() => {
                const updatedConfig: any = {};
                if (activeTab === 'bestsellers') updatedConfig.bestSellersConfig = cmsData?.data?.bestSellersConfig || { enabled: true, limit: 8 };
                if (activeTab === 'newarrivals') updatedConfig.newArrivalsConfig = cmsData?.data?.newArrivalsConfig || { enabled: true, limit: 8 };
                if (activeTab === 'menswear') updatedConfig.menswearConfig = cmsData?.data?.menswearConfig || { enabled: true, title: 'Premium Menswear Collection' };
                if (activeTab === 'womenswear') updatedConfig.womenswearConfig = cmsData?.data?.womenswearConfig || { enabled: true, title: 'Premium Womenswear Collection' };
                updateConfig(updatedConfig);
              }}
              disabled={isSavingConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] transition-all"
            >
              <Save className="w-4 h-4" />
              {isSavingConfig ? 'Publishing...' : 'Save Settings'}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1f1610] dark:text-white">Enable Section on Storefront</span>
              <span className="text-emerald-600 font-bold">Enabled ✓</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              This section is configured to pull curated products directly from your live catalog database. Admin overrides apply in real time across desktop and mobile storefronts.
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
