'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/ui/button';
import { Calendar } from '@/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import dayjs from 'dayjs';
import { DateRange } from 'react-day-picker';

interface DateRangeInputProps {
  onChange?: (range: DateRange | undefined) => void;
  value?: DateRange | undefined;
}

export function DateRangePicker({ onChange, value }: DateRangeInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'Today', range: { from: dayjs().startOf('day').toDate(), to: dayjs().endOf('day').toDate() } },
    {
      label: 'Yesterday',
      range: {
        from: dayjs().subtract(1, 'day').startOf('day').toDate(),
        to: dayjs().subtract(1, 'day').endOf('day').toDate(),
      },
    },
    { label: 'This Week', range: { from: dayjs().startOf('week').toDate(), to: dayjs().endOf('week').toDate() } },
    {
      label: 'Last Week',
      range: {
        from: dayjs().subtract(1, 'week').startOf('week').toDate(),
        to: dayjs().subtract(1, 'week').endOf('week').toDate(),
      },
    },
    { label: 'This Month', range: { from: dayjs().startOf('month').toDate(), to: dayjs().endOf('month').toDate() } },
    {
      label: 'Last Month',
      range: {
        from: dayjs().subtract(1, 'month').startOf('month').toDate(),
        to: dayjs().subtract(1, 'month').endOf('month').toDate(),
      },
    },
  ];

  const handlePresetClick = (preset: { from: Date; to: Date }) => {
    onChange?.(preset);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="max-w-[300px] w-auto justify-start text-left font-normal">
          <CalendarIcon className="md:mr-2 h-4 w-4" />
          <div className="hidden md:flex">
            {value?.from ? (
              value.to ? (
                <>
                  {dayjs(value.from).format('MMM D, YYYY')} - {dayjs(value.to).format('MMM D, YYYY')}
                </>
              ) : (
                dayjs(value.from).format('MMM D, YYYY')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <div className="flex">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            // modifiers={{
            //   today: new Date(),
            // }}
            // modifiersStyles={{
            //   today: {
            //     fontWeight: 'bold',
            //     color: 'var(--primary)',
            //   },
            // }}
          />
          <div className="border-l p-1 space-y-1 w-auto max-w-min">
            {presets.map(preset => (
              <Button
                key={preset.label}
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => handlePresetClick(preset.range)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
