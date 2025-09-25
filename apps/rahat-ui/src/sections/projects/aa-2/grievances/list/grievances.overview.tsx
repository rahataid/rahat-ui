'use client';

import { useGrievanceList } from '@rahat-ui/query';
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

  // Fetch grievances data
  const { data: grievancesData, isLoading } = useGrievanceList({
    page: 1,
    perPage: 1000, // Get all grievances for overview
    order: 'desc',
    sort: 'createdAt',
    projectUUID,
  });

  // Mock data for demonstration - replace with actual API data when ready
  const mockGrievances = [
    { type: GrievanceType.NON_TECHNICAL, status: GrievanceStatus.NEW },
    { type: GrievanceType.TECHNICAL, status: GrievanceStatus.CLOSED },
    { type: GrievanceType.NON_TECHNICAL, status: GrievanceStatus.UNDER_REVIEW },
    { type: GrievanceType.OTHER, status: GrievanceStatus.RESOLVED },
    { type: GrievanceType.TECHNICAL, status: GrievanceStatus.NEW },
    { type: GrievanceType.NON_TECHNICAL, status: GrievanceStatus.CLOSED },
    { type: GrievanceType.OTHER, status: GrievanceStatus.NEW },
    { type: GrievanceType.TECHNICAL, status: GrievanceStatus.UNDER_REVIEW },
    { type: GrievanceType.NON_TECHNICAL, status: GrievanceStatus.RESOLVED },
    { type: GrievanceType.TECHNICAL, status: GrievanceStatus.CLOSED },
    { type: GrievanceType.OTHER, status: GrievanceStatus.UNDER_REVIEW },
    { type: GrievanceType.NON_TECHNICAL, status: GrievanceStatus.NEW },
    { type: GrievanceType.TECHNICAL, status: GrievanceStatus.RESOLVED },
    { type: GrievanceType.OTHER, status: GrievanceStatus.CLOSED },
    { type: GrievanceType.NON_TECHNICAL, status: GrievanceStatus.UNDER_REVIEW },
  ];

  // Use mock data for now
  const grievances = mockGrievances;
  const totalGrievances = grievances.length;

  // Calculate average resolve time (mock calculation)
  const averageResolveTime = '12 hours 10 min 60 sec';

  // Group grievances by type
  const grievancesByType = grievances.reduce((acc: any, grievance: any) => {
    const type = grievance.type || GrievanceType.OTHER;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Group grievances by status
  const grievancesByStatus = grievances.reduce((acc: any, grievance: any) => {
    const status = grievance.status || GrievanceStatus.NEW;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Convert to chart data format for PieChart component using constants
  const typeChartData = Object.entries(grievancesByType).map(
    ([name, value]) => {
      const typeConstant = grievanceType.find((t) => t.value === name);
      return {
        label: typeConstant?.label || name,
        value: value as number,
      };
    },
  );

  const statusChartData = Object.entries(grievancesByStatus).map(
    ([name, value]) => {
      const statusConstant = grievanceStatus.find((s) => s.value === name);
      return {
        label: statusConstant?.label || name,
        value: value as number,
      };
    },
  );

  // Get colors for charts using original enum values
  const typeColors = Object.entries(grievancesByType).map(
    ([name, _]) => typeColorsMap[name] || '#CCCCCC',
  );

  const statusColors = Object.entries(grievancesByStatus).map(
    ([name, _]) => statusColorsMap[name] || '#CCCCCC',
  );

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
              number={stat.value}
              className="rounded-sm w-full"
              key={stat.label}
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
