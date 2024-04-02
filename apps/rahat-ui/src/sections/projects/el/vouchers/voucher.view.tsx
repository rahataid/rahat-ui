'use client'
import React from 'react';
import FreeVoucherInfo from './free.voucher.info';
import DiscountVoucherInfo from './dicount.voucher.info';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { FreeTransactionTable } from './free.transactions.table';
import { FreeHoldersTable } from './free.holder.table';
import { DiscountTransactionTable } from './discount.transactions.table';
import { DiscountHoldersTable } from './discount.holder.table';
import { useVoucherHolder } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import AddVoucher from './add.voucher';

const VoucherView = () => {

  const {data} = useVoucherHolder();
  
  return (
    <>
      <FreeVoucherInfo />
      <DiscountVoucherInfo />
      <AddVoucher />
      <div className="mt-2 mr-2 ml-2 w-full">
        <Tabs defaultValue="free">
          <div className="flex justify-between items-center">
            <Card className="rounded h-14 w-full mr-2 flex items-center justify-between">
              <TabsList className="gap-2">
                <TabsTrigger value="free">
                  <div>Free Vouchers Transaction History</div>
                </TabsTrigger>
                <TabsTrigger value="discount">
                  Discount Vouchers Transaction History
                </TabsTrigger>
              </TabsList>
            </Card>
          </div>
          <TabsContent value="free">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 h-full">
                <FreeTransactionTable  />
              </div>
              <div className="h-full">
                <FreeHoldersTable  data={data?.eyeVoucherOwners} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="discount">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <DiscountTransactionTable />
              </div>
              <div>
                <DiscountHoldersTable data={data?.referralVoucherOwners} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default VoucherView;
