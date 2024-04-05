'use client';
import React, { useEffect, useState } from 'react';
import FreeVoucherInfo from './free.voucher.info';
import DiscountVoucherInfo from './dicount.voucher.info';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { FreeTransactionTable } from './free.transactions.table';
import { FreeHoldersTable } from './free.holder.table';
import { DiscountTransactionTable } from './discount.transactions.table';
import { DiscountHoldersTable } from './discount.holder.table';
import {
  useProjectVoucher,
  useVoucherHolder,
} from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import AddVoucher from './add.voucher';
import { useParams } from 'next/navigation';

const VoucherView = () => {
  const { data } = useVoucherHolder();

  const [contractAddress, setContractAddress] = useState<any>();

  const { id } = useParams();

  const projectSettings = localStorage.getItem('projectSettingsStore');

  useEffect(() => {
    if (projectSettings) {
      const settings = JSON.parse(projectSettings)?.state?.settings?.[id];
      setContractAddress({
        el: settings?.elproject?.address,
        eyeVoucher: settings?.eyevoucher?.address,
        referredVoucher: settings?.referralvoucher?.address,
        rahatDonor: settings?.rahatdonor?.address,
      });
    }
  }, [projectSettings, id]);

  const { data: projectVoucher, isLoading } = useProjectVoucher(
    contractAddress?.el || '',
    contractAddress?.eyeVoucher || '',
  );

  return (
    <>
      {isLoading ? (
        'Loading'
      ) : (
        <>
          {projectVoucher?.freeVoucherAddress ? (
            <>
              <FreeVoucherInfo data={projectVoucher} />
              <DiscountVoucherInfo data={projectVoucher} />

              <div className="m-2">
                <Tabs defaultValue="free">
                  <TabsList className="w-full grid grid-cols-2 border h-auto">
                    <TabsTrigger value="free">
                      Free Vouchers Transaction History
                    </TabsTrigger>
                    <TabsTrigger value="discount">
                      Discount Vouchers Transaction History
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="free">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 h-full">
                        <FreeTransactionTable />
                      </div>
                      <div>
                        <FreeHoldersTable data={data?.eyeVoucherOwners} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="discount">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <DiscountTransactionTable />
                      </div>
                      <div>
                        <DiscountHoldersTable
                          data={data?.referralVoucherOwners}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <AddVoucher contractSettings={contractAddress} />
          )}
        </>
      )}
    </>
  );
};

export default VoucherView;
