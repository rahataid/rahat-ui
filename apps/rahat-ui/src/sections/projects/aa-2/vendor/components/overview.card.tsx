import { useTranslations } from 'next-intl';
import { TOKEN_TO_AMOUNT_MULTIPLIER } from '@rahat-ui/query';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import React from 'react';

type Props = {
  data?: { vendorAssignedBalance?: number | string | null };
  loading: boolean;
  redemptionStats?: { totalTokensApproved?: number | string | null };
  redemptionStatsLoading: boolean;
};

function parseAmount(value: number | string | null | undefined) {
  if (value == null || (typeof value === 'string' && !value.trim())) {
    return undefined;
  }
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : undefined;
}

export default function OverviewCard({
  data,
  loading,
  redemptionStats,
  redemptionStatsLoading,
}: Props) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const disbursed = parseAmount(data?.vendorAssignedBalance);
  const redeemed = parseAmount(redemptionStats?.totalTokensApproved);
  const metrics = [
    { label: t('TOKEN_DISBURSED'), amount: disbursed, loading, color: 'bg-blue-50' },
    { label: t('TOKEN_REDEEMED'), amount: redeemed, loading: redemptionStatsLoading, color: 'bg-blue-50' },
    { label: t('AMOUNT_DISBURSED'), amount: disbursed, loading, color: 'bg-green-50', currency: true },
    { label: t('AMOUNT_REDEEMED'), amount: redeemed, loading: redemptionStatsLoading, color: 'bg-red-50', currency: true },
  ];

  return (
    <div className="border rounded-sm p-4">
      <div className="mb-4">
        <p className="text-lg font-semibold">{t('TOKEN_AND_AMOUNT_DISTRIBUTION')}</p>
        <p className="text-sm text-muted-foreground">
          {t('TOKEN_AMOUNT_DISBURSED_SUMMARY')}
        </p>
      </div>
      <div className="flex flex-col space-y-2">
        {metrics.map((metric) => (
          <div key={metric.label} className={`border rounded-sm p-4 ${metric.color}`}>
            <p className="text-xs">{metric.label}</p>
            {metric.loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-semibold">
                {metric.amount === undefined
                  ? t('N_A')
                  : metric.currency
                  ? `${t('RS')} ${formatNum(metric.amount * TOKEN_TO_AMOUNT_MULTIPLIER)}`
                  : formatNum(metric.amount)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
