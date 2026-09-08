import React from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';

type IProps = {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export default function InputCalendar({
  selectedDate,
  setSelectedDate,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDate = useDateFormat();
  const today = new Date();
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setHours(0, 0, 0, 0);
  fourteenDaysAgo.setDate(today.getDate() - 14);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className="w-52 pl-3 text-left font-normal">
          <span className="text-muted-foreground">
            {selectedDate ? formatDate(selectedDate, 'PPP') : t('PICK_A_DATE')}
          </span>
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date > today || date < fourteenDaysAgo}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
