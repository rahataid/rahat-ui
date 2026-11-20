'use client';

import { useTranslations } from 'next-intl';
import { DataCard } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { ActivityStats } from './activitiesOverview.utils';

const { NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED } = ACTIVITY_STATUS;

type IProps = {
  stats: ActivityStats;
  loading?: boolean;
};

const FooterLine = ({ left, right }: { left: string; right: string }) => (
  <div className="flex items-center justify-between text-xs text-muted-foreground">
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

export default function ActivitiesOverviewCards({ stats, loading }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const tGlobal = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();

  const completed = stats.byStatus[COMPLETED];
  const remaining = stats.total - completed;
  const percentOfTotal = (count: number) =>
    stats.total ? Math.round((count / stats.total) * 100) : 0;
  const completionRate = percentOfTotal(completed);
  const delayed = stats.byStatus[DELAYED];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DataCard
        title={t('COMPLETION')}
        number={`${formatNum(completed)} / ${formatNum(stats.total)}`}
        className="rounded-sm w-full"
        loading={loading}
        truncate={false}
        footer={
          <FooterLine
            left={t('COMPLETION_RATE', {
              percent: formatNum(completionRate),
            })}
            right={t('COUNT_REMAINING', { count: formatNum(remaining) })}
          />
        }
      />
      <DataCard
        title={t('OPEN_ACTIVITIES')}
        number={formatNum(remaining)}
        className="rounded-sm w-full"
        loading={loading}
        footer={
          <FooterLine
            left={t('COUNT_IN_PROGRESS', {
              count: formatNum(stats.byStatus[WORK_IN_PROGRESS]),
            })}
            right={t('COUNT_NOT_STARTED', {
              count: formatNum(stats.byStatus[NOT_STARTED]),
            })}
          />
        }
      />
      <DataCard
        title={translateValue(tGlobal, DELAYED)}
        number={formatNum(delayed)}
        className="rounded-sm w-full"
        loading={loading}
        footer={
          <FooterLine
            left={t('PERCENT_OF_TOTAL', {
              percent: formatNum(percentOfTotal(delayed)),
            })}
            right=""
          />
        }
      />
    </div>
  );
}
