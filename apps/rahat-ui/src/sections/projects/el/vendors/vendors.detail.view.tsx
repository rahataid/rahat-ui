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

  const handleAssignVoucher = () => {
    Swal.fire({
      title: 'Assign voucher to the vendor?',
      showCancelButton: true,
      confirmButtonText: 'Assign',
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
        <VendorsInfo vendorData={{ name, phone, vendorWallet }} />
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
              <Button onClick={handleAssignVoucher}>Assign Voucher</Button>
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
