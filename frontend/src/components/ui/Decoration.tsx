import React from 'react';
import { motion } from 'framer-motion';
import { DECORATION_PATHS, DecorationVariant } from './DecorationPaths';

export type DecorationColorTheme = 'warm-linen' | 'soft-gold' | 'deep-bronze' | 'light-sand';

const THEME_COLORS: Record<DecorationColorTheme, string> = {
  'warm-linen': '#E6D8C5',
  'soft-gold': '#C8A97E',
  'deep-bronze': '#A8844A',
  'light-sand': 'rgba(200,169,126,0.08)',
};

interface DecorationProps {
  variant: DecorationVariant;
  colorTheme?: DecorationColorTheme;
  strokeWidth?: number;
  opacity?: number;
  animate?: 'draw' | 'none';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'absolute' | 'relative';
  rotate?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Decoration({
  variant,
  colorTheme = 'soft-gold',
  strokeWidth = 1.2,
  opacity = 1,
  animate = 'draw',
  position = 'absolute',
  rotate = 0,
  scale = 1,
  className = '',
  style = {}
}: DecorationProps) {
  const data = DECORATION_PATHS[variant];
  if (!data) return null;

  const color = THEME_COLORS[colorTheme];

  // Helper for absolute positioning presets
  const positionStyles: React.CSSProperties = {
    position: position === 'relative' ? 'relative' : 'absolute',
    ...(position === 'top-left' ? { top: 0, left: 0 } : {}),
    ...(position === 'top-right' ? { top: 0, right: 0 } : {}),
    ...(position === 'bottom-left' ? { bottom: 0, left: 0 } : {}),
    ...(position === 'bottom-right' ? { bottom: 0, right: 0 } : {}),
    ...(position === 'center' ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : {}),
  };

  const transformString = `${position === 'center' ? 'translate(-50%, -50%) ' : ''}rotate(${rotate}deg) scale(${scale})`;

  return (
    <div 
      className={`pointer-events-none z-0 ${className}`}
      style={{
        ...positionStyles,
        opacity,
        transform: transformString,
        ...style
      }}
      aria-hidden="true"
    >
      <svg 
        viewBox={data.viewBox} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {data.paths.map((p, i) => {
          const sw = p.strokeWidth ?? strokeWidth;
          const isFilled = p.filled;

          if (animate === 'draw' && !isFilled) {
            return (
              <motion.path
                key={i}
                d={p.d}
                stroke={color}
                strokeWidth={sw}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 6, ease: "easeInOut", delay: 0.2 }}
              />
            );
          }

          // Static or Filled path
          return (
            <path
              key={i}
              d={p.d}
              stroke={isFilled ? 'none' : color}
              strokeWidth={isFilled ? 0 : sw}
              fill={isFilled ? color : 'none'}
            />
          );
        })}
      </svg>
    </div>
  );
}
