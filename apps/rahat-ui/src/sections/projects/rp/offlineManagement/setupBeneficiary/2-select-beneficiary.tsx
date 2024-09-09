import { ArrowLeft, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SelectBeneficiaryTable } from './select.beneficiary.table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';

import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import BeneficiaryCard from './select.beneficiary.card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useBeneficiaryStore } from '@rahat-ui/query';

type Step2SelectBeneficiaryProps = {
  disbursmentList: any;
  benificiaryGroups: any;
  form: UseFormReturn<z.infer<any>>;
  setCurrentStep: (currentStep: number) => void;
  currentStep: number;
  pagination: any;
};

export default function Step2SelectBeneficiary({
  form,
  benificiaryGroups,
  disbursmentList,
  setCurrentStep,
  currentStep,
  pagination,
}: Step2SelectBeneficiaryProps) {
  const router = useRouter();
  const meta = useBeneficiaryStore((state) => state.meta);

  const handleGroupChecked = (value: boolean, uuid: string) => {
    if (value) {
      const groupIds = form.getValues('groupIds') || [];
      const idExist = groupIds.includes(uuid);
      if (!idExist) {
        form.setValue('groupIds', [...groupIds, uuid]);
      }
    } else {
      const groupIds = form.getValues('groupIds') || [];
      const filteredValue = groupIds.filter((id: string) => id !== uuid);
      form.setValue('groupIds', filteredValue);
    }
  };
  return (
    <div className="bg-card rounded-lg m-4 p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => setCurrentStep(currentStep - 1)}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            Select Beneficiary
          </h1>
        </div>
        <p className="text-gray-500 font-normal text-base">
          Here is the detailed view of the vendor
        </p>
      </div>
      <div>
        <Tabs defaultValue="list" className="w-full mt-4 mb-4">
          <div className="p-2 border rounded-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Beneficiaries</TabsTrigger>
              <TabsTrigger value="card">Beneficiary Group</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="list">
            <div>
              <SelectBeneficiaryTable
                disbursmentList={disbursmentList}
                form={form}
              />
              <CustomPagination
                currentPage={pagination?.pagination.page}
                handleNextPage={pagination?.setNextPage}
                handlePageSizeChange={pagination?.setPerPage}
                handlePrevPage={pagination?.setPrevPage}
                perPage={pagination?.pagination.perPage}
                meta={pagination?.meta || { total: 0, currentPage: 0 }}
              />
            </div>
          </TabsContent>
          <TabsContent value="card">
            <ScrollArea className="h-[calc(100vh-498px)]">
              <div className="grid grid-cols-4 gap-4 m-4">
                {benificiaryGroups.map((group: any) => {
                  return (
                    <BeneficiaryCard
                      name={group.name}
                      uuid={group.uuid}
                      totalBeneficiary={group._count.groupedBeneficiaries}
                      handleGroupChecked={handleGroupChecked}
                    />
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
