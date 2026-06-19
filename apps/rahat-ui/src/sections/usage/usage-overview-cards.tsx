'use client';

import { DataCard } from '../../common/data.card';
import { Radio, CheckCircle, XCircle, Coins } from 'lucide-react';

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
  const successRate =
    totals && totals.broadcasts > 0
      ? ((totals.success / totals.broadcasts) * 100).toFixed(1)
      : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard
        title="Total Broadcasts"
        number={String(totals?.broadcasts ?? 0)}
        Icon={Radio}
        loading={loading}
        subtitle="Messages sent"
      />
      <DataCard
        title="Success Rate"
        number={`${successRate}%`}
        Icon={CheckCircle}
        loading={loading}
        subtitle={`${totals?.success ?? 0} delivered`}
        iconStyle="text-green-600 bg-green-100"
      />
      <DataCard
        title="Failed"
        number={String(totals?.fail ?? 0)}
        Icon={XCircle}
        loading={loading}
        subtitle="Delivery failures"
        iconStyle="text-red-600 bg-red-100"
      />
      <DataCard
        title="Credits Used"
        number={String(totals?.credits ?? 0)}
        Icon={Coins}
        loading={loading}
        subtitle="Total credits consumed"
        iconStyle="text-amber-600 bg-amber-100"
      />
    </div>
  );
}
