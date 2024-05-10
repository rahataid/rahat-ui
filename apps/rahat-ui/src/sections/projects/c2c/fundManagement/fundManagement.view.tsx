import React from 'react';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Banknote, ReceiptText } from 'lucide-react';
import RecentTransaction from './recent.transaction';
import { useC2CProjectSubgraphStore } from '@rahataid/c2c-query';
import { formatEther } from 'viem';

const FundManagementView = () => {
  const mySeries = [
    {
      name: 'Series 1',
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    },
  ];
  const projectDetails = useC2CProjectSubgraphStore(
    (state) => state.projectDetails,
  );
  return (
    <>
      <div className="grid grid-cols-2 gap-4 m-2">
        <DataCard
          className=""
          title="Project Balance"
          smallNumber={`${formatEther(
            BigInt(projectDetails.tokenBalance.balance),
          )} USDC`}
          subTitle="Total"
          Icon={Banknote}
        />
        <DataCard
          className=""
          title="Project Contract Address"
          smallNumber={'0x67FA...B91396'}
          subTitle=""
          Icon={ReceiptText}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ChartLine series={mySeries} />
        </div>
        <RecentTransaction />
      </div>
    </>
  );
};

export default FundManagementView;
