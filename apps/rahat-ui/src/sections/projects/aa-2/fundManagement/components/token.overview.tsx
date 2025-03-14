import React from 'react';
import { FMTokensOverviewData, FMTransactionsData } from '../static';
import { BarChart, PieChart } from 'libs/shadcn/src/components/charts';
import { DataCard, Heading, TransactionCard } from 'apps/rahat-ui/src/common';

export default function TokensOverview() {
  return (
    <>
      <Heading
        title="Tokens Overview"
        titleStyle="text-lg"
        description="Overview of your tokens"
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {FMTokensOverviewData?.map((i) => (
          <DataCard
            key={i.name}
            className="rounded-md"
            title={i.name}
            number={i.amount}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <PieChart
          title="Token Status"
          chart={{
            colors: ['#F4A462', '#2A9D90'],
            series: [
              { label: 'Redemeed', value: 5 },
              { label: 'Not Redemeed', value: 4 },
            ],
          }}
          height={385}
        />
        <BarChart
          custom
          title="Total tokens redeemed"
          series={['10', '5', '30', '7']}
          categories={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
          yaxisLabels={false}
          height={374}
        />
        <TransactionCard
          cardTitle="Recent Transactions"
          cardData={FMTransactionsData}
        />
        {/* <TransactionCard cardTitle="Recent Transactions" cardData={[]} /> */}
      </div>
    </>
  );
}
