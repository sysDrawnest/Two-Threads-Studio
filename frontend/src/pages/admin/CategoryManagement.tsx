import React, { useState } from 'react';
import { Tags, Edit, Plus, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { 
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminBadge,
  AdminSearchBar,
  AdminFilterBar,
  AdminSkeleton,
  AdminEmptyState,
  AdminConfirmDialog
} from '../../components/admin/ui';
import toast from 'react-hot-toast';

export const CategoryManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // '' | 'active' | 'inactive'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Query categories
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.listCategoriesAdmin(),
  });

  const categories = response?.categories || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category created successfully');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category updated successfully');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted successfully');
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete category');
      setDeletingId(null);
    }
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('');
    setIsActive(true);
    setSortOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsActive(cat.isActive ?? true);
    setSortOrder(cat.sortOrder ?? 0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    const payload = {
      name,
      description: description || undefined,
      image: image || undefined,
      isActive,
      sortOrder: Number(sortOrder)
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredCategories = categories.filter((cat: any) => {
    const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase()) || 
                          (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()));
    
    if (status === 'active') return matchesSearch && cat.isActive === true;
    if (status === 'inactive') return matchesSearch && cat.isActive === false;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Categories</h1>
          <p className="text-sm text-on-secondary-container mt-1">Organize and structure storefront products</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-container px-4 py-2 text-sm font-medium text-white hover:bg-primary-container/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => setSearch(v)}
            placeholder="Search categories..."
            className="w-full sm:w-80"
          />
          <AdminFilterBar
            label="Visibility"
            options={[
              { label: 'All', value: '' },
              { label: 'Visible', value: 'active' },
              { label: 'Hidden', value: 'inactive' },
            ]}
            value={status}
            onChange={(v) => setStatus(v)}
          />
        </div>

        {isLoading ? (
          <div className="p-4"><AdminSkeleton className="h-96 w-full" /></div>
        ) : filteredCategories.length === 0 ? (
          <AdminEmptyState
            icon={Tags}
            title="No categories found"
            description={search || status ? "Try adjusting your search criteria" : "Start by creating a category for your storefront."}
            action={
              !search && !status && (
                <button onClick={openCreateModal} className="mt-4 inline-flex items-center justify-center rounded-md border border-outline-variant px-4 py-2 text-sm font-medium text-primary-container hover:bg-surface-container transition-colors">
                  Create your first category
                </button>
              )
            }
          />
        ) : (
          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Image</AdminTableHead>
                <AdminTableHead>Category Name</AdminTableHead>
                <AdminTableHead>Description</AdminTableHead>
                <AdminTableHead>Sort Order</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead className="text-right">Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {filteredCategories.map((cat: any) => (
                <AdminTableRow key={cat.id}>
                  <AdminTableCell>
                    <div className="h-12 w-12 rounded-lg bg-surface-container overflow-hidden border border-outline-variant">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-on-secondary-container/50">
                          <Tags className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell className="font-semibold text-primary-container">
                    {cat.name}
                  </AdminTableCell>
                  <AdminTableCell className="max-w-xs truncate text-on-secondary-container">
                    {cat.description || '—'}
                  </AdminTableCell>
                  <AdminTableCell>
                    {cat.sortOrder ?? 0}
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminBadge variant={cat.isActive ? 'success' : 'default'}>
                      {cat.isActive ? 'Visible' : 'Hidden'}
                    </AdminBadge>
                  </AdminTableCell>
                  <AdminTableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(cat)}
                        className="inline-flex items-center justify-center p-2 text-on-secondary-container hover:bg-surface-container rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setDeletingId(cat.id)}
                        className="inline-flex items-center justify-center p-2 text-on-secondary-container hover:bg-[#fce8e6] hover:text-[#c5221f] rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-background border border-outline-variant shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container/20">
              <h2 className="font-serif text-lg font-bold text-primary-container">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={closeModal} className="text-on-secondary-container hover:text-primary-container">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Category Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] placeholder-[#8f7e73] focus:border-[#a89990] focus:ring-0 outline-none"
                  placeholder="e.g. Embroidery Kits" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] placeholder-[#8f7e73] focus:border-[#a89990] focus:ring-0 outline-none"
                  placeholder="Tell clients about this category..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Image URL</label>
                <input 
                  type="url" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] placeholder-[#8f7e73] focus:border-[#a89990] focus:ring-0 outline-none"
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Sort Order</label>
                  <input 
                    type="number" 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] placeholder-[#8f7e73] focus:border-[#a89990] focus:ring-0 outline-none"
                  />
                </div>
                
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input 
                      type="checkbox" 
                      checked={isActive} 
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-[#c8b5aa] text-primary-container focus:ring-0"
                    />
                    <span className="text-sm font-semibold text-[#3c2b1e]">Visible on Store</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md border border-outline-variant text-sm font-medium text-primary-container hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 rounded-md bg-primary-container text-sm font-medium text-white hover:bg-primary-container/90 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        isOpen={deletingId !== null}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
