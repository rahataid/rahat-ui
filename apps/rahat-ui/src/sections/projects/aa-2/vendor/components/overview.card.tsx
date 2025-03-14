import { ChartDonut } from 'libs/shadcn/src/components/charts';
import React from 'react';

export default function OverviewCard() {
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
          <ChartDonut
            series={[12000, 5000, 1000]}
            labels={[]}
            donutSize="80%"
            width={250}
            height={200}
            showLegend={false}
            colors={['#297AD6', '#2A9D90', '#E76E50']}
          />
          <p className="text-primary font-semibold text-3xl">23,000</p>
          <p className="text-sm font-medium">Project Balance</p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="border rounded-md p-4 bg-blue-50">
            <p className="text-xs">Remaining Tokens</p>
            <p className="text-2xl font-semibold">12,000</p>
          </div>
          <div className="border rounded-md p-4 bg-green-50">
            <p className="text-xs">Assigned Tokens</p>
            <p className="text-2xl font-semibold">5,000</p>
          </div>
          <div className="border rounded-md p-4 bg-red-50">
            <p className="text-xs">Disbursed Tokens</p>
            <p className="text-2xl font-semibold">1,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
