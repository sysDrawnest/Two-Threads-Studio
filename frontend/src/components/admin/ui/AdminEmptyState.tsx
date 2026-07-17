import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './AdminBadge';

interface AdminEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-container/30 p-8 text-center animate-in fade-in duration-500",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-on-secondary-container">
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="mb-2 text-lg font-serif font-medium text-primary-container">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-on-secondary-container">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
