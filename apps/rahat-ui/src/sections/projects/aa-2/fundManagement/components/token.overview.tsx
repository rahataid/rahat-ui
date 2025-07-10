import React, { useCallback, useEffect, useState } from 'react';
// import { dFMTransactionsData } from '../static';
import { BarChart } from 'libs/shadcn/src/components/charts';
import { DataCard, Heading, TransactionCard } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import {
  useFetchTokenStatsStellar,
  useGroupsReservedFunds,
  usePagination,
  useProjectAction,
} from '@rahat-ui/query';
import TokenOverviewSkeleton from './token.overview.skeleton';
import { UUID } from 'crypto';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { useChains } from 'connectkit';

export default function TokensOverview() {
  const uuid = useParams().id;
  const projectId = uuid as UUID;
  const { data, isLoading } = useFetchTokenStatsStellar({
    projectUUID: uuid as '${string}-${string}-${string}-${string}-${string}',
  });
  const chains = useChains();
  const { pagination } = usePagination();
  const { data: groupsFundsData } = useGroupsReservedFunds(projectId, {
    page: pagination.page,
    perPage: 99999,
    sort: 'updatedAt',
    order: 'desc',
  });

  const tokenStatus = () => {
    let disbursedValue = 0;
    let failedValue = 0;
    let notDisbursedValue = 0;

    groupsFundsData?.data?.forEach(({ status, numberOfTokens = 0 }) => {
      const stat = status?.toUpperCase();
      if (stat === 'DISBURSED') {
        disbursedValue += numberOfTokens;
      } else if (stat === 'FAILED') {
        failedValue += numberOfTokens;
      } else notDisbursedValue += numberOfTokens;
    });
    return [
      { label: 'Disbursed', value: disbursedValue },
      { label: 'Failed', value: failedValue },
      { label: 'Not Disbursed', value: notDisbursedValue },
    ];
  };

  const disbursedValue = groupsFundsData?.data
    ?.filter((item) => item.status === 'DISBURSED')
    .reduce((acc, dat) => acc + dat.numberOfTokens, 0);
  console.log(groupsFundsData);
  return (
    <>
      <Heading
        title="Tokens Overview"
        titleStyle="text-lg"
        description="Overview of your tokens"
      />
      {!isLoading ? (
        <div className="grid xl:grid-cols-3  lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
          <DataCard
            className="rounded-sm"
            title={'Token Disbursed'}
            number={disbursedValue}
          />

          <DataCard
            className="rounded-sm"
            title={'1 Token Value'}
            number={'Rs 10'}
          />
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
      <div className="flex flex-wrap flex-col xl:flex-row mt-4 gap-4">
        <div className="flex-1 border rounded-sm p-4">
          <h1 className="text-lg font-medium mb-4">Payout Type</h1>
          <div className="w-full aspect-square">
            <PieChart
              title="Token Status"
              chart={{
                colors: ['#2A9D90', '#E53935', '#BDBDBD'],
                series: tokenStatus(),
              }}
              custom={true}
              projectAA={true}
              donutSize="80%"
              width="100%"
              height="100%"
              type="donut"
            />
          </div>
        </div>

        <div className="flex-[2] border rounded-sm p-4">
          <TransactionCard
            cardTitle="Recent Transactions"
            cardData={groupsFundsData?.data?.filter(
              (item) => item.status !== 'NOT_DISBURSED',
            )}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
