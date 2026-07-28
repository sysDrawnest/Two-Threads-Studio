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
import { 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Lock, 
  Truck, 
  CreditCard, 
  Banknote, 
  Sparkles, 
  ArrowLeft,
  ShoppingBag,
  Info,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const Checkout: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
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

  // Mobile Order Summary Bottom Drawer State
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);


  useEffect(() => {
    // If cart is empty, redirect to shop
    if (!isCartLoading && cartItems.length === 0 && currentStep !== 'confirmation') {
      navigate('/shop');
    }
  }, [cartItems, isCartLoading, navigate, currentStep]);

  // While auth is initialising, show nothing to prevent a false redirect
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex flex-col items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border border-[#E3DACF]" />
          <div className="absolute inset-0 rounded-full border border-transparent border-t-[#A34A38] animate-spin" />
        </div>
      </div>
    );
  }

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
      email: user?.email || '',
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

  const initiateRazorpayPayment = async (order: any) => {
    setProcessingMessage('Loading secure payment gateway…');
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay. Please check your internet connection.');
    }

    setProcessingMessage('Initiating payment…');
    const razorpayOrder = await paymentService.createRazorpayOrder(order.id);

    // Handle mock/development key mode
    if (!razorpayOrder.keyId || razorpayOrder.keyId.includes('dummy') || razorpayOrder.razorpayOrderId.startsWith('order_mock_')) {
      setProcessingMessage('Completing payment…');
      await paymentService.verifyPayment(order.id, {
        razorpay_order_id: razorpayOrder.razorpayOrderId,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'mock_signature',
      });
      await clearCartMutation.mutateAsync();
      navigate(`/checkout/success?order=${order.orderNumber}`);
      return;
    }

    openRazorpayPopup({
      key: razorpayOrder.keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Two Threads Studio',
      description: `Order ${order.orderNumber}`,
      order_id: razorpayOrder.razorpayOrderId,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
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
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
          setProcessingMessage('');
        },
      },
    });
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
        setProcessingMessage('Confirming COD order...');
        await paymentService.confirmCodOrder(order.id);
        await clearCartMutation.mutateAsync();
        navigate(`/checkout/success?order=${order.orderNumber}`);
      } else {
        await initiateRazorpayPayment(order);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '';
      
      // Phase 5C: Handle OTP required response
      if (errorMsg.includes('OTP_REQUIRED')) {
        setShowOtpModal(true);
        // Send OTP automatically when modal opens
        riskService.sendOtp(user?.phone || user?.email || '', 'FIRST_ORDER_VERIFICATION').catch(console.error);
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
      await riskService.verifyOtp(user?.phone || user?.email || '', 'FIRST_ORDER_VERIFICATION', otpValue);
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

      await initiateRazorpayPayment(order);
    } catch (e: any) {
      setOtpError(e.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };


  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full bg-white border border-[#E3DACF] p-8 md:p-12 rounded-2xl shadow-[0_12px_40px_rgba(28,28,27,0.06)]">
          <div className="w-16 h-16 bg-[#F9ECE9] text-[#A34A38] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#A34A38] font-bold block mb-2">Artisan Order Confirmed</span>
          <h1 className="font-serif text-2xl md:text-3xl text-[#1C1C1B] mb-3">Thank You for Supporting Slow Craft</h1>
          <p className="text-xs text-[#6E665E] leading-relaxed mb-8">
            Your order is received with gratitude. Our master artisans are preparing your custom embroidery canvas with meticulous attention to detail.
          </p>

          <div className="bg-[#FAF8F5] border border-[#EBE5DF] rounded-xl p-4 mb-8 text-xs text-left space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-[#8C827A] font-sans">Order Reference:</span>
              <span className="font-semibold text-[#1C1C1B]">{placedOrderId || 'TTS-PROD'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8C827A] font-sans">Estimated Delivery:</span>
              <span className="text-[#1C1C1B] font-sans">3–5 Business Days</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              to="/account" 
              onClick={() => resetCheckout()}
              className="bg-[#1C1C1B] text-[#FBFBFA] py-3.5 px-6 font-mono text-xs tracking-widest uppercase hover:bg-[#333331] transition-colors rounded-xl no-underline font-semibold block text-center shadow-sm"
            >
              View Order Dashboard
            </Link>
            <Link 
              to="/shop" 
              onClick={() => resetCheckout()}
              className="font-mono text-xs tracking-wider uppercase text-[#7A7067] hover:text-[#1C1C1B] transition-colors underline underline-offset-4 decoration-[#D1C7BD] block text-center"
            >
              Continue Browsing Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1C1B] flex flex-col font-sans selection:bg-[#F9ECE9] selection:text-[#A34A38]">
      
      {/* Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-[#1C1C1B]/40 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-white border border-[#E3DACF] p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs w-full text-center space-y-4 animate-fadeIn">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-[#EAE4DC]" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#A34A38] animate-spin" />
            </div>
            <div>
              <p className="font-serif text-lg text-[#1C1C1B]">{processingMessage || 'Securing Checkout...'}</p>
              <p className="text-[11px] font-mono text-[#7A7067] tracking-wider mt-1 uppercase">Please do not close window</p>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1C1B]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E3DACF] p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#F9ECE9] text-[#A34A38] rounded-full flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-xl text-[#1C1C1B]">Security Verification</h3>
              <p className="text-xs text-[#6E665E] leading-relaxed">
                To protect your order, a 6-digit verification code has been sent to your phone/email ({user?.phone || user?.email}).
              </p>
            </div>

            {otpError && (
              <div className="p-3 bg-[#FDF2F0] border border-[#F5C6CB] text-[#9A2C1D] text-xs font-mono rounded-lg">
                {otpError}
              </div>
            )}

            <div className="space-y-3">
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit OTP code"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center font-mono text-lg tracking-[0.4em] py-3 border border-[#E2DBD1] rounded-xl bg-[#FAF8F5] focus:bg-white focus:border-[#1C1C1B] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otpValue.length !== 6}
                className="w-full py-3 bg-[#1C1C1B] text-white font-mono text-xs uppercase tracking-widest rounded-xl disabled:opacity-50 hover:bg-[#333331] transition-all cursor-pointer font-semibold"
              >
                {isVerifyingOtp ? 'Verifying Code...' : 'Verify & Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Summary Bar (Trigger for Drawer) */}
      <div className="md:hidden sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EBE5DF] px-4 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#1C1C1B] bg-transparent border-none cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#A34A38]" />
          <span>{isMobileSummaryOpen ? 'Hide Summary' : 'Show Order Summary'}</span>
          {isMobileSummaryOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#7A7067]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#7A7067]" />}
        </button>
        <span className="font-serif text-base font-semibold text-[#1C1C1B]">
          ₹{totals.grandTotal.toLocaleString()}
        </span>
      </div>

      {/* Expandable Mobile Order Summary Drawer */}
      {isMobileSummaryOpen && (
        <div className="md:hidden bg-[#F4EFEA] border-b border-[#E3DACF] p-4 space-y-4 animate-fadeIn">
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item: CartItemType) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <div className="relative w-12 h-14 bg-white border border-[#E3DACF] rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.primaryImage || '/placeholder.png'} alt={item.productName} className="w-full h-full object-cover" />
                  <span className="absolute top-0 right-0 bg-[#A34A38] text-white text-[9px] font-mono px-1 rounded-bl-md font-bold">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1C1C1B] truncate">{item.productName}</p>
                  {item.variantName && <p className="text-[10px] text-[#7A7067] font-mono uppercase">{item.variantName}</p>}
                </div>
                <span className="font-mono text-xs font-semibold text-[#1C1C1B]">₹{item.totalPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E3DACF] space-y-1.5 font-mono text-xs text-[#5C544D]">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{totals.subtotal.toLocaleString()}</span></div>
            {totals.discount > 0 && <div className="flex justify-between text-[#A34A38]"><span>Discount</span><span>-₹{totals.discount.toLocaleString()}</span></div>}
            <div className="flex justify-between text-[11px] text-[#7A7067]"><span>GST</span><span>Inclusive</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{totals.shipping > 0 ? `₹${totals.shipping}` : 'Free'}</span></div>
          </div>
        </div>
      )}

      {/* Atelier Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1440px] w-full mx-auto">
        
        {/* Left Form Area (60% Desktop) */}
        <main className="w-full md:w-3/5 lg:w-7/12 p-5 sm:p-8 md:p-12 lg:p-16 bg-[#FAF8F5] flex flex-col justify-between">
          <div className="max-w-xl mx-auto w-full space-y-8">
            
            {/* Header Brand Link */}
            <div className="border-b border-[#EBE5DF] pb-6 flex items-center justify-between">
              <Link to="/" className="font-serif text-2xl md:text-3xl tracking-widest text-[#1C1C1B] hover:text-[#A34A38] transition-colors no-underline font-light">
                TwoThreads Studio
              </Link>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A7067] bg-[#EAE4DC]/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-[#A34A38]" /> Atelier Checkout
              </span>
            </div>

            {/* Visual Step Progress Indicator */}
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest pt-2 pb-4 border-b border-[#EBE5DF]">
              <button 
                type="button" 
                onClick={() => stepNumber > 1 && goToStep(1)}
                className={`flex items-center gap-2 bg-transparent border-none cursor-pointer transition-all ${
                  stepNumber >= 1 ? "text-[#1C1C1B] font-bold" : "text-[#9E948A]"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  stepNumber > 1 ? "bg-[#A34A38] text-white" : stepNumber === 1 ? "bg-[#1C1C1B] text-white" : "bg-[#EAE4DC] text-[#7A7067]"
                }`}>
                  {stepNumber > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                </span>
                <span className="hidden sm:inline">Address</span>
              </button>
              
              <div className={`h-px flex-1 mx-3 ${stepNumber >= 2 ? "bg-[#A34A38]" : "bg-[#EAE4DC]"}`} />

              <button 
                type="button" 
                onClick={() => stepNumber > 2 && goToStep(2)}
                className={`flex items-center gap-2 bg-transparent border-none cursor-pointer transition-all ${
                  stepNumber >= 2 ? "text-[#1C1C1B] font-bold" : "text-[#9E948A]"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  stepNumber > 2 ? "bg-[#A34A38] text-white" : stepNumber === 2 ? "bg-[#1C1C1B] text-white" : "bg-[#EAE4DC] text-[#7A7067]"
                }`}>
                  {stepNumber > 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                </span>
                <span className="hidden sm:inline">Courier</span>
              </button>

              <div className={`h-px flex-1 mx-3 ${stepNumber >= 3 ? "bg-[#A34A38]" : "bg-[#EAE4DC]"}`} />

              <div className={`flex items-center gap-2 ${stepNumber >= 3 ? "text-[#1C1C1B] font-bold" : "text-[#9E948A]"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  stepNumber === 3 ? "bg-[#1C1C1B] text-white" : "bg-[#EAE4DC] text-[#7A7067]"
                }`}>
                  3
                </span>
                <span className="hidden sm:inline">Payment</span>
              </div>
            </div>

            {/* Form & Step Handler */}
            <form onSubmit={stepNumber === 1 ? handleShippingSubmit : (e) => { e.preventDefault(); goToStep(stepNumber + 1); }}>
              
              {/* STEP 1: INFORMATION & DELIVERY ADDRESS */}
              {stepNumber === 1 && (
                <div className="space-y-6">
                  
                  {/* Account Summary Banner */}
                  <div className="bg-white border border-[#E3DACF] rounded-2xl p-5 shadow-[0_4px_20px_rgba(28,28,27,0.02)] space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#A34A38]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A7067] font-semibold">Account Verified</span>
                      </div>
                      <Link to="/account" className="text-[10px] font-mono tracking-widest text-[#A34A38] hover:underline uppercase">Edit Profile</Link>
                    </div>
                    <div className="text-xs text-[#1C1C1B]">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-[#7A7067] font-mono text-[11px]">{user?.email} {user?.phone && `• ${user.phone}`}</p>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-xl text-[#1C1C1B]">Select Delivery Destination</h2>
                    </div>
                    
                    <AddressSelector
                      selectedId={selectedAddress?.id}
                      onSelect={(addr) => setSelectedAddress(addr)}
                      type="shipping"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-[#EBE5DF]">
                    <Link to="/shop" className="text-xs font-mono uppercase tracking-widest text-[#7A7067] hover:text-[#1C1C1B] transition-colors no-underline flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" /> Return to Shop
                    </Link>
                    <button 
                      type="submit" 
                      className="bg-[#1C1C1B] text-[#FBFBFA] px-8 py-3.5 text-xs font-mono tracking-widest uppercase hover:bg-[#333331] transition-all cursor-pointer rounded-xl font-semibold shadow-sm"
                    >
                      Continue to Courier
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING METHOD SELECTION */}
              {stepNumber === 2 && (
                <div className="space-y-6">
                  
                  {/* Read-Only Information Summary */}
                  <div className="bg-white border border-[#E3DACF] rounded-2xl p-5 space-y-3 font-mono text-xs shadow-[0_4px_20px_rgba(28,28,27,0.02)]">
                    <div className="flex justify-between items-center pb-2 border-b border-[#EBE5DF]">
                      <span className="text-[#7A7067] text-[10px] uppercase tracking-wider font-sans w-20">Contact</span>
                      <span className="flex-1 text-[#1C1C1B] font-medium">{shippingInfo?.email}</span>
                      <button type="button" onClick={() => goToStep(1)} className="text-[10px] text-[#A34A38] uppercase underline tracking-wider bg-transparent border-none cursor-pointer">Change</button>
                    </div>
                    <div className="flex justify-between items-center font-sans">
                      <span className="text-[#7A7067] text-[10px] uppercase font-mono tracking-wider w-20">Ship To</span>
                      <span className="flex-1 text-[#1C1C1B] leading-relaxed">
                        {shippingInfo?.addressLine1}, {shippingInfo?.city} {shippingInfo?.state} — <span className="font-mono text-[#1C1C1B] font-semibold">{shippingInfo?.zipCode}</span>
                      </span>
                      <button type="button" onClick={() => goToStep(1)} className="text-[10px] text-[#A34A38] uppercase underline font-mono tracking-wider bg-transparent border-none cursor-pointer">Change</button>
                    </div>
                  </div>

                  {/* Courier Option Cards */}
                  <div className="space-y-3">
                    <h2 className="font-serif text-xl text-[#1C1C1B]">Select Delivery Option</h2>
                    
                    <div className="border-2 border-[#1C1C1B] bg-white rounded-2xl p-5 flex justify-between items-center shadow-[0_4px_20px_rgba(28,28,27,0.04)]">
                      <div className="flex items-center gap-3.5">
                        <div className="w-5 h-5 rounded-full border-4 border-[#A34A38] bg-white flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-[#1C1C1B]">Standard Artisan Courier</p>
                          <p className="text-[11px] text-[#7A7067]">Dispatched in protective linen wrap • 3–5 Business Days</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#1C1C1B]">
                        {totals.shipping > 0 ? `₹${totals.shipping}` : 'FREE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-[#EBE5DF]">
                    <button type="button" onClick={() => goToStep(1)} className="text-xs font-mono uppercase tracking-widest text-[#7A7067] hover:text-[#1C1C1B] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" /> Return to Address
                    </button>
                    <button type="submit" className="bg-[#1C1C1B] text-[#FBFBFA] px-8 py-3.5 text-xs font-mono tracking-widest uppercase hover:bg-[#333331] transition-all cursor-pointer rounded-xl font-semibold shadow-sm">
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD & RISK ENGINE */}
              {stepNumber === 3 && (
                <div className="space-y-6">
                  
                  <div>
                    <h2 className="font-serif text-xl text-[#1C1C1B]">Select Payment Method</h2>
                    <p className="text-xs text-[#7A7067] mt-1 font-mono">All transactions are encrypted with 256-bit SSL protection.</p>
                  </div>

                  {/* Payment Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Pay Online Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentOption('online')}
                      className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer outline-none ${
                        paymentOption === 'online'
                          ? 'border-[#1C1C1B] bg-white ring-1 ring-[#1C1C1B] shadow-[0_4px_25px_rgba(28,28,27,0.06)]'
                          : 'border-[#E3DACF] bg-[#FAF8F5] hover:border-[#C4B9AD]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#F9ECE9] text-[#A34A38] flex items-center justify-center">
                          <CreditCard className="w-4 h-4 stroke-[2]" />
                        </div>
                        {codData && codData.prepaidDiscountPct > 0 && (
                          <span className="bg-[#1C1C1B] text-[#FBFBFA] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            -{codData.prepaidDiscountPct}% Prepaid Discount
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#1C1C1B]">Pay Online (Razorpay)</p>
                      <p className="text-[11px] text-[#7A7067] mt-1 leading-relaxed">UPI (Google Pay, PhonePe, Paytm), Cards & Netbanking</p>
                    </button>

                    {/* Cash on Delivery Option */}
                    <button
                      type="button"
                      disabled={codData?.codEligible === false}
                      onClick={() => codData?.codEligible !== false && setPaymentOption('cod')}
                      className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 outline-none ${
                        paymentOption === 'cod'
                          ? 'border-[#1C1C1B] bg-white ring-1 ring-[#1C1C1B] shadow-[0_4px_25px_rgba(28,28,27,0.06)]'
                          : codData?.codEligible === false
                          ? 'border-[#EAE4DC] bg-[#EAE4DC]/40 opacity-60 cursor-not-allowed'
                          : 'border-[#E3DACF] bg-[#FAF8F5] hover:border-[#C4B9AD] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#EAE4DC] text-[#5C544D] flex items-center justify-center">
                          <Banknote className="w-4 h-4 stroke-[2]" />
                        </div>
                        {codData?.codEligible === false && (
                          <span className="bg-red-100 text-red-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#1C1C1B]">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-[#7A7067] mt-1 leading-relaxed">Pay via Cash or UPI at doorstep upon courier arrival</p>
                    </button>
                  </div>

                  {/* COD Restriction Explanation Banner */}
                  {codData && codData.codEligible === false && (
                    <div className="p-4 bg-[#FDF2F0] border border-[#F5C6CB] rounded-xl text-xs text-[#9A2C1D] flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-0.5">COD Unavailable for this Order</p>
                        <p className="text-[11px] leading-relaxed">{codData.reason || 'Please select Pay Online to proceed with your order.'}</p>
                      </div>
                    </div>
                  )}

                  {/* Selected Payment Detail Panel */}
                  <div className="bg-white border border-[#E3DACF] rounded-2xl p-6 space-y-3 text-center">
                    {paymentOption === 'online' ? (
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-[#F9ECE9] text-[#A34A38] rounded-full flex items-center justify-center mx-auto">
                          <Lock className="w-5 h-5 stroke-[2]" />
                        </div>
                        <p className="text-xs text-[#5C544D]">You will be redirected to Razorpay's encrypted modal to complete payment.</p>
                        {codData && codData.prepaidDiscountAmount > 0 && (
                          <p className="text-[#A34A38] text-xs font-mono font-semibold">
                            You save ₹{codData.prepaidDiscountAmount} on this order by paying online!
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs text-[#5C544D]">
                        <p className="font-medium text-[#1C1C1B]">Pay upon courier delivery.</p>
                        <p className="text-[11px] text-[#7A7067]">Please ensure exact amount is available at doorstep.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-[#EBE5DF]">
                    <button type="button" onClick={() => goToStep(2)} className="text-xs font-mono uppercase tracking-widest text-[#7A7067] hover:text-[#1C1C1B] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" /> Return to Courier
                    </button>
                    <button 
                      type="button" 
                      onClick={handlePlaceOrder}
                      className="bg-[#A34A38] text-[#FBFBFA] px-10 py-4 text-xs font-mono tracking-widest uppercase hover:bg-[#83382a] transition-all cursor-pointer rounded-xl font-semibold shadow-md"
                    >
                      Complete Order
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </main>

        {/* Right Sticky Order Summary Column (40% Desktop) */}
        <aside className="hidden md:block w-full md:w-2/5 lg:w-5/12 bg-[#F4EFEA] border-l border-[#E3DACF] p-8 md:p-12 lg:p-16 min-h-screen">
          <div className="sticky top-12 space-y-6">
            
            <div className="border-b border-[#E3DACF] pb-4 flex justify-between items-baseline">
              <h2 className="font-serif text-xl text-[#1C1C1B]">Order Summary</h2>
              <span className="text-[11px] font-mono text-[#7A7067]">{totals.totalItems} {totals.totalItems === 1 ? 'Item' : 'Items'}</span>
            </div>

            {/* Cart Items List */}
            {isCartLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-[#EAE4DC] rounded-xl" />
                <div className="h-16 bg-[#EAE4DC] rounded-xl" />
              </div>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                {cartItems.map((item: CartItemType) => (
                  <div key={item.id} className="flex gap-4 items-center text-xs pb-3 border-b border-[#E8E2DA]">
                    <div className="relative w-14 h-16 bg-white border border-[#E3DACF] rounded-xl flex-shrink-0 overflow-hidden shadow-xs">
                      <img src={item.primaryImage || '/placeholder.png'} alt={item.productName} className="w-full h-full object-cover" />
                      <span className="absolute top-0 right-0 bg-[#A34A38] text-white w-4 h-4 flex items-center justify-center rounded-bl-md text-[9px] font-bold font-mono z-10">
                        {item.quantity}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-[#1C1C1B] font-semibold truncate">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-[10px] text-[#7A7067] font-mono uppercase tracking-wider">Variant: {item.variantName}</p>
                      )}
                      {item.customization?.hoopFinish && (
                        <p className="text-[10px] text-[#7A7067]">Hoop: {item.customization.hoopFinish}</p>
                      )}
                      {item.engravingText && (
                        <p className="text-[10px] text-[#A34A38] italic">"{item.engravingText}"</p>
                      )}
                    </div>
                    
                    <span className="text-[#1C1C1B] font-semibold font-mono text-xs">₹{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="space-y-2.5 pt-2 border-b border-[#E3DACF] pb-6 font-mono text-xs text-[#5C544D]">
              <div className="flex justify-between">
                <span className="font-sans">Subtotal</span>
                <span className="text-[#1C1C1B] font-semibold">₹{totals.subtotal.toLocaleString()}</span>
              </div>
              
              {totals.discount > 0 && (
                <div className="flex justify-between text-[#A34A38]">
                  <span className="font-sans">Prepaid Discount</span>
                  <span>-₹{totals.discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-[11px] text-[#7A7067]">
                <span className="font-sans">GST Tax</span>
                <span>Inclusive</span>
              </div>

              <div className="flex justify-between">
                <span className="font-sans">Standard Delivery</span>
                <span className="text-[#1C1C1B] font-semibold font-mono">
                  {stepNumber >= 2 ? (totals.shipping > 0 ? `₹${totals.shipping}` : 'FREE') : 'Calculated next step'}
                </span>
              </div>
            </div>

            {/* Total Display */}
            <div className="flex justify-between items-baseline pt-2 text-[#1C1C1B]">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7A7067] block">Total Payable</span>
                <span className="text-[10px] font-mono text-[#8C827A]">Includes all taxes</span>
              </div>
              <span className="font-serif text-3xl font-bold tracking-tight">
                ₹{totals.grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Atelier Craft Promise */}
            <div className="p-4 bg-white/60 border border-[#E3DACF] rounded-xl text-[11px] text-[#6E665E] leading-relaxed flex gap-2.5 items-start">
              <Sparkles className="w-4 h-4 text-[#A34A38] flex-shrink-0 mt-0.5" />
              <span>Handcrafted in small batches. Each piece is inspected by our senior embroiderer prior to dispatch.</span>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;
