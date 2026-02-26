'use client';

import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { FormControl } from '@rahat-ui/shadcn/src/components/ui/form';
import { useState } from 'react';

export type DropdownOption = {
  label: string;
  value: string;
  data: Record<string, any>;
};

interface DropdownSearchProps {
  options: DropdownOption[];
  selectedLabel?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  onSelect: (data: Record<string, any>) => void;
}

const DropdownSearch = (props: DropdownSearchProps) => {
  // Props goes here
  const {
    onSelect,
    options,
    emptyMessage,
    isLoading,
    placeholder,
    searchPlaceholder,
    selectedLabel,
  } = props;

  // State goes here
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-between font-normal',
              !selectedLabel && 'text-muted-foreground',
            )}
          >
            {selectedLabel || placeholder}
            <ChevronDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => {
                        onSelect(opt.data);
                        setOpen(false);
                      }}
                    >
                      {opt.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          selectedLabel === opt.label
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownSearch;
