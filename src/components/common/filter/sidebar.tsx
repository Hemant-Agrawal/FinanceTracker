'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { ScrollArea } from '@/ui/scroll-area';
import { Separator } from '@/ui/separator';
import { FilterSection, type FilterType, type FilterOption } from '@/common/filter/section';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/ui/sheet';

interface FilterSidebarProps {
  children: React.ReactNode;
  filters: {
    [label: string]: {
      key: string;
      type: FilterType;
      options: FilterOption[];
    };
  };
  onApplyFilters: (filters: any) => void;
}

export function FilterSidebar({ filters, onApplyFilters, children }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFilterChange = (filterKey: string, value: any) => {
    setSelectedFilters((prev: any) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters);
    setIsSidebarOpen(false);
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetTitle>Filters</SheetTitle>
        <ScrollArea className="flex-grow">
          {Object.entries(filters).map(([label, filter]) => (
            <React.Fragment key={label}>
              <FilterSection
                title={label}
                type={filter.type}
                options={filter.options}
                value={selectedFilters[filter.key]}
                onChange={value => handleFilterChange(filter.key, value)}
              />
              <Separator className="my-4" />
            </React.Fragment>
          ))}
        </ScrollArea>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
