'use client';
import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationType } from '@/models';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchParamsManager } from '@/hooks/use-params';

interface PaginationProps extends PaginationType {
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page = 1,
  totalItems = 0,
  totalPages = 1,
  itemsPerPage = 5,
  currentPageItems = 0,
  onPageChange,
}) => {
  const startItem = totalItems > 0 ? (page - 1) * itemsPerPage + 1 : 0;
  const endItem = (page - 1) * itemsPerPage + currentPageItems;
  const { updateSearchParams } = useSearchParamsManager();

  //   const handlePageSizeChange = (newSize: number) => {
  //     updateSearchParams({
  //       pageSize: newSize.toString(),
  //       page: '1', // Reset to first page when changing page size
  //     });
  //   };

  //   const increasePageSize = () => {
  //     const newSize = itemsPerPage + 5;
  //     handlePageSizeChange(newSize);
  //   };

  //   const decreasePageSize = () => {
  //     if (itemsPerPage > 5) {
  //       const newSize = itemsPerPage - 5;
  //       handlePageSizeChange(newSize);
  //     }
  //   };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
    if (onPageChange) onPageChange(newPage);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <div className="text-sm">
          Page {page} of {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
