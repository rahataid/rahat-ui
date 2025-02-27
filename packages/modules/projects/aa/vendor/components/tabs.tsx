import React from 'react';
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
} from 'libs/shadcn/src/components/ui/tabs';
import VendorsTransactionsHistory from '../tables/transactions.history';
import VendorsBeneficiaryList from '../tables/beneficiary.table';

export default function VendorDetailsTabs() {
  return (
    <div className="rounded-md p-4 border">
      <Tabs defaultValue="transactionHistory">
        <TabsList className="border bg-secondary rounded mb-2">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="transactionHistory"
          >
            Transaction History
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryList"
          >
            Beneficiary List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactionHistory">
          <VendorsTransactionsHistory tableData={[]} loading={false} />
        </TabsContent>
        <TabsContent value="beneficiaryList">
          <VendorsBeneficiaryList beneficiaryList={[]} loading={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
