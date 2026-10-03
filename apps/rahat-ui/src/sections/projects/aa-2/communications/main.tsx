'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams, useRouter } from 'next/navigation';
import { Heading } from 'apps/rahat-ui/src/common';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CommunicationsStatsCards } from './components/communications.stats.cards';
import { CommunicationsChannelRibbon } from './components/communications.channel.ribbon';
import { CommunicationsTable } from './components/communications.table';
import { toCommunicationRecord } from './components/useCommunicationsTableColumns';
import { resolveChannelByTransportId } from './utils/communications.utils';
import { useListAllTransports, useListCommunications, useSessionBroadCastCount } from '@rahat-ui/query';
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

  const appTransports = useListAllTransports();
  const { data, isLoading } = useListCommunications(uuid, {
    page: pagination.page,
    perPage: pagination.perPage,
    ...(debouncedSearch.trim() ? { title: debouncedSearch.trim() } : {}),
  });
  const { data: statsData } = useListCommunications(uuid, {
    page: 1,
    perPage: 100,
  });

  const items = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);
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
    () => (Array.isArray(statsData?.data) ? statsData.data : []),
    [statsData],
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

  const sessionIds = useMemo(() => {
    const ids: string[] = [];
    if (Array.isArray(statsData?.data)) {
      statsData.data.forEach((item: any) => {
        item.targets?.forEach((target: any) => {
          if (target.sessionId) ids.push(target.sessionId);
        });
      });
    }
    return [...new Set(ids)];
  }, [statsData]);

  const { data: broadcastCounts } = useSessionBroadCastCount(sessionIds);

  const delivered = broadcastCounts?.data?.SUCCESS ?? 0;
  const failed = broadcastCounts?.data?.FAIL ?? 0;
  const statsTotal = broadcastCounts?.data?.TOTAL ?? 0;

  const setNextPage = () => {
    if (pagination.page < meta.lastPage) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };
  const setPrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };
  const setPerPage = (size: string | number) => {
    setPagination({ page: 1, perPage: Number(size) });
  };

  const tableProps = {
    records,
    meta,
    isLoading,
    pagination,
    setPagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    search,
    onSearchChange: (value: string) => {
      setSearch(value);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
  };

  return (
    <div className="flex flex-col p-4 space-y-5">
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

      <CommunicationsStatsCards total={statsTotal} delivered={delivered} failed={failed} />

      <CommunicationsChannelRibbon
        sms={channelCounts.sms}
        voice={channelCounts.voice}
        email={channelCounts.email}
        transports={appTransports}
      />

      <Tabs value={activeTab} defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
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

        <TabsContent value="all" className="m-0">
          <CommunicationsTable activeTab="all" {...tableProps} />
        </TabsContent>

        <TabsContent value="sms" className="m-0">
          <CommunicationsTable activeTab="sms" {...tableProps} />
        </TabsContent>
        <TabsContent value="voice" className="m-0">
          <CommunicationsTable activeTab="voice" {...tableProps} />
        </TabsContent>
        <TabsContent value="email" className="m-0">
          <CommunicationsTable activeTab="email" {...tableProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
