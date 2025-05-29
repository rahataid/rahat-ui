import React, { useEffect, useState } from 'react';
// import { dFMTransactionsData } from '../static';
import { BarChart, PieChart } from 'libs/shadcn/src/components/charts';
import { DataCard, Heading, TransactionCard } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { useFetchTokenStatsStellar, useProjectAction } from '@rahat-ui/query';
import TokenOverviewSkeleton from './token.overview.skeleton';

export default function TokensOverview() {
  const uuid = useParams().id;

  const { data, isLoading } = useFetchTokenStatsStellar({
    projectUUID: uuid as '${string}-${string}-${string}-${string}-${string}',
  });
  return (
    <>
      <Heading
        title="Tokens Overview"
        titleStyle="text-lg"
        description="Overview of your tokens"
      />
      {!isLoading ? (
        <div className="grid xl:grid-cols-5  md:grid-cols-2 grid-cols-1 gap-4 mb-4">
          {data?.data?.tokenStats.map((i: any) => (
            <DataCard
              key={i.name}
              className="rounded-sm"
              title={i.name}
              number={i.amount}
            />
          ))}
          <a
            target="_blank"
            href={`https://stellar.expert/explorer/testnet/asset/RAHAT-GCVLRQHGZYG32HZE3PKZ52NX5YFCNFDBUZDLUXQYMRS6WVBWSUOP5IYE-2`}
            className="cursor-pointer"
          >
            <DataCard
              className="rounded-sm "
              title={'Token'}
              number={'Rahat'}
            />
          </a>
        </div>
      ) : (
        <TokenOverviewSkeleton number={[1, 2, 3, 4, 5]} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4">
        <PieChart
          title="Token Status"
          chart={{
            colors: ['#F4A462', '#2A9D90'],
            series: [
              { label: 'Redemeed', value: 5 },
              { label: 'Not Redemeed', value: 4 },
            ],
          }}
          height={360}
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
          cardData={data?.data?.transactionStats}
          loading={isLoading}
        />
      </div>
    </>
  );
}
