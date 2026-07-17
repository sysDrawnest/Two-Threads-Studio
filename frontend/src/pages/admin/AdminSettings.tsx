import React, { useState, useEffect } from 'react';
import { Save, Store, Truck, Building, FileText } from 'lucide-react';
import { useAdminSettings, useUpdateSettings } from '../../hooks/useAdminData';
import { AdminSkeleton } from '../../components/admin/ui';

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
    updateSettings({ section: activeTab, data: formData[activeTab] });
  };

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Store },
    { id: 'gst', label: 'Tax & GST', icon: Building },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'invoice', label: 'Invoice Settings', icon: FileText },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-container">Store Settings</h1>
          <p className="text-sm text-on-secondary-container mt-1">Manage your business configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary-container text-white hover:bg-primary-container/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isUpdating ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
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
            
            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Company Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Company Name</label>
                    <input 
                      type="text" 
                      value={formData.company?.name || ''}
                      onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Legal Name</label>
                    <input 
                      type="text" 
                      value={formData.company?.legalName || ''}
                      onChange={(e) => handleInputChange('company', 'legalName', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-secondary-container mb-1">Support Email</label>
                      <input 
                        type="email" 
                        value={formData.company?.supportEmail || ''}
                        onChange={(e) => handleInputChange('company', 'supportEmail', e.target.value)}
                        className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-secondary-container mb-1">Support Phone</label>
                      <input 
                        type="text" 
                        value={formData.company?.supportPhone || ''}
                        onChange={(e) => handleInputChange('company', 'supportPhone', e.target.value)}
                        className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Business Address</label>
                    <textarea 
                      rows={3} 
                      value={formData.company?.address || ''}
                      onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

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
                    <label htmlFor="gstEnabled" className="text-sm font-medium text-primary-container">Enable GST Calculation</label>
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
                          className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none font-mono" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-on-secondary-container mb-1">Default GST Rate (%)</label>
                        <input 
                          type="number" 
                          value={formData.gst?.defaultRate || 18}
                          onChange={(e) => handleInputChange('gst', 'defaultRate', parseFloat(e.target.value))}
                          className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

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
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                    <p className="text-xs text-on-secondary-container mt-1">Orders above this amount will get free shipping.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Standard Shipping Cost (₹)</label>
                    <input 
                      type="number" 
                      value={formData.shipping?.standardCost || 0}
                      onChange={(e) => handleInputChange('shipping', 'standardCost', parseFloat(e.target.value))}
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Estimated Delivery Days</label>
                    <input 
                      type="text" 
                      value={formData.shipping?.estimatedDays || '5-7'}
                      onChange={(e) => handleInputChange('shipping', 'estimatedDays', e.target.value)}
                      placeholder="e.g. 5-7"
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

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
                      placeholder="e.g. TTS-"
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">Invoice Footer Note</label>
                    <textarea 
                      rows={3} 
                      value={formData.invoice?.footerNote || ''}
                      onChange={(e) => handleInputChange('invoice', 'footerNote', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
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
