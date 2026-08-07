/**
 * CMS Dashboard — Phase 9 (CMS Phase 1)
 * Admin page for managing storefront content via the CMS engine.
 * Currently contains: Hero Section module.
 * Architecture is designed to expand with future modules (Banner, Collections, etc.)
 */
import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Layout,
  ChevronRight,
  Eye,
  Save,
  CheckCircle2,
  Image,
  Layers,
  Columns2,
  Clock,
  Sparkles,
  Sliders,
  Grid,
  ShoppingBag,
  ListOrdered,
  Plus,
  Trash2,
} from 'lucide-react';
import portraitCutout from '../../assets/1F78D49-EC80-4B90-A90F-D848BECFD893.png';
import {
  useAdminHeroConfig,
  useUpdateHeroConfig,
  useHomepageMerchandising,
  useUpdateHomepageMerchandising,
} from '../../hooks/useCms';
import { AdminSkeleton } from '../../components/admin/ui';

// ─── Template metadata ────────────────────────────────────────────────────────

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
        <div className="absolute bottom-2 inset-x-0 flex flex-col items-center gap-1">
          <div className="w-24 h-1 rounded bg-[#f4ebd9]/20" />
          <div className="w-14 h-4 rounded bg-[#f4ebd9]/30" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    name: 'Immersive Portrait',
    description: 'Quiet luxury layout — single full-bleed editorial photograph with elegant negative space typography and a single CTA.',
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
          <span className="block font-serif text-xs font-normal leading-tight mt-1">Handcrafted,<br />One Stitch<br /><span className="italic">at a Time.</span></span>
          <span className="block text-[6px] mt-2 border-b border-[#fef8f3]/60 w-max pb-0.5">Explore Collection →</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: 'Editorial Portfolio',
    description: 'Black & cream luxury editorial layout with scrolling marquee typography, horizontal accent line, and center portrait cutout.',
    icon: Sparkles,
    tag: 'Portfolio',
    tagColor: 'bg-[#efeee9]/20 text-[#efeee9] dark:bg-[#efeee9]/10 dark:text-[#efeee9]',
    preview: (
      <div className="w-full h-full bg-black relative overflow-hidden rounded-sm flex items-center justify-center">
        <img
          src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-x-0 top-[20%] text-center text-[#efeee9]/40 font-hn text-[14px] sm:text-[16px] tracking-tighter whitespace-nowrap overflow-hidden font-bold select-none z-10">
          Two Threads &mdash; Studio
        </div>
        <div className="absolute inset-x-3 bottom-5 h-[1px] bg-[#efeee9]/80 z-10" />
        <div className="absolute inset-x-3 bottom-1.5 flex justify-between text-[6px] text-[#efeee9]/70 z-10 font-hn">
          <span>Handcrafted Indigo</span>
          <span>Two Threads Studio</span>
        </div>
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
    description: 'Quiet luxury framed image surrounded by generous whitespace, simple typography, and a single CTA.',
    icon: Layout,
    tag: 'Restraint',
    tagColor: 'bg-[#efe0d8]/30 text-[#ab5a46] dark:bg-[#efe0d8]/10 dark:text-[#efe0d8]',
    preview: (
      <div className="w-full h-full bg-[#fef8f3] relative overflow-hidden rounded-sm flex flex-col items-center justify-center p-2 text-[#17110c]">
        <span className="text-[7px] font-serif italic mb-1 text-[#ab5a46]">Handmade</span>
        <div className="w-12 h-14 bg-[#e6e2dd] border border-[#17110c]/10 rounded-sm overflow-hidden mb-1 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=150&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[6px] font-serif text-center leading-tight">Crafted to become<br />tomorrow's heirloom.</span>
        <span className="text-[6px] mt-1 border-b border-[#17110c]/40 pb-0.5">Shop →</span>
      </div>
    ),
  },
];

