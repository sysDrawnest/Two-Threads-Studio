import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../ui/AdminBadge';

export const AdminBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  
  // Custom path mapping for display
  const pathNames: Record<string, string> = {
    admin: 'Dashboard',
    orders: 'Orders',
    customers: 'Customers',
    products: 'Products',
    inventory: 'Inventory',
    reviews: 'Reviews',
    risk: 'Risk Center',
    analytics: 'Analytics',
    settings: 'Settings',
  };

  return (
    <nav className="flex px-6 py-3 border-b border-outline-variant bg-surface-container/20" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/admin" className="text-on-secondary-container hover:text-primary-container transition-colors">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {paths.map((path, index) => {
          if (path === 'admin' && index === 0) return null;
          
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          
          // Try to map name, or format id
          const name = pathNames[path] || (path.length > 20 ? `${path.substring(0, 8)}...` : path);
          
          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-on-secondary-container/50 mx-1" />
              {isLast ? (
                <span className="text-sm font-medium text-primary-container capitalize" aria-current="page">
                  {name}
                </span>
              ) : (
                <Link
                  to={href}
                  className="text-sm font-medium text-on-secondary-container hover:text-primary-container transition-colors capitalize"
                >
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
