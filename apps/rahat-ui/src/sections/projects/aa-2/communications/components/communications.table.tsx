'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { DemoTable, CustomPagination, SearchInput } from 'apps/rahat-ui/src/common';
import { IconLabelBtn } from 'apps/rahat-ui/src/common/icon.label.btn';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { ToggleColumns } from 'apps/rahat-ui/src/common/toggle.columns';
import { useQueries } from '@tanstack/react-query';
import {
  broadcastCountsQueryOptions,
  useNewCommunicationQuery,
} from '@rahat-ui/query';
import { resolveCommunicationLifecycleStatus } from '../utils/communications.utils';
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
  channelFilter: '' | 'SMS' | 'VOICE' | 'EMAIL';
  onChannelFilterChange: (value: '' | 'SMS' | 'VOICE' | 'EMAIL') => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateRange: CommunicationDateRange | undefined;
  onDateRangeChange: (value: CommunicationDateRange | undefined) => void;
  datePickerKey: number;
  showResetFilters: boolean;
  onResetFilters: () => void;
};

const STATUS_FILTER_OPTIONS = [
  'ALL',
  'DELIVERED',
  'ANSWERED',
  'COMPLETED',
  'IN_PROGRESS',
  'PENDING',
  'SCHEDULED',
  'FAILED',
  'CANCELLED',
];

type BroadcastCountsMap = Map<string, { data: any; isLoading: boolean }>;

export const BroadcastCountsContext = React.createContext<BroadcastCountsMap>(
  new Map(),
);

