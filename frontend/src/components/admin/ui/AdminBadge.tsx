import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility to merge tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';

interface AdminBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({ 
  variant = 'default', 
  children, 
  className,
  ...props 
}) => {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-surface-container text-primary-container',
    success: 'bg-[#e6f4ea] text-[#137333]', // Soft green
    warning: 'bg-[#fef7e0] text-[#b06000]', // Soft amber
    error: 'bg-[#fce8e6] text-[#c5221f]',   // Soft red
    info: 'bg-[#e8f0fe] text-[#1967d2]',    // Soft blue
    outline: 'border border-outline-variant text-on-secondary-container bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
