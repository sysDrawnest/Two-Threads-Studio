import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility to merge tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = 
  | 'default' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'outline'
  | 'sage'
  | 'gold'
  | 'dust'
  | 'stone'
  | 'terracotta'
  | 'cool';

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
    default: 'bg-[#f0edea] text-[#6b6762] border border-[#dcd6d0] dark:bg-[#1d1b1a] dark:text-[#aba6a1] dark:border-[#2f2c2a]',
    success: 'bg-[#ebeee9] text-[#55695d] border border-[#d2dbd5] dark:bg-[#1a231f] dark:text-[#a0baa8] dark:border-[#2b3a32]', // Sage
    warning: 'bg-[#faf5eb] text-[#8c6b3e] border border-[#eddcc4] dark:bg-[#261f18] dark:text-[#ccb08a] dark:border-[#3d3125]', // Warm gold
    error: 'bg-[#f7ebec] text-[#964f4e] border border-[#eccac9] dark:bg-[#251717] dark:text-[#cea0a0] dark:border-[#3c2525]',   // Dust red
    info: 'bg-[#ebeeef] text-[#4f5c6c] border border-[#d2d9de] dark:bg-[#181d22] dark:text-[#9bb1c8] dark:border-[#273038]',    // Cool gray
    outline: 'border border-outline-variant text-on-secondary-container bg-transparent',
    sage: 'bg-[#ebeee9] text-[#55695d] border border-[#d2dbd5] dark:bg-[#1a231f] dark:text-[#a0baa8] dark:border-[#2b3a32]',
    gold: 'bg-[#faf5eb] text-[#8c6b3e] border border-[#eddcc4] dark:bg-[#261f18] dark:text-[#ccb08a] dark:border-[#3d3125]',
    dust: 'bg-[#f7ebec] text-[#964f4e] border border-[#eccac9] dark:bg-[#251717] dark:text-[#cea0a0] dark:border-[#3c2525]',
    stone: 'bg-[#f0edea] text-[#6b6762] border border-[#dcd6d0] dark:bg-[#1d1b1a] dark:text-[#aba6a1] dark:border-[#2f2c2a]',
    terracotta: 'bg-[#f7ece7] text-[#a15543] border border-[#ebd2c9] dark:bg-[#261713] dark:text-[#dda092] dark:border-[#3c251e]',
    cool: 'bg-[#ebeeef] text-[#4f5c6c] border border-[#d2d9de] dark:bg-[#181d22] dark:text-[#9bb1c8] dark:border-[#273038]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
