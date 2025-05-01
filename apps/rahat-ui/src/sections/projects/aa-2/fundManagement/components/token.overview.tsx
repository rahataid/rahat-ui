import React, { useEffect, useState } from 'react';
// import { dFMTransactionsData } from '../static';
import { BarChart, PieChart } from 'libs/shadcn/src/components/charts';
import { DataCard, Heading, TransactionCard } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { useProjectAction } from '@rahat-ui/query';

export default function TokensOverview() {
  const projectBalance = useProjectAction();

  const uuid = useParams().id;

  const [data, setData] = useState<any>();
  const [transactions, setTransactions] = useState<any>();

  const fetchTokenStats = async () => {
    const response = await projectBalance.mutateAsync({
      uuid: uuid as '${string}-${string}-${string}-${string}-${string}',
      data: {
        action: 'aa.stellar.getStellarStats',
        payload: {},
      },
    });
    setData(response.data.tokenStats);
    setTransactions(response.data.transactionStats);
  };

  useEffect(() => {
    fetchTokenStats();
  }, []);

  return (
    <>
      <Heading
        title="Tokens Overview"
        titleStyle="text-lg"
        description="Overview of your tokens"
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {data?.map((i: any) => (
          <DataCard
            key={i.name}
            className="rounded-sm"
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
          cardData={transactions}
        />
        {/* <TransactionCard cardTitle="Recent Transactions" cardData={[]} /> */}
      </div>
    </>
  );
}
