import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CartItem from '../cart/CartItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const items = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-outline-variant">
              <h2 className="font-serif text-2xl text-primary-container">Your Cart</h2>
              <button 
                onClick={onClose}
                className="bg-transparent border-none cursor-pointer p-2 hover:bg-surface-variant transition-colors rounded-full"
                aria-label="Close Cart"
              >
                <svg width="24" height="24" fill="none" stroke="#2d2520" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length > 0 ? (
                <div>
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-sans text-sm text-on-surface-variant mb-6">Your cart is currently empty.</p>
                  <button onClick={onClose} className="bg-transparent text-primary-container border border-primary-container px-8 py-3 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-outline-variant bg-surface-container/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-sm uppercase tracking-widest text-primary-container">Subtotal</span>
                  <span className="font-serif text-2xl text-primary-container">${getCartTotal().toFixed(2)}</span>
                </div>
                <p className="font-sans text-xs text-[#5a4a3f] mb-6 text-center">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link 
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full text-center bg-primary-container text-inverse-on-surface border border-primary-container px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors no-underline"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
