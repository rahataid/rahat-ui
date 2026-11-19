'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { PHASE_COLORS } from '../utils/dashbord-constants';
import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';
import { ActivityStats, OVERVIEW_STATUSES } from './activitiesOverview.utils';

const { COMPLETED } = ACTIVITY_STATUS;

type IProps = {
  stats: ActivityStats;
  // Phase names in backend order; fixes each phase's colour so filtering
  // never repaints a phase.
  phaseOrder: string[];
  loading?: boolean;
};

export default function ActivitiesOverviewInsights({
  stats,
  phaseOrder,
  loading,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();

  // Per phase: total activities and how many are completed.
  const phaseRows = stats.phases.map((name, idx) => {
    const total = OVERVIEW_STATUSES.reduce(
      (sum, s) => sum + (stats.statusByPhase[s]?.[idx] ?? 0),
      0,
    );
    const completed = stats.statusByPhase[COMPLETED]?.[idx] ?? 0;
    const rank = phaseOrder.indexOf(name);
    const colorIdx = rank === -1 ? phaseOrder.length + idx : rank;
    return {
      name,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
      ...PHASE_COLORS[colorIdx % PHASE_COLORS.length],
    };
  });

  const outreach = [
    { label: t('AUTOMATED'), value: stats.automated },
    { label: t('MANUAL'), value: stats.manual },
    { label: t('WITH_COMMUNICATION'), value: stats.withCommunication },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Activity by phase: same colours and Progress as the Main tab */}
      <ProgressListCard
        title={t('ACTIVITY_BY_PHASE')}
        isEmpty={phaseRows.length === 0}
        loading={loading}
      >
        {phaseRows.map((row) => (
          <ProgressRow
            key={row.name}
            label={row.name}
            dotClass={row.color}
            meta={`${t('COUNT_ACTIVITIES', {
              count: formatNum(row.total),
            })} · ${t('PERCENT_DONE', { percent: formatNum(row.percent) })}`}
            percent={row.percent}
            trackClass={row.bgColor}
            indicatorClass={row.color}
          />
        ))}
      </ProgressListCard>

      {/* Progress by category: largest categories first */}
      <ProgressListCard
        title={t('PROGRESS_BY_CATEGORY')}
        isEmpty={stats.categories.length === 0}
        loading={loading}
      >
        {stats.categories.map((category) => (
          <ProgressRow
            key={category.name}
            label={translateValue(t, category.name, { fallbackStyle: 'raw' })}
            meta={`${formatNum(category.completed)}/${formatNum(
              category.total,
            )}`}
            percent={
              category.total
                ? Math.round((category.completed / category.total) * 100)
                : 0
            }
            trackClass="bg-teal-50"
            indicatorClass="bg-teal-500"
          />
        ))}
      </ProgressListCard>

      {/* Automation and outreach */}
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

// Card with a title and a list of progress rows. The list scrolls inside
// the card past ~5 rows, so many phases/categories never stretch the page
// or the card beside it.
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

// One labelled progress bar. Long labels truncate (full text on hover);
// the right-hand figures never wrap.
function ProgressRow({
  label,
  meta,
  percent,
  trackClass,
  indicatorClass,
  dotClass,
}: {
  label: string;
  meta: string;
  percent: number;
  trackClass: string;
  indicatorClass: string;
  dotClass?: string;
}) {
  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 min-w-0 text-gray-900">
          {dotClass && (
            <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
          )}
          <span className="truncate" title={label}>
            {label}
          </span>
        </span>
        <span className="shrink-0 whitespace-nowrap text-gray-600">{meta}</span>
      </div>
      <Progress
        value={percent}
        className={`h-2 ${trackClass}`}
        indicatorColor={indicatorClass}
      />
    </div>
  );
}
