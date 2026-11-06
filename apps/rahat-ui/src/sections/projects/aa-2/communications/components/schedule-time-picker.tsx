'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';

type ScheduleTimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function ScheduleTimePicker({
  value,
  onChange,
  disabled = false,
  className,
  id,
}: ScheduleTimePickerProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDate = useDateFormat();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disabled) return;
    try {
      inputRef.current?.showPicker?.();
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors cursor-pointer',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        !value && 'text-muted-foreground',
        disabled && 'opacity-70 cursor-not-allowed bg-muted/40 pointer-events-none',
        className,
      )}
    >
      <span className="truncate select-none font-normal text-foreground">
        {value ? (
          formatDate(value, 'hh:mm a')
        ) : (
          <span className="text-muted-foreground">
            {t('PICK_SCHEDULE_TIME') || 'Pick schedule time'}
          </span>
        )}
      </span>
      <Clock className="h-4 w-4 shrink-0 opacity-50 ml-2" />
      <input
        ref={inputRef}
        id={id}
        type="time"
        disabled={disabled}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        tabIndex={0}
      />
    </div>
  );
}

