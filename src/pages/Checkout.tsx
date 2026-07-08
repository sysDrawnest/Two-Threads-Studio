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

  const shippingCost = 250; // INR
  const total = subtotal + shippingCost;

  // Local form state for shipping
  const [localShipping, setLocalShipping] = useState<ShippingInfo>(() => {
    if (shippingInfo) return shippingInfo;
    try {
      const saved = localStorage.getItem('tt_address_book');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          fullName: parsed.fullName || '',
          email: '',
          addressLine1: parsed.addressLine1 || '',
          addressLine2: parsed.addressLine2 || '',
          city: parsed.city || '',
          state: parsed.state || '',
          zipCode: parsed.zipCode || '',
          country: parsed.country || 'IN'
        };
      }
    } catch {}
    return {
      fullName: '', email: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: 'IN'
    };
  });

  // Payment Form States
  const [paymentOption, setPaymentOption] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState('');

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
    setStep('shipping');
  };

  const stepNumber = currentStep === 'cart' ? 1 : currentStep === 'shipping' ? 2 : currentStep === 'payment' ? 3 : 4;
  
  const goToStep = (num: number) => {
    if (num === 1) setStep('cart');
    if (num === 2) setStep('shipping');
    if (num === 3) setStep('payment');
  };

  const handlePlaceOrder = () => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderId(orderId);

    // Save to localStorage
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Processing',
      items: cartItems.map(item => ({
        ...item,
        // Make sure to copy customization details
        customization: item.customization
      })),
      shippingAddress: shippingInfo || localShipping,
      total: total
    };

    try {
      const storedOrders = localStorage.getItem('tt_orders');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.unshift(newOrder);
      localStorage.setItem('tt_orders', JSON.stringify(orders));
    } catch (err) {
      console.error("Failed to save order", err);
    }

    clearCart();
    setStep('confirmation');
  };

  if (currentStep === 'confirmation') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6 bg-[#FBFBFA]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`
        }}
      >
        <div className="relative w-full max-w-[500px] bg-white p-8 md:p-12 border border-[#1C1C1B] shadow-sm before:absolute before:inset-0 before:border before:border-[#A34A38] before:translate-x-2 before:translate-y-2 before:-z-10 rounded-sm text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A34A38" strokeWidth="1.2" className="mx-auto mb-6">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <h1 className="font-serif text-3xl font-light text-[#1C1C1B] mb-4">Order Confirmed</h1>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">Thank You for Supporting Slow Craft</p>
          
          <p className="font-serif text-lg leading-relaxed text-[#1C1C1B] mb-6 italic">
            "Your order is received with gratitude. Our artisans are preparing your custom embroidery canvas with the highest standard of details."
          </p>

          <div className="bg-[#FAF9F7] border border-neutral-200/60 p-4 rounded-sm mb-8 text-left text-xs font-sans text-neutral-600 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-semibold text-[#1C1C1B]">Order Reference:</span>
              <span className="font-mono text-[#A34A38] font-bold">{placedOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#1C1C1B]">Delivery Estimate:</span>
              <span>3-5 business days</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              to="/account?tab=orders" 
              onClick={() => resetCheckout()}
              className="bg-[#1C1C1B] text-[#FAF9F7] py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors rounded-sm no-underline shadow-sm font-semibold block"
            >
              View Orders & Guides
            </Link>
            <Link 
              to="/shop" 
              onClick={() => resetCheckout()}
              className="font-sans text-xs tracking-wider uppercase text-neutral-500 hover:text-[#1C1C1B] transition-colors underline underline-offset-4 decoration-neutral-300 block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col md:flex-row font-sans">
      
      {/* Left Column: Form & Steps */}
      <div className="w-full md:w-3/5 lg:w-2/3 p-6 md:p-12 lg:p-20 bg-white border-r border-neutral-200 min-h-screen flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col justify-center">
          
          <Link to="/" className="font-serif text-2xl tracking-widest text-[#1C1C1B] hover:text-neutral-500 no-underline font-light block mb-12 border-b border-neutral-100 pb-4">
            TwoThreads Studio
          </Link>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold mb-12 text-neutral-400">
            <button 
              type="button" 
              onClick={() => stepNumber > 1 && goToStep(1)}
              className={`border-none bg-transparent p-0 uppercase tracking-widest font-semibold cursor-pointer ${stepNumber >= 1 ? "text-[#A34A38]" : "text-neutral-400"}`}
            >
              Information
            </button>
            <span className="text-neutral-300">/</span>
            <button 
              type="button" 
              onClick={() => stepNumber > 2 && goToStep(2)}
              className={`border-none bg-transparent p-0 uppercase tracking-widest font-semibold cursor-pointer ${stepNumber >= 2 ? "text-[#A34A38]" : "text-neutral-400"}`}
            >
              Shipping
            </button>
            <span className="text-neutral-300">/</span>
            <span className={stepNumber >= 3 ? "text-[#A34A38]" : "text-neutral-400"}>Payment</span>
          </div>

          <form onSubmit={stepNumber === 1 ? handleShippingSubmit : (e) => { e.preventDefault(); goToStep(stepNumber + 1); }}>
            
            {/* Step 1: Information */}
            {stepNumber === 1 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="font-serif text-xl text-[#1C1C1B] mb-4">Contact Information</h2>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Email Address</label>
                    <input 
                      type="email" 
                      value={localShipping.email} 
                      onChange={e => setLocalShipping({...localShipping, email: e.target.value})} 
                      placeholder="julia@example.com" 
                      required 
                      className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors" 
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="font-serif text-xl text-[#1C1C1B] mb-4">Shipping Address</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Full Name</label>
                      <input 
                        type="text" 
                        value={localShipping.fullName} 
                        onChange={e => setLocalShipping({...localShipping, fullName: e.target.value})} 
                        placeholder="Julia Hampton" 
                        required 
                        className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors" 
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Street Address</label>
                      <input 
                        type="text" 
                        value={localShipping.addressLine1} 
                        onChange={e => setLocalShipping({...localShipping, addressLine1: e.target.value})} 
                        placeholder="Flat / House / Lane details" 
                        required 
                        className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors" 
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Apartment, suite, etc. (optional)</label>
                      <input 
                        type="text" 
                        value={localShipping.addressLine2 || ''} 
                        onChange={e => setLocalShipping({...localShipping, addressLine2: e.target.value})} 
                        placeholder="e.g. Block C, Apartment 4B" 
                        className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">City</label>
                        <input 
                          type="text" 
                          value={localShipping.city} 
                          onChange={e => setLocalShipping({...localShipping, city: e.target.value})} 
                          placeholder="Mumbai" 
                          required 
                          className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">State</label>
                        <input 
                          type="text" 
                          value={localShipping.state} 
                          onChange={e => setLocalShipping({...localShipping, state: e.target.value})} 
                          placeholder="Maharashtra" 
                          required 
                          className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">ZIP Code</label>
                        <input 
                          type="text" 
                          value={localShipping.zipCode} 
                          onChange={e => setLocalShipping({...localShipping, zipCode: e.target.value})} 
                          placeholder="400001" 
                          required 
                          className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 border-t border-neutral-100 pt-6">
                  <Link to="/shop" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors no-underline">
                    &lt; Return to Shop
                  </Link>
                  <button type="submit" className="bg-[#1C1C1B] text-[#FAF9F7] px-8 py-4 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors border-none cursor-pointer rounded-sm shadow-sm font-semibold">
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {stepNumber === 2 && (
              <div>
                <div className="border border-neutral-200 rounded-sm p-5 mb-8 flex flex-col gap-4 text-xs text-neutral-600 bg-[#FAF9F7]">
                  <div className="flex justify-between border-b border-neutral-200 pb-4">
                    <span className="text-neutral-400 w-24 uppercase tracking-wider">Contact</span>
                    <span className="flex-1 text-[#1C1C1B]">{shippingInfo?.email}</span>
                    <button type="button" onClick={() => goToStep(1)} className="text-[10px] uppercase tracking-widest text-[#A34A38] hover:text-[#83382a] underline bg-transparent border-none cursor-pointer">Change</button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 w-24 uppercase tracking-wider">Ship to</span>
                    <span className="flex-1 text-[#1C1C1B]">{shippingInfo?.addressLine1}, {shippingInfo?.city} {shippingInfo?.state} {shippingInfo?.zipCode}</span>
                    <button type="button" onClick={() => goToStep(1)} className="text-[10px] uppercase tracking-widest text-[#A34A38] hover:text-[#83382a] underline bg-transparent border-none cursor-pointer">Change</button>
                  </div>
                </div>

                <h2 className="font-serif text-xl text-[#1C1C1B] mb-6">Shipping Method</h2>
                <div className="border border-[#1C1C1B] rounded-sm p-5 mb-8 flex justify-between items-center bg-[#FBFBFA]">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-[#A34A38] bg-white"></div>
                    <span className="text-[#1C1C1B] text-sm font-medium">Standard Courier (3-5 business days)</span>
                  </div>
                  <span className="text-[#1C1C1B] font-semibold">₹{shippingCost}</span>
                </div>

                <div className="flex justify-between items-center mt-6 border-t border-neutral-100 pt-6">
                  <button type="button" onClick={() => goToStep(1)} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors bg-transparent border-none cursor-pointer">
                    &lt; Return to Information
                  </button>
                  <button type="submit" className="bg-[#1C1C1B] text-[#FAF9F7] px-8 py-4 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors border-none cursor-pointer rounded-sm shadow-sm font-semibold">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {stepNumber === 3 && (
              <div>
                <h2 className="font-serif text-xl text-[#1C1C1B] mb-2">Payment Methods</h2>
                <p className="text-xs text-neutral-400 mb-6">All transactions are simulated and secure.</p>
                
                {/* Method selector tabs */}
                <div className="grid grid-cols-2 border border-neutral-200 rounded-t-sm bg-[#FAF9F7]">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('card')}
                    className={`py-3 font-sans text-xs uppercase tracking-wider border-none transition-all ${
                      paymentOption === 'card' 
                        ? 'bg-white font-semibold text-[#1C1C1B] border-r border-neutral-200' 
                        : 'bg-transparent text-neutral-400 hover:text-[#1C1C1B]'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentOption('upi')}
                    className={`py-3 font-sans text-xs uppercase tracking-wider border-none transition-all ${
                      paymentOption === 'upi' 
                        ? 'bg-white font-semibold text-[#1C1C1B] border-l border-neutral-200' 
                        : 'bg-transparent text-neutral-400 hover:text-[#1C1C1B]'
                    }`}
                  >
                    UPI Transfer
                  </button>
                </div>

                {/* Method fields */}
                <div className="border border-t-0 border-neutral-200 p-6 bg-white rounded-b-sm mb-8 flex flex-col gap-4">
                  {paymentOption === 'card' ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">Card Number</label>
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          placeholder="4242 •••• •••• 4242" 
                          className="w-full p-2.5 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-white text-sm" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">Cardholder Name</label>
                        <input 
                          type="text" 
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="Julia Hampton" 
                          className="w-full p-2.5 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-white text-sm" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">Expiration (MM/YY)</label>
                          <input 
                            type="text" 
                            value={expiry}
                            onChange={e => setExpiry(e.target.value)}
                            placeholder="12/28" 
                            className="w-full p-2.5 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-white text-sm" 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">CVV</label>
                          <input 
                            type="password" 
                            maxLength={3}
                            value={cvv}
                            onChange={e => setCvv(e.target.value)}
                            placeholder="•••" 
                            className="w-full p-2.5 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-white text-sm" 
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">UPI Address (VPA)</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="julia@okhdfcbank" 
                        className="w-full p-2.5 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-white text-sm" 
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6 border-t border-neutral-100 pt-6">
                  <button type="button" onClick={() => goToStep(2)} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors bg-transparent border-none cursor-pointer">
                    &lt; Return to Shipping
                  </button>
                  <button type="button" onClick={handlePlaceOrder} className="bg-[#A34A38] text-[#FAF9F7] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#83382a] transition-colors border-none cursor-pointer rounded-sm shadow-sm font-semibold">
                    Complete Order
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="w-full md:w-2/5 lg:w-1/3 bg-[#FAF9F7] p-6 md:p-12 lg:p-16 text-sm flex flex-col justify-start">
        <h2 className="font-serif text-lg text-[#1C1C1B] mb-8 pb-3 border-b border-neutral-200">Order Summary</h2>
        
        <div className="flex flex-col gap-6 mb-8 border-b border-neutral-200 pb-8 flex-grow overflow-y-auto max-h-[350px]">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 items-center text-xs">
              <div className="relative w-14 h-18 bg-white border border-neutral-200 flex-shrink-0 rounded-sm overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#A34A38] text-white w-4.5 h-4.5 flex items-center justify-center rounded-full text-[9px] font-bold z-10">{item.quantity}</span>
              </div>
              <div className="flex-grow flex flex-col gap-0.5">
                <span className="text-[#1C1C1B] font-medium">{item.name}</span>
                {item.customization?.hoopFinish && (
                  <span className="text-[10px] text-neutral-400 capitalize">Hoop: {item.customization.hoopFinish}</span>
                )}
                {item.customization?.engravingText && (
                  <span className="text-[10px] text-neutral-400">Engraved: "{item.customization.engravingText}"</span>
                )}
                {item.customization?.isGift && (
                  <span className="text-[10px] text-[#A34A38] font-medium">Bespoke Gift Wrap</span>
                )}
              </div>
              <span className="text-[#1C1C1B] font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mb-6 border-b border-neutral-200 pb-6 text-xs text-neutral-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#1C1C1B] font-semibold">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Cost</span>
            <span className="text-[#1C1C1B] font-semibold">
              {stepNumber >= 2 ? `₹${shippingCost}` : 'Calculated at shipping step'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[#1C1C1B]">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Total Price</span>
          <span className="font-sans text-2xl font-bold">
            <span className="text-xs text-neutral-400 mr-2 font-normal">INR</span>
            ₹{(stepNumber >= 2 ? total : subtotal).toLocaleString()}
          </span>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
