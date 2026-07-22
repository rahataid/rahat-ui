'use client';

import { DataCard } from '../../common/data.card';
import { Radio, CheckCircle, XCircle, Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Usage');

  const successRate =
    totals && totals.broadcasts > 0
      ? ((totals.success / totals.broadcasts) * 100).toFixed(1)
      : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard
        title={t('TOTAL_BROADCASTS')}
        number={String(totals?.broadcasts ?? 0)}
        Icon={Radio}
        loading={loading}
        subtitle={t('MESSAGES_SENT')}
      />
      <DataCard
        title={t('SUCCESS_RATE')}
        number={`${successRate}%`}
        Icon={CheckCircle}
        loading={loading}
        subtitle={`${totals?.success ?? 0} ${t('DELIVERED')}`}
        iconStyle="text-green-600 bg-green-100"
      />
      <DataCard
        title={t('FAILED')}
        number={String(totals?.fail ?? 0)}
        Icon={XCircle}
        loading={loading}
        subtitle={t('DELIVERY_FAILURES')}
        iconStyle="text-red-600 bg-red-100"
      />
      <DataCard
        title={t('CREDITS_USED')}
        number={String(totals?.credits ?? 0)}
        Icon={Coins}
        loading={loading}
        subtitle={t('TOTAL_CREDITS_CONSUMED')}
        iconStyle="text-amber-600 bg-amber-100"
      />
    </div>
  );
}
