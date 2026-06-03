import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-container font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[300] flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <AdminSidebar collapsed={false} onCollapse={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-background border-b border-outline-variant h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden bg-transparent border-none cursor-pointer p-2 text-primary-container"
              aria-label="Open menu"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant hidden sm:block">Admin Panel</p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" target="_blank" rel="noreferrer" className="font-sans text-xs text-on-secondary-container no-underline hover:text-primary-container transition-colors">
              ← View Storefront
            </Link>
            {user?.avatar && (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
