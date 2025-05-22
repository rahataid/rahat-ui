'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { DateRange } from 'react-day-picker';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { TooltipContent } from '@rahat-ui/shadcn/src/components/ui/tooltip';

type DatePickerType = {
  placeholder: string;
  // selectedDate: DateRange | undefined;
  type: string;
  handleDateChange: (date: DateRange | undefined) => void;
  className?: string;
  handleClearDate: VoidFunction;
};

export function DateRangePicker({
  placeholder,
  handleDateChange,
  type,
  handleClearDate,
  className,
}: DatePickerType) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => {
    handleClearDate();
    setDate({
      from: undefined,
      to: undefined,
    });
  };
  const handlePopoverClose = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from && selectedRange?.to) {
      setIsOpen(false); // This ensures the popover closes immediately after selection
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date?.from && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  <div className="flex justify-between items-center w-full">
                    <p className="flex-1">
                      {format(date.from, 'PPP')} - {format(date.to, 'PPP')}
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            onClick={handleClose}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-muted-foreground text-white hover:bg-primary"
                            variant="outline"
                            size="icon"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Clear Date</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <p className="flex-1">{format(date.from, 'PPP')}</p>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={handleClose}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-muted-foreground text-white hover:bg-primary"
                          variant="outline"
                          size="icon"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear Date</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={date}
            onSelect={(selectedRange) => {
              handleDateChange(selectedRange);
              setDate(selectedRange);
              handlePopoverClose(selectedRange);
            }}
            defaultMonth={date?.from}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
