import React from 'react';
import { cn } from './AdminBadge'; // Reuse cn utility

interface AdminTableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const AdminTable = React.forwardRef<HTMLTableElement, AdminTableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto rounded-md border border-outline-variant bg-surface-container/30">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
);
AdminTable.displayName = 'AdminTable';

export const AdminTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b border-outline-variant', className)} {...props} />
));
AdminTableHeader.displayName = 'AdminTableHeader';

export const AdminTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
AdminTableBody.displayName = 'AdminTableBody';

export const AdminTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-outline-variant transition-colors hover:bg-surface-container/50 data-[state=selected]:bg-surface-container',
      className
    )}
    {...props}
  />
));
AdminTableRow.displayName = 'AdminTableRow';

export const AdminTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle font-sans text-xs font-semibold uppercase tracking-wider text-on-secondary-container [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
AdminTableHead.displayName = 'AdminTableHead';

export const AdminTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0 font-sans text-primary-container', className)}
    {...props}
  />
));
AdminTableCell.displayName = 'AdminTableCell';
