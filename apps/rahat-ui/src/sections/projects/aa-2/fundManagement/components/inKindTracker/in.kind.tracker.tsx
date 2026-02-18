'use client';

import type React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

import { UUID } from 'crypto';
import InKindTransferList from './in.kind.transfer.list';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InKindProgressTracker from './in.kind.progress.tracker';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useUserCurrentUser } from '@rumsan/react-query';
import SpinnerLoader from '../../../../components/spinner.loader';
import { Entities } from './types';
import { Plus, User } from 'lucide-react';
import {
  PROJECT_SETTINGS_KEYS,
  useGetInkind,
  useGetInkindTransactions,
  useProjectSettingsStore,
  ConfirmReceipt,
} from '@rahat-ui/query';
import { AARoles } from '@rahat-ui/auth';

export function InKindTracker() {
  const uuid = useParams().id as UUID;
  const router = useRouter();

  const entities = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.INKIND_ENTITIES],
  );

  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return (
      entities?.find((e: Entities) =>
        currentUser?.data?.roles?.includes(e.alias.replace(/\s+/g, '')),
      ) || entities[0]
    ); // Default to first entity for demo
  }, [currentUser, entities]);

  const { data: transactions, isFetched } = useGetInkindTransactions(uuid);
  const getInkind = useGetInkind(uuid);

  const [balances, setBalances] = useState<
    { alias: string; balance: number; received: number }[]
  >([]);

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
        const pendingTransfers = entity.pending?.map(
          (p: any, index: number) => ({
            id: `${entity.alias}-pending-${index}`,
            from: entities?.find(
              (e: Entities) =>
                e.smartaccount.toLocaleLowerCase() ===
                p.from.toLocaleLowerCase(),
            )?.alias,
            to: entity.alias,
            amount: p.amount,
            timestamp: p.timestamp || now,
            status: 'pending' as const,
            type: 'in-kind' as const,
            items: [],
            comments: `Awaiting confirmation by ${entity.alias}`,
          }),
        );

        const successfulTransfers = entity.approved
          ?.filter((flow: any) => {
            if (!flow.transactionHash) return true;
            if (uniqueTransactionHashes.has(flow.transactionHash)) {
              return false;
            }
            uniqueTransactionHashes.add(flow.transactionHash);
            return true;
          })
          .map((flow: any, index: number) => ({
            id: `${entity.alias}-flow-${index}`,
            from: entities?.find(
              (e: Entities) =>
                e.smartaccount.toLocaleLowerCase() ===
                flow.from.toLocaleLowerCase(),
            )?.alias,
            to: entity.alias,
            amount: flow.amount,
            timestamp: flow?.timestamp || now,
            status: flow.type === 'sent' ? 'sent' : ('received' as const),
            type: 'in-kind' as const,
            items: [],
            comments: !resolveAlias(flow.from)
              ? 'Stock Created'
              : flow.type === 'received'
              ? `Claimed by ${entity.alias}`
              : `In-kind transfer from ${resolveAlias(flow.from) || 'Unknown'}`,
          }));

        return [...(pendingTransfers || []), ...(successfulTransfers || [])];
      },
    );
    return allTransfers?.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [transactions, entities]);

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

  const confirmReceipt = async (payload: ConfirmReceipt) => {
    await getInkind.mutateAsync({
      payload: payload,
    });
  };

  useEffect(() => {
    const list = transactions?.data?.entityOutcomes || [];
    if (list.length > 0) {
      const mapped = list.map((entity: any) => ({
        alias: entity.alias,
        balance: Number(Number(entity.balance).toFixed(2)) || 0,
        received: Number(Number(entity.received).toFixed(2)) || 0,
      }));
      setBalances(mapped);
    } else {
      setBalances([]);
    }
  }, [transactions]);

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            In-kind Tracker
          </h2>
          <p className="text-gray-500 mt-1">Track your in-kind flow here.</p>
        </div>
        <div className="flex gap-3">
          {currentUser?.data?.roles?.includes(AARoles.UNICEFNepalCO) && (
            <>
              <Button
                onClick={() =>
                  router.push(
                    `/projects/aa/${uuid}/fund-management/inkind-tracker/initiate`,
                  )
                }
                className="text-blue-500 border-blue-500 hover:bg-blue-50"
                variant="outline"
              >
                Initiate In-kind Transfer
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/projects/aa/${uuid}/fund-management/inkind-tracker/stock`,
                  )
                }
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus /> Add Stock
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active In-kind Tracker */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  In-kind Transfer Tracker
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
              {isFetched ? (
                <InKindProgressTracker
                  balances={balances}
                  transfers={transactions?.data?.entityOutcomes}
                />
              ) : (
                <div className="flex justify-center p-6">
                  <SpinnerLoader />
                </div>
              )}
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
                <InKindTransferList
                  transfers={transfers as any}
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
