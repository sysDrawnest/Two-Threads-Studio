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
  LogOut
} from 'lucide-react';
import { cn } from '../ui/AdminBadge';
import { useAuth } from '../../../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

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
        { name: 'Inventory', href: '/admin/inventory', icon: Package }, // Can use different icon if needed
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
    <div className="flex h-full flex-col bg-background border-r border-outline-variant">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="font-serif text-xl font-bold tracking-tight text-primary-container">
          TWO THREADS <span className="font-sans text-xs uppercase tracking-widest text-on-secondary-container block mt-0.5">Admin OS</span>
        </h1>
        <button onClick={onClose} className="ml-auto md:hidden text-on-secondary-container">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navGroups.map((group, i) => (
          <div key={group.label} className={cn("mb-6", i !== 0 && "mt-2")}>
            <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-on-secondary-container/70">
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
                      ? "bg-surface-container text-primary-container" 
                      : "text-on-secondary-container hover:bg-surface-container/50 hover:text-primary-container"
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
      
      <div className="p-4 border-t border-outline-variant">
        <button 
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-on-secondary-container hover:bg-surface-container/50 hover:text-[#c5221f] transition-colors"
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
              className="fixed inset-0 z-40 bg-primary-container/40 backdrop-blur-sm md:hidden"
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
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {sidebarContent}
      </div>
    </>
  );
};
