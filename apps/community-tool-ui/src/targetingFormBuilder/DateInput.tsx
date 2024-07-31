import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import useTargetingFormStore from './form.store';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';

export default function DateInput() {
  const { targetingQueries, setTargetingQueries } = useTargetingFormStore();

  const handleDateChange = (d: Date) => {
    const formData = { ...targetingQueries, createdAt: d };
    setTargetingQueries(formData);
  };

  return (
    <div className="w-full h-auto m-2 rounded-md shadow-md cursor-pointer bg-white">
      <FormItem className="flex flex-col">
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant={'outline'}>
                {targetingQueries?.createdAt ? (
                  format(targetingQueries.createdAt, 'PPP')
                ) : (
                  <span className="text-muted-foreground">
                    Beneficiary created date
                  </span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                targetingQueries?.createdAt ? targetingQueries.createdAt : ''
              }
              onSelect={handleDateChange}
              initialFocus
              captionLayout="dropdown"
              fromYear={new Date().getFullYear() - 150}
              toYear={new Date().getFullYear()}
              classNames={{
                caption_dropdowns: 'grid grid-cols-2',
                // dropdown_month: 'cols-span-1',
                // dropdown_year: 'cols-span-1',
                vhidden: 'hidden',
                dropdown_icon: 'hidden',
                caption_label: 'hidden',
              }}
            />
          </PopoverContent>
        </Popover>
      </FormItem>
    </div>
  );
}
