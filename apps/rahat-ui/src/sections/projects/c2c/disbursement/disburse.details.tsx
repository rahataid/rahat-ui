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

export default function DisburseDetails() {
  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2">
        <Card className="mt-2 rounded shadow">
          <div className="mt-3">
            <CardContent>
              <p className="text-primary">10-10-2025</p>
              <CardDescription>Disbursement on</CardDescription>
            </CardContent>
            <CardContent>
              <Badge className="bg-green-200 text-green-800">Complete</Badge>
              <CardDescription>Disbursement Status</CardDescription>
            </CardContent>
          </div>
        </Card>
        <DataCard className="mt-2" title="Total Disburse Amount" number={'0'} />
        <DataCard className="mt-2" title="Total Beneficiaries" number={'0'} />
        <DataCard className="mt-2" title="Disbursement Type" number={'0'} />
      </div>
      <div className="mt-2 w-full">
        <Tabs defaultValue="transactions">
          <div className="flex justify-between items-center">
            <Card className="rounded h-14 w-full mr-2 flex items-center justify-between">
              <TabsList className="gap-2">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="referrals">Approvals</TabsTrigger>
              </TabsList>
            </Card>
          </div>
          <TabsContent value="transactions">
            <TransactionTable />
          </TabsContent>
          <TabsContent value="referrals">
            <ApprovalTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
