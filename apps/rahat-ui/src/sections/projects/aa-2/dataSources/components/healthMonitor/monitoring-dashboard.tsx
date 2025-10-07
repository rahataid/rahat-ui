'use client';

import { StatusCard } from './status-card';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { SystemHealthCard } from './system-health-card';
import { StatusCardSkeleton } from './status-card-skeleton';
import { SystemHealthSkeleton } from './system-health-skeleton';
import { useExternalApiHealthMonitor } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function MonitoringDashboard() {
  const params = useParams();
  const projectId = params.id as UUID;
  const { data: apiHealthMonitor, isLoading: loading } =
    useExternalApiHealthMonitor(projectId);

  console.log(apiHealthMonitor);
  const sources = apiHealthMonitor?.sources;

  // console.log(sources.length);
  const { id: projectID } = useParams();
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <Back path={`/projects/aa/${projectID}/data-sources`} />
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
          sources={apiHealthMonitor?.sources}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatusCardSkeleton key={`skeleton-${index}`} />
            ))
          : sources.map((source) => (
              <StatusCard key={source.source_id} data={source} />
            ))}
      </div>
    </div>
  );
}
