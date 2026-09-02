import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Leaf, Gift, ShieldCheck, Star } from 'lucide-react';

const trustItems = [
  { icon: <Package size={14} />, label: 'Handmade in India' },
  { icon: <Truck size={14} />, label: 'Free Shipping Above ₹2,999' },
  { icon: <Leaf size={14} />, label: 'Sustainable Materials' },
  { icon: <Gift size={14} />, label: 'Gift Ready' },
  { icon: <ShieldCheck size={14} />, label: 'Secure Checkout' },
  { icon: <Star size={14} className="fill-[#c4973a] text-[#c4973a]" />, label: '4.9★ Customer Rating' },
];

// Duplicate for seamless loop
const allItems = [...trustItems, ...trustItems];

export default function TrustBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      aria-label="Trust signals"
      className="bg-[#2d2520] border-t border-[#3d322c] border-b border-[#1a1510] overflow-hidden"
    >
      {/* Mobile — auto-scrolling marquee */}
      {isMobile ? (
        <div className="relative py-3 overflow-hidden">
          <motion.div
            className="flex gap-8 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          >
            {allItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                <span className="text-[#c4973a]">{item.icon}</span>
                <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#d2c4bc] font-medium">
                  {item.label}
                </span>
                <span className="text-[#735947] text-xs ml-4">·</span>
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        /* Desktop — static flex row */
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-3.5">
          <div className="flex items-center justify-between">
            {trustItems.map((item, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <span className="text-[#c4973a]">{item.icon}</span>
                  <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#d2c4bc] font-medium">
                    {item.label}
                  </span>
                </div>
                {i < trustItems.length - 1 && (
                  <span className="text-[#735947] text-sm">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
