import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const loading = () => {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
};

export default loading;
