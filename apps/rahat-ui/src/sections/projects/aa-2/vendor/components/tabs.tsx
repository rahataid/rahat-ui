import { useTranslations } from 'next-intl';
import React from 'react';
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
} from 'libs/shadcn/src/components/ui/tabs';
import VendorsTRANSACTIONSHistory from '../tables/transactions.history';
import VendorsBeneficiaryList from '../tables/beneficiary.table';
import { useGetTxnRedemptionRequestList } from '@rahat-ui/query';

export default function VendorDetailsTabs() {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="rounded-md p-4 border">
      <Tabs defaultValue="transactionHistory">
        <TabsList className="border bg-secondary rounded mb-2">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="transactionHistory"
          >
            {t('TRANSACTION_HISTORY')}
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryList"
          >
            {t('BENEFICIARY_LIST')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactionHistory">
          <VendorsTRANSACTIONSHistory />
        </TabsContent>
        <TabsContent value="beneficiaryList">
          <VendorsBeneficiaryList beneficiaryList={[]} loading={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
