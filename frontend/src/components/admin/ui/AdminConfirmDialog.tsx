import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from './AdminBadge';

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary-container/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-lg border border-outline-variant bg-background p-6 shadow-xl pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-medium text-primary-container">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-on-secondary-container hover:bg-surface-container transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-6 text-sm text-on-secondary-container">
                {description}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-md border border-outline-variant px-4 py-2 text-sm font-medium text-primary-container transition-colors hover:bg-surface-container disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                    isDestructive 
                      ? "bg-[#c5221f] text-white hover:bg-[#a51c1a]" 
                      : "bg-primary-container text-white hover:bg-primary-container/90"
                  )}
                >
                  {isLoading ? 'Processing...' : confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
