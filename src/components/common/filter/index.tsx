'use client';

import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { useSearchParamsManager } from '@/hooks/use-params';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/date-range-picker';
import { FilterSidebar } from './sidebar';
import { FilterType, FilterOption } from './section';
import { convertDate, formatDate } from '@/lib/date';

interface FiltersProps {
  searchPlaceholder?: string;
  filters: {
    [label: string]: {
      key: string;
      type: FilterType;
      options: FilterOption[];
    };
  };
}

export function Filters({ filters = {}, searchPlaceholder = 'Search...' }: FiltersProps) {
  const { updateSearchParams, searchParams } = useSearchParamsManager();

  const searchTerm = searchParams.get('search') || '';
  const selectedStatuses = searchParams.getAll('status');
  const selectedCategories = searchParams.getAll('category');
  const selectedPaymentMethods = searchParams.getAll('paymentMethod');
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';

  const dateRange = start && end ? { from: convertDate(start), to: convertDate(end) } : undefined;

  const activeFilters = [
    ...selectedCategories,
    ...selectedStatuses,
    ...selectedPaymentMethods,
    searchTerm ? 1 : 0,
    dateRange ? 1 : 0,
  ].filter(Boolean).length;

  const resetFilters = () => {
    const params: Record<string, null> = {
      search: null,
      start: null,
      end: null,
    };
    Object.values(filters).forEach(filter => {
      params[filter.key] = null;
    });
    updateSearchParams(params);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      updateSearchParams({
        start: formatDate(range.from),
        end: range.to ? formatDate(range.to) : formatDate(range.from),
      });
    } else {
      updateSearchParams({
        start: null,
        end: null,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-8"
            value={searchTerm}
            onChange={e => updateSearchParams({ search: e.target.value })}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => updateSearchParams({ search: null })}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />

        <FilterSidebar filters={filters} onApplyFilters={updateSearchParams}>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">Filters</span>
            {activeFilters > 0 && (
              <Badge variant="secondary" className="ml-1 rounded-sm px-1">
                {activeFilters}
              </Badge>
            )}
          </Button>
        </FilterSidebar>
      </div>

      {/* Active filters display */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([label, filter]) => searchParams.has(filter.key) && (
            <Badge key={`${filter.key}-${filter}`} variant="secondary" className="flex items-center gap-1">
              {label}: {searchParams.getAll(filter.key).join(', ')}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => updateSearchParams({ [filter.key]: null })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {filter.type} filter</span>
              </Button>
            </Badge>
          ))}
          {dateRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {dateRange.from  ? formatDate(dateRange.from) : 'Any'}
              {dateRange.to && dateRange.from && ' - '}
              {dateRange.to ? formatDate(dateRange.to) : 'Any'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => updateSearchParams({ start: null, end: null })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove date filter</span>
              </Button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6">
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
