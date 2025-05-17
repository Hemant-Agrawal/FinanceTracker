'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParamsManager } from '@/hooks/use-params';
import { SyncModal } from '@/components/investments/sync-modal';

const Filter = () => {
  const { updateSearchParams, searchParams } = useSearchParamsManager();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Select
        defaultValue={searchParams.get('period') || 'week'}
        onValueChange={value => updateSearchParams({ period: value })}
      >
        <SelectTrigger className="w-[120px] md:w-[180px]">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="6months">Last 6 Months</SelectItem>
          <SelectItem value="year">Last Year</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-8 gap-1">
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
        <RefreshCw className="h-4 w-4" />
        <span className="sr-only">Refresh</span>
      </Button>
      <SyncModal open={open} onOpenChange={setOpen} />
    </>
  );
};

export default Filter;
