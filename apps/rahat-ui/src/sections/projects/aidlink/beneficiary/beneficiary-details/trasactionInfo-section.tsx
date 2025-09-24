import { Coins } from 'lucide-react';
import {
  PROJECT_SETTINGS_KEYS,
  TransactionDetails,
  useGetOfframpDetails,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'urql';
import { TransactionsObject } from '../../../c2c/beneficiary/types';
import { mergeTransactions } from '@rahat-ui/query/lib/c2c/utils';
import TransactionTable from './transactionHistory';
import { formatEther } from 'viem';

interface ITrasactionInfoSectionProps {
  walletAddress: string;
  totalDisbursedAmount: number;
  phoneNumber: string;
}

const TransactionInfoSection = ({
  walletAddress,
  totalDisbursedAmount,
  phoneNumber,
}: ITrasactionInfoSectionProps) => {
  const [transactionList, setTransactionList] = useState<any>([]);
  const uuid = useParams().id as UUID;

  const { data: OfframpData, isPending } = useGetOfframpDetails(
    uuid,
    phoneNumber,
  );

  const transformedData = (OfframpData || []).reduce(
    (
      acc: { total: number; transactions: { date: string; amount: number }[] },
      item: any,
    ) => {
      acc.total += item?.cryptoAmount || 0;

      acc.transactions.push({
        date: item.updatedAt,
        amount: item.cryptoAmount,
      });

      return acc;
    },
    { total: 0, transactions: [] },
  );

  const cardData = useMemo(
    () => [
      {
        label: 'Available Balance',
        value: totalDisbursedAmount - transformedData.total || 0,
      },
      { label: 'Disbursed Amount', value: totalDisbursedAmount || 0 },
      { label: 'Off-ramped Amount', value: transformedData.total || 0 },
    ],
    [transformedData, totalDisbursedAmount],
  );

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  const contractAddress = contractSettings?.c2cproject?.address;

  // const {} = useGetOfframpDetails(uuid,);

  const [{ data, fetching, error }] = useQuery({
    query: TransactionDetails,
    variables: {
      contractAddress,
      to: walletAddress,
      first: 50,
      skip: 0,
    },
    pause: !contractAddress,
  });

  const newTransactionHistoryData = useMemo(() => {
    return (
      transactionList?.map((item: any) => ({
        date: item?.date,
        amount: formatEther(item?._amount),
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
          error={error}
          data={transformedData.transactions}
        />
      </div>
    </>
  );
};

export default TransactionInfoSection;
