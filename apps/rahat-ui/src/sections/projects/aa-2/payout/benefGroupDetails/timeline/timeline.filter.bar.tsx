'use client';

import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import type { TimelineDateRange } from './timeline.types';

type TimelineFilterBarProps = {
  statusOptions: string[];
  statusFilter: string;
  searchQuery: string;
  dateRangeKey: number;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (range: TimelineDateRange | undefined) => void;
  onClearDate: () => void;
  onReset: () => void;
};

export default function TimelineFilterBar({
  statusOptions,
  statusFilter,
  searchQuery,
  dateRangeKey,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onClearDate,
  onReset,
}: TimelineFilterBarProps) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');

  return (
    <div className="flex items-center gap-2">
      <SearchInput
        className="flex-1 w-full min-w-[200px]"
        name="search"
        placeholder={translateValue(tv, 'SEARCH_BENEFICIARY_WALLET', {
          fallback: 'Search wallet...',
        })}
        onSearch={(e) => onSearchChange(e.target.value)}
        value={searchQuery}
      />

      {/* SelectComponent translates each option itself, so no labels map is needed. */}
      <SelectComponent
        name={tg('STATUS')}
        options={statusOptions}
        onChange={onStatusChange}
        value={statusFilter}
        className="w-44"
      />

      <DateRangePicker
        key={dateRangeKey}
        placeholder={tg('PICK_DATE_RANGE')}
        handleDateChange={onDateChange}
        handleClearDate={onClearDate}
        type="range"
        className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
      />

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center h-[clamp(28px,3vw,36px)] px-2 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          {translateValue(tg, 'RESET', { fallback: 'Reset' })}
        </button>
      )}
    </div>
  );
}
