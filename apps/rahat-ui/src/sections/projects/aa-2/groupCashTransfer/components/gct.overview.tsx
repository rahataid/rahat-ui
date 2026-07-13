'use client';

import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { DataCard, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useGetGctData } from '@rahat-ui/query';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';

const TREASURY_COLORS = ['#009688', '#FBCA14', '#B0BEC5'];
const STATUS_COLORS = [
  '#009688',
  '#FBCA14',
  '#B0BEC5',
  '#DC3545',
  '#6366F1',
  '#F43F5E',
];

export default function GctOverview() {
  const { id } = useParams();
  const { data, isPending } = useGetGctData(id as UUID);

  const stats = data?.data ?? data ?? null;

  const totalAllocated = stats?.totalAllocatedAmount ?? 0;
  const totalDisbursed = stats?.totalDisbursedAmount ?? 0;
  const treasuryBalance = stats?.treasuryBalance ?? 0;
  const disbursed = stats?.disbursedCount ?? 0;
  const tokenDisbursed = stats?.tokenDisbursedCount ?? 0;
  const pending = stats?.pendingCount ?? 0;
  const notStarted = stats?.notStartedCount ?? 0;
  const failed = stats?.failedCount ?? 0;
  const rejected = stats?.rejectedCount ?? 0;
  const totalRecords = stats?.totalRecords ?? 0;
  const totalGroups = stats?.totalGroups ?? 0;

  const treasuryData = [
    { label: 'Balance', value: Math.max(0, treasuryBalance) },
    { label: 'Allocated', value: totalAllocated },
    { label: 'Disbursed', value: totalDisbursed },
  ];

  const statusData = [
    { label: 'Disbursed', value: disbursed },
    { label: 'Pending', value: pending },
    { label: 'Not Started', value: notStarted },
    { label: 'Failed', value: failed },
    { label: 'Token transferred', value: tokenDisbursed },
    { label: 'Rejected', value: rejected },
  ];

  const cards = [
    {
      title: 'Total Fund Transferred',
      value: totalDisbursed.toLocaleString(),
      subtitle: 'Total funds transferred to groups',
      show: totalDisbursed !== 0,
    },
    {
      title: 'Remaining balance',
      value: treasuryBalance.toLocaleString(),
      subtitle: 'Total balance remaining in treasury',
      show: treasuryBalance !== 0,
    },
    {
      title: 'Total Funds Assigned',
      value: totalAllocated.toLocaleString(),
      subtitle: 'Total funds assigned to groups',
      show: totalAllocated !== 0,
    },
    {
      title: 'Total GCT Groups',
      value: totalGroups,
      subtitle: 'Groups registered for GCT',
      show: true,
    },
    {
      title: 'Total Assigned Records',
      value: totalRecords,
      subtitle: 'Fund assignment records',
      show: true,
    },
    {
      title: 'Total Disbursed Count',
      value: disbursed,
      subtitle: 'Total records transferred to groups',
      show: disbursed !== 0,
    },
  ].filter((c) => c.show);

  if (isPending) return <SpinnerLoader />;

  return (
    <div className="pt-2 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <DataCard
            key={card.title}
            className="rounded-sm h-[116px]"
            title={card.title}
            smallNumber={String(card.value)}
            subtitle={card.subtitle}
            loading={false}
          />
        ))}
      </div>

      {/* Pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Treasury Status */}
        <div className="border rounded-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm/6 font-semibold text-neutral-800 dark:text-white">
              Treasury Status
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Balance:{' '}
            <span className="font-medium text-foreground">
              {treasuryBalance.toLocaleString()}
            </span>
            &nbsp;·&nbsp; Allocated:{' '}
            <span className="font-medium text-foreground">
              {totalAllocated.toLocaleString()}
            </span>
            &nbsp;·&nbsp; Disbursed:{' '}
            <span className="font-medium text-foreground">
              {totalDisbursed.toLocaleString()}
            </span>
          </p>
          <div className="w-full aspect-square max-h-[260px]">
            <DynamicPieChart
              pieData={treasuryData}
              colors={TREASURY_COLORS}
              isLoading={false}
            />
          </div>
        </div>

        {/* Record status breakdown */}
        <div className="border rounded-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm/6 font-semibold text-neutral-800 dark:text-white">
              Record Status Breakdown
            </h2>
            <span
              title="Distribution of fund records by their current status: Disbursed, Pending, Not Started, or Failed."
              className="text-muted-foreground cursor-help"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Total records:{' '}
            <span className="font-medium text-foreground">{totalRecords}</span>
          </p>
          <div className="w-full aspect-square max-h-[260px]">
            <DynamicPieChart
              pieData={statusData}
              colors={STATUS_COLORS}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
