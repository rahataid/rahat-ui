import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import BeneficiaryView from './beneficiary.view';
import BeneficiaryGroupsView from './beneficiary.groups.view';
import { initialStepData } from './select.vendor.multi.step.form';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

interface SelectBeneficiaryProps {
  disbursmentList: [];
  benificiaryGroups: [];
  handleStepDataChange: (e) => void;
  stepData: typeof initialStepData;
  pagination: any;
  beneficiaryLoading: boolean;
}

export default function SelectBeneficiary({
  disbursmentList,
  handleStepDataChange,
  benificiaryGroups,
  stepData,
  pagination,
  beneficiaryLoading,
}: SelectBeneficiaryProps) {
  return (
    <Tabs defaultValue="beneficiary">
      <div className="flex justify-between items-center px-4">
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
        <div>
          <BeneficiaryView
            disbursmentList={disbursmentList}
            handleStepDataChange={handleStepDataChange}
            beneficiaryLoading={beneficiaryLoading}
          />
          <CustomPagination
            currentPage={pagination?.pagination?.page}
            handleNextPage={pagination?.setNextPage}
            handlePageSizeChange={pagination?.setPerPage}
            handlePrevPage={pagination?.setPrevPage}
            perPage={pagination?.pagination?.perPage}
            meta={pagination?.meta || { total: 0, currentPage: 0 }}
          />
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <BeneficiaryGroupsView
          benificiaryGroups={benificiaryGroups}
          handleStepDataChange={handleStepDataChange}
          stepData={stepData}
        />
      </TabsContent>
    </Tabs>
  );
}
