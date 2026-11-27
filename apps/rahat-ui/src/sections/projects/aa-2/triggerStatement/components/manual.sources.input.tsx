'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { Tag, TagInput } from 'emblor';
import { cn } from '@rahat-ui/shadcn/src';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { TAG_STYLE } from '../../groupCashTransfer/components/gct.support-area-input';

type IProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  className?: string;
};

// Keeps the form value as a plain string[] (the API shape); TagInput's
// {id, text} objects only exist inside this component.
const toTags = (values?: string[]): Tag[] =>
  (values || []).map((text) => ({ id: text, text }));

export default function ManualSourcesInput({ form, className }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  return (
    <FormField
      control={form.control}
      name="manualSources"
      render={({ field, fieldState }) => {
        const values: string[] = field.value || [];
        const isFilled = values.length > 0;
        const hasError = !!fieldState?.error;

        const addDraft = () => {
          const text = draft.trim();
          const isDuplicate = values.some(
            (v) => v.toLowerCase() === text.toLowerCase(),
          );
          if (text && !isDuplicate) field.onChange([...values, text]);
          setDraft('');
        };

        const inlineContainerClasses = cn(
          TAG_STYLE.inlineTagsContainer,
          isFilled && !hasError && 'shadow-[inset_4px_0_0_0_hsl(var(--primary))] bg-blue-50',
          hasError &&
            'shadow-[inset_4px_0_0_0_hsl(var(--destructive))] bg-red-50 border-destructive focus-within:ring-destructive',
        );

        return (
          <FormItem className={className}>
            <FormLabel>{t('MANUAL_SOURCES')}</FormLabel>
            <FormControl>
              <TagInput
                tags={toTags(values)}
                setTags={(next) => {
                  const resolved =
                    typeof next === 'function' ? next(toTags(values)) : next;
                  field.onChange(resolved.map((tag) => tag.text));
                }}
                placeholder={t('MANUAL_SOURCES_PLACEHOLDER')}
                className="min-h-[23px]"
                styleClasses={{
                  ...TAG_STYLE,
                  inlineTagsContainer: inlineContainerClasses,
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
                inputProps={{
                  value: draft,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setDraft(e.target.value),
                  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      // Stop the surrounding <form> from submitting.
                      e.preventDefault();
                      addDraft();
                    }
                  },
                  // Keep typed text that wasn't confirmed with Enter, e.g.
                  // when the user tabs away or clicks Save; blur fires first.
                  onBlur: () => {
                    addDraft();
                    field.onBlur();
                  },
                }}
              />
            </FormControl>
            {draft.trim() && (
              <span className="text-xs text-muted-foreground">
                {t('MANUAL_SOURCES_HINT')}
              </span>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
