'use client';

import { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  useCommunicationOverviewActivities,
  useCommunicationOverviewGroupStats,
  transformGroupTransportStatsToRecipientWise,
  computeStatsFromActivities,
  filterCommunicationActivities,
  useProjectList,
  useDebounce,
  useCommsUsage,
  useCommsUsageByXref,
  classifyTransportString,
  GroupDeliveryStats,
  GroupTransportStats,
  RecipientWiseStats,
  emptyGroupStats,
} from '@rahat-ui/query';
import CommunicationOverviewFilters, {
  CommunicationOverviewFilterState,
} from './communication-overview-filters';
import {
  CommunicationTopKpis,
  CommunicationBreakdowns,
} from './communication-overview-stats';
import CommunicationOverviewTable from './communication-overview-table';

export default function CommunicationOverviewView() {
  const t = useTranslations('USAGE');
  const [filters, setFilters] = useState<CommunicationOverviewFilterState>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const { data: projectsData } = useProjectList();

  const activeProjectName = useMemo(() => {
    if (!filters.project || filters.project === 'all') return undefined;
    const project = projectsData?.data?.find(
      (p: { uuid?: string; name?: string }) => p.uuid === filters.project,
    );
    return project?.name;
  }, [filters.project, projectsData?.data]);

  const fromStr = useMemo(
    () => (filters.fromDate ? format(filters.fromDate, 'yyyy-MM-dd') : undefined),
    [filters.fromDate],
  );

  const toStr = useMemo(
    () => (filters.toDate ? format(filters.toDate, 'yyyy-MM-dd') : undefined),
    [filters.toDate],
  );

  const queryParams = useMemo(
    () => ({
      project: filters.project,
      from: fromStr,
      to: toStr,
      channel: filters.channel,
      recipient: filters.recipient,
      phase: filters.phase,
      status: filters.status,
      search: debouncedSearchTerm.trim() || undefined,
      page,
      perPage,
    }),
    [
      filters.project,
      fromStr,
      toStr,
      filters.channel,
      filters.recipient,
      filters.phase,
      filters.status,
      debouncedSearchTerm,
      page,
      perPage,
    ],
  );

  const dateRangeQuery = useMemo(() => {
    if (!fromStr && !toStr) return undefined;
    return {
      ...(fromStr && { from: fromStr }),
      ...(toStr && { to: toStr }),
    };
  }, [fromStr, toStr]);

  const isSpecificProject = Boolean(filters.project && filters.project !== 'all');

  const { data: usageData, isPending: isUsageLoading } = useCommsUsage(
    isSpecificProject ? undefined : dateRangeQuery,
  );
  const { data: usageByXrefData, isPending: isUsageByXrefLoading } = useCommsUsageByXref(
    isSpecificProject ? (filters.project as string) : '',
    dateRangeQuery,
  );

  const activeUsage = isSpecificProject ? usageByXrefData : usageData;
  const isConnectLoading = isSpecificProject ? isUsageByXrefLoading : isUsageLoading;

  const {
    data: activities,
    meta: activitiesMeta,
    allActivities,
    isLoading: isLoadingActivities,
  } = useCommunicationOverviewActivities(queryParams);

  const { data: groupStatsData, isLoading: isLoadingGroupStats } =
    useCommunicationOverviewGroupStats({
      project: filters.project,
      from: fromStr,
      to: toStr,
      phase: filters.phase,
    });

  const overviewStats = useMemo(() => {
    const { status: _status, search: _search, ...filtersWithoutStatusOrSearch } = queryParams;
    const base = filterCommunicationActivities(allActivities, filtersWithoutStatusOrSearch);
    const activityStats = computeStatsFromActivities(base);

    const usagePayload = activeUsage as
      | {
          data?: {
            totals?: {
              sessions?: number;
              broadcasts?: number;
              success?: number;
              fail?: number;
              credits?: number;
            };
            byTransport?: Array<{
              transportName?: string;
              transportType?: string;
              broadcasts?: number;
              success?: number;
              fail?: number;
            }>;
          };
        }
      | undefined;

    const connectTotals = usagePayload?.data?.totals;
    const connectByTransport = usagePayload?.data?.byTransport;

    const selectedChannel =
      filters.channel && filters.channel !== 'all'
        ? classifyTransportString(filters.channel)
        : undefined;

    const selectedRecipient =
      filters.recipient && filters.recipient !== 'all'
        ? filters.recipient.toLowerCase()
        : undefined;

    const selectedPhase =
      filters.phase && filters.phase !== 'all'
        ? filters.phase
        : undefined;

    let recipientWise: RecipientWiseStats = groupStatsData
      ? transformGroupTransportStatsToRecipientWise(
          groupStatsData,
          filters.channel,
        )
      : {
          beneficiary: emptyGroupStats(),
          stakeholder: emptyGroupStats(),
        };

    const rawGroupStats: GroupTransportStats = groupStatsData ?? {};

    if (selectedRecipient) {
      if (selectedRecipient === 'beneficiary') {
        recipientWise = {
          beneficiary: recipientWise.beneficiary,
          stakeholder: emptyGroupStats(),
        };
      } else if (selectedRecipient === 'stakeholder') {
        recipientWise = {
          beneficiary: emptyGroupStats(),
          stakeholder: recipientWise.stakeholder,
        };
      }
    }

    const channelWise: Record<string, GroupDeliveryStats> = {};

    if (selectedRecipient && groupStatsData) {
      const role = selectedRecipient as 'beneficiary' | 'stakeholder';
      const roleTransports = groupStatsData[role];
      if (roleTransports && typeof roleTransports === 'object') {
        for (const [transportName, counts] of Object.entries(roleTransports)) {
          if (!counts) continue;
          if (selectedChannel && classifyTransportString(transportName) !== selectedChannel) {
            continue;
          }
          const successful = Number(counts.SUCCESS || 0);
          const failed = Number(counts.FAIL || 0);
          const pending = Number((counts.PENDING || 0) + (counts.SCHEDULED || 0));
          const total = Number(counts.TOTAL || successful + failed + pending);
          const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

          channelWise[transportName] = {
            total,
            successful,
            failed,
            pending,
            successRate,
          };
        }
      }
    } else if (Array.isArray(connectByTransport) && connectByTransport.length > 0) {
      for (const t of connectByTransport) {
        const transportKey = t.transportName?.trim() || t.transportType || 'SMS';
        if (selectedChannel && classifyTransportString(transportKey) !== selectedChannel) {
          continue;
        }
        const total = Number(t.broadcasts ?? 0);
        const successful = Number(t.success ?? 0);
        const failed = Number(t.fail ?? 0);
        const pending = Math.max(0, total - (successful + failed));
        const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

        channelWise[transportKey] = {
          total: (channelWise[transportKey]?.total ?? 0) + total,
          successful: (channelWise[transportKey]?.successful ?? 0) + successful,
          failed: (channelWise[transportKey]?.failed ?? 0) + failed,
          pending: (channelWise[transportKey]?.pending ?? 0) + pending,
          successRate,
        };
      }
    } else {
      for (const [key, val] of Object.entries(activityStats.channelWise)) {
        if (!selectedChannel || classifyTransportString(key) === selectedChannel) {
          channelWise[key] = val;
        }
      }
    }

    let overallTotalComms = 0;
    let overallRecipients = 0;
    let overallSuccess = 0;
    let overallFailed = 0;
    let totalCampaignsCount = 0;

    const isScopedByRecipientOrPhase = Boolean(selectedRecipient || selectedPhase);

    if (isScopedByRecipientOrPhase) {
      const activeBen = selectedRecipient !== 'stakeholder' ? recipientWise.beneficiary : emptyGroupStats();
      const activeStk = selectedRecipient !== 'beneficiary' ? recipientWise.stakeholder : emptyGroupStats();

      overallRecipients = activeBen.total + activeStk.total;
      overallSuccess = activeBen.successful + activeStk.successful;
      overallFailed = activeBen.failed + activeStk.failed;
      overallTotalComms = overallRecipients;
      totalCampaignsCount = activityStats.overall.totalCommunications;
    } else if (connectTotals) {
      overallTotalComms = Number(connectTotals.broadcasts ?? 0);
      overallRecipients = Number(connectTotals.broadcasts ?? 0);
      overallSuccess = Number(connectTotals.success ?? 0);
      overallFailed = Number(connectTotals.fail ?? 0);
      totalCampaignsCount = Number(connectTotals.sessions ?? activityStats.overall.totalCommunications ?? 0);

      if (selectedChannel) {
        let filteredTotal = 0;
        let filteredSuccess = 0;
        let filteredFailed = 0;

        for (const ch of Object.values(channelWise)) {
          filteredTotal += ch.total;
          filteredSuccess += ch.successful;
          filteredFailed += ch.failed;
        }

        overallTotalComms = filteredTotal;
        overallRecipients = filteredTotal;
        overallSuccess = filteredSuccess;
        overallFailed = filteredFailed;
        totalCampaignsCount = activityStats.overall.totalCommunications;
      }
    } else {
      overallTotalComms = activityStats.overall.totalCommunications;
      overallRecipients = activityStats.overall.totalRecipients;
      overallSuccess = activityStats.overall.successful;
      overallFailed = activityStats.overall.failed;
      totalCampaignsCount = activityStats.overall.totalCommunications;
    }

    const overallPending = Math.max(0, overallRecipients - (overallSuccess + overallFailed));
    const overallSuccessRate =
      overallRecipients > 0 ? Math.round((overallSuccess / overallRecipients) * 100) : 0;

    return {
      overall: {
        totalCommunications: overallTotalComms,
        totalCampaigns: totalCampaignsCount,
        successful: overallSuccess,
        failed: overallFailed,
        pending: overallPending,
        totalRecipients: overallRecipients,
        successRate: overallSuccessRate,
      },
      channelWise: Object.keys(channelWise).length > 0 ? channelWise : activityStats.channelWise,
      recipientWise,
      rawGroupStats,
    };
  }, [
    allActivities,
    queryParams,
    activeUsage,
    filters.channel,
    filters.recipient,
    filters.phase,
    groupStatsData,
  ]);

  const handleFilterChange = useCallback(
    (newFilters: CommunicationOverviewFilterState) => {
      setPage(1);
      setFilters(newFilters);
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setPage(1);
    setFilters({});
    setSearchTerm('');
  }, []);

  const handleSelectStatus = useCallback((status?: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      status: prev.status === status ? undefined : status,
    }));
  }, []);

  return (
    <div className="space-y-6 w-full max-w-full min-w-0 overflow-hidden">
      <Card className="w-full max-w-full min-w-0 overflow-hidden">
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 space-y-0 pb-4 w-full max-w-full min-w-0">
          <CardTitle className="text-lg font-semibold shrink-0">
            {t('COMMUNICATION_USAGE')}
          </CardTitle>
          <CommunicationOverviewFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            activities={allActivities}
          />
        </CardHeader>
        <CardContent className="space-y-6 w-full max-w-full min-w-0 overflow-hidden">
          <CommunicationTopKpis
            data={overviewStats}
            isLoading={
              isLoadingActivities || isConnectLoading || isLoadingGroupStats
            }
            activeStatus={filters.status}
            onSelectStatus={handleSelectStatus}
            projectName={activeProjectName}
            activeChannel={filters.channel}
            activeRecipient={filters.recipient}
          />

          <CommunicationBreakdowns
            data={overviewStats}
            isLoading={
              isLoadingActivities || isConnectLoading || isLoadingGroupStats
            }
            activeStatus={filters.status}
            onSelectStatus={handleSelectStatus}
            activeChannel={filters.channel}
            activeRecipient={filters.recipient}
          />
        </CardContent>
      </Card>

      <CommunicationOverviewTable
        activities={activities}
        meta={activitiesMeta}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={(size) => {
          setPerPage(size);
          setPage(1);
        }}
        isLoading={isLoadingActivities}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setPage(1);
          setSearchTerm(val);
        }}
      />
    </div>
  );
}