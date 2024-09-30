import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
type Step3AssignAmountProps = {
  form: UseFormReturn<z.infer<any>>;
  setCurrentStep: (currentStep: number) => void;
  currentStep: number;
  benGroups: any;
};

export default function Step3AssignAmount({
  form,
  setCurrentStep,
  currentStep,
  benGroups,
}: Step3AssignAmountProps) {
  const selectedDisbursement = form.getValues('disbursements');
  const groupIds = form.getValues('groupIds') || [];

  let selectedBenificiries = selectedDisbursement?.length || 0;
  if (!selectedDisbursement || selectedDisbursement.length === 0) {
    benGroups.map((group: any) => {
      if (groupIds.includes(group.uuid)) {
        selectedBenificiries += group._count.groupedBeneficiaries;
      }
    });
  }
  return (
    <div className="bg-card rounded-lg m-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => setCurrentStep(currentStep - 1)}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            Assign Amount
          </h1>
        </div>
        <p className="text-gray-500 font-normal text-base">
          The amount that you want to assign to the vendor
        </p>
      </div>
      <div>
        <div className="w-full bg-gray-50 rounded-md shadow-sm mt-6 p-4">
          <div className="pb-2">
            <div className="text-gray-800 text-base	font-semibold">
              Beneficiaries
            </div>
          </div>
          <div>
            <a href="#" className={cn('text-blue-600 hover:underline text-sm')}>
              {selectedBenificiries} beneficiaries selected
            </a>
          </div>
        </div>
      </div>
      {/* <div className="w-full mt-4">
        <Label className="text-gray-700">No. of Tokens</Label>
        <Input
          className="mt-1 w-full border rounded-md shadow-sm text-sm"
          placeholder="Enter no. of tokens"
        />
      </div> */}
    </div>
  );
}
