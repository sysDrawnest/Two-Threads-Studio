import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(onComplete, 3000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-all duration-800 ease-in-out ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Needle SVG icon */}
      <div
        className={`transition-all duration-800 delay-100 ease-in-out mb-5 ${
          phase === "enter" ? "opacity-0 translate-y-2.5" : "opacity-100 translate-y-0"
        }`}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="#8b6f5c" strokeWidth="1.5" />
          <path d="M20 8 L20 32 M14 14 L20 8 L26 14" stroke="#8b6f5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="28" r="2" fill="#8b6f5c" />
        </svg>
      </div>
      <div
        className={`font-serif text-[clamp(1.8rem,6vw,3.2rem)] tracking-[0.12em] text-primary-container font-light transition-all duration-800 delay-300 ease-in-out ${
          phase === "enter" ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        TwoThreads Studio
      </div>
      <div
        className={`mt-2 font-serif text-xs tracking-[0.3em] text-[#8b6f5c] uppercase transition-opacity duration-800 delay-500 ease-in-out ${
          phase === "enter" ? "opacity-0" : "opacity-100"
        }`}
      >
        Handcrafted with love
      </div>
    </div>
  );
};

export default IntroAnimation;
