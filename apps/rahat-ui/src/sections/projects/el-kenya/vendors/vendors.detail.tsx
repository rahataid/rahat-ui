import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import Back from '../../components/back';
import VendorsTransactionsHistory from './vendors.transactions.history';
import VendorsBeneficiaryList from './vendors.beneficiary.list';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { Copy, CopyCheck } from 'lucide-react';
import HeaderWithBack from '../../components/header.with.back';
import EditButton from '../../components/edit.btn';
import DeleteButton from '../../components/delete.btn';

export default function VendorsDetail() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const vendorWallet = searchParams.get('walletAddress') || '';
  const vendorId = searchParams.get('vendorId');

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Vendor details"
          subtitle="Here is the detailed view of selected vendor"
          path={`/projects/el-kenya/${id}/vendors`}
        />
        <div className="flex space-x-2">
          <EditButton className="border-none bg-sky-50 shadow-none" path="" />
          <DeleteButton
            className="border-none bg-red-100 shadow-none"
            name="vendor"
            handleContinueClick={() => {}}
          />
        </div>
      </div>
      <div className="p-5 rounded border grid grid-cols-4 gap-5 mb-5">
        <div>
          <h1 className="text-md text-muted-foreground">Vendor Name</h1>
          <p className="font-medium">{name}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Location</h1>
          <p className="font-medium">Karnali</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">+9779876543210</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy(vendorWallet)}
          >
            <p>{truncateEthAddress(vendorWallet)}</p>
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
          <VendorsTransactionsHistory />
        </TabsContent>
        <TabsContent value="beneficiaryList">
          <VendorsBeneficiaryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
