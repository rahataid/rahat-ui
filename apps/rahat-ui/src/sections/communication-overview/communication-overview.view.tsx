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
  useCommunicationOverviewStats,
  useCommunicationOverviewActivities,
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
    }),
    [
      filters.project,
      fromStr,
      toStr,
      filters.channel,
      filters.recipient,
      filters.phase,
      filters.status,
    ],
  );

  const statsParams = useMemo(
    () => ({
      project: filters.project,
      from: fromStr,
      to: toStr,
      channel: filters.channel,
      recipient: filters.recipient,
      phase: filters.phase,
    }),
    [
      filters.project,
      fromStr,
      toStr,
      filters.channel,
      filters.recipient,
      filters.phase,
    ],
  );

  const {
    data: activities,
    allActivities,
    isLoading: isLoadingActivities,
  } = useCommunicationOverviewActivities(queryParams);

  const {
    data: overviewStats,
    isLoading: isLoadingStats,
  } = useCommunicationOverviewStats(statsParams);

  const handleFilterChange = useCallback(
    (newFilters: CommunicationOverviewFilterState) => {
      setFilters(newFilters);
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleSelectStatus = useCallback((status?: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === status ? undefined : status,
    }));
  }, []);

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <Card className="w-full max-w-full min-w-0 overflow-hidden">
        <CardHeader className="flex flex-col gap-3 space-y-0 pb-4 w-full max-w-full min-w-0">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold shrink-0">
              {t('COMMUNICATION_OVERVIEW')}
            </CardTitle>
          </div>
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
            isLoading={isLoadingStats}
            activeStatus={filters.status}
            onSelectStatus={handleSelectStatus}
          />

          <CommunicationBreakdowns
            data={overviewStats}
            isLoading={isLoadingStats}
            activeStatus={filters.status}
            onSelectStatus={handleSelectStatus}
          />

          <CommunicationOverviewTable
            activities={activities}
            isLoading={isLoadingActivities}
          />
        </CardContent>
      </Card>
    </div>
  );
}