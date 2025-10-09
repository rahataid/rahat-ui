'use client';

import type React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  ConfirmReceipt,
  PROJECT_SETTINGS_KEYS,
  useGetBeneficiaryBalance,
  useGetCash,
  useGetTransactions,
  useProjectSettingsStore,
} from '@rahat-ui/query';

import { UUID } from 'crypto';
import TransferList from './transfer.list';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FundProgressTracker from './fund.transfer.progress';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useUserCurrentUser } from '@rumsan/react-query';
import SpinnerLoader from '../../../../components/spinner.loader';
import { AARoles } from '@rahat-ui/auth';
import { User } from 'lucide-react';

// Types for our fund transfer system
type StakeholderType =
  | 'UNICEF Nepal HQ'
  | 'UNICEF Field Office'
  | 'Municipality';
type TransferStatus = 'pending' | 'sent' | 'received';

export type Entities = {
  alias: string;
  address: string;
  privatekey: string;
  smartaccount: string;
};

export interface FundTransfer {
  id: string;
  fundId: string;
  from: StakeholderType;
  to: StakeholderType;
  amount: number;
  timestamp: string;
  status: TransferStatus;
  transactionHash?: string;
  comments?: string;
  attachments?: string[];
}

export function CashTracker() {
  const uuid = useParams().id as UUID;
  const router = useRouter();

  const entities = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.ENTITIES],
  );
  const { data: transactions, isFetched } = useGetTransactions(uuid);
  const { data: beneficiaryBalance } = useGetBeneficiaryBalance(uuid);
  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return entities?.find((e: Entities) =>
      currentUser?.data?.roles?.includes(e.alias.replace(/\s+/g, '')),
    );
  }, [currentUser, entities]);

  const getCash = useGetCash(uuid);
  const confirmReceipt = async (payload: ConfirmReceipt) => {
    await getCash.mutateAsync({
      payload: payload,
    });
  };

  const transfers = useMemo(() => {
    const now = new Date().toISOString();
    const uniqueTransactionHashes = new Set();

    const allTransfers = transactions?.data?.entityOutcomes?.flatMap(
      (entity: any) => {
        const resolveAlias = (address: string) =>
          entities?.find(
            (e: Entities) =>
              e.smartaccount.toLocaleLowerCase() ===
              address?.toLocaleLowerCase(),
          )?.alias;
        // Map pending transactions
        const pendingTransfers = entity.pending.map(
          (p: any, index: number) => ({
            id: `${entity.alias}-pending-${index}`, // unique ID for pending
            from: entities?.find(
              (e: Entities) =>
                e.smartaccount.toLocaleLowerCase() ===
                p.from.toLocaleLowerCase(),
            )?.alias,
            to: entity.alias,
            amount: p.amount,
            timestamp: p.timestamp || now,
            status: 'pending' as const,
            comments: `Awaiting confirmation by ${entity.alias}`,
          }),
        );
        // Map successful transactions (flows) and filter duplicates
        const successfulTransfers = entity.approved
          ?.filter((flow: any) => {
            if (uniqueTransactionHashes.has(flow.transactionHash)) {
              return false; // Skip duplicate transactions
            }
            uniqueTransactionHashes.add(flow.transactionHash);
            return true;
          })
          .map((flow: any, index: number) => ({
            id: `${entity.alias}-flow-${index}`, // unique ID for flows
            from: entities?.find(
              (e: Entities) =>
                e.smartaccount.toLocaleLowerCase() ===
                flow.from.toLocaleLowerCase(),
            )?.alias,
            to: entity.alias,
            amount: flow.amount,
            timestamp: flow?.timestamp,
            status: flow.type === 'sent' ? 'sent' : ('received' as const),
            transactionHash: flow.transactionHash, // Include transaction hash if needed
            comments:
              // Budget created when funds originate and end at the same entity
              resolveAlias(flow.from) === entity.alias && flow.type !== 'sent'
                ? 'Budget Created'
                : flow.type === 'received'
                ? `Claimed by ${entity.alias}`
                : `Fund transfer from ${resolveAlias(flow.from) || 'Unknown'}`,
          }));

        // Combine pending and successful transactions
        return [...pendingTransfers, ...successfulTransfers];
      },
    );
    return allTransfers?.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [isFetched, transactions]);

  //get current entity pending transfer
  const pendingTransfers = useMemo(() => {
    if (!transactions?.data?.entityOutcomes || !currentEntity?.alias) {
      return [];
    }

    const entity = transactions.data.entityOutcomes.find(
      (entity: any) => entity.alias === currentEntity.alias,
    );

    if (!entity?.pending || entity?.pending.length === 0) {
      return [];
    }

    return entity.pending;
  }, [transactions?.data?.entityOutcomes, currentEntity?.alias]);
  console.log({ pendingTransfers });

  const [balances, setBalance] = useState<
    {
      alias: string;
      balance: number;
      received: number;
      sent: number;
      date: Date;
    }[]
  >([]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (transactions?.data?.entityOutcomes.length > 0) {
        transactions?.data?.entityOutcomes?.map((entity: any) => {
          setBalance((prev) => [
            ...prev,
            {
              alias: entity.alias,
              balance: Number(Number(entity.balance).toFixed(2)) || 0, // Default to 0 if balance is not available
              received:
                entity.alias === 'Beneficiary'
                  ? beneficiaryBalance?.data
                  : Number(Number(entity.received).toFixed(2)) || 0,
              sent: Number(Number(entity.sent).toFixed(2)) || 0,
              date: entity.date || null,
            },
          ]);
        });
      } else {
        setBalance([]);
      }
    };
    setBalance([]);
    fetchBalances();
  }, [transactions]);
  balances.find((b) => b.alias === currentEntity?.alias)?.balance;

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Cash Tracker</h2>
          <p className="text-gray-500 mt-1">Track your cash flow here.</p>
        </div>
        <div className="flex gap-3">
          {currentUser?.data?.roles?.includes(AARoles.UNICEFNepalCO) && (
            <>
              <Button
                onClick={() =>
                  router.push(
                    `/projects/aa/${uuid}/fund-management/cash-tracker/initiate`,
                  )
                }
                className="text-blue-500 border-blue-500 hover:bg-blue-50"
                variant="outline"
              >
                Initiate Fund Transfer
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/projects/aa/${uuid}/fund-management/cash-tracker/budget`,
                  )
                }
                className="bg-blue-500 hover:bg-blue-600"
              >
                Create Budget
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active Fund Transfer Tracker */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Active Fund Transfer Tracker
                </CardTitle>
                {currentEntity && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                      <User size={18} color="white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">User:</span>
                      <span>{currentEntity.alias}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <FundProgressTracker
                balances={balances}
                transfers={transactions?.data?.entityOutcomes}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Transfer History */}
        <div>
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold">
                Transfer History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isFetched ? (
                <TransferList
                  transfers={transfers}
                  entities={entities}
                  pendingTransfers={pendingTransfers}
                  currentEntity={currentEntity}
                  onConfirmReceipt={confirmReceipt}
                />
              ) : (
                <div className="flex justify-center p-6">
                  <SpinnerLoader />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
