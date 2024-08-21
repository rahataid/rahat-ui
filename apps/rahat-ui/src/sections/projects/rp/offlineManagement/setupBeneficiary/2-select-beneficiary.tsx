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

type Step2SelectBeneficiaryProps = {
  disbursmentList: any;
  form: UseFormReturn<z.infer<any>>;
};

export default function Step2SelectBeneficiary({
  form,
  disbursmentList,
}: Step2SelectBeneficiaryProps) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-lg m-4 p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => router.back()}
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
            </div>
          </TabsContent>
          <TabsContent value="card">
            <ScrollArea className="h-[calc(100vh-498px)]">
              <div className="grid grid-cols-4 gap-4 m-4">
                <BeneficiaryCard />
                <BeneficiaryCard />
                <BeneficiaryCard />
                <BeneficiaryCard />
                <BeneficiaryCard />
                <BeneficiaryCard />
                <BeneficiaryCard />
                <BeneficiaryCard />
                <BeneficiaryCard />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
