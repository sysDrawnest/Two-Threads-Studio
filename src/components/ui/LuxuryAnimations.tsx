import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Custom easing for a premium physical dampener feel
const luxuryEase = [0.16, 1, 0.3, 1];

// 1. Weightless Staggered Text Reveal
interface StaggeredTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export const StaggeredTextReveal: React.FC<StaggeredTextRevealProps> = ({ text, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // Split text into words for stagger effect
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: luxuryEase,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// 2. Slow Luxury Parallax Image Scaling
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className = "" }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Scale from 1.1 down to 1.0
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  // Move downwards at fractional speed 0.1
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ scale, y }}
        className="w-full h-full object-cover absolute inset-0 transform-origin-center"
      />
    </div>
  );
};

// 3. Minimalist Magnetic CTA Hover
interface MagneticCTAProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const MagneticCTA: React.FC<MagneticCTAProps> = ({ href, onClick, children, className = "" }) => {
  const baseClasses = `
    relative inline-flex flex-col items-center justify-center 
    text-primary-container tracking-[0.2em] uppercase text-xs 
    font-sans cursor-pointer group no-underline
    ${className}
  `;

  const content = (
    <>
      <span className="transition-colors duration-500 ease-in-out group-hover:text-[#1C1612]">
        {children}
      </span>
      <span 
        className="w-full h-[1px] bg-[#C9A84C] mt-1 transition-transform duration-500 ease-in-out group-hover:translate-y-[4px]" 
      />
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} bg-transparent border-none`}>
      {content}
    </button>
  );
};
