'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams, useRouter } from 'next/navigation';
import { Heading } from 'apps/rahat-ui/src/common';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CommunicationsChannelRibbon } from './components/communications.channel.ribbon';
import { CommunicationsTable } from './components/communications.table';
import { toCommunicationRecord } from './components/useCommunicationsTableColumns';
import { resolveChannelByTransportId } from './utils/communications.utils';
import { useListAllTransports, useListCommunications } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

export default function CommunicationsView() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();
  const { id: projectId } = useParams();
  const uuid = projectId as UUID;

  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [channelFilter, setChannelFilter] = useState<
    '' | 'SMS' | 'VOICE' | 'EMAIL'
  >('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);
  const [datePickerKey, setDatePickerKey] = useState(0);

  const appTransports = useListAllTransports();
  const { data, isLoading } = useListCommunications(uuid, {
    page: pagination.page,
    perPage: pagination.perPage,
    ...(debouncedSearch.trim() ? { title: debouncedSearch.trim() } : {}),
  });
  const { data: statsData, isLoading: isStatsDataLoading } = useListCommunications(uuid, {
    page: 1,
    perPage: 100,
  });

  const items = useMemo(
    () =>
      Array.isArray(data?.data)
        ? data.data.filter((item: any) => !item?.xrefId || item.xrefId === uuid)
        : [],
    [data, uuid],
  );
  const meta = useMemo(
    () => ({
      total: data?.meta?.total ?? items.length,
      currentPage: data?.meta?.currentPage ?? pagination.page,
      lastPage: data?.meta?.lastPage ?? 1,
      perPage: data?.meta?.perPage ?? pagination.perPage,
    }),
    [data, items.length, pagination.page, pagination.perPage],
  );

  const records = useMemo(
    () =>
      items.map((item: any) =>
        toCommunicationRecord(
          item,
          resolveChannelByTransportId(appTransports, item?.transportId, item?.audioURL),
        ),
      ),
    [items, appTransports],
  );

  const statsItems = useMemo(
    () =>
      Array.isArray(statsData?.data)
        ? statsData.data.filter((item: any) => !item?.xrefId || item.xrefId === uuid)
        : [],
    [statsData, uuid],
  );
  const statsRecords = useMemo(
    () =>
      statsItems.map((item: any) =>
        toCommunicationRecord(
          item,
          resolveChannelByTransportId(appTransports, item?.transportId, item?.audioURL),
        ),
      ),
    [statsItems, appTransports],
  );

  const channelCounts = useMemo(() => {
    const counts = { sms: 0, voice: 0, email: 0 };
    for (const record of statsRecords) {
      if (record.channel === 'SMS') counts.sms += 1;
      else if (record.channel === 'VOICE') counts.voice += 1;
      else if (record.channel === 'EMAIL') counts.email += 1;
    }
    return counts;
  }, [statsRecords]);


  const setNextPage = useCallback(() => {
    setPagination((prev) => {
      if (prev.page < meta.lastPage) return { ...prev, page: prev.page + 1 };
      return prev;
    });
  }, [meta.lastPage]);

  const setPrevPage = useCallback(() => {
    setPagination((prev) => {
      if (prev.page > 1) return { ...prev, page: prev.page - 1 };
      return prev;
    });
  }, []);

  const setPerPage = useCallback((size: string | number) => {
    setPagination({ page: 1, perPage: Number(size) });
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setChannelFilter(
      value === 'all' ? '' : (value.toUpperCase() as 'SMS' | 'VOICE' | 'EMAIL'),
    );
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleChannelFilterChange = useCallback((value: '' | 'SMS' | 'VOICE' | 'EMAIL') => {
    setChannelFilter(value);
    setActiveTab(value === '' ? 'all' : value.toLowerCase());
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleDateRangeChange = useCallback((
    value: { from?: Date; to?: Date } | undefined,
  ) => {
    setDateRange(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setChannelFilter('');
    setStatusFilter('');
    setDateRange(undefined);
    setActiveTab('all');
    setPagination((prev) => ({ ...prev, page: 1 }));
    setDatePickerKey((prev) => prev + 1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const showResetFilters = Boolean(
    search ||
      channelFilter ||
      statusFilter ||
      dateRange?.from ||
      dateRange?.to ||
      activeTab !== 'all' ||
      pagination.page !== 1,
  );

  const tableProps = useMemo(() => ({
    records,
    allRecords: statsRecords,
    meta,
    isLoading,
    pagination,
    setPagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    search,
    onSearchChange: handleSearchChange,
    channelFilter,
    onChannelFilterChange: handleChannelFilterChange,
    statusFilter,
    onStatusFilterChange: handleStatusFilterChange,
    dateRange,
    onDateRangeChange: handleDateRangeChange,
    datePickerKey,
    showResetFilters,
    onResetFilters: handleResetFilters,
  }), [
    records, statsRecords, meta, isLoading, pagination, search, channelFilter,
    statusFilter, dateRange, datePickerKey, showResetFilters,
    handleSearchChange, handleChannelFilterChange,
    handleStatusFilterChange, handleDateRangeChange,
    handleResetFilters, setNextPage, setPrevPage, setPerPage,
  ]);

  return (
    <div className="flex flex-col p-3.5 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading
          title={t("COMMUNICATIONS_OUTREACH")}
          description={t("NEW_COMMUNICATION_DESCRIPTION")}
        />
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className="h-[clamp(28px,3vw,36px)] px-3.5 text-xs font-medium"
            onClick={() => router.push(`/projects/aa/${projectId}/communications/add`)}
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            {t("NEW_COMMUNICATION")}
          </Button>
        </div>
      </div>


      <CommunicationsChannelRibbon
        sms={channelCounts.sms}
        voice={channelCounts.voice}
        email={channelCounts.email}
        transports={appTransports}
        isLoading={isLoading || isStatsDataLoading}
      />

      <Tabs value={activeTab} defaultValue="all" onValueChange={handleTabChange} className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="grid grid-cols-4 gap-1 w-full sm:w-[460px]">
            <TabsTrigger
              value="all"
              className={activeTab === 'all' ? 'bg-background shadow-sm' : ''}
            >
              {t("ALL")} ({formatDigits(meta.total)})
            </TabsTrigger>

            <TabsTrigger
              value="sms"
              className={activeTab === 'sms' ? 'bg-background shadow-sm' : ''}
            >
              {t("SMS")} ({formatDigits(channelCounts.sms)})
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className={activeTab === 'voice' ? 'bg-background shadow-sm' : ''}
            >
              {t("VOICE")} ({formatDigits(channelCounts.voice)})
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className={activeTab === 'email' ? 'bg-background shadow-sm' : ''}
            >
              {t("EMAIL")} ({formatDigits(channelCounts.email)})
            </TabsTrigger>
          </TabsList>
        </div>

        <CommunicationsTable {...tableProps} />
      </Tabs>
    </div>
  );
}
