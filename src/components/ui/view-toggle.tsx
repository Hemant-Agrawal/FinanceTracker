'use client';

import { Grid3X3, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { useRouter, useSearchParams } from 'next/navigation';

export function ViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isListView = searchParams.get('view') !== 'grid';

  const onToggle = (isListView: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (!isListView) {
      newSearchParams.set('view', 'grid');
    } else {
      newSearchParams.delete('view');
    }
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center border rounded-md">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={!isListView ? 'default' : 'ghost'}
              className="h-8 rounded-r-none"
              onClick={() => onToggle(false)}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Grid</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Grid view</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isListView ? 'default' : 'ghost'}
              className="h-8 rounded-l-none"
              onClick={() => onToggle(true)}
            >
              <List className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Table</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Table view</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
