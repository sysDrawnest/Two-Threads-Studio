/**
 * CMS Dashboard — Phase 9 (CMS Phase 1)
 * Admin page for managing storefront content via the CMS engine.
 * Currently contains: Hero Section module.
 * Architecture is designed to expand with future modules (Banner, Collections, etc.)
 */
import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAdminHeroConfig, useUpdateHeroConfig } from '../../hooks/useCms';
import { AdminSkeleton } from '../../components/admin/ui';

// ─── Template metadata ────────────────────────────────────────────────────────

interface TemplateOption {
  id: 1 | 2 | 3;
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
    name: 'Editorial Slideshow',
    description: 'Full-screen 4-panel auto-advancing luxury slideshow with animated typography and progress bar.',
    icon: Layers,
    tag: 'Dynamic',
    tagColor: 'bg-[#1e2a1a]/30 text-[#7a9b5e] dark:bg-[#1e2a1a] dark:text-[#7a9b5e]',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-[#2a1a14] to-[#1a0f0a] relative overflow-hidden rounded-sm">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-2 left-3">
          <span className="font-serif text-[#f4ebd9]/20 text-xl">01</span>
        </div>
        <div className="absolute bottom-4 left-3 right-8">
          <div className="w-10 h-0.5 bg-[#ab5a46] mb-2" />
          <div className="font-serif text-[#f4ebd9]/70 text-xs leading-tight">
            <span className="block">Indigo</span>
            <span className="block italic text-[#ab5a46]">Embroidery</span>
          </div>
          <div className="mt-2 w-12 h-3 rounded border border-[#ab5a46]/40" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-0.5 rounded-full ${i === 0 ? 'h-4 bg-[#ab5a46]' : 'h-2 bg-[#f4ebd9]/20'}`} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f4ebd9]/10">
          <div className="h-full w-1/3 bg-[#ab5a46]" />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: 'The Floating Gallery',
    description: 'Museum exhibition experience — floating asymmetrical textile artworks with organic typography flow.',
    icon: Columns2,
    tag: 'Exhibition',
    tagColor: 'bg-[#ab5a46]/20 text-[#ab5a46] dark:bg-[#ab5a46]/30 dark:text-[#f4ebd9]',
    preview: (
      <div className="w-full h-full bg-[#16120e] relative overflow-hidden rounded-sm p-2 flex flex-col justify-between">
        <div className="absolute top-2 left-2 w-8 h-10 bg-[#ab5a46]/30 border border-[#f4ebd9]/20 rounded-xs" />
        <div className="absolute top-3 right-3 w-10 h-12 bg-[#7a9b5e]/30 border border-[#f4ebd9]/20 rounded-xs" />
        <div className="absolute bottom-2 left-4 w-7 h-9 bg-[#8b7ab8]/30 border border-[#f4ebd9]/20 rounded-xs" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
          <span className="font-serif text-[#f4ebd9] text-[10px]">Handcrafted</span>
          <span className="font-serif text-[#ab5a46] text-[11px] italic">Memories</span>
        </div>
      </div>
    ),
  },
];

// ─── Future module placeholder ────────────────────────────────────────────────

const FUTURE_MODULES = [
  'Homepage',
  'Banners',
  'Collections',
  'Product Sections',
  'Learning Studio',
  'Blog',
  'Footer',
  'Navigation',
  'SEO',
  'Landing Pages',
];

// ─── Main Component ────────────────────────────────────────────────────────────

export const CMSDashboard: React.FC = () => {
  const { data, isLoading } = useAdminHeroConfig();
  const { mutate: updateHero, isPending: isSaving } = useUpdateHeroConfig();

  const [selectedTemplate, setSelectedTemplate] = useState<1 | 2 | 3 | null>(null);

  // Sync selection from server once loaded
  const serverTemplate = data?.data?.activeTemplate ?? 1;
  const activeSelection = selectedTemplate ?? serverTemplate;

  const isDirty = selectedTemplate !== null && selectedTemplate !== serverTemplate;

  const handleSave = () => {
    if (!isDirty) return;
    updateHero(activeSelection as 1 | 2 | 3, {
      onSuccess: () => setSelectedTemplate(null),
    });
  };

  const handlePreview = () => {
    window.open('/', '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
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
              Content Management
            </h1>
            <p className="text-sm text-[#786455] dark:text-[#ccb08a] mt-0.5">
              Manage live storefront content — CMS Phase 1
            </p>
          </div>
        </div>
      </div>

      {/* ── Enterprise Warning Panel ─── */}
      <div className="relative overflow-hidden rounded-md border border-amber-500/40 bg-amber-950/10 dark:bg-amber-950/25 p-5 sm:p-6">
        {/* Gradient accent bar */}
        <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600" />

        <div className="flex gap-4 pl-2">
          <div className="shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-sm font-semibold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
              Live Storefront Content — Handle With Care
            </h2>
            <div className="space-y-1.5 text-sm text-[#5c4a3a] dark:text-[#d4b896]/80 leading-relaxed">
              <p>
                Changes made here are applied <strong className="text-amber-600 dark:text-amber-400">immediately</strong> to
                the live customer-facing website. There is no staging buffer.
              </p>
              <p>
                Incorrect settings may disrupt the customer experience for all active visitors.
                Only authorized administrators should modify CMS settings.
              </p>
              <p className="font-medium text-[#4a3828] dark:text-[#ccb08a]">
                Do not make changes unless you fully understand their visual and business impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Section Module ─── */}
      <div className="rounded-md border border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] overflow-hidden">

        {/* Module header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c8b5aa]/40 dark:border-[#3d332b]">
          <div className="flex items-center gap-3">
            <Image className="h-4 w-4 text-[#786455] dark:text-[#ccb08a]" />
            <h2 className="font-sans text-sm font-semibold text-[#1f1610] dark:text-white tracking-wide">
              Hero Section
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Current active label */}
            {!isDirty && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#786455] dark:text-[#ccb08a]/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Template {serverTemplate} active
              </span>
            )}
            {isDirty && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                Unsaved changes
              </span>
            )}

            <button
              onClick={handlePreview}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-[#c8b5aa]/60 dark:border-[#3d332b] text-[#786455] dark:text-[#ccb08a] hover:bg-[#f2ede8] dark:hover:bg-[#2c231c] transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview Live
            </button>

            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded bg-[#ab5a46] text-[#f4ebd9] hover:bg-[#c46b56] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Module body — template selector */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#786455] dark:text-[#ccb08a]/70">
            Select the hero layout displayed at the top of the homepage. Changes take effect immediately for all visitors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEMPLATES.map(template => {
              const Icon = template.icon;
              const isSelected = activeSelection === template.id;
              const isCurrentServer = serverTemplate === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    group relative text-left rounded-md border-2 overflow-hidden transition-all duration-200
                    ${isSelected
                      ? 'border-[#ab5a46] shadow-md shadow-[#ab5a46]/20'
                      : 'border-[#c8b5aa]/40 dark:border-[#3d332b] hover:border-[#ab5a46]/50'
                    }
                  `}
                  aria-pressed={isSelected}
                  aria-label={`Select ${template.name}`}
                >
                  {/* Preview thumbnail */}
                  <div className="aspect-video w-full bg-[#2a1a14] overflow-hidden">
                    {template.preview}
                  </div>

