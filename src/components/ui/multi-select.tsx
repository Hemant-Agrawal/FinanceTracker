'use client';

import { Input } from '@/ui/input';

import type React from 'react';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  selected: string[];
  options: MultiSelectOption[];
  onChange: (selected: string[]) => void;
  creatable?: boolean;
}

export function MultiSelect({ selected, options, onChange, creatable }: MultiSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOptionSelect = (option: MultiSelectOption) => {
    onChange([...selected, option.value]);
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(v => v !== value));
  };

  const handleCreateOption = () => {
    if (inputValue.trim() !== '') {
      onChange([...selected, inputValue.trim()]);
      setInputValue('');
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left">
          {selected.length > 0 ? (
            selected.map(value => (
              <span key={value} className="flex items-center">
                {value}
                <Button variant="ghost" size="icon" onClick={() => handleRemove(value)} className="ml-2">
                  <X className="h-4 w-4" />
                </Button>
              </span>
            ))
          ) : (
            <span>Select tags</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="overflow-auto max-h-[200px]">
          {options.map(option => (
            <Button
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              className={cn(
                'flex w-full items-center justify-between px-4 py-2 text-left text-sm',
                selected.includes(option.value) && 'font-bold'
              )}
            >
              {option.label}
              {selected.includes(option.value) && <Check className="ml-2 h-4 w-4 text-primary" />}
            </Button>
          ))}
        </div>
        {creatable && (
          <div className="border-t">
            <Input value={inputValue} onChange={handleInputChange} placeholder="Create new tag" className="px-4 py-2" />
            <Button onClick={handleCreateOption} className="w-full">
              Create
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
