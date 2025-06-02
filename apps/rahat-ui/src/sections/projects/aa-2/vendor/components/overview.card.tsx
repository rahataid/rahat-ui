import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { ChartDonut } from 'libs/shadcn/src/components/charts';
import React from 'react';

type Props = {
  data: any;
  loading: boolean;
};
export default function OverviewCard({ data, loading }: Props) {
  const balance = data?.balances?.filter((a) => a.asset_code);
  const series = [
    parseFloat(balance?.[0]?.balance || '0'),
    Number(data?.assignedTokens || 0),
    Number(data?.disbursedTokens || 0),
  ];
  return (
    <div className="border rounded-md p-4">
      <div className="mb-4">
        <p className="text-lg font-semibold">Token Overview</p>
        <p className="text-sm text-muted-foreground">
          Overview of token assigned to the vendor
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          {loading ? (
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          ) : (
            <ChartDonut
              series={series}
              labels={['Balance', 'Assign_Token', 'Disbursed_Token']}
              donutSize="80%"
              width={250}
              height={200}
              showLegend={false}
              colors={['#297AD6', '#2A9D90', '#E76E50']}
            />
          )}
          <p className="text-primary font-semibold text-xl">
            {balance?.[0]?.balance || 0}
          </p>
          <p className="text-sm font-medium">Vendor Balance</p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="border rounded-md p-4 bg-blue-50">
            <p className="text-xs">Remaining Tokens</p>
            <p className="text-2xl font-semibold">12,000</p>
          </div>
          <div className="border rounded-md p-4 bg-green-50">
            <p className="text-xs">Assigned Tokens</p>
            <p className="text-2xl font-semibold">
              {data?.assignedTokens || 0}
            </p>
          </div>
          <div className="border rounded-md p-4 bg-red-50">
            <p className="text-xs">Disbursed Tokens</p>
            <p className="text-2xl font-semibold">
              {data?.disbursedTokens || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
