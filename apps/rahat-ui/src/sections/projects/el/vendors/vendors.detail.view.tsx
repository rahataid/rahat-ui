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
import Swal from 'sweetalert2';
import { useAddVendors } from '../../../../hooks/el/contracts/el-contracts';
import { MS_ACTIONS } from '@rahataid/sdk';
import { PROJECT_SETTINGS } from 'apps/rahat-ui/src/constants/project.const';
import { useProjectAction } from '@rahat-ui/query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RedemptionTable from '../../../vendors/vendors.redemption.table';
import {
  useReadElProjectCheckVendorStatus,
  useReadElProjectGetVendorVoucherDetail,
} from 'apps/rahat-ui/src/hooks/el/contracts/elProject';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import AssignVoucherConfirm from './vendor.assign.confirm';
import { useWaitForTransactionReceipt } from 'wagmi';

interface IParams {
  uuid: any;
  id: string;
}

export default function VendorsDetailPage() {
  const searchParams = useSearchParams();

  const assignVendor = useBoolean();

  const handleAssignVendor = () => {
    assignVendor.onTrue();
  };

  const handleAssignVendorClose = () => {
    assignVendor.onFalse();
  };

  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const vendorWallet = searchParams.get('walletAddress');
  const vendorId = searchParams.get('vendorId');

  const { uuid: walletAddress, id: projectId } = useParams<IParams>();
  const [contractAddress, setContractAddress] = useState<any>('');
  const [isTransacting, setisTransacting] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [vendorWalletAddressCopied, setVendorWalletAddressCopied] =
  useState<boolean>(false);

  const updateVendor = useAddVendors();
  const projectClient = useProjectAction();

  const { data: vendorStatus } = useReadElProjectCheckVendorStatus({
    address: contractAddress,
    args: [walletAddress],
  });

  const result = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  const { data: vendorVoucher } = useReadElProjectGetVendorVoucherDetail({
    address: contractAddress,
    args: [walletAddress],
  });

  const clickToCopy =() =>{
    if(walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setVendorWalletAddressCopied(true)
    }
  }

  const assignVendorToProjet = async () => {
    setisTransacting(true);
    const txnHash = await updateVendor
      .writeContractAsync({
        address: contractAddress,
        args: [walletAddress, true],
      })
      .finally(() => handleAssignVendorClose());
    setTransactionHash(txnHash);
  };

  useEffect(() => {
    try {
      async function fetchData() {
        const res = await projectClient.mutateAsync({
          uuid: projectId,
          data: {
            action: MS_ACTIONS.SETTINGS.GET,
            payload: {
              name: PROJECT_SETTINGS.CONTRACTS,
            },
          },
        });
        if (res.data) {
          const { value } = res.data;
          setContractAddress(value?.elproject?.address || '');
        }
      }
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2 mx-2">
        <VendorsInfo vendorData={{ name, phone, vendorWallet,vendorWalletAddressCopied,clickToCopy }} />
        <DataCard
          className="mt-2"
          title="Free Vouchers Redeemed"
          number={vendorVoucher?.freeVoucherRedeemed?.toString() || '0'}
          subTitle="Free Vouchers"
        />
        <DataCard
          className="mt-2"
          title="Discount Voucher Redeemed"
          number={vendorVoucher?.referredVoucherRedeemed?.toString() || '0'}
          subTitle="Discount Vouchers"
        />
        <DataCard
          className="mt-2"
          title="Referrals"
          number={vendorVoucher?.beneficiaryReferred?.toString() || '0'}
          subTitle="Beneficiaries"
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
                <TabsTrigger value="redeem">Redemption List</TabsTrigger>
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
              walletAddress={walletAddress}
            />
          </TabsContent>
          <TabsContent value="redeem">
            <RedemptionTable projectId={projectId} vendorId={vendorId} />
          </TabsContent>
        </Tabs>
        <AssignVoucherConfirm
          name={name}
          open={assignVendor.value}
          handleClose={handleAssignVendorClose}
          handleSubmit={assignVendorToProjet}
        />
      </div>
    </div>
  );
}
