'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DemoTable, CustomPagination, SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { ToggleColumns } from 'apps/rahat-ui/src/common/toggle.columns';
import useCommunicationsTableColumns, {
  CommunicationRecord,
} from './useCommunicationsTableColumns';

type TableProps = {
  activeTab?: string;
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
};

export function CommunicationsTable({
  activeTab = 'all',
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
}: TableProps) {
  const t = useTranslations('AA_PROJECT');
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const columns = useCommunicationsTableColumns();

  const filteredData = React.useMemo(() => {
    let data = records;

    if (activeTab === 'sms') {
      data = data.filter((d) => d.channel === 'SMS');
    } else if (activeTab === 'voice') {
      data = data.filter((d) => d.channel === 'VOICE');
    } else if (activeTab === 'email') {
      data = data.filter((d) => d.channel === 'EMAIL');
    }

    if (activeTab === 'all' && channelFilter && channelFilter !== 'ALL') {
      data = data.filter((d) => d.channel === channelFilter);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      data = data.filter((d) => d.status === statusFilter);
    }

    return data;
  }, [records, activeTab, channelFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-card border rounded p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <SearchInput
            name="COMMUNICATIONS"
            placeholder={t("SEARCH_COMMUNICATIONS")}
            className="w-full sm:w-64"
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
            onChange={(val) => setChannelFilter(val === 'ALL' ? '' : val)}
            value={channelFilter || 'ALL'}
            className="w-36"
          />
          <SelectComponent
            name={t("STATUS")}
            options={['ALL', 'DELIVERED', 'IN_PROGRESS', 'FAILED']}
            labels={{
              ALL: t('ALL'),
              DELIVERED: t('DELIVERED'),
              IN_PROGRESS: t('IN_PROGRESS'),
              FAILED: t('FAILED'),
            }}
            onChange={(val) => setStatusFilter(val === 'ALL' ? '' : val)}
            value={statusFilter || 'ALL'}
            className="w-40"
          />
          <DateRangePicker
            placeholder={t("DATE_RANGE")}
            type="range"
            handleDateChange={() => {}}
            handleClearDate={() => {}}
            className="h-[36px] text-xs"
          />
        </div>

        <ToggleColumns table={table} />
      </div>

      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-540px)]"
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
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        setPagination={setPagination}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={meta.lastPage}
        isShowTotalCount={true}
      />
    </div>
  );
}
