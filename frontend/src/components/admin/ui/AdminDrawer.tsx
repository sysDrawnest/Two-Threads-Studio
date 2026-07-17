import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from './AdminBadge';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-primary-container/20 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 z-50 flex pointer-events-none w-full">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "w-full h-full bg-background border-l border-outline-variant shadow-2xl pointer-events-auto flex flex-col ml-auto",
                sizeClasses[size]
              )}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container/30">
                <h2 className="text-lg font-serif font-medium text-primary-container">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-on-secondary-container hover:bg-surface-container transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
              
              {footer && (
                <div className="border-t border-outline-variant bg-surface-container/30 px-6 py-4 flex justify-end">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
