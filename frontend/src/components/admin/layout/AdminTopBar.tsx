import React from 'react';
import { Bell, Search, ExternalLink, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminTopBarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ 
  onMenuClick, 
  isSidebarCollapsed, 
  onToggleSidebar 
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#c8b5aa]/60 dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#171311] px-4 sm:px-6 transition-colors duration-200">
      <div className="flex items-center">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="mr-3 rounded-md p-2 text-[#2d2520] dark:text-[#f4efe9] hover:bg-[#d1c4bd]/35 dark:hover:bg-[#211c18] md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Desktop sidebar toggle trigger */}
        <button
          onClick={onToggleSidebar}
          className="mr-4 rounded-md p-2 text-[#2d2520] dark:text-[#f4efe9] hover:bg-[#d1c4bd]/35 dark:hover:bg-[#211c18] hidden md:flex items-center justify-center transition-colors"
          title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Search Input (Desktop) */}
        <div className="hidden md:flex relative max-w-md w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4e3c30] dark:text-[#ccb08a]" />
          <input
            type="text"
            placeholder="Search orders, customers, products..."
            className="h-9 w-full rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-white dark:bg-[#211c18] pl-9 pr-4 text-sm text-[#1f1610] dark:text-[#ffffff] placeholder-[#786455] dark:placeholder-[#a5a19d] focus:border-[#4e3c30] dark:focus:border-[#ccb08a] focus:outline-none focus:ring-1 focus:ring-[#4e3c30] dark:focus:ring-[#ccb08a] transition-all font-medium"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#4e3c30] dark:text-[#ccb08a] font-mono border border-[#c8b5aa] dark:border-[#3d332b] rounded px-1.5 py-0.5 bg-[#fef8f3] dark:bg-[#171311] font-semibold">
            ⌘K
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link 
          to="/" 
          target="_blank"
          className="hidden sm:flex items-center space-x-1.5 text-sm font-semibold text-[#4e3c30] dark:text-[#ccb08a] hover:text-[#1f1610] dark:hover:text-[#ffffff] transition-colors"
        >
          <span>Storefront</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
        
        <div className="h-6 w-px bg-[#c8b5aa]/60 dark:bg-[#3d332b] hidden sm:block mx-2" />
        
        <button className="relative rounded-full p-2 text-[#4e3c30] dark:text-[#ccb08a] hover:bg-[#d1c4bd]/35 dark:hover:bg-[#211c18] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#b14833] ring-2 ring-[#fef8f3] dark:ring-[#171311]"></span>
        </button>
        
        <button className="h-8 w-8 overflow-hidden rounded-full border border-[#c8b5aa] dark:border-[#3d332b] bg-[#fef8f3] ml-2">
          <img 
            src="https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=d1c4bd&textColor=2d2520" 
            alt="Admin" 
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
