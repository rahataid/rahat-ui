'use client';

import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import { CircleDollarSign, ArrowUpRight, Clock, ArrowLeftRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

type Props = {
  tokenStats: {
    assignedTokens: number;
    disbursedTokens: number;
    pendingDisbursement: number;
    redeemedTokens: number;
  };
};

export default function TokenStatsCard({ tokenStats }: Props) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const items = [
    { Icon: CircleDollarSign, label: t('ASSIGNED_TOKENS'), value: tokenStats?.assignedTokens ?? 0 },
    { Icon: ArrowUpRight, label: t('DISBURSED_TOKENS'), value: tokenStats?.disbursedTokens ?? 0 },
    { Icon: Clock, label: t('PENDING_DISBURSEMENT'), value: tokenStats?.pendingDisbursement ?? 0 },
    { Icon: ArrowLeftRight, label: t('REDEEMED_TOKENS'), value: tokenStats?.redeemedTokens ?? 0 },
  ];

  return (
    <div>
      <Heading title={t('TOKEN_STATS')} titleStyle="text-lg" description={t('OVERVIEW_OF_TOKEN_DISTRIBUTION')} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {items.map((item) => (
          <DataCard
            key={item.label}
            Icon={item.Icon}
            title={item.label}
            number={formatNum(item.value)}
            className="rounded-sm w-full"
          />
        ))}
      </div>
    </div>
  );
}
