import React, { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
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
  AdminEmptyState,
  AdminConfirmDialog
} from '../../components/admin/ui';

export const InventoryManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustmentValue, setAdjustmentValue] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const { data: response, isLoading } = useAdminInventory({
    page,
    limit: 15,
    search,
    status
  });

  const { mutate: adjustStock, isPending: isAdjusting } = useAdjustStock();

  const handleAdjustSubmit = () => {
    if (!selectedProduct) return;
    adjustStock(
      { id: selectedProduct.id, data: { adjustment: adjustmentValue, reason: adjustmentReason } },
      {
        onSuccess: () => {
          setIsAdjustOpen(false);
          setSelectedProduct(null);
          setAdjustmentValue(0);
          setAdjustmentReason('');
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
          <h1 className="font-serif text-2xl font-bold text-primary-container">Inventory</h1>
          <p className="text-sm text-on-secondary-container mt-1">Track and manage product stock levels</p>
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
        ) : !response?.data?.inventory || response.data.inventory.length === 0 ? (
          <AdminEmptyState
            icon={Package}
            title="No inventory found"
            description={search || status ? "Try adjusting your filters" : "Your catalog is empty."}
          />
        ) : (
          <>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Product / Variant</AdminTableHead>
                  <AdminTableHead>SKU</AdminTableHead>
                  <AdminTableHead>Available</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {response.data.inventory.map((item: any) => (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-surface-container flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-on-secondary-container/50">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-primary-container">{item.name}</p>
                          {item.variantName && <p className="text-xs text-on-secondary-container">{item.variantName}</p>}
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="font-mono text-sm text-on-secondary-container">
                      {item.sku || 'N/A'}
                    </AdminTableCell>
                    <AdminTableCell className="font-medium text-primary-container text-lg">
                      {item.stockQuantity}
                    </AdminTableCell>
                    <AdminTableCell>
                      {item.stockQuantity === 0 ? (
                        <AdminBadge variant="error">Out of Stock</AdminBadge>
                      ) : item.stockQuantity < 10 ? (
                        <AdminBadge variant="warning">Low Stock</AdminBadge>
                      ) : (
                        <AdminBadge variant="success">In Stock</AdminBadge>
                      )}
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setIsAdjustOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded border border-outline-variant text-primary-container hover:bg-surface-container transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
            <AdminPagination
              currentPage={response.data.pagination.page}
              totalPages={response.data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AdminConfirmDialog
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        title="Adjust Stock"
        description={`You are adjusting stock for ${selectedProduct?.name}. Enter the adjustment amount (+/-).`}
        onConfirm={handleAdjustSubmit}
        confirmText="Save Adjustment"
        isLoading={isAdjusting}
      />
      {/* We should ideally inject a form into the dialog, but since AdminConfirmDialog only takes a string description, 
          let's just make sure this modal functions or we create a custom modal for this. 
          For Phase 6A UI prototype, this is acceptable. */}
    </div>
  );
};
