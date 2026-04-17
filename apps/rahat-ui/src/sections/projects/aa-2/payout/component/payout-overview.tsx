import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import RecentPayout from './recent.payout';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';

import { PayoutOverviewProps } from 'apps/rahat-ui/src/types/payout';

export default function PayoutOverview({
  payoutStats,
  payouts,
  statsPayout,
}: PayoutOverviewProps) {
  const pieDataLabel = [
    {
      label: 'FSP',
      value: statsPayout?.payoutOverview?.payoutTypes?.FSP || 0,
    },
    {
      label: 'CVA',
      value: statsPayout?.payoutOverview?.payoutTypes?.VENDOR || 0,
    },
  ];
  const pieDataStatus = [
    {
      label: 'Success',
      value: statsPayout?.payoutOverview?.payoutStatus?.SUCCESS || 0,
    },
    {
      label: 'Failed',
      value: statsPayout?.payoutOverview?.payoutStatus?.FAILED || 0,
    },
  ];
  return (
    <div className="mt-4">
      <Heading
        title={`Payout Overview`}
        description="Overview of your payouts"
        titleStyle="font-medium text-lg"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
        {payoutStats.map((stat) => {
          return (
            <DataCard
              key={stat.label}
              title={stat.label}
              number={stat.value as string}
              className="rounded-sm h-32"
              infoIcon={stat.infoIcon}
              infoTooltip={stat.infoTooltip}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap mt-4 gap-4">
        <div className="flex-1 border rounded-sm p-4">
          <h1 className="text-lg font-medium mb-4">Payout Type</h1>
          <div className="w-full aspect-square">
            <DynamicPieChart
              pieData={pieDataLabel}
              colors={['#F4A462', '#2A9D90']}
            />
          </div>
        </div>

        <div className="flex-1 border rounded-sm p-4">
          <h1 className="text-lg font-medium mb-4">Payout Status</h1>
          <div className="w-full aspect-square">
            <DynamicPieChart
              pieData={pieDataStatus}
              colors={['#2A9D90', '#DC3545']}
            />
          </div>
        </div>

        <div className="flex-[2] border rounded-sm p-4">
          <RecentPayout payouts={payouts?.data} />
        </div>
      </div>
    </div>
  );
}
