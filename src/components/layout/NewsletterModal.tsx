import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NewsletterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Check if the user has already interacted with the newsletter prompt
    const hasPrompted = localStorage.getItem('tt_newsletter_prompted');
    if (!hasPrompted) {
      // Delay the modal slightly for a better user experience (e.g. 3 seconds)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('tt_newsletter_prompted', 'true');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    localStorage.setItem('tt_newsletter_prompted', 'true');
    // Keep open for a second to show success, then close
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-[#2d2520]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#faf6f0] border border-[#d4c4b5] shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-10 bg-transparent border-none cursor-pointer p-1 text-[#2d2520] hover:opacity-60 transition-opacity"
              aria-label="Close modal"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Side: Brand Image/Vibe */}
            <div className="hidden md:block w-1/2 relative bg-[#eae4db] min-h-[380px]">
              <img
                src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80"
                alt="Artisan Embroidery Handcraft"
                className="w-full h-full object-cover mix-blend-multiply opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d2520]/40 to-transparent flex flex-col justify-end p-8 text-white">
                <p className="font-serif text-sm italic mb-1">“Thread by thread, story by story.”</p>
                <p className="font-sans text-[10px] tracking-widest uppercase">TwoThreads Studio</p>
              </div>
            </div>

            {/* Right Side: content / form */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-12 h-12 bg-[#e8f4e8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" fill="none" stroke="#3a6b3a" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl text-primary-container mb-2">Welcome to the Guild</h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Thank you for joining. Our artisan updates and exclusive patterns will arrive in your inbox.
                  </p>
                </motion.div>
              ) : (
                <div>
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-on-surface-variant block mb-3">Artisan Updates</span>
                  <h3 className="font-serif text-3xl font-light text-[#2d2520] mb-4">Join Our Community</h3>
                  <p className="font-sans text-xs text-[#5a4a3f] leading-relaxed mb-6">
                    Subscribe for seasonal botanical patterns, stories of local artisans, and premium embroidery masterclasses.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      required
                      placeholder="your.email@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-3 border border-[#d4c4b5] focus:border-[#2d2520] focus:outline-none bg-white font-sans text-xs"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#2d2520] text-[#faf6f0] py-3.5 font-sans text-[11px] tracking-[0.2em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors border-none"
                    >
                      Subscribe
                    </button>
                  </form>

                  <button
                    onClick={handleDismiss}
                    className="w-full text-center font-sans text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-[#2d2520] transition-colors bg-transparent border-none mt-4 cursor-pointer underline"
                  >
                    No thanks, maybe later
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
