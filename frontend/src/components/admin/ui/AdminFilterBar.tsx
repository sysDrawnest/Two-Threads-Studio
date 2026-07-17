import React from 'react';
import { Filter } from 'lucide-react';
import { cn } from './AdminBadge';

interface AdminFilterOption {
  label: string;
  value: string;
}

interface AdminFilterBarProps {
  label: string;
  options: AdminFilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  label,
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center space-x-1 text-sm text-on-secondary-container">
        <Filter className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors border",
              value === option.value
                ? "bg-primary-container text-white border-primary-container"
                : "bg-surface-container/50 text-on-secondary-container border-outline-variant hover:bg-surface-container"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
