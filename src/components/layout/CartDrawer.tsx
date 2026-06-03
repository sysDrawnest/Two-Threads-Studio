import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockProducts } from '../../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  // Use mock data to simulate items in cart
  const cartItems = [
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[2], quantity: 1 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

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
              {cartItems.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-24 h-32 bg-surface-container flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between h-32 py-1">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="font-serif text-lg text-primary-container line-clamp-1">{item.product.name}</h3>
                            <span className="font-serif text-lg text-primary-container ml-2">${item.product.price}</span>
                          </div>
                          <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant mt-1">
                            {item.product.category}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex items-center border border-outline-variant">
                            <button className="px-3 py-1 bg-transparent border-none cursor-pointer text-primary-container hover:bg-surface-variant transition-colors" aria-label="Decrease quantity">-</button>
                            <span className="font-sans text-sm text-primary-container px-2">{item.quantity}</span>
                            <button className="px-3 py-1 bg-transparent border-none cursor-pointer text-primary-container hover:bg-surface-variant transition-colors" aria-label="Increase quantity">+</button>
                          </div>
                          <button className="font-sans text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary-container bg-transparent border-none cursor-pointer underline transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
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
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-outline-variant bg-surface-container/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-sm uppercase tracking-widest text-primary-container">Subtotal</span>
                  <span className="font-serif text-2xl text-primary-container">${subtotal}</span>
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
