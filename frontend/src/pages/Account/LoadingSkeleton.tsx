import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse space-y-8 py-4">
      {/* Editorial Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-zinc-200 w-1/3"></div>
        <div className="h-4 bg-zinc-150 w-2/3"></div>
      </div>
      
      <hr className="border-zinc-200" />
      
      {/* Body Rows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-4 bg-zinc-200 w-full"></div>
          <div className="h-4 bg-zinc-200 w-5/6"></div>
          <div className="h-4 bg-zinc-200 w-4/5"></div>
        </div>
        <div className="space-y-4 bg-zinc-50 p-6 border border-zinc-200">
          <div className="h-20 bg-zinc-200 w-full"></div>
          <div className="h-4 bg-zinc-200 w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
