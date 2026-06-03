import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { mockAdminOrders, AdminOrder } from '../../data/adminData';

const statusColors: Record<string, string> = {
  pending: 'bg-[#fef3e8] text-[#8b5a00]',
  processing: 'bg-[#e8f0fe] text-[#1a56db]',
  shipped: 'bg-[#e8f4e8] text-[#3a6b3a]',
  delivered: 'bg-[#d4edda] text-[#2d5a2d]',
  cancelled: 'bg-error-container text-error',
};

const OrdersManagement: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'items', label: 'Items', render: (o: AdminOrder) => `${o.items} item${o.items > 1 ? 's' : ''}` },
    { key: 'amount', label: 'Amount', sortable: true, render: (o: AdminOrder) => <span className="font-medium text-primary-container">${o.amount}</span> },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'status', label: 'Status',
      render: (o: AdminOrder) => (
        <span className={`font-sans text-[10px] px-2 py-1 uppercase tracking-wider ${statusColors[o.status]}`}>{o.status}</span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (o: AdminOrder) => (
        <button onClick={() => setSelectedOrder(o)} className="font-sans text-xs text-on-secondary-container hover:text-primary-container bg-transparent border-none cursor-pointer underline">View</button>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-primary-container">Orders</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">{mockAdminOrders.length} orders total</p>
      </div>

      {/* Status Tabs Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => {
          const count = mockAdminOrders.filter(o => o.status === s).length;
          return (
            <div key={s} className={`p-3 border text-center ${statusColors[s]} border-current/20`}>
              <p className="font-sans text-xs uppercase tracking-widest mb-1">{s}</p>
              <p className="font-serif text-2xl">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-background border border-outline-variant p-6">
        <DataTable data={mockAdminOrders} columns={columns} searchPlaceholder="Search orders..." />
      </div>

      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder.id}`} size="md">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Customer', value: selectedOrder.customer },
                { label: 'Email', value: selectedOrder.email },
                { label: 'Date', value: selectedOrder.date },
                { label: 'Items', value: `${selectedOrder.items} item(s)` },
                { label: 'Amount', value: `$${selectedOrder.amount}` },
                { label: 'Status', value: selectedOrder.status },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
                  <p className="font-sans text-sm text-primary-container capitalize">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant">
              <p className="font-sans text-xs uppercase tracking-widest text-primary-container mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                  <button key={s} className={`px-3 py-1.5 font-sans text-xs uppercase border cursor-pointer transition-colors ${selectedOrder.status === s ? 'bg-primary-container text-inverse-on-surface border-primary-container' : 'bg-transparent border-outline-variant text-on-surface-variant hover:border-primary-container'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrdersManagement;
