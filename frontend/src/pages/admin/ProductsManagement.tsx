import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { mockAdminProducts, AdminProduct } from '../../data/adminData';

const statusColors: Record<string, string> = {
  active: 'bg-[#e8f4e8] text-[#3a6b3a]',
  draft: 'bg-surface-container text-on-surface-variant',
  archived: 'bg-error-container text-error',
};

const ProductsManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', inventory: '', difficulty: '', collection: '', status: 'active' });

  const openAdd = () => { setEditProduct(null); setForm({ name: '', category: '', price: '', inventory: '', difficulty: '', collection: '', status: 'active' }); setIsModalOpen(true); };
  const openEdit = (p: AdminProduct) => { setEditProduct(p); setForm({ name: p.name, category: p.category, price: String(p.price), inventory: String(p.inventory), difficulty: p.difficulty, collection: p.collection, status: p.status }); setIsModalOpen(true); };

  const inputCls = "w-full p-2.5 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent font-sans text-sm";
  const labelCls = "block font-sans text-xs uppercase tracking-widest text-primary-container mb-1.5";

  const columns = [
    {
      key: 'image', label: 'Product',
      render: (p: AdminProduct) => (
        <div className="flex items-center gap-3">
          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover bg-surface-container flex-shrink-0" />
          <span className="font-sans text-sm text-primary-container">{p.name}</span>
        </div>
      )
    },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'collection', label: 'Collection', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (p: AdminProduct) => <span>${p.price}</span> },
    { key: 'inventory', label: 'Inventory', sortable: true, render: (p: AdminProduct) => <span className={p.inventory === 0 ? 'text-error font-medium' : ''}>{p.inventory}</span> },
    { key: 'difficulty', label: 'Difficulty' },
    {
      key: 'status', label: 'Status',
      render: (p: AdminProduct) => (
        <span className={`font-sans text-[10px] px-2 py-1 uppercase tracking-wider ${statusColors[p.status]}`}>{p.status}</span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (p: AdminProduct) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(p)} className="font-sans text-xs text-on-secondary-container hover:text-primary-container bg-transparent border-none cursor-pointer underline">Edit</button>
          <button className="font-sans text-xs text-error hover:text-error/70 bg-transparent border-none cursor-pointer underline">Delete</button>
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-primary-container">Products</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">{mockAdminProducts.length} products total</p>
        </div>
        <button onClick={openAdd} className="bg-primary-container text-inverse-on-surface px-6 py-3 font-sans text-xs tracking-widest uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors flex items-center gap-2">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      <div className="bg-background border border-outline-variant p-6">
        <DataTable data={mockAdminProducts} columns={columns} searchPlaceholder="Search products..." />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editProduct ? 'Edit Product' : 'Add Product'} size="lg">
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={e => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="sm:col-span-2">
            <label className={labelCls}>Product Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Botanical Meadow Kit" required />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
              <option>Embroidery Kit</option><option>Pattern</option><option>Home Decor</option><option>Supplies</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Collection</label>
            <select value={form.collection} onChange={e => setForm(f => ({ ...f, collection: e.target.value }))} className={inputCls}>
              <option>Botanical</option><option>Cottage</option><option>Linen</option><option>Seasonal</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Price ($)</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputCls} placeholder="68" required />
          </div>
          <div>
            <label className={labelCls}>Inventory</label>
            <input type="number" value={form.inventory} onChange={e => setForm(f => ({ ...f, inventory: e.target.value }))} className={inputCls} placeholder="42" required />
          </div>
          <div>
            <label className={labelCls}>Difficulty</label>
            <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} className={inputCls}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
              <option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-outline-variant bg-transparent font-sans text-sm text-primary-container cursor-pointer hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-primary-container text-inverse-on-surface font-sans text-sm border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors">Save Product</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsManagement;
