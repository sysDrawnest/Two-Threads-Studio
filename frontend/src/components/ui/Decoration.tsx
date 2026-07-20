import React from 'react';
import { motion } from 'framer-motion';
import { DECORATION_PATHS, DecorationVariant } from './DecorationPaths';

export type DecorationColorTheme = 'warm-linen' | 'soft-gold' | 'deep-bronze' | 'light-sand';

const THEME_COLORS: Record<DecorationColorTheme, string> = {
  'warm-linen': '#E6D8C5',
  'soft-gold': '#C8A97E',
  'deep-bronze': '#A8844A',
  'light-sand': '#EADECF',
};

export type DecorationPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'absolute' | 'relative' | 'inline';

interface DecorationProps {
  variant: DecorationVariant;
  colorTheme?: DecorationColorTheme;
  strokeWidth?: number;
  opacity?: number;
  animate?: 'draw' | 'none';
  position?: DecorationPosition;
  rotate?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Decoration({
  variant,
  colorTheme = 'soft-gold',
  strokeWidth = 1.5,
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

  const getPositionStyles = (): React.CSSProperties => {
    if (position === 'relative') return { position: 'relative' };
    if (position === 'inline') return { position: 'relative', display: 'inline-block' };

    return {
      position: 'absolute',
      ...(position === 'top-left' ? { top: 0, left: 0 } : {}),
      ...(position === 'top-right' ? { top: 0, right: 0 } : {}),
      ...(position === 'bottom-left' ? { bottom: 0, left: 0 } : {}),
      ...(position === 'bottom-right' ? { bottom: 0, right: 0 } : {}),
      ...(position === 'center' ? { top: '50%', left: '50%' } : {}),
    };
  };

  const positionStyles = getPositionStyles();

  const transformParts = [];
  if (position === 'center') transformParts.push('translate(-50%, -50%)');
  if (rotate !== 0) transformParts.push(`rotate(${rotate}deg)`);
  if (scale !== 1) transformParts.push(`scale(${scale})`);
  const transformString = transformParts.join(' ');

  return (
    <div 
      className={`pointer-events-none z-0 ${className}`}
      style={{
        ...positionStyles,
        opacity,
        ...(transformString ? { transform: transformString } : {}),
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
        className="w-full h-full overflow-visible"
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
                viewport={{ once: true }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.1 }}
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

