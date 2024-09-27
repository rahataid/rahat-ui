import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import BeneficiaryView from './beneficiary.view';
import BeneficiaryGroupsView from './beneficiary.groups.view';
import { initialStepData } from './select.vendor.multi.step.form';

interface SelectBeneficiaryProps {
  disbursmentList: [];
  benificiaryGroups: [];
  handleStepDataChange: (e) => void;
  stepData: typeof initialStepData;
}

export default function SelectBeneficiary({
  disbursmentList,
  handleStepDataChange,
  benificiaryGroups,
  stepData,
}: SelectBeneficiaryProps) {
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
          <BeneficiaryView
            disbursmentList={disbursmentList}
            handleStepDataChange={handleStepDataChange}
          />
        </TabsContent>
        <TabsContent value="beneficiaryGroups">
          <BeneficiaryGroupsView
            benificiaryGroups={benificiaryGroups}
            handleStepDataChange={handleStepDataChange}
            stepData={stepData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
