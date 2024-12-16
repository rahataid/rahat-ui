import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import TransactionHistoryView from './transaction.history.view';
import ConversionListView from './conversion.list.view';
import HealthWorkersView from './health.workers.view';
import { Check, Copy, CopyCheck, User } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React from 'react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { DialogComponent } from '../../../../components/dialog';
import { useCambodiaVendorGet, useCambodiaVendorsStats } from '@rahat-ui/query';

export default function VendorsDetail() {
  const { id, vendorId } = useParams();
  const { data } = useCambodiaVendorGet({ projectUUID: id, vendorId }) as any;
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<number>();
  const { data: vendorsStats } = useCambodiaVendorsStats({
    projectUUID: id,
    vendorId,
  }) as any;

  const clickToCopy = (walletAddress: string, id: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(id);
  };

  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={data?.data?.User?.name}
          subtitle="Here is the detailed view of selected vendor"
          path={`/projects/el-cambodia/${id}/vendors`}
        />
        {/* <DialogComponent
          trigger={
            <Button
              variant="outline"
              className="border-primary text-primary px-8"
            >
              Approve
              <Check className="ml-2" size={16} />
            </Button>
          }
          title="Are you sure you want to approve the Vision Center?"
          subtitle="This action cannot be undone once you confirm"
          onCancel={() => console.log('cancel')}
          onSubmit={() => console.log('submit')}
        /> */}
      </div>
      <div className="flex space-x-4 mb-4">
        <DataCard
          className="w-full border-solid rounded-md"
          title="Villagers Referred"
          Icon={User}
          number={vendorsStats?.data?.leadsRecieved}
        />
        <DataCard
          className="w-full border-solid rounded-md"
          title="Eye Checkup in VC"
          Icon={User}
          number={vendorsStats?.data?.leadsConverted}
        />
        <DataCard
          className="w-full border-solid rounded-md"
          title="Eyewear dispensed in VC"
          Icon={User}
          number={vendorsStats?.data?.footfalls}
        />
        {/* <DataCard
          className="w-full border-solid rounded-md"
          title="Sales"
          Icon={User}
          number={vendorsStats?.data?.sales}
        /> */}
      </div>
      <div className="p-5 rounded border grid grid-cols-3 gap-5 mb-5">
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() =>
              clickToCopy(`${data?.data?.User?.wallet}`, data?.User?.wallet)
            }
          >
            <p>{truncateEthAddress(data?.data?.User?.wallet)}</p>
            {walletAddressCopied ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{data?.data?.User?.phone}</p>
        </div>
        {/* <div>
          <h1 className="text-md text-muted-foreground">Status</h1>
          <Badge>Not Approved</Badge>
        </div> */}
      </div>
      <Tabs defaultValue="transactionHistory">
        <TabsList className="border bg-secondary rounded mb-4">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="transactionHistory"
          >
            Transaction History
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="conversionList"
          >
            Conversion List
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="healthWorkers"
          >
            Health Workers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactionHistory">
          <TransactionHistoryView vendorAddress={data?.data?.User?.wallet} />
        </TabsContent>
        <TabsContent value="conversionList">
          <ConversionListView />
        </TabsContent>
        <TabsContent value="healthWorkers">
          <HealthWorkersView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
