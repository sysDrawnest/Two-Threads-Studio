import React, { useState } from 'react';
import { Package, AlertCircle, Plus, Minus, X } from 'lucide-react';
import { useAdminInventory, useAdjustStock } from '../../hooks/useAdminData';
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
import toast from 'react-hot-toast';

export const InventoryManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustmentValue, setAdjustmentValue] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('Manual Stock Adjustment');
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const { data: response, isLoading, refetch } = useAdminInventory({
    page,
    limit: 15,
    search,
    status
  });

  const { mutate: adjustStock, isPending: isAdjusting } = useAdjustStock();

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (adjustmentValue === 0) {
      toast.error('Adjustment value cannot be zero');
      return;
    }

    adjustStock(
      { id: selectedProduct.id, data: { adjustment: adjustmentValue, reason: adjustmentReason } },
      {
        onSuccess: () => {
          toast.success('Stock adjusted successfully');
          setIsAdjustOpen(false);
          setSelectedProduct(null);
          setAdjustmentValue(0);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to adjust stock');
        }
      }
    );
  };

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'In Stock', value: 'IN_STOCK' },
    { label: 'Low Stock', value: 'LOW_STOCK' },
    { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Inventory Management</h1>
          <p className="text-sm text-on-secondary-container mt-1">Track stock levels, incoming inventory, and reserved units</p>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by product name or SKU..."
            className="w-full sm:w-80"
          />
          <AdminFilterBar
            label="Stock Status"
            options={statusOptions}
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
          />
        </div>

        {isLoading ? (
          <div className="p-4"><AdminSkeleton className="h-96 w-full" /></div>
        ) : !response?.data?.products || response.data.products.length === 0 ? (
          <AdminEmptyState
            icon={Package}
            title="No inventory records found"
            description={search || status ? "Try adjusting your filters" : "Your catalog inventory is empty."}
          />
        ) : (
          <>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Product / SKU</AdminTableHead>
                  <AdminTableHead>Category</AdminTableHead>
                  <AdminTableHead className="text-right">Available Stock</AdminTableHead>
                  <AdminTableHead className="text-right">Threshold</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {response.data.products.map((item: any) => (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-surface-container flex-shrink-0 overflow-hidden">
                          {item.primaryImage ? (
                            <img src={item.primaryImage} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-on-secondary-container/50">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-primary-container">{item.name}</p>
                          <p className="font-mono text-xs text-on-secondary-container">SKU: {item.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="text-on-secondary-container">
                      {item.category?.name || 'General'}
                    </AdminTableCell>
                    <AdminTableCell className="font-medium text-primary-container text-right text-lg">
                      {item.stockQuantity}
                    </AdminTableCell>
                    <AdminTableCell className="text-right text-on-secondary-container">
                      {item.lowStockThreshold || 5}
                    </AdminTableCell>
                    <AdminTableCell>
                      {item.stockStatus === 'OUT_OF_STOCK' ? (
                        <AdminBadge variant="error">Out of Stock</AdminBadge>
                      ) : item.stockStatus === 'LOW_STOCK' ? (
                        <AdminBadge variant="warning">Low Stock</AdminBadge>
                      ) : (
                        <AdminBadge variant="success">In Stock</AdminBadge>
                      )}
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setAdjustmentValue(0);
                          setIsAdjustOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary-container text-white hover:bg-primary-container/90 transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
            {response.data.pagination && (
              <AdminPagination
                currentPage={response.data.pagination.page}
                totalPages={response.data.pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-background border border-outline-variant shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container/20">
              <h3 className="font-serif text-lg font-bold text-primary-container">
                Adjust Stock: {selectedProduct.name}
              </h3>
              <button onClick={() => setIsAdjustOpen(false)} className="text-on-secondary-container hover:text-primary-container">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div className="bg-surface-container/30 p-3 rounded-lg flex justify-between items-center text-sm">
                <span className="text-on-secondary-container">Current Quantity:</span>
                <span className="font-bold text-primary-container text-base">{selectedProduct.stockQuantity}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">
                  Adjustment Amount (+ to add, - to reduce)
                </label>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setAdjustmentValue(prev => prev - 1)}
                    className="p-2 rounded border border-outline-variant hover:bg-surface-container text-primary-container"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input 
                    type="number" 
                    value={adjustmentValue} 
                    onChange={e => setAdjustmentValue(parseInt(e.target.value) || 0)}
                    className="flex-1 rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-center font-bold text-[#1f1610] outline-none"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setAdjustmentValue(prev => prev + 1)}
                    className="p-2 rounded border border-outline-variant hover:bg-surface-container text-primary-container"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-on-secondary-container mt-1">
                  New Total will be: <strong className="text-primary-container">{Math.max(0, selectedProduct.stockQuantity + adjustmentValue)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Reason for Adjustment</label>
                <select 
                  value={adjustmentReason} 
                  onChange={e => setAdjustmentReason(e.target.value)}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] outline-none"
                >
                  <option value="Manual Stock Adjustment">Manual Stock Adjustment</option>
                  <option value="New Inventory Received">New Inventory Received</option>
                  <option value="Damaged / Spoiled Goods">Damaged / Spoiled Goods</option>
                  <option value="Audit Correction">Audit Correction</option>
                  <option value="Return to Stock">Return to Stock</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setIsAdjustOpen(false)}
                  className="px-4 py-2 rounded-md border border-outline-variant text-sm font-medium text-primary-container hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isAdjusting || adjustmentValue === 0}
                  className="px-4 py-2 rounded-md bg-primary-container text-sm font-medium text-white hover:bg-primary-container/90 transition-colors disabled:opacity-50"
                >
                  {isAdjusting ? 'Saving...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
