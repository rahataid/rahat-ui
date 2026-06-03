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

const startOfDayMs = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

type DatePickerType = {
  placeholder: string;
  type: string;
  handleDateChange: (date: DateRange | undefined) => void;
  className?: string;
  handleClearDate: VoidFunction;
  onIncompleteRange?: () => void;
  onInvalidRange?: () => void;
};

export function DateRangePicker({
  placeholder,
  handleDateChange,
  type,
  handleClearDate,
  onIncompleteRange,
  onInvalidRange,
  className,
}: DatePickerType) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  // The first-clicked day, held while we wait for the second click. We track it
  // ourselves instead of relying on react-day-picker's reordering so we can
  // detect when the user's second click lands before the anchor.
  const [anchor, setAnchor] = React.useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => {
    handleClearDate();
    setDate({ from: undefined, to: undefined });
    setAnchor(undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && date?.from && !date?.to) {
      onIncompleteRange?.();
    }
    setIsOpen(open);
  };

  const handlePopoverClose = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from && selectedRange?.to) {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
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
              // Nothing selected (e.g. clicked to deselect everything).
              if (!selectedRange?.from) {
                setAnchor(undefined);
                setDate(undefined);
                handleDateChange(undefined);
                return;
              }

              // We have a pending anchor → this is the SECOND click completing
              // the range. react-day-picker always orders the earlier date into
              // `from`, so if `from` is now before the anchor the user clicked a
              // day earlier than their first pick → reject as an invalid range.
              if (anchor && !date?.to) {
                if (startOfDayMs(selectedRange.from) < startOfDayMs(anchor)) {
                  onInvalidRange?.();
                  return; // keep anchor highlighted so the user can retry
                }

                setAnchor(undefined);
                setDate(selectedRange);
                handleDateChange(selectedRange);
                handlePopoverClose(selectedRange);
                return;
              }

              // Otherwise this is a fresh FIRST click: start a new range and wait
              // for the second pick. Don't propagate an incomplete range upward.
              setAnchor(selectedRange.from);
              setDate({ from: selectedRange.from, to: undefined });
            }}
            disabled={{ after: new Date() }}
            defaultMonth={date?.from}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
