'use client';

import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import { CircleDollarSign, ArrowUpRight, Clock, ArrowLeftRight } from 'lucide-react';

type Props = {
  tokenStats: {
    assignedTokens: number;
    disbursedTokens: number;
    pendingDisbursement: number;
    redeemedTokens: number;
  };
};

export default function TokenStatsCard({ tokenStats }: Props) {
  const items = [
    { Icon: CircleDollarSign, label: 'Assigned Tokens', value: tokenStats?.assignedTokens ?? 0 },
    { Icon: ArrowUpRight, label: 'Disbursed Tokens', value: tokenStats?.disbursedTokens ?? 0 },
    { Icon: Clock, label: 'Pending Disbursement', value: tokenStats?.pendingDisbursement ?? 0 },
    { Icon: ArrowLeftRight, label: 'Redeemed Tokens', value: tokenStats?.redeemedTokens ?? 0 },
  ];

  return (
    <div>
      <Heading title="Token Stats" titleStyle="text-lg" description="Overview of token distribution" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {items.map((item) => (
          <DataCard
            key={item.label}
            Icon={item.Icon}
            title={item.label}
            number={item.value.toString()}
            className="rounded-sm w-full"
          />
        ))}
      </div>
    </div>
  );
}
