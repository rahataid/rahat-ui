import { DataCard, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import RecentPayout from './recent.payout';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';

import { PayoutOverviewProps } from 'apps/rahat-ui/src/types/payout';
import { CloudDownloadIcon } from 'lucide-react';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { exportPayoutStats, hasPayoutData } from '../utils/payout.utils';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';

export default function PayoutOverview({
  payoutStats,
  payouts,
  statsPayout,
  handleDateChange,
  handleClearDate,
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
  const hasData = hasPayoutData(statsPayout);
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <Heading
          title={`Payout Overview`}
          description="Overview of your payouts"
          titleStyle="font-medium text-lg"
        />
        <div className="flex gap-2 items-center">
          <TooltipWrapper
            tip={hasData ? '' : 'No payout data available to export'}
          >
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              handleClick={() => exportPayoutStats(statsPayout)}
              name={'Export Report'}
              variant="outline"
              disabled={!hasData}
              className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
            />
          </TooltipWrapper>

          <DateRangePicker
            placeholder="Pick date range"
            handleDateChange={handleDateChange}
            handleClearDate={handleClearDate}
            type="range"
            className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
          />
        </div>
      </div>
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
