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
import { Check } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function VendorsDetail() {
  const { id } = useParams();
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Vendor details"
          subtitle="Here is the detailed view of selected vendor"
          path={`/projects/el-kenya/${id}/vendors`}
        />
        <Button variant="outline" className="border-primary text-primary px-8">
          Approve
          <Check className="ml-2" size={16} />
        </Button>
      </div>
      <div className="p-5 rounded border grid grid-cols-4 gap-5 mb-5">
        <div>
          <h1 className="text-md text-muted-foreground">Vendor Name</h1>
          <p className="font-medium">John Doe</p>
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
          <p className="font-medium">4567876545</p>
        </div>
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
          <TransactionHistoryView />
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
