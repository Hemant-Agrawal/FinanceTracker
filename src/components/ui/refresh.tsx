'use client';
import React from 'react';
import { TooltipContent, Tooltip, TooltipProvider, TooltipTrigger } from './tooltip';
import { RefreshCw } from 'lucide-react';
import { Button } from './button';
import { useRouter } from 'next/navigation';

const Refresh = () => {
  const router = useRouter();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => router.refresh()}>
            <RefreshCw className="sm:mr-2 h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Refresh</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refresh</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Refresh;
