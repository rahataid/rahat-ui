'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { useState } from 'react';

type DatePickerType = {
  placeholder: string;
  type: string;
  handleDateChange: any;
  value?: Date;
};

export function DatePicker({
  placeholder,
  handleDateChange,
  type,
  value,
}: DatePickerType) {
  const [internalDate, setInternalDate] = useState<Date | undefined>();

  const date = value ?? internalDate;

  const handleSelect = (selectedDate?: Date) => {
    if (!selectedDate) return;

    if (!value) {
      setInternalDate(selectedDate);
    }

    handleDateChange(selectedDate, type);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left rounded-md font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
