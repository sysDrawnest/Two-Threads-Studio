import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse bg-[#e6e2dd]/60 rounded-sm ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(230, 226, 221, 0.4) 25%, rgba(222, 217, 212, 0.6) 37%, rgba(230, 226, 221, 0.4) 63%)',
        backgroundSize: '400% 100%',
        animation: 'pulse 2s ease-in-out infinite'
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-outline-variant/30 flex flex-col h-full rounded-sm overflow-hidden p-0">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};
