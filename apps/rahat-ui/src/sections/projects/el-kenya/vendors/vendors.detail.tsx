import {
  useGetOfflineSingleVendor,
  useKenyaVendorTransactions,
  useProjectStore,
  useRemoveVendor,
} from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import { Copy, CopyCheck } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import HeaderWithBack from '../../components/header.with.back';
import VendorsBeneficiaryList from './vendors.beneficiary.list';
import VendorsTransactionsHistory from './vendors.transactions.history';
import EditButton from 'apps/rahat-ui/src/components/edit.btn';
import DeleteButton from 'apps/rahat-ui/src/components/delete.btn';

export default function VendorsDetail() {
  const { id } = useParams() as { id: UUID };
  const searchParams = useSearchParams();
  const router = useRouter();

  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const vendorWallet = searchParams.get('walletAddress') || '';
  const vendorId = searchParams.get('vendorId');
  const vendorUUID = searchParams.get('vendorUUID') as UUID;

  const projectClosed = useProjectStore(
    (state) => state.singleProject?.projectClosed,
  );

  const { data, isLoading: isVendorLoading } = useGetOfflineSingleVendor(
    id,
    Number(vendorId),
  );

  const removeVendor = useRemoveVendor();

  const { data: vendorTransactions, isFetching: isLoading } =
    useKenyaVendorTransactions(vendorWallet);

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };

  const deleteVendor = async () => {
    await removeVendor.mutateAsync({ vendorId: vendorUUID, projectId: id });
    router.push(`/projects/el-kenya/${id}/vendors`);
  };
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Vendor details"
          subtitle="Here is the detailed view of selected vendor"
          path={`/projects/el-kenya/${id}/vendors`}
        />
        <div
          className={`flex space-x-2 ${
            projectClosed && 'pointer-events-none opacity-70'
          }`}
        >
          <EditButton
            className="border-none bg-sky-50 shadow-none"
            path={`/projects/el-kenya/${id}/vendors/${vendorUUID}/edit`}
            disabled={projectClosed}
          />
          <DeleteButton
            className="border-none bg-red-100 shadow-none"
            name="vendor"
            handleContinueClick={deleteVendor}
            disabled={projectClosed}
          />
        </div>
      </div>
      <div className="p-5 rounded border grid grid-cols-4 gap-5 mb-5">
        <div>
          <h1 className="text-md text-muted-foreground">Vendor Name</h1>
          <p className="font-medium">{name}</p>
        </div>
        {/* <div>
          <h1 className="text-md text-muted-foreground">Location</h1>
          <p className="font-medium">N/A</p>
        </div> */}
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{phone || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy(vendorWallet)}
          >
            <p>{truncateEthAddress(vendorWallet.trimEnd())}</p>
            {walletAddressCopied === vendorWallet ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
      </div>
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
          <VendorsTransactionsHistory
            tableData={vendorTransactions}
            loading={isLoading}
          />
        </TabsContent>
        <TabsContent value="beneficiaryList">
          <VendorsBeneficiaryList
            beneficiaryList={[
              ...(data?.data || []),
              ...(data?.extras?.BeneficiaryRedemption || []),
            ]}
            loading={isVendorLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
