import React from 'react';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Banknote, ReceiptText } from 'lucide-react';
import RecentTransaction from './recent.transaction';
import { useC2CProjectSubgraphStore } from '@rahat-ui/query';
import { formatEther } from 'viem';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { shortenAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { useReadContract } from 'wagmi';
import { useReactTable } from '@tanstack/react-table';

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

  const { id } = useParams();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data, error, isLoading } = useReadContract({
    address: contractSettings?.rahattoken?.address,
    abi: contractSettings?.rahattoken?.abi,
    functionName: 'balanceOf',
    args: [contractSettings?.c2cproject?.address],
  });

  const projectBalance = isLoading ? '0' : formatEther(BigInt(data));

  return (
    <>
      <div className="grid grid-cols-2 gap-4 m-2">
        <DataCard
          className=""
          title="Project Balance"
          smallNumber={`${projectBalance} USDC`}
          subTitle="Total"
          Icon={Banknote}
        />
        <DataCard
          className=""
          title="Project Contract Address"
          smallNumber={shortenAddress(contractSettings?.c2cproject?.address)}
          subTitle=""
          Icon={ReceiptText}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ChartLine series={mySeries} />
        </div>
        <RecentTransaction
          contractAddress={contractSettings?.c2cproject?.address}
        />
      </div>
    </>
  );
};

export default FundManagementView;
