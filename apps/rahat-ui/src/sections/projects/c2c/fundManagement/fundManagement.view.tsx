import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useRecentTransactionsList,
  useTokenDetails,
} from '@rahat-ui/query';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { formatDate } from 'apps/rahat-ui/src/utils';
import { shortenAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { UUID } from 'crypto';
import { Banknote, ReceiptText } from 'lucide-react';
import { useParams } from 'next/navigation';
import { formatEther, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { QrModal } from './qr.moda';
import RecentTransaction from './recent.transaction';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';

const FundManagementView = () => {
  const { id }: { id: UUID } = useParams();
  // const projectDetails = useC2CProjectSubgraphStore(
  //   (state) => state.projectDetails,
  // );
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const c2cProjectAddress = contractSettings?.c2cproject?.address;
  const rahatTokenAddress = contractSettings?.rahattoken?.address;
  const rahatTokenAbi = contractSettings?.rahattoken?.abi;

  const { data: transactionList, isLoading: isFetchingTransactionList } =
    useRecentTransactionsList(c2cProjectAddress);
  const tokenDetails = useTokenDetails();

  const { data: projectBalance, isLoading } = useReadContract({
    address: rahatTokenAddress,
    abi: rahatTokenAbi,
    functionName: 'balanceOf',
    args: [c2cProjectAddress],
    query: {
      select(data: unknown) {
        return data
          ? formatUnits(data as bigint, tokenDetails.data as number)
          : '0';
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
      <div className="bg-secondary">
        <div className="grid grid-cols-2 gap-4">
          <DataCard
            className="my-2 mx-2"
            title="Project Balance"
            smallNumber={isLoading ? 'Loading...' : `${projectBalance} USDC`}
            Icon={Banknote}
          />
          <Card
            className={
              'flex flex-col rounded justify-center border-none shadow bg-card my-2 mx-2'
            }
          >
            <CardHeader className="pb-2 p-4">
              <div className="flex items-start justify-between ">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-md font-normal text-neutral-800 dark:text-white text-lg">
                    {'Project Contract Address'}
                  </CardTitle>
                </div>

                <div className="bg-indigo-50 dark:bg-secondary rounded-full h-8 w-8 flex items-center justify-center">
                  <ReceiptText
                    size={20}
                    strokeWidth={1.5}
                    className="text-primary "
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-xl font-normal text-primary flex items-center gap-4">
                  <HoverCard>
                    <HoverCardTrigger>
                      {shortenAddress(c2cProjectAddress)}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full text-sm bg-secondary px-2 py-1">
                      {c2cProjectAddress}
                    </HoverCardContent>
                  </HoverCard>
                  <QrModal projectAddress={c2cProjectAddress} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {isFetchingTransactionList ? (
          <div className="flex justify-center items-center h-[calc(100vh-220px)]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 h-[calc(100vh-180px)]">
            <div className="col-span-2 bg-card ml-2 rounded shadow mb-2">
              <ChartLine series={mySeries} categories={chartCategories} />
            </div>
            {/* <RecentTransaction transactions={transactionList} /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default FundManagementView;
