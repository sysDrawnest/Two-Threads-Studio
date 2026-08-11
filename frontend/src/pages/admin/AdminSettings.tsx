import React, { useState, useEffect } from 'react';
import { Save, Store, Truck, Building, FileText, CreditCard, Mail, ShieldCheck, ToggleLeft, ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { useAdminSettings, useUpdateSettings } from '../../hooks/useAdminData';
import { AdminSkeleton, AdminBadge } from '../../components/admin/ui';
import { useFeatures } from '../../hooks/useFeatures';
import { useMaintenance } from '../../context/MaintenanceContext';

export const AdminSettings: React.FC = () => {
  const { data: response, isLoading } = useAdminSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();
  const { features, updateFeature, isUpdating: isUpdatingFeature } = useFeatures();
  const { maintenanceMode, updateMaintenanceMode, isLoading: isMaintenanceLoading } = useMaintenance();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'features';
  });
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

  const handleConfirmEnableMaintenance = async () => {
    setShowConfirmModal(false);
    await updateMaintenanceMode(true);
  };

  const handleDisableMaintenance = async () => {
    await updateMaintenanceMode(false);
  };

  const tabs = [
    { id: 'features', label: 'Feature Flags', icon: ToggleLeft },
    { id: 'company', label: 'Company Profile', icon: Store },
    { id: 'gst', label: 'Tax & GST', icon: Building },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'payment', label: 'Payment Gateways', icon: CreditCard },
    { id: 'email', label: 'Email & Notifications', icon: Mail },
    { id: 'invoice', label: 'Invoice Settings', icon: FileText },
    { id: 'security', label: 'Security & RBAC', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-primary-container">Studio & System Settings</h1>
          <p className="text-xs text-on-secondary-container mt-1">Configure company profiles, GST taxes, logistics, feature toggles, and security policies.</p>
        </div>

        {activeTab !== 'features' && (
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex items-center gap-2 bg-primary-container text-white px-5 py-2 rounded-md text-xs font-sans tracking-wider uppercase font-semibold hover:bg-primary-container/90 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Save size={14} />
            {isUpdating ? 'Saving...' : 'Save Settings'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-sans tracking-wider uppercase font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-white shadow-sm font-semibold'
                    : 'text-on-secondary-container hover:bg-surface-container/50'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-surface rounded-lg border border-outline-variant p-6 shadow-sm">

          {/* Feature Flags & Global Maintenance Mode */}
          {activeTab === 'features' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">
                  Website Availability &amp; Launch Control
                </h2>
                <p className="text-xs text-on-secondary-container mt-2">
                  Manage website availability and platform feature flags stored persistently in PostgreSQL.
                </p>
              </div>

              {/* ── WEBSITE AVAILABILITY (Global Maintenance Mode) ── */}
              <div className="p-5 rounded-lg bg-surface-container/40 border border-outline-variant space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-3">
                      <ShieldAlert size={18} className={maintenanceMode ? 'text-error' : 'text-primary-container'} />
                      <span className="font-bold text-primary-container text-base">Global Maintenance Mode</span>
                      <AdminBadge variant={maintenanceMode ? 'error' : 'success'}>
                        {maintenanceMode ? 'MAINTENANCE MODE ACTIVE' : 'WEBSITE IS LIVE'}
                      </AdminBadge>
                    </div>
                    <p className="text-xs text-on-secondary-container leading-relaxed">
                      Temporarily hide the storefront from customers while you perform maintenance or major system updates. State is persisted in PostgreSQL.
                    </p>
                  </div>

                  {maintenanceMode ? (
                    <button
                      type="button"
                      disabled={isMaintenanceLoading}
                      onClick={handleDisableMaintenance}
                      className="px-4 py-2.5 text-xs font-sans tracking-wider uppercase font-semibold rounded-md border transition-all disabled:opacity-50 flex-shrink-0 cursor-pointer bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800 shadow-sm"
                    >
                      {isMaintenanceLoading ? 'Updating...' : 'Disable Maintenance Mode'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isMaintenanceLoading}
                      onClick={() => setShowConfirmModal(true)}
                      className="px-4 py-2.5 text-xs font-sans tracking-wider uppercase font-semibold rounded-md border transition-all disabled:opacity-50 flex-shrink-0 cursor-pointer bg-error text-white border-error hover:bg-error/90 shadow-sm"
                    >
                      {isMaintenanceLoading ? 'Updating...' : 'Enable Maintenance Mode'}
                    </button>
                  )}
                </div>

                <div className={`p-3.5 rounded-md text-xs leading-relaxed flex items-start gap-2.5 border ${
                  maintenanceMode
                    ? 'bg-error/10 text-error border-error/30'
                    : 'bg-surface-container/60 text-on-secondary-container border-outline-variant'
                }`}>
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Notice:</strong> When Maintenance Mode is <strong>ON</strong>, guests and normal customers will see the Two Threads Studio Maintenance Page. Administrators can still view the live website and access the Admin Dashboard.
                  </div>
                </div>
              </div>

              {/* ── FEATURE FLAGS (Learning Hub) ── */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h3 className="font-serif text-lg font-medium text-primary-container">Module Feature Flags</h3>

                <div className="p-5 rounded-lg bg-surface-container/30 border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary-container text-base">Learning / Tutorial Hub</span>
                      <AdminBadge variant={features.LEARNING_HUB ? 'success' : 'default'}>
                        {features.LEARNING_HUB ? 'ON' : 'OFF'}
                      </AdminBadge>
                    </div>
                    <p className="text-xs text-on-secondary-container leading-relaxed">
                      Enable the Learning Hub, tutorial videos, instructor profiles, and related customer-facing Learning content across navigation, homepage, and routes.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isUpdatingFeature}
                    onClick={() => updateFeature('LEARNING_HUB', !features.LEARNING_HUB)}
                    className={`px-4 py-2 text-xs font-sans tracking-wider uppercase font-semibold rounded-md border transition-all disabled:opacity-50 flex-shrink-0 cursor-pointer ${
                      features.LEARNING_HUB
                        ? 'bg-[#e8f4e8] text-[#3a6b3a] border-[#3a6b3a]/30 hover:bg-[#d8ebd8]'
                        : 'bg-primary-container text-white border-primary-container hover:bg-primary-container/90'
                    }`}
                  >
                    {isUpdatingFeature ? 'Updating...' : features.LEARNING_HUB ? 'Disable Learning Hub' : 'Enable Learning Hub'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Company Profile */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Company Details & Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Legal Company Name</label>
                  <input 
                    type="text" 
                    value={formData.company?.legalName || ''} 
                    onChange={(e) => handleInputChange('company', 'legalName', e.target.value)}
                    className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                  />
                </div>

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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Studio Address</label>
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

          {/* Tax & GST */}
          {activeTab === 'gst' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">GST & Tax Configuration</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="gstEnabled" 
                    checked={formData.gst?.enabled ?? true}
                    onChange={(e) => handleInputChange('gst', 'enabled', e.target.checked)}
                    className="h-4 w-4 rounded border-outline-variant text-primary-container focus:ring-primary-container" 
                  />
                  <label htmlFor="gstEnabled" className="text-sm font-medium text-primary-container">Enable GST Calculation on Checkout</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-secondary-container mb-1">GSTIN Number</label>
                    <input 
                      type="text" 
                      value={formData.gst?.gstin || ''} 
                      onChange={(e) => handleInputChange('gst', 'gstin', e.target.value)}
                      className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm font-mono focus:ring-1 focus:ring-primary-container outline-none" 
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
                </div>
              </div>
            </div>
          )}

          {/* Shipping & Delivery */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Shipping Rules & Logistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Free Shipping Threshold (INR)</label>
                  <input 
                    type="number" 
                    value={formData.shipping?.freeShippingThreshold || 0} 
                    onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Standard Shipping Flat Fee (INR)</label>
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

          {/* Invoice Settings */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Invoice Format & Printing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-secondary-container mb-1">Invoice Number Prefix</label>
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
              <h2 className="font-serif text-xl font-medium text-primary-container border-b border-outline-variant pb-4">Role-Based Access Control &amp; Security Policies</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-surface-container/30 border border-outline-variant space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary-container">Active Roles</span>
                    <AdminBadge variant="info">ADMIN &amp; CUSTOMER</AdminBadge>
                  </div>
                  <p className="text-xs text-on-secondary-container">Only users with Role=ADMIN are granted access to administrative interfaces and mutations.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── CONFIRMATION MODAL BEFORE ENABLING MAINTENANCE MODE ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-lg border border-outline-variant p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-outline-variant pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-error/10 text-error">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary-container">Enable Maintenance Mode?</h3>
                  <p className="text-xs text-on-secondary-container">Action required for Website Availability</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-on-secondary-container hover:text-primary-container p-1 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-on-secondary-container leading-relaxed">
              Your storefront will <strong>immediately become unavailable</strong> to customers and public visitors. Guests will see the Two Threads Studio Maintenance Page.
            </p>
            <p className="text-xs text-on-secondary-container leading-relaxed">
              Administrators will still be able to access the live website preview and the Admin Dashboard.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-sans tracking-wider uppercase font-semibold text-on-secondary-container hover:bg-surface-container/60 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEnableMaintenance}
                className="px-4 py-2 text-xs font-sans tracking-wider uppercase font-semibold bg-error text-white rounded-md hover:bg-error/90 transition-all cursor-pointer shadow-sm"
              >
                Enable Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
