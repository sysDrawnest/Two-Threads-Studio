import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { mockAdminCustomers, AdminCustomer } from '../../data/adminData';

const membershipColors: Record<string, string> = {
  none: 'bg-surface-container text-on-surface-variant',
  artisan: 'bg-[#fef3e8] text-[#8b5a00]',
  master: 'bg-primary-container text-inverse-on-surface',
};

const CustomersManagement: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const columns = [
    {
      key: 'name', label: 'Customer', sortable: true,
      render: (c: AdminCustomer) => (
        <div className="flex items-center gap-3">
          <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="font-sans text-sm text-primary-container">{c.name}</p>
            <p className="font-sans text-xs text-on-surface-variant">{c.email}</p>
          </div>
        </div>
      )
    },
    { key: 'joined', label: 'Joined', sortable: true },
    { key: 'orders', label: 'Orders', sortable: true },
    { key: 'totalSpent', label: 'Total Spent', sortable: true, render: (c: AdminCustomer) => <span className="font-medium">${c.totalSpent}</span> },
    {
      key: 'membership', label: 'Membership',
      render: (c: AdminCustomer) => (
        <span className={`font-sans text-[10px] px-2 py-1 uppercase tracking-wider capitalize ${membershipColors[c.membership]}`}>{c.membership === 'none' ? 'Free' : c.membership}</span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (c: AdminCustomer) => (
        <button onClick={() => setSelectedCustomer(c)} className="font-sans text-xs text-on-secondary-container hover:text-primary-container bg-transparent border-none cursor-pointer underline">View Profile</button>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-primary-container">Customers</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">{mockAdminCustomers.length} registered customers</p>
      </div>

      <div className="bg-background border border-outline-variant p-6">
        <DataTable data={mockAdminCustomers} columns={columns} searchPlaceholder="Search customers..." />
      </div>

      {selectedCustomer && (
        <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="Customer Profile" size="md">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-outline-variant">
              <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="font-serif text-2xl text-primary-container">{selectedCustomer.name}</h3>
                <p className="font-sans text-sm text-on-surface-variant">{selectedCustomer.email}</p>
                <span className={`inline-block mt-2 font-sans text-[10px] px-2 py-1 uppercase tracking-wider capitalize ${membershipColors[selectedCustomer.membership]}`}>
                  {selectedCustomer.membership === 'none' ? 'Free Member' : `${selectedCustomer.membership} Tier`}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Orders', value: selectedCustomer.orders },
                { label: 'Total Spent', value: `$${selectedCustomer.totalSpent}` },
                { label: 'Member Since', value: selectedCustomer.joined.substring(0, 7) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-container p-3">
                  <p className="font-serif text-xl text-primary-container">{value}</p>
                  <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomersManagement;
