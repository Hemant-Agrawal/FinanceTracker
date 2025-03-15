// components/DataTable.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  label: string;
  hideBreakpoint?: 'sm' | 'md' | 'lg';
  render?: (row: T) => React.ReactNode;
  className?: string;
  sort?: boolean;
}

interface Action<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
  className?: string;
}

interface DataTableProps<T> {
  hideBorder?: boolean;
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  selectedRows?: string[];
  getRowId?: (row: T) => string; // Unique row identifier function
  onSelectRow?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  hideBorder = false,
  columns,
  data,
  selectedRows = [],
  actions = [],
  getRowId = (row: T) => (row as unknown as { _id: string })._id,
  onSelectRow,
  onSelectAll,
  onRowClick,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedRows.length === data.length;

  const allActions = [
    ...actions,
  ];
  if (onRowClick) {
    allActions.unshift({
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: T) => onRowClick?.(row),
    });
  }

  return (
    <Table hideBorder={hideBorder}>
      <TableHeader>
        <TableRow>
          {onSelectRow && (
            <TableHead className="w-[50px]">
              <Checkbox checked={allSelected} onCheckedChange={onSelectAll} aria-label="Select all rows" />
            </TableHead>
          )}
          {columns.map(col => (
            <TableHead
              key={col.key as string}
              className={cn(col.className, col.hideBreakpoint ? `hidden ${col.hideBreakpoint}:table-cell` : '')}
              sort={col.sort ? (col.key as string) : undefined}
            >
              {col.label}
            </TableHead>
          ))}
          {allActions.length > 0 && <TableHead className="w-[50px]">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length + (onSelectRow ? 2 : 1)} className="h-24 text-center">
              No data found.
            </TableCell>
          </TableRow>
        ) : (
          data.map(row => (
            <TableRow
              key={getRowId(row)}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick?.(row)}
            >
              {onSelectRow && (
                <TableCell className="pr-4" onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedRows.includes(getRowId(row))}
                    onCheckedChange={checked => onSelectRow(getRowId(row), checked === true)}
                    aria-label="Select row"
                  />
                </TableCell>
              )}
              {columns.map(col => (
                <TableCell
                  key={col.key as string}
                  className={cn(col.className, col.hideBreakpoint ? `hidden ${col.hideBreakpoint}:table-cell` : '')}
                >
                  {col.render ? col.render(row) : (row[col.key] as string)}
                </TableCell>
              ))}
              {allActions.length > 0 && (
                <TableCell className="p-2 text-center" onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {allActions.map(action => (
                        <DropdownMenuItem className={action.className}  key={action.label} onClick={() => action.onClick(row)}>
                          {action.icon}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
