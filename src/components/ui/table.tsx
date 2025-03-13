'use client'

import * as React from 'react';

import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useSearchParamsManager } from '@/hooks/use-params';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement> & { hideBorder?: boolean }>(
  ({ className, hideBorder = false, ...props }, ref) => (
    <div className={cn('relative w-full overflow-auto rounded-md', !hideBorder && 'border')}>
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sort?: string;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sort, onClick, ...props }, ref) => {
    const { updateSearchParams, searchParams } = useSearchParamsManager();

    const isSorting = sort === searchParams.get('sort');
    const sortOrder = searchParams.get('sortOrder');

    const handleSort: React.MouseEventHandler<HTMLTableCellElement> = (...args) => {
      if (onClick) onClick(...args);
      if (!sort) return;
      const currentSort = searchParams.get('sort');
      const currentOrder = searchParams.get('sortOrder');

      if (currentSort === sort) {
        if (currentOrder === 'asc') {
          // If already sorting by this field ascending, switch to descending
          updateSearchParams({ sort: sort as string, sortOrder: 'desc' });
        } else {
          // If already sorting by this field descending, clear the sort
          updateSearchParams({ sort: null, sortOrder: null });
        }
        return;
      }
      // If sorting by a new field, start with ascending
      updateSearchParams({ sort: sort as string, sortOrder: 'asc' });
    };

    return (
      <th
        ref={ref}
        className={cn(
          'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
          sort ? 'cursor-pointer' : '',
          className
        )}
        onClick={handleSort}
        {...props}
      >
        <div className="flex items-center">
          {children}
          {isSorting && (
            <>
              {sortOrder === 'asc' && <ArrowDown className="ml-2 h-4 w-4" />}
              {sortOrder === 'desc' && <ArrowUp className="ml-2 h-4 w-4" />}
            </>
          )}
          {sort && !isSorting && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </div>
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
