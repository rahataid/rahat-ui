import {
  useGetOfflineSingleVendor,
  useKenyaVendorTransactions,
  useProjectStore,
  useRemoveVendor,
  useVendorBeneficiary,
} from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import { Copy, CopyCheck, Store, User } from 'lucide-react';
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

  const phone = decodeURIComponent(searchParams.get('phone') || '');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const vendorWallet = searchParams.get('walletAddress') || '';
  const vendorId = searchParams.get('vendorId');
  const vendorUUID = searchParams.get('vendorUUID') as UUID;
  const voucherReedeemed = searchParams.get('voucherReedeemed');

  // const projectClosed = useProjectStore(
  //   (state) => state.singleProject?.projectClosed,
  // );

  const { data, isLoading: isVendorLoading } = useVendorBeneficiary(
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
          path={`/projects/sms-voucher/${id}/vendors`}
        />
      </div>

      {/* Responsive Grid Layout */}
      <div className="p-5 rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <div className="border rounded-sm shadow flex items-center gap-4 p-5">
          <div className="rounded-full h-8 w-8 flex items-center justify-center">
            <Store />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => clickToCopy(vendorWallet)}
            >
              <p className="text-muted-foreground">
                {truncateEthAddress(vendorWallet.trimEnd())}
              </p>
              {walletAddressCopied === vendorWallet ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </div>
            <p className="font-medium text-muted-foreground">{phone}</p>
            <p className="font-medium text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="border rounded-sm shadow flex flex-col justify-between gap-2 p-5">
          <p className="font-medium">Voucher Redeemed</p>
          <p className="text-4xl font-semibold text-primary truncate w-full sm:w-52">
            {voucherReedeemed}
          </p>
        </div>
      </div>

      {/* Tabs - Scrollable on Mobile */}
      <Tabs defaultValue="transactionHistory">
        <TabsList className="border bg-secondary rounded mb-2 flex">
          <TabsTrigger
            className="w-full min-w-[140px] text-center data-[state=active]:bg-white"
            value="transactionHistory"
          >
            Transaction History
          </TabsTrigger>
          <TabsTrigger
            className="w-full min-w-[140px] text-center data-[state=active]:bg-white"
            value="beneficiaryList"
          >
            Consumer List
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
            beneficiaryList={[...(data?.beneficiaryRedemption || [])]}
            loading={isVendorLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
