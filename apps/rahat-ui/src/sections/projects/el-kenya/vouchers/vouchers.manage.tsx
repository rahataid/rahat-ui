import { Ticket } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import { useParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import BeneficiaryView from './beneficiary.view';
import BeneficiaryGroupsView from './beneficiary.groups.view';
import DataCard from 'apps/rahat-ui/src/components/dataCard';

export default function VouchersManage() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <HeaderWithBack
        title="Create Voucher Disbursement"
        path={`/projects/el-kenya/${id}/vouchers`}
        subtitle="Create a disbursement plan"
      />
      <DataCard
        className="border-solid rounded-sm w-96 mb-10"
        title="Voucher Balance"
        Icon={Ticket}
        number="1439"
      />
      <Tabs defaultValue="beneficiary">
        <TabsContent value="beneficiary">
          <div className="pl-4">
            <h1 className=" font-semibold text-xl ">Beneficiary</h1>
            <p className="text-muted-foreground text-base">
              List of all the beneficiaries assigned to the vendors
            </p>
          </div>
        </TabsContent>
        <TabsContent value="beneficiaryGroups">
          <div className="pl-4">
            <h1 className=" font-semibold text-xl ">Beneficiary Groups</h1>
            <p className="text-muted-foreground text-base">
              List of all the beneficiaries groups assigned to the vendors
            </p>
          </div>
        </TabsContent>
        <div className="flex justify-between items-center p-4">
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="beneficiary"
            >
              Beneficiary
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="beneficiaryGroups"
            >
              Beneficiary Groups
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="beneficiary">
          <BeneficiaryView />
        </TabsContent>
        <TabsContent value="beneficiaryGroups">
          <BeneficiaryGroupsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
