'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { X } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useActivitiesStore, usePhasesStore } from '@rahat-ui/query';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';

export type ActivitiesOverviewFilterValues = {
  phase?: string;
  category?: string;
  isAutomated?: string;
};

export type ActivitiesOverviewDateRange = {
  from?: Date;
  to?: Date;
};

type IProps = {
  filters: ActivitiesOverviewFilterValues;
  onFilterChange: (
    key: keyof ActivitiesOverviewFilterValues,
    value: string,
  ) => void;
  dateRange: ActivitiesOverviewDateRange;
  onDateRangeChange: (range: ActivitiesOverviewDateRange) => void;
  onClear: () => void;
};

const triggerClass = (active?: string) =>
  `h-9 w-full text-sm ${active ? '' : 'text-muted-foreground'}`;

export default function ActivitiesOverviewFilters({
  filters,
  onFilterChange,
  dateRange,
  onDateRangeChange,
  onClear,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  const tGlobal = useTranslations('GLOBAL');

  const { categories } = useActivitiesStore((state) => ({
    categories: state.categories,
  }));
  const { phases } = usePhasesStore((state) => ({
    phases: state.phases,
  }));

  const hasFilters =
    Object.values(filters).some(Boolean) || !!dateRange.from || !!dateRange.to;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] gap-2">
      <Select
        value={filters.phase || 'all'}
        onValueChange={(value) => onFilterChange('phase', value)}
      >
        <SelectTrigger className={triggerClass(filters.phase)}>
          <SelectValue placeholder={t('SELECT_A_PHASE')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('ALL_PHASES')}</SelectItem>
            {phases?.map((phase: { uuid: string; name: string }) => (
              <SelectItem key={phase.uuid} value={phase.uuid}>
                {phase.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.category || 'all'}
        onValueChange={(value) => onFilterChange('category', value)}
      >
        <SelectTrigger className={triggerClass(filters.category)}>
          <SelectValue placeholder={t('SELECT_A_CATEGORY')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('ALL_CATEGORIES')}</SelectItem>
            {categories?.map((item: { uuid: string; name: string }) => (
              <SelectItem key={item.uuid} value={item.uuid}>
                {translateValue(t, item.name, { fallbackStyle: 'raw' })}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.isAutomated || 'all'}
        onValueChange={(value) => onFilterChange('isAutomated', value)}
      >
        <SelectTrigger className={triggerClass(filters.isAutomated)}>
          <SelectValue placeholder={t('SELECT_ACTIVITY_TYPE')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('ALL_TYPE')}</SelectItem>
            <SelectItem value="true">{t('AUTOMATED')}</SelectItem>
            <SelectItem value="false">{t('MANUAL')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DatePicker
        placeholder={tGlobal('FROM')}
        type="from"
        selectedDate={dateRange.from}
        maxDate={dateRange.to}
        handleDateChange={(date: Date | undefined) =>
          onDateRangeChange({ ...dateRange, from: date })
        }
        className="h-9 w-full text-sm"
      />
      <DatePicker
        placeholder={tGlobal('TO')}
        type="to"
        selectedDate={dateRange.to}
        minDate={dateRange.from}
        handleDateChange={(date: Date | undefined) =>
          onDateRangeChange({ ...dateRange, to: date })
        }
        className="h-9 w-full text-sm"
      />

      {hasFilters && (
        <Button
          variant="ghost"
          className="h-9 text-muted-foreground"
          onClick={onClear}
        >
          <X className="w-4 h-4 mr-1" />
          {tGlobal('CLEAR_ALL')}
        </Button>
      )}
    </div>
  );
}
