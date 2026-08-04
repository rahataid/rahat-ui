'use client';

import { X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  CommandGroup,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Command, Command as CommandPrimitive } from 'cmdk';
import useTargetingFormStore from './form.store';

type ISelectOption = Record<'value' | 'label', string>;

type MultiSelectProps = {
  options: ISelectOption[];
  placeholder: string;
  fieldName: string;
  fieldType?: string;
};

export function MultiSelect({
  fieldName,
  options,
  placeholder = '--Select Options--',
  fieldType,
}: MultiSelectProps) {
  const { targetingQueries, setTargetingQueries }: any =
    useTargetingFormStore();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ISelectOption[]>([]);

  const sanitizeAndSetTargetingQuery = React.useCallback(
    (data: ISelectOption[]) => {
      const itemValues = data.map((item) => item.value);
      const fieldKeyValue = { [fieldName]: itemValues.join(',') };
      const formData = { ...targetingQueries, ...fieldKeyValue };
      setTargetingQueries(formData);
    },
    [fieldName, targetingQueries, setTargetingQueries],
  );

  const handleUnselect = (item: ISelectOption) => {
    const filtered = selected.filter((s) => s.value !== item.value);
    setSelected(filtered);
    sanitizeAndSetTargetingQuery(filtered);
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              sanitizeAndSetTargetingQuery(newSelected);
              return newSelected;
            });
          }
        }
        if (e.key === 'Escape') {
          input.blur();
        }
        if (e.key === 'Enter' && fieldType === 'TEXT' && input.value.trim()) {
          e.preventDefault();
          const value = input.value.trim();
          const newItem: ISelectOption = { value, label: value };
          const merged = [...selected, newItem];
          setSelected(merged);
          sanitizeAndSetTargetingQuery(merged);
          input.value = '';
        }
      }
    },
    [fieldType, selected, sanitizeAndSetTargetingQuery],
  );

  const handleSelectChange = (item: ISelectOption) => {
    const merged = [...selected, item];
    setSelected(merged);
    sanitizeAndSetTargetingQuery(merged);
  };

  const selectables = options.filter((item) => !selected.includes(item));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full h-auto m-2 p-3 group border border-input  text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 shadow-md cursor-pointer bg-white">
          <div className="flex gap-1 flex-wrap">
            {selected.map((item) => {
              return (
                <Badge key={item.value} variant="secondary">
                  {item.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
          </div>
          <p className="text-muted-foreground flex-1">{placeholder}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="mt-4 pr-2" side="bottom" align="center">
        <Command
          onKeyDown={handleKeyDown}
          className="overflow-visible bg-transparent"
        >
          <CommandList>
            <CommandPrimitive.Input
              ref={inputRef}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            />

            <CommandGroup>
              {selectables.map((item) => {
                return (
                  <CommandItem
                    key={item.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => handleSelectChange(item)}
                    className={'cursor-pointer'}
                  >
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
