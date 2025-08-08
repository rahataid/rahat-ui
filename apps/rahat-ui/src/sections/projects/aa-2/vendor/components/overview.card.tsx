import { TOKEN_TO_AMOUNT_MULTIPLIER } from '@rahat-ui/query';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { formatNumber, trimDecimalZeros } from 'apps/rahat-ui/src/utils/string';
import { ChartDonut } from 'libs/shadcn/src/components/charts';
import React from 'react';

type Props = {
  data: any;
  loading: boolean;
  redemptionStats: any;
  redemptionStatsLoading: boolean;
};
export default function OverviewCard({
  data,
  loading,
  redemptionStats,
  redemptionStatsLoading,
}: Props) {
  console.log('data ', data);
  console.log('redemptionStats', redemptionStats);
  const isBalanceError = data?.balances?.name === 'NotFoundError';

  const balance =
    !isBalanceError && Array.isArray(data?.balances)
      ? data?.balances?.filter((a: any) => a?.asset_code)
      : [];

  const series = [10, 20];

  const vendorBalance = isBalanceError
    ? '-'
    : balance?.[0]?.balance
    ? trimDecimalZeros(balance?.[0]?.balance)
    : '0';

  return (
    <div className="border rounded-sm p-4">
      <div className="mb-4">
        <p className="text-lg font-semibold">Token And Amount Distribution</p>
        <p className="text-sm text-muted-foreground">
          Summary of token and amount disbursed by vendor
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          ) : (
            <ChartDonut
              series={series}
              labels={['Online', 'Offline']}
              donutSize="80%"
              width={250}
              height={200}
              showLegend={true}
              colors={['#2A9D90', '#CFD4DB']}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="border rounded-md p-4 bg-blue-50">
            <p className="text-xs">Token Disbursed</p>
            <p className="text-2xl font-semibold">
              {vendorBalance ? formatNumber(Number(vendorBalance)) : 'N/A'}
            </p>
          </div>
          <div className="border rounded-md p-4 bg-blue-50">
            <p className="text-xs">Token Redeemed</p>
            <p className="text-2xl font-semibold">
              {redemptionStats?.totalTokensApproved
                ? formatNumber(Number(redemptionStats?.totalTokensApproved))
                : 'N/A'}
            </p>
          </div>
          <div className="border rounded-md p-4 bg-green-50">
            <p className="text-xs">Amount Disbursed</p>
            <p className="text-2xl font-semibold">
              {vendorBalance
                ? `Rs. ${formatNumber(
                    Number(vendorBalance) * TOKEN_TO_AMOUNT_MULTIPLIER,
                  )}`
                : 'N/A'}
            </p>
          </div>
          <div className="border rounded-md p-4 bg-red-50">
            <p className="text-xs">Amount Redeemed</p>
            <p className="text-2xl font-semibold">
              {redemptionStats?.totalTokensApproved
                ? `Rs. ${formatNumber(
                    Number(redemptionStats?.totalTokensApproved) *
                      TOKEN_TO_AMOUNT_MULTIPLIER,
                  )}`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
