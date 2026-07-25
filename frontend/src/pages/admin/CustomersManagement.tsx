import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, Trash2 } from 'lucide-react';
import { useAdminCustomers, useUpdateCustomerStatus, useDeleteCustomer } from '../../hooks/useAdminData';
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

export const CustomersManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; email: string } | null>(null);

  const { data: response, isLoading } = useAdminCustomers({
    page,
    limit: 15,
    search,
    isActive: status === 'ACTIVE' ? true : status === 'INACTIVE' ? false : undefined,
  });

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCustomerStatus();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatus({ id, isActive: !currentStatus });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteCustomer(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null)
    });
  };

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Customers</h1>
          <p className="text-sm text-on-secondary-container mt-1">Manage user accounts and profiles</p>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-outline-variant bg-surface-container/30">
          <AdminSearchBar 
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by name, email or phone..."
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
        ) : !response?.data || (!response.data.customers?.length && !response.data.users?.length) ? (
          <AdminEmptyState
            icon={Users}
            title="No customers found"
            description={search || status ? "Try adjusting your filters" : "You don't have any customers yet."}
          />
        ) : (
          <>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Customer</AdminTableHead>
                  <AdminTableHead>Contact</AdminTableHead>
                  <AdminTableHead>Orders</AdminTableHead>
                  <AdminTableHead>Total Spent</AdminTableHead>
                  <AdminTableHead>Joined</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {(response.data.customers || response.data.users || []).map((user: any) => (
                  <AdminTableRow key={user.id}>
                    <AdminTableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-medium text-on-secondary-container">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-primary-container">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-on-secondary-container">{user.role}</p>
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="text-sm text-primary-container">{user.email}</p>
                      {user.phone && <p className="text-xs text-on-secondary-container">{user.phone}</p>}
                    </AdminTableCell>
                    <AdminTableCell>
                      {user._count?.orders || user.customerRisk?.ordersPlaced || 0}
                    </AdminTableCell>
                    <AdminTableCell className="font-medium">
                      ₹{user.totalSpent || 0}
                    </AdminTableCell>
                    <AdminTableCell>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminBadge variant={user.isActive ? 'success' : 'error'}>
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </AdminBadge>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          disabled={isUpdating}
                          className="text-xs border border-outline-variant px-2 py-1 rounded hover:bg-surface-container disabled:opacity-50"
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <Link 
                          to={`/admin/customers/${user.id}`}
                          title="View Profile"
                          className="inline-flex items-center justify-center p-2 text-on-secondary-container hover:bg-surface-container rounded-md transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => setDeleteTarget({
                              id: user.id,
                              name: `${user.firstName} ${user.lastName}`,
                              email: user.email
                            })}
                            disabled={isDeleting}
                            title="Delete User Permanently"
                            className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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

      {/* Delete Confirmation Modal */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title="Permanently Delete User"
        description={`Are you sure you want to permanently delete ${deleteTarget?.name} (${deleteTarget?.email})? This action cannot be undone and will erase all associated account data from the database.`}
        confirmText="Permanently Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
