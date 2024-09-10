'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import VendorHeader from './vendors.detail.header';
import VendorsInfo from '../../../vendors/vendors.info';
import { useParams, useSearchParams } from 'next/navigation';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import VendorTransactionList from 'apps/rahat-ui/src/sections/vendors/vendors.txn.list';

const VendorDetail = () => {
  const searchParams = useSearchParams();
  interface IParams {
    uuid: string;
  }

  const { uuid: walletAddress } = useParams<IParams>();
  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const vendorWallet = searchParams.get('walletAddress');
  const vendorId = searchParams.get('vendorId');

  //get the vendor txn
  return (
    <div className="bg-secondary">
      <VendorHeader />
      <div className="grid md:grid-cols-2 gap-2 mx-2">
        <VendorsInfo vendorData={{ name, phone, vendorWallet, vendorStatus:true}} />
        <DataCard
          className="mt-2"
          title="Total Token Disburse"
          number="0"
          subTitle="USDT"
        />
      </div>
      <div className="mt-2 mx-2 w-full">
        <Tabs defaultValue="transactions">
          <div className="flex justify-between items-center">
            <Card className="rounded h-14 w-full mr-2 flex items-center justify-between">
              <TabsList className="gap-2">
                <TabsTrigger value="transactions">
                  Transaction History
                </TabsTrigger>
              </TabsList>
            </Card>
          </div>
          <TabsContent value="transactions">
            <VendorTransactionList walletAddress={walletAddress} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDetail;
