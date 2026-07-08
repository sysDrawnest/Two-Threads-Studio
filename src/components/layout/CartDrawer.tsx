import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import CartItem from '../cart/CartItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const items = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const { isAuthenticated } = useAuth();

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
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF9F7] shadow-2xl z-[101] flex flex-col border-l border-neutral-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-200">
              <h2 className="font-serif text-2xl text-[#1C1C1B]">Your Cart</h2>
              <button 
                onClick={onClose}
                className="bg-transparent border-none cursor-pointer p-2 hover:bg-neutral-100 transition-colors rounded-full"
                aria-label="Close Cart"
              >
                <svg width="20" height="20" fill="none" stroke="#1C1C1B" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                  <p className="font-sans text-sm text-neutral-500 mb-6">Your cart is currently empty.</p>
                  <button onClick={onClose} className="bg-[#1C1C1B] text-[#FAF9F7] border border-[#1C1C1B] px-8 py-3 font-sans text-xs tracking-widest uppercase cursor-pointer hover:bg-neutral-800 transition-colors">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-200 bg-[#FAF9F7]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-xs uppercase tracking-widest text-neutral-500">Subtotal</span>
                  <span className="font-sans text-xl font-bold text-[#1C1C1B]">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <p className="font-sans text-[11px] text-neutral-500 mb-6 text-center">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link 
                  to={isAuthenticated ? "/checkout" : "/auth/signup?redirect=/checkout"}
                  onClick={onClose}
                  className="block w-full text-center bg-[#1C1C1B] text-[#FAF9F7] border border-[#1C1C1B] px-9 py-4 font-sans text-xs tracking-[0.15em] uppercase cursor-pointer hover:bg-neutral-800 transition-colors no-underline rounded-sm shadow-sm"
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
