'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import { cn } from '@rahat-ui/shadcn/src';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

type IProps = {
  transformedData:
    | {
        value: string;
        label: string;
      }[];
  title: string;
  handleSelect: (key: string, value: string) => void;
};
export default function SearchDropdownComponent({
  transformedData,
  title,
  handleSelect,
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
          className="w-[200px] justify-between mx-1 text-gray-400 rounded-sm"
        >
          {value
            ? transformedData.find((d) => d.value === value)?.label
            : `Select ${title}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 rounded-sm">
        <Command className="scrollbar-hidden">
          <CommandInput placeholder="--Select Field--" />
          <ScrollArea className="max-h-[160px] scrollbar-hidden">
            <CommandEmpty>No field found.</CommandEmpty>
            <CommandList className="scrollbar-hidden">
              <CommandGroup className="scrollbar-hidden">
                {transformedData.map((d) => (
                  <CommandItem
                    key={d.value}
                    value={d.value}
                    onSelect={onSelect}
                  >
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
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
