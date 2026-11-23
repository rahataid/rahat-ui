'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { X } from 'lucide-react';
import { DemoTable, CustomPagination, SearchInput } from 'apps/rahat-ui/src/common';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { ToggleColumns } from 'apps/rahat-ui/src/common/toggle.columns';
import useCommunicationsTableColumns, {
  CommunicationRecord,
} from './useCommunicationsTableColumns';

export type CommunicationDateRange = {
  from?: Date;
  to?: Date;
};

type TableProps = {
  records: CommunicationRecord[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
  isLoading?: boolean;
  pagination: { page: number; perPage: number };
  setPagination: (pagination: any) => void;
  setNextPage: () => void;
  setPrevPage: () => void;
  setPerPage: (size: string | number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  channelFilter: string;
  onChannelFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateRange: CommunicationDateRange | undefined;
  onDateRangeChange: (value: CommunicationDateRange | undefined) => void;
  datePickerKey: number;
  showResetFilters: boolean;
  onResetFilters: () => void;
};

export const STATUS_FILTER_OPTIONS = [
  'ALL',
  'COMPLETED',
  'IN_PROGRESS',
  'NOT_STARTED',
  'SCHEDULED',
  'FAILED',
  'CANCELLED',
];

export function CommunicationsTable({
  records,
  meta,
  isLoading,
  pagination,
  setPagination,
  setNextPage,
  setPrevPage,
  setPerPage,
  search,
  onSearchChange,
  channelFilter,
  onChannelFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  datePickerKey,
  showResetFilters,
  onResetFilters,
}: TableProps) {
  const t = useTranslations('AA_PROJECT');
  const columns = useCommunicationsTableColumns();

  const handleNextPage = () => {
    if (pagination.page < meta.lastPage) {
      setNextPage();
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPrevPage();
    }
  };

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-card border rounded p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            name="COMMUNICATIONS"
            placeholder={t("SEARCH_COMMUNICATIONS")}
            className="min-w-[180px] flex-1"
            value={search}
            onSearch={(e) => onSearchChange(e?.target?.value || '')}
          />
          <SelectComponent
            name={t('CHANNEL')}
            options={['ALL', 'SMS', 'VOICE', 'EMAIL']}
            labels={{
              ALL: t('ALL'),
              ...['SMS', 'VOICE', 'EMAIL'].reduce((acc, ch) => {
                acc[ch] = t(ch as any) || ch;
                return acc;
              }, {} as Record<string, string>),
            }}
            onChange={(val) => onChannelFilterChange(val === 'ALL' ? '' : val)}
            value={channelFilter || ''}
            className="w-44 shrink-0"
          />
          <SelectComponent
            name={t('STATUS')}
            options={STATUS_FILTER_OPTIONS}
            labels={STATUS_FILTER_OPTIONS.reduce((acc, opt) => {
              if (opt === 'ALL') {
                acc[opt] = t('ALL');
              } else {
                try {
                  const translated = t(opt as any);
                  acc[opt] =
                    translated && !translated.startsWith('AA_PROJECT.')
                      ? translated
                      : opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                } catch {
                  acc[opt] = opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                }
              }
              return acc;
            }, {} as Record<string, string>)}
            onChange={(val) => onStatusFilterChange(val === 'ALL' ? '' : val)}
            value={statusFilter || ''}
            className="w-44 shrink-0"
          />
          <DateRangePicker
            key={datePickerKey}
            placeholder={t("DATE_RANGE")}
            type="range"
            handleDateChange={onDateRangeChange}
            handleClearDate={() => onDateRangeChange(undefined)}
            className="h-[36px] text-xs shrink-0"
          />
          {showResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground shrink-0 gap-1.5"
            >
              <X className="h-4 w-4" />
              <span>{t('RESET')}</span>
            </Button>
          )}
          <ToggleColumns table={table} />
        </div>

        <DemoTable
          table={table}
          tableHeight="h-[calc(100vh-320px)]"
          message={t("NO_COMMUNICATIONS_FOUND")}
          loading={isLoading}
        />

        <CustomPagination
          meta={{
            total: meta.total,
            currentPage: meta.currentPage,
            lastPage: meta.lastPage,
            perPage: meta.perPage,
            next: null,
            prev: null,
          }}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          setPagination={setPagination}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={meta.total}
          isShowTotalCount={true}
        />
      </div>
  );
}
