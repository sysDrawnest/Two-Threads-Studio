import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useCheckoutStore, ShippingInfo } from '../store/checkoutStore';

const Checkout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Cart State
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getCartTotal)();
  const clearCart = useCartStore((state) => state.clearCart);

  // Checkout State
  const { currentStep, setStep, shippingInfo, setShippingInfo, resetCheckout } = useCheckoutStore();

  const shippingCost = 8.00;
  const total = subtotal + shippingCost;

  // Local form state for shipping
  const [localShipping, setLocalShipping] = useState<ShippingInfo>(
    shippingInfo || {
      fullName: '', email: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: 'US'
    }
  );

  useEffect(() => {
    // If cart is empty, redirect to shop
    if (cartItems.length === 0 && currentStep !== 'confirmation') {
      navigate('/shop');
    }
  }, [cartItems, navigate, currentStep]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login?redirect=/checkout" replace />;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingInfo(localShipping);
    setStep('shipping'); // This means shipping method chosen, moving to payment logic. Wait, let's map: 1=info, 2=shipping, 3=payment.
  };

  // Maps numeric steps from original UI to string steps in store
  const stepNumber = currentStep === 'cart' ? 1 : currentStep === 'shipping' ? 2 : currentStep === 'payment' ? 3 : 4;
  
  const goToStep = (num: number) => {
    if (num === 1) setStep('cart');
    if (num === 2) setStep('shipping');
    if (num === 3) setStep('payment');
  };

  const handlePlaceOrder = () => {
    // Implement order placement logic (API call)
    alert("Order Placed Successfully! (Prototype)");
    clearCart();
    resetCheckout();
    navigate('/');
  };

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <h1 className="font-serif text-3xl">Order Confirmed!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      
      {/* Left Column: Flow */}
      <div className="w-full md:w-3/5 lg:w-2/3 p-6 md:p-12 lg:p-24 bg-white md:min-h-screen flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full">
          
          <Link to="/" className="font-serif text-2xl tracking-widest text-primary-container no-underline font-medium block mb-12">
            TwoThreads Studio
          </Link>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-12">
            <span className={stepNumber >= 1 ? "text-primary-container" : "text-on-surface-variant"}>Information</span>
            <span className="text-outline-variant">/</span>
            <span className={stepNumber >= 2 ? "text-primary-container" : "text-on-surface-variant"}>Shipping</span>
            <span className="text-outline-variant">/</span>
            <span className={stepNumber >= 3 ? "text-primary-container" : "text-on-surface-variant"}>Payment</span>
          </div>

          <form onSubmit={stepNumber === 1 ? handleShippingSubmit : (e) => { e.preventDefault(); goToStep(stepNumber + 1); }}>
            
            {/* Step 1: Information */}
            {stepNumber === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-2xl text-primary-container mb-6">Contact Information</h2>
                <input type="email" value={localShipping.email} onChange={e => setLocalShipping({...localShipping, email: e.target.value})} placeholder="Email Address" required className="w-full mb-8 p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent" />
                
                <h2 className="font-serif text-2xl text-primary-container mb-6">Shipping Address</h2>
                <div className="flex flex-col gap-4 mb-8">
                  <input type="text" value={localShipping.fullName} onChange={e => setLocalShipping({...localShipping, fullName: e.target.value})} placeholder="Full Name" required className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent" />
                  <input type="text" value={localShipping.addressLine1} onChange={e => setLocalShipping({...localShipping, addressLine1: e.target.value})} placeholder="Address" required className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent" />
                  <input type="text" value={localShipping.addressLine2 || ''} onChange={e => setLocalShipping({...localShipping, addressLine2: e.target.value})} placeholder="Apartment, suite, etc. (optional)" className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent" />
                  <div className="flex gap-4">
                    <input type="text" value={localShipping.city} onChange={e => setLocalShipping({...localShipping, city: e.target.value})} placeholder="City" required className="flex-1 p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent" />
                    <input type="text" value={localShipping.state} onChange={e => setLocalShipping({...localShipping, state: e.target.value})} placeholder="State/Province" required className="flex-1 p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent" />
                    <input type="text" value={localShipping.zipCode} onChange={e => setLocalShipping({...localShipping, zipCode: e.target.value})} placeholder="ZIP/Postal Code" required className="flex-1 p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Link to="/shop" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors no-underline">&lt; Return to Shop</Link>
                  <button type="submit" className="bg-primary-container text-inverse-on-surface px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#5a3d2b] transition-colors border-none cursor-pointer">
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {stepNumber === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border border-outline-variant rounded-sm p-4 mb-8 flex flex-col gap-4 text-sm">
                  <div className="flex justify-between border-b border-outline-variant pb-4">
                    <span className="text-on-surface-variant w-24">Contact</span>
                    <span className="flex-1 text-primary-container">{shippingInfo?.email}</span>
                    <button type="button" onClick={() => goToStep(1)} className="text-xs uppercase tracking-widest text-on-surface-variant underline bg-transparent border-none cursor-pointer">Change</button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant w-24">Ship to</span>
                    <span className="flex-1 text-primary-container">{shippingInfo?.addressLine1}, {shippingInfo?.city} {shippingInfo?.state} {shippingInfo?.zipCode}</span>
                    <button type="button" onClick={() => goToStep(1)} className="text-xs uppercase tracking-widest text-on-surface-variant underline bg-transparent border-none cursor-pointer">Change</button>
                  </div>
                </div>

                <h2 className="font-serif text-2xl text-primary-container mb-6">Shipping Method</h2>
                <div className="border border-outline-variant rounded-sm p-4 mb-8 flex justify-between items-center cursor-pointer bg-surface-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-primary-container bg-white"></div>
                    <span className="text-primary-container text-sm">Standard Shipping (3-5 business days)</span>
                  </div>
                  <span className="text-primary-container font-semibold">${shippingCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => goToStep(1)} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors bg-transparent border-none cursor-pointer">&lt; Return to Information</button>
                  <button type="submit" className="bg-primary-container text-inverse-on-surface px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#5a3d2b] transition-colors border-none cursor-pointer">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {stepNumber === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-2xl text-primary-container mb-6">Payment</h2>
                <p className="text-xs text-on-surface-variant mb-4">All transactions are secure and encrypted.</p>
                
                <div className="border border-outline-variant rounded-sm mb-8">
                  <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-variant/30">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-4 border-primary-container bg-white"></div>
                      <span className="text-primary-container text-sm">Credit Card</span>
                    </div>
                  </div>
                  <div className="p-4 bg-background flex flex-col gap-4">
                    <input type="text" placeholder="Card Number" className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-white" />
                    <input type="text" placeholder="Name on Card" className="w-full p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-white" />
                    <div className="flex gap-4">
                      <input type="text" placeholder="Expiration Date (MM/YY)" className="flex-1 p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-white" />
                      <input type="text" placeholder="Security Code" className="flex-1 p-3 border border-outline-variant focus:border-primary-container focus:outline-none bg-white" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => goToStep(2)} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors bg-transparent border-none cursor-pointer">&lt; Return to Shipping</button>
                  <button type="button" onClick={handlePlaceOrder} className="bg-primary-container text-inverse-on-surface px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#5a3d2b] transition-colors border-none cursor-pointer">
                    Pay Now
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="w-full md:w-2/5 lg:w-1/3 bg-surface-container/50 border-l border-outline-variant p-6 md:p-12 lg:p-16 text-sm">
        <h2 className="font-serif text-2xl text-primary-container mb-8 md:hidden">Order Summary</h2>
        <div className="flex flex-col gap-6 mb-8 border-b border-outline-variant pb-8">
          {cartItems.map((item, i) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-16 h-16 bg-white border border-outline-variant flex-shrink-0 rounded-sm overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute -top-2 -right-2 bg-on-secondary-container text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] z-10">{item.quantity}</span>
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-primary-container font-medium">{item.name}</span>
                {item.customization?.isGift && <span className="text-[10px] text-on-surface-variant mt-1 italic">Gift Wrap</span>}
                {item.customization?.engravingText && <span className="text-[10px] text-on-surface-variant mt-0.5 italic">Engraved</span>}
              </div>
              <span className="text-primary-container font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mb-6 border-b border-outline-variant pb-6">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span className="text-primary-container font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Shipping</span>
            <span className="text-primary-container font-medium">{stepNumber >= 2 ? `$${shippingCost.toFixed(2)}` : 'Calculated at next step'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-primary-container">
          <span className="text-base uppercase tracking-widest">Total</span>
          <span className="font-serif text-3xl">
            <span className="text-xs text-on-surface-variant mr-2">USD</span>
            ${(stepNumber >= 2 ? total : subtotal).toFixed(2)}
          </span>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
