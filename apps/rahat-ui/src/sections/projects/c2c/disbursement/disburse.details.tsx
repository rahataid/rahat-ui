'use client';

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
import DataCard from '../../../../components/dataCard';
import { TransactionTable } from './transactions.table';
import { ApprovalTable } from './approvals.table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useGetDisbursement } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { formatdbDate } from 'apps/rahat-ui/src/utils';

export default function DisburseDetails() {
  const { id: projectUUID, uuid } = useParams() as {
    id: UUID;
    uuid: UUID;
  };
  const { data } = useGetDisbursement(projectUUID, uuid);
  console.log('data', data);
  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2">
        <Card className="mt-2 rounded shadow">
          <div className="mt-3">
            <CardContent>
              <p className="text-primary">{formatdbDate(data?.createdAt)}</p>
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
          number={data?.amount}
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
