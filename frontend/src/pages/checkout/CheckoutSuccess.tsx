import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = params.get('order');

  useEffect(() => {
    // Auto redirect after 10s
    const t = setTimeout(() => navigate('/account'), 10000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-white border border-[#E5E0D8] p-10 text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#1E7E34" strokeWidth={2.5} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <p className="text-[9px] tracking-[0.25em] uppercase text-[#A34A38] font-sans mb-2">
          Order Placed
        </p>
        <h1 className="text-2xl font-serif text-[#1C1C1B] mb-3">Payment Successful</h1>
        <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed mb-6">
          Thank you for choosing Two Threads Studio. Your handcrafted pieces are now being
          prepared by our artisans with care and intention.
        </p>

        {orderNumber && (
          <div className="bg-[#FAF9F7] border border-[#E5E0D8] px-6 py-3 mb-6">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#6B6B6B] font-sans mb-1">
              Order Reference
            </p>
            <p className="text-base font-mono text-[#A34A38] font-semibold">{orderNumber}</p>
          </div>
        )}

        <p className="text-xs text-[#6B6B6B] font-sans mb-6">
          A confirmation email with your invoice has been sent to your registered email address.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/account"
            className="block w-full bg-[#1C1C1B] text-white text-center py-3 text-[10px] tracking-[0.2em] uppercase font-sans hover:bg-[#A34A38] transition-colors duration-300"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="block w-full border border-[#1C1C1B] text-[#1C1C1B] text-center py-3 text-[10px] tracking-[0.2em] uppercase font-sans hover:bg-[#1C1C1B] hover:text-white transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-[10px] text-[#aaa] font-sans mt-6">
          Redirecting to your account in 10 seconds…
        </p>
      </motion.div>
    </div>
  );
}
