import React from 'react';
import { cn } from './AdminBadge';

interface AdminSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AdminSkeleton: React.FC<AdminSkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-outline-variant/30', className)}
      {...props}
    />
  );
};

export const AdminTableSkeleton = ({ columns = 5, rows = 5 }: { columns?: number; rows?: number }) => {
  return (
    <div className="w-full overflow-auto rounded-md border border-outline-variant bg-surface-container/30">
      <table className="w-full text-sm">
        <thead className="border-b border-outline-variant">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="h-10 px-4 text-left align-middle">
                <AdminSkeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-outline-variant">
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c} className="p-4 align-middle">
                  <AdminSkeleton className="h-4 w-full max-w-[120px]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