                  {/* Card body */}
                  <div className="p-4 bg-[#fef8f3] dark:bg-[#1e1610]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-[#ab5a46]' : 'text-[#786455] dark:text-[#ccb08a]'}`} />
                        <span className={`font-sans text-xs font-semibold ${isSelected ? 'text-[#ab5a46]' : 'text-[#1f1610] dark:text-white'}`}>
                          {template.name}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[9px] font-medium tracking-wide px-1.5 py-0.5 rounded-full ${template.tagColor}`}>
                          {template.tag}
                        </span>
                        {isCurrentServer && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            ✓ Active
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-sans text-[11px] text-[#786455] dark:text-[#ccb08a]/70 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Selected indicator ring */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ab5a46] flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Save / action footer */}
          {isDirty && (
            <div className="flex items-center justify-between pt-4 border-t border-[#c8b5aa]/30 dark:border-[#3d332b]">
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Template {activeSelection} will go live immediately for all customers on save
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-xs px-3 py-1.5 rounded border border-[#c8b5aa]/50 dark:border-[#3d332b] text-[#786455] dark:text-[#ccb08a] hover:bg-[#f2ede8] dark:hover:bg-[#2c231c] transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-xs px-4 py-1.5 rounded bg-[#ab5a46] text-[#f4ebd9] hover:bg-[#c46b56] transition-colors disabled:opacity-40"
                >
                  {isSaving ? 'Saving…' : `Publish Template ${activeSelection}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Future Modules ─── */}
      <div className="rounded-md border border-[#c8b5aa]/40 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#1e1610] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c8b5aa]/30 dark:border-[#3d332b] flex items-center justify-between">
          <div>
            <h2 className="font-sans text-sm font-semibold text-[#1f1610] dark:text-white">
              Upcoming CMS Modules
            </h2>
            <p className="text-xs text-[#786455] dark:text-[#ccb08a]/60 mt-0.5">
              Additional content areas will be added in future CMS phases
            </p>
          </div>
          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#d1c4bd]/30 dark:bg-[#2c231c] text-[#786455] dark:text-[#ccb08a]">
            Phase 2+
          </span>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {FUTURE_MODULES.map(mod => (
              <div
                key={mod}
                className="inline-flex items-center gap-2 px-3 py-2 rounded border border-[#c8b5aa]/30 dark:border-[#3d332b] text-xs text-[#786455]/60 dark:text-[#ccb08a]/40 select-none"
              >
                <ChevronRight className="w-3 h-3" />
                {mod}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CMSDashboard;
