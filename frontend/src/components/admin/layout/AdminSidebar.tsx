import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  ShieldAlert, 
  MessageSquare,
  BarChart3,
  X,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../ui/AdminBadge';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'Commerce',
      items: [
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Inventory', href: '/admin/inventory', icon: Package },
        { name: 'Customers', href: '/admin/customers', icon: Users },
      ]
    },
    {
      label: 'Operations',
      items: [
        { name: 'Risk Center', href: '/admin/risk', icon: ShieldAlert },
        { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-background dark:bg-inverse-surface border-r border-outline-variant dark:border-surface-variant transition-colors duration-200">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="font-serif text-xl font-bold tracking-tight text-primary-container dark:text-inverse-on-surface">
          TWO THREADS <span className="font-sans text-xs uppercase tracking-widest text-on-secondary-container dark:text-inverse-primary block mt-0.5">Admin OS</span>
        </h1>
        <button onClick={onClose} className="ml-auto md:hidden text-on-secondary-container dark:text-inverse-on-surface">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navGroups.map((group, i) => (
          <div key={group.label} className={cn("mb-6", i !== 0 && "mt-2")}>
            <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-on-secondary-container/70 dark:text-inverse-on-surface/50">
              {group.label}
            </h2>
            <nav className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.exact}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-surface-container dark:bg-surface-variant text-primary-container dark:text-inverse-on-surface" 
                      : "text-on-secondary-container dark:text-inverse-on-surface/70 hover:bg-surface-container/50 dark:hover:bg-surface-variant/50 hover:text-primary-container dark:hover:text-inverse-on-surface"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-outline-variant dark:border-surface-variant space-y-2">
        <button 
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-on-secondary-container dark:text-inverse-on-surface/70 hover:bg-surface-container/50 dark:hover:bg-surface-variant/50 hover:text-primary-container dark:hover:text-inverse-on-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </div>
          <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-outline/30 dark:bg-surface-variant transition-colors">
            <span className={cn("inline-block h-3 w-3 transform rounded-full bg-primary-container dark:bg-inverse-primary transition-transform", theme === 'dark' ? "translate-x-4" : "translate-x-1")} />
          </div>
        </button>
        <button 
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-on-secondary-container dark:text-inverse-on-surface/70 hover:bg-surface-container/50 dark:hover:bg-surface-variant/50 hover:text-[#c5221f] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-primary-container/40 dark:bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-10">
        {sidebarContent}
      </div>
    </>
  );
};
