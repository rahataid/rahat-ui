'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';
import { ActivityStats, OVERVIEW_STATUSES } from './activitiesOverview.utils';

const { COMPLETED, WORK_IN_PROGRESS, NOT_STARTED, DELAYED } = ACTIVITY_STATUS;

const STATUS_STYLE: Record<string, { bar: string; text: string }> = {
  [COMPLETED]: {
    bar: 'bg-green-600',
    text: 'text-green-700 dark:text-green-400',
  },
  [WORK_IN_PROGRESS]: {
    bar: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
  },
  [NOT_STARTED]: {
    bar: 'bg-gray-300 dark:bg-gray-600',
    text: 'text-muted-foreground',
  },
  [DELAYED]: { bar: 'bg-red-600', text: 'text-red-700 dark:text-red-400' },
};

type IProps = {
  stats: ActivityStats;
  loading?: boolean;
};

export default function ActivitiesOverviewInsights({ stats, loading }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();

  const toCounts = (get: (status: string) => number | undefined) =>
    OVERVIEW_STATUSES.map((status) => ({ status, count: get(status) ?? 0 }));

  const phaseRows = stats.phases.map((name, idx) => {
    const counts = toCounts((status) => stats.statusByPhase[status]?.[idx]);
    return {
      name,
      counts,
      total: counts.reduce((sum, c) => sum + c.count, 0),
    };
  });

  const outreach = [
    { label: t('AUTOMATED'), value: stats.automated },
    { label: t('MANUAL'), value: stats.manual },
    { label: t('WITH_COMMUNICATION'), value: stats.withCommunication },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ProgressListCard
        title={t('ACTIVITY_BY_PHASE')}
        isEmpty={phaseRows.length === 0}
        loading={loading}
      >
        {phaseRows.map((row) => (
          <StatusBarRow
            key={row.name}
            label={row.name}
            total={row.total}
            counts={row.counts}
          />
        ))}
      </ProgressListCard>

      <ProgressListCard
        title={t('ACTIVITY_BY_CATEGORY')}
        isEmpty={stats.categories.length === 0}
        loading={loading}
      >
        {stats.categories.map((category) => (
          <StatusBarRow
            key={category.name}
            label={translateValue(t, category.name, { fallbackStyle: 'raw' })}
            total={category.total}
            counts={toCounts((status) => category.counts[status])}
          />
        ))}
      </ProgressListCard>

      <div className="w-full border bg-white rounded-sm shadow p-6 lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-700">
          {t('AUTOMATION_AND_OUTREACH')}
        </h3>
        {loading ? (
          <TableLoader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 mt-4">
            {outreach.map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="font-semibold text-gray-800">
                  {formatNum(item.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressListCard({
  title,
  isEmpty,
  loading,
  children,
}: {
  title: string;
  isEmpty: boolean;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-sm p-2 flex flex-col h-full min-h-[200px] sm:min-h-[300px] min-w-0">
      <h1 className="text-sm font-medium">{title}</h1>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <TableLoader />
        </div>
      ) : isEmpty ? (
        <div className="flex-1 flex items-center justify-center">
          <NoResult size="small" />
        </div>
      ) : (
        <div className="flex flex-col gap-5 p-4 pr-3 max-h-[280px] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

function StatusBarRow({
  label: title,
  total,
  counts,
}: {
  label: string;
  total: number;
  counts: { status: string; count: number }[];
}) {
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();

  const share = (count: number) => (total ? (count / total) * 100 : 0);
  const completed = counts.find((c) => c.status === COMPLETED)?.count ?? 0;
  const label = (status: string) => translateValue(tg, status);

  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold">
        <span className="truncate text-foreground" title={title}>
          {title}
        </span>
        <span className="shrink-0 whitespace-nowrap text-muted-foreground">
          {formatNum(completed)} / {formatNum(total)} {label(COMPLETED)} (
          {formatNum(Math.round(share(completed)))}%)
        </span>
      </div>

      <div className="w-full h-3 rounded-full bg-secondary flex overflow-hidden">
        {counts.map(({ status, count }) =>
          count > 0 ? (
            <div
              key={status}
              style={{ width: `${share(count)}%` }}
              className={`${STATUS_STYLE[status].bar} h-full transition-all`}
              title={`${label(status)}: ${formatNum(count)}`}
            />
          ) : null,
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-0.5">
        {counts.map(({ status, count }) => (
          <span
            key={status}
            className={`flex items-center gap-1.5 ${STATUS_STYLE[status].text}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${STATUS_STYLE[status].bar}`}
            />
            {label(status)}: {formatNum(count)}
          </span>
        ))}
      </div>
    </div>
  );
}
