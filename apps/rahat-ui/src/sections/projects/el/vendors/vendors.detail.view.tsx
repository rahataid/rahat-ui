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
import { useVendorVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useSearchParams } from 'next/navigation';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';

interface IParams {
  uuid: any;
  id: string;
}

export default function VendorsDetailPage() {
  const searchParams = useSearchParams();

  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const vendorWallet = searchParams.get('walletAddress');

  const { uuid: walletAddress, id: projectId } = useParams<IParams>();
  const [contractAddress, setContractAddress] = useState<any>('');

  const updateVendor = useAddVendors(projectId, walletAddress);
  const projectClient = useProjectAction();
  const { data } = useVendorVoucher(walletAddress);

  const assignVendorToProjet = async () => {
    return updateVendor.writeContractAsync({
      address: walletAddress,
      args: [contractAddress, true],
    });
  };

  const handleApproveVendor = () => {
    Swal.fire({
      title: 'Approve vendor?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) return assignVendorToProjet();
    });
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2 mx-2">
        <VendorsInfo vendorData={{ name, phone, vendorWallet }} />
        <DataCard
          className="mt-2"
          title="Free Vouchers Redeemed"
          number={data?.voucherDetailsByVendor?.freeVoucherRedeemed || '0'}
          subTitle="Free Vouchers"
        />
        <DataCard
          className="mt-2"
          title="Referred Voucher Redeemed"
          number={data?.voucherDetailsByVendor?.referredVoucherRedeemed || '0'}
          subTitle="Discount Vouchers"
        />
        <DataCard
          className="mt-2"
          title="Referrals"
          number={data?.voucherDetailsByVendor?.beneficiaryReferred || '0'}
          subTitle="Beneficiaries"
        />
      </div>
      <Tabs defaultValue="transactions" className="ml-2">
        <Card className="my-2 mr-2 rounded">
          <div className="flex h-14 items-center justify-between">
            <TabsList className="gap-14">
              <TabsTrigger value="transactions">
                Transaction History
              </TabsTrigger>
              <TabsTrigger value="referrals">Referrals List</TabsTrigger>
            </TabsList>
            <div>
              <Button className="h-1/2 mr-3" onClick={handleApproveVendor}>
                Approve Vendor
              </Button>
            </div>
          </div>
        </Card>
        <TabsContent value="transactions">
          <VendorTxnList walletAddress={walletAddress} />
        </TabsContent>
        <TabsContent value="referrals">
          <ReferralTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
