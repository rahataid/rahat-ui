import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import BeneficiaryView from './beneficiary.view';
import BeneficiaryGroupsView from './beneficiary.groups.view';

export default function SelectBeneficiary() {
  return (
    <div className="p-4">
      <Tabs defaultValue="beneficiary">
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
