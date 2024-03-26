'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import DataCard from '../../../../components/dataCard';
import VendorTxnList from '../../../vendors/vendors.txn.list';
import ReferralTable from '../../../vendors/vendors.referral.table';
import VendorsInfo from '../../../vendors/vendors.info';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useParams } from 'next/navigation';

export default function VendorsDetailPage() {
  const { uuid: walletAddress } = useParams();
  console.log({ walletAddress });
  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2 mx-2">
        <DataCard
          className="mt-2"
          title="Free Vouchers Redeemed"
          number={'12'}
          subTitle="Free Vouchers"
        />
        <DataCard
          className="mt-2"
          title="Discount Voucher Redeemed"
          number={'12'}
          subTitle="Discount Vouchers"
        />
        <DataCard
          className="mt-2"
          title="Referrals"
          number={'12'}
          subTitle="Beneficiaries"
        />
        <VendorsInfo />
      </div>
      <div className="mt-2 mx-2">
        <Tabs defaultValue="transactions" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="w-1/3 gap-14">
              <TabsTrigger value="transactions">
                Transaction History
              </TabsTrigger>
              <TabsTrigger value="referrals">Referrals List</TabsTrigger>
            </TabsList>
            <div>
              <Button>Assign Voucher</Button>
            </div>
          </div>
          <TabsContent value="transactions">
            <VendorTxnList walletAddress={walletAddress} />
          </TabsContent>
          <TabsContent value="referrals">
            <ReferralTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
