'use client';

import { DataCard } from '../../common/data.card';
import { Radio, CheckCircle, XCircle, Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

type UsageTotals = {
  sessions: number;
  broadcasts: number;
  success: number;
  fail: number;
  chars: number;
  segments: number;
  duration: number;
  calls: number;
  credits: number;
};

type UsageOverviewCardsProps = {
  totals?: UsageTotals;
  loading?: boolean;
};

export default function UsageOverviewCards({
  totals,
  loading,
}: UsageOverviewCardsProps) {
  const t = useTranslations('USAGE');
  const formatNum = useNumberFormat();

  const successRate =
    totals && totals.broadcasts > 0
      ? ((totals.success / totals.broadcasts) * 100).toFixed(1)
      : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard
        title={t('TOTAL_BROADCASTS')}
        number={formatNum(totals?.broadcasts ?? 0)}
        Icon={Radio}
        loading={loading}
        subtitle={t('MESSAGES_SENT')}
      />
      <DataCard
        title={t('SUCCESS_RATE')}
        number={`${formatNum(successRate)}%`}
        Icon={CheckCircle}
        loading={loading}
        subtitle={`${formatNum(totals?.success ?? 0)} ${t('DELIVERED')}`}
        iconStyle="text-green-600 bg-green-100"
      />
      <DataCard
        title={t('FAILED')}
        number={formatNum(totals?.fail ?? 0)}
        Icon={XCircle}
        loading={loading}
        subtitle={t('DELIVERY_FAILURES')}
        iconStyle="text-red-600 bg-red-100"
      />
      <DataCard
        title={t('CREDITS_USED')}
        number={formatNum(totals?.credits ?? 0)}
        Icon={Coins}
        loading={loading}
        subtitle={t('TOTAL_CREDITS_CONSUMED')}
        iconStyle="text-amber-600 bg-amber-100"
      />
    </div>
  );
}
