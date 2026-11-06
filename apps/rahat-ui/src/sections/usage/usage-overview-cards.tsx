'use client';

import { DataCard } from '../../common/data.card';
import { Radio, CheckCircle, Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { capitalizeFirstLetter } from '@rahat-ui/query';

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

  const totalBroadcasts = totals?.broadcasts ?? 0;
  const successful = totals?.success ?? 0;
  const failed = totals?.fail ?? 0;
  const pending = Math.max(0, totalBroadcasts - (successful + failed));

  const deliveryRatio = `${formatNum(successful)}/${formatNum(totalBroadcasts)}`;
  const pendingText =
    pending > 0
      ? ` · ${formatNum(pending)} ${capitalizeFirstLetter(t('PENDING')) || 'Pending'}`
      : '';
  const subtitleText = `${formatNum(successful)} ${capitalizeFirstLetter(t('DELIVERED')) || 'Delivered'} · ${formatNum(failed)} ${capitalizeFirstLetter(t('FAILED')) || 'Failed'}${pendingText}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full">
      <DataCard
        title={t('TOTAL_BROADCASTS')}
        number={formatNum(totalBroadcasts)}
        Icon={Radio}
        loading={loading}
        subtitle={t('MESSAGES_SENT')}
        truncate={false}
      />
      <DataCard
        title={t('DELIVERY_STATUS') || 'Delivery Status'}
        number={
          <span
            className={
              deliveryRatio.length > 11
                ? 'text-xl sm:text-2xl xl:text-3xl whitespace-nowrap'
                : 'text-2xl sm:text-3xl whitespace-nowrap'
            }
          >
            {deliveryRatio}
          </span>
        }
        Icon={CheckCircle}
        loading={loading}
        subtitle={subtitleText}
        iconStyle="text-green-600 bg-green-100"
        truncate={false}
      />
      <DataCard
        title={t('CREDITS_USED')}
        number={formatNum(totals?.credits ?? 0)}
        Icon={Coins}
        loading={loading}
        subtitle={t('TOTAL_CREDITS_CONSUMED')}
        iconStyle="text-amber-600 bg-amber-100"
        truncate={false}
      />
    </div>
  );
}
