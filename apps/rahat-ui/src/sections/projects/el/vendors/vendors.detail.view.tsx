'use client';

import { PROJECT_SETTINGS_KEYS, useProjectAction, useProjectSettingsStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { MS_ACTIONS } from '@rahataid/sdk';
import { PROJECT_SETTINGS } from 'apps/rahat-ui/src/constants/project.const';
import {
  useReadElProjectCheckVendorStatus,
  useReadElProjectGetVendorVoucherDetail,
} from 'apps/rahat-ui/src/hooks/el/contracts/elProject';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import DataCard from '../../../../components/dataCard';
import { useAddVendors } from '../../../../hooks/el/contracts/el-contracts';
import VendorsInfo from '../../../vendors/vendors.info';
import RedemptionTable from '../../../vendors/vendors.redemption.table';
import ReferralTable from '../../../vendors/vendors.referral.table';
import VendorTxnList from './vendors.txn.list';
import AssignVoucherConfirm from './vendor.assign.confirm';

interface IParams {
  uuid: any;
  id: string;
}

export default function VendorsDetailPage() {
  const searchParams = useSearchParams();

  const assignVendor = useBoolean(false);

  const handleAssignVendor = () => {
     assignVendor.onTrue()
  };

  const handleAssignVendorClose = () => {
    assignVendor.onFalse();
  };

 

  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const vendorWallet = searchParams.get('walletAddress');
  const vendorId = searchParams.get('vendorId');

  const { uuid: walletAddress, id: projectId } = useParams<IParams>();
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [vendorWalletAddressCopied, setVendorWalletAddressCopied] =
    useState<boolean>(false);


  const updateVendor = useAddVendors();

  const contractSettings = useProjectSettingsStore(
    (state) =>state.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null
  )

  const { data: vendorStatus, refetch } = useReadElProjectCheckVendorStatus({
    address: contractSettings?.elproject?.address,
    args: [walletAddress],
  });



  const { data: vendorVoucher } = useReadElProjectGetVendorVoucherDetail({
    address: contractSettings?.elproject?.address,
    args: [walletAddress],
  });

  const clickToCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setVendorWalletAddressCopied(true);
    }
  };

  const assignVendorToProjet = async () => {
    const txnHash = await updateVendor
      .writeContractAsync({
        address: contractSettings?.elproject?.address,
        args: [walletAddress, true],
      })
      .finally(() => {
        handleAssignVendorClose();
        refetch();
      });
    setTransactionHash(txnHash);
  };

  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2 mx-2">
        <VendorsInfo
          vendorData={{
            name,
            phone,
            vendorWallet,
            vendorWalletAddressCopied,
            vendorStatus: vendorStatus || false,
            clickToCopy,
          }}
        />
        <DataCard
          className="mt-2"
          title="Free Vouchers Redeemed"
          number={vendorVoucher?.freeVoucherRedeemed?.toString() || '0'}
        />
        <DataCard
          className="mt-2"
          title="Discount Voucher Redeemed"
          number={vendorVoucher?.referredVoucherRedeemed?.toString() || '0'}
        />
        <DataCard
          className="mt-2"
          title="No. of Referrals"
          number={vendorVoucher?.beneficiaryReferred?.toString() || '0'}
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
                <TabsTrigger value="referrals">Referrals List</TabsTrigger>
                <TabsTrigger value="redeem">Claims List</TabsTrigger>
              </TabsList>
              {vendorStatus === false && (
                <div>
                  <Button className="mr-3 h-1/2" onClick={handleAssignVendor}>
                    Approve Vendor
                  </Button>
                </div>
              )}
            </Card>
          </div>
          <TabsContent value="transactions">
            <VendorTxnList walletAddress={walletAddress} />
          </TabsContent>
          <TabsContent value="referrals">
            <ReferralTable
              name={name}
              projectId={projectId}
              vendorId={vendorId}
            />
          </TabsContent>
          <TabsContent value="redeem">
            <RedemptionTable projectId={projectId} vendorId={vendorId} />
          </TabsContent>
        </Tabs>
        <AssignVoucherConfirm
          name={name || ''}
          open={assignVendor.value}
          handleClose={handleAssignVendorClose}
          handleSubmit={assignVendorToProjet}
        />
      </div>
    </div>
  );
}
