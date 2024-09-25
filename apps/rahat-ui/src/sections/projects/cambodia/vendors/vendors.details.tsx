import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import Back from '../../components/back';
// import VendorsTransactionsHistory from './vendors.transactions.history';
// import VendorsBeneficiaryList from './vendors.beneficiary.list';
import { useParams } from 'next/navigation';

export default function VendorsDetail() {
  const { id } = useParams();
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex space-x-3 mb-10">
        <Back path={`/projects/el-kenya/${id}/vendors`} />
        <div>
          <h1 className="text-2xl font-semibold">Vendor details</h1>
          <p className=" text-muted-foreground">
            Here is the detailed view of selected vendor
          </p>
        </div>
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
        <TabsList>
          <TabsTrigger value="transactionHistory">
            Transaction History
          </TabsTrigger>
          <TabsTrigger value="beneficiaryList">Beneficiary List</TabsTrigger>
        </TabsList>
        <TabsContent value="transactionHistory">
          {/* <VendorsTransactionsHistory /> */}
        </TabsContent>
        <TabsContent value="beneficiaryList">
          {/* <VendorsBeneficiaryList /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
