'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/components/popover';

type Props = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
};

export function DateRangePicker({ value, onChange }: Props) {
  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[250px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              'Select date range'
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={value}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
