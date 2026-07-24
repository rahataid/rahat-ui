'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { DataCard, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useGetGctData } from '@rahat-ui/query';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';
import { useNumberFormat } from '../../../../../utils/useNumberFormat';

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
  const t = useTranslations('AA Project with Cash Tracker');
  const tGlobal = useTranslations('GLOBAL');
  const { id } = useParams();
  const { data, isPending } = useGetGctData(id as UUID);

  const stats = data?.data ?? data ?? null;
  const formatNum = useNumberFormat();

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
    { label: t('BALANCE'), value: Math.max(0, treasuryBalance) },
    { label: t('ALLOCATED'), value: totalAllocated },
    { label: t('DISBURSED'), value: totalDisbursed },
  ];

  const statusData = [
    { label: t('DISBURSED'), value: disbursed },
    { label: t('PENDING'), value: pending },
    { label: t('NOT_STARTED'), value: notStarted },
    { label: tGlobal('FAILED'), value: failed },
    { label: t('TOKEN_TRANSFERRED'), value: tokenDisbursed },
    { label: t('REJECTED'), value: rejected },
  ];

  const cards = [
    {
      title: t('TOTAL_FUND_TRANSFERRED'),
      value: formatNum(totalDisbursed),
      subtitle: t('TOTAL_FUNDS_TRANSFERRED_TO_GROUPS'),
      show: totalDisbursed !== 0,
    },
    {
      title: t('REMAINING_BALANCE'),
      value: formatNum(treasuryBalance),
      subtitle: t('TOTAL_BALANCE_REMAINING_IN_TREASURY'),
      show: treasuryBalance !== 0,
    },
    {
      title: t('TOTAL_FUNDS_ASSIGNED'),
      value: formatNum(totalAllocated),
      subtitle: t('TOTAL_FUNDS_ASSIGNED_TO_GROUPS'),
      show: totalAllocated !== 0,
    },
    {
      title: t('TOTAL_GCT_GROUPS'),
      value: totalGroups,
      subtitle: t('GROUPS_REGISTERED_FOR_GCT'),
      show: true,
    },
    {
      title: t('TOTAL_ASSIGNED_RECORDS'),
      value: totalRecords,
      subtitle: t('FUND_ASSIGNMENT_RECORDS'),
      show: true,
    },
    {
      title: t('TOTAL_DISBURSED_COUNT'),
      value: disbursed,
      subtitle: t('TOTAL_RECORDS_TRANSFERRED_TO_GROUPS'),
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
            smallNumber={formatNum(card.value)}
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
              {t('TREASURY_STATUS')}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {t('BALANCE')}:{' '}
            <span className="font-medium text-foreground">
              {formatNum(treasuryBalance)}
            </span>
            &nbsp;·&nbsp; {t('ALLOCATED')}:{' '}
            <span className="font-medium text-foreground">
              {formatNum(totalAllocated)}
            </span>
            &nbsp;·&nbsp; {t('DISBURSED')}:{' '}
            <span className="font-medium text-foreground">
              {formatNum(totalDisbursed)}
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
              {t('RECORD_STATUS_BREAKDOWN')}
            </h2>
            <span
              title={t('DISTRIBUTION_OF_FUND_RECORDS')}
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
            {t('TOTAL_RECORDS')}{' '}
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
