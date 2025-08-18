'use client';

import type React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  PROJECT_SETTINGS_KEYS,
  useGetBalance,
  useGetTransactions,
  useProjectSettingsStore,
} from '@rahat-ui/query';

import { UUID } from 'crypto';
import TransferList from './transfer.list';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FundProgressTracker from './fund.transfer.progress';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

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
  const getBalance = useGetBalance(uuid);

  const transfers = useMemo(() => {
    const now = new Date().toISOString();

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

      // Map successful transactions (flows)
      const successfulTransfers = entity.flows.map(
        (flow: any, index: number) => ({
          id: `${entity.alias}-flow-${index}`, // unique ID for flows
          from: flow.from,
          to: flow.to,
          amount: flow.amount,
          timestamp: now, // You can replace this with the actual timestamp if available
          status: flow.type === 'sent' ? 'sent' : ('received' as const),
          transactionHash: flow.transactionHash, // Include transaction hash if needed
          comments: '', // optional
        }),
      );

      // Combine pending and successful transactions
      return [...pendingTransfers, ...successfulTransfers];
    });
  }, [isFetched, transactions]);

  const [balances, setBalance] = useState<
    { alias: string; balance: number; received: number }[]
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
                <>
                  <p className="text-gray-500">Loading...</p>
                </>
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
