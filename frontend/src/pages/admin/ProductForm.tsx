import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Tags, Package, Settings, BarChart2, Star, Sparkles, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product, ProductStatus, ProductType, StudioProductType, HomepageSection, DifficultyLevel } from '../../types/product';
import { AdminSkeleton } from '../../components/admin/ui';

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [activeTab, setActiveTab] = useState('basic');
  const [product, setProduct] = useState<Partial<Product>>({
    status: ProductStatus.DRAFT,
    type: ProductType.PHYSICAL,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isHandmade: true,
    isSustainable: true,
    homepageSections: [],
    searchKeywords: [],
    materials: [],
    materialsIncluded: [],
  });

  useEffect(() => {
    if (isEdit && id) {
      adminService.getProduct(id).then(data => {
        setProduct(data.product);
        setIsLoading(false);
      }).catch(err => {
        console.error('Failed to load product', err);
        setIsLoading(false);
      });
    }
  }, [id, isEdit]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isEdit && id) {
        await adminService.updateProduct(id, product);
      } else {
        await adminService.createProduct(product);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4">
        <AdminSkeleton className="h-12 w-1/3" />
        <AdminSkeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur-sm py-4 z-10 border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-secondary-container transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary-container">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            {isEdit && <p className="text-sm text-on-secondary-container mt-1">ID: {id}</p>}
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-sm rounded-md border border-outline-variant font-medium text-primary-container hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary-container text-white hover:bg-primary-container/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : (isEdit ? 'Update Product' : 'Save Product')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-1">
          <button onClick={() => setActiveTab('basic')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'basic' ? 'bg-primary-container/10 text-primary-container' : 'text-on-secondary-container hover:bg-surface-container'}`}>
            <Package className="h-4 w-4" /> Basic Details
          </button>
          <button onClick={() => setActiveTab('editorial')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'editorial' ? 'bg-primary-container/10 text-primary-container' : 'text-on-secondary-container hover:bg-surface-container'}`}>
            <Sparkles className="h-4 w-4" /> Editorial & Marketing
          </button>
          <button onClick={() => setActiveTab('media')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'media' ? 'bg-primary-container/10 text-primary-container' : 'text-on-secondary-container hover:bg-surface-container'}`}>
            <ImageIcon className="h-4 w-4" /> Media & Assets
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-primary-container/10 text-primary-container' : 'text-on-secondary-container hover:bg-surface-container'}`}>
            <BarChart2 className="h-4 w-4" /> Inventory & Variants
          </button>
          <button onClick={() => setActiveTab('seo')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'seo' ? 'bg-primary-container/10 text-primary-container' : 'text-on-secondary-container hover:bg-surface-container'}`}>
            <Tags className="h-4 w-4" /> SEO & Shipping
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-outline-variant bg-background p-6 space-y-4">
                <h2 className="text-lg font-serif font-bold text-primary-container mb-4">Core Identity</h2>
                
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Product Name *</label>
                  <input name="name" value={product.name || ''} onChange={handleChange} type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="e.g. Linen Summer Dress" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Short Description (Subtitle)</label>
                  <input name="shortDescription" value={product.shortDescription || ''} onChange={handleChange} type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="A brief catchphrase..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Full Description *</label>
                  <textarea name="description" value={product.description || ''} onChange={handleChange} rows={6} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Rich product description..." required></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Category ID *</label>
                    <input name="categoryId" value={product.categoryId || ''} onChange={handleChange} type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Category UUID" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Collection ID</label>
                    <input name="collectionId" value={product.collectionId || ''} onChange={handleChange} type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Collection UUID" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Studio Product Type</label>
                    <select name="studioType" value={product.studioType || ''} onChange={handleChange} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container bg-background">
                      <option value="">None</option>
                      {Object.values(StudioProductType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Difficulty Level</label>
                    <select name="difficulty" value={product.difficulty || ''} onChange={handleChange} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container bg-background">
                      <option value="">None</option>
                      {Object.values(DifficultyLevel).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Status</label>
                    <select name="status" value={product.status || ''} onChange={handleChange} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container bg-background font-medium">
                      <option value="ACTIVE">Active (Published)</option>
                      <option value="DRAFT">Draft</option>
                      <option value="HIDDEN">Hidden</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editorial' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-outline-variant bg-background p-6 space-y-4">
                <h2 className="text-lg font-serif font-bold text-primary-container mb-4">Editorial Storytelling</h2>
                
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Product Story / Inspiration</label>
                  <textarea name="productStory" value={product.productStory || ''} onChange={handleChange} rows={4} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="The story behind this creation..."></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Artisan Notes</label>
                  <textarea name="artisanNotes" value={product.artisanNotes || ''} onChange={handleChange} rows={3} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Notes from the maker..."></textarea>
                </div>

                <div className="border-t border-outline-variant pt-4 mt-4">
                  <h3 className="text-sm font-medium text-primary-container mb-3">Marketing Flags</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isFeatured" checked={product.isFeatured} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      Featured Product
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isBestSeller" checked={product.isBestSeller} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      Best Seller
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isNewArrival" checked={product.isNewArrival} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      New Arrival
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isHandmade" checked={product.isHandmade} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      Handmade
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isSustainable" checked={product.isSustainable} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      Sustainable / Eco
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isLimitedEdition" checked={product.isLimitedEdition} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      Limited Edition
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-outline-variant bg-background p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-serif font-bold text-primary-container">Media Assets</h2>
                  {isEdit && (
                    <button className="px-3 py-1.5 text-sm bg-surface-container rounded-md hover:bg-surface-container/80 transition-colors">
                      Upload New Media
                    </button>
                  )}
                </div>
                
                {!isEdit ? (
                  <div className="p-8 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container/30">
                    <AlertCircle className="h-8 w-8 text-on-secondary-container mx-auto mb-2" />
                    <p className="text-on-secondary-container text-sm">Please save the product first to upload media.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {product.media && product.media.length > 0 ? (
                      product.media.map(m => (
                        <div key={m.id} className="aspect-square bg-surface-container rounded-lg overflow-hidden relative group">
                          <img src={m.url} alt={m.altText || ''} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white backdrop-blur-sm transition-colors text-xs">Edit</button>
                            <button className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md text-white backdrop-blur-sm transition-colors text-xs">Del</button>
                          </div>
                          {m.isPrimary && (
                            <div className="absolute top-2 left-2 bg-primary-container text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Primary</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-8 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container/30 text-on-secondary-container text-sm">
                        No media uploaded yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-outline-variant bg-background p-6 space-y-4">
                <h2 className="text-lg font-serif font-bold text-primary-container mb-4">Pricing & Inventory</h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Base Price (₹) *</label>
                    <input name="price" value={product.price || ''} onChange={handleChange} type="number" step="0.01" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Compare at Price (₹)</label>
                    <input name="comparePrice" value={product.comparePrice || ''} onChange={handleChange} type="number" step="0.01" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Cost Price (₹)</label>
                    <input name="costPrice" value={product.costPrice || ''} onChange={handleChange} type="number" step="0.01" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Stock Quantity</label>
                    <input name="stockQuantity" value={product.stockQuantity || 0} onChange={handleChange} type="number" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Low Stock Threshold</label>
                    <input name="lowStockThreshold" value={product.lowStockThreshold || 5} onChange={handleChange} type="number" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">SKU</label>
                    <input name="sku" value={product.sku || ''} onChange={handleChange} type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-outline-variant bg-background p-6 space-y-4">
                <h2 className="text-lg font-serif font-bold text-primary-container mb-4">SEO Metadata</h2>
                
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">SEO Title</label>
                  <input name="seoTitle" value={product.seoTitle || ''} onChange={handleChange} type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Optimized title for search engines" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">SEO Description</label>
                  <textarea name="seoDescription" value={product.seoDescription || ''} onChange={handleChange} rows={2} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Meta description..."></textarea>
                </div>
              </div>

              <div className="rounded-xl border border-outline-variant bg-background p-6 space-y-4">
                <h2 className="text-lg font-serif font-bold text-primary-container mb-4">Shipping & Tax</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Weight (kg)</label>
                    <input name="weight" value={product.weight || ''} onChange={handleChange} type="number" step="0.01" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">HSN Code</label>
                    <input name="hsnCode" value={product.hsnCode || ''} onChange={handleChange} type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">GST %</label>
                    <input name="gstPercent" value={product.gstPercent || ''} onChange={handleChange} type="number" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" />
                  </div>
                  <div className="flex flex-col justify-center gap-2 mt-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isFreeShipping" checked={product.isFreeShipping} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      Free Shipping
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isFragile" checked={product.isFragile} onChange={handleChange} className="rounded text-primary-container focus:ring-primary-container" />
                      Fragile Item
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
