import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './AdminBadge';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number; // percentage
    isPositive: boolean;
  };
  className?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}) => {
  return (
    <div className={cn("rounded-xl border border-outline-variant bg-surface-container/20 p-6 flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-on-secondary-container">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-on-secondary-container opacity-50" />}
      </div>
      
      <div className="flex items-baseline gap-2 mt-auto">
        <div className="text-3xl font-serif font-medium text-primary-container">
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded-sm",
              trend.isPositive
                ? "bg-[#e6f4ea] text-[#137333]"
                : "bg-[#fce8e6] text-[#c5221f]"
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      {description && (
        <p className="mt-2 text-xs text-on-secondary-container/80">
          {description}
        </p>
      )}
    </div>
  );
};
