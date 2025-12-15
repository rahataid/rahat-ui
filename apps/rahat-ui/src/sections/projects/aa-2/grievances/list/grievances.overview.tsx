'use client';

import { useGetOverviewStats } from '@rahat-ui/query';
import {
  GrievanceStatus,
  GrievanceType,
} from '@rahat-ui/query/lib/grievance/types/grievance';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard } from 'apps/rahat-ui/src/common';
import {
  grievanceStatus,
  grievanceType,
} from 'apps/rahat-ui/src/constants/aa.grievances.constants';
import { formatDuration } from 'apps/rahat-ui/src/utils/dateFormate';
import { UUID } from 'crypto';
import { AlertTriangle, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';

// Define consistent chart colors using enum values
const typeColorsMap: Record<string, string> = {
  [GrievanceType.TECHNICAL]: '#009688',
  [GrievanceType.NON_TECHNICAL]: '#5495DE',
  [GrievanceType.OTHER]: '#B0BEC5',
};

const statusColorsMap: Record<string, string> = {
  [GrievanceStatus.NEW]: '#B0BEC5',
  [GrievanceStatus.UNDER_REVIEW]: '#FBCA14',
  [GrievanceStatus.CLOSED]: '#009688',
  [GrievanceStatus.RESOLVED]: '#5495DE',
};

interface GrievanceOverviewProps {
  className?: string;
}

export default function GrievanceOverview({
  className,
}: GrievanceOverviewProps) {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: overviewData, isLoading } = useGetOverviewStats(projectUUID);
  console.log('overview data', overviewData);

  // Extract data from API response
  const totalGrievances = overviewData?.data?.totalGrievances || 0;
  const grievancesByType = overviewData?.data?.grievanceType || {};
  const grievancesByStatus = overviewData?.data?.grievanceStatus || {};
  const averageResolveTime = (overviewData?.data as any)?.averageResolveTime
    ? formatDuration(overviewData?.data?.averageResolveTime || 0)
    : 0;

  // Mapping functions to convert API keys to enum values
  const mapTypeKeyToEnum = (key: string): string => {
    const typeMap: Record<string, string> = {
      TECHNICAL: GrievanceType.TECHNICAL,
      NON_TECHNICAL: GrievanceType.NON_TECHNICAL,
      OTHER: GrievanceType.OTHER,
    };
    return typeMap[key] || key;
  };

  const mapStatusKeyToEnum = (key: string): string => {
    const statusMap: Record<string, string> = {
      NEW: GrievanceStatus.NEW,
      UNDER_REVIEW: GrievanceStatus.UNDER_REVIEW,
      RESOLVED: GrievanceStatus.RESOLVED,
      CLOSED: GrievanceStatus.CLOSED,
    };
    return statusMap[key] || key;
  };

  // Convert to chart data format for PieChart component using constants
  const typeChartData = Object.entries(grievancesByType).map(
    ([name, value]) => {
      const enumValue = mapTypeKeyToEnum(name);
      const typeConstant = grievanceType.find((t) => t.value === enumValue);
      return {
        label: typeConstant?.label || name,
        value: value as number,
      };
    },
  );

  const statusChartData = Object.entries(grievancesByStatus).map(
    ([name, value]) => {
      const enumValue = mapStatusKeyToEnum(name);
      const statusConstant = grievanceStatus.find((s) => s.value === enumValue);
      return {
        label: statusConstant?.label || name,
        value: value as number,
      };
    },
  );

  // Get colors for charts using mapped enum values
  const typeColors = Object.entries(grievancesByType).map(([name, _]) => {
    const enumValue = mapTypeKeyToEnum(name);
    return typeColorsMap[enumValue] || '#CCCCCC';
  });

  const statusColors = Object.entries(grievancesByStatus).map(([name, _]) => {
    const enumValue = mapStatusKeyToEnum(name);
    return statusColorsMap[enumValue] || '#CCCCCC';
  });

  // Stats for DataCard components
  const stats = [
    {
      icon: <AlertTriangle className="w-5 h-5 text-muted-foreground" />,
      label: 'Total Grievance',
      value: totalGrievances.toString(),
    },
    {
      icon: <Clock className="w-5 h-5 text-muted-foreground" />,
      label: 'Average Resolve Time',
      value: averageResolveTime,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Stats Cards Loading */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border rounded-sm p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}

          {/* Chart Loading States */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`chart-${i}`}
              className="border rounded-sm p-4 flex flex-col h-full min-h-[300px]"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="w-full flex-1 p-4 mt-2 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stats Cards */}
        {stats.map((stat) => {
          return (
            <DataCard
              title={stat.label}
              number={stat.value as string}
              className="rounded-sm w-full"
              key={stat.label}
              truncate={stat.label === 'Average Resolve Time' ? false : true}
            />
          );
        })}

        {/* Grievance Type Chart */}
        <div className="border rounded-sm p-4 flex flex-col h-full min-h-[300px]">
          <h1 className="text-sm/6 font-semibold text-neutral-800 dark:text-white">
            Grievance Type
          </h1>
          <div className="w-full flex-1 p-4 mt-2">
            <PieChart
              chart={{
                series: typeChartData,
                colors: typeColors,
              }}
              custom={true}
              projectAA={true}
              donutSize="80%"
              width="100%"
              height="100%"
              type="donut"
            />
          </div>
        </div>

        {/* Grievance Status Chart */}
        <div className="border rounded-sm p-4 flex flex-col h-full min-h-[300px]">
          <h1 className="text-sm/6 font-semibold text-neutral-800 dark:text-white">
            Grievance Status
          </h1>
          <div className="w-full flex-1 p-4 mt-2">
            <PieChart
              chart={{
                series: statusChartData,
                colors: statusColors,
              }}
              custom={true}
              projectAA={true}
              donutSize="80%"
              width="100%"
              height="100%"
              type="donut"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
