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
  Camera,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
} from 'lucide-react';
import heroPcImg from '../../assets/hero section pc.webp';
import heroVideo from '../../assets/hero_template2_video.mp4';
import heroT3Slide1 from '../../assets/hero_template3_slide1.jpg';
import heroT3Slide2 from '../../assets/hero_template3_slide2.jpg';
import heroT3Slide3 from '../../assets/hero_template3_slide3.jpg';
import heroCraftingPhoto from '../../assets/hero_crafting_heirlooms_photo.jpg';
import {
  useAdminHeroConfig,
  useUpdateHeroConfig,
  useAdminHomepageConfig,
  useUpdateHomepageConfig,
  useAdminCommunityGallery,
  useUpsertCommunityGalleryItem,
  useDeleteCommunityGalleryItem,
  useReorderCommunityGallery,
  useUpdateInstagramUrl,
} from '../../hooks/useCms';
import { AdminSkeleton } from '../../components/admin/ui';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import type { Product } from '../../data/products';
import type { CommunityGalleryItem } from '../../services/cmsService';
import { toast } from 'react-hot-toast';

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
    description: 'Signature terracotta background with bold serif typography, artisanal ceramic pottery showcase, and floating CTA.',
    icon: Image,
    tag: 'Terracotta Classic',
    tagColor: 'bg-[#ab5a46]/15 text-[#ab5a46]',
    preview: (
      <div className="w-full h-full bg-[#ab5a46] relative overflow-hidden rounded-sm flex flex-col justify-between select-none">
        {/* Giant Serif Background Watermark */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-1.5 overflow-hidden pointer-events-none opacity-40">
          <span className="font-serif text-[#f4ebd9] text-[22px] tracking-tighter leading-none select-none font-normal">TWO THREAD</span>
          <span className="font-serif text-[#f4ebd9] text-[22px] tracking-tighter leading-none select-none font-normal">STUDIO</span>
        </div>
        {/* Real Pottery / Ceramic Rock Sculpture */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-10">
          <img
            src={heroPcImg}
            alt="Original Hero"
            className="w-auto h-[82%] object-contain object-bottom drop-shadow-md"
          />
        </div>
        {/* Text & Button Overlay */}
        <div className="absolute bottom-1.5 inset-x-0 flex flex-col items-center justify-center z-20 pointer-events-none px-2 text-center">
          <span className="text-[5px] text-[#f4ebd9]/90 uppercase tracking-[0.2em] font-sans mb-1 font-medium drop-shadow-sm">
            Indigo Kits &bull; Mindful Craft
          </span>
          <div className="px-2.5 py-0.5 bg-[#f4ebd9] text-[#ab5a46] text-[5px] font-sans font-semibold tracking-wider uppercase rounded-[1px] shadow-sm">
            Shop Collection
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    name: 'Artisan Textile Studio',
    description: 'Cinematic textile craftsmanship video header paired with warm linen typography card and deep charcoal CTA.',
    icon: Eye,
    tag: 'Video Editorial',
    tagColor: 'bg-[#8B6F5C]/20 text-[#8B6F5C]',
    preview: (
      <div className="w-full h-full bg-[#F5F0EB] relative overflow-hidden rounded-sm flex flex-col justify-between select-none">
        {/* Top Video Header */}
        <div className="w-full h-[52%] overflow-hidden bg-[#EDE6DE] relative">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.98]"
          />
        </div>
        {/* Bottom Linen Typography Card */}
        <div className="w-full h-[48%] px-2 py-1 flex flex-col items-center justify-center text-center bg-[#F5F0EB]">
          <span className="block font-serif text-[10px] text-[#2D2520] font-normal leading-tight">
            Two Threads Studio
          </span>
          <span className="block text-[5.5px] text-[#786455] font-serif leading-tight mt-0.5 max-w-[140px] truncate">
            Contemporary Embroidery, Crochet &amp; Macramé
          </span>
          <div className="mt-1 px-2.5 py-0.5 bg-[#2D2520] text-[#F5F0EB] text-[5px] font-sans tracking-widest uppercase rounded-[1px] shadow-sm font-medium">
            EXPLORE THE STUDIO
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: 'Meditative Craft (Triptych)',
    description: '3-panel split triptych featuring botanical linen, heritage loom studio, and macramé slides with centered luxury typography.',
    icon: Sparkles,
    tag: '3-Panel Triptych',
    tagColor: 'bg-[#3d332b]/25 text-[#786455] dark:text-[#ccb08a]',
    preview: (
      <div className="w-full h-full bg-[#171310] relative overflow-hidden rounded-sm flex items-center justify-center select-none">
        {/* 3-Panel Split Triptych Grid */}
        <div className="grid grid-cols-3 w-full h-full">
          <div className="relative h-full overflow-hidden border-r border-white/30 bg-[#2b241d]">
            <img src={heroT3Slide1} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          </div>
          <div className="relative h-full overflow-hidden border-r border-white/30 bg-[#2b241d]">
            <img src={heroT3Slide2} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-black/20 pointer-events-none" />
          </div>
          <div className="relative h-full overflow-hidden bg-[#2b241d]">
            <img src={heroT3Slide3} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          </div>
        </div>
        {/* Center Typography & CTA Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-2 text-center pointer-events-none bg-black/25">
          <span className="font-serif uppercase text-white font-normal tracking-[0.06em] leading-[1.1] text-[8px] drop-shadow-md">
            MEDITATIVE CRAFT.<br />SILENT LUXURY.
          </span>
          <span className="text-[5px] text-white/90 font-sans mt-0.5 max-w-[130px] truncate drop-shadow-sm">
            Handcrafted textile art &amp; slow-living kits
          </span>
          <div className="mt-1 px-2 py-0.5 bg-white text-[#171310] text-[4.5px] font-sans tracking-widest uppercase font-semibold rounded-[1px] shadow">
            EXPLORE COLLECTION
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    name: 'Crafting Mindful Heirlooms',
    description: 'Dual-panel editorial layout — warm linen typography and terracotta button on the left, artisan craft flatlay on the right.',
    icon: Layout,
    tag: 'Split Editorial',
    tagColor: 'bg-[#AD5B43]/15 text-[#AD5B43]',
    preview: (
      <div className="w-full h-full bg-[#FAF7F2] relative overflow-hidden rounded-sm flex items-stretch select-none border border-[#E8E2D8]/60">
        {/* Left Column (approx 42%): Typography & CTA */}
        <div className="w-[42%] bg-[#FAF7F2] border-r border-[#E8E2D8] p-2 flex flex-col justify-center">
          <div className="space-y-0.5">
            <span className="block font-serif uppercase font-bold text-[#473429] tracking-[0.03em] text-[6.5px] leading-tight">
              CRAFTING<br />MINDFUL<br />HEIRLOOMS
            </span>
            <span className="block font-serif italic text-[#A15742] text-[4.5px] leading-tight line-clamp-1">
              Explore quiet luxury collections
            </span>
            <div className="pt-0.5">
              <span className="inline-block bg-[#AD5B43] text-white text-[4px] font-sans tracking-wider uppercase px-1.5 py-0.5 font-semibold rounded-[1px] shadow-sm">
                EXPLORE THE STUDIO
              </span>
            </div>
          </div>
        </div>
        {/* Right Column (approx 58%): Flatlay Photography */}
        <div className="w-[58%] relative overflow-hidden bg-[#E7DFC6]">
          <img
            src={heroCraftingPhoto}
            alt="Crafting Mindful Heirlooms"
            className="w-full h-full object-cover object-left-center"
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
      <div className="w-full h-full bg-[#FAF7F2] relative overflow-hidden rounded-sm flex flex-col justify-between p-1.5 text-[#2D2520] select-none">
        {/* Delicate Side Line-Art Decorations */}
        <div className="absolute left-1 top-1.5 w-6 h-6 opacity-35 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="#8C6F5A" strokeWidth="2">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="34" strokeDasharray="3 3" />
            <line x1="50" y1="5" x2="50" y2="12" />
          </svg>
        </div>
        <div className="absolute right-1 top-1.5 w-6 h-6 opacity-35 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="#8C6F5A" strokeWidth="2">
            <polygon points="50,15 20,40 80,40" />
            <line x1="30" y1="40" x2="30" y2="85" />
            <line x1="50" y1="40" x2="50" y2="90" />
            <line x1="70" y1="40" x2="70" y2="85" />
          </svg>
        </div>

        {/* Center Monogram & Typography */}
        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 py-1">
          {/* Giant 'T' Monogram Watermark */}
          <span className="absolute font-serif italic text-[58px] text-[#8C6F5A]/25 select-none font-normal leading-none transform -translate-y-1">
            T
          </span>
          <div className="relative z-10 space-y-0.5 flex flex-col items-center">
            <span className="block font-serif text-[6.5px] uppercase tracking-[0.2em] font-bold text-[#2D2520] leading-none">
              TWO THREADS
            </span>
            <span className="block font-serif text-[11px] uppercase tracking-[0.16em] font-bold leading-none text-[#2D2520]">
              STUDIO
            </span>
            <span className="block text-[4.5px] text-[#5A4A3F] font-serif tracking-wide">
              Artisan Luxury. Est. 2023
            </span>
            <div className="mt-0.5 px-2 py-0.5 bg-[#85634B] text-[#FAF7F2] text-[4.5px] font-sans tracking-widest uppercase rounded-[1px] border border-dashed border-white/60 shadow-sm">
              EXPLORE COLLECTION
            </div>
          </div>
        </div>

        {/* Bottom Category Bar with Wavy Thread */}
        <div className="relative z-10 w-full pt-1 border-t border-[#8C6F5A]/20 flex items-center justify-center">
          <span className="text-[4px] font-serif text-[#8C6F5A] tracking-wider uppercase font-medium">
            Embroidery &bull; Crochet &bull; Macramé &bull; Lippan Art
          </span>
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

  const [activeTab, setActiveTab] = useState<'hero' | 'bestsellers' | 'newarrivals' | 'menswear' | 'womenswear' | 'categories' | 'community'>('hero');

  // Community Gallery state & hooks
  const { data: communityData, isLoading: communityLoading } = useAdminCommunityGallery();
  const { mutate: upsertGalleryItem, isPending: isSavingItem } = useUpsertCommunityGalleryItem();
  const { mutate: deleteGalleryItem, isPending: isDeletingItem } = useDeleteCommunityGalleryItem();
  const { mutate: reorderGallery, isPending: isReordering } = useReorderCommunityGallery();
  const { mutate: updateIgUrl, isPending: isUpdatingIg } = useUpdateInstagramUrl();

  const [instagramUrlInput, setInstagramUrlInput] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<CommunityGalleryItem> | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Sync instagram url
  useEffect(() => {
    if (communityData?.instagramUrl !== undefined) {
      setInstagramUrlInput(communityData.instagramUrl);
    }
  }, [communityData?.instagramUrl]);

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
    updateHero(activeSelection as 1 | 2 | 3 | 4 | 5, {
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
        <TabButton
          active={activeTab === 'community'}
          onClick={() => setActiveTab('community')}
          icon={Camera}
          label="Community Gallery"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {TEMPLATES.map(template => {
              const isSelected = activeSelection === template.id;
              const isCurrentServer = serverTemplate === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    group relative text-left rounded-xl border-2 overflow-hidden transition-all duration-200 p-3 flex flex-col justify-between
                    ${isSelected
                      ? 'border-[#ab5a46] bg-white dark:bg-[#251b14] ring-2 ring-[#ab5a46]/30 shadow-lg'
                      : 'border-[#c8b5aa]/40 dark:border-[#3d332b] bg-[#faf6f1] dark:bg-[#19110b] hover:border-[#ab5a46]/50'
                    }
                  `}
                >
                  <div className="w-full">
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-3 shadow-inner border border-black/5 dark:border-white/5">
                      {template.preview}
                    </div>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="font-serif text-sm font-semibold text-[#1f1610] dark:text-white leading-snug">
                        {template.name}
                      </span>
                      {isCurrentServer && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 flex-shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className={`inline-block text-[9px] font-mono font-medium px-1.5 py-0.5 rounded ${template.tagColor}`}>
                        {template.tag}
                      </span>
                    </div>
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

      {/* ── TAB 7: COMMUNITY GALLERY MODULE ─── */}
      {activeTab === 'community' && (
        <div className="rounded-2xl border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1f1610] dark:text-white">
                Our Community / Styled by You
              </h2>
              <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70 mt-1">
                Manage shoppable community photos, customer Instagram handles, and linked products.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingItem({
                  imageUrl: '',
                  userHandle: '@',
                  productName: '',
                  productSlug: '',
                  productId: '',
                  tall: false,
                  active: true,
                });
                setIsAddingItem(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Community Photo
            </button>
          </div>

          {/* Instagram URL Setting */}
          <div className="p-4 rounded-xl border border-[#c8b5aa]/40 bg-white dark:bg-[#251b14] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-sm text-[#1f1610] dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#ab5a46]" />
                  Studio Instagram Profile Link
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Destination URL for the "View Instagram Feed" and "@TwoThreadsStudio" links on the storefront.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="url"
                  value={instagramUrlInput}
                  onChange={(e) => setInstagramUrlInput(e.target.value)}
                  placeholder="https://instagram.com/TwoThreadsStudio"
                  className="flex-1 sm:w-72 px-3 py-2 text-xs border border-[#c8b5aa]/60 dark:border-[#3d332b] rounded-lg bg-[#faf6f1] dark:bg-[#19110b] text-[#1f1610] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ab5a46]"
                />
                <button
                  onClick={() => updateIgUrl(instagramUrlInput)}
                  disabled={isUpdatingIg}
                  className="px-3 py-2 rounded-lg bg-[#2D2520] hover:bg-[#1f1610] text-[#faf6f1] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isUpdatingIg ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Add / Edit Form Modal / Card */}
          {isAddingItem && editingItem && (
            <div className="p-5 rounded-xl border-2 border-[#ab5a46]/40 bg-white dark:bg-[#251b14] space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-[#c8b5aa]/30 pb-3">
                <h3 className="font-serif font-bold text-base text-[#1f1610] dark:text-white">
                  {editingItem.id ? 'Edit Community Photo' : 'Add New Community Photo'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Photo Preview & Upload */}
                <div className="space-y-2">
                  <label className="block font-semibold text-[#1f1610] dark:text-white">
                    Photo Image URL or File Upload *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingItem.imageUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                      placeholder="https://... or click Upload"
                      className="flex-1 px-3 py-2 border border-[#c8b5aa]/60 dark:border-[#3d332b] rounded-lg bg-[#faf6f1] dark:bg-[#19110b] text-[#1f1610] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ab5a46]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ab5a46]/10 text-[#ab5a46] hover:bg-[#ab5a46]/20 cursor-pointer border border-[#ab5a46]/30">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingImage}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            setIsUploadingImage(true);
                            const res: any = await adminService.uploadImage(file);
                            const uploadedUrl = res?.data?.url || res?.url || res?.data?.secure_url;
                            if (uploadedUrl) {
                              setEditingItem((prev) => ({ ...prev, imageUrl: uploadedUrl }));
                              toast.success('Image uploaded successfully');
                            }
                          } catch (err: any) {
                            toast.error(err?.message || 'Failed to upload image');
                          } finally {
                            setIsUploadingImage(false);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {editingItem.imageUrl && (
                    <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-[#c8b5aa]/50 bg-[#e8e1d9]">
                      <img
                        src={editingItem.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Maker Handle */}
                <div className="space-y-2">
                  <label className="block font-semibold text-[#1f1610] dark:text-white">
                    Creator Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={editingItem.userHandle || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, userHandle: e.target.value })}
                    placeholder="@maya.stitches"
                    className="w-full px-3 py-2 border border-[#c8b5aa]/60 dark:border-[#3d332b] rounded-lg bg-[#faf6f1] dark:bg-[#19110b] text-[#1f1610] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ab5a46]"
                  />
                  <p className="text-[10px] text-neutral-400">Displayed on photo overlay</p>
                </div>

                {/* Linked Catalog Product */}
                <div className="space-y-2">
                  <label className="block font-semibold text-[#1f1610] dark:text-white">
                    Link Catalog Product (Shoppable Link)
                  </label>
                  <select
                    value={editingItem.productId || ''}
                    onChange={(e) => {
                      const prod = availableProducts.find((p) => p.id === e.target.value);
                      if (prod) {
                        setEditingItem({
                          ...editingItem,
                          productId: prod.id,
                          productName: prod.name,
                          productSlug: prod.slug,
                        });
                      } else {
                        setEditingItem({
                          ...editingItem,
                          productId: '',
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-[#c8b5aa]/60 dark:border-[#3d332b] rounded-lg bg-[#faf6f1] dark:bg-[#19110b] text-[#1f1610] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ab5a46]"
                  >
                    <option value="">-- Choose from Catalog --</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Product Name */}
                <div className="space-y-2">
                  <label className="block font-semibold text-[#1f1610] dark:text-white">
                    Display Product Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.productName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, productName: e.target.value })}
                    placeholder="Wildflower Hoop Kit"
                    className="w-full px-3 py-2 border border-[#c8b5aa]/60 dark:border-[#3d332b] rounded-lg bg-[#faf6f1] dark:bg-[#19110b] text-[#1f1610] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ab5a46]"
                  />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.tall ?? false}
                      onChange={(e) => setEditingItem({ ...editingItem, tall: e.target.checked })}
                      className="w-4 h-4 rounded text-[#ab5a46] focus:ring-[#ab5a46]"
                    />
                    <span className="text-xs text-[#1f1610] dark:text-white">
                      Tall Tile (spans 2 rows in desktop masonry grid)
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.active !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                      className="w-4 h-4 rounded text-[#ab5a46] focus:ring-[#ab5a46]"
                    />
                    <span className="text-xs text-[#1f1610] dark:text-white">
                      Active (visible on storefront)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#c8b5aa]/30">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#c8b5aa]/60 text-[#786455] text-xs font-mono tracking-wider hover:bg-[#faf6f1]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!editingItem.imageUrl) {
                      toast.error('Please provide an image URL');
                      return;
                    }
                    upsertGalleryItem(editingItem, {
                      onSuccess: () => {
                        setIsAddingItem(false);
                        setEditingItem(null);
                      },
                    });
                  }}
                  disabled={isSavingItem || !editingItem.imageUrl}
                  className="px-5 py-2 rounded-xl bg-[#ab5a46] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#83382a] disabled:opacity-50 transition-colors"
                >
                  {isSavingItem ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </div>
          )}

          {/* Items Gallery List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-[#1f1610] dark:text-white">
              Current Showcase Photos ({(communityData?.items || []).length})
            </h3>

            {communityLoading ? (
              <AdminSkeleton className="h-48 w-full" />
            ) : (communityData?.items || []).length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-neutral-500 border border-dashed border-[#c8b5aa]/60 rounded-xl">
                No community photos yet. Click "Add Community Photo" to add one!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(communityData?.items || []).map((item: CommunityGalleryItem, idx: number, arr: CommunityGalleryItem[]) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-[#c8b5aa]/40 dark:border-[#3d332b] bg-white dark:bg-[#251b14] flex gap-3 relative group"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#e8e1d9] flex-shrink-0 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.userHandle}
                        className="w-full h-full object-cover"
                      />
                      {item.tall && (
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-mono uppercase">
                          Tall
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-xs font-mono">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#ab5a46] truncate">
                            {item.userHandle || '@community'}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded ${
                              item.active !== false
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {item.active !== false ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        <p className="font-serif text-[#1f1610] dark:text-white text-sm truncate mt-1">
                          {item.productName || 'No linked product'}
                        </p>
                        {item.productSlug && (
                          <p className="text-[10px] text-neutral-400 truncate">
                            /{item.productSlug}
                          </p>
                        )}
                      </div>

                      {/* Reorder and Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-[#33261c] mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            title="Move Up"
                            disabled={idx === 0 || isReordering}
                            onClick={() => {
                              const newItems = [...arr];
                              const temp = newItems[idx - 1];
                              newItems[idx - 1] = newItems[idx];
                              newItems[idx] = temp;
                              reorderGallery({ items: newItems });
                            }}
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-[#33261c] disabled:opacity-25"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Move Down"
                            disabled={idx === arr.length - 1 || isReordering}
                            onClick={() => {
                              const newItems = [...arr];
                              const temp = newItems[idx + 1];
                              newItems[idx + 1] = newItems[idx];
                              newItems[idx] = temp;
                              reorderGallery({ items: newItems });
                            }}
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-[#33261c] disabled:opacity-25"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            title="Edit"
                            onClick={() => {
                              setEditingItem(item);
                              setIsAddingItem(true);
                            }}
                            className="p-1 text-neutral-600 hover:text-[#ab5a46] dark:text-neutral-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete"
                            disabled={isDeletingItem}
                            onClick={() => {
                              if (window.confirm(`Delete showcase photo for ${item.userHandle}?`)) {
                                deleteGalleryItem(item.id);
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
