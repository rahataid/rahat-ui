import { Coins } from 'lucide-react';

import {
  PROJECT_SETTINGS_KEYS,
  TransactionDetails,
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

const demoData = [
  {
    _id: '68010281bb9b1807bb1a08ff',
    phoneNumber: '+123457890',
    txHash:
      '0x722caa3d734e169b344234a28c4b961616a67286c1e7ad88fcd4e58bae5b9c40',
    provider: 'KotaniPay',
    cryptoAmount: 25,
    fiatConversionAmount: 125.76050000000001,
    fiatTxAmount: 124.5,
    fiatCurrency: 'KES',
    token: 'USDT',
    fee: 1.257605,
    txReferenceId: '+1234567890-1744896627624',
    createdAt: '2025-04-17T13:30:41.273Z',
    updatedAt: '2025-04-17T13:30:41.273Z',
    __v: 0,
  },
  {
    _id: '68010281bb9b1807bb1a08fg',
    phoneNumber: '+123457890',
    txHash:
      '0x722caa3d734e169b344234a28c4b961616a67286c1e7ad88fcd4e58bae5b9c40',
    provider: 'KotaniPay',
    cryptoAmount: 50,
    fiatConversionAmount: 125.76050000000001,
    fiatTxAmount: 124.5,
    fiatCurrency: 'KES',
    token: 'USDT',
    fee: 1.257605,
    txReferenceId: '+1234567890-1744896627624',
    createdAt: '2025-04-17T13:30:41.273Z',
    updatedAt: '2025-04-17T13:30:41.273Z',
    __v: 0,
  },
];

interface ITrasactionInfoSectionProps {
  walletAddress: string;
  totolDisburbeAmout: number;
}

const TrasactionInfoSection = ({
  walletAddress,
  totolDisburbeAmout,
}: ITrasactionInfoSectionProps) => {
  const transformedData = demoData.reduce<any>(
    (acc, item) => {
      // Add to total
      acc.total += item.cryptoAmount;

      // Push each transaction
      acc.transactions.push({
        date: item.updatedAt,
        amount: item.cryptoAmount,
      });

      return acc;
    },
    { total: 0, transactions: [] }, // initial value
  );

  const cardData = useMemo(
    () => [
      {
        label: 'Available Balance',
        value: totolDisburbeAmout - transformedData.total || 0,
      },
      { label: 'Disbursed Amount', value: totolDisburbeAmout || 0 },
      { label: 'Off-ramped Amount', value: transformedData.total || 0 },
    ],
    [transformedData],
  );

  const [transactionList, setTransactionList] = useState<any>([]);
  const uuid = useParams().id as UUID;

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
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
          isLoading={fetching}
          error={error}
          data={transformedData.transactions}
        />
      </div>
    </>
  );
};

export default TrasactionInfoSection;
