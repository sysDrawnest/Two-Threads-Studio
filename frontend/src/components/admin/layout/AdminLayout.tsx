import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { AdminBottomNav } from './AdminBottomNav';
import { AdminToast } from '../ui/AdminToast';
import { cn } from '../ui/AdminBadge';

export const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fef8f3] dark:bg-[#171311] font-sans text-[#2d2520] dark:text-[#f4efe9] selection:bg-[#d1c4bd]/20 transition-colors duration-200">
      {/* Toast Provider */}
      <AdminToast />
      
      {/* Sidebar (Desktop hidden on mobile, Drawer on mobile) */}
      <AdminSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Wrapper */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        isSidebarCollapsed ? "md:pl-0" : "md:pl-64"
      )}>
        <AdminTopBar 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
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
