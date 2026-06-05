'use client';

import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Users, FileText } from 'lucide-react';
import { DataCard, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useGetGctData } from '@rahat-ui/query';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';

const ALLOCATION_COLORS = ['#009688', '#B0BEC5'];
const STATUS_COLORS = ['#009688', '#FBCA14', '#B0BEC5', '#DC3545'];

export default function GctOverview() {
  const { id } = useParams();
  const { data, isPending } = useGetGctData(id as UUID);

  const stats = data?.data ?? data ?? null;

  const totalAllocated = stats?.totalAllocatedAmount ?? 0;
  const totalDisbursed = stats?.totalDisbursedAmount ?? 0;
  const disbursed = stats?.disbursedCount ?? 0;
  const pending = stats?.pendingCount ?? 0;
  const notStarted = stats?.notStartedCount ?? 0;
  const failed = stats?.failedCount ?? 0;
  const totalRecords = disbursed + pending + notStarted + failed;

  const allocationData = [
    { label: 'Disbursed', value: totalDisbursed },
    { label: 'Remaining', value: Math.max(0, totalAllocated - totalDisbursed) },
  ];

  const statusData = [
    { label: 'Disbursed', value: disbursed },
    { label: 'Pending', value: pending },
    { label: 'Not Started', value: notStarted },
    { label: 'Failed', value: failed },
  ];

  const cards = [
    {
      title: 'Total Groups',
      number: String(stats?.totalGroups ?? 0),
      infoTooltip: 'All active GCT groups registered in this project.',
    },
    {
      title: 'Total Fund Records',
      number: String(totalRecords),
      infoTooltip: 'Total number of fund assignment records across all groups.',
    },
    {
      title: 'Total Allocated Amount',
      number: totalAllocated.toLocaleString(),
      infoTooltip: 'Sum of all fund record amounts assigned to groups.',
      truncate: false,
    },
    {
      title: 'Total Disbursed Amount',
      number: totalDisbursed.toLocaleString(),
      infoTooltip: 'Sum of amounts from records that have been fully disbursed.',
      truncate: false,
    },
  ];

  if (isPending) return <SpinnerLoader />;

  return (
    <div className="pt-2 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ Icon, ...card }) => (
          <DataCard
            key={card.title}
            title={card.title}
            number={card.number}
            Icon={Icon}
            loading={false}
            className="rounded-sm"
            infoIcon
            infoTooltip={card.infoTooltip}
            truncate={card.truncate ?? true}
          />
        ))}
      </div>

      {/* Pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Allocation vs Disbursed */}
        <div className="border rounded-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm/6 font-semibold text-neutral-800 dark:text-white">
              Allocated vs Disbursed
            </h2>
            <span
              title="Compares total allocated funds against the amount already disbursed."
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
            Total allocated:{' '}
            <span className="font-medium text-foreground">
              {totalAllocated.toLocaleString()}
            </span>{' '}
            &nbsp;·&nbsp; Disbursed:{' '}
            <span className="font-medium text-foreground">
              {totalDisbursed.toLocaleString()}
            </span>
          </p>
          <div className="w-full aspect-square max-h-[260px]">
            <DynamicPieChart pieData={allocationData} colors={ALLOCATION_COLORS} isLoading={false} />
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
            <DynamicPieChart pieData={statusData} colors={STATUS_COLORS} isLoading={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
