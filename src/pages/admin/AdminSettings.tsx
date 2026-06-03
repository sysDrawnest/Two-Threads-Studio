import React, { useState } from 'react';

const tabs = ['General', 'Branding', 'SEO', 'Email Templates', 'Membership', 'Payment'] as const;
type Tab = typeof tabs[number];

const inputCls = "w-full p-2.5 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent font-sans text-sm";
const labelCls = "block font-sans text-xs uppercase tracking-widest text-primary-container mb-1.5";

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('General');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-primary-container">Settings</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Configure your TwoThreads Studio platform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <nav className="md:w-48 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2.5 font-sans text-sm transition-colors whitespace-nowrap rounded-sm border-none cursor-pointer ${
                activeTab === tab ? 'bg-primary-container text-inverse-on-surface' : 'bg-transparent text-on-surface-variant hover:text-primary-container hover:bg-surface-container'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <div className="flex-1 bg-background border border-outline-variant p-6 md:p-8">
          {activeTab === 'General' && (
            <form className="flex flex-col gap-5 max-w-xl" onSubmit={e => e.preventDefault()}>
              <h2 className="font-serif text-2xl text-primary-container mb-2">General Settings</h2>
              <div><label className={labelCls}>Studio Name</label><input defaultValue="TwoThreads Studio" className={inputCls} /></div>
              <div><label className={labelCls}>Contact Email</label><input type="email" defaultValue="hello@twothreadsstudio.com" className={inputCls} /></div>
              <div><label className={labelCls}>Studio Address</label><input defaultValue="124 Artisan Way, Portland OR 97209" className={inputCls} /></div>
              <div><label className={labelCls}>Currency</label><select defaultValue="USD" className={inputCls}><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option></select></div>
              <div><label className={labelCls}>Timezone</label><select className={inputCls}><option>America/Los_Angeles</option><option>America/New_York</option><option>Europe/London</option></select></div>
              <button type="submit" className="self-start mt-4 bg-primary-container text-inverse-on-surface px-8 py-3 font-sans text-xs tracking-widest uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors">Save Changes</button>
            </form>
          )}

          {activeTab === 'Branding' && (
            <form className="flex flex-col gap-5 max-w-xl" onSubmit={e => e.preventDefault()}>
              <h2 className="font-serif text-2xl text-primary-container mb-2">Branding</h2>
              <div><label className={labelCls}>Primary Color</label><div className="flex gap-3 items-center"><input type="color" defaultValue="#2d2520" className="w-12 h-10 border border-outline-variant cursor-pointer" /><input defaultValue="#2d2520" className={`${inputCls} flex-1`} /></div></div>
              <div><label className={labelCls}>Logo URL</label><input defaultValue="https://twothreadsstudio.com/logo.png" className={inputCls} /></div>
              <div><label className={labelCls}>Heading Font</label><select className={inputCls} defaultValue="Cormorant Garamond"><option>Cormorant Garamond</option><option>Playfair Display</option><option>Libre Baskerville</option></select></div>
              <div><label className={labelCls}>Body Font</label><select className={inputCls} defaultValue="Lato"><option>Lato</option><option>Inter</option><option>Roboto</option></select></div>
              <button type="submit" className="self-start mt-4 bg-primary-container text-inverse-on-surface px-8 py-3 font-sans text-xs tracking-widest uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors">Save Branding</button>
            </form>
          )}

          {activeTab === 'SEO' && (
            <form className="flex flex-col gap-5 max-w-xl" onSubmit={e => e.preventDefault()}>
              <h2 className="font-serif text-2xl text-primary-container mb-2">SEO Settings</h2>
              <div><label className={labelCls}>Meta Title</label><input defaultValue="TwoThreads Studio — Luxury Artisan Embroidery" className={inputCls} /></div>
              <div><label className={labelCls}>Meta Description</label><textarea rows={3} defaultValue="Premium handcrafted embroidery kits, sustainable textile decor, and creative learning for modern makers." className={inputCls} /></div>
              <div><label className={labelCls}>Google Analytics ID</label><input defaultValue="G-XXXXXXXXXX" className={inputCls} /></div>
              <div><label className={labelCls}>OG Image URL</label><input placeholder="https://..." className={inputCls} /></div>
              <button type="submit" className="self-start mt-4 bg-primary-container text-inverse-on-surface px-8 py-3 font-sans text-xs tracking-widest uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors">Save SEO</button>
            </form>
          )}

          {activeTab === 'Email Templates' && (
            <div className="flex flex-col gap-4 max-w-xl">
              <h2 className="font-serif text-2xl text-primary-container mb-2">Email Templates</h2>
              <p className="font-sans text-sm text-on-surface-variant">Customize transactional email templates for your customers.</p>
              {['Order Confirmation', 'Shipping Notification', 'Password Reset', 'Welcome Email', 'Membership Renewal'].map(template => (
                <div key={template} className="flex justify-between items-center p-4 border border-outline-variant hover:bg-surface-container transition-colors">
                  <p className="font-sans text-sm text-primary-container">{template}</p>
                  <button className="font-sans text-xs text-on-secondary-container hover:text-primary-container bg-transparent border-none cursor-pointer underline">Edit Template</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Membership' && (
            <form className="flex flex-col gap-5 max-w-xl" onSubmit={e => e.preventDefault()}>
              <h2 className="font-serif text-2xl text-primary-container mb-2">Membership Settings</h2>
              <div><label className={labelCls}>Artisan Tier Price ($/month)</label><input type="number" defaultValue="12" className={inputCls} /></div>
              <div><label className={labelCls}>Master Tier Price ($/month)</label><input type="number" defaultValue="28" className={inputCls} /></div>
              <div><label className={labelCls}>Trial Period (days)</label><input type="number" defaultValue="7" className={inputCls} /></div>
              <button type="submit" className="self-start mt-4 bg-primary-container text-inverse-on-surface px-8 py-3 font-sans text-xs tracking-widest uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors">Save Membership</button>
            </form>
          )}

          {activeTab === 'Payment' && (
            <form className="flex flex-col gap-5 max-w-xl" onSubmit={e => e.preventDefault()}>
              <h2 className="font-serif text-2xl text-primary-container mb-2">Payment Settings</h2>
              <div className="p-4 bg-surface-container border border-outline-variant">
                <p className="font-sans text-sm text-on-surface-variant">🔒 Payment credentials are stored securely and never exposed in the frontend. Configure via your backend environment.</p>
              </div>
              <div><label className={labelCls}>Stripe Publishable Key</label><input type="password" defaultValue="pk_test_••••••••" className={inputCls} /></div>
              <div><label className={labelCls}>Payment Methods</label>
                <div className="flex flex-col gap-2 mt-2">
                  {['Credit / Debit Card', 'Apple Pay', 'Google Pay', 'PayPal'].map(m => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer font-sans text-sm text-primary-container">
                      <input type="checkbox" defaultChecked className="accent-primary-container" /> {m}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="self-start mt-4 bg-primary-container text-inverse-on-surface px-8 py-3 font-sans text-xs tracking-widest uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors">Save Payment</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
