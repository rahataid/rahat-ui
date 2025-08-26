'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Copy, Users, Banknote, CircleCheckBig } from 'lucide-react';
import { Heading } from 'apps/rahat-ui/src/common';

export default function MultiSigWalletView() {
  const multisigData = {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C89',
    balance: '50,000.00 USDC',
    threshold: '2 of 3',
    owners: [
      { address: '0x1234...5678', name: 'Project Manager', status: 'active' },
      { address: '0x9876...5432', name: 'Finance Officer', status: 'active' },
      { address: '0x5555...1111', name: 'Director', status: 'active' },
    ],
    recentTransactions: [
      {
        id: 1,
        type: 'Disbursement',
        amount: '1,500.00 USDC',
        status: 'Executed',
        date: '2025-07-03',
      },
      {
        id: 2,
        type: 'Disbursement',
        amount: '2,000.00 USDC',
        status: 'Pending',
        date: '2025-07-03',
      },
      {
        id: 3,
        type: 'Deposit',
        amount: '10,000.00 USDC',
        status: 'Executed',
        date: '2025-07-02',
      },
    ],
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50 h-[calc(100vh-58px)]">
      <Heading
        title="Gnosis Wallet Overview"
        description="Overview of your gnosis wallet"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-sm text-green-500 bg-green-50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Banknote strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{multisigData.balance}</div>
          </CardContent>
        </Card>

        <Card className="rounded-sm text-purple-500 bg-purple-50 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Signature Threshold
            </CardTitle>
            <CircleCheckBig strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{multisigData.threshold}</div>
          </CardContent>
        </Card>

        <Card className="rounded-sm text-blue-500 bg-blue-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
            <Users strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {multisigData.owners.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-sm lg:text-base">
              Multisig Wallet Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-sm">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Wallet Address
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  {multisigData.address}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Authorized Owners
              </h4>
              <div className="space-y-2">
                {multisigData.owners.map((owner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-sm"
                  >
                    <div>
                      <p className="text-sm text-gray-600 font-mono">
                        {owner.address}
                      </p>
                    </div>
                    <Badge className="bg-green-50 text-green-600 border-green-500 font-medium">
                      {owner.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-sm lg:text-base">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {multisigData.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 border rounded-sm"
                >
                  <div>
                    <p className="text-sm font-medium">{tx.type}</p>
                    <p className="text-xs text-gray-600">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{tx.amount}</p>
                    <Badge
                      className={
                        tx.status === 'Executed'
                          ? 'bg-green-50 text-green-600 border-green-500 font-medium'
                          : 'bg-orange-50 text-orange-600 border-orange-500 font-medium'
                      }
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
