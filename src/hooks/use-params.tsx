'use client';
import { useRouter, useSearchParams } from 'next/navigation';

// Using a custom hook for URL parameter management
export const useSearchParamsManager = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = (params: Record<string, string | string[] | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values by deleting existing params and adding each value
        newSearchParams.delete(key);
        value.forEach(val => {
          newSearchParams.append(key, val);
        });
      } else if (!value) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    router.push(`?${newSearchParams.toString()}`);
  };


  return { updateSearchParams, searchParams };
};