function useResolvedCommunicationStatuses(records: CommunicationRecord[]) {
  const { newCommunicationService } = useNewCommunicationQuery();

  const recordSessionIds = React.useMemo(() => {
    return records.map((record) => [
      ...new Set(
        (record.targets ?? [])
          .map((target) => target.sessionId)
          .filter(Boolean) as string[],
      ),
    ]);
  }, [records]);

  const results = useQueries({
    queries: recordSessionIds.map((sessionIds) =>
      broadcastCountsQueryOptions(newCommunicationService, sessionIds),
    ),
  });

  const stableDataKey = React.useMemo(
    () =>
      JSON.stringify(
        results.map((r) => r.data?.data ?? null),
      ),
    [results],
  );

  const isBroadcastLoading = results.some(
    (r, i) => recordSessionIds[i].length > 0 && r.isLoading,
  );

  const countsMap = React.useMemo(() => {
    const map: BroadcastCountsMap = new Map();
    records.forEach((record, index) => {
      const sessionIds = recordSessionIds[index] ?? [];
      if (sessionIds.length > 0) {
        map.set(record.id, {
          data: results[index]?.data?.data ?? undefined,
          isLoading: results[index]?.isLoading ?? true,
        });
      }
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, recordSessionIds, stableDataKey]);

  const resolvedStatuses = React.useMemo(() => {
    const resolvedById = new Map<string, string>();
    records.forEach((record, index) => {
      const sessionIds = recordSessionIds[index] ?? [];
      const counts =
        sessionIds.length > 0 ? results[index]?.data?.data : undefined;
      resolvedById.set(
        record.id,
        resolveCommunicationLifecycleStatus({
          channel: record.channel || 'SMS',
          rawStatus: record.status,
          counts,
          hasActiveTargets: (record.targets ?? []).some(
            (target) => target.status === 'SENT' || target.status === 'PROCESSING',
          ),
          hasPendingTargets: (record.targets ?? []).some(
            (target) => target.status === 'PENDING',
          ),
          hasSession: sessionIds.length > 0,
        }),
      );
    });
    return resolvedById;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, recordSessionIds, stableDataKey]);

  return { resolvedStatuses, countsMap, isBroadcastLoading };
}

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
  const { resolvedStatuses, countsMap, isBroadcastLoading } = useResolvedCommunicationStatuses(records);

  const isFiltering = Boolean(
    channelFilter || statusFilter || dateRange?.from || dateRange?.to,
  );

  const filteredData = React.useMemo(() => {
    let data = records;

    if (channelFilter) {
      data = data.filter((record) => record.channel === channelFilter);
    }

    if (statusFilter) {
      data = data.filter(
        (record) => resolvedStatuses.get(record.id) === statusFilter,
      );
    }

    if (dateRange?.from || dateRange?.to) {
      const start = dateRange.from
        ? new Date(
            dateRange.from.getFullYear(),
            dateRange.from.getMonth(),
            dateRange.from.getDate(),
          )
        : null;
      const end = dateRange.to
        ? new Date(
            dateRange.to.getFullYear(),
            dateRange.to.getMonth(),
            dateRange.to.getDate(),
            23,
            59,
            59,
            999,
          )
        : null;
      data = data.filter((record) => {
        const time = new Date(record.date).getTime();
        if (Number.isNaN(time)) return false;
        if (start && time < start.getTime()) return false;
        if (end && time > end.getTime()) return false;
        return true;
      });
    }

    return data;
  }, [records, channelFilter, statusFilter, dateRange, resolvedStatuses]);

  const effectiveMeta = React.useMemo(() => {
    if (!isFiltering) return meta;
    return {
      total: filteredData.length,
      currentPage: pagination.page,
      lastPage: Math.max(
        1,
        Math.ceil(filteredData.length / pagination.perPage),
      ),
      perPage: pagination.perPage,
    };
  }, [
    isFiltering,
    filteredData.length,
    meta,
    pagination.page,
    pagination.perPage,
  ]);

  const shouldResetPage = isFiltering && pagination.page > effectiveMeta.lastPage;
  React.useEffect(() => {
    if (shouldResetPage) {
      setPagination((prev: any) => ({ ...prev, page: 1 }));
    }
  }, [shouldResetPage, setPagination]);

  const handleNextPage = () => {
    if (pagination.page < effectiveMeta.lastPage) setNextPage();
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) setPrevPage();
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <BroadcastCountsContext.Provider value={countsMap}>
      <div className="bg-card border rounded p-4 space-y-4">
        <div className="flex items-center gap-2">
          <SearchInput
            name="COMMUNICATIONS"
            placeholder={t("SEARCH_COMMUNICATIONS")}
            className="w-full"
            value={search}
            onSearch={(e) => onSearchChange(e?.target?.value || '')}
          />
          <SelectComponent
            name={t("CHANNEL")}
            options={['ALL', 'SMS', 'VOICE', 'EMAIL']}
            labels={{
              ALL: t('ALL'),
              SMS: t('SMS'),
              VOICE: t('VOICE'),
              EMAIL: t('EMAIL'),
            }}
            onChange={(val) =>
              onChannelFilterChange(
                val === 'ALL' ? '' : (val as 'SMS' | 'VOICE' | 'EMAIL'),
              )
            }
            value={channelFilter || 'ALL'}
            className="w-36 shrink-0"
          />
          <SelectComponent
            name={t("STATUS")}
            options={STATUS_FILTER_OPTIONS}
            labels={{
              ALL: t('ALL'),
              DELIVERED: t('DELIVERED'),
              ANSWERED: t('ANSWERED'),
              COMPLETED: t('COMPLETED'),
              IN_PROGRESS: t('IN_PROGRESS'),
              PENDING: t('PENDING'),
              SCHEDULED: t('SCHEDULED'),
              FAILED: t('FAILED'),
              CANCELLED: t('CANCELLED'),
            }}
            onChange={(val) => onStatusFilterChange(val === 'ALL' ? '' : val)}
            value={statusFilter || 'ALL'}
            className="w-40 shrink-0"
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
            <IconLabelBtn
              Icon={Trash2}
              name={t('CLEAR')}
              handleClick={onResetFilters}
              variant="outline"
              className="text-red-500 rounded-xl shrink-0"
            />
          )}
          <ToggleColumns table={table} />
        </div>

        <DemoTable
          table={table}
          tableHeight="h-[calc(100vh-540px)]"
          message={t("NO_COMMUNICATIONS_FOUND")}
          loading={isLoading || isBroadcastLoading}
        />

        <CustomPagination
          meta={{
            total: effectiveMeta.total,
            currentPage: effectiveMeta.currentPage,
            lastPage: effectiveMeta.lastPage,
            perPage: effectiveMeta.perPage,
            next: null,
            prev: null,
          }}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          setPagination={setPagination}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={effectiveMeta.total}
          isShowTotalCount={true}
        />
      </div>
    </BroadcastCountsContext.Provider>
  );
}
