import React from 'react';
import { Bell, Search, ExternalLink, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminTopBarProps {
  onMenuClick: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant dark:border-surface-variant bg-background dark:bg-inverse-surface px-4 sm:px-6 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 rounded-md p-2 text-on-secondary-container hover:bg-surface-container md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Search Input (Desktop) */}
        <div className="hidden md:flex relative max-w-md w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-secondary-container" />
          <input
            type="text"
            placeholder="Search orders, customers, products..."
            className="h-9 w-full rounded-md border border-outline-variant dark:border-surface-variant bg-surface-container/30 dark:bg-black/20 pl-9 pr-4 text-sm text-primary-container dark:text-inverse-on-surface placeholder:text-on-secondary-container focus:border-on-secondary-container dark:focus:border-inverse-primary focus:outline-none focus:ring-1 focus:ring-on-secondary-container dark:focus:ring-inverse-primary transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-secondary-container dark:text-inverse-on-surface/70 font-mono border border-outline-variant dark:border-surface-variant rounded px-1.5 py-0.5 bg-background dark:bg-inverse-surface">
            ⌘K
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link 
          to="/" 
          target="_blank"
          className="hidden sm:flex items-center space-x-1.5 text-sm font-medium text-on-secondary-container hover:text-primary-container transition-colors"
        >
          <span>Storefront</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
        
        <div className="h-6 w-px bg-outline-variant hidden sm:block mx-2" />
        
        <button className="relative rounded-full p-2 text-on-secondary-container hover:bg-surface-container transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#c5221f] ring-2 ring-background"></span>
        </button>
        
        <button className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant bg-surface-container ml-2">
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
