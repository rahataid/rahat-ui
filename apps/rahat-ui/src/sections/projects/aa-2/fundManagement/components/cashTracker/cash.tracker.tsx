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
  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return entities?.find(
      (e: Entities) => e.address === currentUser?.data?.wallet,
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

    return transactions?.data?.entityOutcomes?.flatMap((entity: any) => {
      // Map pending transactions
      const pendingTransfers = entity.pending.map((p: any, index: number) => ({
        id: `${entity.alias}-pending-${index}`, // unique ID for pending
        from: entity.alias,
        to: p.to,
        amount: p.amount,
        timestamp: now,
        status: 'pending' as const,
        comments: '', // optional
      }));
      // Map successful transactions (flows) and filter duplicates
      const successfulTransfers = entity.flows
        .filter((flow: any) => {
          if (uniqueTransactionHashes.has(flow.transactionHash)) {
            return false; // Skip duplicate transactions
          }
          uniqueTransactionHashes.add(flow.transactionHash);
          return true;
        })
        .map((flow: any, index: number) => ({
          id: `${entity.alias}-flow-${index}`, // unique ID for flows
          from: flow.from,
          to: flow.to,
          amount: flow.amount,
          timestamp: flow?.timestamp || now,
          status: flow.type === 'sent' ? 'sent' : ('received' as const),
          transactionHash: flow.transactionHash, // Include transaction hash if needed
          comments: '', // optional
        }));

      // Combine pending and successful transactions
      return [...pendingTransfers, ...successfulTransfers];
    });
  }, [isFetched, transactions]);

  //get current entity pending transfer
  const pendingTransfers = useMemo(() => {
    return transfers?.filter(
      (transfer: any) =>
        transfer.status === 'pending' && transfer.to === currentEntity?.alias,
    );
  }, [transfers, currentEntity]);

  const [balances, setBalance] = useState<
    { alias: string; balance: number; received: number; sent: number }[]
  >([]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (transactions?.data?.entityOutcomes.length > 0) {
        transactions?.data?.entityOutcomes?.map((entity: any) => {
          setBalance((prev) => [
            ...prev,
            {
              alias: entity.alias,
              balance: entity.balance || 0, // Default to 0 if balance is not available
              received: entity.received || 0,
              sent: entity.sent || 0,
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Cash Tracker</h2>
        <p className="text-gray-500">Track your cash flow here</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Active Fund Transfer Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FundProgressTracker
                balances={balances}
                transfers={transactions?.data?.entityOutcomes}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Transfer History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isFetched ? (
                <TransferList transfers={transfers} entities={entities} />
              ) : (
                <div className="flex justify-center">
                  <SpinnerLoader />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Fund Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() =>
                  router.push(`/projects/aa/${uuid}/fund-management/initiate`)
                }
                className="w-full"
              >
                Initiate Fund Transfer
              </Button>

              {pendingTransfers?.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() =>
                    confirmReceipt({
                      from: currentEntity?.smartaccount || '',
                      to:
                        entities.find(
                          (e: Entities) => e.alias === pendingTransfers[0].from,
                        )?.smartaccount || '',
                      alias: pendingTransfers[0].to,
                      amount: pendingTransfers[0].amount.toString(),
                    })
                  }
                  className="w-full"
                >
                  {getCash.isPending ? 'Confirming...' : 'Confirm Receipt'}
                </Button>
              )}

              <Card className="bg-gray-50 border-none">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Fund Balance Overview</h3>
                  <div className="space-y-2">
                    {balances.map((balance) => (
                      <div key={balance.alias} className="flex justify-between">
                        <span className="text-sm">{balance.alias}:</span>
                        <span className="font-medium">
                          ${balance.balance.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
