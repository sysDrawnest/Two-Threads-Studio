import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Edit, Plus, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService'; // Assuming we have this
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

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-products', { page, search, status }],
    queryFn: () => productService.getProducts({ page, limit: 15, search, status }),
  });

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

        {isLoading ? (
          <div className="p-4"><AdminSkeleton className="h-96 w-full" /></div>
        ) : !response?.data || response.data.length === 0 ? (
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
        ) : (
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
                {response.data.map((product: any) => (
                  <AdminTableRow key={product.id}>
                    <AdminTableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-surface-container flex-shrink-0 overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
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
            {/* Implement Pagination when API supports it properly for products */}
            <AdminPagination
              currentPage={page}
              totalPages={response.pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};
