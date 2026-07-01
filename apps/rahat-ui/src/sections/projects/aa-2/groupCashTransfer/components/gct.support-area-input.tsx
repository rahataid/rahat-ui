'use client';

import { useState } from 'react';
import { Tag, TagInput } from 'emblor';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

export const TAG_STYLE = {
  inlineTagsContainer:
    'border-input rounded shadow-xs p-1 gap-1 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500',
  input: 'w-full rounded-sm min-w-[80px] shadow-none px-2 h-7',
  tag: {
    body: 'h-7 relative rounded-sm border border-input font-medium text-xs ps-2 pe-7',
    closeButton:
      'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-muted-foreground/80 hover:text-foreground',
  },
};

interface GctSupportAreaInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  initialTags?: Tag[];
  shouldDirty?: boolean;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
}

export default function GctSupportAreaInput({
  form,
  initialTags,
  shouldDirty = false,
  onUnsavedChange,
}: GctSupportAreaInputProps) {
  const [tags, setTags] = useState<Tag[]>(
    initialTags ?? form.getValues('supportArea') ?? [],
  );
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [unsaved, setUnsaved] = useState('');

  const updateUnsaved = (val: string) => {
    setUnsaved(val);
    onUnsavedChange?.(val.trim() !== '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (unsaved.trim()) {
        const newTag: Tag = { id: Date.now().toString(), text: unsaved.trim() };
        const updated = [...tags, newTag];
        setTags(updated);
        form.setValue(
          'supportArea',
          updated,
          shouldDirty ? { shouldDirty: true } : undefined,
        );
        updateUnsaved('');
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="supportArea"
      render={({ field }) => (
        <FormItem>
          <Label>Support Area (Optional)</Label>
          <FormControl>
            <>
              <TagInput
                {...field}
                tags={tags}
                setTags={(newTags) => {
                  setTags(newTags);
                  form.setValue(
                    'supportArea',
                    newTags as [Tag, ...Tag[]],
                    shouldDirty ? { shouldDirty: true } : undefined,
                  );
                }}
                placeholder="Enter value and press ENTER"
                className="min-h-[23px]"
                styleClasses={TAG_STYLE}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
                inputProps={{
                  value: unsaved,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    updateUnsaved(e.target.value),
                  onKeyDown: handleKeyDown,
                }}
              />
              {unsaved && (
                <span className="text-xs text-muted-foreground ml-1">
                  Press Enter to add.
                </span>
              )}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
