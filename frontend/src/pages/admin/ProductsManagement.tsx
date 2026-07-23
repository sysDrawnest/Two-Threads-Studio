import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Edit, Plus, Trash2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { 
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminBadge,
  AdminPagination,
  AdminSearchBar,
  AdminFilterBar,
  AdminSkeleton,
  AdminEmptyState
} from '../../components/admin/ui';

export const ProductsManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-products', { page, search, status }],
    queryFn: async () => {
      const res = await adminService.listProducts({ page, limit: 15, search, status });
      console.log('[ProductsManagement] Fetched products response:', res);
      return res;
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to archive "${name}"?`)) return;
    try {
      await adminService.deleteProduct(id);
      toast.success(`Product "${name}" archived successfully.`);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to archive product.');
    }
  };

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Archived', value: 'ARCHIVED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Products</h1>
          <p className="text-sm text-on-secondary-container mt-1">Manage your catalog, pricing, and visibility</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-container px-4 py-2 text-sm font-medium text-white hover:bg-primary-container/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search products by name or SKU..."
            className="w-full sm:w-80"
          />
          <AdminFilterBar
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
          />
        </div>

        {isError ? (
          <div className="p-8 text-center bg-[#fce8e6]/40 border border-[#f5c6cb] rounded-lg m-4 text-[#c5221f]">
            <p className="font-semibold text-base mb-1">Failed to load catalog products</p>
            <p className="text-xs font-mono mb-4">{(error as any)?.message || String(error)}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-medium bg-[#c5221f] text-white rounded-md hover:bg-[#a81a17] transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-4"><AdminSkeleton className="h-96 w-full" /></div>
        ) : (() => {
          const resObj = response as any;
          const productsList: any[] = Array.isArray(resObj)
            ? resObj
            : resObj?.products || resObj?.data?.products || (Array.isArray(resObj?.data) ? resObj.data : []);
          const paginationData = resObj?.pagination || resObj?.data?.pagination;

          if (productsList.length === 0) {
            return (
              <AdminEmptyState
                icon={Package}
                title="No products found"
                description={search || status ? "Try adjusting your filters" : "You haven't added any products to your catalog yet."}
                action={
                  !search && !status && (
                    <Link to="/admin/products/new" className="mt-4 inline-flex items-center justify-center rounded-md border border-outline-variant px-4 py-2 text-sm font-medium text-primary-container hover:bg-surface-container transition-colors">
                      Add your first product
                    </Link>
                  )
                }
              />
            );
          }

          return (
            <>
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Product</AdminTableHead>
                    <AdminTableHead>Category</AdminTableHead>
                    <AdminTableHead>Price</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">Actions</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>
                <AdminTableBody>
                  {productsList.map((product: any) => (
                    <AdminTableRow key={product.id}>
                      <AdminTableCell>
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-md bg-surface-container flex-shrink-0 overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                            ) : product.ogImageUrl ? (
                              <img src={product.ogImageUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-on-secondary-container/50">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-primary-container">{product.name}</p>
                            <p className="text-xs text-on-secondary-container">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell>
                        {product.category?.name || 'Uncategorized'}
                      </AdminTableCell>
                      <AdminTableCell className="font-medium">
                        ₹{product.price}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminBadge variant={product.status === 'ACTIVE' ? 'success' : product.status === 'DRAFT' ? 'warning' : 'default'}>
                          {product.status}
                        </AdminBadge>
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center p-2 text-on-secondary-container hover:bg-surface-container rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button 
                            type="button"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="inline-flex items-center justify-center p-2 text-on-secondary-container hover:bg-[#fce8e6] hover:text-[#c5221f] rounded-md transition-colors"
                            title="Archive Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
              <AdminPagination
                currentPage={page}
                totalPages={paginationData?.totalPages || 1}
                onPageChange={setPage}
              />
            </>
          );
        })()}

      </div>
    </div>
  );
};
