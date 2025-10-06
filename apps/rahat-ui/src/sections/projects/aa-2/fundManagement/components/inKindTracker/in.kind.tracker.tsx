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
import { Entities, InKindTransfer } from './types';

export function InKindTracker() {
  const uuid = useParams().id as UUID;
  const router = useRouter();

  // Mock data for training purposes
  const entities: Entities[] = [
    { alias: 'UNICEF', name: 'UNICEF', type: 'UNICEF' },
    { alias: 'NGO', name: 'NGO Partner', type: 'NGO' },
    {
      alias: 'Distributor (Wards)',
      name: 'Distributor (Wards)',
      type: 'Distributor (Wards)',
    },
    { alias: 'Beneficiaries', name: 'Beneficiaries', type: 'Beneficiaries' },
  ];

  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return entities?.find((e: Entities) =>
      currentUser?.data?.roles?.includes(
        e.alias.toLowerCase().replace(/\s+/g, ''),
      ),
    );
  }, [currentUser, entities]);

  // Mock balances for training
  const [balances, setBalances] = useState([
    { alias: 'UNICEF', balance: 10000, received: 10000 },
    { alias: 'NGO', balance: 8000, received: 8000 },
    { alias: 'Distributor (Wards)', balance: 5000, received: 5000 },
    { alias: 'Beneficiaries', balance: 0, received: 0 },
  ]);

  // Mock transfers for training
  const transfers: InKindTransfer[] = [
    {
      id: '1',
      from: 'UNICEF',
      to: 'NGO',
      amount: 10000,
      status: 'received',
      timestamp: '2024-01-15T10:00:00Z',
      type: 'in-kind',
      items: [
        { name: 'Food Packages', quantity: 100, unit: 'packages' },
        { name: 'Medical Supplies', quantity: 50, unit: 'boxes' },
      ],
      comments: 'Initial distribution to NGO partner',
    },
    {
      id: '2',
      from: 'NGO',
      to: 'Distributor (Wards)',
      amount: 8000,
      status: 'received',
      timestamp: '2024-01-16T14:30:00Z',
      type: 'in-kind',
      items: [
        { name: 'Food Packages', quantity: 80, unit: 'packages' },
        { name: 'Medical Supplies', quantity: 40, unit: 'boxes' },
      ],
      comments: 'Distribution to ward level distributors',
    },
    {
      id: '3',
      from: 'Distributor (Wards)',
      to: 'Beneficiaries',
      amount: 5000,
      status: 'pending',
      timestamp: '2024-01-17T09:15:00Z',
      type: 'in-kind',
      items: [
        { name: 'Food Packages', quantity: 50, unit: 'packages' },
        { name: 'Medical Supplies', quantity: 25, unit: 'boxes' },
      ],
      comments: 'Pending distribution to beneficiaries',
    },
  ];

  const confirmReceipt = async (transferId: string) => {
    // Mock confirmation for training
    console.log('Confirming receipt for transfer:', transferId);
    // In real implementation, this would call an API
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">In-kind Tracker</h2>
        <p className="text-gray-500">
          Track your in-kind distribution flow here
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Active In-kind Distribution Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InKindProgressTracker
                balances={balances}
                transfers={transfers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Distribution History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <InKindTransferList transfers={transfers} entities={entities} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Initiate Distribution
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Items</span>
                  <span className="font-medium">150 packages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Distributed</span>
                  <span className="font-medium text-green-600">
                    100 packages
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium text-amber-600">
                    50 packages
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
