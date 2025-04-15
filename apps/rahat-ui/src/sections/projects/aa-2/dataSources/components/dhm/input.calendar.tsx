import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

type IProps = {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export default function InputCalendar({
  selectedDate,
  setSelectedDate,
}: IProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className="w-52 pl-3 text-left font-normal">
          <span className="text-muted-foreground">
            {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date...'}
          </span>
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) =>
            date > new Date() || date < new Date('2025-01-01')
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
