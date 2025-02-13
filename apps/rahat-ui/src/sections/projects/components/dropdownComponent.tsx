'use client';

import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

type IProps = {
  transformedData:
    | {
        value: string;
        label: string;
      }[];
  title: string;
  handleSelect: (key: string, value: string) => void;
  current?: number | string;
  className?: string;
};
export default function DropdownComponent({
  transformedData,
  title,
  handleSelect,
  current,
  className = 'w-[200px]',
}: IProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');

  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? '' : currentValue);
    setOpen(false);
    handleSelect(title, currentValue);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${className} justify-between mx-1 text-gray-400`}
        >
          {value
            ? transformedData.find((d) => d.value === value)?.label
            : ` ${current}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${className} h-[200px]`}>
        <Command>
          <CommandEmpty>No field found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {transformedData.map((d) => (
                <CommandItem key={d.value} value={d.value} onSelect={onSelect}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === d.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {d.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
