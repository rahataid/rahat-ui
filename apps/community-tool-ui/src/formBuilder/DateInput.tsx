import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import { FormControl, FormItem } from '@rahat-ui/shadcn/src/components/ui/form';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { formatDate, humanizeString } from '../utils';
import useFormStore from './form.store';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function DateInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();

  const handleInputChange = (d: any) => {
    const formattedDate = formatDate(d); // YYYY-MM-DD
    let item = {} as any;
    item[formField.name] = formattedDate;
    const formData = { ...extras, ...item };
    setExtras(formData);
  };

  const defaultData = extras[formField.name] || '';

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Label>{humanizeString(formField.name)}</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formField.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <FormItem className="flex flex-col">
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant={'outline'}>
                {defaultData ? (
                  format(defaultData, 'PPP')
                ) : (
                  <span>Select Date</span>
                )}{' '}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={defaultData}
              onSelect={handleInputChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </FormItem>{' '}
    </div>
  );
}
