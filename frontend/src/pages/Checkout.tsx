import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart, useClearCart, Address, CartItem as CartItemType } from '../hooks/useCommerce';
import { useCheckoutStore } from '../store/checkoutStore';
import AddressSelector from '../components/commerce/AddressSelector';
import { orderService } from '../services/orderService';
import {
  paymentService,
  loadRazorpayScript,
  openRazorpayPopup,
} from '../services/paymentService';
import { riskService, CodEligibilityResponse } from '../services/riskService';



const Checkout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Cart State
  const { data: cartData, isLoading: isCartLoading } = useCart();
  const cartItems = cartData?.items || [];
  const totals = cartData?.totals || {
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    grandTotal: 0,
    totalItems: 0,
  };

  const clearCartMutation = useClearCart();

  // Checkout Step State
  const { currentStep, setStep, shippingInfo, setShippingInfo, resetCheckout } = useCheckoutStore();

  // Selected Address State
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [contactEmail, setContactEmail] = useState(user?.email || '');

  const [paymentOption, setPaymentOption] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Phase 5C: Risk & Trust
  const [codData, setCodData] = useState<CodEligibilityResponse | null>(null);
  const [isCheckingCod, setIsCheckingCod] = useState(false);
  
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');


  useEffect(() => {
    // If cart is empty, redirect to shop
    if (!isCartLoading && cartItems.length === 0 && currentStep !== 'confirmation') {
      navigate('/shop');
    }
  }, [cartItems, isCartLoading, navigate, currentStep]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login?redirect=/checkout" replace />;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert('Please select or add a shipping address.');
      return;
    }
    
    // Set shipping info in checkout store for step 2 & summary
    setShippingInfo({
      fullName: selectedAddress.fullName,
      email: contactEmail,
      addressLine1: selectedAddress.line1,
      addressLine2: selectedAddress.line2 || '',
      city: selectedAddress.city,
      state: selectedAddress.state,
      zipCode: selectedAddress.postalCode,
      country: selectedAddress.country,
    });
    setStep('shipping');
  };

  const stepNumber = currentStep === 'cart' ? 1 : currentStep === 'shipping' ? 2 : currentStep === 'payment' ? 3 : 4;
  
  const goToStep = async (num: number) => {
    if (num === 1) setStep('cart');
    if (num === 2) setStep('shipping');
    if (num === 3) {
      setStep('payment');
      setIsCheckingCod(true);
      try {
        const res = await riskService.checkCodEligibility(
          totals.grandTotal, 
          cartItems.map((item: any) => item.productId)
        );
        // Depending on apiClient, response data might be unwrapped
        const data = (res as any).data || res;
        setCodData(data as CodEligibilityResponse);
        
        if (data && !data.codEligible && paymentOption === 'cod') {
          setPaymentOption('online');
        }
      } catch (e) {
        console.error('Failed to check COD eligibility', e);
      } finally {
        setIsCheckingCod(false);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address.');
      return;
    }
    setIsProcessing(true);
    try {
      // Step 1: Create order on the backend
      setProcessingMessage('Creating your order…');
      const orderRes: any = await orderService.createOrder({
        shippingAddressId: selectedAddress.id,
        billingAddressId: selectedAddress.id,
        paymentMethod: paymentOption === 'cod' ? 'COD' : 'ONLINE',
        notes: undefined,
      });
      const order = orderRes.data || orderRes.order || orderRes;

      setPlacedOrderId(order.orderNumber);

      if (paymentOption === 'cod') {
        // COD: confirm directly
        setProcessingMessage('Confirming COD order…');
        await paymentService.confirmCodOrder(order.id);
        await clearCartMutation.mutateAsync();
        navigate(`/checkout/success?order=${order.orderNumber}`);
        return;
      }

      // ONLINE: Razorpay flow
      setProcessingMessage('Loading secure payment…');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }

      setProcessingMessage('Initiating payment…');
      const razorpayOrder = await paymentService.createRazorpayOrder(order.id);

      // Step 2: Open Razorpay popup — result comes in handler callbacks
      openRazorpayPopup({
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Two Threads Studio',
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrder.razorpayOrderId,
        prefill: {
          name: (user as any)?.firstName ? (user as any).firstName + ' ' + ((user as any).lastName || '') : user?.name || '',
          email: user?.email || contactEmail,
        },
        theme: { color: '#1C1C1B' },
        handler: async (response) => {
          try {
            // Step 3: Verify signature server-side
            setProcessingMessage('Verifying payment…');
            await paymentService.verifyPayment(order.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await clearCartMutation.mutateAsync();
            navigate(`/checkout/success?order=${order.orderNumber}`);
          } catch (err: any) {
            navigate(`/checkout/failed?order=${order.orderNumber}`);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setProcessingMessage('');
          },
        },
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '';
      
      // Phase 5C: Handle OTP required response
      if (errorMsg.includes('OTP_REQUIRED')) {
        setShowOtpModal(true);
        // Send OTP automatically when modal opens
        riskService.sendOtp((user as any)?.phone || contactEmail, 'FIRST_ORDER_VERIFICATION').catch(console.error);
        return; // Pause checkout process
      }

      const orderNum = placedOrderId;
      navigate(`/checkout/failed${orderNum ? '?order=' + orderNum : ''}`);
    } finally {
      if (!showOtpModal) {
        setIsProcessing(false);
        setProcessingMessage('');
      }
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      await riskService.verifyOtp((user as any)?.phone || contactEmail, 'FIRST_ORDER_VERIFICATION', otpValue);
      setShowOtpModal(false);
      
      // Resume place order directly without showing the modal again
      setProcessingMessage('Resuming order...');
      const orderRes: any = await orderService.createOrder({
        shippingAddressId: selectedAddress!.id,
        billingAddressId: selectedAddress!.id,
        paymentMethod: paymentOption === 'cod' ? 'COD' : 'ONLINE',
        notes: undefined,
      });
      const order = orderRes.data || orderRes.order || orderRes;

      setPlacedOrderId(order.orderNumber);

      if (paymentOption === 'cod') {
        setProcessingMessage('Confirming COD order…');
        await paymentService.confirmCodOrder(order.id);
        await clearCartMutation.mutateAsync();
        navigate(`/checkout/success?order=${order.orderNumber}`);
        return;
      }

      setProcessingMessage('Initiating payment…');
      const razorpayOrder = await paymentService.createRazorpayOrder(order.id);
      openRazorpayPopup({
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Two Threads Studio',
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrder.razorpayOrderId,
        prefill: {
          name: (user as any)?.firstName ? (user as any).firstName + ' ' + ((user as any).lastName || '') : user?.name || '',
          email: user?.email || contactEmail,
        },
        theme: { color: '#1C1C1B' },
        handler: async (response) => {
          try {
            setProcessingMessage('Verifying payment…');
            await paymentService.verifyPayment(order.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await clearCartMutation.mutateAsync();
            navigate(`/checkout/success?order=${order.orderNumber}`);
          } catch (err: any) {
            navigate(`/checkout/failed?order=${order.orderNumber}`);
          }
        },
      });

    } catch (e: any) {
      setOtpError(e.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
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

          <div className="bg-[#FAF9F7] border border-neutral-200/60 p-4 rounded-sm mb-8 text-left text-xs font-sans text-neutral-600 flex flex-col gap-2 font-mono">
            <div className="flex justify-between">
              <span className="font-semibold text-[#1C1C1B] font-sans">Order Reference:</span>
              <span className="font-mono text-[#A34A38] font-bold">{placedOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#1C1C1B] font-sans">Delivery Estimate:</span>
              <span>3-5 business days</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              to="/account" 
              onClick={() => resetCheckout()}
              className="bg-[#1C1C1B] text-[#FAF9F7] py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors rounded-sm no-underline shadow-sm font-semibold block"
            >
              View Dashboard
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
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)} 
                      placeholder="julia@example.com" 
                      required 
                      className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm transition-colors font-mono" 
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="font-serif text-xl text-[#1C1C1B] mb-4">Delivery Address</h2>
                  <AddressSelector
                    selectedId={selectedAddress?.id}
                    onSelect={(addr) => setSelectedAddress(addr)}
                    type="shipping"
                  />
                </div>
                
                <div className="flex justify-between items-center mt-6 border-t border-neutral-100 pt-6">
                  <Link to="/shop" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors no-underline">
                    &lt; Return to Shop
                  </Link>
                  <button type="submit" className="bg-[#1C1C1B] text-[#FAF9F7] px-8 py-4 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors border-none cursor-pointer rounded-sm shadow-sm font-semibold font-mono">
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {stepNumber === 2 && (
              <div>
                <div className="border border-neutral-200 rounded-sm p-5 mb-8 flex flex-col gap-4 text-xs text-neutral-600 bg-[#FAF9F7]">
                  <div className="flex justify-between border-b border-neutral-200 pb-4 font-mono">
                    <span className="text-neutral-400 w-24 uppercase tracking-wider font-sans">Contact</span>
                    <span className="flex-1 text-[#1C1C1B]">{shippingInfo?.email}</span>
                    <button type="button" onClick={() => goToStep(1)} className="text-[10px] uppercase tracking-widest text-[#A34A38] hover:text-[#83382a] underline bg-transparent border-none cursor-pointer font-sans">Change</button>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="text-neutral-400 w-24 uppercase tracking-wider">Ship to</span>
                    <span className="flex-1 text-[#1C1C1B]">{shippingInfo?.addressLine1}, {shippingInfo?.city} {shippingInfo?.state} - <span className="font-mono">{shippingInfo?.zipCode}</span></span>
                    <button type="button" onClick={() => goToStep(1)} className="text-[10px] uppercase tracking-widest text-[#A34A38] hover:text-[#83382a] underline bg-transparent border-none cursor-pointer">Change</button>
                  </div>
                </div>

                <h2 className="font-serif text-xl text-[#1C1C1B] mb-6">Shipping Method</h2>
                <div className="border border-[#1C1C1B] rounded-sm p-5 mb-8 flex justify-between items-center bg-[#FBFBFA]">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-[#A34A38] bg-white"></div>
                    <span className="text-[#1C1C1B] text-sm font-medium">Standard Courier (3-5 business days)</span>
                  </div>
                  <span className="text-[#1C1C1B] font-semibold font-mono">₹{totals.shipping}</span>
                </div>

                <div className="flex justify-between items-center mt-6 border-t border-neutral-100 pt-6">
                  <button type="button" onClick={() => goToStep(1)} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors bg-transparent border-none cursor-pointer">
                    &lt; Return to Information
                  </button>
                  <button type="submit" className="bg-[#1C1C1B] text-[#FAF9F7] px-8 py-4 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors border-none cursor-pointer rounded-sm shadow-sm font-semibold font-mono">
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
                    onClick={() => setPaymentOption('online')}
                    className={`py-3 font-sans text-xs uppercase tracking-wider border-none transition-all ${
                      paymentOption === 'online' 
                        ? 'bg-white font-semibold text-[#1C1C1B] border-r border-neutral-200' 
                        : 'bg-transparent text-neutral-400 hover:text-[#1C1C1B]'
                    }`}
                  >
                    Pay Online
                    {codData && codData.prepaidDiscountPct > 0 && (
                      <span className="ml-2 bg-[#1C1C1B] text-white text-[9px] px-1.5 py-0.5 rounded-sm">-{codData.prepaidDiscountPct}% OFF</span>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={codData?.codEligible === false}
                    onClick={() => codData?.codEligible !== false && setPaymentOption('cod')}
                    className={`py-3 flex flex-col items-center justify-center font-sans text-xs uppercase tracking-wider border-none transition-all ${
                      paymentOption === 'cod' 
                        ? 'bg-white font-semibold text-[#1C1C1B] border-l border-neutral-200' 
                        : codData?.codEligible === false
                        ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed border-l border-neutral-200'
                        : 'bg-transparent text-neutral-400 hover:text-[#1C1C1B]'
                    }`}
                  >
                    <span>Cash on Delivery</span>
                  </button>
                </div>
                
                {/* Reason for COD disabled */}
                {codData && codData.codEligible === false && (
                  <div className="bg-red-50 text-red-700 text-xs p-3 mt-4 border border-red-100 rounded-sm font-sans flex gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>{codData.reason || 'COD is not available for this order.'}</span>
                  </div>
                )}

                {/* Method fields */}
                <div className="border border-t-0 border-neutral-200 p-6 bg-white rounded-b-sm mb-8 flex flex-col gap-4">
                  {paymentOption === 'online' ? (
                    <div className="flex flex-col gap-4 items-center justify-center p-6 text-center text-neutral-500 font-sans text-xs">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <p>You will be redirected to Razorpay securely to complete your online payment using UPI, Credit/Debit Card, Netbanking, or Wallets.</p>
                      {codData && codData.prepaidDiscountAmount > 0 && (
                        <p className="text-[#A34A38] font-semibold text-sm">
                          Save ₹{codData.prepaidDiscountAmount} by paying online today!
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 items-center justify-center p-6 text-center text-neutral-500 font-sans text-xs">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2">
                         <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                       </svg>
                       <p>You can pay via Cash or UPI when the package is delivered to your door.</p>
                       <p className="italic text-neutral-400">Please keep the exact change ready.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6 border-t border-neutral-100 pt-6">
                  <button type="button" onClick={() => goToStep(2)} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] transition-colors bg-transparent border-none cursor-pointer">
                    &lt; Return to Shipping
                  </button>
                  <button type="button" onClick={handlePlaceOrder} className="bg-[#A34A38] text-[#FAF9F7] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#83382a] transition-colors border-none cursor-pointer rounded-sm shadow-sm font-semibold font-mono">
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
        
        {isCartLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-zinc-200" />
            <div className="h-16 bg-zinc-200" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 mb-8 border-b border-neutral-200 pb-8 flex-grow overflow-y-auto max-h-[350px]">
            {cartItems.map((item: CartItemType) => (
              <div key={item.id} className="flex gap-4 items-center text-xs">
                <div className="relative w-14 h-18 bg-white border border-neutral-200 flex-shrink-0 rounded-sm overflow-hidden">
                  <img src={item.primaryImage || '/placeholder.png'} alt={item.productName} className="w-full h-full object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#A34A38] text-white w-4.5 h-4.5 flex items-center justify-center rounded-full text-[9px] font-bold z-10 font-mono">{item.quantity}</span>
                </div>
                <div className="flex-grow flex flex-col gap-0.5">
                  <span className="text-[#1C1C1B] font-medium">{item.productName}</span>
                  {item.variantName && (
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Variant: {item.variantName}</span>
                  )}
                  {item.customization?.hoopFinish && (
                    <span className="text-[10px] text-neutral-400 capitalize">Hoop: {item.customization.hoopFinish}</span>
                  )}
                  {item.engravingText && (
                    <span className="text-[10px] text-neutral-400">Engraved: "{item.engravingText}"</span>
                  )}
                  {item.giftWrap && (
                    <span className="text-[10px] text-[#A34A38] font-medium">Bespoke Gift Wrap</span>
                  )}
                </div>
                <span className="text-[#1C1C1B] font-semibold font-mono">₹{item.totalPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6 border-b border-neutral-200 pb-6 text-xs text-neutral-600 font-mono">
          <div className="flex justify-between">
            <span className="font-sans">Subtotal</span>
            <span className="text-[#1C1C1B] font-semibold">₹{totals.subtotal.toLocaleString()}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="font-sans">Discount</span>
              <span>-₹{totals.discount.toLocaleString()}</span>
            </div>
          )}
          {totals.tax > 0 && (
            <div className="flex justify-between">
              <span className="font-sans">Tax</span>
              <span>₹{totals.tax.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-sans">Shipping Cost</span>
            <span className="text-[#1C1C1B] font-semibold font-mono">
              {stepNumber >= 2 ? `₹${totals.shipping}` : 'Calculated at shipping step'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[#1C1C1B]">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Total Price</span>
          <span className="font-sans text-2xl font-bold">
            <span className="text-xs text-neutral-400 mr-2 font-normal font-mono">INR</span>
            <span className="font-mono">
              ₹{(paymentOption === 'online' && codData && codData.prepaidDiscountAmount > 0 
                  ? (stepNumber >= 2 ? totals.grandTotal : totals.subtotal) - codData.prepaidDiscountAmount 
                  : (stepNumber >= 2 ? totals.grandTotal : totals.subtotal)
                ).toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-2 border-neutral-200 border-t-[#A34A38] rounded-full animate-spin mb-6"></div>
          <p className="font-sans text-sm tracking-widest uppercase text-[#1C1C1B] font-semibold">{processingMessage}</p>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-[#1C1C1B]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-8 rounded-sm shadow-xl flex flex-col items-center relative">
            <button 
              type="button" 
              onClick={() => {
                setShowOtpModal(false);
                setIsProcessing(false);
              }}
              className="absolute top-4 right-4 bg-transparent border-none text-neutral-400 hover:text-[#1C1C1B] cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A34A38" strokeWidth="1.5" className="mb-4">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>

            <h3 className="font-serif text-2xl text-[#1C1C1B] mb-2 text-center">Verify Your Account</h3>
            <p className="text-sm text-neutral-500 text-center mb-8 font-sans">
              To ensure the security of your high-value or COD order, we've sent a verification code to <span className="font-semibold text-[#1C1C1B]">{(user as any)?.phone || contactEmail}</span>.
            </p>

            {otpError && (
              <div className="w-full bg-red-50 text-red-700 text-xs p-3 mb-6 border border-red-100 rounded-sm font-sans text-center">
                {otpError}
              </div>
            )}

            <div className="w-full flex flex-col gap-6">
              <input 
                type="text" 
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full p-4 border border-neutral-300 focus:border-[#A34A38] text-center tracking-[0.5em] text-lg font-mono rounded-sm outline-none"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpValue.length !== 6 || isVerifyingOtp}
                className="w-full bg-[#1C1C1B] text-white py-4 font-sans text-xs uppercase tracking-widest font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors rounded-sm"
              >
                {isVerifyingOtp ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
            
            <button 
              type="button" 
              onClick={() => riskService.sendOtp((user as any)?.phone || contactEmail, 'FIRST_ORDER_VERIFICATION')}
              className="mt-6 text-xs font-sans uppercase tracking-widest text-neutral-400 hover:text-[#1C1C1B] underline underline-offset-4 bg-transparent border-none cursor-pointer"
            >
              Resend Code
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Checkout;
