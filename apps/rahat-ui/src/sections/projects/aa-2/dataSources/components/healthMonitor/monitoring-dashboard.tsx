'use client';

import { StatusCard } from './status-card';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { SystemHealthCard } from './system-health-card';
import { StatusCardSkeleton } from './status-card-skeleton';
import { SystemHealthSkeleton } from './system-health-skeleton';
import {
  PROJECT_SETTINGS_KEYS,
  SourceHealthData,
  useExternalApiHealthMonitor,
  useTabConfiguration,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { useMemo } from 'react';
import { defaultForecastTab } from 'apps/rahat-ui/src/constants/aa.tabValues.constants';

export default function MonitoringDashboard() {
  const params = useParams();
  const projectId = params.id as UUID;
  const { data: apiHealthMonitor, isLoading: loading } =
    useExternalApiHealthMonitor(projectId);

  const sources = apiHealthMonitor?.sources;

  const { data, isLoading } = useTabConfiguration(
    projectId as UUID,
    PROJECT_SETTINGS_KEYS.FORECAST_TAB_CONFIG,
  );

  const newTabsList = useMemo(() => {
    const tabs = data?.value?.tabs;
    return tabs?.length
      ? tabs.map((t: any) => t.value)
      : defaultForecastTab.map((t) => t.value);
  }, [data]);

  const newFilteredSources = useMemo(() => {
    if (!sources || !newTabsList.length) return [];

    return sources.filter((item: any) =>
      newTabsList.some((key: string) =>
        item?.adapterId?.toLowerCase()?.startsWith(key.toLowerCase()),
      ),
    );
  }, [sources, newTabsList]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <Back path={`/projects/aa/${projectId}/data-sources`} />
        <Heading
          title="Data Health Checker"
          description="Real-time health monitoring of external data sources"
          titleStyle="sm:text-lg text-foreground font-semibold text-balance"
        />
      </div>
      {loading ? (
        <SystemHealthSkeleton />
      ) : (
        <SystemHealthCard
          overall_status={apiHealthMonitor?.overall_status}
          last_updated={apiHealthMonitor?.last_updated}
          sources={newFilteredSources}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatusCardSkeleton key={`skeleton-${index}`} />
            ))
          : newFilteredSources.map((source) => (
              <StatusCard key={source.source_id} data={source} />
            ))}
      </div>
    </div>
  );
}
