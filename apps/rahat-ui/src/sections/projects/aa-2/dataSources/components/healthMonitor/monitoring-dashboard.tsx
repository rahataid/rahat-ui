'use client';

import { StatusCard } from './status-card';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { SystemHealthCard } from './system-health-card';
import { StatusCardSkeleton } from './status-card-skeleton';
import { SystemHealthSkeleton } from './system-health-skeleton';

const data = {
  overall_status: 'DEGRADED',
  last_updated: '2025-09-15T10:30:00Z',
  sources: [
    {
      source_id: 'river_water_level_api',
      name: 'River Water Level API',
      source_url: 'https://api.waterlevels.gov/v1/stations/12345/readings',
      status: 'UP',
      last_checked: '2025-09-15T10:30:00Z',
      response_time_ms: 245,
      validity: 'VALID',
      errors: null,
    },
    {
      source_id: 'rainfall_monitoring_api',
      name: 'Rainfall Monitoring API',
      source_url: 'https://weather.data.gov/api/v2/rainfall/region/kathmandu',
      status: 'UP',
      last_checked: '2025-09-15T10:29:45Z',
      response_time_ms: 1200,
      validity: 'VALID',
      errors: null,
    },
    {
      source_id: 'flood_warning_system',
      name: 'National Flood Warning System',
      source_url: 'https://floodwarning.gov.np/api/alerts',
      status: 'DOWN',
      last_checked: '2025-09-15T10:15:00Z',
      response_time_ms: null,
      validity: 'EXPIRED',
      errors: [
        {
          code: 'CONNECTION_TIMEOUT',
          message: 'Request timeout after 30 seconds',
          timestamp: '2025-09-15T10:15:00Z',
        },
      ],
    },
    {
      source_id: 'weather_forecast_api',
      name: 'Weather Forecast API',
      source_url: 'https://api.openweathermap.org/data/2.5/forecast',
      status: 'UP',
      last_checked: '2025-09-15T10:28:30Z',
      response_time_ms: 890,
      validity: 'STALE',
      errors: [
        {
          code: 'SLOW_RESPONSE',
          message: 'Response time exceeded 800ms threshold',
          timestamp: '2025-09-15T10:28:30Z',
        },
      ],
    },
  ],
};
export default function MonitoringDashboard() {
  const sources = data?.sources;
  const loading = false;
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
          overall_status={data?.overall_status}
          last_updated={data?.last_updated}
          sources={data?.sources}
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
