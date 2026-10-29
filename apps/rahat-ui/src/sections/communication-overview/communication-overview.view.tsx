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
  computeStatsFromActivities,
  filterCommunicationActivities,
  useProjectList,
  useDebounce,
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
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const { data: projectsData } = useProjectList();

  const activeProjectName = useMemo(() => {
    if (!filters.project || filters.project === 'all') return undefined;
    const project = projectsData?.data?.find(
      (p: any) => p.uuid === filters.project,
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
    ],
  );

  const {
    data: activities,
    allActivities,
    isLoading: isLoadingActivities,
  } = useCommunicationOverviewActivities(queryParams);

  const overviewStats = useMemo(() => {
    const { status: _status, search: _search, ...filtersWithoutStatusOrSearch } = queryParams;
    const base = filterCommunicationActivities(allActivities, filtersWithoutStatusOrSearch);
    return computeStatsFromActivities(base);
  }, [allActivities, queryParams]);

  const handleFilterChange = useCallback(
    (newFilters: CommunicationOverviewFilterState) => setFilters(newFilters),
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const handleSelectStatus = useCallback((status?: string) => {
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
            isLoading={isLoadingActivities}
            activeStatus={filters.status}
            onSelectStatus={handleSelectStatus}
            projectName={activeProjectName}
          />

          <CommunicationBreakdowns
            data={overviewStats}
            isLoading={isLoadingActivities}
            activeStatus={filters.status}
            onSelectStatus={handleSelectStatus}
          />
        </CardContent>
      </Card>

      <CommunicationOverviewTable
        activities={activities}
        isLoading={isLoadingActivities}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
}