import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Package,
  BarChart2,
  Sparkles,
  Plus,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Globe,
  Upload,
  Trash2,
  Truck,
  FolderTree,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product, ProductStatus, ProductType, StudioProductType } from '../../types/product';
import { AdminSkeleton } from '../../components/admin/ui';
import toast from 'react-hot-toast';

// Exact requested step order:
// 1. Basic Details
// 2. Pricing
// 3. Inventory
// 4. Images
// 5. Organization (Category, Collection, Tags)
// 6. Shipping
// 7. SEO
// 8. Publish

const WIZARD_STEPS = [
  { id: 1, title: 'Basic Details', icon: Package, desc: 'Name & Description' },
  { id: 2, title: 'Pricing', icon: DollarSign, desc: 'Base Price & Cost' },
  { id: 3, title: 'Inventory', icon: BarChart2, desc: 'SKU & Stock Level' },
  { id: 4, title: 'Images', icon: ImageIcon, desc: 'Primary & Gallery Media' },
  { id: 5, title: 'Organization', icon: FolderTree, desc: 'Category & Collection' },
  { id: 6, title: 'Shipping', icon: Truck, desc: 'Weight, Dimensions & COD' },
  { id: 7, title: 'SEO', icon: Globe, desc: 'Search & Meta Tags' },
  { id: 8, title: 'Publish', icon: CheckCircle2, desc: 'Review & Catalog Publish' },
];

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [uploadStatus, setUploadStatus] = useState<{ configured: boolean; provider: string; message?: string }>({
    configured: true,
    provider: 'local',
  });
  const [isUploading, setIsUploading] = useState(false);

  // Category State
  const [categories, setCategories] = useState<any[]>([]);
  const [isQuickCatOpen, setIsQuickCatOpen] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatDesc, setQuickCatDesc] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  // Auto-Save timestamp
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Form State (Maintained across all wizard steps)
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    shortDescription: '',
    description: '',
    status: ProductStatus.DRAFT,
    type: ProductType.PHYSICAL,
    price: undefined,
    comparePrice: undefined,
    costPrice: undefined,
    stockQuantity: 0,
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    sku: '',
    barcode: '',
    categoryId: '',
    collectionId: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isHandmade: true,
    isSustainable: true,
    isEcoFriendly: false,
    allowCod: true,
    isFreeShipping: false,
    isFragile: false,
    materials: [],
    searchKeywords: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImageUrl: '',
    canonicalUrl: '',
    weight: undefined,
    dimensions: { length: 10, width: 10, height: 5, unit: 'cm' },
    hsnCode: '',
    gstPercent: 18,
    shippingClass: 'STANDARD',
  });

  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; isPrimary: boolean }>>([]);

  const fetchCategories = async () => {
    try {
      const res = await adminService.listCategoriesAdmin();
      const catList = res?.categories || (Array.isArray(res) ? res : []);
      const activeCats = catList
        .filter((c: any) => c.isActive !== false)
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
      setCategories(activeCats);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchUploadStatus = async () => {
    try {
      const res = await adminService.getUploadStatus();
      if (res?.data) {
        setUploadStatus(res.data);
      }
    } catch (err) {
      console.error('Upload status check failed', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUploadStatus();

    if (isEdit && id) {
      adminService.getProduct(id).then(res => {
        const prodData = res.product || res.data || res;
        setProduct(prodData);
        if (prodData.images && prodData.images.length > 0) {
          setGalleryImages(prodData.images.map((img: any) => ({
            url: img.url,
            isPrimary: Boolean(img.isPrimary),
          })));
        } else if (prodData.ogImageUrl) {
          setGalleryImages([{ url: prodData.ogImageUrl, isPrimary: true }]);
        }
        setIsLoading(false);
      }).catch(err => {
        console.error('Failed to load product', err);
        toast.error('Failed to load product details');
        setIsLoading(false);
      });
    } else {
      const savedDraft = localStorage.getItem('tts_product_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed && parsed.name) {
            toast((t) => (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium">Restored draft for "{parsed.name}"</span>
                <button
                  onClick={() => {
                    setProduct(parsed);
                    if (parsed.galleryImages) setGalleryImages(parsed.galleryImages);
                    toast.dismiss(t.id);
                  }}
                  className="px-2 py-1 rounded bg-[#4e3c30] text-white text-xs font-bold"
                >
                  Load
                </button>
              </div>
            ), { duration: 6000 });
          }
        } catch { }
      }
    }
  }, [id, isEdit]);

  // Auto-Save Draft every 30 seconds
  useEffect(() => {
    if (isEdit) return;
    const interval = setInterval(() => {
      if (product.name || product.description || product.price) {
        localStorage.setItem('tts_product_draft', JSON.stringify({ ...product, galleryImages }));
        setLastAutoSave(new Date());
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [product, galleryImages, isEdit]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentStep(prev => Math.min(WIZARD_STEPS.length, prev + 1));
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentStep(prev => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProduct(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setProduct(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  // Image Upload Handling with friendly error messages
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const fileList = Array.from(files);
      const res = await adminService.uploadMultipleImages(fileList);
      const uploadedResults = res?.data?.images || res?.images || [res?.data || res];

      const newImages = uploadedResults.map((item: any, idx: number) => ({
        url: item.url || item.filename,
        isPrimary: galleryImages.length === 0 && idx === 0,
      }));

      setGalleryImages(prev => [...prev, ...newImages]);
      if (!product.ogImageUrl && newImages[0]?.url) {
        setProduct(prev => ({ ...prev, ogImageUrl: newImages[0].url }));
      }
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    } catch (err: any) {
      console.error('File upload failed', err);
      const msg = err.message || err.response?.data?.message;
      if (msg?.includes('too large')) {
        toast.error('File exceeds upload limit of 10 MB per image.');
      } else if (msg?.includes('Unsupported image format')) {
        toast.error('Unsupported image format. Allowed: JPEG, PNG, WEBP, GIF, SVG.');
      } else if (err.status === 0 || err.code === 'ERR_NETWORK') {
        toast.error('Network connection lost. Please check backend status.');
      } else {
        toast.error(msg || 'Image upload failed because storage is unavailable.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = (url: string) => {
    if (!url.trim()) return;
    const isFirst = galleryImages.length === 0;
    setGalleryImages(prev => [...prev, { url: url.trim(), isPrimary: isFirst }]);
    if (isFirst) {
      setProduct(prev => ({ ...prev, ogImageUrl: url.trim() }));
    }
    toast.success('Image URL added');
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true;
        setProduct(p => ({ ...p, ogImageUrl: updated[0].url }));
      }
      return updated;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setGalleryImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
    setProduct(prev => ({ ...prev, ogImageUrl: galleryImages[index].url }));
    toast.success('Primary image updated');
  };

  // Quick Category Creation
  const handleQuickCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;
    try {
      setIsCreatingCat(true);
      const newCat = await adminService.createCategory({ name: quickCatName, description: quickCatDesc, isActive: true });
      toast.success('Category created & selected');
      await fetchCategories();
      const catId = newCat?.id || newCat?.data?.id;
      if (catId) {
        setProduct(prev => ({ ...prev, categoryId: catId }));
      }
      setIsQuickCatOpen(false);
      setQuickCatName('');
      setQuickCatDesc('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsCreatingCat(false);
    }
  };

  // Save / Publish Product
  const handleSaveProduct = async (statusOverride?: ProductStatus) => {
    if (!product.name?.trim()) {
      toast.error('Product Name is required (Step 1)');
      setCurrentStep(1);
      return;
    }
    if (!product.description?.trim()) {
      toast.error('Product Description is required (Step 1)');
      setCurrentStep(1);
      return;
    }
    if (product.price === undefined || product.price === null || Number(product.price) <= 0) {
      toast.error('Valid Price is required (Step 2)');
      setCurrentStep(2);
      return;
    }
    if (!product.categoryId) {
      toast.error('Category is required (Step 5)');
      setCurrentStep(5);
      return;
    }

    setIsSaving(true);

    try {
      const cleanUrl = (val?: string | null) => (val && val.trim() !== '' ? val.trim() : undefined);

      let difficulty: string | undefined = product.difficulty ? String(product.difficulty).toUpperCase() : undefined;
      if (difficulty && !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficulty)) {
        difficulty = undefined;
      }

      let studioType: string | undefined = product.studioType ? String(product.studioType).toUpperCase() : undefined;

      const num = (val: any) => (val !== undefined && val !== null && val !== '' && !isNaN(Number(val)) ? Number(val) : undefined);

      const payload: any = {
        ...product,
        status: statusOverride || product.status || ProductStatus.DRAFT,
        difficulty,
        studioType,
        price: num(product.price),
        comparePrice: num(product.comparePrice),
        costPrice: num(product.costPrice),
        stockQuantity: num(product.stockQuantity) ?? 0,
        lowStockThreshold: num(product.lowStockThreshold) ?? 5,
        weight: num(product.weight),
        gstPercent: num(product.gstPercent),
        estimatedProductionDays: num(product.estimatedProductionDays),
        estimatedShippingDays: num(product.estimatedShippingDays),
        collectionId: product.collectionId?.trim() ? product.collectionId : undefined,
        sku: product.sku?.trim() ? product.sku : undefined,
        ogImageUrl: cleanUrl(galleryImages.find(g => g.isPrimary)?.url || galleryImages[0]?.url || product.ogImageUrl),
        canonicalUrl: cleanUrl(product.canonicalUrl),
        images: galleryImages.map((g, idx) => ({
          url: g.url,
          isPrimary: Boolean(g.isPrimary),
          sortOrder: idx,
        })),
      };

      // Strip null and empty string values so Zod optional schema validation passes
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || (typeof payload[key] === 'string' && payload[key].trim() === '')) {
          payload[key] = undefined;
        }
      });

      if (isEdit && id) {
        await adminService.updateProduct(id, payload);
        toast.success('Product saved successfully.');
      } else {
        await adminService.createProduct(payload);
        localStorage.removeItem('tts_product_draft');
        toast.success('Product saved successfully.');
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    } catch (err: any) {
      console.error('Failed to save product', err);
      if (err.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Failed to save product.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-6">
        <AdminSkeleton className="h-14 w-full" />
        <AdminSkeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 text-[#2d2520] dark:text-[#e2deda]">

      {/* Top Bar Header */}
      <div className="sticky top-0 z-30 bg-[#faf6f0]/95 dark:bg-[#1a1613]/95 backdrop-blur-md border-b border-[#c8b5aa]/40 dark:border-[#3d332b] py-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-2 rounded-md hover:bg-[#ebe2d8] dark:hover:bg-[#2b231d] text-[#5c4a3e] dark:text-[#b8a698] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-semibold tracking-tight text-[#1f1610] dark:text-[#ffffff]">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${product.status === ProductStatus.ACTIVE ? 'bg-[#2e7d32]/10 text-[#2e7d32]' : 'bg-[#8c6b3e]/10 text-[#8c6b3e]'
                }`}>
                {product.status || 'DRAFT'}
              </span>
            </div>
            <p className="text-xs text-[#786455] dark:text-[#a8998c]">
              Step {currentStep} of {WIZARD_STEPS.length}: <strong>{WIZARD_STEPS[currentStep - 1].title}</strong>
              {lastAutoSave && <span className="ml-3 text-[11px] text-[#2e7d32]">&bull; Draft saved {lastAutoSave.toLocaleTimeString()}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveProduct(ProductStatus.DRAFT)}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs font-medium rounded-md border border-[#c8b5aa]/60 text-[#5c4a3e] dark:text-[#ccb08a] hover:bg-[#ebe2d8] dark:hover:bg-[#2b231d] transition-colors"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSaveProduct(ProductStatus.ACTIVE)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md bg-[#4e3c30] text-white hover:bg-[#3d2e24] dark:bg-[#ccb08a] dark:text-[#171311] dark:hover:bg-[#dfc49f] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Publishing...' : (isEdit ? 'Update Product' : 'Publish Product')}
          </button>
        </div>
      </div>

      {/* 8-Step Progress Bar (Exact User Requested Order) */}
      <div className="rounded-xl border border-[#c8b5aa]/50 dark:border-[#3d332b] bg-white dark:bg-[#211c18] p-4 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[820px] gap-2">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all flex-1 text-center group ${isCurrent
                    ? 'bg-[#fef8f3] dark:bg-[#28211b] border border-[#8c6b3e]/40'
                    : isCompleted
                      ? 'hover:bg-[#f5eeea] dark:hover:bg-[#241e18]'
                      : 'opacity-60 hover:opacity-100'
                    }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${isCurrent
                    ? 'bg-[#4e3c30] text-white dark:bg-[#ccb08a] dark:text-[#171311] shadow-xs'
                    : isCompleted
                      ? 'bg-[#2e7d32] text-white'
                      : 'bg-[#ebeeef] dark:bg-[#2c241e] text-[#5c4a3e] dark:text-[#a8998c]'
                    }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs font-medium line-clamp-1 ${isCurrent ? 'text-[#1f1610] dark:text-[#ffffff] font-semibold' : 'text-[#5c4a3e] dark:text-[#b8a698]'}`}>
                    {step.title}
                  </span>
                </button>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`h-0.5 w-3 shrink-0 rounded-full transition-colors ${isCompleted ? 'bg-[#2e7d32]' : 'bg-[#c8b5aa]/30'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="rounded-xl border border-[#c8b5aa]/50 dark:border-[#3d332b] bg-white dark:bg-[#211c18] p-6 shadow-xs min-h-[460px]">
        <AnimatePresence mode="wait">

          {/* STEP 1: BASIC DETAILS */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 1: Basic Details</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">Define core product name, subtitle, and detailed product description</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                    Product Name <span className="text-[#c62828]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name || ''}
                    onChange={handleChange}
                    placeholder="e.g. Botanical Meadow Embroidery Kit"
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none focus:border-[#4e3c30]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                    Subtitle / Catchphrase
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={product.shortDescription || ''}
                    onChange={handleChange}
                    placeholder="e.g. Hand-stitched floral art kit with organic cotton threads"
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none focus:border-[#4e3c30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                    Full Description <span className="text-[#c62828]">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={product.description || ''}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Detailed story, craftsmanship notes, materials, and care instructions..."
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none focus:border-[#4e3c30]"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PRICING */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 2: Pricing</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">Set base selling price, compare at price, and studio cost price</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                    Base Price (₹) <span className="text-[#c62828]">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price ?? ''}
                    onChange={handleChange}
                    placeholder="1299"
                    step="0.01"
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={product.comparePrice ?? ''}
                    onChange={handleChange}
                    placeholder="1599"
                    step="0.01"
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                    Cost Price (Studio Cost ₹)
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={product.costPrice ?? ''}
                    onChange={handleChange}
                    placeholder="450"
                    step="0.01"
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: INVENTORY */}
          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 3: Inventory</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">SKU, barcode, stock quantity, low-stock threshold and backorders</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={product.sku || ''}
                      onChange={handleChange}
                      placeholder="KIT-BOTANICAL-001"
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      Available Stock Quantity <span className="text-[#c62828]">*</span>
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={product.stockQuantity ?? 0}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      Low Stock Alert Threshold
                    </label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      value={product.lowStockThreshold ?? 5}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t border-[#c8b5aa]/30">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#1f1610] dark:text-[#ffffff] cursor-pointer">
                    <input
                      type="checkbox"
                      name="trackInventory"
                      checked={Boolean(product.trackInventory)}
                      onChange={handleChange}
                      className="rounded border-[#c8b5aa]"
                    />
                    Track Stock Automatically
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#1f1610] dark:text-[#ffffff] cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowBackorders"
                      checked={Boolean(product.allowBackorders)}
                      onChange={handleChange}
                      className="rounded border-[#c8b5aa]"
                    />
                    Allow Backorders when Out of Stock
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: IMAGES */}
          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 4: Images & Media</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">Primary product image, gallery uploads, drag & drop, and previews</p>
              </div>

              {/* Upload Provider Badge */}
              <div className="rounded-lg border border-[#c8b5aa]/40 bg-[#fef8f3] dark:bg-[#1a1613] p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5c4a3e] dark:text-[#b8a698]">
                  <Upload className="h-4 w-4 text-[#8c6b3e]" />
                  <span>
                    Storage Provider: <strong>{uploadStatus.provider === 'cloudinary' ? 'Cloudinary Cloud CDN' : 'Local Storage Mode'}</strong>
                  </span>
                </div>
                <span className="text-[11px] text-[#8c7a6b]">PNG, JPG, WEBP, SVG (Max 10MB per file)</span>
              </div>

              {/* Drag & Drop File Picker */}
              <div className="border-2 border-dashed border-[#c8b5aa] dark:border-[#3d332b] rounded-xl p-6 text-center hover:bg-[#fef8f3]/40 dark:hover:bg-[#1f1a16] transition-colors relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#ebe2d8] dark:bg-[#2b231d] flex items-center justify-center text-[#4e3c30] dark:text-[#ccb08a]">
                    {isUploading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <p className="text-xs font-semibold text-[#1f1610] dark:text-[#ffffff]">
                    {isUploading ? 'Uploading Image Files...' : 'Click or Drag & Drop Product Images'}
                  </p>
                  <p className="text-[11px] text-[#786455] dark:text-[#a8998c]">
                    Multiple files supported
                  </p>
                </div>
              </div>

              {/* Image URL Paste Fallback */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste direct image URL (e.g. Unsplash link)..."
                  id="directImageUrl"
                  className="flex-1 rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3 py-1.5 text-xs text-[#1f1610] dark:text-[#ffffff] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('directImageUrl') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddImageUrl(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded bg-[#4e3c30] text-white hover:bg-[#3d2e24] transition-colors"
                >
                  Add Image URL
                </button>
              </div>

              {/* Attached Images Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">
                  Product Images ({galleryImages.length})
                </h3>

                {galleryImages.length === 0 ? (
                  <p className="text-xs italic text-[#786455] p-4 text-center border border-dashed border-[#c8b5aa]/40 rounded-lg">
                    No images uploaded yet. Select files or paste image URLs above.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className={`relative group rounded-lg overflow-hidden border aspect-square ${img.isPrimary ? 'border-[#2e7d32] ring-2 ring-[#2e7d32]/30' : 'border-[#c8b5aa]/50'}`}>
                        <img src={img.url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                          {!img.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="px-2 py-1 bg-[#2e7d32] text-white text-[10px] font-bold rounded"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 bg-[#c62828] text-white rounded hover:bg-[#a82222]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {img.isPrimary && (
                          <span className="absolute top-2 left-2 bg-[#2e7d32] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            PRIMARY
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: ORGANIZATION */}
          {currentStep === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 5: Organization & Categorization</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">Assign category, collection, status, and storefront badges</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">
                        Product Category <span className="text-[#c62828]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsQuickCatOpen(true)}
                        className="text-xs font-medium text-[#8c6b3e] hover:underline flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Quick Create
                      </button>
                    </div>

                    <select
                      name="categoryId"
                      value={product.categoryId || ''}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-white dark:bg-[#1a1613] px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none"
                      required
                    >
                      <option value="">▼ Select Category</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      Collection UUID / ID
                    </label>
                    <input
                      type="text"
                      name="collectionId"
                      value={product.collectionId || ''}
                      onChange={handleChange}
                      placeholder="Optional collection ID..."
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      Skill / Difficulty Level
                    </label>
                    <select
                      name="difficulty"
                      value={product.difficulty ? String(product.difficulty).toUpperCase() : 'BEGINNER'}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-white dark:bg-[#1a1613] px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#c8b5aa]/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-3">
                    Storefront Badges
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" name="isFeatured" checked={Boolean(product.isFeatured)} onChange={handleChange} className="rounded text-[#4e3c30]" />
                      Featured Product
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" name="isBestSeller" checked={Boolean(product.isBestSeller)} onChange={handleChange} className="rounded text-[#4e3c30]" />
                      Best Seller
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" name="isNewArrival" checked={Boolean(product.isNewArrival)} onChange={handleChange} className="rounded text-[#4e3c30]" />
                      New Arrival
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" name="isHandmade" checked={Boolean(product.isHandmade ?? true)} onChange={handleChange} className="rounded text-[#4e3c30]" />
                      Handmade
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" name="isSustainable" checked={Boolean(product.isSustainable ?? true)} onChange={handleChange} className="rounded text-[#4e3c30]" />
                      Sustainable / Eco
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: SHIPPING */}
          {currentStep === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 6: Shipping & Logistics</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">Parcel weight, GST rate, HSN code, Cash on Delivery rules, and shipping options</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={product.weight ?? ''}
                      onChange={handleChange}
                      placeholder="0.45"
                      step="0.01"
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      GST Rate (%)
                    </label>
                    <input
                      type="number"
                      name="gstPercent"
                      value={product.gstPercent ?? 18}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">
                      HSN Code
                    </label>
                    <input
                      type="text"
                      name="hsnCode"
                      value={product.hsnCode || ''}
                      onChange={handleChange}
                      placeholder="6307"
                      className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm font-mono text-[#1f1610] dark:text-[#ffffff] outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t border-[#c8b5aa]/30">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#1f1610] dark:text-[#ffffff] cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowCod"
                      checked={Boolean(product.allowCod ?? true)}
                      onChange={handleChange}
                      className="rounded border-[#c8b5aa]"
                    />
                    Allow Cash on Delivery (COD)
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#1f1610] dark:text-[#ffffff] cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFreeShipping"
                      checked={Boolean(product.isFreeShipping)}
                      onChange={handleChange}
                      className="rounded border-[#c8b5aa]"
                    />
                    Free Shipping Eligible
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#1f1610] dark:text-[#ffffff] cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFragile"
                      checked={Boolean(product.isFragile)}
                      onChange={handleChange}
                      className="rounded border-[#c8b5aa]"
                    />
                    Fragile Item (Extra Protective Packaging)
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7: SEO */}
          {currentStep === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 7: Search Engine Optimization (SEO)</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">Google search snippet titles, meta descriptions, and keywords</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">
                      SEO Title
                    </label>
                    <span className="text-[11px] text-[#786455]">{(product.seoTitle || '').length} / 70 chars</span>
                  </div>
                  <input
                    type="text"
                    name="seoTitle"
                    value={product.seoTitle || ''}
                    onChange={handleChange}
                    placeholder={product.name || 'Botanical Embroidery Kit | Two Threads Studio'}
                    maxLength={70}
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">
                      Meta Description
                    </label>
                    <span className="text-[11px] text-[#786455]">{(product.seoDescription || '').length} / 160 chars</span>
                  </div>
                  <textarea
                    name="seoDescription"
                    value={product.seoDescription || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Handcrafted embroidery kit with natural threads..."
                    maxLength={160}
                    className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: PUBLISH */}
          {currentStep === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border-b border-[#c8b5aa]/30 pb-3">
                <h2 className="font-serif text-lg font-medium text-[#1f1610] dark:text-[#ffffff]">Step 8: Final Review & Publish</h2>
                <p className="text-xs text-[#786455] dark:text-[#a8998c]">Verify product overview before publishing to live store catalog</p>
              </div>

              {/* Summary Overview Card */}
              <div className="rounded-lg border border-[#c8b5aa]/40 bg-[#fef8f3] dark:bg-[#1a1613] p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#c8b5aa]/30 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-[#ebe2d8] dark:bg-[#2b231d] overflow-hidden flex items-center justify-center text-xs">
                      {galleryImages[0]?.url ? (
                        <img src={galleryImages[0].url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-[#786455]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-[#1f1610] dark:text-[#ffffff]">
                        {product.name || 'Untitled Product'}
                      </h3>
                      <p className="text-xs text-[#786455] dark:text-[#a8998c]">
                        {product.shortDescription || 'No subtitle provided'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-lg font-bold text-[#1f1610] dark:text-[#ffffff]">₹{product.price || 0}</span>
                    {product.comparePrice && <span className="block text-xs line-through text-[#8c7a6b]">₹{product.comparePrice}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="block text-[#786455] uppercase text-[10px] font-bold">Category</span>
                    <span className="font-medium text-[#1f1610] dark:text-[#ffffff]">
                      {categories.find(c => c.id === product.categoryId)?.name || 'Unassigned'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[#786455] uppercase text-[10px] font-bold">Available Stock</span>
                    <span className="font-medium text-[#1f1610] dark:text-[#ffffff] font-mono">
                      {product.stockQuantity || 0} units
                    </span>
                  </div>

                  <div>
                    <span className="block text-[#786455] uppercase text-[10px] font-bold">SKU</span>
                    <span className="font-medium text-[#1f1610] dark:text-[#ffffff] font-mono">
                      {product.sku || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[#786455] uppercase text-[10px] font-bold">Status</span>
                    <span className="font-bold text-[#2e7d32]">{product.status || 'DRAFT'}</span>
                  </div>
                </div>
              </div>

              {/* Validation Status Badges */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">
                  Catalog Readiness Checks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className={`p-2.5 rounded flex items-center gap-2 border ${product.name ? 'bg-[#ebeee9] border-[#2e7d32]/30 text-[#2e7d32]' : 'bg-[#fce8e6] border-[#c62828]/30 text-[#c62828]'}`}>
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Product Name: {product.name ? 'Validated' : 'Missing'}</span>
                  </div>
                  <div className={`p-2.5 rounded flex items-center gap-2 border ${product.categoryId ? 'bg-[#ebeee9] border-[#2e7d32]/30 text-[#2e7d32]' : 'bg-[#fce8e6] border-[#c62828]/30 text-[#c62828]'}`}>
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Category Assigned: {product.categoryId ? 'Validated' : 'Missing'}</span>
                  </div>
                  <div className={`p-2.5 rounded flex items-center gap-2 border ${product.price && Number(product.price) > 0 ? 'bg-[#ebeee9] border-[#2e7d32]/30 text-[#2e7d32]' : 'bg-[#fce8e6] border-[#c62828]/30 text-[#c62828]'}`}>
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Base Price: {product.price ? `₹${product.price}` : 'Missing'}</span>
                  </div>
                  <div className={`p-2.5 rounded flex items-center gap-2 border ${galleryImages.length > 0 ? 'bg-[#ebeee9] border-[#2e7d32]/30 text-[#2e7d32]' : 'bg-[#fef8f3] border-[#8c6b3e]/30 text-[#8c6b3e]'}`}>
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Images: {galleryImages.length} attached</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#c8b5aa]/30">
                <button
                  type="button"
                  onClick={() => handleSaveProduct(ProductStatus.DRAFT)}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium rounded-md border border-[#c8b5aa]/60 text-[#5c4a3e] dark:text-[#ccb08a] hover:bg-[#ebe2d8] transition-colors"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveProduct(ProductStatus.ACTIVE)}
                  disabled={isSaving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 text-xs font-medium rounded-md bg-[#2e7d32] text-white hover:bg-[#256628] transition-colors shadow-xs disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {isSaving ? 'Publishing...' : 'Publish Product to Catalog'}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-[#c8b5aa]/30 mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md border border-[#c8b5aa]/60 text-[#5c4a3e] dark:text-[#b8a698] hover:bg-[#ebe2d8] dark:hover:bg-[#2b231d] transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Previous Step
          </button>

          <span className="text-xs text-[#786455] hidden sm:inline">
            Step {currentStep} of {WIZARD_STEPS.length} (Press Alt + ← / → to navigate)
          </span>

          {currentStep < WIZARD_STEPS.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(WIZARD_STEPS.length, prev + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md bg-[#4e3c30] text-white hover:bg-[#3d2e24] dark:bg-[#ccb08a] dark:text-[#171311] transition-colors"
            >
              Next Step <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSaveProduct(ProductStatus.ACTIVE)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-md bg-[#2e7d32] text-white hover:bg-[#256628] transition-colors"
            >
              Finish & Publish <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Category Modal */}
      {isQuickCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#211c18] border border-[#c8b5aa]/50 dark:border-[#3d332b] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#c8b5aa]/30 px-6 py-4 bg-[#fef8f3] dark:bg-[#1a1613]">
              <h3 className="font-serif text-lg font-bold text-[#1f1610] dark:text-[#ffffff]">Create New Category</h3>
              <button type="button" onClick={() => setIsQuickCatOpen(false)} className="text-[#786455] hover:text-[#1f1610]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleQuickCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">Category Name *</label>
                <input
                  type="text"
                  value={quickCatName}
                  onChange={e => setQuickCatName(e.target.value)}
                  placeholder="e.g. Home Decor"
                  className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a] mb-1.5">Description</label>
                <textarea
                  value={quickCatDesc}
                  onChange={e => setQuickCatDesc(e.target.value)}
                  rows={3}
                  placeholder="Brief category description..."
                  className="w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] dark:text-[#ffffff] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#c8b5aa]/30">
                <button
                  type="button"
                  onClick={() => setIsQuickCatOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#c8b5aa]/60 text-xs font-medium text-[#5c4a3e] dark:text-[#b8a698]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCat}
                  className="px-4 py-2 rounded-md bg-[#4e3c30] text-white text-xs font-medium hover:bg-[#3d2e24] disabled:opacity-50"
                >
                  {isCreatingCat ? 'Creating...' : 'Save & Assign Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
