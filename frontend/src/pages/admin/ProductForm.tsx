import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

// A simple placeholder form for product editing/creation
export const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/admin/products');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-secondary-container transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary-container">
              Add Product
            </h1>
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
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-outline-variant bg-background p-6">
            <h2 className="text-base font-medium text-primary-container mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">Product Name</label>
                <input type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="e.g. Linen Summer Dress" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">Description</label>
                <textarea rows={4} className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Product description..."></textarea>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-outline-variant bg-background p-6">
            <h2 className="text-base font-medium text-primary-container mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">Price (₹)</label>
                <input type="number" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">Compare at Price (₹)</label>
                <input type="number" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">SKU</label>
                <input type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="e.g. DRESS-01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">Stock Quantity</label>
                <input type="number" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-outline-variant bg-background p-6">
            <h2 className="text-base font-medium text-primary-container mb-4">Status</h2>
            <select className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container bg-background">
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="rounded-xl border border-outline-variant bg-background p-6">
            <h2 className="text-base font-medium text-primary-container mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">Category</label>
                <select className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container bg-background">
                  <option value="">Select Category</option>
                  <option value="dresses">Dresses</option>
                  <option value="tops">Tops</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-secondary-container mb-1">Tags</label>
                <input type="text" className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container" placeholder="Summer, Linen (comma separated)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
