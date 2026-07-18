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
  isCollapsed?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose, isCollapsed = false }) => {
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
    <div className="flex h-full flex-col bg-[#fef8f3] dark:bg-[#171311] border-r border-[#c8b5aa]/60 dark:border-[#3d332b] transition-colors duration-200">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="font-serif text-xl font-bold tracking-tight text-[#1f1610] dark:text-[#ffffff]">
          TWO THREADS <span className="font-sans text-xs uppercase tracking-widest text-[#4e3c30] dark:text-[#ccb08a] block mt-0.5 font-bold">Admin OS</span>
        </h1>
        <button onClick={onClose} className="ml-auto md:hidden text-[#1f1610] dark:text-[#ffffff]">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navGroups.map((group, i) => (
          <div key={group.label} className={cn("mb-6", i !== 0 && "mt-2")}>
            <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-[#4e3c30] dark:text-[#ccb08a]/90">
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
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-all border",
                    isActive 
                      ? "bg-[#d1c4bd]/40 dark:bg-[#2c231c] text-[#120a05] dark:text-[#ffffff] border-[#a89990] dark:border-[#52443a] shadow-xs" 
                      : "text-[#3c2b1e] dark:text-[#e2deda] hover:bg-[#d1c4bd]/20 dark:hover:bg-[#211c18]/80 hover:text-[#1a110a] dark:hover:text-[#ffffff] border-transparent"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-[#c8b5aa]/60 dark:border-[#3d332b] space-y-2">
        <button 
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-[#3c2b1e] dark:text-[#e2deda] hover:bg-[#d1c4bd]/20 dark:hover:bg-[#211c18]/80 hover:text-[#1a110a] dark:hover:text-[#ffffff] transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </div>
          <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-[#d2c4bc]/40 dark:bg-[#3d332b] transition-colors">
            <span className={cn("inline-block h-3 w-3 transform rounded-full bg-[#4e3c30] dark:bg-[#ccb08a] transition-transform", theme === 'dark' ? "translate-x-4" : "translate-x-1")} />
          </div>
        </button>
        <button 
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#3c2b1e] dark:text-[#e2deda] hover:bg-[#d1c4bd]/20 dark:hover:bg-[#211c18]/80 hover:text-[#b14833] dark:hover:text-[#f28b82] transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
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
              className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm md:hidden"
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
      <div className={cn(
        "hidden md:fixed md:inset-y-0 md:flex md:flex-col z-20 transition-all duration-300",
        isCollapsed ? "md:w-0 md:-translate-x-full" : "md:w-64"
      )}>
        <div className="h-full w-64 flex flex-col">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