export const CMSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'merchandising'>('merchandising');

  // Hero config query & mutation
  const { data: heroData, isLoading: isHeroLoading } = useAdminHeroConfig();
  const { mutate: updateHero, isPending: isSavingHero } = useUpdateHeroConfig();
  const [selectedTemplate, setSelectedTemplate] = useState<1 | 2 | 3 | 4 | null>(null);

  // Merchandising query & mutation
  const { data: merchData, isLoading: isMerchLoading } = useHomepageMerchandising();
  const { mutate: updateMerch, isPending: isSavingMerch } = useUpdateHomepageMerchandising();

  // Local Merchandising Form State
  const [merchState, setMerchState] = useState({
    bestSellersTitle: 'Curated Masterpieces',
    bestSellersSubtitle: 'Best Sellers',
    bestSellersMax: 8,
    newArrivalsTitle: 'New Arrivals',
    newArrivalsSubtitle: 'Fresh Off The Loom',
    newArrivalsMax: 8,
    menswearTitle: 'Tailored Elegance',
    menswearSubtitle: 'Premium Menswear Collection',
    womenswearTitle: 'Grace in Every Stitch',
    womenswearSubtitle: 'Premium Womenswear Collection',
    sectionsOrder: ['hero', 'trustBar', 'bestSellers', 'newArrivals', 'menswear', 'womenswear', 'videoBanner', 'sacredTraditions', 'shopByOccasion', 'shopByCategory'],
  });

  useEffect(() => {
    if (merchData?.data?.merchandising) {
      const m = merchData.data.merchandising;
      setMerchState(prev => ({
        ...prev,
        ...m,
      }));
    }
  }, [merchData]);

  const serverTemplate = heroData?.data?.activeTemplate ?? 1;
  const activeSelection = selectedTemplate ?? serverTemplate;
  const isHeroDirty = selectedTemplate !== null && selectedTemplate !== serverTemplate;

  const handleSaveHero = () => {
    if (!isHeroDirty) return;
    updateHero(activeSelection as 1 | 2 | 3 | 4, {
      onSuccess: () => setSelectedTemplate(null),
    });
  };

  const handleSaveMerchandising = () => {
    updateMerch(merchState);
  };

  const handlePreview = () => {
    window.open('/', '_blank', 'noopener,noreferrer');
  };

  if (isHeroLoading || isMerchLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <AdminSkeleton className="h-28 w-full" />
        <AdminSkeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Page header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-[#ab5a46]/10">
            <Layout className="h-5 w-5 text-[#ab5a46]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1f1610] dark:text-white">
              Content & Merchandising CMS
            </h1>
            <p className="text-sm text-[#786455] dark:text-[#ccb08a] mt-0.5">
              Control live storefront sections, hero templates, and product merchandising
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md border border-[#c8b5aa]/60 dark:border-[#3d332b] text-[#786455] dark:text-[#ccb08a] hover:bg-[#f2ede8] dark:hover:bg-[#2c231c] transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview Live Website
          </button>
        </div>
      </div>

      {/* ── Tab Switcher ─── */}
      <div className="flex border-b border-[#c8b5aa]/40 dark:border-[#3d332b] gap-6">
        <button
          onClick={() => setActiveTab('merchandising')}
          className={`pb-3 text-xs font-mono uppercase tracking-widest font-semibold transition-all cursor-pointer border-b-2 ${
            activeTab === 'merchandising'
              ? 'border-[#ab5a46] text-[#ab5a46]'
              : 'border-transparent text-[#786455] hover:text-[#1f1610] dark:text-[#ccb08a]'
          }`}
        >
          Homepage Merchandising & Sections
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 text-xs font-mono uppercase tracking-widest font-semibold transition-all cursor-pointer border-b-2 ${
            activeTab === 'hero'
              ? 'border-[#ab5a46] text-[#ab5a46]'
              : 'border-transparent text-[#786455] hover:text-[#1f1610] dark:text-[#ccb08a]'
          }`}
        >
          Hero Layout Templates
        </button>
      </div>

      {/* ── TAB 1: Merchandising & Section Controls ─── */}
      {activeTab === 'merchandising' && (
        <div className="space-y-6">
          <div className="rounded-md border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#c8b5aa]/40 pb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1f1610] dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#ab5a46]" />
                  Section Titles & Display Settings
                </h2>
                <p className="text-xs text-[#786455] dark:text-[#ccb08a]/70">
                  Configure headings, item limits, and featured product displays across key storefront sections.
                </p>
              </div>
              <button
                onClick={handleSaveMerchandising}
                disabled={isSavingMerch}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded bg-[#ab5a46] text-[#f4ebd9] hover:bg-[#c46b56] transition-colors disabled:opacity-40"
              >
                <Save className="h-3.5 w-3.5" />
                {isSavingMerch ? 'Saving…' : 'Save Merchandising Config'}
              </button>
            </div>

            {/* Best Sellers Settings */}
            <div className="p-4 rounded border border-[#c8b5aa]/30 bg-white/50 dark:bg-black/20 space-y-3">
              <h3 className="font-sans text-xs uppercase font-bold tracking-widest text-[#ab5a46]">
                Best Sellers Section Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#786455] mb-1">Section Title</label>
                  <input
                    type="text"
                    value={merchState.bestSellersTitle}
                    onChange={e => setMerchState({ ...merchState, bestSellersTitle: e.target.value })}
                    className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#786455] mb-1">Subtitle / Badge</label>
                  <input
                    type="text"
                    value={merchState.bestSellersSubtitle}
                    onChange={e => setMerchState({ ...merchState, bestSellersSubtitle: e.target.value })}
                    className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#786455] mb-1">Max Displayed Items</label>
                  <input
                    type="number"
                    value={merchState.bestSellersMax}
                    onChange={e => setMerchState({ ...merchState, bestSellersMax: Number(e.target.value) })}
                    className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* New Arrivals Settings */}
            <div className="p-4 rounded border border-[#c8b5aa]/30 bg-white/50 dark:bg-black/20 space-y-3">
              <h3 className="font-sans text-xs uppercase font-bold tracking-widest text-[#ab5a46]">
                New Arrivals Section Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#786455] mb-1">Section Title</label>
                  <input
                    type="text"
                    value={merchState.newArrivalsTitle}
                    onChange={e => setMerchState({ ...merchState, newArrivalsTitle: e.target.value })}
                    className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#786455] mb-1">Subtitle / Badge</label>
                  <input
                    type="text"
                    value={merchState.newArrivalsSubtitle}
                    onChange={e => setMerchState({ ...merchState, newArrivalsSubtitle: e.target.value })}
                    className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#786455] mb-1">Max Displayed Items</label>
                  <input
                    type="number"
                    value={merchState.newArrivalsMax}
                    onChange={e => setMerchState({ ...merchState, newArrivalsMax: Number(e.target.value) })}
                    className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Menswear & Womenswear Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded border border-[#c8b5aa]/30 bg-white/50 dark:bg-black/20 space-y-3">
                <h3 className="font-sans text-xs uppercase font-bold tracking-widest text-[#ab5a46]">
                  Premium Menswear Banner Title
                </h3>
                <input
                  type="text"
                  value={merchState.menswearTitle}
                  onChange={e => setMerchState({ ...merchState, menswearTitle: e.target.value })}
                  className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs"
                />
              </div>

              <div className="p-4 rounded border border-[#c8b5aa]/30 bg-white/50 dark:bg-black/20 space-y-3">
                <h3 className="font-sans text-xs uppercase font-bold tracking-widest text-[#ab5a46]">
                  Premium Womenswear Banner Title
                </h3>
                <input
                  type="text"
                  value={merchState.womenswearTitle}
                  onChange={e => setMerchState({ ...merchState, womenswearTitle: e.target.value })}
                  className="w-full p-2 border rounded border-[#c8b5aa]/40 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Hero Layout Selector ─── */}
      {activeTab === 'hero' && (
        <div className="rounded-md border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#c8b5aa]/40 dark:border-[#3d332b]">
            <div className="flex items-center gap-3">
              <Image className="h-4 w-4 text-[#786455] dark:text-[#ccb08a]" />
              <h2 className="font-sans text-sm font-semibold text-[#1f1610] dark:text-white tracking-wide">
                Hero Section Template Selector
              </h2>
            </div>
            <button
              onClick={handleSaveHero}
              disabled={!isHeroDirty || isSavingHero}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded bg-[#ab5a46] text-[#f4ebd9] hover:bg-[#c46b56] transition-colors disabled:opacity-40"
            >
              <Save className="h-3.5 w-3.5" />
              {isSavingHero ? 'Saving…' : 'Save Hero Template'}
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATES.map(template => {
                const Icon = template.icon;
                const isSelected = activeSelection === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`text-left rounded-md border-2 p-4 transition-all ${
                      isSelected ? 'border-[#ab5a46] bg-white' : 'border-[#c8b5aa]/30 hover:border-[#ab5a46]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-sm font-semibold">{template.name}</span>
                      <Icon className="w-4 h-4 text-[#ab5a46]" />
                    </div>
                    <p className="text-xs text-neutral-500">{template.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSDashboard;
