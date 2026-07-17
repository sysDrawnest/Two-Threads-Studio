import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { AdminBottomNav } from './AdminBottomNav';
import { AdminToast } from '../ui/AdminToast';

export const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-primary-container selection:bg-surface-container">
      {/* Toast Provider */}
      <AdminToast />
      
      {/* Sidebar (Desktop hidden on mobile, Drawer on mobile) */}
      <AdminSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
        <AdminTopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 pb-20 md:pb-8">
          <AdminBreadcrumbs />
          <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
};
