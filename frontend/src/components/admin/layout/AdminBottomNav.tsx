import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  ShieldAlert
} from 'lucide-react';
import { cn } from '../ui/AdminBadge';

export const AdminBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Risk', href: '/admin/risk', icon: ShieldAlert },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-outline-variant bg-background pb-safe">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center space-y-1 transition-colors",
              active ? "text-primary-container" : "text-on-secondary-container hover:text-primary-container"
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
