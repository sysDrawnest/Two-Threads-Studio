import React, { useState } from 'react';
import { FolderKanban, Edit, Plus, Trash2, Check, X } from 'lucide-react';
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

export const CollectionsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // '' | 'active' | 'inactive'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Query collections
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-collections'],
    queryFn: () => adminService.listCollectionsAdmin(),
  });

  const collections = response?.collections || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      toast.success('Collection created successfully');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create collection');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      toast.success('Collection updated successfully');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update collection');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      toast.success('Collection deleted successfully');
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete collection');
      setDeletingId(null);
    }
  });

  const openCreateModal = () => {
    setEditingCollection(null);
    setName('');
    setDescription('');
    setBannerImage('');
    setIsActive(true);
    setSortOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (col: any) => {
    setEditingCollection(col);
    setName(col.name);
    setDescription(col.description || '');
    setBannerImage(col.bannerImage || '');
    setIsActive(col.isActive ?? true);
    setSortOrder(col.sortOrder ?? 0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
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
      bannerImage: bannerImage || undefined,
      isActive,
      sortOrder: Number(sortOrder)
    };

    if (editingCollection) {
      updateMutation.mutate({ id: editingCollection.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredCollections = collections.filter((col: any) => {
    const matchesSearch = col.name.toLowerCase().includes(search.toLowerCase()) || 
                          (col.description && col.description.toLowerCase().includes(search.toLowerCase()));
    
    if (status === 'active') return matchesSearch && col.isActive === true;
    if (status === 'inactive') return matchesSearch && col.isActive === false;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Collections</h1>
          <p className="text-sm text-on-secondary-container mt-1">Manage seasonal, thematic, and curated groupings</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-container px-4 py-2 text-sm font-medium text-white hover:bg-primary-container/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Collection
        </button>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => setSearch(v)}
            placeholder="Search collections..."
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
        ) : filteredCollections.length === 0 ? (
          <AdminEmptyState
            icon={FolderKanban}
            title="No collections found"
            description={search || status ? "Try adjusting your search criteria" : "Start by creating a collection for your storefront."}
            action={
              !search && !status && (
                <button onClick={openCreateModal} className="mt-4 inline-flex items-center justify-center rounded-md border border-outline-variant px-4 py-2 text-sm font-medium text-primary-container hover:bg-surface-container transition-colors">
                  Create your first collection
                </button>
              )
            }
          />
        ) : (
          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Banner</AdminTableHead>
                <AdminTableHead>Collection Name</AdminTableHead>
                <AdminTableHead>Description</AdminTableHead>
                <AdminTableHead>Sort Order</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead className="text-right">Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {filteredCollections.map((col: any) => (
                <AdminTableRow key={col.id}>
                  <AdminTableCell>
                    <div className="h-12 w-20 rounded-lg bg-surface-container overflow-hidden border border-outline-variant">
                      {col.bannerImage ? (
                        <img src={col.bannerImage} alt={col.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-on-secondary-container/50">
                          <FolderKanban className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell className="font-semibold text-primary-container">
                    {col.name}
                  </AdminTableCell>
                  <AdminTableCell className="max-w-xs truncate text-on-secondary-container">
                    {col.description || '—'}
                  </AdminTableCell>
                  <AdminTableCell>
                    {col.sortOrder ?? 0}
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminBadge variant={col.isActive ? 'success' : 'default'}>
                      {col.isActive ? 'Visible' : 'Hidden'}
                    </AdminBadge>
                  </AdminTableCell>
                  <AdminTableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(col)}
                        className="inline-flex items-center justify-center p-2 text-on-secondary-container hover:bg-surface-container rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setDeletingId(col.id)}
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
                {editingCollection ? 'Edit Collection' : 'Create Collection'}
              </h2>
              <button onClick={closeModal} className="text-on-secondary-container hover:text-primary-container">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Collection Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] placeholder-[#8f7e73] focus:border-[#a89990] focus:ring-0 outline-none"
                  placeholder="e.g. Linen Collection" 
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
                  placeholder="Describe this collection..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Banner Image URL</label>
                <input 
                  type="url" 
                  value={bannerImage} 
                  onChange={(e) => setBannerImage(e.target.value)}
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
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        isOpen={deletingId !== null}
        title="Delete Collection"
        description="Are you sure you want to delete this collection? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
