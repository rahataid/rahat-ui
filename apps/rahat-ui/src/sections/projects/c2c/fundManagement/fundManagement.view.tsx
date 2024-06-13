import {
  PROJECT_SETTINGS_KEYS,
  useC2CProjectSubgraphStore,
  useProjectSettingsStore,
  useRecentTransactionsList,
} from '@rahat-ui/query';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { formatDate } from 'apps/rahat-ui/src/utils';
import { shortenAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { Banknote, ReceiptText } from 'lucide-react';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';
import RecentTransaction from './recent.transaction';
import { Transaction } from '../transactions/types';

const FundManagementView = () => {
  const { id } = useParams();
  const projectDetails = useC2CProjectSubgraphStore(
    (state) => state.projectDetails,
  );
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const c2cProjectAddress = contractSettings?.c2cproject?.address;
  const rahatTokenAddress = contractSettings?.rahattoken?.address;
  const rahatTokenAbi = contractSettings?.rahattoken?.abi;

  const { data: transactionList, isLoading: isFetchingTransactionList } =
    useRecentTransactionsList(c2cProjectAddress);

  const { data: projectBalance, isLoading } = useReadContract({
    address: rahatTokenAddress,
    abi: rahatTokenAbi,
    functionName: 'balanceOf',
    args: [c2cProjectAddress],
    query: {
      select(data: bigint) {
        return data ? formatEther(data as bigint) : '0';
      },
    },
  });

  const mySeries = [
    {
      name: 'Recent Deposits',
      data: transactionList.map((t) => Number(formatEther(BigInt(t.value)))),
    },
  ];
  const chartCategories = transactionList.map((t) =>
    formatDate(+t.blockTimestamp),
  );

  // const sortByLatest = transactionList.sort(
  //   (a: Transaction, b: Transaction) => +b.blockTimestamp - +a.blockTimestamp,
  // );

  return (
    <>
      <div className="grid grid-cols-2 gap-4 m-2">
        <DataCard
          title="Project Balance"
          smallNumber={isLoading ? 'Loading...' : `${projectBalance} USDC`}
          Icon={Banknote}
        />
        <DataCard
          title="Project Contract Address"
          smallNumber={shortenAddress(c2cProjectAddress)}
          Icon={ReceiptText}
        />
      </div>
      {isFetchingTransactionList ? (
        <div className="flex justify-center items-center h-[calc(100vh-420px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-420px)]">
          <div className="col-span-2">
            <ChartLine series={mySeries} categories={chartCategories} />
          </div>
          <RecentTransaction transactions={transactionList} />
        </div>
      )}
    </>
  );
};

export default FundManagementView;
