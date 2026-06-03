import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = 'auto'; };
  }, [isOpen, onClose]);

  const maxW = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-3xl' }[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none`}
          >
            <div className={`${maxW} w-full bg-background shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col`}>
              <div className="flex justify-between items-center p-6 border-b border-outline-variant flex-shrink-0">
                <h2 className="font-serif text-2xl text-primary-container">{title}</h2>
                <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-2 text-on-surface-variant hover:text-primary-container transition-colors" aria-label="Close">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
