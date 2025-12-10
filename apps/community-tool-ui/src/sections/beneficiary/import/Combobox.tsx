'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CommandList } from 'cmdk';
import { humanizeString } from 'apps/community-tool-ui/src/utils';
import { get } from 'lodash';

export const EMPTY_SELECTION = 'No Selection';

export function ComboBox({
  data,
  handleTargetFieldChange,
  column,
  selectedField,
  aiSuggestions,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  console.log(column, 'ComboBox Column');

  const handleClearSelection = () => {
    handleTargetFieldChange(EMPTY_SELECTION, value);
    setValue('');
  };

  React.useEffect(() => {
    if (selectedField) {
      setValue(selectedField);
    }
  }, [selectedField]);

  //  format of data with ai suggestion : [{ sourceField, targetField, other_similar: [{label, overall_score}] }]
  const aiSuggestedFields: string[] = [];
  console.log('AI Suggestions in ComboBox:', aiSuggestions);
  console.log('Current Column:', column);

  if (aiSuggestions && Array.isArray(aiSuggestions)) {
    // Find the mapping for current column
    const currentMapping = aiSuggestions.find(
      (m: any) => m.sourceField === column,
    );

    if (currentMapping) {
      // Add the main predicted field (targetField) - this is the AI's primary suggestion
      if (currentMapping.targetField) {
        aiSuggestedFields.push(currentMapping.targetField);
      }

      // Add other_similar fields - these are alternative AI suggestions
      if (Array.isArray(currentMapping.other_similar)) {
        currentMapping.other_similar.forEach((similar: any) => {
          if (similar.label) {
            aiSuggestedFields.push(similar.label);
          }
        });
      }
    } else {
      const getExtraField = aiSuggestions.find(
        (m: any) => m.sourceField === 'extras',
      );

      if (getExtraField) {
        if (getExtraField.targetField) {
          aiSuggestedFields.push(getExtraField.targetField);
        }
      }
    }
  }

  const uniqueAiSuggestions = aiSuggestedFields.filter(
    (suggestion) => !data.includes(suggestion),
  );

  const aiSet = new Set(aiSuggestedFields);

  const comboBoxData = [...uniqueAiSuggestions, ...data];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value ? humanizeString(value) : '--Select Field--'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        {value && (
          <button onClick={handleClearSelection}>
            <span className="p-2 text-slate-400 text-xs">Clear Selection</span>
          </button>
        )}
        <Command>
          <CommandInput placeholder="--Select Field--" />
          <ScrollArea className="h-[200px]">
            <CommandEmpty>No field found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {comboBoxData.map((d: string, idx: number) => (
                  <CommandItem
                    key={d}
                    value={humanizeString(d)}
                    onSelect={(currentValue) => {
                      const formatted = currentValue
                        .toLowerCase()
                        .replace(/ /g, '_');
                      setValue(formatted === value ? '' : formatted);
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
                    {humanizeString(d)}
                    {aiSet.has(d) && (
                      <span className="ml-2 text-yellow-600 text-xs">
                        AI suggested
                      </span>
                    )}
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
