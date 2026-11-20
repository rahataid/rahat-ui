'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import {
  useActivitiesCategories,
  useActivities,
  usePhases,
  usePhasesStore,
} from '@rahat-ui/query';
import { Heading } from 'apps/rahat-ui/src/common';
import { endOfDay, startOfDay } from 'date-fns';
import ActivitiesOverviewFilters, {
  ActivitiesOverviewDateRange,
  ActivitiesOverviewFilterValues,
} from './activitiesOverview.filters';
import ActivitiesOverviewCards from './activitiesOverview.cards';
import {
  STATS_PAGE_SIZE,
  computeActivityStats,
} from './activitiesOverview.utils';
import ActivitiesOverviewInsights from './activitiesOverview.insights';

const ActivitiesOverview = () => {
  const t = useTranslations('AA_PROJECT');
  const { id: projectID } = useParams();

  useActivitiesCategories(projectID as UUID);
  usePhases(projectID as UUID);

  const [filters, setFilters] = React.useState<ActivitiesOverviewFilterValues>(
    {},
  );

  const { data, activitiesData, activitiesMeta, isLoading } = useActivities(
    projectID as UUID,
    { ...filters, page: 1, perPage: STATS_PAGE_SIZE },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activities = React.useMemo(() => activitiesData ?? [], [data]);

  const [dateRange, setDateRange] = React.useState<ActivitiesOverviewDateRange>(
    {},
  );

  // Created-date range applied on the frontend (getAll has no date params).
  const visibleActivities = React.useMemo(() => {
    const { from, to } = dateRange;
    if (!from && !to) return activities;
    const start = from ? startOfDay(from).getTime() : -Infinity;
    const end = to ? endOfDay(to).getTime() : Infinity;
    return activities.filter((a: { createdAt?: string }) => {
      const created = a?.createdAt ? new Date(a.createdAt).getTime() : NaN;
      return created >= start && created <= end;
    });
  }, [activities, dateRange]);

  const { phases } = usePhasesStore((state) => ({ phases: state.phases }));
  const phaseOrder = React.useMemo(
    () => (phases ?? []).map((p: { name: string }) => p.name),
    [phases],
  );

  const stats = React.useMemo(
    () => computeActivityStats(visibleActivities, phaseOrder),
    [visibleActivities, phaseOrder],
  );

  React.useEffect(() => {
    const total = activitiesMeta?.total ?? 0;
    if (total > activities.length) {
      console.warn(
        `Activities overview: counted ${activities.length} of ${total} activities. Stats are incomplete; add a backend stats endpoint.`,
      );
    }
  }, [activitiesMeta, activities]);

  const handleFilterChange = React.useCallback(
    (key: keyof ActivitiesOverviewFilterValues, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value === 'all' ? undefined : value,
      }));
    },
    [],
  );

  return (
    // grid-cols-1 (minmax(0, 1fr)) lets the tab shrink inside the dashboard ScrollArea
    <div className="grid grid-cols-1">
      <Heading
        title={t('ACTIVITY_PROGRESS')}
        titleStyle="text-lg"
        description={t('ACTIVITY_PROGRESS_DESCRIPTION')}
      />
      <div className="mb-4">
        <ActivitiesOverviewFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onClear={() => {
            setFilters({});
            setDateRange({});
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <ActivitiesOverviewCards stats={stats} loading={isLoading} />
        <ActivitiesOverviewInsights stats={stats} loading={isLoading} />
      </div>
    </div>
  );
};

export default ActivitiesOverview;
