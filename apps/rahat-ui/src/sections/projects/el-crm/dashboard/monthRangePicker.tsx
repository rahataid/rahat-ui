'use client';

import * as React from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function toYM(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function formatLabel(ym: string): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} '${y.slice(2)}`;
}

type Props = {
  fromMonth: string;
  toMonth: string;
  onChange: (from: string, to: string) => void;
  minMonth?: string;
  maxMonth?: string;
};

export function MonthRangePicker({ fromMonth, toMonth, onChange, minMonth, maxMonth }: Props) {
  const [open, setOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();
  const [viewYear, setViewYear] = React.useState<number>(() => {
    if (fromMonth) return parseInt(fromMonth.split('-')[0], 10);
    return currentYear;
  });

  // Which half is being picked next
  const [selecting, setSelecting] = React.useState<'from' | 'to'>('from');
  // Hover for range preview
  const [hovered, setHovered] = React.useState<string>('');

  const handleOpen = (val: boolean) => {
    setOpen(val);
    if (val) setSelecting('from');
  };

  const handleMonthClick = (ym: string) => {
    if (selecting === 'from') {
      onChange(ym, ym);          // reset to; user will pick "to" next
      setSelecting('to');
    } else {
      const from = fromMonth || ym;
      const [newFrom, newTo] = ym < from ? [ym, from] : [from, ym];
      onChange(newFrom, newTo);
      setOpen(false);
      setSelecting('from');
    }
  };

  const isDisabled = (ym: string) => {
    if (minMonth && ym < minMonth) return true;
    if (maxMonth && ym > maxMonth) return true;
    return false;
  };

  const isInRange = (ym: string) => {
    const lo = selecting === 'to' && hovered
      ? (hovered < (fromMonth || '') ? hovered : (fromMonth || ''))
      : fromMonth;
    const hi = selecting === 'to' && hovered
      ? (hovered < (fromMonth || '') ? (fromMonth || '') : hovered)
      : toMonth;
    return ym > lo && ym < hi;
  };

  const isFrom = (ym: string) => ym === fromMonth;
  const isTo = (ym: string) => ym === toMonth;

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[220px] h-9 justify-start text-left text-sm font-normal"
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          {fromMonth ? (
            toMonth && toMonth !== fromMonth ? (
              <span>{formatLabel(fromMonth)} – {formatLabel(toMonth)}</span>
            ) : (
              <span>{formatLabel(fromMonth)}</span>
            )
          ) : (
            <span className="text-muted-foreground">Select month range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        {/* Year navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setViewYear((y) => y - 1)}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold">{viewYear}</span>
          <button
            onClick={() => setViewYear((y) => y + 1)}
            disabled={viewYear >= currentYear + 1}
            className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Hint */}
        <p className="text-[11px] text-muted-foreground text-center mb-2">
          {selecting === 'from' ? 'Select start month' : 'Select end month'}
        </p>

        {/* Month grid */}
        <div className="grid grid-cols-4 gap-1">
          {MONTHS.map((label, idx) => {
            const ym = toYM(viewYear, idx);
            const disabled = isDisabled(ym);
            const from = isFrom(ym);
            const to = isTo(ym);
            const inRange = isInRange(ym);
            const isHovered = selecting === 'to' && hovered === ym;

            return (
              <button
                key={ym}
                disabled={disabled}
                onClick={() => !disabled && handleMonthClick(ym)}
                onMouseEnter={() => setHovered(ym)}
                onMouseLeave={() => setHovered('')}
                className={[
                  'px-2 py-1.5 rounded text-xs font-medium transition-colors',
                  disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
                  from || to
                    ? 'bg-primary text-primary-foreground'
                    : inRange || isHovered
                    ? 'bg-primary/15 text-foreground'
                    : 'hover:bg-muted text-foreground',
                ].join(' ')}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Clear */}
        {(fromMonth || toMonth) && (
          <button
            onClick={() => { onChange('', ''); setOpen(false); setSelecting('from'); }}
            className="mt-3 w-full text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
