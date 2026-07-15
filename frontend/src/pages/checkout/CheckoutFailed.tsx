import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CheckoutFailed() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-white border border-[#E5E0D8] p-10 text-center"
      >
        {/* Failure icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#FDE8E4] flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#A34A38" strokeWidth={2.5} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>

        <p className="text-[9px] tracking-[0.25em] uppercase text-[#A34A38] font-sans mb-2">
          Payment Failed
        </p>
        <h1 className="text-2xl font-serif text-[#1C1C1B] mb-3">
          We Could Not Process Your Payment
        </h1>
        <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed mb-6">
          No amount has been deducted from your account. Your cart has been preserved.
          Please try again or use a different payment method.
        </p>

        {orderNumber && (
          <div className="bg-[#FAF9F7] border border-[#E5E0D8] px-6 py-3 mb-6">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#6B6B6B] font-sans mb-1">
              Order Reference
            </p>
            <p className="text-base font-mono text-[#1C1C1B]">{orderNumber}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="block w-full bg-[#A34A38] text-white text-center py-3 text-[10px] tracking-[0.2em] uppercase font-sans hover:bg-[#8C3D2E] transition-colors duration-300"
          >
            Retry Payment
          </Link>
          <Link
            to="/account"
            className="block w-full border border-[#1C1C1B] text-[#1C1C1B] text-center py-3 text-[10px] tracking-[0.2em] uppercase font-sans hover:bg-[#1C1C1B] hover:text-white transition-colors duration-300"
          >
            View My Orders
          </Link>
        </div>

        <p className="text-xs text-[#6B6B6B] font-sans mt-6">
          If the issue persists, contact us at{' '}
          <a href="mailto:support@twothreadsstudio.com" className="text-[#A34A38] underline">
            support@twothreadsstudio.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}
