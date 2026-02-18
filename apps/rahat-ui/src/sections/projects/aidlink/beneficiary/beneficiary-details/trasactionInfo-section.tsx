import { Coins } from 'lucide-react';
import {
  amountFormat,
  PROJECT_SETTINGS_KEYS,
  TransactionDetails,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'urql';
import { TransactionsObject } from '../../../c2c/beneficiary/types';
import { mergeTransactions } from '@rahat-ui/query/lib/c2c/utils';
import TransactionTable from './transactionHistory';
import { formatUnits } from 'viem';
import { useReadRahatTokenDecimals } from 'apps/rahat-ui/src/hooks/c2c/contracts/rahatToken';
import { OfframpAccumulatorType } from './beneficiaryDetails';

interface ITrasactionInfoSectionProps {
  walletAddress: string;
  totalDisbursedAmount: number;
  calculateOfframpData: OfframpAccumulatorType;
  isPending: boolean;
}

const TransactionInfoSection = ({
  walletAddress,
  totalDisbursedAmount,
  calculateOfframpData,
  isPending,
}: ITrasactionInfoSectionProps) => {
  const [transactionList, setTransactionList] = useState<any>([]);
  const uuid = useParams().id as UUID;

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data: benfBalance } = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken?.address,
    args: [walletAddress as `0x${string}`],
  });

  const { data: tokenNumber } = useReadRahatTokenDecimals({
    address: contractSettings?.rahattoken?.address,
  });

  const cardData = useMemo(
    () => [
      {
        label: 'Available Balance',
        value:
          amountFormat(
            formatUnits(benfBalance ?? BigInt(0), Number(tokenNumber)),
          ) || 0,
      },
      { label: 'Disbursed Amount', value: totalDisbursedAmount || 0 },
      { label: 'Off-ramped Amount', value: calculateOfframpData.total || 0 },
    ],
    [calculateOfframpData, totalDisbursedAmount, benfBalance, tokenNumber],
  );

  const contractAddress = contractSettings?.c2cproject?.address;

  const [{ data, fetching, error }] = useQuery({
    query: TransactionDetails,
    variables: {
      contractAddress,
      to: walletAddress,
      first: 50,
      skip: 0,
    },
    pause: !contractAddress || !walletAddress,
    requestPolicy: 'cache-and-network',
  });

  const newTransactionHistoryData = useMemo(() => {
    return (
      transactionList?.map((item: any) => ({
        date: item?.date,
        amount: formatUnits(item?._amount, Number(tokenNumber)),
      })) || []
    );
  }, [transactionList]);

  useEffect(() => {
    if (data && !error) {
      (async () => {
        try {
          const transactionsObject: TransactionsObject = data;
          const transactionLists = await mergeTransactions(transactionsObject);
          setTransactionList(transactionLists);
        } catch {
          setTransactionList([]);
        }
      })();
    }
  }, [data, error]);

  return (
    <>
      {/* Card Data Grid */}
      <div className="grid grid-cols-3 gap-4">
        {cardData?.map((item, index) => (
          <div key={index} className="rounded-sm bg-card p-4 shadow border">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-sm font-medium">{item.label}</h1>
              <Coins className="text-gray-500" size={18} strokeWidth={2.5} />
            </div>
            <p className="text-primary font-semibold text-xl">{item.value}</p>
          </div>
        ))}
      </div>
      {/* Transaction History Component */}
      <div className="flex flex-col lg:flex-row gap-6">
        <TransactionTable
          title="TRANSACTION HISTORY"
          description="List of all the transactions made"
          isLoading={fetching}
          error={error}
          data={newTransactionHistoryData}
        />
        <TransactionTable
          title="OFF-RAMPED HISTORY"
          description="List of all the off-ramps"
          isLoading={isPending}
          isDisplayStatus
          error={error}
          data={calculateOfframpData.transactions}
        />
      </div>
    </>
  );
};

export default TransactionInfoSection;
