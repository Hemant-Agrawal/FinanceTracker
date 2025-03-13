import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const loading = () => {
  return <Skeleton className="h-[200px] w-full rounded-lg" />;
};

export default loading;
