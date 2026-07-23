import React, { useState, useEffect } from 'react';
import { Save, Store, Truck, Building, FileText, CreditCard, Mail, ShieldCheck } from 'lucide-react';
import { useAdminSettings, useUpdateSettings } from '../../hooks/useAdminData';
import { AdminSkeleton, AdminBadge } from '../../components/admin/ui';

export const AdminSettings: React.FC = () => {
  const { data: response, isLoading } = useAdminSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();

  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (response?.data) {
      setFormData(response.data);
    }
  }, [response]);

  if (isLoading) return <AdminSkeleton className="h-[600px] w-full" />;
  if (!response?.data) return <div className="text-error">Failed to load settings.</div>;

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    updateSettings({ section: activeTab, data: formData[activeTab] || {} });
  };

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Store },
    { id: 'gst', label: 'Tax & GST', icon: Building },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'payment', label: 'Payment Gateways', icon: CreditCard },
    { id: 'email', label: 'Email & Notifications', icon: Mail },
    { id: 'invoice', label: 'Invoice Settings', icon: FileText },
    { id: 'security', label: 'Security & RBAC', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Store Settings & System Administration</h1>
          <p className="text-sm text-on-secondary-container mt-1">Configure brand parameters, payment channels, security policies and access controls</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary-container text-white hover:bg-primary-container/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isUpdating ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-surface-container text-primary-container' 
                  : 'text-on-secondary-container hover:bg-surface-container/50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="rounded-xl border border-outline-variant bg-background p-6 lg:p-8">
            
            {/* Company Profile */}
            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Brand & Store Info</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Brand Name</label>
                    <input 
                      type="text" 
                      value={formData.company?.name || ''}
                      onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Legal Registered Entity Name</label>
                    <input 
                      type="text" 
                      value={formData.company?.legalName || ''}
                      onChange={(e) => handleInputChange('company', 'legalName', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-secondary-container mb-1">Support Email</label>
                      <input 
                        type="email" 
                        value={formData.company?.supportEmail || ''}
                        onChange={(e) => handleInputChange('company', 'supportEmail', e.target.value)}
                        className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-secondary-container mb-1">Support Phone</label>
                      <input 
                        type="text" 
                        value={formData.company?.supportPhone || ''}
                        onChange={(e) => handleInputChange('company', 'supportPhone', e.target.value)}
                        className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Corporate Address</label>
                    <textarea 
                      rows={3} 
                      value={formData.company?.address || ''}
                      onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GST */}
            {activeTab === 'gst' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Tax & GST Configuration</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="gstEnabled"
                      checked={formData.gst?.enabled || false}
                      onChange={(e) => handleInputChange('gst', 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-outline-variant text-primary-container focus:ring-primary-container"
                    />
                    <label htmlFor="gstEnabled" className="text-sm font-medium text-primary-container">Enable Automatic GST Tax Rules</label>
                  </div>
                  {formData.gst?.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-on-secondary-container mb-1">GSTIN</label>
                        <input 
                          type="text" 
                          value={formData.gst?.gstin || ''}
                          onChange={(e) => handleInputChange('gst', 'gstin', e.target.value)}
                          placeholder="e.g. 27AAAAA0000A1Z5"
                          className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none font-mono" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-on-secondary-container mb-1">Default GST Rate (%)</label>
                        <input 
                          type="number" 
                          value={formData.gst?.defaultRate || 18}
                          onChange={(e) => handleInputChange('gst', 'defaultRate', parseFloat(e.target.value))}
                          className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Payment Gateways */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Payment Gateways & COD</h2>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border border-outline-variant bg-surface-container/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary-container">Razorpay Gateway Integration</span>
                      <AdminBadge variant="success">Active (Sandbox)</AdminBadge>
                    </div>
                    <p className="text-xs text-on-secondary-container">Supports Credit Cards, UPI, Netbanking, and Wallets.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="codEnabled"
                        checked={formData.cod?.enabled ?? true}
                        onChange={(e) => handleInputChange('cod', 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-outline-variant text-primary-container focus:ring-primary-container"
                      />
                      <label htmlFor="codEnabled" className="text-sm font-medium text-primary-container">Enable Cash on Delivery (COD)</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-secondary-container mb-1">Maximum Order Value for COD (₹)</label>
                      <input 
                        type="number" 
                        value={formData.cod?.maxAmount || 10000}
                        onChange={(e) => handleInputChange('cod', 'maxAmount', parseFloat(e.target.value))}
                        className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Email & Transactional Notifications</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Sender Email Name</label>
                    <input 
                      type="text" 
                      value={formData.email?.senderName || 'Two Threads Studio'}
                      onChange={(e) => handleInputChange('email', 'senderName', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Order Confirmation Footer Text</label>
                    <textarea 
                      rows={3}
                      value={formData.email?.orderFooter || 'Thank you for supporting hand-crafted artisan textiles.'}
                      onChange={(e) => handleInputChange('email', 'orderFooter', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Shipping Rules</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Free Shipping Threshold (₹)</label>
                    <input 
                      type="number" 
                      value={formData.shipping?.freeShippingThreshold || 0}
                      onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Standard Shipping Fee (₹)</label>
                    <input 
                      type="number" 
                      value={formData.shipping?.standardCost || 0}
                      onChange={(e) => handleInputChange('shipping', 'standardCost', parseFloat(e.target.value))}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Invoice */}
            {activeTab === 'invoice' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Invoice Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Invoice Prefix</label>
                    <input 
                      type="text" 
                      value={formData.invoice?.prefix || 'TTS-'}
                      onChange={(e) => handleInputChange('invoice', 'prefix', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm font-mono focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security & RBAC */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Role-Based Access Control & Security Policies</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface-container/30 border border-outline-variant space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary-container">Active Roles</span>
                      <AdminBadge variant="info">ADMIN & CUSTOMER</AdminBadge>
                    </div>
                    <p className="text-xs text-on-secondary-container">Only users with Role=ADMIN are granted access to administrative interfaces and mutations.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Session Inactivity Timeout (Minutes)</label>
                    <input 
                      type="number" 
                      value={formData.security?.sessionTimeout || 60}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
