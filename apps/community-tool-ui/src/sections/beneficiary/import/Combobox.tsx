'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@rahat-ui/shadcn/src/components/ui/command';
import { CommandList } from 'cmdk';
import { cn } from '@rahat-ui/shadcn/src';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export function ComboBox({
  data,
  handleTargetFieldChange,
  column,
  selectedField,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (selectedField) setValue(selectedField);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value ? data.find((d: string) => d === value) : '--Select Field--'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="--Select Field--" />
          <ScrollArea className="h-[200px]">
            <CommandEmpty>No field found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {data.map((d: string) => (
                  <CommandItem
                    key={d}
                    value={d}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      handleTargetFieldChange(column, d);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === d ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {d}
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
