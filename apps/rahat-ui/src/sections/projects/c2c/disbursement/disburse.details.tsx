'use client';

import { useGetDisbursement } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { UUID } from 'crypto';
import { WalletCards } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DataCard from '../../../../components/dataCard';
import { ApprovalTable } from './approvals.table';
import { TransactionTable } from './transactions.table';
import { useChains } from 'connectkit';
import { useChainId, useConnect, useConnections } from 'wagmi';
import { useInfoByCurrentChain } from 'apps/rahat-ui/src/hooks/use-info-by-current-chain';

export default function DisburseDetails() {
  const { id: projectUUID, uuid } = useParams() as {
    id: UUID;
    uuid: UUID;
  };
  const { data } = useGetDisbursement(projectUUID, uuid);
  const chainInfo = useInfoByCurrentChain();

  console.log('chains', chainInfo);
  console.log('data', data);
  const date = new Date(data?.createdAt);
  const datePart = date.toDateString().split(' ').slice(1).join(' ');
  const timePart = date.toTimeString().split(' ')[0].slice(0, 5);

  const amount = data?.amount;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2">
        <Card className="mt-2 rounded shadow">
          <div className="mt-3">
            <CardContent>
              <p className="text-primary">
                {datePart} - {timePart}
              </p>
              <CardDescription>Disbursed on</CardDescription>
            </CardContent>
            <CardContent>
              <Badge className="bg-green-200 text-green-800">
                {data?.status}
              </Badge>
              <CardDescription>Status</CardDescription>
            </CardContent>
          </div>
        </Card>
        <DataCard
          className="mt-2"
          title="Total Disburse Amount"
          number={formatted}
        />
        <DataCard
          className="mt-2"
          title="Total Beneficiaries"
          number={data?._count?.DisbursementBeneficiary}
        />
        <DataCard
          className="mt-2"
          title="Disbursement Type"
          number={data?.type}
        />
      </div>
      <div className="mt-2 w-full">
        <Tabs defaultValue="transactions">
          <div className="flex justify-between items-center">
            <Card className="rounded h-14 w-full mr-2 flex items-center justify-between">
              <TabsList className="gap-2">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                {data?.type === 'MULTISIG' && (
                  <TabsTrigger value="referrals">Approvals</TabsTrigger>
                )}
              </TabsList>
              {/* //TODO get safe wallet from backend */}
              {data?.type === 'MULTISIG' && (
                <div className="mr-2">
                  <Button asChild>
                    <Link
                      className="flex items-center gap-2"
                      href={chainInfo.safeURL}
                      target="_blank"
                    >
                      <WalletCards strokeWidth={1.5} size={18} />
                      SafeWallet
                    </Link>
                  </Button>
                </div>
              )}
            </Card>
          </div>
          <TabsContent value="transactions">
            <TransactionTable />
          </TabsContent>
          <TabsContent value="referrals">
            <ApprovalTable disbursement={data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
